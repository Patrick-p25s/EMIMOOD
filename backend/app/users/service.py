from app.users.repository import UserRepository
from app.classes.repository import ClasseRepository
from app.users.schema import UserOut, UserCreate, UpdateProfile, UpdatePassword
from app.users.model import Users, UserRole
from sqlalchemy.exc import IntegrityError
from app.core.security import hash_password
from fastapi import HTTPException, status
from uuid import UUID
import asyncio


class UserService:
    def __init__(self, user_repo: UserRepository, classe_repo: ClasseRepository):
        self.user_repo = user_repo
        self.classe_repo = classe_repo

    async def _get_user_by_id(self, id: UUID | str) -> UserOut:
        user = await self.user_repo.get_by_id(user_id=id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user

    async def register(self, request: UserCreate) -> UserOut:
        existing_user = await self.user_repo.get_by_email(request.email)
        if existing_user is not None:
            raise HTTPException(400, "Email already registered")
        classe = await self.classe_repo.get_by_code_invitation(request.code_invitation)
        if classe is None:
            raise HTTPException(400, "Code d'invitation invalide")
        data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "password_hash": hash_password(request.password),
            "phone_number": request.phone_number,
            "classe_id": classe.id,
        }
        try:
            return await self.user_repo.create(data)
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Classe spécifié n'existe pas ",
            )

    async def create_moderator(self, request: UserCreate) -> UserOut:
        existing_user = await self.user_repo.get_by_email(request.email)
        if existing_user is not None:
            raise HTTPException(400, "Email already registered")
        classe = await self.classe_repo.get_by_code_invitation(request.code_invitation)
        if classe is None:
            raise HTTPException(400, "Code d'invitation invalide")

        data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "role": UserRole.moderator.value,
            "password_hash": hash_password(request.password),
            "phone_number": request.phone_number,
            "classe_id": classe.id,
        }
        try:
            return await self.user_repo.create(data)
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Classe spécifié n'existe pas ",
            )

    async def update_profile(self, id: UUID | str, request: UpdateProfile) -> UserOut:
        user = await self._get_user_by_id(id)

        data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "phone_number": request.phone_number,
        }
        return await self.user_repo.update(user, data)

    async def update_password(self, id: UUID | str, request: UpdatePassword) -> UserOut:
        user = await self._get_user_by_id(id)
        data = {"password_hash": hash_password(request.new_password)}
        return await self.user_repo.update(user, data)

    async def get_all_users(self) -> list[UserOut]:
        return await self.user_repo.list_all()

    async def delete_user(self, id: UUID | str, requester_id: UUID) -> bool:
        user = await self._get_user_by_id(id)
        if user.id != requester_id:
            await self.user_repo.delete(user)
            return True
        return False

    async def get_user_classe(self, user_id: UUID):
        return await self.user_repo.get_user_classe(user_id)
