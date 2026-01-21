from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import get_settings
from app.core.database import engine, Base
from app.api import (
    auth_router,
    clientes_router,
    projetos_router,
    contratos_router,
    financeiro_router,
    agendamento_router,
    config_router,
    orcamentos_router
)

settings = get_settings()

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CRM MVP API",
    description="API do CRM para gestão de clientes, projetos, contratos e financeiro",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra routers
app.include_router(auth_router, prefix="/api")
app.include_router(clientes_router, prefix="/api")
app.include_router(projetos_router, prefix="/api")
app.include_router(contratos_router, prefix="/api")
app.include_router(financeiro_router, prefix="/api")
app.include_router(agendamento_router, prefix="/api")
app.include_router(config_router, prefix="/api")
app.include_router(orcamentos_router, prefix="/api")

# Servir arquivos estáticos (uploads)
uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/")
async def root():
    return {
        "message": "CRM MVP API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
