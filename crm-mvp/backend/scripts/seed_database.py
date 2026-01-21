"""
Script de Seed para o CRM MVP
Popula o banco de dados com dados de exemplo para facilitar o desenvolvimento e testes.
"""
import sqlite3
import uuid
from datetime import datetime, timedelta
import json
import os

# Caminho do banco de dados
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'crm.db')

def generate_id():
    return str(uuid.uuid4())

def seed_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("🌱 Iniciando Seed do Banco de Dados...")
    
    # --- 1. USUÁRIOS ---
    print("👤 Criando usuários...")
    users = [
        (generate_id(), "Admin Sistema", "admin@crm.com", "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNi/D.jKi.kZS", "admin", "True", datetime.utcnow().isoformat()),
        (generate_id(), "João Gestor", "joao@crm.com", "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNi/D.jKi.kZS", "gestor", "True", datetime.utcnow().isoformat()),
        (generate_id(), "Maria Dev", "maria@crm.com", "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNi/D.jKi.kZS", "colaborador", "True", datetime.utcnow().isoformat()),
    ]
    for u in users:
        try:
            cursor.execute("INSERT INTO users (id, name, email, password_hash, role, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", u)
        except sqlite3.IntegrityError:
            print(f"  - Usuário {u[2]} já existe, pulando.")
    
    user_id = users[0][0]  # Admin para logs

    # --- 2. CLIENTES ---
    print("🏢 Criando clientes...")
    clientes_data = [
        ("TechCorp Solutions", "12.345.678/0001-90", "contato@techcorp.com", "(11) 99999-1234", "Tecnologia", "ativo", "prospeccao"),
        ("Varejo Express Ltda", "98.765.432/0001-10", "vendas@varejoexpress.com", "(21) 98888-5678", "Varejo", "ativo", "qualificacao"),
        ("Indústria Mecânica SA", "11.222.333/0001-44", "compras@indmec.com.br", "(31) 97777-9999", "Indústria", "em_negociacao", "proposta"),
        ("Startup Inovação", "55.666.777/0001-88", "ceo@startupinova.io", "(41) 96666-1111", "Tecnologia", "potencial", "prospeccao"),
        ("Construtora Horizonte", "22.333.444/0001-55", "obras@horizonte.com.br", "(51) 95555-2222", "Construção", "ativo", "negociacao"),
    ]
    clientes_ids = []
    for c in clientes_data:
        cid = generate_id()
        clientes_ids.append(cid)
        try:
            cursor.execute("""
                INSERT INTO clientes (id, nome, documento, email, telefone, setor, status, pipeline_stage, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (cid, c[0], c[1], c[2], c[3], c[4], c[5], c[6], datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))
        except sqlite3.IntegrityError:
            print(f"  - Cliente {c[0]} já existe, pulando.")

    # --- 3. PROJETOS ---
    print("📁 Criando projetos...")
    projetos_data = [
        (clientes_ids[0], "Implementação CRM Completo", "Sistema de gestão de clientes integrado", "em_execucao"),
        (clientes_ids[1], "E-commerce B2B", "Plataforma de vendas corporativas", "planejamento"),
        (clientes_ids[2], "Automação Industrial IoT", "Sensores e dashboards em tempo real", "em_execucao"),
        (clientes_ids[3], "MVP App Mobile", "Aplicativo iOS e Android", "planejamento"),
    ]
    for p in projetos_data:
        pid = generate_id()
        try:
            cursor.execute("""
                INSERT INTO projetos (id, cliente_id, nome, descricao, status, prazo_inicio, prazo_final, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (pid, p[0], p[1], p[2], p[3], datetime.utcnow().isoformat(), (datetime.utcnow() + timedelta(days=90)).isoformat(), datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))
        except sqlite3.IntegrityError:
            print(f"  - Projeto {p[1]} já existe, pulando.")

    # --- 4. CONTRATOS ---
    print("📄 Criando contratos...")
    contratos_data = [
        (clientes_ids[0], "CTR-2026-001", 12000.0),
        (clientes_ids[2], "CTR-2026-002", 8500.0),
    ]
    for c in contratos_data:
        cid = generate_id()
        try:
            cursor.execute("""
                INSERT INTO contratos (id, cliente_id, numero, data_inicio, data_termino, valor, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (cid, c[0], c[1], datetime.utcnow().isoformat(), (datetime.utcnow() + timedelta(days=365)).isoformat(), c[2], datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))
        except sqlite3.IntegrityError:
            print(f"  - Contrato {c[1]} já existe, pulando.")

    # --- 5. AGENDAMENTOS ---
    print("📅 Criando agendamentos...")
    agendamentos_data = [
        (clientes_ids[0], "Reunião de Kickoff", "Início do projeto CRM", "reuniao", 60, "#4f46e5"),
        (clientes_ids[1], "Call de Alinhamento", "Discussão de requisitos", "call", 30, "#10b981"),
        (clientes_ids[4], "Visita Técnica", "Avaliação do ambiente", "visita", 120, "#f59e0b"),
    ]
    for i, a in enumerate(agendamentos_data):
        aid = generate_id()
        data_hora = (datetime.utcnow() + timedelta(days=i+1, hours=10)).isoformat()
        try:
            cursor.execute("""
                INSERT INTO agendamentos (id, cliente_id, titulo, descricao, data_hora, duracao_minutos, status, tipo, cor, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (aid, a[0], a[1], a[2], data_hora, a[4], "pendente", a[3], a[5], datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))
        except sqlite3.IntegrityError:
            print(f"  - Agendamento {a[1]} já existe, pulando.")

    # --- 6. ORÇAMENTOS (v2) ---
    print("💰 Criando orçamentos de exemplo...")
    config_exemplo = {
        "modulos": {"crm": True, "erp": False, "agente_ia_whatsapp": True},
        "integracoes": {"agente_crm": True, "agente_erp": False},
        "customizacoes": {"interpreta_texto": True, "responde_texto": True, "envio_email": False},
        "api_ia": {"requisicoes_mes": 5000, "custo_por_requisicao": 0.09}
    }
    detalhes_exemplo = {
        "setup": {"Base": 2499.0, "Módulo: CRM": 1500.0, "Módulo: AGENTE_IA_WHATSAPP": 2500.0, "Integração: agente_crm": 800.0, "Custom: interpreta_texto": 199.99, "Custom: responde_texto": 199.99},
        "mensal": {"Servidor/Hospedagem": 119.99, "Suporte e Manutenção": 899.99, "API de IA (Variável)": 450.0}
    }
    orcamentos_data = [
        (clientes_ids[0], "Proposta CRM + IA WhatsApp", "Implementação completa com agente inteligente", config_exemplo, 7698.98, 1469.98, 25338.74, detalhes_exemplo, "enviado"),
        (clientes_ids[3], "MVP com Agente IA Básico", "Versão inicial para validação", {"modulos": {"agente_ia_whatsapp": True}, "integracoes": {}, "customizacoes": {}, "api_ia": {"requisicoes_mes": 1000, "custo_por_requisicao": 0.09}}, 2499.0, 1109.98, 15818.76, {"setup": {"Base": 2499.0}, "mensal": {"Servidor/Hospedagem": 119.99, "Suporte e Manutenção": 899.99, "API de IA (Variável)": 90.0}}, "rascunho"),
    ]
    for o in orcamentos_data:
        oid = generate_id()
        try:
            cursor.execute("""
                INSERT INTO orcamentos (id, cliente_id, titulo, descricao, configuracao, valor_setup, valor_mensal, valor_total, detalhes_calculo, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (oid, o[0], o[1], o[2], json.dumps(o[3]), o[4], o[5], o[6], json.dumps(o[7]), o[8], datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))
        except sqlite3.IntegrityError:
            print(f"  - Orçamento {o[1]} já existe, pulando.")

    # --- 7. FINANCEIRO (PAGAMENTOS) ---
    print("💵 Criando lançamentos financeiros...")
    financeiro_data = [
        ("Pagamento Projeto CRM", "recebimento", 25000.0, "pago", clientes_ids[0]),
        ("Mensalidade Suporte TechCorp", "recebimento", 1200.0, "pendente", clientes_ids[0]),
        ("Licença Software AWS", "pagamento", 850.0, "pago", None),
        ("Folha de Pagamento", "pagamento", 15000.0, "pago", None),
    ]
    for f in financeiro_data:
        fid = generate_id()
        data_venc = (datetime.utcnow() + timedelta(days=30)).isoformat()
        try:
            cursor.execute("""
                INSERT INTO pagamentos (id, descricao, tipo, valor, status, cliente_id, data_vencimento, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (fid, f[0], f[1], f[2], f[3], f[4], data_venc, datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))
        except sqlite3.IntegrityError:
            print(f"  - Pagamento {f[0]} já existe, pulando.")

    conn.commit()
    conn.close()
    print("\n✅ Seed concluído com sucesso!")
    print("   - 3 Usuários")
    print("   - 5 Clientes")
    print("   - 4 Projetos")
    print("   - 2 Contratos")
    print("   - 3 Agendamentos")
    print("   - 2 Orçamentos")
    print("   - 4 Lançamentos Financeiros")

if __name__ == "__main__":
    seed_database()
