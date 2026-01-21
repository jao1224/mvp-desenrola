from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.config import get_settings
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token,
    get_current_user
)
from app.models.user import User, Role
from app.models.financeiro import ActivityLog
from app.schemas.user import (
    LoginRequest, 
    TokenResponse, 
    UserCreate, 
    UserResponse,
    UserUpdate
)

router = APIRouter(prefix="/auth", tags=["Autenticação"])
settings = get_settings()


@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    response: Response,
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Realiza login e retorna token JWT"""
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    access_token = create_access_token(
        data={"sub": user.id, "role": user.role.value},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    # Define cookie httpOnly
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=settings.access_token_expire_minutes * 60,
        samesite="lax",
        secure=False  # True em produção com HTTPS
    )
    
    # Log de atividade
    log = ActivityLog(
        user_id=user.id,
        action="LOGIN",
        details="Login realizado com sucesso",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    db.commit()
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Realiza logout limpando o cookie"""
    response.delete_cookie("access_token")
    
    # Log de atividade
    log = ActivityLog(
        user_id=current_user.id,
        action="LOGOUT",
        details="Logout realizado",
        ip_address=request.client.host if request.client else None
    )
    db.add(log)
    db.commit()
    
    return {"message": "Logout realizado com sucesso"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Retorna dados do usuário logado"""
    return current_user


@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Registra novo usuário (apenas para setup inicial)"""
    # Verifica se já existe usuário com este email
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado"
        )
    
    # Se não existir nenhum usuário, o primeiro é ADMIN
    user_count = db.query(User).count()
    role = Role.ADMIN if user_count == 0 else user_data.role
    
    user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        name=user_data.name,
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


@router.get("/users", response_model=list[UserResponse])
async def list_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lista todos os usuários (apenas admin)"""
    if current_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem listar usuários"
        )
    
    users = db.query(User).all()
    return users


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Atualiza usuário (apenas admin ou próprio usuário)"""
    if current_user.role != Role.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sem permissão para editar este usuário"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    update_data = user_data.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user
