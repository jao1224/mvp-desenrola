from sqlalchemy import create_engine, text
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.database_url)

def fix_admin():
    with engine.connect() as conn:
        print("Fixing Admin Role...")
        # Update Admin User to have 'admin' role
        conn.execute(text("UPDATE users SET role = 'admin' WHERE email = 'admin@crm.com'"))
        conn.execute(text("UPDATE users SET role = 'admin' WHERE name LIKE '%Admin%'"))
        conn.commit()
        print("Admin role updated.")
        
        # Verify
        result = conn.execute(text("SELECT name, email, role FROM users"))
        for row in result:
            print(f"User: {row.name}, Role: {row.role}")

if __name__ == "__main__":
    fix_admin()
