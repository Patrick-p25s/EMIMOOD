from uuid import UUID

from app.classes.model import Classe
from app.classes.schema import ClasseOut
from sqlalchemy import select
from app.users.model import Users, UserRole
from sqlalchemy.ext.asyncio import AsyncSession


class ClasseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, classe_id: str | UUID) -> ClasseOut:
        normalized = classe_id if isinstance(classe_id, UUID) else UUID(classe_id)
        stmt = await self.db.execute(select(Classe).where(Classe.id == normalized))
        return stmt.scalar_one_or_none()

    async def get_by_code_invitation(self, code: str) -> ClasseOut:
        stmt = await self.db.execute(
            select(Classe).where(Classe.code_invitation == code)
        )
        return stmt.scalar_one_or_none()

    async def get_activate_classe(self):
        stmt = await self.db.execute(select(Classe).where(Classe.is_active == True))
        return stmt.scalar_one_or_none()

    async def create(self, data: dict) -> ClasseOut:
        classe = Classe(**data)
        self.db.add(classe)
        await self.db.commit()
        await self.db.refresh(classe)
        return classe

    async def update(self, classe: Classe, data: dict) -> ClasseOut:
        for key, value in data.items():
            setattr(classe, key, value)
        await self.db.commit()
        await self.db.refresh(classe)
        return classe

    async def delete(self, classe: Classe) -> None:
        await self.db.delete(classe)
        await self.db.commit()

    async def list_all_classe(self) -> list[ClasseOut]:
        stmt = await self.db.execute(select(Classe))
        return stmt.scalars().all()

    async def get_all_student(self, classe_id: UUID):
        result = await self.db.execute(
            select(Users)
            .where(Users.classe_id == classe_id)
            .where(Users.role == UserRole.student.value)
        )
        return result.scalars().all()
