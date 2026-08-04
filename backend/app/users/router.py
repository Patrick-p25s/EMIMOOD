from app.users.repository import UserRepository
from app.users.service import UserService
from app.users.schema import UserCreate, UserOut, UpdateProfile, UpdatePassword
from app.users.model import Users
from app.core.database import get_db
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, require_admin

from sqlalchemy.ext.asyncio import AsyncSession


def _get_user_service(db: AsyncSession = Depends(get_db)):
    return UserService(user_repo=UserRepository(db=db))


router = APIRouter(prefix="/user", tags=["Route de l'utilisateur"])


@router.post("/register")
async def register(
    request: UserCreate, service: UserService = Depends(_get_user_service)
):
    return await service.register(request=request)


@router.get("/me")
def get_my_profile(user: UserOut = Depends(get_current_user)):
    print("Test de flush")
    return user


@router.put("/update")
async def update_my_profile(
    request: UpdateProfile,
    user: UserOut = Depends(get_current_user),
    service: UserService = Depends(_get_user_service),
):
    return await service.update_profile(user.id, request)


@router.patch("/password")
async def update_my_profile(
    request: UpdatePassword,
    user: UserOut = Depends(get_current_user),
    service: UserService = Depends(_get_user_service),
):
    return await service.update_password(user.id, request)


@router.delete("/{id}")
async def delete_user(
    id: str,
    user: Users = Depends(require_admin),
    service: UserService = Depends(_get_user_service),
):
    return await service.delete_user(id=id, requester_id=user.id)


@router.get("/all")
async def delete_user(
    user: Users = Depends(require_admin),
    service: UserService = Depends(_get_user_service),
):
    return await service.get_all_users()
