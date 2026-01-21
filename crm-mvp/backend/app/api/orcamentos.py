from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.orcamento import Orcamento, OrcamentoStatus
from app.models.cliente import Cliente
from app.models.financeiro import ActivityLog
from app.schemas.orcamento import (
    OrcamentoCreate,
    OrcamentoUpdate,
    OrcamentoResponse,
    PriceCalculationRequest,
    PriceCalculationResponse
)

router = APIRouter(prefix="/orcamentos", tags=["Orçamentos"])

# Configurações de Preço v2 (Engineering Solution Engineering)
PRICING_CONFIG_V2 = {
    "setup_base": 2499.00,
    "modulos": {
        "crm": 1500.00,
        "erp": 2000.00,
        "agente_ia_whatsapp": 2500.00
    },
    "integracoes": {
        "agente_crm": 800.00,
        "agente_erp": 1200.00
    },
    "customizacoes": {
        "interpreta_texto": 199.99,
        "interpreta_audio": 299.99,
        "responde_texto": 199.99,
        "responde_audio": 499.99,
        "envio_email": 199.99
    },
    "mensal_base": {
        "servidor": 119.99,
        "suporte": 899.99
    }
}

def calculate_price(data: PriceCalculationRequest) -> Dict[str, Any]:
    """Motor de cálculo v2: Segregação Setup vs Mensal"""
    config = data.configuracao
    precos = PRICING_CONFIG_V2
    
    # Premissas Customizáveis (Overrides)
    premissas = config.get("premissas", {})
    setup_base_val = float(premissas.get("setup_base", precos["setup_base"]))
    mensal_servidor_val = float(premissas.get("mensal_servidor", precos["mensal_base"]["servidor"]))
    mensal_suporte_val = float(premissas.get("mensal_suporte", precos["mensal_base"]["suporte"]))

    setup_total = setup_base_val
    mensal_total = mensal_servidor_val + mensal_suporte_val
    
    breakdown = {
        "setup": {"Base": setup_base_val},
        "mensal": {
            "Servidor/Hospedagem": mensal_servidor_val,
            "Suporte e Manutenção": mensal_suporte_val
        }
    }
    
    # 1. Módulos
    modulos = config.get("modulos", {})
    custom_prices = config.get("custom_prices", {})

    for mod, ativo in modulos.items():
        if ativo:
            default_price = precos["modulos"].get(mod, 0.0)
            # Tenta pegar preço customizado, senão usa o padrão
            valor = float(custom_prices.get(f"modulo_{mod}", default_price))
            
            setup_total += valor
            breakdown["setup"][f"Módulo: {mod.upper()}"] = valor
            
    # 2. Integrações
    integracoes = config.get("integracoes", {})
    for intgr, ativo in integracoes.items():
        if ativo:
            valor = precos["integracoes"].get(intgr, 0.0)
            setup_total += valor
            breakdown["setup"][f"Integração: {intgr}"] = valor
            
    # 3. Custos Variáveis (Customizações)
    customs = config.get("customizacoes", {})
    for cust, ativo in customs.items():
        if ativo:
            default_price = precos["customizacoes"].get(cust, 0.0)
            valor = float(custom_prices.get(cust, default_price))
            
            setup_total += valor
            breakdown["setup"][f"Custom: {cust}"] = valor
            
    # 4. Custos Variáveis (API IA)
    api_ia = config.get("api_ia", {})
    reqs_mes = api_ia.get("requisicoes_mes", 0)
    custo_req = api_ia.get("custo_por_requisicao", 0.09)
    valor_api = round(reqs_mes * custo_req, 2)
    if valor_api > 0:
        mensal_total += valor_api
        breakdown["mensal"]["API de IA (Variável)"] = valor_api
        
    return {
        "valor_setup": round(setup_total, 2),
        "valor_mensal": round(mensal_total, 2),
        "valor_total": round(setup_total + (mensal_total * 12), 2),
        "detalhes": breakdown
    }

