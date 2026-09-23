from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str
    password: str = Field(min_length=1)

    model_config = {
        "json_schema_extra": {
            "example": {"email": "user@example.com", "password": "your_password"}
        }
    }


class RefreshRequest(BaseModel):
    # Optionnel : le cookie peut être absent, c'est au service de le détecter
    # et de lever un 401 propre — pas à Pydantic de planter en 500 avant.
    refreshToken: str | None = None

    model_config = {"json_schema_extra": {"example": {"refreshToken": "jwt"}}}


class LogoutRequest(BaseModel):
    refreshToken: str | None = None

    model_config = {"json_schema_extra": {"example": {"refreshToken": "jwt"}}}


class AccessTokenResponse(BaseModel):
    accessToken: str  # corrigé : "accesToken" -> "accessToken"


class AuthTokens(BaseModel):
    accessToken: str
    refreshToken: str

    model_config = {
        "json_schema_extra": {"example": {"accessToken": "jwt", "refreshToken": "jwt"}}
    }


class LogoutResponse(BaseModel):
    success: bool = True
