from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone, UTC
from app.core.config import setting

import jwt
from jwt.exceptions import InvalidTokenError
from uuid import uuid4

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: str, role: str, email: str) -> str:
    now = datetime.now(timezone.utc)
    expires = now + timedelta(minutes=setting.EXPIRES_MINUTES_TOKEN)
    payload = {
        "sub": user_id,
        "user_id": user_id,
        "exp": expires,
        "iat": now,
        "role": role,
        "email": email,
    }

    return jwt.encode(
        payload=payload, key=setting.SECRET_KEY, algorithm=setting.ALGORITHM
    )


def create_refresh_token(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    expires = now + timedelta(days=setting.EXPIRES_DAYS_TOKEN)
    jti = str(uuid4())
    payload = {"sub": user_id, "exp": expires, "iat": now, "jti": jti}

    return jwt.encode(
        payload=payload, key=setting.SECRET_KEY, algorithm=setting.ALGORITHM
    ), jti


def decode_token(token: str):
    try:
        payload = jwt.decode(
            jwt=token, key=setting.SECRET_KEY, algorithms=[setting.ALGORITHM]
        )
        return payload
    except InvalidTokenError:
        return None
