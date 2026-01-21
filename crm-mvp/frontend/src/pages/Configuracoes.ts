import { auth, settings } from '../api/client';
import { showToast } from '../utils/helpers';
import { getCurrentUser } from '../components/Auth';


export async function renderConfiguracoes(container: HTMLElement) {
    container.innerHTML = `
        <div class="content-header">
            <h1 class="page-title">Configurações</h1>
            <p class="page-subtitle">Gerencie seu perfil e premissas globais do sistema.</p>
        </div>

        <div style="display: grid; gap: 2rem; max-width: 800px;">
            
            <!-- Cards de Configuração -->
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">👤 Perfil do Usuário</h2>
                </div>
                <form id="profile-form" style="display: grid; gap: 1rem;">
                    <div class="form-group">
                        <label class="form-label">Nome Completo</label>
                        <input type="text" id="user-name" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="user-email" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Senha (Deixe em branco para manter)</label>
                        <input type="password" id="user-password" class="form-input" placeholder="Nova senha...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Função / Cargo</label>
                        <input type="text" id="user-role" class="form-input" disabled style="background: var(--color-bg); opacity: 0.7;">
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                        <button type="submit" class="btn btn-primary">Salvar Perfil</button>
                    </div>
                </form>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">💰 Premissas de Preços (Global)</h2>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem;">Esses valores serão usados como padrão em todos os novos orçamentos.</p>
                </div>
                <form id="pricing-form" style="display: grid; gap: 1.5rem;">
                    
                    <div>
                        <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-primary);">Custos Base</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Setup Base (R$)</label>
                                <input type="text" inputmode="decimal" id="setup_base" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Mensal Servidor (R$)</label>
                                <input type="text" inputmode="decimal" id="mensal_servidor" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Mensal Suporte (R$)</label>
                                <input type="text" inputmode="decimal" id="mensal_suporte" class="form-input" required placeholder="0.00">
                            </div>
                        </div>
                    </div>

                    <div style="border-top: 1px dashed var(--color-border); padding-top: 1rem;">
                        <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-primary);">Preços de Módulos</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Módulo CRM (R$)</label>
                                <input type="text" inputmode="decimal" id="modulo_crm" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Módulo ERP (R$)</label>
                                <input type="text" inputmode="decimal" id="modulo_erp" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Módulo IA (R$)</label>
                                <input type="text" inputmode="decimal" id="modulo_ai_wa" class="form-input" required placeholder="0.00">
                            </div>
                        </div>
                        </div>
                    </div>

                    <div style="border-top: 1px dashed var(--color-border); padding-top: 1rem;">
                        <h3 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-primary);">Customizações do Agente</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Interpreta Texto (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_interpreta_texto" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Interpreta Áudio (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_interpreta_audio" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Responde Texto (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_responde_texto" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Responde Áudio (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_responde_audio" class="form-input" required placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Envio de Email (R$)</label>
                                <input type="text" inputmode="decimal" id="cust_envio_email" class="form-input" required placeholder="0.00">
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end;">
                        <button type="button" id="btn-save-prices" class="btn btn-primary" style="background-color: var(--color-success); border-color: var(--color-success);">Salvar Preços</button>
                    </div>
                </form>
                
                <div style="margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem;">
                    <button type="button" id="btn-diag" style="background: #333; color: #fff; padding: 0.5rem 1rem; border: none; border-radius: 4px;">🛠️ Rodar Diagnóstico de Salvamento</button>
                    <p id="diag-result" style="margin-top: 0.5rem; font-family: monospace; font-size: 0.9rem;"></p>
                </div>
            </div>
        </div>
    `;

    // Load Data
    const currentUser = getCurrentUser(); // Get from local storage first for speed

    // Fill User Form
    if (currentUser) {
        (document.getElementById('user-name') as HTMLInputElement).value = currentUser.name;
        (document.getElementById('user-email') as HTMLInputElement).value = currentUser.email;
        (document.getElementById('user-role') as HTMLInputElement).value = currentUser.role.toUpperCase();
    }

    // Load Pricing Config
    try {
        const pricingSetting = await settings.get('pricing_config?_t=' + Date.now());
        if (pricingSetting && pricingSetting.value) {
            const config = JSON.parse(pricingSetting.value);

            (document.getElementById('setup_base') as HTMLInputElement).value = config.setup_base ?? 2499.00;
            (document.getElementById('mensal_servidor') as HTMLInputElement).value = config.mensal_servidor ?? 119.99;
            (document.getElementById('mensal_suporte') as HTMLInputElement).value = config.mensal_suporte ?? 899.99;

            (document.getElementById('modulo_crm') as HTMLInputElement).value = config.modulos?.crm ?? 1500.00;
            (document.getElementById('modulo_erp') as HTMLInputElement).value = config.modulos?.erp ?? 2000.00;
            (document.getElementById('modulo_ai_wa') as HTMLInputElement).value = config.modulos?.ai ?? 2500.00;

            (document.getElementById('cust_interpreta_texto') as HTMLInputElement).value = config.customizacoes?.interpreta_texto ?? 199.99;
            (document.getElementById('cust_interpreta_audio') as HTMLInputElement).value = config.customizacoes?.interpreta_audio ?? 299.99;
            (document.getElementById('cust_responde_texto') as HTMLInputElement).value = config.customizacoes?.responde_texto ?? 199.99;
            (document.getElementById('cust_responde_audio') as HTMLInputElement).value = config.customizacoes?.responde_audio ?? 499.99;
            (document.getElementById('cust_envio_email') as HTMLInputElement).value = config.customizacoes?.envio_email ?? 199.99;
        } else {
            // Defaults if no config yet
            setDefaultPricing();
        }
    } catch (e) {
        // Not found or error, set defaults
        setDefaultPricing();
    }

    function setDefaultPricing() {
        (document.getElementById('setup_base') as HTMLInputElement).value = "2499.00";
        (document.getElementById('mensal_servidor') as HTMLInputElement).value = "119.99";
        (document.getElementById('mensal_suporte') as HTMLInputElement).value = "899.99";
        (document.getElementById('modulo_crm') as HTMLInputElement).value = "1500.00";
        (document.getElementById('modulo_erp') as HTMLInputElement).value = "2000.00";
        (document.getElementById('modulo_ai_wa') as HTMLInputElement).value = "2500.00";
        (document.getElementById('cust_interpreta_texto') as HTMLInputElement).value = "199.99";
        (document.getElementById('cust_interpreta_audio') as HTMLInputElement).value = "299.99";
        (document.getElementById('cust_responde_texto') as HTMLInputElement).value = "199.99";
        (document.getElementById('cust_responde_audio') as HTMLInputElement).value = "499.99";
        (document.getElementById('cust_envio_email') as HTMLInputElement).value = "199.99";
    }

    // Handle Profile Save
    document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            if (!currentUser) return;

            const name = (document.getElementById('user-name') as HTMLInputElement).value;
            const email = (document.getElementById('user-email') as HTMLInputElement).value;
            const password = (document.getElementById('user-password') as HTMLInputElement).value;

            const updateData: any = { name, email };
            if (password) updateData.password = password;

            await auth.updateProfile(currentUser.id, updateData);

            // Update local storage user info roughly (logout/login recommended but let's update name)
            const user = await auth.me(); // Fetch fresh
            localStorage.setItem('crm_user', JSON.stringify(user));

            showToast('Perfil atualizado com sucesso!', 'success');
            setTimeout(() => window.location.reload(), 1000); // Reload to update sidebar name
        } catch (error: any) {
            showToast(error.message || 'Erro ao atualizar perfil', 'error');
        }
    });

    // Handle Pricing Save (Explicit Button Click)
    document.getElementById('btn-save-prices')?.addEventListener('click', async () => {
        try {
            const btn = document.getElementById('btn-save-prices') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = "Salvando...";
            btn.disabled = true;

            // Helper to safe parse float
            const safeFloat = (id: string, def: number) => {
                const el = document.getElementById(id) as HTMLInputElement;
                if (!el) return def;
                const val = el.value.replace(',', '.');
                const num = parseFloat(val);
                return isNaN(num) ? def : num;
            };

            const config = {
                setup_base: safeFloat('setup_base', 2499.00),
                mensal_servidor: safeFloat('mensal_servidor', 119.99),
                mensal_suporte: safeFloat('mensal_suporte', 899.99),
                modulos: {
                    crm: safeFloat('modulo_crm', 1500.00),
                    erp: safeFloat('modulo_erp', 2000.00),
                    ai: safeFloat('modulo_ai_wa', 2500.00)
                },
                customizacoes: {
                    interpreta_texto: safeFloat('cust_interpreta_texto', 199.99),
                    interpreta_audio: safeFloat('cust_interpreta_audio', 299.99),
                    responde_texto: safeFloat('cust_responde_texto', 199.99),
                    responde_audio: safeFloat('cust_responde_audio', 499.99),
                    envio_email: safeFloat('cust_envio_email', 199.99)
                }
            };

            await settings.update('pricing_config', {
                value: JSON.stringify(config),
                description: 'Global Pricing Config'
            });

            showToast('Preços atualizados com sucesso!', 'success');

            // Visual feedback
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);

        } catch (error: any) {
            console.error("Save error:", error);
            showToast(error.message || 'Erro ao salvar preços', 'error');
            const btn = document.getElementById('btn-save-prices') as HTMLButtonElement;
            btn.textContent = "Salvar Preços";
            btn.disabled = false;
        }
    });

    // Diagnostic Tool
    document.getElementById('btn-diag')?.addEventListener('click', async () => {
        const resEl = document.getElementById('diag-result')!;
        resEl.textContent = "⏳ Iniciando diagnóstico...";
        resEl.style.color = "blue";

        try {
            const testVal = 50 + Math.floor(Math.random() * 10);
            resEl.textContent += `\n1. Tentando salvar valor teste: ${testVal}...`;

            // Construct a mini config
            const config = {
                setup_base: 2499.00,
                mensal_servidor: 119.99,
                mensal_suporte: 899.99,
                modulos: { crm: 1500, erp: 2000, ai: 2500 },
                customizacoes: {
                    interpreta_texto: testVal, // TEST TARGET
                    interpreta_audio: testVal,
                    responde_texto: testVal,
                    responde_audio: testVal,
                    envio_email: testVal
                }
            };

            await settings.update('pricing_config', {
                value: JSON.stringify(config),
                description: 'DIAGNOSTIC TEST'
            });

            resEl.textContent += "\n2. Save OK (Request success).";
            resEl.textContent += "\n3. Buscando valor do servidor...";

            const fresh = await settings.get('pricing_config?_t=' + Date.now());
            const freshConfig = JSON.parse(fresh.value);
            const freshVal = freshConfig.customizacoes.interpreta_texto;

            resEl.textContent += `\n4. Valor retornado: ${freshVal}`;

            if (freshVal == testVal) {
                resEl.textContent += "\n✅ SUCESSO! O sistema está salvando corretamente.";
                resEl.style.color = "green";
                alert(`Diagnóstico: SUCESSO!\nValor salvo: ${testVal}\nValor lido: ${freshVal}\n\nConclusão: O sistema funciona. O problema pode ser cache local. Recarregue a página.`);
            } else {
                resEl.textContent += "\n❌ FALHA! O valor lido é diferente do salvo.";
                resEl.style.color = "red";
                alert(`Diagnóstico: FALHA!\nEnviado: ${testVal}\nRecebido: ${freshVal}\n\nConclusão: O servidor ignorou a mudança.`);
            }

        } catch (e: any) {
            resEl.textContent += `\n❌ ERRO TÉCNICO: ${e.message}`;
            resEl.style.color = "red";
            alert(`Diagnóstico: ERRO DE REQUEST\n${e.message}`);
        }
    });
}
