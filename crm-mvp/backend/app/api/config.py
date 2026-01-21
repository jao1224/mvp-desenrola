from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..models.config import Setting
from ..schemas.config import SettingResponse, SettingUpdate, SettingCreate

router = APIRouter(prefix="/config", tags=["config"])

@router.get("/", response_model=List[SettingResponse])
def list_settings(db: Session = Depends(get_db)):
    return db.query(Setting).all()

@router.get("/{key}", response_model=SettingResponse)
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Configuração não encontrada")
    return setting

@router.put("/{key}", response_model=SettingResponse)
def update_setting(key: str, setting_data: SettingUpdate, db: Session = Depends(get_db)):
    print(f"🔧 CONFIG UPDATE: {key} -> {setting_data.value[:100]}...") # Log
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        # Permite criação se não existir? Ou apenas update?
        # Para cores, vamos permitir criação se for uma chave conhecida
        setting = Setting(key=key, value=setting_data.value, description=setting_data.description)
        db.add(setting)
    else:
        setting.value = setting_data.value
        if setting_data.description:
            setting.description = setting_data.description
            
    db.commit()
    db.refresh(setting)
    return setting
