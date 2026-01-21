# CRM MVP Backend

## Requisitos

- Python 3.11+
- SQLite (desenvolvimento)

## Setup

```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

## Endpoints

API disponível em: http://localhost:8000
Documentação: http://localhost:8000/docs
