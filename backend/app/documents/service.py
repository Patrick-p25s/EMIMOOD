from uuid import UUID

from app.documents.model import Document, DocumentStatus
from app.documents.repository import DocumentRepository
from app.documents.schema import DocumentCreate
from app.documents.storage import save_upload_file
from app.matiere.repository import SubjectRepository
from fastapi import HTTPException, UploadFile, status


class DocumentService:
    def __init__(
        self, document_repo: DocumentRepository, subject_repo: SubjectRepository
    ):
        self.document_repo = document_repo
        self.subject_repo = subject_repo

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
