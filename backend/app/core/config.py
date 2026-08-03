from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    DATABASE_URL : str = "sqlite+oisqlite:///./database.db"
    ALGORITHM : str = "HS268"
    SECRET_KEY : str = "my_secret"
    EXPIRES_MINUTES_TOKEN : str = 10
    EXPIRES_DAYS_TOKEN : str = 2

setting = Settings()

