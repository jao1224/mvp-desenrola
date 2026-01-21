import sqlite3
import os

# Caminho do banco de dados (ajuste se necessário)
DB_PATH = os.path.join("backend", "crm.db")

def add_column():
    if not os.path.exists(DB_PATH):
        print(f"Erro: Banco de dados não encontrado em {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # Verificar se a coluna já existe
        cursor.execute("PRAGMA table_info(clientes)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if "pipeline_stage" in columns:
            print("Coluna 'pipeline_stage' já existe na tabela 'clientes'.")
        else:
            print("Adicionando coluna 'pipeline_stage'...")
            cursor.execute("ALTER TABLE clientes ADD COLUMN pipeline_stage VARCHAR DEFAULT 'potencial'")
            
            # Atualizar registros existentes para garantir que não fiquem null (redundante com DEFAULT, mas seguro)
            cursor.execute("UPDATE clientes SET pipeline_stage = 'potencial' WHERE pipeline_stage IS NULL")
            
            conn.commit()
            print("Migração concluída com sucesso!")
            
    except Exception as e:
        print(f"Erro ao migrar banco de dados: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_column()
