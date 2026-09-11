from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.classes.model import Classe
from app.modules.years.model import YearUniv
from app.modules.years.schema import YearOut


class YearRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, year_id: str | UUID) -> YearOut:
        normalized = year_id if isinstance(year_id, UUID) else UUID(year_id)
        stmt = await self.db.execute(select(YearUniv).where(YearUniv.id == normalized))
        return stmt.scalar_one_or_none()

    async def get_activate_year(self):
        stmt = await self.db.execute(select(YearUniv).where(YearUniv.is_active == True))
        return stmt.scalar_one_or_none()

    async def create(self, data: dict) -> YearOut:
        year = YearUniv(**data)
        self.db.add(year)
        await self.db.commit()
        await self.db.refresh(year)
        return year

    async def update(self, year: YearUniv, data: dict) -> YearOut:
        for key, value in data.items():
            setattr(year, key, value)
        await self.db.commit()
        await self.db.refresh(year)
        return year

    async def activate(self, year_id: UUID) -> YearUniv | None:
        await self.db.execute(update(YearUniv).values(is_active=False))
        result = await self.db.execute(
            update(YearUniv)
            .where(YearUniv.id == year_id)
            .values(is_active=True)
            .returning(YearUniv)
        )
        year = result.scalar_one_or_none()
        await self.db.commit()
        return year

    async def delete(self, year: YearUniv) -> None:
        await self.db.delete(year)
        await self.db.commit()

    async def count(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(YearUniv))
        return result.scalar_one()

    async def list_all_year(self, offset: int, limit: int) -> tuple[list[YearUniv], int]:
        total = await self.count()
        stmt = await self.db.execute(
            select(YearUniv)
            .order_by(YearUniv.start_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return stmt.scalars().all(), total

    async def list_classes(
        self, year_id: UUID, offset: int, limit: int
    ) -> tuple[list[Classe], int]:
        total_result = await self.db.execute(
            select(func.count()).select_from(Classe).where(Classe.year_id == year_id)
        )
        result = await self.db.execute(
            select(Classe)
            .where(Classe.year_id == year_id)
            .order_by(Classe.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all(), total_result.scalar_one()
