
import requests
import uuid
from datetime import datetime

BASE_URL = "http://127.0.0.1:8005/api"

def run_test():
    print(">>> 1. Authenticating/Prepping...")
    # Mocking a user or assuming bypass. If auth is strict, we need a token.
    # Let's try to bypass auth logic or assume dev env.
    # If not possible, I'll use the 'admin' user created in previous steps if any.
    # For now, let's assume I can hit endpoints if I have a token.
    # I'll try to register a temp user.
    session = requests.Session()
    
    email = f"test_{uuid.uuid4()}@example.com"
    pwd = "password123"
    
    # Register/Login
    print(f"   Registering temp user {email}...")
    reg = session.post(f"{BASE_URL}/auth/register", json={
        "email": email, "password": pwd, "name": "Tester"
    })
    

    
    # If reg fails, it might be due to user existing (status 400).
    # If it's 500, we still try to login just in case the error is spurious or we can reuse old credentials.
    print(f"   Register Status: {reg.status_code}")
    if reg.status_code != 200:
        print(f"   Register Output: {reg.text}")

    # Login
    print("   Logging in...")
    login = session.post(f"{BASE_URL}/auth/login", json={
        "email": email, "password": pwd
    })
    
    if login.status_code != 200:
        print(f"FAILED Login: {login.text}")
        # Try finding a user in DB? No, let's stop.
        return
        
    token = login.json()['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    print("   Auth OK.")

    # 2. Create Cliente
    print(">>> 2. Creating Dummy Client...")
    cliente_data = {
        "nome": "Cliente Teste Ltda",
        "email": "cliente@teste.com",
        "telefone": "11999999999",
        "documento": "12345678000199",
        "documento_tipo": "cnpj",
        "endereco": "Rua Teste, 123"
    }
    res_cli = session.post(f"{BASE_URL}/clientes", json=cliente_data, headers=headers)
    if res_cli.status_code != 200:
        print(f"FAILED Client Create: {res_cli.text}")
        return
    cliente_id = res_cli.json()['id']
    print(f"   Cliente ID: {cliente_id}")

    # 3. Create Orcamento
    print(">>> 3. Creating Dummy Orcamento...")
    orcamento_data = {
        "cliente_id": cliente_id,
        "titulo": "Orçamento Teste Contrato",
        "status": "aprovado",
        "valor_total": 1500.00,
        "validade": datetime.now().isoformat(),
        "configuracao": {
            "modulos": {"module_crm": True},
            "integracoes": {"int_whatsapp": True},
            "customizacoes": {}
        }
    }
    res_orc = session.post(f"{BASE_URL}/orcamentos", json=orcamento_data, headers=headers)
    if res_orc.status_code != 200:
        print(f"FAILED Orcamento Create: {res_orc.text}")
        return
    orcamento_id = res_orc.json()['id']
    print(f"   Orcamento ID: {orcamento_id}")

    # 4. Generate Preview
    print(">>> 4. Testing Contract Preview...")
    preview_data = {
        "orcamento_id": orcamento_id,
        "cliente_id": cliente_id,
        "template_name": "contrato_v1.html"
    }
    
    res_prev = session.post(f"{BASE_URL}/contratos/preview", json=preview_data, headers=headers)
    
    print(f"   Status: {res_prev.status_code}")
    if res_prev.status_code == 200:
        content = res_prev.json().get('html_content', '')
        if "CONTRATO DE PRESTAÇÃO" in content:
            print(">>> SUCCESS! Contract HTML generated correctly.")
            print(f"Snippet: {content[:100]}...")
        else:
            print(">>> CHECK: Response 200 but content suspicious.")
            print(content[:200])
    else:
        print(f">>> FAIL: {res_prev.text}")

if __name__ == "__main__":
    run_test()
