from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.financeiro import PaymentType, PaymentStatus


class PagamentoBase(BaseModel):
    tipo: PaymentType
    valor: float
    data_vencimento: datetime
    descricao: Optional[str] = None
    cliente_id: Optional[str] = None
    projeto_id: Optional[str] = None


class PagamentoCreate(PagamentoBase):
    idempotency_key: Optional[str] = None


class PagamentoUpdate(BaseModel):
    valor: Optional[float] = None
    data_vencimento: Optional[datetime] = None
    data_pagamento: Optional[datetime] = None
    status: Optional[PaymentStatus] = None
    descricao: Optional[str] = None


class PagamentoResponse(PagamentoBase):
    id: str
    status: PaymentStatus
    data_pagamento: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PagamentoDetailResponse(PagamentoResponse):
    cliente_nome: Optional[str] = None


class FluxoCaixaItem(BaseModel):
    mes: str
    recebimentos: float
    pagamentos: float
    saldo: float


class FluxoCaixaResponse(BaseModel):
    periodo: str
    total_recebimentos: float
    total_pagamentos: float
    saldo_total: float
    itens: List[FluxoCaixaItem]


class DashboardStats(BaseModel):
    clientes_ativos: int
    clientes_potenciais: int
    projetos_em_andamento: int
    projetos_concluidos: int
    contratos_ativos: int
    contratos_vencendo: int
    receitas_pendentes: float
    receitas_recebidas: float
    despesas_pendentes: float
    despesas_pagas: float


class AtividadeRecente(BaseModel):
    id: str
    action: str
    entity_type: Optional[str]
    entity_id: Optional[str]
    details: Optional[str]
    user_name: str
    created_at: datetime
