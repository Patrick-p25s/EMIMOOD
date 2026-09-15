from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.core.pagination import Page, PaginationParams, make_page
from app.core.security import hash_password, verify_password
from app.modules.classes.repository import ClasseRepository
from app.modules.users.model import UserRole, Users
from app.modules.users.repository import UserRepository
from app.modules.users.schema import (
    UpdatePassword,
    UpdateProfile,
    UserCreate,
    UserOut,
    ModeratorCreate,
)
from app.core.normalised_id import normalized_id


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

    async def create_moderator(
        self, request: ModeratorCreate, classe_id: str
    ) -> UserOut:
        existing_user = await self.user_repo.get_by_email(request.email)
        if existing_user is not None:
            raise HTTPException(400, "Email already registered")
        data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "email": request.email,
            "role": UserRole.moderator.value,
            "password_hash": hash_password(request.password),
            "phone_number": request.phone_number,
            "classe_id": normalized_id(classe_id),
        }
        return await self.user_repo.create(data)

    async def update_profile(
        self, user_id: str | None, current_user_id: UUID | str, request: UpdateProfile
    ) -> UserOut:
        current_user = await self._get_user_by_id(current_user_id)
        if user_id is not None:
            user = await self._get_user_by_id(user_id)

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
        if user_id is not None:
            return await self.user_repo.update(user, data)
        return await self.user_repo.update(current_user, data)

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

    async def get_classe_user(self, user_id: str | None, current_user_id: str):
        if user_id is not None:
            return await self.user_repo.get_user_classe(user_id)
        return await self.user_repo.get_user_classe(current_user_id)

    async def new_classe(
        self, user_id: str, current_user: Users, code_invitation: str
    ) -> Users:
        user = await self._get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Aucune utilisateur trouvé")
        if current_user.role == UserRole.student:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN, "Vous ne pouvez pas modifier la classe"
            )
        classe = await self.classe_repo.get_by_code_invitation(code_invitation)
        if classe is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Aucune classe trouvé")

        return await self.user_repo.update(user, {"classe_id": classe.id})
