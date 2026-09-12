from uuid import UUID

from app.modules.classes.repository import ClasseRepository
from app.modules.classes.schema import ClasseCreate, ClasseOut
from app.modules.users.schema import UserRead
from app.modules.classes.service import ClasseService
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.modules.users.model import Users
from app.modules.years.repository import YearRepository
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.pagination import Page, PaginationParams


def get_classe_service(db: AsyncSession = Depends(get_db)) -> ClasseService:
    return ClasseService(YearRepository(db), ClasseRepository(db))


router = APIRouter(prefix="/classes", tags=["Gestion des Classes"])


@router.post(
    "",
    response_model=ClasseOut,
    status_code=status.HTTP_201_CREATED,
    summary="Créer une nouvelle classe (Admin require)",
    description="Permet de créer une nouvelle classe rattachée à une année académique (Réservé aux administrateurs).",
)
async def create_classe(
    request: ClasseCreate,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(require_admin),
) -> ClasseOut:
    return await service.create_classe(request)


@router.get(
    "",
    response_model=Page[ClasseOut],
    summary="Lister toutes les classes",
    description="Récupère la liste complète de toutes les classes enregistrées.",
)
async def get_all_classe(
    params: PaginationParams = Depends(),
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(require_admin),
) -> Page[ClasseOut]:
    return await service.get_all_classes(params)


@router.patch(
    "/{id}/regenerate-code",
    response_model=ClasseOut,
    summary="Régénérer le code d'invitation (admin require)",
    description="Génère un nouveau code d'invitation unique pour la classe spécifiée (Réservé aux administrateurs).",
)
async def regenerate_code(
    id: str,
    current_user: Users = Depends(require_admin),
    service: ClasseService = Depends(get_classe_service),
) -> ClasseOut:
    return await service.regenerate_invitation_code(id)


@router.get(
    "/{id}",
    response_model=ClasseOut,
    summary="Récupérer une classe par son ID",
    description="Renvoie les détails complets d'une classe via son identifiant UUID.",
)
async def get_classe_by_id(
    id: str,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(get_current_user),
) -> ClasseOut:
    return await service.get_by_id(id)


@router.put(
    "/{id}",
    response_model=ClasseOut,
    summary="Mettre à jour une classe",
    description="Modifie les informations d'une classe existante (Réservé aux administrateurs).",
)
async def update_classe_by_id(
    id: str,
    request: ClasseCreate,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(require_admin),
) -> ClasseOut:
    return await service.update_classe(id, request)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer une classe",
    description="Supprime définitivement une classe du système (Réservé aux administrateurs).",
)
async def delete_one_classe(
    id: str,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(require_admin),
) -> None:
    return await service.delete_classe(id)


@router.get("/students", response_model=Page[UserRead])
async def list_all_student(
    params: PaginationParams = Depends(),
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(get_current_user),
) -> Page[UserRead]:
    return await service.get_all_student(params, user.classe_id)
