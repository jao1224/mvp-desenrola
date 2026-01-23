import { auth, settings } from '../api/client';
import { showToast } from '../utils/helpers';
import { getCurrentUser } from '../components/Auth';
import type { User } from '../api/types';

export async function renderConfiguracoes(container: HTMLElement) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const currentUser = getCurrentUser();

    // Check if admin for users tab
    const isAdmin = currentUser?.role === 'admin';

    container.innerHTML = `
        <div class="content-header">
            <h1 class="page-title">Configurações</h1>
            <p class="page-subtitle">Gerencie seu perfil, usuários e premissas do sistema.</p>
        </div>

        <div class="tabs" style="margin-bottom: 20px; border-bottom: 1px solid #ddd;">
            <button class="tab-btn active" data-tab="geral" style="padding: 10px 20px; margin-right: 5px; border: none; background: none; border-bottom: 2px solid var(--primary-color); font-weight: bold; cursor: pointer;">Geral</button>
            ${isAdmin ? `<button class="tab-btn" data-tab="usuarios" style="padding: 10px 20px; border: none; background: none; border-bottom: 2px solid transparent; color: #666; cursor: pointer;">Usuários</button>` : ''}
        </div>

        <div id="tab-content-geral" class="tab-content" style="display: block;">
            <div style="display: grid; gap: 2rem; max-width: 800px;">
                <!-- Cards de Configuração (Profile + Pricing) -->
                ${renderProfileCard()}
                ${isAdmin ? renderPricingCard() : ''}
            </div>
        </div>

        ${isAdmin ? `
        <div id="tab-content-usuarios" class="tab-content" style="display: none;">
             <div class="card">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 class="card-title">👥 Gestão de Usuários</h2>
                        <p style="color: #666; font-size: 0.9rem;">Cadastre e gerencie o acesso ao sistema.</p>
                    </div>
                    <button class="btn btn-primary" id="btn-add-user">+ Adicionar Usuário</button>
                </div>
                <div id="users-list-container" style="padding: 1rem;">
                    <div class="loading"><div class="spinner"></div></div>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Modal Add User -->
        <div class="modal-overlay" id="user-modal">
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Novo Usuário</h3>
                    <button class="modal-close" id="close-user-modal">&times;</button>
                </div>
                <form id="user-form">
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Nome Completo *</label>
                            <input type="text" class="form-input" id="new_user_name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email *</label>
                            <input type="email" class="form-input" id="new_user_email" required>
                        </div>
                         <div class="form-group">
                            <label class="form-label">Senha Inicial *</label>
                            <input type="password" class="form-input" id="new_user_password" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Função *</label>
                            <select class="form-input form-select" id="new_user_role" required>
                                <option value="colaborador">Colaborador (Padrão)</option>
                                <option value="gestor">Gestor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancel-user-btn">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Criar Usuário</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Initialize Logic
    setupTabLogic();
    if (currentUser) fillProfileForm(currentUser);
    if (isAdmin) {
        setupPricingLogic();
        setupUserLogic(container);
        loadUsers(); // Initial load
    }
}

function renderProfileCard() {
    return `
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
    `;
}

function renderPricingCard() {
    return `
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
        </div>
    `;
}

// === LOGIC ===

function setupTabLogic() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = (tab as HTMLElement).dataset.tab;

            // Toggle Active Tab
            tabs.forEach(t => {
                (t as HTMLElement).style.borderBottom = '2px solid transparent';
                (t as HTMLElement).style.color = '#666';
                t.classList.remove('active');
            });
            (tab as HTMLElement).style.borderBottom = '2px solid var(--primary-color)';
            (tab as HTMLElement).style.color = 'inherit';
            tab.classList.add('active');

            // Toggle Content
            contents.forEach(c => {
                (c as HTMLElement).style.display = 'none';
            });
            const targetContent = document.getElementById(`tab-content-${target}`);
            if (targetContent) targetContent.style.display = 'block';
        });
    });
}

