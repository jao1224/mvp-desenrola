# Schemas exports
from app.schemas.user import (
    UserBase, UserCreate, UserUpdate, UserResponse,
    LoginRequest, TokenResponse
)
from app.schemas.cliente import (
    ClienteBase, ClienteCreate, ClienteUpdate, ClienteResponse, ClienteDetailResponse,
    InteracaoBase, InteracaoCreate, InteracaoResponse
)
from app.schemas.projeto import (
    ProjetoBase, ProjetoCreate, ProjetoUpdate, ProjetoResponse, ProjetoDetailResponse,
    EntregavelBase, EntregavelCreate, EntregavelUpdate, EntregavelResponse
)
from app.schemas.contrato import (
    ContratoBase, ContratoCreate, ContratoUpdate, ContratoResponse, ContratoDetailResponse,
    DocumentoBase, DocumentoResponse
)
from app.schemas.financeiro import (
    PagamentoBase, PagamentoCreate, PagamentoUpdate, PagamentoResponse, PagamentoDetailResponse,
    FluxoCaixaItem, FluxoCaixaResponse, DashboardStats, AtividadeRecente
)

__all__ = [
    # User
    "UserBase", "UserCreate", "UserUpdate", "UserResponse",
    "LoginRequest", "TokenResponse",
    # Cliente
    "ClienteBase", "ClienteCreate", "ClienteUpdate", "ClienteResponse", "ClienteDetailResponse",
    "InteracaoBase", "InteracaoCreate", "InteracaoResponse",
    # Projeto
    "ProjetoBase", "ProjetoCreate", "ProjetoUpdate", "ProjetoResponse", "ProjetoDetailResponse",
    "EntregavelBase", "EntregavelCreate", "EntregavelUpdate", "EntregavelResponse",
    # Contrato
    "ContratoBase", "ContratoCreate", "ContratoUpdate", "ContratoResponse", "ContratoDetailResponse",
    "DocumentoBase", "DocumentoResponse",
    # Financeiro
    "PagamentoBase", "PagamentoCreate", "PagamentoUpdate", "PagamentoResponse", "PagamentoDetailResponse",
    "FluxoCaixaItem", "FluxoCaixaResponse", "DashboardStats", "AtividadeRecente",
]
