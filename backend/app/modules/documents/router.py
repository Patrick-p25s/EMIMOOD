from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_moderator
from app.core.pagination import Page, PaginationParams
from app.modules.documents.model import DocumentType
from app.modules.documents.repository import DocumentRepository, DocumentSaveRepository
from app.modules.documents.schema import DocumentCreate, DocumentOut, DocumentUpdate
from app.modules.documents.service import DocumentService
from app.modules.matiere.repository import SubjectRepository
from app.modules.users.model import Users


def get_document_service(db: AsyncSession = Depends(get_db)) -> DocumentService:
    return DocumentService(
        DocumentRepository(db), SubjectRepository(db), DocumentSaveRepository(db)
    )


router = APIRouter(prefix="/documents", tags=["Gestion des Documents"])


@router.get("/public", response_model=Page[DocumentOut])
async def list_public_documents(
    params: PaginationParams = Depends(),
    matiere_id: UUID | None = None,
    type_document: DocumentType | None = None,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> Page[DocumentOut]:
    return await service.list_public_documents(
        current_user, params, matiere_id, type_document
    )


@router.post("", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def create_document(
    titre: str = Form(...),
    type_document: DocumentType = Form(...),
    file: UploadFile = File(...),
    matiere_id: UUID | None = Form(None),
    description: str | None = Form(None),
    date_limite: datetime | None = Form(None),
    proposer_publiquement: bool = Form(False),
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> DocumentOut:
    request = DocumentCreate(
        titre=titre,
        description=description,
        type_document=type_document,
        date_limite=date_limite,
        proposer_publiquement=proposer_publiquement,
    )
    return await service.create_document(matiere_id, current_user, request, file)


@router.get("/mine", response_model=Page[DocumentOut])
async def list_my_documents(
    params: PaginationParams = Depends(),
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> Page[DocumentOut]:
    return await service.list_my_documents(current_user, params)


@router.get("/moderation/pending", response_model=Page[DocumentOut])
async def list_pending_documents(
    params: PaginationParams = Depends(),
    matiere_id: UUID | None = None,
    current_user: Users = Depends(require_moderator),
    service: DocumentService = Depends(get_document_service),
) -> Page[DocumentOut]:
    return await service.list_pending_documents(current_user, params, matiere_id)


@router.patch("/moderation/{document_id}/approve", response_model=DocumentOut)
async def approve_document(
    document_id: UUID,
    current_user: Users = Depends(require_moderator),
    service: DocumentService = Depends(get_document_service),
) -> DocumentOut:
    return await service.valide_document(document_id, current_user)


@router.patch("/moderation/{document_id}/reject", response_model=DocumentOut)
async def reject_document(
    document_id: UUID,
    current_user: Users = Depends(require_moderator),
    service: DocumentService = Depends(get_document_service),
) -> DocumentOut:
    return await service.rejeter_document(document_id, current_user)


@router.post("/{document_id}/saves", status_code=status.HTTP_201_CREATED)
async def save_document(
    document_id: UUID,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return await service.sauvegarde_document(document_id, current_user)


@router.delete("/saves/{save_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_saved_document(
    save_id: UUID,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> None:
    await service.delete_save_document(save_id, current_user)


@router.get("/{document_id}", response_model=DocumentOut)
async def get_document(
    document_id: UUID,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> DocumentOut:
    return await service.get_document_by_id(document_id, current_user)


@router.get("/{document_id}/download", response_class=FileResponse)
async def download_document(
    document_id: UUID,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    document = await service.telecharger_document(document_id, current_user)
    return FileResponse(
        path=document.storage_key,
        filename=document.original_filename,
        media_type=document.mime_type,
    )


@router.patch("/{document_id}", response_model=DocumentOut)
async def update_document(
    document_id: UUID,
    request: DocumentUpdate,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> DocumentOut:
    return await service.update_document(document_id, current_user, request)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: UUID,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> None:
    await service.delete_document(document_id, current_user)
