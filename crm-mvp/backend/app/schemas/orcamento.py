from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class OrcamentoStatus(str, Enum):
    RASCUNHO = "rascunho"
    ENVIADO = "enviado"
    APROVADO = "aprovado"
    REJEITADO = "rejeitado"

class OrcamentoBase(BaseModel):
    cliente_id: str
    titulo: str
    descricao: Optional[str] = None
    configuracao: Dict[str, Any] # Contém módulos, integrações e custos variáveis

class OrcamentoCreate(OrcamentoBase):
    pass

class OrcamentoUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    configuracao: Optional[Dict[str, Any]] = None
    status: Optional[OrcamentoStatus] = None

class OrcamentoResponse(OrcamentoBase):
    id: str
    valor_setup: float
    valor_mensal: float
    valor_total: float
    detalhes_calculo: Dict[str, Any]
    status: OrcamentoStatus
    created_at: datetime
    updated_at: datetime
    cliente_nome: Optional[str] = None

    class Config:
        from_attributes = True

class PriceCalculationRequest(BaseModel):
    configuracao: Dict[str, Any]

class PriceCalculationResponse(BaseModel):
    valor_setup: float
    valor_mensal: float
    valor_total: float
    detalhes: Dict[str, Any]
