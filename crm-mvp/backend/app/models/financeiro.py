from sqlalchemy import Column, String, Enum, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from app.core.database import Base


class PaymentType(str, enum.Enum):
    """Tipo de movimento financeiro"""
    RECEBIMENTO = "recebimento"
    PAGAMENTO = "pagamento"


class PaymentStatus(str, enum.Enum):
    """Status do pagamento"""
    PENDENTE = "pendente"
    PAGO = "pago"
    ATRASADO = "atrasado"
    CANCELADO = "cancelado"


class Pagamento(Base):
    """Modelo de pagamento/recebimento"""
    __tablename__ = "pagamentos"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    idempotency_key = Column(String, unique=True, nullable=True)  # Prevenir duplicatas
    tipo = Column(String, nullable=False)
    valor = Column(Float, nullable=False)
    data_vencimento = Column(DateTime, nullable=False)
    data_pagamento = Column(DateTime, nullable=True)
    status = Column(String, default="pendente")
    descricao = Column(Text)
    cliente_id = Column(String, ForeignKey("clientes.id"), nullable=True, index=True)
    projeto_id = Column(String, ForeignKey("projetos.id"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    cliente = relationship("Cliente", back_populates="pagamentos")


class ActivityLog(Base):
    """Log de atividades para auditoria"""
    __tablename__ = "activity_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50))  # Cliente, Projeto, Contrato, etc.
    entity_id = Column(String)
    details = Column(Text)
    ip_address = Column(String(45))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    user = relationship("User", back_populates="logs")
