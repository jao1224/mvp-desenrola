from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.cliente import DocumentType, ClientStatus, PipelineStage
import re


class InteracaoBase(BaseModel):
    tipo: str
    descricao: str


class InteracaoCreate(InteracaoBase):
    pass


class InteracaoResponse(InteracaoBase):
    id: str
    cliente_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ClienteBase(BaseModel):
    nome: str
    documento: str
    documento_tipo: DocumentType
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    setor: Optional[str] = None
    endereco: Optional[str] = None
    observacoes: Optional[str] = None
    status: ClientStatus = ClientStatus.POTENCIAL
    pipeline_stage: Optional[str] = PipelineStage.POTENCIAL.value
    
    @field_validator('documento')
    @classmethod
    def validate_documento(cls, v, info):
        # Remove caracteres não numéricos
        doc = re.sub(r'\D', '', v)
        return doc


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nome: Optional[str] = None
    documento: Optional[str] = None
    documento_tipo: Optional[DocumentType] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    setor: Optional[str] = None
    endereco: Optional[str] = None
    observacoes: Optional[str] = None
    status: Optional[ClientStatus] = None
    pipeline_stage: Optional[str] = None


class ClienteResponse(ClienteBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ClienteDetailResponse(ClienteResponse):
    interacoes: List[InteracaoResponse] = []
