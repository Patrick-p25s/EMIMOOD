from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, require_moderator
from app.documents.repository import DocumentRepository
from app.documents.schema import DocumentCreate, DocumentOut, DocumentType
from app.documents.service import DocumentService
from app.matiere.repository import SubjectRepository
from app.users.model import Users
from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.responses import FileResponse


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
    return await service.list_by_matiere_public(matiere_id)


@router.get("/public")
async def list_all_public_docs(
    service: DocumentService = Depends(get_document_service),
    users: Users = Depends(get_current_user),
):
    return await service.get_all_public_docs()


@router.get("/{document_id}/valide")
async def valide_a_document(
    document_id: str,
    service: DocumentService = Depends(get_document_service),
    user: Users = Depends(require_moderator),
):
    return await service.valide_document(document_id=document_id, validator_id=user.id)


@router.get("/{document_id}/rejete")
async def valide_a_document(
    document_id: str,
    service: DocumentService = Depends(get_document_service),
    user: Users = Depends(require_moderator),
):
    return await service.rejeter_document(document_id=document_id, rejector_id=user.id)


@router.get("/{id}/telecharger")
async def telecharger(
    id: UUID,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    document = await service.telecharger_document(id, current_user)
    return FileResponse(
        path=document.fichier_path,
        filename=document.titre,
        media_type=document.mime_type,
    )


@router.get("/{type}")
async def telecharger(
    type: DocumentType,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return await service.get_document_by_type(type)


@router.get("/pending")
async def telecharger(
    current_user: Users = Depends(require_moderator),
    service: DocumentService = Depends(get_document_service),
):
    return await service.get_all_pending_docs()
