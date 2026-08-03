from app.users.repository import UserRepository
from app.users.service import UserService
from app.users.schema import UserCreate, UserOut
from app.core.database import get_db
from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession


def _get_user_service(db: AsyncSession = Depends(get_db)):
    return UserService(user_repo=UserRepository(db=db))


router = APIRouter(prefix="/user", tags=["Route de l'utilisateur"])


@router.post("/register")
async def register(
    request: UserCreate, service: UserService = Depends(_get_user_service)
):
    return await service.register(request=request)
