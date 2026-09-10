from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.classes.model import Classe
from app.modules.users.model import User
from app.modules.users.schema import UserOut


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str | UUID) -> UserOut:
        normalized = user_id if isinstance(user_id, UUID) else UUID(user_id)
        stmt = await self.db.execute(select(User).where(User.id == normalized))
        return stmt.scalar_one_or_none()

    async def get_by_email(self, email: str) -> UserOut | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> UserOut:
        user = User(**data)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_by_matricule(self, matricule: str):
        result = await self.db.execute(
            select(User).where(User.matricule == matricule)
        )
        return result.scalar_one_or_none()

    async def update(self, user: User, data: dict) -> UserOut:
        for key, value in data.items():
            setattr(user, key, value)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete(self, user: User) -> None:
        await self.db.delete(user)
        await self.db.commit()

    async def list_all(self, offset: int, limit: int) -> list[UserOut]:
        total = self.count()
        stmt = await self.db.execute(
            select(User).where(User.role != "admin").offset(offset).limit(limit)
        )
        return stmt.scalars().all(), total

    async def count(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(User))
        return result.scalar_one()

    async def get_user_classe(self, user_id: UUID):
        stmt = (
            select(Classe)
            .join(User, User.classe_id == Classe.id)
            .where(User.id == user_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
