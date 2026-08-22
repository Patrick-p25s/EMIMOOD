from uuid import UUID

from app.modules.annonce.model import Annonce, AnnonceLecture, AnnonceStatut
from sqlalchemy import select
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

    async def get_active(self) -> list[Annonce]:
        result = await self.db.execute(
            select(Annonce).where(Annonce.statut == AnnonceStatut.active)
        )
        return result.scalars().all()

    async def get_archive(self) -> list[Annonce]:
        result = await self.db.execute(
            select(Annonce).where(Annonce.statut == AnnonceStatut.archivee)
        )
        return result.scalars().all()

    async def get_active_by_classe(self, classe_id: UUID) -> list[Annonce]:
        """Annonces actives visibles par un étudiant : celles de sa classe + les globales."""
        result = await self.db.execute(
            select(Annonce).where(
                Annonce.statut == AnnonceStatut.active,
                (Annonce.classe_id == classe_id) | (Annonce.classe_id.is_(None)),
            )
        )
        return result.scalars().all()

    async def delete(self, annonce: Annonce):
        await self.db.delete(annonce)
        await self.db.commit()


class AnnonceLectureRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> AnnonceLecture:
        lecture = AnnonceLecture(**data)
        self.db.add(lecture)
        await self.db.commit()
        await self.db.refresh(lecture)
        return lecture

    async def update(self, annonce: AnnonceLecture, data: dict) -> AnnonceLecture:
        for key, value in data.items():
            setattr(annonce, key, value)

        await self.db.commit()
        await self.db.refresh(annonce)
        return annonce

    async def get_lectureBy(self, annonce_id: UUID | str):
        id = annonce_id if isinstance(annonce_id, UUID) else UUID(annonce_id)
        stmt = await self.db.execute(
            select(AnnonceLecture).where(AnnonceLecture.id == id)
        )
        return stmt.scalar_one_or_none()

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
