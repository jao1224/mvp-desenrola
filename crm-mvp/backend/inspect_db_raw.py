from sqlalchemy import create_engine, text
from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.database_url)

def inspect_raw():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, name, email, role FROM users"))
        print("\n--- RAW DB VALUES ---")
        for row in result:
           print(f"Name: {row.name}, Role (Raw): '{row.role}'")

if __name__ == "__main__":
    inspect_raw()
