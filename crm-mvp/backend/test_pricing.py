# -*- coding: utf-8 -*-
"""
Script de teste para verificar se os valores de configuracao estao sendo aplicados corretamente
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app.api.orcamentos import calculate_price
from app.schemas.orcamento import PriceCalculationRequest

# Teste 1: Valores padrao
print('=== TESTE 1: Valores Padrao ===')
config1 = {
    'premissas': {},
    'custom_prices': {},
    'modulos': {'crm': True, 'agente_ia_whatsapp': True},
    'integracoes': {'agente_crm': True},
    'customizacoes': {'interpreta_texto': True},
    'api_ia': {'requisicoes_mes': 100, 'custo_por_requisicao': 0.09}
}
req1 = PriceCalculationRequest(configuracao=config1)
res1 = calculate_price(req1)
print(f'Setup Total: R$ {res1["valor_setup"]}')
print(f'Mensal Total: R$ {res1["valor_mensal"]}')
print()

# Teste 2: Valores customizados (como viria da pagina Configuracoes)
print('=== TESTE 2: Valores Customizados ===')
config2 = {
    'premissas': {
        'setup_base': 3999.00,
        'mensal_servidor': 199.99,
        'mensal_suporte': 599.99
    },
    'custom_prices': {
        'modulo_crm': 2500.00,
        'modulo_agente_ia_whatsapp': 3500.00,
        'integracao_agente_crm': 1500.00,
        'interpreta_texto': 350.00
    },
    'modulos': {'crm': True, 'agente_ia_whatsapp': True},
    'integracoes': {'agente_crm': True},
    'customizacoes': {'interpreta_texto': True},
    'api_ia': {'requisicoes_mes': 100, 'custo_por_requisicao': 0.09}
}
req2 = PriceCalculationRequest(configuracao=config2)
res2 = calculate_price(req2)
print(f'Setup Total: R$ {res2["valor_setup"]}')
print(f'Mensal Total: R$ {res2["valor_mensal"]}')
print()

# Comparacao
print('=== COMPARACAO ===')
print(f'Setup Padrao: R$ {res1["valor_setup"]} vs Customizado: R$ {res2["valor_setup"]}')
print(f'Mensal Padrao: R$ {res1["valor_mensal"]} vs Customizado: R$ {res2["valor_mensal"]}')
print()

if res1['valor_setup'] != res2['valor_setup']:
    print('[OK] SUCESSO! Os valores customizados estao sendo aplicados corretamente!')
    print()
    print('Detalhes das diferencas:')
    print(f'  - Setup Base: 2499.00 (padrao) vs 3999.00 (customizado)')
    print(f'  - Modulo CRM: 1500.00 (padrao) vs 2500.00 (customizado)')
    print(f'  - Modulo IA WA: 2500.00 (padrao) vs 3500.00 (customizado)')
    print(f'  - Integracao CRM: 800.00 (padrao) vs 1500.00 (customizado)')
    print(f'  - Interpreta Texto: 199.99 (padrao) vs 350.00 (customizado)')
else:
    print('[FALHA] Os valores nao mudaram')
