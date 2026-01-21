from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import Optional, List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.cliente import Cliente, Interacao, ClientStatus
from app.models.financeiro import ActivityLog
from app.schemas.cliente import (
    ClienteCreate, 
    ClienteUpdate, 
    ClienteResponse, 
    ClienteDetailResponse,
    InteracaoCreate,
    InteracaoResponse
)

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("", response_model=List[ClienteResponse])
async def list_clientes(
    status: Optional[ClientStatus] = None,
    setor: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista clientes com filtros opcionais"""
    query = db.query(Cliente).filter(Cliente.deleted_at.is_(None))
    
    if status:
        query = query.filter(Cliente.status == status)
    
    if setor:
        query = query.filter(Cliente.setor.ilike(f"%{setor}%"))
    
    if search:
        query = query.filter(
            (Cliente.nome.ilike(f"%{search}%")) | 
            (Cliente.documento.ilike(f"%{search}%")) |
            (Cliente.email.ilike(f"%{search}%"))
        )
    
    clientes = query.order_by(Cliente.nome).offset(skip).limit(limit).all()
    return clientes


@router.post("", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
async def create_cliente(
    request: Request,
    cliente_data: ClienteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria novo cliente"""
    # Verifica se já existe cliente com este documento
    existing = db.query(Cliente).filter(
        Cliente.documento == cliente_data.documento,
        Cliente.deleted_at.is_(None)
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um cliente com este documento"
        )
    
    cliente = Cliente(**cliente_data.model_dump())
    db.add(cliente)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="CREATE_CLIENTE",
        entity_type="Cliente",
        entity_id=cliente.id,
        details=f"Cliente '{cliente.nome}' criado",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(cliente)
    return cliente


@router.get("/{cliente_id}", response_model=ClienteDetailResponse)
async def get_cliente(
    cliente_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna detalhes de um cliente"""
    cliente = db.query(Cliente).filter(
        Cliente.id == cliente_id,
        Cliente.deleted_at.is_(None)
    ).first()
    
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado"
        )
    
    return cliente


@router.put("/{cliente_id}", response_model=ClienteResponse)
async def update_cliente(
    cliente_id: str,
    request: Request,
    cliente_data: ClienteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza cliente"""
    cliente = db.query(Cliente).filter(
        Cliente.id == cliente_id,
        Cliente.deleted_at.is_(None)
    ).first()
    
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado"
        )
    
    update_data = cliente_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cliente, field, value)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="UPDATE_CLIENTE",
        entity_type="Cliente",
        entity_id=cliente.id,
        details=f"Cliente '{cliente.nome}' atualizado",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(cliente)
    return cliente


@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cliente(
    cliente_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Soft delete de cliente"""
    from datetime import datetime
    
    cliente = db.query(Cliente).filter(
        Cliente.id == cliente_id,
        Cliente.deleted_at.is_(None)
    ).first()
    
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado"
        )
    
    cliente.deleted_at = datetime.utcnow()
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="DELETE_CLIENTE",
        entity_type="Cliente",
        entity_id=cliente.id,
        details=f"Cliente '{cliente.nome}' removido",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    return None


# Interações

@router.post("/{cliente_id}/interacoes", response_model=InteracaoResponse, status_code=status.HTTP_201_CREATED)
async def create_interacao(
    cliente_id: str,
    interacao_data: InteracaoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adiciona interação ao histórico do cliente"""
    cliente = db.query(Cliente).filter(
        Cliente.id == cliente_id,
        Cliente.deleted_at.is_(None)
    ).first()
    
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado"
        )
    
    interacao = Interacao(
        cliente_id=cliente_id,
        **interacao_data.model_dump()
    )
    db.add(interacao)
    db.commit()
    db.refresh(interacao)
    return interacao


@router.get("/{cliente_id}/interacoes", response_model=List[InteracaoResponse])
async def list_interacoes(
    cliente_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista interações de um cliente"""
    interacoes = db.query(Interacao).filter(
        Interacao.cliente_id == cliente_id
    ).order_by(Interacao.created_at.desc()).offset(skip).limit(limit).all()
    
    return interacoes
