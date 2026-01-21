import sqlite3
import os
import json

DB_PATH = os.path.join("backend", "crm.db")

def setup_settings_table():
    if not os.path.exists(DB_PATH):
        print(f"Erro: Banco de dados não encontrado em {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # Create table if create_all failed or wasn't run
        print("Criando tabela 'settings'...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Seed default colors for Agendamento Types
        # format: { type: color_hex }
        default_colors = {
            "reuniao": "#6366f1",
            "call": "#10b981",
            "visita": "#f59e0b",
            "outro": "#94a3b8"
        }

        print("Semeando cores padrão...")
        cursor.execute(
            "INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)",
            ("agendamento_colors", json.dumps(default_colors), "Cores fixas para tipos de agendamento")
        )

        conn.commit()
        print("Migração de configurações concluída com sucesso!")
            
    except Exception as e:
        print(f"Erro na migração: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    setup_settings_table()
