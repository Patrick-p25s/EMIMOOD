from app.modules.feedback.repository import FeedBackRepository, Feedback
from fastapi import HTTPException, status
from app.modules.feedback.schema import CreateFeedBack, FeedBackRead
from uuid import UUID
from app.core.pagination import make_page, Page, PaginationParams


class FeedBackService:
    def __init__(self, repo: FeedBackRepository):
        self.repo = repo

    async def create_feedback(self, data: CreateFeedBack) -> FeedBackRead:
        feedback = {
            "titre": data.titre,
            "description": data.description,
            "contact": data.contact,
        }
        return await self.repo.create(feedback)

    async def get_all(self, params: PaginationParams) -> Page[FeedBackRead]:
        total, feedbacks = await self.repo.get_all(params.offset, params.limit)
        return make_page(feedbacks, total, params)

    async def get_one_feedback(self, id: str) -> FeedBackRead:
        result = await self.repo.get_by_id(id)
        if result is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "Aucune feedback correspondant"
            )

        return result

    async def delete_feedback(self, id: str) -> None:
        feedback = await self.get_one_feedback(id)
        return await self.repo.delete(feedback)

    async def read_feedback(self, id: str) -> FeedBackRead:
        feedback = await self.get_one_feedback(id)
        return await self.repo.read_feedback(feedback)
