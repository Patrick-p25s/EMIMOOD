from app.users.repository import UserRepository
from app.users.schema import UserOut, UserCreate
from app.users.model import Users
from app.core.security import hash_password
from fastapi import HTTPException, status


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

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
