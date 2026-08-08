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
        year = self.get_year_by_id(id)
        await self.repo.delete(year=year)
        return True

    async def activate_year(self, id: UUID | str) -> bool:
        years = await self.get_all_year()

        target_found = False
        for year in years:
            if str(year.id) != str(id):
                print("active", year.id)
                await self.repo.update(year, {"is_active": False})

            else:
                print("Desactive", year.id)
                await self.repo.update(year, {"is_active": True})
                target_found = True
        return target_found

    async def get_all_classe(self, year_id: UUID):
        return await self.repo.get_all_classe(year_id)
