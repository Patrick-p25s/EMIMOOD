from uuid import UUID

from app.modules.annonce.repository import AnnonceLectureRepository, AnnonceRepository
from app.modules.annonce.schema import (
    AnnonceCreate,
    AnnonceOut,
    LecteurStats,
    LecteurAnnonceOut,
)
from app.modules.annonce.service import AnnonceService, AnnonceLectureService
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, require_moderator
from app.modules.users.model import Users
from app.modules.users.repository import UserRepository
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession


def get_annonce_lecture_service(db: AsyncSession = Depends(get_db)):
    return AnnonceLectureService(
        repo=AnnonceRepository(db),
        lecture_repo=AnnonceLectureRepository(db),
        user_repo=UserRepository(db),
    )


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


@router.get("/{id}")
async def delete_annonce(
    id: str,
    current_user: Users = Depends(get_current_user),
    service: AnnonceService = Depends(get_annonce_service),
) -> None:
    return await service.delete_annonces(id, current_user)


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


@router.patch("/{id}/read", response_model=LecteurAnnonceOut)
async def read_annonce(
    id: str,
    current_user: Users = Depends(get_current_user),
    service: AnnonceLectureService = Depends(get_annonce_service),
):
    return await service.read_annonce(id)


@router.patch("/{id}/archive", response_model=LecteurAnnonceOut)
async def archive_annonce(
    id: str,
    current_user: Users = Depends(get_current_user),
    service: AnnonceLectureService = Depends(get_annonce_service),
) -> LecteurStats:
    return await service.archive_annonce(id)
