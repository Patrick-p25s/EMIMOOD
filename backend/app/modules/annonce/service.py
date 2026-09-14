from uuid import UUID

from app.modules.annonce.model import Annonce, AnnonceStatut
from app.modules.annonce.repository import AnnonceLectureRepository, AnnonceRepository
from app.modules.annonce.schema import (
    AnnonceCreate,
    LecteurStats,
    LectureOut,
    AnnonceUpdate,
)
from app.modules.users.model import UserRole, Users
from app.modules.users.repository import UserRepository
from app.core.pagination import Page, PaginationParams, make_page
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
    def _peut_gerer_annonce(self, annonce: Annonce, current_user: Users) -> bool:
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

    async def get_all_announce(self, current_user: Users, params: PaginationParams):
        annonces, total = await self.repo.get_all_annonces(
            current_user.classe_id, params.offset, params.limit
        )
        return make_page(annonces, total, params)

    async def update_annonces(self, id: str, data: AnnonceUpdate, current_user: Users):
        annonce = await self.get_annonce_by_id(id, current_user)
        return await self.repo.update(
            annonce,
            {"titre": data.titre, "contenu": data.contenu, "important": data.important},
        )

    # async def get_anonce_by_id(self, current_user: Users, id: str):
    #     annonce = self._get_annonce_or_404(id)
    #     if (
    #         current_user.role != UserRole.admin
    #         and annonce.classe_id is not None
    #         and annonce.classe_id != current_user.classe_id
    #     ):
    #         raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")

    #     if annonce.statut == AnnonceStatut.archivee and current_user.role not in (
    #         UserRole.admin,
    #         UserRole.moderator,
    #     ):
    #         raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")

    #     return annonce

    async def is_read(self, current_user: Users, id: str) -> LectureOut:
        exists = await self.lecture_repo.exists(id, current_user.id)
        if exists:
            return True
        return False

    # Creation
    async def create_annonce(
        self, request: AnnonceCreate, current_user: Users, classe_id: UUID | None = None
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
    async def get_annonce_by_id(
        self, annonce_id: UUID, current_user: Users
    ) -> LectureOut:
        annonce = await self._get_annonce_or_404(annonce_id)
        if (
            current_user.role != UserRole.admin
            and annonce.classe_id is not None
            and annonce.classe_id != current_user.classe_id
        ):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")

        if annonce.statut == AnnonceStatut.archivee and current_user.role not in (
            UserRole.admin,
            UserRole.moderator,
        ):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")

        # Marque automatiquement l'annonce comme lue par l'utilisateur qui la consulte.
        if not await self.lecture_repo.exists(annonce_id, current_user.id):
            await self.lecture_repo.create(
                {"annonce_id": annonce_id, "user_id": current_user.id}
            )

        return annonce

    async def list_active_for_user(
        self, current_user: Users, params: PaginationParams
    ) -> Page:
        classe_id = (
            None if current_user.role == UserRole.admin else current_user.classe_id
        )
        annonces, total = await self.repo.list_by_status(
            AnnonceStatut.active, classe_id, params.offset, params.limit
        )
        return make_page(annonces, total, params)

    async def list_archived(
        self, current_user: Users, params: PaginationParams
    ) -> Page:
        if current_user.role not in (UserRole.moderator, UserRole.admin):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Acces refusé")
        classe_id = (
            None if current_user.role == UserRole.admin else current_user.classe_id
        )
        annonces, total = await self.repo.list_by_status(
            AnnonceStatut.archivee, classe_id, params.offset, params.limit
        )
        return make_page(annonces, total, params)

    # Gestion des annonces
    async def archive_annonce(self, annonce_id: UUID, current_user: Users) -> Annonce:
        annonce = await self._get_annonce_or_404(annonce_id)

        if annonce.statut == AnnonceStatut.archivee:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Annonce already archived")

        if not self._peut_gerer_annonce(annonce, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Acces refusé")

        return await self.repo.update(annonce, {"statut": AnnonceStatut.archivee})

    async def delete_annonce(self, id: str, current_user: Users) -> bool:
        annonce = await self.get_annonce_by_id(id, current_user)
        return await self.repo.delete(annonce)

    # Suive de lecture
    async def get_lecteur_stats(
        self, annonce_id: UUID, current_user: Users
    ) -> LecteurStats:
        annonce = await self._get_annonce_or_404(annonce_id)

        if not self._peut_gerer_annonce(annonce, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Acces refusé")

        # Le public visé : les étudiants de la classe ciblée (ou tout le monde si annonce globale).
        if annonce.classe_id is not None:
            etudiant_ids = await self.user_repo.list_student_ids(annonce.classe_id)
        else:
            etudiant_ids = await self.user_repo.list_student_ids()

        lecteur_ids = set(await self.lecture_repo.get_lecteur_ids(annonce_id))
        non_lecteurs = [
            user_id for user_id in etudiant_ids if user_id not in lecteur_ids
        ]

        return LecteurStats(
            total_etudiants=len(etudiant_ids),
            total_lu=len(lecteur_ids),
            non_lecteurs_ids=non_lecteurs,
        )
