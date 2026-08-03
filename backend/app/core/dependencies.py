from app.core.database import get_db
from app.core.security import decode_token
from app.users.repository import UserRepository
from app.users.model import UserRole
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

auth_scheme = OAuth2PasswordBearer("/auth/docs/login")


async def get_current_user(
    token: str = Depends(auth_scheme), db: AsyncSession = Depends(get_db)
):
    payload = decode_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalide credentials"
        )

    user = await UserRepository(db).get_by_id(payload["user_id"])

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    return user


def require_role(*roles: UserRole):
    allowed = {r.value for r in roles}

    async def _check(user=Depends(get_current_user)):
        user_role = (
            user.role.value if isinstance(user.role, UserRole) else str(user.role)
        )
        if user_role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return user

    return _check


def require_admin(user=Depends(get_current_user)):
    user_role = user.role.value if isinstance(user.role, UserRole) else str(user.role)
    if user_role != UserRole.admin.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user
