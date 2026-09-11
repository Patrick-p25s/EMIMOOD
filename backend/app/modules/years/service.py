from uuid import UUID

from fastapi import HTTPException, status

from app.core.pagination import Page, PaginationParams, make_page
from app.modules.years.repository import YearRepository
from app.modules.years.schema import YearCreate, YearOut


class YearService:
    def __init__(self, repo: YearRepository):
        self.repo = repo

    async def get_year_by_id(self, id: UUID | str) -> YearOut:
        year = await self.repo.get_by_id(year_id=id)
        if year is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Year not found"
            )
        return year

    async def get_all_year(self, params: PaginationParams) -> Page[YearOut]:
        year, total = await self.repo.list_all_year(params.offset, params.limit)
        return make_page(year, total, params)

    async def create_year(self, request: YearCreate) -> YearOut:
        data = {
            "label": request.label,
            "start_at": request.start_at,
            "end_at": request.end_at,
        }

        return await self.repo.create(data=data)

    async def delete_year(self, id: UUID | str):
        year = await self.get_year_by_id(id)
        await self.repo.delete(year)

    async def activate_year(self, id: UUID | str) -> YearOut:
        year = await self.get_year_by_id(id)
        return await self.repo.activate(year.id)

    async def get_all_classes(
        self, year_id: UUID, params: PaginationParams
    ) -> Page:
        await self.get_year_by_id(year_id)
        classes, total = await self.repo.list_classes(
            year_id, params.offset, params.limit
        )
        return make_page(classes, total, params)
