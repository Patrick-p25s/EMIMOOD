from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.classes.repository import ClasseRepository
from app.years.repository import YearRepository
from app.classes.service import ClasseService
from app.classes.schema import ClasseCreate, ClasseOut


def get_classe_service(db: AsyncSession = Depends(get_db)) -> ClasseService:
    return ClasseService(YearRepository(db), ClasseRepository(db))


router = APIRouter(prefix="/classe", tags=["Classe router"])


@router.post("/create")
async def create_classe(
    request: ClasseCreate, service: ClasseService = Depends(get_classe_service)
):
    return await service.create_classe(request)
