from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.documents.repository import DocumentRepository
from app.documents.schema import DocumentCreate, DocumentOut, DocumentType
from app.documents.service import DocumentService
from app.matiere.repository import SubjectRepository
from app.users.model import Users
from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession


def get_document_service(db: AsyncSession = Depends(get_db)) -> DocumentService:
    return DocumentService(DocumentRepository(db), SubjectRepository(db))


router = APIRouter(prefix="/documents", tags=["Document router"])


@router.post("/create/{matiere_id}", response_model=DocumentOut)
async def create_document(
    matiere_id: UUID,
    titre: str = Form(...),
    type_document: DocumentType = Form(...),
    proposer_publiquement: bool = Form(False),
    file: UploadFile = File(...),
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> DocumentOut:
    request = DocumentCreate(
        titre=titre,
        type_document=type_document,
        proposer_publiquement=proposer_publiquement,
    )
    return await service.create_document(matiere_id, current_user.id, request, file)


@router.get("/matiere/{matiere_id}", response_model=list[DocumentOut])
async def list_documents_by_matiere(
    matiere_id: UUID,
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentOut]:
    return await service.list_by_matiere(matiere_id)
