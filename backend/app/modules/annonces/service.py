from uuid import UUID

from app.modules.annonces.model import Annonce, AnnonceStatut
from app.modules.annonces.repository import AnnonceLectureRepository, AnnonceRepository
from app.modules.annonces.schema import AnnonceCreate, LecteurStats
from app.modules.users.model import UserRole, User
from app.modules.users.repository import UserRepository
from fastapi import HTTPException, status


class AnnonceService:
    def __init__(
        self,
        repo: AnnonceRepository,
        lecture_repo: AnnonceLectureRepository,
        user_repo: UserRepository,
    ):
        self.repo = repo
        self.lecture_repo = lecture_repo
        self.user_repo = user_repo

    # Utilitaire
    def _peut_gerer_annonce(self, annonce: Annonce, current_user: User) -> bool:
        if current_user.role == UserRole.admin:
            return True
        if current_user.role == UserRole.moderator:
            return annonce.classe_id == current_user.classe_id
        return False

    async def _get_annonce_or_404(self, annonce_id: UUID) -> Annonce:
        annonce = await self.repo.get_by_id(annonce_id)
        if annonce is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Annonce not found")
        return annonce

    # Creation
    async def create_annonce(
        self, request: AnnonceCreate, current_user: User, classe_id: UUID | None = None
    ) -> Annonce:
        if current_user.role == UserRole.student:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Acces refusé")

        # Un modérateur ne choisit jamais classe_id lui-même : c'est toujours SA classe.
        if current_user.role == UserRole.moderator:
            classe_id = current_user.classe_id

        data = {
            "titre": request.titre,
            "contenu": request.contenu,
            "important": request.important,
            "classe_id": classe_id,
            "auteur_id": current_user.id,
        }
        return await self.repo.create(data)

    # lecture et consultation
    async def get_annonce_by_id(self, annonce_id: UUID, current_user: User) -> Annonce:
        annonce = await self._get_annonce_or_404(annonce_id)

        # Marque automatiquement l'annonces comme lue par l'utilisateur qui la consulte.
        if not await self.lecture_repo.exists(annonce_id, current_user.id):
            await self.lecture_repo.create(
                {"annonce_id": annonce_id, "user_id": current_user.id}
            )

        return annonce

    async def get_active_for_user(self, current_user: User) -> list[Annonce]:
        """Étudiant/modérateur : annonces actives de sa classe + globales.
        Admin : toutes les annonces actives."""
        if current_user.role == UserRole.admin:
            return await self.repo.get_active()
        return await self.repo.get_active_by_classe(current_user.classe_id)

    async def all_archive(self, current_user: User) -> list[Annonce]:
        if current_user.role not in (UserRole.moderator, UserRole.admin):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Acces refusé")
        return await self.repo.get_archive()

    # Gestion des annonces
    async def archive_annonce(self, annonce_id: UUID, current_user: User) -> Annonce:
        annonce = await self._get_annonce_or_404(annonce_id)

        if annonce.statut == AnnonceStatut.archivee:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Annonce already archived")

        if not self._peut_gerer_annonce(annonce, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Acces refusé")

        return await self.repo.update(annonce, {"statut": AnnonceStatut.archivee})

    # Suive de lecture
    async def get_lecteur_stats(
        self, annonce_id: UUID, current_user: User
    ) -> LecteurStats:
        annonce = await self._get_annonce_or_404(annonce_id)

        if not self._peut_gerer_annonce(annonce, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Acces refusé")

        # Le public visé : les étudiants de la classe ciblée (ou tout le monde si annonces globale).
        if annonce.classe_id is not None:
            etudiants = await self.user_repo.get_all_student(annonce.classe_id)
        else:
            etudiants = await self.user_repo.list_all()

        lecteur_ids = set(await self.lecture_repo.get_lecteur_ids(annonce_id))
        non_lecteurs = [u.id for u in etudiants if u.id not in lecteur_ids]

        return LecteurStats(
            total_etudiants=len(etudiants),
            total_lu=len(lecteur_ids),
            non_lecteurs_ids=non_lecteurs,
        )
