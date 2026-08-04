from app.years.repository import YearRepository
from app.classes.repository import ClasseRepository
from app.classes.schema import ClasseOut, ClasseCreate
from fastapi import HTTPException, status


class ClasseService:
    def __init__(self, year_repo: YearRepository, class_repo: ClasseRepository):
        self.year_repo = year_repo
        self.class_repo = class_repo

    async def create_classe(self, request: ClasseCreate) -> ClasseOut:
        year = await self.year_repo.get_activate_year()
        if year is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Aucune année est activée",
            )

        data = {
            "mention": request.mention,
            "niveau": request.niveau,
            "year_id": year.id,
        }
        return await self.class_repo.create(data)
