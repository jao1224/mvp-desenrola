# Models exports
from app.models.user import User, Role
from app.models.cliente import Cliente, Interacao, DocumentType, ClientStatus
from app.models.projeto import Projeto, Entregavel, ProjectStatus
from app.models.contrato import Contrato, Documento
from app.models.financeiro import Pagamento, ActivityLog, PaymentType, PaymentStatus
from app.models.agendamento import Agendamento, AgendamentoStatus, AgendamentoTipo
from app.models.config import Setting

__all__ = [
    # User
    "User",
    "Role",
    # Cliente
    "Cliente",
    "Interacao",
    "DocumentType",
    "ClientStatus",
    # Projeto
    "Projeto",
    "Entregavel",
    "ProjectStatus",
    # Contrato
    "Contrato",
    "Documento",
    # Financeiro
    "Pagamento",
    "ActivityLog",
    "PaymentType",
    "PaymentStatus",
    # Agendamento
    "Agendamento",
    "AgendamentoStatus",
    "AgendamentoTipo",
    # Config
    "Setting",
]
