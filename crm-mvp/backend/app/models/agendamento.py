from sqlalchemy import Column, String, Enum, DateTime, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from app.core.database import Base


class AgendamentoStatus(str, enum.Enum):
    PENDENTE = "pendente"
    REALIZADO = "realizado"
    CANCELADO = "cancelado"


class AgendamentoTipo(str, enum.Enum):
    REUNIAO = "reuniao"
    CALL = "call"
    VISITA = "visita"
    OUTRO = "outro"


class Agendamento(Base):
    """Modelo de agendamento"""
    __tablename__ = "agendamentos"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cliente_id = Column(String, ForeignKey("clientes.id"), nullable=False, index=True)
    titulo = Column(String(200), nullable=False)
    descricao = Column(Text)
    data_hora = Column(DateTime, nullable=False, index=True)
    duracao_minutos = Column(Integer, default=60)
    status = Column(Enum(AgendamentoStatus), default=AgendamentoStatus.PENDENTE)
    tipo = Column(Enum(AgendamentoTipo), default=AgendamentoTipo.REUNIAO)
    cor = Column(String(7), default="#3b82f6") # Hex color
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    cliente = relationship("Cliente")
