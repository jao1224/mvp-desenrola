import uuid
from sqlalchemy import Column, String, Float, JSON, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..core.database import Base

class OrcamentoStatus(str, enum.Enum):
    RASCUNHO = "rascunho"
    ENVIADO = "enviado"
    APROVADO = "aprovado"
    REJEITADO = "rejeitado"

class Orcamento(Base):
    __tablename__ = "orcamentos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cliente_id = Column(String, ForeignKey("clientes.id"), nullable=False)
    titulo = Column(String, nullable=False)
    descricao = Column(String)
    
    # Valores de entrada para a calculadora (v2 utiliza JSON para flexibilidade)
    configuracao = Column(JSON)  # Armazena módulos, integrações e custos variáveis
    
    # Valores Calculados
    valor_setup = Column(Float, default=0.0)
    valor_mensal = Column(Float, default=0.0)
    valor_total = Column(Float, default=0.0)
    detalhes_calculo = Column(JSON)
    
    status = Column(String, default=OrcamentoStatus.RASCUNHO)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    cliente = relationship("Cliente", back_populates="orcamentos")
