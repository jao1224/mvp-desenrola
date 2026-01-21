import { orcamentos, clientes, settings } from '../api/client';
import { PriceCalculationResponse } from '../api/types';
import { showToast, formatCurrency, navigate } from '../utils/helpers';

export async function renderOrcamentos(container: HTMLElement) {
    // 1. Fetch Global Pricing Config
    let globalPricing: any = {};
    try {
        const pricingSetting = await settings.get('pricing_config?_t=' + Date.now());
        if (pricingSetting && pricingSetting.value) {
            globalPricing = JSON.parse(pricingSetting.value);
            console.log('✅ Global Pricing Fetched:', globalPricing); // Debug Log
        } else {
            console.warn('⚠️ Pricing setting empty, using defaults.');
        }
    } catch (e) {
        console.error('❌ Error fetching pricing:', e);
        // Defaults
        globalPricing = {
            setup_base: 2499.00,
            mensal_servidor: 119.99,
            mensal_suporte: 899.99,
            modulos: { crm: 1500, erp: 2000, ai: 2500 },
            customizacoes: {
                interpreta_texto: 199.99,
                interpreta_audio: 299.99,
                responde_texto: 199.99,
                responde_audio: 499.99,
                envio_email: 199.99
            }
        };
    }

    // State management
    let config = {
        premissas: {
            setup_base: (globalPricing.setup_base) || 2499.00,
            mensal_servidor: (globalPricing.mensal_servidor) || 119.99,
            mensal_suporte: (globalPricing.mensal_suporte) || 899.99
        },
        custom_prices: {
            modulo_crm: (globalPricing.modulos?.crm) || 1500.00,
            modulo_erp: (globalPricing.modulos?.erp) || 2000.00,
            modulo_ai_wa: (globalPricing.modulos?.ai) || 2500.00,

            // Customizations
            interpreta_texto: (globalPricing.customizacoes?.interpreta_texto) || 199.99,
            interpreta_audio: (globalPricing.customizacoes?.interpreta_audio) || 299.99,
            responde_texto: (globalPricing.customizacoes?.responde_texto) || 199.99,
            responde_audio: (globalPricing.customizacoes?.responde_audio) || 499.99,
            envio_email: (globalPricing.customizacoes?.envio_email) || 199.99
        },
        modulos: {
            crm: false,
            erp: false,
            agente_ia_whatsapp: true // Default
        },
        integracoes: {
            agente_crm: false,
            agente_erp: false
        },
        customizacoes: {
            interpreta_texto: false,
            interpreta_audio: false,
            responde_texto: false,
            responde_audio: false,
            envio_email: false
        },
        api_ia: {
            requisicoes_mes: 0,
            custo_por_requisicao: 0.09
        }
    };

    let calcResult: PriceCalculationResponse = {
        valor_setup: 0,
        valor_mensal: 0,
        valor_total: 0,
        detalhes: { setup: {}, mensal: {} }
    };

    container.innerHTML = `
        <style>
            .orcamento-v2-container {
                display: grid;
                grid-template-columns: 1fr 380px;
                gap: 2rem;
                padding: 1rem;
            }
            .calc-section {
                background: var(--color-bg-secondary);
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                border: 1px solid var(--color-border);
            }
            .section-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 1.5rem;
                border-bottom: 1px solid var(--color-border);
                padding-bottom: 0.8rem;
            }
            .section-number {
                background: var(--color-primary);
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.9rem;
                font-weight: 700;
            }
            .module-card {
                background: var(--color-bg-tertiary);
                border: 1px solid var(--color-border);
                border-radius: 10px;
                padding: 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
                transition: all 0.2s;
            }
            .module-card:hover {
                border-color: var(--color-primary);
                transform: translateX(5px);
            }
            .switch {
                position: relative;
                display: inline-block;
                width: 46px;
                height: 24px;
            }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #444;
                transition: .4s;
                border-radius: 24px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 18px; width: 18px;
                left: 3px; bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .slider { background-color: var(--color-primary); }
            input:checked + .slider:before { transform: translateX(22px); }

            .summary-sidebar {
                position: sticky;
                top: 2rem;
                background: var(--color-bg-secondary);
                border-radius: 16px;
                border: 1px solid var(--color-primary);
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .price-block {
                text-align: center;
                padding: 1rem;
                background: rgba(var(--color-primary-rgb), 0.1);
                border-radius: 12px;
            }
            .price-label { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; }
            .price-value { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); }
            
            .item-list { font-size: 0.85rem; border-top: 1px solid var(--color-border); padding-top: 1rem; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--color-text-muted); }
            .item-row.subtotal { color: var(--color-text); font-weight: 700; border-top: 1px dashed var(--color-border); padding-top: 8px; margin-top: 8px; }

            .variable-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            .checkbox-group {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.9rem;
                cursor: pointer;
            }
        </style>

        <div class="page-header">
            <div>
                <h1 class="page-title">📈 Inteligência de Preços v2</h1>
                <p class="page-subtitle">Valores baseados na Configuração Global.</p>
            </div>
            <div class="actions">
                 <button id="btn-config-pricing" class="btn btn-secondary">⚙️ Configurar Preços</button>
                 <button class="btn btn-secondary" onclick="location.reload()">Resetar</button>
            </div>
        </div>

        <div class="orcamento-v2-container">
            <div class="calc-main">
                <form id="calc-form-v2">

                    <!-- 1. Módulos -->
                    <div class="calc-section">
                        <div class="section-header">
                            <div class="section-number">1</div>
                            <h3 style="margin:0">Módulos do Projeto</h3>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Marque os sistemas que o cliente deseja contratar.</p>
                        
                        <div class="module-card">
                            <div style="flex: 1;"><strong>CRM</strong> (Customer Relationship Management)</div>
                            <label class="switch">
                                <input type="checkbox" name="module_crm" class="calc-trigger">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="module-card">
                            <div style="flex: 1;"><strong>ERP</strong> (Enterprise Resource Planning)</div>
                            <label class="switch">
                                <input type="checkbox" name="module_erp" class="calc-trigger">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="module-card">
                            <div style="flex: 1;"><strong>Agente de IA para WhatsApp</strong></div>
                            <label class="switch">
                                <input type="checkbox" name="module_ai_wa" class="calc-trigger" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- 2. Integrações -->
                    <div class="calc-section">
                        <div class="section-header">
                            <div class="section-number">2</div>
                            <h3 style="margin:0">Integrações</h3>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">Conecte o Agente de IA com outros sistemas.</p>
                        
                        <div class="module-card">
                            <div>Integrar Agente de IA com <strong>CRM</strong></div>
                            <label class="switch">
                                <input type="checkbox" name="int_ag_crm" class="calc-trigger">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="module-card">
                            <div>Integrar Agente de IA com <strong>ERP</strong></div>
                            <label class="switch">
                                <input type="checkbox" name="int_ag_erp" class="calc-trigger">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- 3. Custos Variáveis -->
                    <div class="calc-section">
                        <div class="section-header">
                            <div class="section-number">3</div>
                            <h3 style="margin:0">Custos Variáveis</h3>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="font-size: 0.9rem; margin-bottom: 1rem;">Customizações do Agente (Opcional)</h4>
                            <div class="variable-grid">
                                <label class="checkbox-group">
                                    <input type="checkbox" name="cust_text_in" class="calc-trigger"> Agente interpreta texto <span style="opacity:0.5">(${formatCurrency(globalPricing.customizacoes?.interpreta_texto || 199.99)})</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" name="cust_audio_in" class="calc-trigger"> Agente interpreta áudio <span style="opacity:0.5">(${formatCurrency(globalPricing.customizacoes?.interpreta_audio || 299.99)})</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" name="cust_text_out" class="calc-trigger"> Agente responde em texto <span style="opacity:0.5">(${formatCurrency(globalPricing.customizacoes?.responde_texto || 199.99)})</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" name="cust_audio_out" class="calc-trigger"> Agente responde em áudio <span style="opacity:0.5">(${formatCurrency(globalPricing.customizacoes?.responde_audio || 499.99)})</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" name="cust_email" class="calc-trigger"> Envio de e-mail <span style="opacity:0.5">(${formatCurrency(globalPricing.customizacoes?.envio_email || 199.99)})</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h4 style="font-size: 0.9rem; margin-bottom: 1rem;">Custo Estimado de API de IA (Mensal)</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Nº de Requisições/mês</label>
                                    <input type="number" name="api_reqs" class="form-input calc-trigger" value="0" min="0">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Custo por Requisição (R$)</label>
                                    <input type="number" name="api_cost" class="form-input calc-trigger" value="0.09" step="0.01" min="0">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. Descrição do Serviço -->
                    <div class="calc-section">
                        <div class="section-header">
                            <div class="section-number">4</div>
                            <h3 style="margin:0">Descrição do Serviço</h3>
                        </div>
                        <div class="form-group">
                            <textarea name="descricao" class="form-input" rows="4" placeholder="Ex: Desenvolvimento de um sistema de CRM completo com integração com WhatsApp..."></textarea>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Sidebar de Resumo -->
            <div class="summary-container">
                <div class="summary-sidebar">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem;">🧾</span>
                        <h3 style="margin:0">Orçamento Final</h3>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                        <div class="price-block" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem;">
                            <div class="price-label" style="text-align: left;">Setup</div>
                            <div class="price-value" id="disp-setup">R$ 0,00</div>
                        </div>
                        <div class="price-block" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem;">
                            <div class="price-label" style="text-align: left;">Mensal</div>
                            <div class="price-value" id="disp-mensal">R$ 0,00</div>
                        </div>
                    </div>

                    <div class="item-list">
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; margin-bottom: 10px;">Custos de Setup</h4>
                        <div id="setup-items"></div>
                        
                        <h4 style="font-size: 0.8rem; text-transform: uppercase; margin-top: 20px; margin-bottom: 10px;">Custos Mensais</h4>
                        <div id="mensal-items"></div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Selecionar Cliente</label>
                        <select id="final-cliente-id" class="form-input" required>
                             <option value="">Selecione para salvar...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Título da Proposta</label>
                        <input type="text" id="final-titulo" class="form-input" placeholder="Título Proposta">
                    </div>

                    <button id="save-budget-btn" class="btn btn-primary" style="width: 100%; padding: 1rem; font-weight: 700;">
                        💾 Salvar Orçamento
                    </button>
                    
                    <div id="validation-msg" style="color: var(--color-warning); font-size: 0.8rem; text-align: center; display: none;">
                        ⚠️ Selecione um cliente para poder salvar.
                    </div>
                </div>
            </div>
        </div>
    `;

    // DOM Elements
    const form = document.getElementById('calc-form-v2') as HTMLFormElement;
    const triggers = document.querySelectorAll('.calc-trigger');
    const dispSetup = document.getElementById('disp-setup')!;
    const dispMensal = document.getElementById('disp-mensal')!;
    const setupItemsList = document.getElementById('setup-items')!;
    const mensalItemsList = document.getElementById('mensal-items')!;
    const clienteSelect = document.getElementById('final-cliente-id') as HTMLSelectElement;
    const saveBtn = document.getElementById('save-budget-btn')!;
    const validationMsg = document.getElementById('validation-msg')!;
    const tituloInput = document.getElementById('final-titulo') as HTMLInputElement;

    async function loadInitialData() {
        try {
            const listaClientes = await clientes.list();
            clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>' +
                listaClientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');

            updateCalculation();
        } catch (e) {
            showToast('Erro ao carregar dados', 'error');
        }
    }

    async function updateCalculation() {
        const formData = new FormData(form);

        // Build config object
        const newConfig = {
            premissas: config.premissas, // Use config state which matches Global Settings
            custom_prices: config.custom_prices, // Use config state
            modulos: {
                crm: formData.get('module_crm') === 'on',
                erp: formData.get('module_erp') === 'on',
                agente_ia_whatsapp: formData.get('module_ai_wa') === 'on'
            },
            integracoes: {
                agente_crm: formData.get('int_ag_crm') === 'on',
                agente_erp: formData.get('int_ag_erp') === 'on'
            },
            customizacoes: {
                interpreta_texto: formData.get('cust_text_in') === 'on',
                interpreta_audio: formData.get('cust_audio_in') === 'on',
                responde_texto: formData.get('cust_text_out') === 'on',
                responde_audio: formData.get('cust_audio_out') === 'on',
                envio_email: formData.get('cust_email') === 'on'
            },
            api_ia: {
                requisicoes_mes: parseInt(formData.get('api_reqs') as string) || 0,
                custo_por_requisicao: parseFloat(formData.get('api_cost') as string) || 0.09
            }
        };

        config = newConfig;

        try {
            const res = await orcamentos.calculate({ configuracao: config });
            calcResult = res;

            // Update UI
            dispSetup.textContent = formatCurrency(res.valor_setup);
            dispMensal.textContent = formatCurrency(res.valor_mensal);

            renderItems(res.detalhes);
        } catch (e) {
            console.error('Calculation error', e);
        }
    }

    function renderItems(detalhes: any) {
        setupItemsList.innerHTML = Object.entries(detalhes.setup || {})
            .map(([name, val]) => `
                <div class="item-row">
                    <span>${name}</span>
                    <span>${formatCurrency(val as number)}</span>
                </div>
            `).join('');

        setupItemsList.innerHTML += `
            <div class="item-row subtotal">
                <span>Total Setup</span>
                <span>${formatCurrency(calcResult.valor_setup)}</span>
            </div>
        `;

        mensalItemsList.innerHTML = Object.entries(detalhes.mensal || {})
            .map(([name, val]) => `
                <div class="item-row">
                    <span>${name}</span>
                    <span>${formatCurrency(val as number)}</span>
                </div>
            `).join('');

        mensalItemsList.innerHTML += `
            <div class="item-row subtotal">
                <span>Total Mensal</span>
                <span>${formatCurrency(calcResult.valor_mensal)}</span>
            </div>
        `;
    }

    triggers.forEach(el => el.addEventListener('change', updateCalculation));
    triggers.forEach(el => el.addEventListener('input', updateCalculation));

    document.getElementById('btn-config-pricing')?.addEventListener('click', () => {
        navigate('/configuracoes');
    });

    saveBtn.addEventListener('click', async () => {
        const clienteId = clienteSelect.value;
        const titulo = tituloInput.value || 'Novo Orçamento v2';
        const descricao = (form.querySelector('textarea[name="descricao"]') as HTMLTextAreaElement).value;

        if (!clienteId) {
            validationMsg.style.display = 'block';
            return;
        }
        validationMsg.style.display = 'none';

        try {
            await orcamentos.create({
                cliente_id: clienteId,
                titulo,
                descricao,
                configuracao: config
            });
            showToast('Orçamento salvo com sucesso!', 'success');
            // Reset or redirect? Let's stay and maybe clear.
        } catch (e) {
            showToast('Erro ao salvar orçamento', 'error');
        }
    });

    loadInitialData();
}
