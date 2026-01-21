import sys
import os
from datetime import datetime

# Add project root to path
sys.path.append(os.getcwd())

try:
    from app.core.security import get_current_user
    from app.models.user import Role
    from app.schemas.user import UserResponse
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)

def test_mock_logic():
    print("Testing mock logic...")
    
    # Simulate logic inside get_current_user
    from types import SimpleNamespace
    mock_user = SimpleNamespace(
        id="dev-admin-id",
        email="admin@teste.com",
        name="Admin Dev",
        role=Role.ADMIN,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    print(f"Mock user created: {mock_user}")
    
    # Simulate Pydantic validation
    try:
        user_response = UserResponse.model_validate(mock_user)
        print("Pydantic validation SUCCESS")
        print(user_response.model_dump())
    except Exception as e:
        print(f"Pydantic validation FAILED: {e}")

if __name__ == "__main__":
    test_mock_logic()
