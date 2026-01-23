from sqlalchemy import create_engine, text
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.database_url)

def inspect():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, name, email, role FROM users"))
        print("\n--- USERS TABLE ---")
        for row in result:
            print(f"ID: {row.id}, Name: {row.name}, Email: {row.email}, Role: '{row.role}' (Type: {type(row.role)})")
        print("-------------------\n")

if __name__ == "__main__":
    inspect()
