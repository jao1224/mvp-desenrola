from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from app.core.database import Base


class Role(str, enum.Enum):
    """Roles de usuário"""
    ADMIN = "admin"
    GESTOR = "gestor"
    COLABORADOR = "colaborador"


class User(Base):
    """Modelo de usuário"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="colaborador") # Use String to avoid Enum mapping crashes
    is_active = Column(String, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    logs = relationship("ActivityLog", back_populates="user")
    projetos_responsavel = relationship("Projeto", back_populates="responsavel")
