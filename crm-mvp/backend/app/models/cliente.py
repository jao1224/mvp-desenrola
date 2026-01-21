from sqlalchemy import Column, String, Enum, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid

from app.core.database import Base


class DocumentType(str, enum.Enum):
    """Tipo de documento"""
    CPF = "cpf"
    CNPJ = "cnpj"


class ClientStatus(str, enum.Enum):
    """Status do cliente"""
    ATIVO = "ativo"
    POTENCIAL = "potencial"
    EM_NEGOCIACAO = "em_negociacao"
    INATIVO = "inativo"


class PipelineStage(str, enum.Enum):
    """Etapas do Funil de Negociações"""
    POTENCIAL = "potencial"
    CONTATO = "contato"
    DEMONSTRACAO = "demonstracao"
    ORCAMENTO = "orcamento"
    NEGOCIACAO = "negociacao"
    ASSINATURA = "assinatura"
    FECHADO = "fechado"
    ENCERRADO = "encerrado"


class Cliente(Base):
    """Modelo de cliente"""
    __tablename__ = "clientes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String(200), nullable=False, index=True)
    documento = Column(String(20), nullable=False, index=True)
    documento_tipo = Column(Enum(DocumentType), nullable=False)
    email = Column(String(100))
    telefone = Column(String(20))
    setor = Column(String(100))
    endereco = Column(Text)
    observacoes = Column(Text)
    status = Column(Enum(ClientStatus), default=ClientStatus.POTENCIAL)
    pipeline_stage = Column(String, default=PipelineStage.POTENCIAL.value)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)  # Soft delete
    
    # Relacionamentos
    interacoes = relationship("Interacao", back_populates="cliente", cascade="all, delete-orphan")
    projetos = relationship("Projeto", back_populates="cliente")
    contratos = relationship("Contrato", back_populates="cliente")
    pagamentos = relationship("Pagamento", back_populates="cliente")
    orcamentos = relationship("Orcamento", back_populates="cliente")


class Interacao(Base):
    """Histórico de interações com cliente"""
    __tablename__ = "interacoes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cliente_id = Column(String, ForeignKey("clientes.id"), nullable=False, index=True)
    tipo = Column(String(50), nullable=False)  # email, reunião, ligação, etc.
    descricao = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    cliente = relationship("Cliente", back_populates="interacoes")
