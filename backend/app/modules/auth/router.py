from app.modules.auth.repository import RefreshSessionRepository
from app.modules.auth.schema import (
    AuthTokens,
    LoginRequest,
    LogoutRequest,
    LogoutResponse,
    RefreshRequest,
)
from app.modules.auth.service import AuthService
from app.core.database import get_db
from app.core.limiter import limiter
from app.modules.users.repository import UserRepository
from fastapi import APIRouter, Depends, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession


def _get_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db), RefreshSessionRepository(db))


router = APIRouter(prefix="/auth", tags=["Authentification & Jetons"])


@router.post(
    "/login",
    response_model=AuthTokens,
    status_code=status.HTTP_200_OK,
    summary="Connexion utilisateur",
    description="Authentifie un utilisateur via e-mail et mot de passe. Renvoie un couple de jetons (access token + refresh token). Limité à 5 requêtes par minute.",
)
@limiter.limit("5/minute")
async def login(
    request: Request,
    form_data: LoginRequest,
    service: AuthService = Depends(_get_service),
) -> AuthTokens:
    return await service.login(form_data)


@router.post(
    "/docs/login",
    include_in_schema=False,
    summary="Connexion Swagger UI",
    description="Endpoint interne permettant d'alimenter le cadenas d'authentification de Swagger UI.",
)
async def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(_get_service),
):
    payload = LoginRequest(email=form_data.username, password=form_data.password)
    tokens = await service.login(payload)
    return {
        "access_token": tokens.accessToken,
        "token_type": "bearer",
    }


@router.post(
    "/refresh",
    response_model=AuthTokens,
    status_code=status.HTTP_200_OK,
    summary="Rafraîchir les jetons",
    description="Périme l'ancien refresh token et génère une nouvelle paire de jetons d'accès et de rafraîchissement.",
)
async def refresh(
    payload: RefreshRequest,
    service: AuthService = Depends(_get_service),
) -> AuthTokens:
    return await service.refresh(payload)


@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK,
    summary="Déconnexion",
    description="Révoque la session de rafraîchissement côté serveur.",
)
async def logout(
    payload: LogoutRequest,
    service: AuthService = Depends(_get_service),
) -> LogoutResponse:
    return await service.logout(payload)
