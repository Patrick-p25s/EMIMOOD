from uuid import UUID

from app.documents.model import Document, DocumentStatus, DocumentType
from app.documents.repository import DocumentRepository
from app.documents.schema import DocumentCreate
from app.documents.storage import save_upload_file
from app.users.model import Users
from app.matiere.repository import SubjectRepository
from fastapi import HTTPException, UploadFile, status
from app.sauvegarde.repository import SauvegardeRepository


class DocumentService:
    def __init__(
        self,
        document_repo: DocumentRepository,
        subject_repo: SubjectRepository,
        save_repo: SauvegardeRepository,
    ):
        self.document_repo = document_repo
        self.subject_repo = subject_repo
        self.save_repo = save_repo

    def _peut_acceder(self, document: Document, user: Users) -> bool:
        return document.statut == DocumentStatus.public or document.owner_id == user.id

    async def get_document_or_404(self, id: str | UUID):
        document = await self.document_repo.get_by_id(id)
        if document is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Document non trouvé"
            )
        return document

    async def create_document(
        self,
        matiere_id: UUID,
        owner_id: UUID,
        request: DocumentCreate,
        file: UploadFile,
    ) -> Document:
        matiere = await self.subject_repo.get_by_id(matiere_id)
        if matiere is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Matière introuvable")

        if request.date_limite and request.type_document not in (
            DocumentType.td,
            DocumentType.examen,
        ):
            raise HTTPException(400, "La date limite ne s'applique qu'aux TD/examens")

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

    async def list_by_matiere(self, matiere_id: UUID) -> list[Document]:
        return await self.document_repo.list_by_matiere(matiere_id)

    async def enregistrer_document(self, document_id: UUID, user_id: UUID) -> None:
        document = await self.get_document_or_404(document_id)
        if not self._peut_acceder(document, user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé"
            )

        deja_enregistre = await self.save_repo.exists(user_id, document_id)
        if deja_enregistre:
            raise HTTPException(400, "Déjà dans votre dashboard")

        await self.save_repo.create({"user_id": user_id, "document_id": document_id})

    async def telecharger_document(self, document_id: UUID, user: Users) -> Document:
        document = await self.get_document_or_404(document_id)
        if not self._peut_acceder(document, user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé"
            )
        return document