function fillProfileForm(currentUser: any) {
    const nameEl = document.getElementById('user-name') as HTMLInputElement;
    if (nameEl) {
        nameEl.value = currentUser.name;
        (document.getElementById('user-email') as HTMLInputElement).value = currentUser.email;
        (document.getElementById('user-role') as HTMLInputElement).value = currentUser.role.toUpperCase();

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

                const user = await auth.me();
                localStorage.setItem('crm_user', JSON.stringify(user));

                showToast('Perfil atualizado com sucesso!', 'success');
                setTimeout(() => window.location.reload(), 1000);
            } catch (error: any) {
                showToast(error.message || 'Erro ao atualizar perfil', 'error');
            }
        });
    }
}

async function setupPricingLogic() {
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
            // Defaults
            const defaults: any = {
                setup_base: 2499.00, mensal_servidor: 119.99, mensal_suporte: 899.99,
                modulo_crm: 1500, modulo_erp: 2000, modulo_ai_wa: 2500,
                cust_interpreta_texto: 199.99, cust_interpreta_audio: 299.99,
                cust_responde_texto: 199.99, cust_responde_audio: 499.99, cust_envio_email: 199.99
            };
            Object.keys(defaults).forEach(k => {
                const el = document.getElementById(k) as HTMLInputElement;
                if (el) el.value = defaults[k];
            });
        }
    } catch (e) {
        console.log("No config found, using placeholders");
    }

    document.getElementById('btn-save-prices')?.addEventListener('click', async () => {
        try {
            const btn = document.getElementById('btn-save-prices') as HTMLButtonElement;
            const originalText = btn.textContent;
            btn.textContent = "Salvando...";
            btn.disabled = true;

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
}

// === USER MANAGEMENT LOGIC ===

async function loadUsers() {
    const listContainer = document.getElementById('users-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        const users = await auth.listUsers();

        if (users.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">Nenhum usuário encontrado.</div>';
            return;
        }

        listContainer.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Função</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(u => `
                        <tr>
                            <td>${u.name}</td>
                            <td>${u.email}</td>
                            <td><span class="badge ${u.role === 'admin' ? 'badge-primary' : 'badge-secondary'}">${u.role.toUpperCase()}</span></td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-user-btn" data-id="${u.id}" ${u.id === getCurrentUser()?.id ? 'disabled title="Você não pode se excluir"' : ''}>Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Bind delete events
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = (e.currentTarget as HTMLElement).dataset.id!;
                if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
                    try {
                        await auth.deleteUser(id);
                        showToast('Usuário excluído', 'success');
                        loadUsers(); // Refresh
                    } catch (err: any) {
                        showToast(err.message, 'error');
                    }
                }
            });
        });

    } catch (e) {
        listContainer.innerHTML = '<div class="error-state">Erro ao carregar usuários.</div>';
    }
}

function setupUserLogic(container: HTMLElement) {
    const modal = document.getElementById('user-modal') as HTMLElement;
    const form = document.getElementById('user-form') as HTMLFormElement;

    // Open Modal
    document.getElementById('btn-add-user')?.addEventListener('click', () => {
        form.reset();
        modal.classList.add('active');
    });

    // Close Modal
    const closeModal = () => modal.classList.remove('active');
    document.getElementById('close-user-modal')?.addEventListener('click', closeModal);
    document.getElementById('cancel-user-btn')?.addEventListener('click', closeModal);

    // Create User
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Criando...';
        submitBtn.disabled = true;

        try {
            const data = {
                name: (document.getElementById('new_user_name') as HTMLInputElement).value,
                email: (document.getElementById('new_user_email') as HTMLInputElement).value,
                password: (document.getElementById('new_user_password') as HTMLInputElement).value,
                role: (document.getElementById('new_user_role') as HTMLSelectElement).value // 'admin' or 'colaborador' (was 'user' but backend expects 'colaborador'?)
                // Wait, User Schema says Role.COLABORADOR = 'colaborador'.
                // The select options in renderConfiguracoes are 'user' and 'admin'.
                // I need to change the select values too.
            };

            // Map 'user' to 'colaborador' if needed, but better to fix the HTML option values.
            if (data.role === 'user') data.role = 'colaborador';

            await auth.createUser(data);
            showToast('Usuário criado com sucesso!', 'success');
            closeModal();
            loadUsers();
        } catch (err: any) {
            console.error(err);
            showToast(err.message || 'Erro ao criar usuário', 'error');
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}
