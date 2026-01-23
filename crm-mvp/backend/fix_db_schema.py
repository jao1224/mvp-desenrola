
from app.core.database import engine, Base
from sqlalchemy import text
import sys

def migrate_db():
    print("Migrating Database...")
    with engine.connect() as conn:
        try:
            # Check if column exists
            print("Checking columns...")
            conn.execute(text("SELECT conteudo_doc FROM contratos LIMIT 1"))
            print("Column 'conteudo_doc' already exists.")
        except Exception as e:
            if "no such column" in str(e):
                print("Adding 'conteudo_doc' column...")
                conn.execute(text("ALTER TABLE contratos ADD COLUMN conteudo_doc TEXT"))
                print("Column added.")
            else:
                print(f"Error checking column: {e}")
        
        try:
            conn.execute(text("SELECT template_versao FROM contratos LIMIT 1"))
            print("Column 'template_versao' already exists.")
        except Exception as e:
            if "no such column" in str(e):
                print("Adding 'template_versao' column...")
                conn.execute(text("ALTER TABLE contratos ADD COLUMN template_versao VARCHAR(20) DEFAULT 'v1'"))
                print("Column added.")
            else:
                print(f"Error checking column: {e}")
        
        conn.commit()
    print("Migration complete.")

if __name__ == "__main__":
    migrate_db()
