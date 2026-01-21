from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DocumentoBase(BaseModel):
    nome: str


class DocumentoResponse(DocumentoBase):
    id: str
    contrato_id: str
    nome_original: str
    caminho: str
    tipo_mime: Optional[str] = None
    tamanho: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ContratoBase(BaseModel):
    numero: str
    cliente_id: str
    data_inicio: datetime
    data_termino: datetime
    valor: float
    condicoes: Optional[str] = None
    observacoes: Optional[str] = None


class ContratoCreate(ContratoBase):
    pass


class ContratoUpdate(BaseModel):
    numero: Optional[str] = None
    data_inicio: Optional[datetime] = None
    data_termino: Optional[datetime] = None
    valor: Optional[float] = None
    condicoes: Optional[str] = None
    observacoes: Optional[str] = None


class ContratoResponse(ContratoBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ContratoDetailResponse(ContratoResponse):
    documentos: List[DocumentoResponse] = []
    cliente_nome: Optional[str] = None
    dias_para_vencimento: Optional[int] = None
