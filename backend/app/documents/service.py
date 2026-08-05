from uuid import UUID

from app.documents.model import Document, DocumentStatus, DocumentType
from app.documents.repository import DocumentRepository
from app.documents.schema import DocumentCreate
from app.documents.storage import save_upload_file
from app.matiere.repository import SubjectRepository
from app.sauvegarde.repository import SauvegardeRepository
from app.users.model import Users
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

    def _peut_acceder(self, document: Document, user: Users) -> bool:
        """Vérifie si un utilisateur a le droit de lire ou télécharger un document."""
        return document.statut == DocumentStatus.public or document.owner_id == user.id

    async def get_document_or_404(self, document_id: UUID) -> Document:
        """Récupère un document par son identifiant ou lève une exception 404."""
        document = await self.document_repo.get_by_id(document_id)
        if document is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document non trouvé",
            )
        return document

    # ------------------------------------------------------------------
    # Création et Téléchargement
    # ------------------------------------------------------------------

    async def create_document(
        self,
        matiere_id: UUID,
        owner_id: UUID,
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

        statut = (
            DocumentStatus.en_attente
            if request.proposer_publiquement
            else DocumentStatus.prive
        )

        data = {
            "titre": request.titre,
            "type_document": request.type_document,
            "statut": statut,
            "fichier_path": fichier_path,
            "mime_type": file.content_type or "application/octet-stream",
            "taille_octets": taille_octets,
            "owner_id": owner_id,
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
