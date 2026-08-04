from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.years.repository import YearRepository
from app.years.service import YearService
from app.years.schema import YearOut, YearCreate
from app.core.dependencies import get_current_user


def get_year_service(db: AsyncSession = Depends(get_db)) -> YearService:
    return YearService(YearRepository(db=db))


router = APIRouter(
    prefix="/year", tags=["Year router"], dependencies=[Depends(get_current_user)]
)


@router.post("/create")
async def create_year(
    request: YearCreate, service: YearService = Depends(get_year_service)
):
    return await service.create_year(request=request)
