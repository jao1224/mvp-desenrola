import sys
import os
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_current_user
from app.models.user import User

# Mock user dependency
def mock_get_current_user():
    return User(id="test_user_id", name="Test User", email="test@example.com")

app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)

def test_delete_pagamento():
    print("1. Creating a test payment...")
    payload = {
        "tipo": "recebimento",
        "descricao": "Item to Delete",
        "valor": 100.0,
        "data_vencimento": "2026-01-21T00:00:00",
        "status": "pendente"
    }
    
    response = client.post("/api/financeiro", json=payload)
    if response.status_code != 201:
        print(f"Failed to create payment: {response.status_code} - {response.text}")
        return

    data = response.json()
    pagamento_id = data["id"]
    print(f"Created payment ID: {pagamento_id}")

    print("2. Verifying existence...")
    # List to confirm
    response = client.get("/api/financeiro")
    items = response.json()
    found = any(item["id"] == pagamento_id for item in items)
    print(f"Item found in list? {found}")
    
    print(f"3. Deleting payment {pagamento_id}...")
    response = client.delete(f"/api/financeiro/{pagamento_id}")
    print(f"Delete response: {response.status_code}")
    
    if response.status_code == 204:
        print("Delete returned 204 Success.")
    else:
        print(f"Delete failed: {response.text}")

    print("4. Verifying deletion...")
    response = client.get("/api/financeiro")
    items = response.json()
    found = any(item["id"] == pagamento_id for item in items)
    
    if found:
        print("FAIL: Item still exists in list!")
    else:
        print("SUCCESS: Item was removed.")

if __name__ == "__main__":
    try:
        test_delete_pagamento()
    except Exception as e:
        print(f"An error occurred: {e}")
