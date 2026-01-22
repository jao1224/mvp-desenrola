import sys
import os
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_current_user
from app.models.user import User

# Mock user
def mock_get_current_user():
    return User(id="test_user_id", name="Test User", email="test@example.com")

app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)

def create_persist_payment():
    print("Creating 'DB LINK CHECK' payment via TestClient...")
    payload = {
        "tipo": "recebimento",
        "descricao": "DB LINK CHECK",
        "valor": 123.45,
        "data_vencimento": "2026-01-21T00:00:00",
        "status": "pendente"
    }
    
    response = client.post("/api/financeiro", json=payload)
    if response.status_code == 201:
        print(f"Created successfully: {response.json()['id']}")
        print("Please check the Browser UI to see if 'DB LINK CHECK' appears.")
    else:
        print(f"Failed to create: {response.status_code}")

if __name__ == "__main__":
    create_persist_payment()
