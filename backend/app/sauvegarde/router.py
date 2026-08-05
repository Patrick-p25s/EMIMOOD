from fastapi import APIRouter, Depends
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.sauvegarde.service import SauvegardeService
from app.sauvegarde.repository import SauvegardeRepository
from app.core.dependencies import get_current_user
from app.users.model import Users
from uuid import UUID


def get_save_service(db: AsyncSession = Depends(get_db)):
    return SauvegardeService(SauvegardeRepository(db))


router = APIRouter(prefix="/documents", tags=["Route sauvegardé"])


@router.get("/mon-dashboard")
async def get_document_by_id(
    user: Users = Depends(get_current_user),
    service: SauvegardeService = Depends(get_save_service),
):
    return await service.get_all_my_document(user.id)


@router.delete("/{document_id}/sauvegarde")
async def delete_sauvegarde(
    document_id: UUID,
    user: Users = Depends(get_current_user),
    service: SauvegardeService = Depends(get_save_service),
):
    return await service.delete_document(user, document_id)
