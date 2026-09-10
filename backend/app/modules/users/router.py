from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, require_moderator
from app.core.pagination import PaginationParams
from app.modules.classes.repository import ClasseRepository
from app.modules.users.model import User
from app.modules.users.repository import UserRepository
from app.modules.users.schema import (
    UpdatePassword,
    UpdateProfile,
    UserCreate,
    UserRead,
)
from app.modules.users.service import UserService


def _get_user_service(db: AsyncSession = Depends(get_db)) ->UserService:
    return  UserService(
        user_repo=UserRepository(db=db), classe_repo=ClasseRepository(db)
    )


router = APIRouter(prefix="/users", tags=["Gestion des Utilisateurs"])


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Inscrire un nouvel utilisateur",
    description="Permet l'inscrire d'un compte utilisateur standard (étudiant/candidat).",
)
async def register_user(
    request: UserCreate, service:UserService = Depends(_get_user_service)
) -> UserRead:
    user = await service.register(request=request)
    return UserRead.model_validate(user)


@router.get(
    "/me",
    response_model=UserRead,
    summary="Récupérer mon profil",
    description="Renvoie les informations de l'utilisateur actuellement connecté.",
)
async def get_my_profile(user:User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(user)


@router.put(
    "/me",
    response_model=UserRead,
    summary="Mettre à jour mon profil",
    description="Met à jour les informations personnelles du compte connecté.",
)
async def update_my_profile(
    request: UpdateProfile,
    user:User = Depends(get_current_user),
    service:UserService = Depends(_get_user_service),
) -> UserRead:
    updated_user = await service.update_profile(user.id, request)
    return UserRead.model_validate(updated_user)


@router.patch(
    "/me/password",
    response_model=UserRead,
    summary="Changer mon mot de passe",
    description="Permet à l'utilisateur connecté de modifier son mot de passe.",
)
async def update_my_password(
    request: UpdatePassword,
    user:User = Depends(get_current_user),
    service:UserService = Depends(_get_user_service),
) -> UserRead:
    updated_user = await service.update_password(user.id, request)
    return UserRead.model_validate(updated_user)


@router.get(
    "",
    summary="Lister tous les utilisateurs",
    description="Récupère la liste globale de tous les utilisateurs inscrits (Réservé aux administrateurs).",
)
async def get_all_users(
    params: PaginationParams = Depends(),
    user:User = Depends(require_admin),
    service:UserService = Depends(_get_user_service),
):
    return await service.get_all_users(params)


@router.post(
    "/moderators",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="Créer un compte modérateur",
    description="Permet à un administrateur de créer un compte avec les privilèges de modérateur.",
)
async def create_moderator(
    request: UserCreate,
    user:User = Depends(require_admin),
    service:UserService = Depends(_get_user_service),
) -> UserRead:
    moderator = await service.create_moderator(request=request)
    return UserRead.model_validate(moderator)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Supprimer un utilisateur",
    description="Supprime définitivement un compte utilisateur via son UUID (Réservé aux administrateurs).",
)
async def delete_one_user(
    user_id: UUID,
    user:User = Depends(require_moderator),
    service:UserService = Depends(_get_user_service),
) -> None:
    return await service.delete_user(id=user_id, requester_id=user.id)


@router.get("/classe")
async def get_user_classe(
    user:User = Depends(get_current_user),
    service:UserService = Depends(_get_user_service),
):
    return await service.get_classe_user(user.id)
