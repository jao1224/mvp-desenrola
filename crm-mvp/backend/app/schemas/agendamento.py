from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.agendamento import AgendamentoStatus, AgendamentoTipo


class AgendamentoBase(BaseModel):
    cliente_id: str
    titulo: str
    descricao: Optional[str] = None
    data_hora: datetime
    duracao_minutos: Optional[int] = 60
    status: AgendamentoStatus = AgendamentoStatus.PENDENTE
    tipo: AgendamentoTipo = AgendamentoTipo.REUNIAO
    cor: Optional[str] = "#3b82f6"


class AgendamentoCreate(AgendamentoBase):
    pass


class AgendamentoUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    data_hora: Optional[datetime] = None
    duracao_minutos: Optional[int] = None
    status: Optional[AgendamentoStatus] = None
    tipo: Optional[AgendamentoTipo] = None
    cor: Optional[str] = None


class AgendamentoResponse(AgendamentoBase):
    id: str
    created_at: datetime
    updated_at: datetime
    cliente_nome: Optional[str] = None

    class Config:
        from_attributes = True
