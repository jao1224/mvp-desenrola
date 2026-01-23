from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User, Role
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_list_users():
    db = SessionLocal()
    try:
        print("Querying users...")
        users = db.query(User).all()
        print(f"Found {len(users)} users.")
        for u in users:
            print(f"ID: {u.id}, Name: {u.name}, Role: {u.role} (Type: {type(u.role)})")
            
        print("Test 2: Creating a Pydantic Model from User")
        from app.schemas.user import UserResponse
        for u in users:
            try:
                dto = UserResponse.model_validate(u)
                print(f"User {u.name} validated OK: {dto}")
            except Exception as e:
                print(f"Validation FAILED for {u.name}: {e}")

    except Exception as e:
        print(f"CRASH: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_list_users()
