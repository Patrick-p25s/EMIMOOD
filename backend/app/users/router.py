from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.users.model import Users
from app.users.repository import UserRepository
from app.users.schema import (
    UpdatePassword,
    UpdateProfile,
    UserCreate,
    UserOut,
    UserRead,
)
from app.users.service import UserService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.classes.repository import ClasseRepository


def _get_user_service(db: AsyncSession = Depends(get_db)):
    return UserService(
        user_repo=UserRepository(db=db), classe_repo=ClasseRepository(db)
    )


router = APIRouter(prefix="/user", tags=["Route de l'utilisateur"])


@router.post("/register", response_model=UserRead)
async def register(
    request: UserCreate, service: UserService = Depends(_get_user_service)
) -> UserRead:
    user = await service.register(request=request)
    return UserRead.model_validate(user)


@router.get("/me", response_model=UserRead)
def get_my_profile(user: UserOut = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(user)


@router.put("/update", response_model=UserRead)
async def update_my_profile(
    request: UpdateProfile,
    user: UserOut = Depends(get_current_user),
    service: UserService = Depends(_get_user_service),
) -> UserRead:
    user = await service.update_profile(user.id, request)
    return UserRead.model_validate(user)


@router.patch("/password", response_model=UserRead)
async def update_password(
    request: UpdatePassword,
    user: UserOut = Depends(get_current_user),
    service: UserService = Depends(_get_user_service),
) -> UserRead:
    user = await service.update_password(user.id, request)
    return UserRead.model_validate(user)


@router.delete("/{id}")
async def delete_one_user(
    id: str,
    user: Users = Depends(require_admin),
    service: UserService = Depends(_get_user_service),
) -> bool:
    return await service.delete_user(id=id, requester_id=user.id)


@router.get("/all", response_model=list[UserOut])
async def get_all_user(
    user: Users = Depends(require_admin),
    service: UserService = Depends(_get_user_service),
) -> list[UserOut]:
    return await service.get_all_users()


@router.post("/create-moderator")
async def register(
    request: UserCreate,
    service: UserService = Depends(_get_user_service),
    user: Users = Depends(require_admin),
) -> UserOut:
    user = await service.register(request=request)
    return UserRead.model_validate(user)
