import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_FILE = Path(__file__).resolve().parents[2] / ".env"

load_dotenv(ENV_FILE, override=False)


class Settings(BaseSettings):
    app_name: str = "JOBIX API"
    app_env: str = "development"
    debug: bool = True

    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    frontend_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings(
    database_url=os.environ.get("DATABASE_URL", ""),
    jwt_secret_key=os.environ.get("JWT_SECRET_KEY", ""),
)