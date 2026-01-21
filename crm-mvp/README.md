# CRM MVP - Sistema de Gestão

Sistema de CRM interno para empresa de TI focada em automações e engenharia de soluções.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Backend | Python 3.11 + FastAPI |
| Frontend | TypeScript Vanilla + Vite |
| Banco | SQLite |
| Auth | JWT + httpOnly cookies |

## Estrutura

```
crm-mvp/
├── backend/          # API FastAPI
│   ├── app/
│   │   ├── api/      # Endpoints
│   │   ├── core/     # Config, DB, Security
│   │   ├── models/   # SQLAlchemy
│   │   └── schemas/  # Pydantic
│   └── requirements.txt
│
├── frontend/         # SPA TypeScript
│   ├── src/
│   │   ├── api/      # Cliente HTTP
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
│
└── uploads/          # Documentos
```

## Como Executar

### 1. Backend

```bash
cd crm-mvp/backend

# Criar ambiente virtual
python -m venv venv

# Ativar (Windows)
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Executar
uvicorn app.main:app --reload
```

API disponível em: http://localhost:8000
Documentação: http://localhost:8000/docs

### 2. Frontend

```bash
cd crm-mvp/frontend

# Instalar dependências
npm install

# Executar
npm run dev
```

App disponível em: http://localhost:5173

## Primeiro Acesso

1. Acesse http://localhost:5173
2. Clique em "Criar conta"
3. O primeiro usuário será **ADMIN** automaticamente
4. Faça login e comece a usar!

## Módulos

- **Dashboard** - Visão geral com KPIs
- **Clientes** - CRUD com histórico de interações
- **Projetos** - CRUD com entregáveis
- **Contratos** - CRUD com alertas de vencimento
- **Financeiro** - Receitas, despesas e fluxo de caixa
