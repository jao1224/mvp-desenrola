from app.core.database import SessionLocal, engine, Base
from app.models.user import User, Role
from app.core.security import get_password_hash
from app.models import financeiro, projeto # Import all models to ensure metadata is complete

def reset_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Recreating tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Creating new Admin user...")
    db = SessionLocal()
    
    admin = User(
        email="admin@admin.com",
        name="Admin Master",
        password_hash=get_password_hash("admin"),
        role=Role.ADMIN
    )
    
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    print(f"Admin created successfully!")
    print(f"Email: {admin.email}")
    print(f"Password: admin")
    print(f"ID: {admin.id}")
    
    db.close()

if __name__ == "__main__":
    reset_db()
