from app.core.database import get_db
from app.core.dependencies import require_admin
from app.years.repository import YearRepository
from app.years.schema import YearCreate
from app.years.service import YearService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession


def get_year_service(db: AsyncSession = Depends(get_db)) -> YearService:
    return YearService(YearRepository(db=db))


router = APIRouter(
    prefix="/accademic-years",
    tags=["Year router"],
    dependencies=[Depends(require_admin)],
)


@router.post("/create")
async def create_year(
    request: YearCreate, service: YearService = Depends(get_year_service)
):
    return await service.create_year(request=request)


@router.get("/all")
async def get_all_year(service: YearService = Depends(get_year_service)):
    return await service.get_all_year()


@router.get("/{id}")
async def get_year(id: str, service: YearService = Depends(get_year_service)):
    return await service.get_year_by_id(id)


@router.patch("/{id}")
async def active_one_year(id: str, service: YearService = Depends(get_year_service)):
    print("Bonjour Patrick")
    return await service.activate_year(id)


@router.delete("/{id}")
async def delete_year(id: str, service: YearService = Depends(get_year_service)):
    return await service.delete_year(id)
