from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.projeto import ProjectStatus


class EntregavelBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    prazo: Optional[datetime] = None


class EntregavelCreate(EntregavelBase):
    pass


class EntregavelUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    prazo: Optional[datetime] = None
    concluido: Optional[bool] = None


class EntregavelResponse(EntregavelBase):
    id: str
    projeto_id: str
    concluido: bool
    concluido_em: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProjetoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    status: str = "planejamento"
    cliente_id: str
    responsavel_id: Optional[str] = None
    contrato_id: Optional[str] = None
    prazo_inicio: Optional[datetime] = None
    prazo_final: Optional[datetime] = None


class ProjetoCreate(ProjetoBase):
    pass


class ProjetoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    status: Optional[str] = None
    responsavel_id: Optional[str] = None
    contrato_id: Optional[str] = None
    prazo_inicio: Optional[datetime] = None
    prazo_final: Optional[datetime] = None


class ProjetoResponse(ProjetoBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ProjetoDetailResponse(ProjetoResponse):
    entregaveis: List[EntregavelResponse] = []
    cliente_nome: Optional[str] = None
    responsavel_nome: Optional[str] = None
