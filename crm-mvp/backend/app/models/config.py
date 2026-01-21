from sqlalchemy import Column, String, Text, DateTime
from datetime import datetime
from ..core.database import Base

class Setting(Base):
    __tablename__ = "settings"
    
    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False) # JSON string
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
