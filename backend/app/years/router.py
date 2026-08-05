from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.years.repository import YearRepository
from app.years.schema import YearCreate, YearOut
from app.years.service import YearService


def get_year_service(db: AsyncSession = Depends(get_db)) -> YearService:
    return YearService(YearRepository(db=db))


router = APIRouter(
    prefix="/academic-years",
    tags=["Gestion des Années Académiques"],
    dependencies=[Depends(require_admin)],
)


@router.post(
    "/create",
    response_model=YearOut,
    status_code=status.HTTP_201_CREATED,
    summary="Créer une année académique",
    description="Crée une nouvelle année académique dans le système (Accès réservé aux administrateurs).",
)
async def create_year(
    request: YearCreate,
    service: YearService = Depends(get_year_service),
) -> YearOut:
    return await service.create_year(request=request)


@router.get(
    "/all",
    response_model=List[YearOut],
    summary="Lister toutes les années académiques",
    description="Récupère la liste de toutes les années académiques enregistrées (Accès réservé aux administrateurs).",
)
async def get_all_year(
    service: YearService = Depends(get_year_service),
) -> List[YearOut]:
    return await service.get_all_year()


@router.get(
    "/{id}",
    response_model=YearOut,
    summary="Récupérer une année académique par son ID",
    description="Renvoie les détails d'une année académique spécifique via son UUID.",
)
async def get_year(
    id: UUID,
    service: YearService = Depends(get_year_service),
) -> YearOut:
    return await service.get_year_by_id(id)


@router.patch(
    "/{id}",
    response_model=YearOut,
    summary="Activer une année académique",
    description="Définit l'année académique spécifiée comme étant l'année active par défaut.",
)
async def active_one_year(
    id: UUID,
    service: YearService = Depends(get_year_service),
) -> YearOut:
    return await service.activate_year(id)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer une année académique",
    description="Supprime définitivement une année académique du système.",
)
async def delete_year(
    id: UUID,
    service: YearService = Depends(get_year_service),
) -> None:
    await service.delete_year(id)
    return None
