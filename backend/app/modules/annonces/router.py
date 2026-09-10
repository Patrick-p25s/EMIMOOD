from uuid import UUID

from app.modules.annonces.repository import AnnonceLectureRepository, AnnonceRepository
from app.modules.annonces.schema import AnnonceCreate, AnnonceOut, LecteurStats
from app.modules.annonces.service import AnnonceService
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.modules.users.model import Users
from app.modules.users.repository import UserRepository
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession


def get_annonce_service(db: AsyncSession = Depends(get_db)) -> AnnonceService:
    return AnnonceService(
        repo=AnnonceRepository(db),
        lecture_repo=AnnonceLectureRepository(db),
        user_repo=UserRepository(db),
    )


router = APIRouter(prefix="/annonces", tags=["Annonce router"])


@router.post("/create", response_model=AnnonceOut)
async def create_annonce(
    request: AnnonceCreate,
    classe_id: UUID | None = None,
    current_user: Users = Depends(get_current_user),
    service: AnnonceService = Depends(get_annonce_service),
) -> AnnonceOut:
    return await service.create_annonce(request, current_user, classe_id)


@router.get("/actives", response_model=list[AnnonceOut])
async def get_active_annonces(
    current_user: Users = Depends(get_current_user),
    service: AnnonceService = Depends(get_annonce_service),
) -> list[AnnonceOut]:
    return await service.get_active_for_user(current_user)


@router.get("/archivees", response_model=list[AnnonceOut])
async def get_archived_annonces(
    current_user: Users = Depends(get_current_user),
    service: AnnonceService = Depends(get_annonce_service),
) -> list[AnnonceOut]:
    return await service.all_archive(current_user)


@router.get("/{id}", response_model=AnnonceOut)
async def get_annonce_by_id(
    id: UUID,
    current_user: Users = Depends(get_current_user),
    service: AnnonceService = Depends(get_annonce_service),
) -> AnnonceOut:
    return await service.get_annonce_by_id(id, current_user)


@router.patch("/{id}/archiver", response_model=AnnonceOut)
async def archive_annonce(
    id: UUID,
    current_user: Users = Depends(get_current_user),
    service: AnnonceService = Depends(get_annonce_service),
) -> AnnonceOut:
    return await service.archive_annonce(id, current_user)


@router.get("/{id}/lecteurs", response_model=LecteurStats)
async def get_lecteur_stats(
    id: UUID,
    current_user: Users = Depends(get_current_user),
    service: AnnonceService = Depends(get_annonce_service),
) -> LecteurStats:
    return await service.get_lecteur_stats(id, current_user)
