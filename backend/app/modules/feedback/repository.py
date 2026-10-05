from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.feedback.model import Feedback
from sqlalchemy import func, select
from uuid import UUID
from app.core.normalised_id import normalized_id


class FeedBackRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> Feedback:
        new_feedback = Feedback(**data)
        self.db.add(new_feedback)
        await self.db.commit()
        await self.db.refresh(new_feedback)
        return new_feedback

    async def count(self) -> int:
        count = await self.db.execute(select(func.count()).select_from(Feedback))
        return count.scalar_one() or 0

    async def get_all(
        self, offset: int = 1, limit: int = 20
    ) -> tuple[int, list[Feedback]]:
        result = await self.db.execute(
            select(Feedback)
            .order_by(Feedback.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        total = await self.count()
        return total, result.scalars().all()

    async def get_by_id(self, id: UUID | str) -> Feedback:
        result = await self.db.execute(
            select(Feedback).where(Feedback.id == normalized_id(id))
        )
        return result.scalar_one_or_none()

    async def read_feedback(self, feedback: Feedback):
        feedback.is_read = True
        await self.db.commit()
        await self.db.refresh(feedback)
        return feedback

    async def delete(self, feedback: Feedback) -> None:
        await self.db.delete(feedback)
        await self.db.commit()
