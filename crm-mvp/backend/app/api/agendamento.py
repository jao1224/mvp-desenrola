from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.agendamento import Agendamento, AgendamentoStatus
from app.models.cliente import Cliente
from app.models.financeiro import ActivityLog
from app.schemas.agendamento import AgendamentoCreate, AgendamentoUpdate, AgendamentoResponse

router = APIRouter(prefix="/agendamentos", tags=["Agendamento"])


@router.get("", response_model=List[AgendamentoResponse])
async def list_agendamentos(
    cliente_id: Optional[str] = None,
    status: Optional[AgendamentoStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista agendamentos com filtros"""
    query = db.query(Agendamento, Cliente.nome.label("cliente_nome"))\
        .join(Cliente, Agendamento.cliente_id == Cliente.id)
    
    if cliente_id:
        query = query.filter(Agendamento.cliente_id == cliente_id)
    if status:
        query = query.filter(Agendamento.status == status)
        
    results = query.order_by(Agendamento.data_hora.asc()).all()
    
    # Map label to response
    response = []
    for agendamento, cliente_nome in results:
        data = AgendamentoResponse.from_orm(agendamento)
        data.cliente_nome = cliente_nome
        response.append(data)
        
    return response


@router.post("", response_model=AgendamentoResponse, status_code=status.HTTP_201_CREATED)
async def create_agendamento(
    request: Request,
    agendamento_data: AgendamentoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria novo agendamento"""
    # Validar se data é futura? 
    if agendamento_data.data_hora < datetime.utcnow():
       # Opcional: permitir retrospectivo mas emitir log. 
       # Por agora permitimos para flexibilidade.
       pass

    agendamento = Agendamento(**agendamento_data.model_dump())
    db.add(agendamento)
    
    # Log
    log = ActivityLog(
        user_id=current_user.id,
        action="CREATE_AGENDAMENTO",
        entity_type="Agendamento",
        entity_id=agendamento.id,
        details=f"Agendamento '{agendamento.titulo}' criado para o cliente ID {agendamento.cliente_id}",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(agendamento)
    
    # Get client name for response
    cliente = db.query(Cliente.nome).filter(Cliente.id == agendamento.cliente_id).first()
    resp = AgendamentoResponse.from_orm(agendamento)
    resp.cliente_nome = cliente[0] if cliente else "N/A"
    
    return resp


@router.put("/{agendamento_id}", response_model=AgendamentoResponse)
async def update_agendamento(
    agendamento_id: str,
    request: Request,
    agendamento_data: AgendamentoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza agendamento"""
    agendamento = db.query(Agendamento).filter(Agendamento.id == agendamento_id).first()
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
        
    update_data = agendamento_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agendamento, field, value)
        
    # Log
    log = ActivityLog(
        user_id=current_user.id,
        action="UPDATE_AGENDAMENTO",
        entity_type="Agendamento",
        entity_id=agendamento.id,
        details=f"Agendamento '{agendamento.titulo}' atualizado",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(agendamento)
    
    cliente = db.query(Cliente.nome).filter(Cliente.id == agendamento.cliente_id).first()
    resp = AgendamentoResponse.from_orm(agendamento)
    resp.cliente_nome = cliente[0] if cliente else "N/A"
    
    return resp


@router.delete("/{agendamento_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agendamento(
    agendamento_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove agendamento"""
    agendamento = db.query(Agendamento).filter(Agendamento.id == agendamento_id).first()
    if not agendamento:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
        
    db.delete(agendamento)
    db.commit()
    return None
