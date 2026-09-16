from app.modules.folder.model import Folder
from app.modules.users.model import Users
from app.modules.folder.schema import FolderCreate, FolderUpdate, FolderOut
from app.modules.folder.repository import FolderRepository
from app.modules.folder.service import FolderService
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.core.pagination import Page, PaginationParams

router = APIRouter(prefix="/folder", tags=["Router pour les dossier"])


def get_folder_service(db: AsyncSession = Depends(get_db)):
    return FolderService(FolderRepository(db))


@router.post("")
async def create_one_folder(
    data: FolderCreate,
    current_user: Users = Depends(get_current_user),
    service: FolderService = Depends(get_folder_service),
):
    return await service.create_document(current_user, data)


@router.get("", response_model=Page[FolderOut])
async def get_my_folder(
    params: PaginationParams = Depends(),
    current_user: Users = Depends(get_current_user),
    service: FolderService = Depends(get_folder_service),
):
    return await service.get_all_folder(current_user, params)


@router.get("/{folder_id}")
async def create_one_folder(
    folder_id: str,
    current_user: Users = Depends(get_current_user),
    service: FolderService = Depends(get_folder_service),
):
    return await service.get_folder_by_id(folder_id, current_user)


@router.patch("/{folder_id}")
async def update_document(
    folder_id: str,
    data: FolderUpdate,
    current_user: Users = Depends(get_current_user),
    service: FolderService = Depends(get_folder_service),
):
    return await service.update_folder(folder_id, data, current_user)


@router.delete("/{folder_id}", response_model=bool)
async def create_one_folder(
    folder_id: str,
    current_user: Users = Depends(get_current_user),
    service: FolderService = Depends(get_folder_service),
):
    return await service.delete_folder(folder_id, current_user)
