from sqlalchemy.ext.asyncio import AsyncSession
from app.classes.schema import ClasseCreate, ClasseOut
from app.classes.model import Classe
from uuid import UUID
from sqlalchemy import select


class ClasseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, year_id: str | UUID) -> ClasseOut:
        normalized = year_id if isinstance(year_id, UUID) else UUID(year_id)
        stmt = await self.db.execute(select(Classe).where(Classe.id == normalized))
        return stmt.scalar_one_or_none()

    async def get_activate_year(self):
        stmt = await self.db.execute(select(Classe).where(Classe.is_active == True))
        return stmt.scalar_one_or_none()

    async def create(self, data: dict) -> ClasseOut:
        year = Classe(**data)
        self.db.add(year)
        await self.db.commit()
        await self.db.refresh(year)
        return year

    async def update(self, year: Classe, data: dict) -> ClasseOut:
        for key, value in data.items():
            setattr(year, key, value)
        await self.db.commit()
        await self.db.refresh(year)
        return year

    async def delete(self, year: Classe) -> None:
        await self.db.delete(year)
        await self.db.commit()

    async def list_all_year(self):
        stmt = await self.db.execute(select(Classe))
        return stmt.scalars().all()
