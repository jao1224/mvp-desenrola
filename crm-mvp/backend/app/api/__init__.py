# API exports
from app.api.auth import router as auth_router
from app.api.clientes import router as clientes_router
from app.api.projetos import router as projetos_router
from app.api.contratos import router as contratos_router
from app.api.financeiro import router as financeiro_router
from app.api.agendamento import router as agendamento_router
from app.api.config import router as config_router
from app.api.orcamentos import router as orcamentos_router

__all__ = [
    "auth_router",
    "clientes_router",
    "projetos_router",
    "contratos_router",
    "financeiro_router",
    "agendamento_router",
    "config_router",
    "orcamentos_router"
]
