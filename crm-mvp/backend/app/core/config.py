from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configurações da aplicação"""
    
    # Database
    database_url: str = "sqlite:///./crm.db"
    
    # JWT
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    
    # CORS
    frontend_url: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
