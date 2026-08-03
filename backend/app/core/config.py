from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    DATABASE_URL: str = "sqlite+oisqlite:///./database.db"
    ALGORITHM: str = "HS268"
    SECRET_KEY: str = "my_secret"
    EXPIRES_MINUTES_TOKEN: int = 10
    EXPIRES_DAYS_TOKEN: int = 2


setting = Settings()
