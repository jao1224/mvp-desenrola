import sqlite3
import os

DB_PATH = os.path.join("backend", "crm.db")

def create_table():
    if not os.path.exists(DB_PATH):
        print(f"Erro: Banco de dados não encontrado em {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        print("Criando tabela 'agendamentos'...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS agendamentos (
                id TEXT PRIMARY KEY,
                cliente_id TEXT NOT NULL,
                titulo TEXT NOT NULL,
                descricao TEXT,
                data_hora DATETIME NOT NULL,
                duracao_minutos INTEGER DEFAULT 60,
                status TEXT DEFAULT 'pendente',
                tipo TEXT DEFAULT 'reuniao',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cliente_id) REFERENCES clientes (id)
            )
        """)
        
        # Criar índices
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_agendamentos_cliente_id ON agendamentos (cliente_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_agendamentos_data_hora ON agendamentos (data_hora)")
        
        conn.commit()
        print("Tabela 'agendamentos' criada com sucesso!")
            
    except Exception as e:
        print(f"Erro ao criar tabela: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    create_table()
