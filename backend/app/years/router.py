from app.core.database import get_db
from app.core.dependencies import require_admin
from app.years.repository import YearRepository
from app.years.schema import YearCreate, YearOut
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


@router.post("/create", response_model=YearOut)
async def create_year(
    request: YearCreate, service: YearService = Depends(get_year_service)
) -> YearOut:
    return await service.create_year(request=request)


@router.get("/all", response_model=list[YearOut])
async def get_all_year(
    service: YearService = Depends(get_year_service),
) -> list[YearOut]:
    return await service.get_all_year()


@router.get("/{id}", response_model=YearOut)
async def get_year(
    id: str, service: YearService = Depends(get_year_service)
) -> YearOut:
    return await service.get_year_by_id(id)


@router.patch("/{id}", response_model=YearOut)
async def active_one_year(
    id: str, service: YearService = Depends(get_year_service)
) -> YearOut:
    return await service.activate_year(id)


@router.delete("/{id}")
async def delete_year(
    id: str, service: YearService = Depends(get_year_service)
) -> bool:
    return await service.delete_year(id)
