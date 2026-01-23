
import sys
import os

# Add backend to path
sys.path.append(os.getcwd())

from app.services.contract_engine import ContractAssembler
from collections import namedtuple
from datetime import datetime

# Mocks
Orcamento = namedtuple('Orcamento', ['id', 'valor_setup', 'valor_mensal', 'titulo', 'configuracao'])
Cliente = namedtuple('Cliente', ['nome', 'razao_social', 'documento_tipo', 'documento', 'endereco'])

def test_generation():
    print("Initializing Assembler...")
    try:
        assembler = ContractAssembler()
        print("Assembler OK -> Template Dir:", assembler.env.loader.searchpath)
    except Exception as e:
        print("CRASH in Init:", e)
        return

    print("Creating Mock Data...")
    orc = Orcamento(
        id="123", valor_setup=1000.0, valor_mensal=500.0, titulo="Teste", 
        configuracao={"modulos": {}, "integracoes": {}, "customizacoes": {}}
    )
    cli = Cliente(
        nome="Cliente Teste", razao_social="Cliente Ltda", documento_tipo="cnpj", 
        documento="00.000.000/0001-00", endereco="Rua 1"
    )

    print("Generating Contract...")
    try:
        html = assembler.generate_contract(cli, orc, "contrato_v1.html")
        print("SUCCESS! Length:", len(html))
    except Exception as e:
        print("CRASH in Generation:", e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_generation()
