from app.classes.repository import ClasseRepository
from app.classes.schema import ClasseCreate, ClasseOut
from app.classes.service import ClasseService
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.users.model import Users
from app.years.repository import YearRepository
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession


def get_classe_service(db: AsyncSession = Depends(get_db)) -> ClasseService:
    return ClasseService(YearRepository(db), ClasseRepository(db))


router = APIRouter(prefix="/classes", tags=["Classe router"])


@router.post("/create", response_model=ClasseOut)
async def create_classe(
    request: ClasseCreate, service: ClasseService = Depends(get_classe_service)
):
    return await service.create_classe(request)


@router.get("/{id}", response_model=ClasseOut)
async def get_classe_by_id(
    id: str, service: ClasseService = Depends(get_classe_service)
):
    return await service.get_by_id(id)


@router.get("/all", response_model=list[ClasseOut])
async def get_all_classe(service: ClasseService = Depends(get_classe_service)):
    return await service.get_all_classes()


@router.put("/{id}", response_model=ClasseOut)
async def update_classe_by_id(
    id: str, request: ClasseCreate, service: ClasseService = Depends(get_classe_service)
):
    return await service.update_classe(id, request)


@router.delete("/{id}")
async def delete_one_classe(
    id: str,
    service: ClasseService = Depends(get_classe_service),
    user: Users = Depends(require_admin),
):
    return await service.delete_classe(id)


@router.patch("/{id}/regenerate-code", response_model=ClasseOut)
async def regenerate_code(
    id: str,
    current_user: Users = Depends(get_current_user),
    service: ClasseService = Depends(get_classe_service),
) -> ClasseOut:
    return await service.regenerate_invitation_code(id, current_user)