@router.post("/calculate", response_model=PriceCalculationResponse)
async def get_calculation(data: PriceCalculationRequest):
    """Retorna apenas o cálculo sem salvar"""
    res = calculate_price(data)
    return PriceCalculationResponse(**res)

@router.get("", response_model=List[OrcamentoResponse])
async def list_orcamentos(
    cliente_id: Optional[str] = None,
    status: Optional[OrcamentoStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Orcamento)
    if cliente_id:
        query = query.filter(Orcamento.cliente_id == cliente_id)
    if status:
        query = query.filter(Orcamento.status == status)
    
    orcamentos = query.order_by(Orcamento.created_at.desc()).all()
    
    # Adicionar nome do cliente
    for o in orcamentos:
        o.cliente_nome = o.cliente.nome if o.cliente else "Desconhecido"
    
    return orcamentos

@router.post("", response_model=OrcamentoResponse, status_code=status.HTTP_201_CREATED)
async def create_orcamento(
    request: Request,
    data_in: OrcamentoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validar cliente
    cliente = db.query(Cliente).filter(Cliente.id == data_in.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    # Realizar cálculo no servidor para segurança
    calc_req = PriceCalculationRequest(configuracao=data_in.configuracao)
    calc_res = calculate_price(calc_req)
    
    orcamento = Orcamento(
        **data_in.model_dump(),
        valor_setup=calc_res["valor_setup"],
        valor_mensal=calc_res["valor_mensal"],
        valor_total=calc_res["valor_total"],
        detalhes_calculo=calc_res["detalhes"]
    )
    
    db.add(orcamento)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="CREATE_ORCAMENTO",
        entity_type="Orcamento",
        entity_id=orcamento.id,
        details=f"Orçamento '{orcamento.titulo}' v2 gerado. Setup: R$ {orcamento.valor_setup}, Mensal: R$ {orcamento.valor_mensal}",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(orcamento)
    orcamento.cliente_nome = cliente.nome
    return orcamento

@router.get("/{orcamento_id}", response_model=OrcamentoResponse)
async def get_orcamento(
    orcamento_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orcamento = db.query(Orcamento).filter(Orcamento.id == orcamento_id).first()
    if not orcamento:
        raise HTTPException(status_code=404, detail="Orçamento não encontrado")
    
    orcamento.cliente_nome = orcamento.cliente.nome if orcamento.cliente else "Desconhecido"
    return orcamento

@router.put("/{orcamento_id}", response_model=OrcamentoResponse)
async def update_orcamento(
    orcamento_id: str,
    data_in: OrcamentoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orcamento = db.query(Orcamento).filter(Orcamento.id == orcamento_id).first()
    if not orcamento:
        raise HTTPException(status_code=404, detail="Orçamento não encontrado")
    
    update_data = data_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(orcamento, field, value)
    
    if "configuracao" in update_data:
        calc_req = PriceCalculationRequest(configuracao=orcamento.configuracao)
        calc_res = calculate_price(calc_req)
        orcamento.valor_setup = calc_res["valor_setup"]
        orcamento.valor_mensal = calc_res["valor_mensal"]
        orcamento.valor_total = calc_res["valor_total"]
        orcamento.detalhes_calculo = calc_res["detalhes"]
    
    db.commit()
    db.refresh(orcamento)
    orcamento.cliente_nome = orcamento.cliente.nome if orcamento.cliente else "Desconhecido"
    return orcamento

@router.delete("/{orcamento_id}")
async def delete_orcamento(
    orcamento_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orcamento = db.query(Orcamento).filter(Orcamento.id == orcamento_id).first()
    if not orcamento:
        raise HTTPException(status_code=404, detail="Orçamento não encontrado")
    
    db.delete(orcamento)
    db.commit()
    return {"detail": "Orçamento removido"}
