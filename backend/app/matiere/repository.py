from uuid import UUID

from app.matiere.model import Subject
from app.matiere.schema import SubjectCreate, SubjectOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class SubjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, matiere_id: str | UUID) -> SubjectOut:
        normalized = matiere_id if isinstance(matiere_id, UUID) else UUID(matiere_id)
        stmt = await self.db.execute(select(Subject).where(Subject.id == normalized))
        return stmt.scalar_one_or_none()

    async def get_by_name(self, name: str) -> SubjectOut:
        stmt = await self.db.execute(select(Subject).where(Subject.name == name))
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

    async def list_all_matiere(self) -> list[SubjectOut]:
        stmt = await self.db.execute(select(Subject))
        return stmt.scalars().all()
