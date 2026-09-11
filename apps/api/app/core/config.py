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
    backend_url: str = "http://127.0.0.1:8000"
    google_client_id: str
    google_client_secret: str
    linkedin_client_id: str
    linkedin_client_secret: str
    resend_api_key: str = ""
    email_from: str = ""

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings(
    database_url=os.environ.get("DATABASE_URL", ""),
    jwt_secret_key=os.environ.get("JWT_SECRET_KEY", ""),
    backend_url=os.environ.get("BACKEND_URL", "http://127.0.0.1:8000"),
    google_client_id=os.environ.get("GOOGLE_CLIENT_ID", ""),
    google_client_secret=os.environ.get("GOOGLE_CLIENT_SECRET", ""),
    linkedin_client_id=os.environ.get("LINKEDIN_CLIENT_ID", ""),
    linkedin_client_secret=os.environ.get("LINKEDIN_CLIENT_SECRET", ""),
)
