import os
import sys

# Adiciona o diretório raiz ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine, Base
from app.models.orcamento import Orcamento

def create_table():
    print("Criando tabela de orçamentos...")
    Base.metadata.create_all(bind=engine, tables=[Orcamento.__table__])
    print("Tabela 'orcamentos' criada com sucesso!")

if __name__ == "__main__":
    create_table()
