from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.projeto import Projeto, Entregavel, ProjectStatus
from app.models.cliente import Cliente
from app.models.financeiro import ActivityLog
from app.schemas.projeto import (
    ProjetoCreate, 
    ProjetoUpdate, 
    ProjetoResponse, 
    ProjetoDetailResponse,
    EntregavelCreate,
    EntregavelUpdate,
    EntregavelResponse
)

router = APIRouter(prefix="/projetos", tags=["Projetos"])


@router.get("", response_model=List[ProjetoResponse])
async def list_projetos(
    status: Optional[ProjectStatus] = None,
    cliente_id: Optional[str] = None,
    responsavel_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista projetos com filtros opcionais"""
    query = db.query(Projeto)
    
    if status:
        query = query.filter(Projeto.status == status)
    
    if cliente_id:
        query = query.filter(Projeto.cliente_id == cliente_id)
    
    if responsavel_id:
        query = query.filter(Projeto.responsavel_id == responsavel_id)
    
    projetos = query.order_by(Projeto.created_at.desc()).offset(skip).limit(limit).all()
    return projetos


@router.post("", response_model=ProjetoResponse, status_code=status.HTTP_201_CREATED)
async def create_projeto(
    request: Request,
    projeto_data: ProjetoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria novo projeto"""
    # Verifica se cliente existe
    cliente = db.query(Cliente).filter(
        Cliente.id == projeto_data.cliente_id,
        Cliente.deleted_at.is_(None)
    ).first()
    
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cliente não encontrado"
        )
    
    projeto = Projeto(**projeto_data.model_dump())
    db.add(projeto)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="CREATE_PROJETO",
        entity_type="Projeto",
        entity_id=projeto.id,
        details=f"Projeto '{projeto.nome}' criado para cliente '{cliente.nome}'",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(projeto)
    return projeto


@router.get("/{projeto_id}", response_model=ProjetoDetailResponse)
async def get_projeto(
    projeto_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna detalhes de um projeto"""
    projeto = db.query(Projeto).filter(Projeto.id == projeto_id).first()
    
    if not projeto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado"
        )
    
    # Adiciona informações extras
    response = ProjetoDetailResponse.model_validate(projeto)
    response.cliente_nome = projeto.cliente.nome if projeto.cliente else None
    response.responsavel_nome = projeto.responsavel.name if projeto.responsavel else None
    
    return response


@router.put("/{projeto_id}", response_model=ProjetoResponse)
async def update_projeto(
    projeto_id: str,
    request: Request,
    projeto_data: ProjetoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza projeto"""
    projeto = db.query(Projeto).filter(Projeto.id == projeto_id).first()
    
    if not projeto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado"
        )
    
    update_data = projeto_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(projeto, field, value)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="UPDATE_PROJETO",
        entity_type="Projeto",
        entity_id=projeto.id,
        details=f"Projeto '{projeto.nome}' atualizado",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(projeto)
    return projeto


@router.delete("/{projeto_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_projeto(
    projeto_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove projeto"""
    projeto = db.query(Projeto).filter(Projeto.id == projeto_id).first()
    
    if not projeto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado"
        )
    
    nome = projeto.nome
    db.delete(projeto)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="DELETE_PROJETO",
        entity_type="Projeto",
        entity_id=projeto_id,
        details=f"Projeto '{nome}' removido",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    return None


# Entregáveis

@router.post("/{projeto_id}/entregaveis", response_model=EntregavelResponse, status_code=status.HTTP_201_CREATED)
async def create_entregavel(
    projeto_id: str,
    entregavel_data: EntregavelCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adiciona entregável ao projeto"""
    projeto = db.query(Projeto).filter(Projeto.id == projeto_id).first()
    
    if not projeto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado"
        )
    
    entregavel = Entregavel(
        projeto_id=projeto_id,
        **entregavel_data.model_dump()
    )
    db.add(entregavel)
    db.commit()
    db.refresh(entregavel)
    return entregavel


@router.put("/{projeto_id}/entregaveis/{entregavel_id}", response_model=EntregavelResponse)
async def update_entregavel(
    projeto_id: str,
    entregavel_id: str,
    entregavel_data: EntregavelUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza entregável"""
    entregavel = db.query(Entregavel).filter(
        Entregavel.id == entregavel_id,
        Entregavel.projeto_id == projeto_id
    ).first()
    
    if not entregavel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entregável não encontrado"
        )
    
    update_data = entregavel_data.model_dump(exclude_unset=True)
    
    # Se marcando como concluído, registra a data
    if "concluido" in update_data and update_data["concluido"] and not entregavel.concluido:
        update_data["concluido_em"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(entregavel, field, value)
    
    db.commit()
    db.refresh(entregavel)
    return entregavel


@router.delete("/{projeto_id}/entregaveis/{entregavel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entregavel(
    projeto_id: str,
    entregavel_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove entregável"""
    entregavel = db.query(Entregavel).filter(
        Entregavel.id == entregavel_id,
        Entregavel.projeto_id == projeto_id
    ).first()
    
    if not entregavel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entregável não encontrado"
        )
    
    db.delete(entregavel)
    db.commit()
    return None
