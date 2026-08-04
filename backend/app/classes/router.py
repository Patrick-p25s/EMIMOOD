from app.classes.repository import ClasseRepository
from app.classes.schema import ClasseCreate, ClasseOut
from app.classes.service import ClasseService
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.users.model import Users
from app.years.repository import YearRepository
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID


def get_classe_service(db: AsyncSession = Depends(get_db)) -> ClasseService:
    return ClasseService(YearRepository(db), ClasseRepository(db))


router = APIRouter(prefix="/classes", tags=["Classe router"])


@router.post("/create", response_model=ClasseOut, status_code=status.HTTP_201_CREATED)
async def create_classe(
    request: ClasseCreate,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(require_admin),
):
    return await service.create_classe(request)


@router.get("/all", response_model=list[ClasseOut])
async def get_all_classe(
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(get_current_user),  # Optionnel : restreindre aux connectés
):
    return await service.get_all_classes()


@router.get("/{id}", response_model=ClasseOut)
async def get_classe_by_id(
    id: UUID,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(get_current_user),
):
    return await service.get_by_id(id)


@router.put("/{id}", response_model=ClasseOut)
async def update_classe_by_id(
    id: UUID,
    request: ClasseCreate,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(require_admin),
):
    return await service.update_classe(id, request)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_one_classe(
    id: UUID,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(require_admin),
):
    await service.delete_classe(id)
    return None


@router.patch("/{id}/regenerate-code", response_model=ClasseOut)
async def regenerate_code(
    id: UUID,
    current_user: Users = Depends(
        require_admin
    ),  # 🔒 Sécurisé : Seul l'admin (ou modérateur selon votre logique) peut régénérer le code
    service: ClasseService = Depends(get_classe_service),
) -> ClasseOut:
    return await service.regenerate_invitation_code(id)
