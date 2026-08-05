from uuid import UUID

from app.documents.model import Document, DocumentStatus, DocumentType
from app.documents.repository import DocumentRepository
from app.documents.schema import DocumentCreate
from app.documents.storage import save_upload_file
from app.matiere.repository import SubjectRepository
from app.sauvegarde.repository import SauvegardeRepository
from app.users.model import Users, UserRole
from fastapi import HTTPException, UploadFile, status


class DocumentService:
    """Service gérant la logique métier des documents (création, consultation, modération et sauvegardes)."""

    def __init__(
        self,
        document_repo: DocumentRepository,
        subject_repo: SubjectRepository,
        save_repo: SauvegardeRepository,
    ):
        self.document_repo = document_repo
        self.subject_repo = subject_repo
        self.save_repo = save_repo

    # ------------------------------------------------------------------
    # Méthodes Privées / Utilitaires
    # ------------------------------------------------------------------
    def _peut_acceder(self, document: Document, current_user: Users) -> bool:
        if document.statut == DocumentStatus.public:
            return True
        if document.owner_id == current_user.id:
            return True
        if current_user.role == UserRole.administrateur:
            return True
        return False

    async def _get_document_or_404(self, document_id: UUID) -> Document:
        document = await self.document_repo.get_by_id(document_id)
        if document is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Document introuvable")
        return document

    async def get_document_by_id(
        self, document_id: UUID, current_user: Users
    ) -> Document:
        document = await self._get_document_or_404(document_id)
        if not self._peut_acceder(document, current_user):
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
        return document

    # ------------------------------------------------------------------
    # Création et Téléchargement
    # ------------------------------------------------------------------

    async def create_document(
        self,
        matiere_id: UUID,
        current_user: Users,
        request: DocumentCreate,
        file: UploadFile,
    ) -> Document:
        """Crée un document, sauvegarde son fichier physique et définit son statut initial.

        Raises:
            HTTPException: 404 si la matière n'existe pas.
            HTTPException: 400 si la date limite est appliquée à un mauvais type.
        """
        matiere = await self.subject_repo.get_by_id(matiere_id)
        if matiere is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Matière introuvable",
            )

        if request.date_limite and request.type_document not in (
            DocumentType.td,
            DocumentType.examen,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La date limite ne s'applique qu'aux TD/examens",
            )

        fichier_path, taille_octets = await save_upload_file(file)

        if (
            current_user.role in (UserRole.moderateur, UserRole.administrateur)
            and request.proposer_publiquement
        ):
            statut = DocumentStatus.public.value
        elif request.proposer_publiquement:
            statut = DocumentStatus.en_attente.value
        else:
            statut = DocumentStatus.prive.value

        data = {
            "titre": request.titre,
            "type_document": request.type_document,
            "statut": statut,
            "fichier_path": fichier_path,
            "mime_type": file.content_type or "application/octet-stream",
            "taille_octets": taille_octets,
            "owner_id": current_user.id,
            "matiere_id": matiere_id,
        }
        return await self.document_repo.create(data)

    async def telecharger_document(self, document_id: UUID, user: Users) -> Document:
        """Récupère les informations d'un document pour son téléchargement si l'accès est autorisé.

        Raises:
            HTTPException: 403 si l'utilisateur n'a pas accès au document.
        """
        document = await self.get_document_or_404(document_id)
        if not self._peut_acceder(document, user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès refusé",
            )
        return document

    # ------------------------------------------------------------------
    # Lectures et Recherches
    # ------------------------------------------------------------------

    async def list_by_matiere_public(self, matiere_id: UUID) -> list[Document]:
        """Liste tous les documents publics associés à une matière."""
        return await self.document_repo.list_public_by_matiere(matiere_id)

    async def get_all_public_docs(self) -> list[Document]:
        """Récupère la totalité des documents publics."""
        return await self.document_repo.get_all_public()

    async def get_document_by_type(self, doc_type: DocumentType) -> list[Document]:
        """Filtre les documents selon leur type (ex: Cours, TD)."""
        return await self.document_repo.get_by_type(doc_type)

    async def get_all_pending_docs(self) -> list[Document]:
        """Récupère la liste des documents en attente de modération."""
        return await self.document_repo.get_pending()

    # ------------------------------------------------------------------
    # Actions Utilisateur (Favoris / Dashboard)
    # ------------------------------------------------------------------

    async def enregistrer_document(self, document_id: UUID, user_id: UUID) -> None:
        """Ajoute un document aux sauvegardes/favoris d'un utilisateur.

        Raises:
            HTTPException: 403 si l'utilisateur n'a pas accès au document.
            HTTPException: 400 si le document est déjà sauvegardé.
        """
        document = await self.get_document_or_404(document_id)

        # Pour la vérification d'accès, on simule l'objet owner
        if not (
            document.statut == DocumentStatus.public or document.owner_id == user_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès refusé",
            )

        deja_enregistre = await self.save_repo.exists(user_id, document_id)
        if deja_enregistre:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document déjà présent dans votre dashboard",
            )

        await self.save_repo.create({"user_id": user_id, "document_id": document_id})

    # ------------------------------------------------------------------
    # Modération (Admin / Modérateur)
    # ------------------------------------------------------------------

    async def valide_document(self, document_id: UUID, validator_id: UUID) -> Document:
        """Valide un document en attente pour le rendre public."""
        document = await self.get_document_or_404(document_id)

        if document.statut != DocumentStatus.en_attente.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document n'est pas en attente",
            )
        return await self.document_repo.update(
            document,
            {
                "statut": DocumentStatus.public.value,
                "validated_by_id": validator_id,
            },
        )

    async def rejeter_document(self, document_id: UUID, rejector_id: UUID) -> Document:
        """Rejette un document soumis à la publication."""
        document = await self.get_document_or_404(document_id)
        if document.statut != DocumentStatus.en_attente.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Document n'est pas en attente",
            )
        return await self.document_repo.update(
            document,
            {
                "statut": DocumentStatus.rejete.value,
                "validated_by_id": rejector_id,
            },
        )

    async def delete_document(self, document_id: UUID, current_user: Users) -> None:
        document = await self._get_document_or_404(document_id)

        est_proprietaire = document.owner_id == current_user.id
        est_admin = current_user.role == UserRole.administrateur
        est_moderateur_autorise = (
            current_user.role == UserRole.moderateur
            and await self._moderateur_gere_ce_document(document, current_user)
        )

        if est_admin or est_moderateur_autorise:
            await self.document_repo.delete(document)
            return

        if est_proprietaire and document.statut != DocumentStatus.public:
            await self.document_repo.delete(document)
            return

        raise HTTPException(status.HTTP_403_FORBIDDEN, "Suppression non autorisée")

    async def _moderateur_gere_ce_document(
        self, document: Document, current_user: Users
    ) -> bool:
        matiere = await self.subject_repo.get_by_id(document.matiere_id)
        return matiere.classe_id == current_user.classe_id
