import sys
import os

# Add current directory to path so we can import app modules
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.models.projeto import Projeto
from sqlalchemy import text

def debug_query():
    print("Testing Projects Query...")
    db = SessionLocal()
    try:
        # 1. Try raw SQL to check table existence
        try:
            db.execute(text("SELECT * FROM projetos LIMIT 1"))
            print("Table 'projetos' exists.")
        except Exception as e:
            print(f"Error querying table 'projetos': {e}")
            return

        # 2. Try ORM query
        try:
            projs = db.query(Projeto).limit(5).all()
            print(f"ORM Query success. Found {len(projs)} projects.")
            for p in projs:
                print(f" - {p.nome} ({p.status})")
        except Exception as e:
            print(f"ORM Query failed: {e}")
            import traceback
            traceback.print_exc()

    finally:
        db.close()

if __name__ == "__main__":
    debug_query()
