from uuid import UUID

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.sauvegarde.repository import SauvegardeRepository
from app.modules.sauvegarde.service import SauvegardeService
from app.modules.users.model import Users
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession


def get_save_service(db: AsyncSession = Depends(get_db)) -> SauvegardeService:
    return SauvegardeService(SauvegardeRepository(db))


router = APIRouter(prefix="/documents", tags=["Sauvegardes & Tableau de bord"])


@router.get(
    "/dashboard",
    summary="Consulter mon tableau de bord",
    description="Récupère la liste de tous les documents sauvegardés (ajoutés aux favoris) par l'utilisateur connecté.",
)
async def get_my_dashboard(
    user: Users = Depends(get_current_user),
    service: SauvegardeService = Depends(get_save_service),
):
    return await service.get_all_my_document(user.id)


@router.get("/dashboard/{document_id}")
async def get_my_document_by_id(
    document_id: str,
    user: Users = Depends(get_current_user),
    service: SauvegardeService = Depends(get_save_service),
):
    return await service.get_my_docs_by_id(user.id, document_id)


@router.delete(
    "/{document_id}/sauvegarde",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Retirer un document des sauvegardes",
    description="Supprime un document du tableau de bord de l'utilisateur connecté.",
)
async def delete_sauvegarde(
    document_id: UUID,
    user: Users = Depends(get_current_user),
    service: SauvegardeService = Depends(get_save_service),
) -> None:
    await service.delete_document(user, document_id)
