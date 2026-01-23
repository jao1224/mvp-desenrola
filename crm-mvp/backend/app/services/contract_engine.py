
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
import os

# Fallback if num2words not installed
try:
    from num2words import num2words
except ImportError:
    num2words = None

class ContractAssembler:
    def __init__(self, template_dir: str = "app/templates"):
        # Ensure we are pointing to the right directory
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        template_path = os.path.join(base_dir, "templates")
        
        self.env = Environment(loader=FileSystemLoader(template_path))
    
    def format_currency_extenso(self, value: float) -> str:
        if num2words:
            try:
                # Basic implementation for BRL
                return num2words(value, lang='pt_BR', to='currency')
            except:
                return f"{value} reais"
        return f"{value} reais"

    def format_date_extenso(self, date_obj) -> str:
        meses = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ]
        return f"{date_obj.day} de {meses[date_obj.month - 1]} de {date_obj.year}"

    def generate_contract(self, cliente, orcamento, template_name="contrato_v1.html") -> str:
        template = self.env.get_template(template_name)
        
        # Prepare context
        today = datetime.now()
        
        # Calculate totals
        valor_setup = orcamento.valor_setup or 0.0
        valor_mensal = orcamento.valor_mensal or 0.0
        
        context = {
            "contrato_numero": f"{today.year}/{orcamento.id}",
            
            # Contratada (Hardcoded for MVP)
            "empresa_nome": "MINHA AGÊNCIA DE TECNOLOGIA LTDA",
            "empresa_cnpj": "00.000.000/0001-00",
            "empresa_endereco": "Av. Paulista, 1000, São Paulo/SP",
            
            # Cliente
            "cliente_nome": cliente.nome or cliente.razao_social or "CLIENTE SEM NOME",
            "cliente_tipo": "pj" if cliente.documento_tipo == "cnpj" else "pf",
            "cliente_documento": cliente.documento or "000.000.000-00",
            "cliente_endereco": cliente.endereco or "Endereço não informado",
            
            # Orçamento
            "orcamento_titulo": orcamento.titulo,
            "modulos": [k.replace('module_', '').upper() for k, v in orcamento.configuracao.get('modulos', {}).items() if v],
            "servicos": [], # Populate if integrations/customizations
            "data_aprovacao": today.strftime("%d/%m/%Y"), # Assuming approved now
            
            # Valores
            "valor_setup": f"R$ {valor_setup:,.2f}",
            "valor_setup_extenso": self.format_currency_extenso(valor_setup),
            "valor_mensal": f"R$ {valor_mensal:,.2f}",
            "valor_mensal_extenso": self.format_currency_extenso(valor_mensal),
            "dia_vencimento": "10",
            
            # Vigencia
            "data_inicio": today.strftime("%d/%m/%Y"),
            "data_fim": today.replace(year=today.year + 1).strftime("%d/%m/%Y"),
            
            # Footer
            "data_hoje_extenso": self.format_date_extenso(today)
        }
        
        # Add extra services
        integrations = orcamento.configuracao.get('integracoes', {})
        for k, v in integrations.items():
            if v: context['servicos'].append(f"Integração: {k.replace('int_', '').replace('_', ' ').title()}")
            
        customs = orcamento.configuracao.get('customizacoes', {})
        for k, v in customs.items():
            if v: context['servicos'].append(f"Customização: {k.replace('cust_', '').replace('_', ' ').title()}")

        return template.render(context)
