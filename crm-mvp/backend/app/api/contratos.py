from fastapi import APIRouter, Depends, HTTPException, status, Query, Request, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta
import os
import uuid
import aiofiles

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.contrato import Contrato, Documento
from app.models.cliente import Cliente
from app.models.financeiro import ActivityLog
from app.schemas.contrato import (
    ContratoCreate, 
    ContratoUpdate, 
    ContratoResponse, 
    ContratoDetailResponse,
    DocumentoResponse
)

router = APIRouter(prefix="/contratos", tags=["Contratos"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "..", "uploads")


@router.get("", response_model=List[ContratoResponse])
async def list_contratos(
    cliente_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista contratos com filtros opcionais"""
    query = db.query(Contrato)
    
    if cliente_id:
        query = query.filter(Contrato.cliente_id == cliente_id)
    
    contratos = query.order_by(Contrato.data_termino.asc()).offset(skip).limit(limit).all()
    return contratos


@router.get("/alertas", response_model=List[ContratoDetailResponse])
async def get_contratos_vencendo(
    dias: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista contratos próximos do vencimento"""
    hoje = datetime.utcnow()
    data_limite = hoje + timedelta(days=dias)
    
    contratos = db.query(Contrato).filter(
        Contrato.data_termino >= hoje,
        Contrato.data_termino <= data_limite
    ).order_by(Contrato.data_termino.asc()).all()
    
    result = []
    for contrato in contratos:
        response = ContratoDetailResponse.model_validate(contrato)
        response.cliente_nome = contrato.cliente.nome if contrato.cliente else None
        response.dias_para_vencimento = (contrato.data_termino - hoje).days
        result.append(response)
    
    return result


@router.post("", response_model=ContratoResponse, status_code=status.HTTP_201_CREATED)
async def create_contrato(
    request: Request,
    contrato_data: ContratoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria novo contrato"""
    # Verifica se cliente existe
    cliente = db.query(Cliente).filter(
        Cliente.id == contrato_data.cliente_id,
        Cliente.deleted_at.is_(None)
    ).first()
    
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cliente não encontrado"
        )
    
    # Verifica se número do contrato já existe
    existing = db.query(Contrato).filter(Contrato.numero == contrato_data.numero).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um contrato com este número"
        )
    
    contrato = Contrato(**contrato_data.model_dump())
    db.add(contrato)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="CREATE_CONTRATO",
        entity_type="Contrato",
        entity_id=contrato.id,
        details=f"Contrato '{contrato.numero}' criado para cliente '{cliente.nome}'",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(contrato)
    return contrato


@router.get("/{contrato_id}", response_model=ContratoDetailResponse)
async def get_contrato(
    contrato_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna detalhes de um contrato"""
    contrato = db.query(Contrato).filter(Contrato.id == contrato_id).first()
    
    if not contrato:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contrato não encontrado"
        )
    
    response = ContratoDetailResponse.model_validate(contrato)
    response.cliente_nome = contrato.cliente.nome if contrato.cliente else None
    response.dias_para_vencimento = (contrato.data_termino - datetime.utcnow()).days
    
    return response


@router.put("/{contrato_id}", response_model=ContratoResponse)
async def update_contrato(
    contrato_id: str,
    request: Request,
    contrato_data: ContratoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza contrato"""
    contrato = db.query(Contrato).filter(Contrato.id == contrato_id).first()
    
    if not contrato:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contrato não encontrado"
        )
    
    update_data = contrato_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contrato, field, value)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="UPDATE_CONTRATO",
        entity_type="Contrato",
        entity_id=contrato.id,
        details=f"Contrato '{contrato.numero}' atualizado",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    db.refresh(contrato)
    return contrato


@router.delete("/{contrato_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contrato(
    contrato_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove contrato"""
    contrato = db.query(Contrato).filter(Contrato.id == contrato_id).first()
    
    if not contrato:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contrato não encontrado"
        )
    
    numero = contrato.numero
    db.delete(contrato)
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="DELETE_CONTRATO",
        entity_type="Contrato",
        entity_id=contrato_id,
        details=f"Contrato '{numero}' removido",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    
    db.commit()
    return None


# Documentos

@router.post("/{contrato_id}/documentos", response_model=DocumentoResponse, status_code=status.HTTP_201_CREATED)
async def upload_documento(
    contrato_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload de documento para contrato"""
    contrato = db.query(Contrato).filter(Contrato.id == contrato_id).first()
    
    if not contrato:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contrato não encontrado"
        )
    
    # Valida tipo de arquivo
    allowed_types = ["application/pdf", "image/jpeg", "image/png", "application/msword", 
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipo de arquivo não permitido"
        )
    
    # Gera nome único para o arquivo
    file_ext = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    # Cria diretório se não existir
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Salva arquivo
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    documento = Documento(
        contrato_id=contrato_id,
        nome=file_name,
        nome_original=file.filename,
        caminho=file_path,
        tipo_mime=file.content_type,
        tamanho=len(content)
    )
    db.add(documento)
    db.commit()
    db.refresh(documento)
    return documento


@router.delete("/{contrato_id}/documentos/{documento_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_documento(
    contrato_id: str,
    documento_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove documento"""
    documento = db.query(Documento).filter(
        Documento.id == documento_id,
        Documento.contrato_id == contrato_id
    ).first()
    
    if not documento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento não encontrado"
        )
    
    # Remove arquivo físico
    if os.path.exists(documento.caminho):
        os.remove(documento.caminho)
    
    db.delete(documento)
    db.commit()
    return None
