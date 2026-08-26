from uuid import UUID
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_moderator
from app.modules.documents.repository import DocumentRepository
from app.modules.documents.schema import (
    DocumentCreate,
    DocumentOut,
    DocumentType,
    DocumentUpdate,
)
from app.modules.documents.service import DocumentService
from app.modules.matiere.repository import SubjectRepository
from app.modules.users.model import Users
from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession


def get_document_service(db: AsyncSession = Depends(get_db)) -> DocumentService:
    return DocumentService(DocumentRepository(db), SubjectRepository(db))


router = APIRouter(prefix="/documents", tags=["Gestion des Documents"])


@router.post(
    "/create/{matiere_id}",
    response_model=DocumentOut,
    status_code=status.HTTP_201_CREATED,
    summary="Créer et téléverser un document",
    description="Permet à un utilisateur authentifié d'ajouter un document associé à une matière.",
)
async def create_document(
    matiere_id: UUID,
    titre: str = Form(..., description="Titre du document"),
    type_document: DocumentType = Form(
        ..., description="Type de document (ex: Cours, TP, Examen)"
    ),
    proposer_publiquement: bool = Form(
        False, description="Rendre le document visible par tous après validation"
    ),
    file: UploadFile = File(..., description="Fichier binaire à téléverser"),
    date_limite: datetime = Form(..., description="Date de limite pour les dévoirs "),
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> DocumentOut:
    request = DocumentCreate(
        date_limite=date_limite,
        titre=titre,
        type_document=type_document,
        proposer_publiquement=proposer_publiquement,
    )
    return await service.create_document(matiere_id, current_user, request, file)


@router.get(
    "/pending",
    response_model=list[DocumentOut],
    summary="Lister les documents en attente",
    description="Récupère la liste des documents en attente de modération (Réservé aux modérateurs).",
)
async def get_pending_documents(
    current_user: Users = Depends(require_moderator),
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentOut]:
    return await service.get_all_pending_docs()


@router.get(
    "/public",
    response_model=list[DocumentOut],
    summary="Lister tous les documents publics",
    description="Récupère l'ensemble des documents validés et publics.",
)
async def list_all_public_docs(
    service: DocumentService = Depends(get_document_service),
    current_user: Users = Depends(get_current_user),
) -> list[DocumentOut]:
    return await service.get_all_public_docs()


@router.get(
    "/public/{matiere_id}",
    response_model=list[DocumentOut],
    summary="Lister les documents par matière",
    description="Récupère les documents publics associés à une matière spécifique.",
)
async def list_documents_by_matiere(
    matiere_id: UUID,
    user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentOut]:
    return await service.list_by_matiere_public(matiere_id)


@router.patch(
    "/{document_id}/valide",
    response_model=DocumentOut,
    summary="Valider un document",
    description="Approuve un document en attente (Réservé aux modérateurs).",
)
async def valider_document(
    document_id: UUID,
    service: DocumentService = Depends(get_document_service),
    user: Users = Depends(require_moderator),
) -> DocumentOut:
    return await service.valide_document(document_id=document_id, validator_id=user.id)


@router.patch(
    "/{document_id}/rejete",
    response_model=DocumentOut,
    summary="Rejeter un document",
    description="Refuse un document en attente (Réservé aux modérateurs).",
)
async def rejeter_document(
    document_id: UUID,
    service: DocumentService = Depends(get_document_service),
    user: Users = Depends(require_moderator),
) -> DocumentOut:
    return await service.rejeter_document(document_id=document_id, rejector_id=user.id)


@router.get(
    "/{id}/telecharger",
    response_class=FileResponse,
    summary="Télécharger le fichier d'un document",
    description="Renvoie le fichier binaire correspondant au document spécifié.",
    responses={
        200: {
            "content": {"application/octet-stream": {}},
            "description": "Fichier téléchargé avec succès.",
        }
    },
)
async def telecharger_document_file(
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


@router.get(
    "/type/{type}",
    response_model=list[DocumentOut],
    summary="Filtrer les documents par type",
    description="Récupère les documents correspondant au type spécifié (ex: TP, cours).",
)
async def get_documents_by_type(
    type: DocumentType,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentOut]:
    return await service.get_document_by_type(type)


@router.delete("/{document_id}/delete")
async def delete_document(
    document_id: UUID,
    user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
):
    return await service.delete_document(document_id, user)


@router.patch("/{id}", response_model=DocumentOut)
async def update_document(
    id: UUID,
    request: DocumentUpdate,
    current_user: Users = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> DocumentOut:
    return await service.update_document(id, current_user, request)
