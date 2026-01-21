import sqlite3
import os

db_path = os.path.join("c:\\Users\\João Fernando\\Desktop\\Nova pasta\\crm-mvp\\backend", "crm.db")

def migrate():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Iniciando migração da tabela 'orcamentos' para v2...")
    
    # 1. Adicionar novas colunas
    try:
        cursor.execute("ALTER TABLE orcamentos ADD COLUMN configuracao JSON")
        print("Coluna 'configuracao' adicionada.")
    except sqlite3.OperationalError:
        print("Coluna 'configuracao' já existe ou erro ao adicionar.")
        
    try:
        cursor.execute("ALTER TABLE orcamentos ADD COLUMN valor_setup FLOAT DEFAULT 0.0")
        print("Coluna 'valor_setup' adicionada.")
    except sqlite3.OperationalError:
        print("Coluna 'valor_setup' já existe ou erro ao adicionar.")
        
    try:
        cursor.execute("ALTER TABLE orcamentos ADD COLUMN valor_mensal FLOAT DEFAULT 0.0")
        print("Coluna 'valor_mensal' adicionada.")
    except sqlite3.OperationalError:
        print("Coluna 'valor_mensal' já existe ou erro ao adicionar.")
        
    # 2. Remover colunas obsoletas (opcional, SQLite não suporta DROP COLUMN facilmente em versões antigas, 
    # mas em sistemas modernos sim. Vamos apenas deixar elas lá ou renomear se for crítico.)
    # Por segurança em MVP, vamos apenas manter as novas e parar de usar as antigas.
    
    conn.commit()
    conn.close()
    print("Migração concluída com sucesso!")

if __name__ == "__main__":
    migrate()
