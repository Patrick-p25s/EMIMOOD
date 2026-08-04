from app.years.repository import YearRepository
from app.years.schema import YearOut, YearCreate
from fastapi import HTTPException, status, Depends
from uuid import UUID


class YearService:
    def __init__(self, repo: YearRepository):
        self.repo = repo

    async def get_year_by_id(self, id: UUID | str):
        year = await self.repo.get_by_id(year_id=id)
        if year is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Year not found"
            )
        return year

    async def get_all_year(self):
        return await self.repo.list_all_year()

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

    async def activate_or_desactivate_year(self, id: UUID | str):
        year = self.get_year_by_id(id)
        data = {"is_active": not year.is_active}
        return await self.repo.update(year, data)
