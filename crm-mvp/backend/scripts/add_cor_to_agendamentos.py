import sqlite3
import os

DB_PATH = os.path.join("backend", "crm.db")

def add_cor_column():
    if not os.path.exists(DB_PATH):
        print(f"Erro: Banco de dados não encontrado em {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        print("Adicionando coluna 'cor' à tabela 'agendamentos'...")
        cursor.execute("ALTER TABLE agendamentos ADD COLUMN cor TEXT DEFAULT '#3b82f6'")
        conn.commit()
        print("Coluna 'cor' adicionada com sucesso!")
            
    except Exception as e:
        if "duplicate column name" in str(e).lower():
            print("A coluna 'cor' já existe.")
        else:
            print(f"Erro ao adicionar coluna: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_cor_column()
