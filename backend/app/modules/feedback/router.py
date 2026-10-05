from fastapi import APIRouter, Depends
from app.modules.feedback.repository import FeedBackRepository
from app.modules.feedback.service import FeedBackService
from app.modules.feedback.schema import CreateFeedBack, FeedBackRead
from app.core.database import get_db
from app.core.pagination import Page, PaginationParams
from app.core.dependencies import require_admin, get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.users.model import Users


def get_service(db: AsyncSession = Depends(get_db)):
    return FeedBackService(FeedBackRepository(db))


router = APIRouter(prefix="/feedback", tags=["Feedback de l'application"])


@router.post("", response_model=FeedBackRead)
async def create_new_feedback(
    data: CreateFeedBack,
    service: FeedBackService = Depends(get_service),
    user: Users = Depends(get_current_user),
) -> FeedBackRead:
    return await service.create_feedback(data)


@router.get("", response_model=Page[FeedBackRead])
async def get_all_feedback(
    params: PaginationParams = Depends(),
    service: FeedBackService = Depends(get_service),
    user: Users = Depends(require_admin),
) -> Page[FeedBackService]:
    return await service.get_all(params)


@router.patch("/{id}", response_model=FeedBackRead)
async def read_one_feedback(
    id: str,
    service: FeedBackService = Depends(get_service),
    user: Users = Depends(require_admin),
) -> FeedBackRead:
    return service.read_feedback(id)


@router.delete("/{id}", response_model=None)
async def delete_one_feedback(
    id: str,
    service: FeedBackService = Depends(get_service),
    user: Users = Depends(require_admin),
) -> None:
    return await service.delete_feedback(id)
