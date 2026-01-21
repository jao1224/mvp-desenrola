from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.financeiro import Pagamento, ActivityLog, PaymentType, PaymentStatus
from app.models.cliente import Cliente, ClientStatus
from app.models.projeto import Projeto, ProjectStatus
from app.models.contrato import Contrato
from app.schemas.financeiro import (
    PagamentoCreate, 
    PagamentoUpdate, 
    PagamentoResponse, 
    PagamentoDetailResponse,
    FluxoCaixaItem,
    FluxoCaixaResponse,
    DashboardStats,
    AtividadeRecente
)

router = APIRouter(prefix="/financeiro", tags=["Financeiro"])


@router.get("", response_model=List[PagamentoDetailResponse])
async def list_pagamentos(
    tipo: Optional[PaymentType] = None,
    status: Optional[PaymentStatus] = None,
    cliente_id: Optional[str] = None,
    data_inicio: Optional[datetime] = None,
    data_fim: Optional[datetime] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista pagamentos/recebimentos com filtros"""
    query = db.query(Pagamento)
    
    if tipo:
        query = query.filter(Pagamento.tipo == tipo)
    
    if status:
        query = query.filter(Pagamento.status == status)
    
    if cliente_id:
        query = query.filter(Pagamento.cliente_id == cliente_id)
    
    if data_inicio:
        query = query.filter(Pagamento.data_vencimento >= data_inicio)
    
    if data_fim:
        query = query.filter(Pagamento.data_vencimento <= data_fim)
    
    pagamentos = query.order_by(Pagamento.data_vencimento.desc()).offset(skip).limit(limit).all()
    
    result = []
    for pag in pagamentos:
        response = PagamentoDetailResponse.model_validate(pag)
        response.cliente_nome = pag.cliente.nome if pag.cliente else None
        result.append(response)
    
    return result


@router.post("", response_model=PagamentoResponse, status_code=status.HTTP_201_CREATED)
async def create_pagamento(
    request: Request,
    pagamento_data: PagamentoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Registra novo pagamento/recebimento"""
    # Verifica idempotência
    if pagamento_data.idempotency_key:
        existing = db.query(Pagamento).filter(
            Pagamento.idempotency_key == pagamento_data.idempotency_key
        ).first()
        if existing:
            return existing
    
    pagamento = Pagamento(**pagamento_data.model_dump())
    db.add(pagamento)
    
    # Log de atividade
    tipo_str = "Recebimento" if pagamento.tipo == PaymentType.RECEBIMENTO else "Pagamento"
    log = ActivityLog(
        user_id=current_user.id,
        action=f"CREATE_{pagamento.tipo.value.upper()}",
        entity_type="Pagamento",
        entity_id=pagamento.id,
        details=f"{tipo_str} de R$ {pagamento.valor:.2f} registrado",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(pagamento)
    return pagamento


@router.put("/{pagamento_id}", response_model=PagamentoResponse)
async def update_pagamento(
    pagamento_id: str,
    request: Request,
    pagamento_data: PagamentoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza pagamento"""
    pagamento = db.query(Pagamento).filter(Pagamento.id == pagamento_id).first()
    
    if not pagamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado"
        )
    
    update_data = pagamento_data.model_dump(exclude_unset=True)
    
    # Se está sendo marcado como pago, atualiza status
    if "data_pagamento" in update_data and update_data["data_pagamento"]:
        update_data["status"] = PaymentStatus.PAGO
    
    for field, value in update_data.items():
        setattr(pagamento, field, value)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="UPDATE_PAGAMENTO",
        entity_type="Pagamento",
        entity_id=pagamento.id,
        details=f"Pagamento atualizado - Status: {pagamento.status.value}",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(pagamento)
    return pagamento


@router.delete("/{pagamento_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pagamento(
    pagamento_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove pagamento"""
    pagamento = db.query(Pagamento).filter(Pagamento.id == pagamento_id).first()
    
    if not pagamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado"
        )
    
    db.delete(pagamento)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="DELETE_PAGAMENTO",
        entity_type="Pagamento",
        entity_id=pagamento_id,
        details="Pagamento removido",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    return None


@router.get("/fluxo-caixa", response_model=FluxoCaixaResponse)
async def get_fluxo_caixa(
    meses: int = Query(6, ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna fluxo de caixa dos últimos meses"""
    hoje = datetime.utcnow()
    data_inicio = hoje - relativedelta(months=meses-1)
    data_inicio = data_inicio.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    itens = []
    total_recebimentos = 0
    total_pagamentos = 0
    
    for i in range(meses):
        mes_atual = data_inicio + relativedelta(months=i)
        mes_proximo = mes_atual + relativedelta(months=1)
        
        # Recebimentos do mês
        recebimentos = db.query(func.sum(Pagamento.valor)).filter(
            Pagamento.tipo == PaymentType.RECEBIMENTO,
            Pagamento.status == PaymentStatus.PAGO,
            Pagamento.data_pagamento >= mes_atual,
            Pagamento.data_pagamento < mes_proximo
        ).scalar() or 0
        
        # Pagamentos do mês
        pagamentos = db.query(func.sum(Pagamento.valor)).filter(
            Pagamento.tipo == PaymentType.PAGAMENTO,
            Pagamento.status == PaymentStatus.PAGO,
            Pagamento.data_pagamento >= mes_atual,
            Pagamento.data_pagamento < mes_proximo
        ).scalar() or 0
        
        itens.append(FluxoCaixaItem(
            mes=mes_atual.strftime("%Y-%m"),
            recebimentos=float(recebimentos),
            pagamentos=float(pagamentos),
            saldo=float(recebimentos - pagamentos)
        ))
        
        total_recebimentos += recebimentos
        total_pagamentos += pagamentos
    
    return FluxoCaixaResponse(
        periodo=f"{data_inicio.strftime('%Y-%m')} a {hoje.strftime('%Y-%m')}",
        total_recebimentos=float(total_recebimentos),
        total_pagamentos=float(total_pagamentos),
        saldo_total=float(total_recebimentos - total_pagamentos),
        itens=itens
    )


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna estatísticas para o dashboard"""
    hoje = datetime.utcnow()
    data_vencimento_alerta = hoje + timedelta(days=30)
    
    # Clientes
    clientes_ativos = db.query(Cliente).filter(
        Cliente.status == ClientStatus.ATIVO,
        Cliente.deleted_at.is_(None)
    ).count()
    
    clientes_potenciais = db.query(Cliente).filter(
        Cliente.status.in_([ClientStatus.POTENCIAL, ClientStatus.EM_NEGOCIACAO]),
        Cliente.deleted_at.is_(None)
    ).count()
    
    # Projetos
    projetos_em_andamento = db.query(Projeto).filter(
        Projeto.status == ProjectStatus.EM_EXECUCAO
    ).count()
    
    projetos_concluidos = db.query(Projeto).filter(
        Projeto.status == ProjectStatus.CONCLUIDO
    ).count()
    
    # Contratos
    contratos_ativos = db.query(Contrato).filter(
        Contrato.data_termino >= hoje
    ).count()
    
    contratos_vencendo = db.query(Contrato).filter(
        Contrato.data_termino >= hoje,
        Contrato.data_termino <= data_vencimento_alerta
    ).count()
    
    # Financeiro
    receitas_pendentes = db.query(func.sum(Pagamento.valor)).filter(
        Pagamento.tipo == PaymentType.RECEBIMENTO,
        Pagamento.status == PaymentStatus.PENDENTE
    ).scalar() or 0
    
    receitas_recebidas = db.query(func.sum(Pagamento.valor)).filter(
        Pagamento.tipo == PaymentType.RECEBIMENTO,
        Pagamento.status == PaymentStatus.PAGO
    ).scalar() or 0
    
    despesas_pendentes = db.query(func.sum(Pagamento.valor)).filter(
        Pagamento.tipo == PaymentType.PAGAMENTO,
        Pagamento.status == PaymentStatus.PENDENTE
    ).scalar() or 0
    
    despesas_pagas = db.query(func.sum(Pagamento.valor)).filter(
        Pagamento.tipo == PaymentType.PAGAMENTO,
        Pagamento.status == PaymentStatus.PAGO
    ).scalar() or 0
    
    return DashboardStats(
        clientes_ativos=clientes_ativos,
        clientes_potenciais=clientes_potenciais,
        projetos_em_andamento=projetos_em_andamento,
        projetos_concluidos=projetos_concluidos,
        contratos_ativos=contratos_ativos,
        contratos_vencendo=contratos_vencendo,
        receitas_pendentes=float(receitas_pendentes),
        receitas_recebidas=float(receitas_recebidas),
        despesas_pendentes=float(despesas_pendentes),
        despesas_pagas=float(despesas_pagas)
    )


@router.get("/atividades", response_model=List[AtividadeRecente])
async def get_atividades_recentes(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna atividades recentes"""
    logs = db.query(ActivityLog).order_by(
        ActivityLog.created_at.desc()
    ).limit(limit).all()
    
    result = []
    for log in logs:
        result.append(AtividadeRecente(
            id=log.id,
            action=log.action,
            entity_type=log.entity_type,
            entity_id=log.entity_id,
            details=log.details,
            user_name=log.user.name if log.user else "Sistema",
            created_at=log.created_at
        ))
    
    return result
