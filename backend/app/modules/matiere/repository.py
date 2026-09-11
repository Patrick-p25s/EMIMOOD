from uuid import UUID

from app.modules.matiere.model import Subject
from app.modules.matiere.schema import SubjectCreate, SubjectOut
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession


class SubjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, matiere_id: str | UUID) -> SubjectOut:
        normalized = matiere_id if isinstance(matiere_id, UUID) else UUID(matiere_id)
        stmt = await self.db.execute(select(Subject).where(Subject.id == normalized))
        return stmt.scalar_one_or_none()

    async def get_by_name(
        self, name: str, classe_id: UUID | str
    ) -> Subject | None:
        stmt = await self.db.execute(
            select(Subject).where(
                Subject.name == name,
                Subject.classe_id == classe_id,
            )
        )
        return stmt.scalar_one_or_none()

    async def create(self, data: dict) -> SubjectOut:
        matiere = Subject(**data)
        self.db.add(matiere)
        await self.db.commit()
        await self.db.refresh(matiere)
        return matiere

    async def update(self, matiere: Subject, data: dict) -> SubjectOut:
        for key, value in data.items():
            setattr(matiere, key, value)
        await self.db.commit()
        await self.db.refresh(matiere)
        return matiere

    async def delete(self, matiere: Subject) -> None:
        await self.db.delete(matiere)
        await self.db.commit()

    async def count(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(Subject))
        return result.scalar_one_or_none()

    async def list_all_matiere(
        self, offset: int, limit: int
    ) -> tuple[list[Subject], int]:
        total = await self.count()
        stmt = await self.db.execute(
            select(Subject).order_by(Subject.name).offset(offset).limit(limit)
        )
        return stmt.scalars().all(), total

    async def get_by_classe(self, classe_id: UUID | str, offset: int, limit: int):
        normalized = classe_id if isinstance(classe_id, UUID) else UUID(classe_id)
        total_result = await self.db.execute(
            select(func.count()).select_from(Subject).where(Subject.classe_id == normalized)
        )
        total = total_result.scalar_one()
        stmt = await self.db.execute(
            select(Subject)
            .where(Subject.classe_id == normalized)
            .order_by(Subject.name)
            .offset(offset)
            .limit(limit)
        )
        return stmt.scalars().all(), total
