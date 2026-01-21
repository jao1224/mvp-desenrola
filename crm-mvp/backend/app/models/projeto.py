from sqlalchemy import Column, String, Enum, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from app.core.database import Base


class ProjectStatus(str, enum.Enum):
    """Status do projeto"""
    PLANEJAMENTO = "planejamento"
    EM_EXECUCAO = "em_execucao"
    PAUSADO = "pausado"
    CONCLUIDO = "concluido"
    CANCELADO = "cancelado"


class Projeto(Base):
    """Modelo de projeto"""
    __tablename__ = "projetos"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String(200), nullable=False, index=True)
    descricao = Column(Text)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.PLANEJAMENTO)
    cliente_id = Column(String, ForeignKey("clientes.id"), nullable=False, index=True)
    responsavel_id = Column(String, ForeignKey("users.id"), nullable=True)
    contrato_id = Column(String, ForeignKey("contratos.id"), nullable=True)
    prazo_inicio = Column(DateTime)
    prazo_final = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    cliente = relationship("Cliente", back_populates="projetos")
    responsavel = relationship("User", back_populates="projetos_responsavel")
    contrato = relationship("Contrato", back_populates="projetos")
    entregaveis = relationship("Entregavel", back_populates="projeto", cascade="all, delete-orphan")


class Entregavel(Base):
    """Entregáveis de um projeto"""
    __tablename__ = "entregaveis"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    projeto_id = Column(String, ForeignKey("projetos.id"), nullable=False, index=True)
    nome = Column(String(200), nullable=False)
    descricao = Column(Text)
    prazo = Column(DateTime)
    concluido = Column(Boolean, default=False)
    concluido_em = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    projeto = relationship("Projeto", back_populates="entregaveis")
