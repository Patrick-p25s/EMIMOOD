from uuid import UUID

from app.modules.annonce.model import Annonce, AnnonceLecture, AnnonceStatut
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession


class AnnonceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> Annonce:
        annonce = Annonce(**data)
        self.db.add(annonce)
        await self.db.commit()
        await self.db.refresh(annonce)
        return annonce

    async def get_by_id(self, annonce_id: UUID) -> Annonce | None:
        result = await self.db.execute(select(Annonce).where(Annonce.id == annonce_id))
        return result.scalar_one_or_none()

    async def update(self, annonce: Annonce, data: dict) -> Annonce:
        for key, value in data.items():
            setattr(annonce, key, value)
        await self.db.commit()
        await self.db.refresh(annonce)
        return annonce

    async def list_by_status(
        self,
        statut: AnnonceStatut,
        classe_id: UUID | None,
        offset: int,
        limit: int,
    ) -> tuple[list[Annonce], int]:
        statement = select(Annonce).where(Annonce.statut == statut)
        if classe_id is not None:
            statement = statement.where(
                or_(Annonce.classe_id == classe_id, Annonce.classe_id.is_(None))
            )
        total_result = await self.db.execute(
            select(func.count()).select_from(statement.subquery())
        )
        result = await self.db.execute(
            statement.order_by(Annonce.created_at.desc()).offset(offset).limit(limit)
        )
        return result.scalars().all(), total_result.scalar_one()


class AnnonceLectureRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> AnnonceLecture:
        lecture = AnnonceLecture(**data)
        self.db.add(lecture)
        await self.db.commit()
        await self.db.refresh(lecture)
        return lecture

    async def exists(self, annonce_id: UUID, user_id: UUID) -> bool:
        result = await self.db.execute(
            select(AnnonceLecture.id).where(
                AnnonceLecture.annonce_id == annonce_id,
                AnnonceLecture.user_id == user_id,
            )
        )
        return result.scalar_one_or_none() is not None

    async def get_lecteur_ids(self, annonce_id: UUID) -> list[UUID]:
        result = await self.db.execute(
            select(AnnonceLecture.user_id).where(
                AnnonceLecture.annonce_id == annonce_id
            )
        )
        return list(result.scalars().all())
