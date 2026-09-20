# app/core/cookies.py
from fastapi import Response
from app.core.config import setting


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=setting.EXPIRES_DAYS_TOKEN * 24 * 60 * 60,
        path="/auth/refresh",
    )


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key="refresh_token", path="/auth/refresh")
