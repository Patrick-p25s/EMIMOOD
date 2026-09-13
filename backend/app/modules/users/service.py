from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.pagination import Page, PaginationParams, make_page
from app.core.security import hash_password, verify_password
from app.modules.classes.repository import ClasseRepository
from app.modules.users.model import UserRole
from app.modules.users.repository import UserRepository
from app.modules.users.schema import UpdatePassword, UpdateProfile, UserCreate, UserOut


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
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        classe = await self.classe_repo.get_by_code_invitation(request.code_invitation)
        if classe is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Code d'invitation invalide",
            )

        if (
            await self.user_repo.get_by_matricule(matricule=request.matricule)
            is not None
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Matricule déjà inscrit"
            )
        data = {
            "matricule": request.matricule,
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

        existing_user = await self.user_repo.get_by_email(request.email)
        if existing_user is not None and existing_user.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "phone_number": request.phone_number,
        }
        return await self.user_repo.update(user, data)

    async def update_password(self, id: UUID | str, request: UpdatePassword) -> UserOut:
        user = await self._get_user_by_id(id)
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Mot de passe incorrecte"
            )
        data = {"password_hash": hash_password(request.new_password)}
        return await self.user_repo.update(user, data)

    async def get_all_users(self, params: PaginationParams) -> Page[UserOut]:
        users, total = await self.user_repo.list_all(
            limit=params.limit, offset=params.offset
        )
        return make_page([UserOut.model_validate(u) for u in users], total, params)

    async def delete_user(self, id: UUID | str, requester_id: UUID) -> bool:
        user = await self._get_user_by_id(id)
        if user.id != requester_id:
            await self.user_repo.delete(user)
            return True
        return False

    async def get_classe_user(self, current_user_id: str):
        return await self.user_repo.get_user_classe(current_user_id)
