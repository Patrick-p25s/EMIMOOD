from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    DATABASE_URL: str = "sqlite+oisqlite:///./database.db"
    ALGORITHM: str = "HS268"
    SECRET_KEY: str = "my_secret"
    EXPIRES_MINUTES_TOKEN: int = 10
    EXPIRES_DAYS_TOKEN: int = 2
    ADMIN_NAME: str = "admin"
    ADMIN_EMAIL: str = "admin@emimood.com"
    ADMIN_PASSWORD: str = "password"
    AUTOCREATE_TABLE: bool = True
    MAX_UPLOAD_SIZE_MB: int = 20
    UPLOAD_DIR: str = "uploads"


setting = Settings()
