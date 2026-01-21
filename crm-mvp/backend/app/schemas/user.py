from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import Role


class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: Role = Role.COLABORADOR


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[Role] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
