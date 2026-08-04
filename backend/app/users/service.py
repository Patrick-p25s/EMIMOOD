from app.users.repository import UserRepository
from app.users.schema import UserOut, UserCreate, UpdateProfile, UpdatePassword
from app.users.model import Users
from app.core.security import hash_password
from fastapi import HTTPException, status
from uuid import UUID


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def _get_user_by_id(self, id: UUID | str):
        user = await self.user_repo.get_by_id(user_id=id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user

    async def register(self, request: UserCreate):
        if await self.user_repo.get_by_email(request.email) is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "password_hash": hash_password(request.password),
            "phone_number": request.phone_number,
        }
        return await self.user_repo.create(data)

    async def update_profile(self, id: UUID | str, request: UpdateProfile):
        user = await self._get_user_by_id(id)

        data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "phone_number": request.phone_number,
        }
        return await self.user_repo.update(user, data)

    async def update_password(self, id: UUID | str, request: UpdatePassword):
        user = await self._get_user_by_id(id)
        data = {"password_hash": hash_password(request.new_password)}
        return await self.user_repo.update(user, data)

    async def get_all_users(self):
        return await self.user_repo.list_all()

    async def delete_user(self, id: UUID | str, requester_id: UUID):
        user = await self._get_user_by_id(id)
        if user.id != requester_id:
            await self.user_repo.delete(user)
            return True
        return False
