from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Contrato(Base):
    """Modelo de contrato"""
    __tablename__ = "contratos"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    numero = Column(String(50), unique=True, nullable=False, index=True)
    cliente_id = Column(String, ForeignKey("clientes.id"), nullable=False, index=True)
    data_inicio = Column(DateTime, nullable=False)
    data_termino = Column(DateTime, nullable=False)
    valor = Column(Float, nullable=False)
    condicoes = Column(Text)
    observacoes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    cliente = relationship("Cliente", back_populates="contratos")
    projetos = relationship("Projeto", back_populates="contrato")
    documentos = relationship("Documento", back_populates="contrato", cascade="all, delete-orphan")


class Documento(Base):
    """Documentos anexados a contratos"""
    __tablename__ = "documentos"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    contrato_id = Column(String, ForeignKey("contratos.id"), nullable=False, index=True)
    nome = Column(String(200), nullable=False)
    nome_original = Column(String(200), nullable=False)
    caminho = Column(String(500), nullable=False)
    tipo_mime = Column(String(100))
    tamanho = Column(Float)  # em bytes
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    contrato = relationship("Contrato", back_populates="documentos")
