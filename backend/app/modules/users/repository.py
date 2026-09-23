from uuid import UUID

from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.classes.model import Classe
from app.modules.documents.model import Document, DocumentSauvegarde
from app.modules.users.model import Users
from app.modules.users.schema import UserOut
from sqlalchemy.orm import joinedload
from app.core.normalised_id import normalized_id


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str | UUID) -> UserOut:
        stmt = await self.db.execute(
            select(Users)
            .options(joinedload(Users.classe))
            .where(Users.id == normalized_id(user_id))
        )
        return stmt.scalar_one_or_none()

    async def get_by_email(self, email: str) -> UserOut | None:
        result = await self.db.execute(
            select(Users).options(joinedload(Users.classe)).where(Users.email == email)
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> UserOut:
        user = Users(**data)
        self.db.add(user)
        await self.db.commit()
        result = self.db.execute(
            select(Users).options(joinedload(Users.classe)).where(Users.id == user.id)
        )
        return result

    async def get_by_matricule(self, matricule: str):
        result = await self.db.execute(
            select(Users)
            .options(joinedload(Users.classe))
            .where(Users.matricule == matricule)
        )
        return result.scalar_one_or_none()

    async def update(self, user: Users, data: dict) -> UserOut:
        for key, value in data.items():
            setattr(user, key, value)
        await self.db.commit()
        result = await self.db.execute(
            select(Users).options(joinedload(Users.classe)).where(Users.id == user.id)
        )
        return result.scalar_one()

    async def delete(self, user: Users) -> None:
        await self.db.delete(user)
        await self.db.commit()

    async def list_all(
        self,
        id: UUID | str,
        classe_id: UUID | str | None = None,
        search: str | None = None,
        classe_id_filter: str | None = None,
        offset: int = 1,
        limit: int = 20,
    ) -> tuple[list[Users], int]:
        total_result = await self.db.execute(
            select(func.count()).select_from(Users).where(Users.role != "admin")
        )
        total = total_result.scalar_one()
        query = (
            select(Users)
            .options(joinedload(Users.classe))
            .where(Users.role != "admin")
            .where(Users.id != normalized_id(id))
            .order_by(Users.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        if search and len(search) > 3:
            search_pattern = f"%{search.strip()}%"
            query = query.where(
                or_(
                    Users.first_name.ilike(search_pattern),
                    Users.last_name.ilike(search_pattern),
                    Users.matricule.ilike(search_pattern),
                )
            )

        if classe_id_filter is not None:
            query.where(Users.classe_id == normalized_id(classe_id))

        if classe_id is not None:
            query.where(Users.classe_id == normalized_id(classe_id))

        stmt = await self.db.execute(query)
        return stmt.scalars().all(), total

    async def list_student_ids(self, classe_id: UUID | None = None) -> list[UUID]:
        statement = select(Users.id).where(Users.role == "student")
        if classe_id is not None:
            statement = statement.where(Users.classe_id == normalized_id(classe_id))
        result = await self.db.execute(statement)
        return list(result.scalars().all())

    async def count(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(Users))
        return result.scalar_one()

    async def get_user_classe(self, user_id: UUID):
        stmt = (
            select(Classe)
            .join(Users, Users.classe_id == Classe.id)
            .where(Users.id == normalized_id(user_id))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
