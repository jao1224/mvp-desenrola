from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User, Role
from app.models.financeiro import ActivityLog
from app.core.config import get_settings
from app.core.security import get_password_hash
import traceback
import sys

# Redirect stderr to file
sys.stderr = open('crash.log', 'w')

settings = get_settings()
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def reproduce():
    db = SessionLocal()
    try:
        print("Attempting to create user...")
        
        # 1. Fetch an admin user for the log (simulating current_user)
        try:
            admin = db.query(User).filter(User.role == "admin").first()
        except:
            admin = None

        if not admin:
            print("No admin found via ORM, trying raw SQL or creating mock")
            # If ORM fails (maybe Role enum issue in filter?), try raw
            admin = User(name="Mock Admin", email="mock2@admin.com", password_hash="123", role="admin")
            db.add(admin)
            db.commit()
            db.refresh(admin)
        
        print(f"Using Admin ID: {admin.id}")

        # 2. Creating User
        new_email = "crash_log_test@test.com"
        
        # Cleanup
        existing = db.query(User).filter(User.email == new_email).first()
        if existing:
            db.delete(existing)
            db.commit()
            
        role_value = Role.COLABORADOR
        val_to_insert = role_value.value if hasattr(role_value, 'value') else role_value
        
        # 3. Create User
        print(f"Creating User with role: {val_to_insert}")
        user = User(
            email=new_email,
            password_hash=get_password_hash("123"), # This was suspect before?
            name="Crash User Log",
            role=val_to_insert
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"User created with ID: {user.id}")
        
        # 4. Create Log
        print("Creating ActivityLog...")
        log = ActivityLog(
            user_id=admin.id,
            action="CREATE_USER",
            details=f"Criou usuário '{user.name}' ({user.role})",
            entity_type="User",
            entity_id=str(user.id)
        )
        db.add(log)
        db.commit()
        print("SUCCESS! No crash.")

    except Exception:
        print("CRASH DETECTED! Writing to crash.log")
        traceback.print_exc() # Writes to stderr -> crash.log
        traceback.print_exc(file=sys.stdout)
    finally:
        db.close()

if __name__ == "__main__":
    reproduce()
