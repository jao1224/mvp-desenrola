import { financeiro, clientes as clientesApi } from '../api/client';
import { formatDate, formatCurrency, getStatusBadgeClass, getStatusLabel, showToast } from '../utils/helpers';
import type { Pagamento, Cliente, FluxoCaixaResponse } from '../api/types';

let pagamentosList: Pagamento[] = [];
let clientesList: Cliente[] = [];
let editingId: string | null = null;
let fluxoCaixa: FluxoCaixaResponse | null = null;

export async function renderFinanceiro(container: HTMLElement) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        const [pagamentos, clientes, fluxo] = await Promise.all([
            financeiro.list(),
            clientesApi.list(),
            financeiro.fluxoCaixa(6).catch(() => null)
        ]);
        pagamentosList = pagamentos;
        clientesList = clientes;
        fluxoCaixa = fluxo;
        renderSplitLayout(container);
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Erro ao carregar dados financeiros</div>';
        console.error(error);
    }
}

function renderSplitLayout(container: HTMLElement) {
    container.innerHTML = `
    <style>
        .finance-layout {
            display: grid;
            grid-template-columns: 400px 1fr;
            gap: 2rem;
            align-items: start;
        }
        @media (max-width: 1024px) {
            .finance-layout {
                grid-template-columns: 1fr;
            }
        }
        
        /* Left Column: Form */
        .form-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 2rem;
            position: sticky;
            top: 1rem;
            box-shadow: var(--shadow-md);
        }
        
        /* Right Column: Dashboard & List */
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .kpi-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .kpi-label { font-size: 0.85rem; color: var(--color-text-secondary); font-weight: 500; }
        .kpi-value { font-size: 2rem; font-weight: 700; color: var(--color-text); line-height: 1.2; }
        .kpi-sub  { font-size: 0.75rem; color: var(--color-text-muted); }

        .chart-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        /* Form Styling */
        .form-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text); }
        .form-subtitle { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 2rem; }
        
        #financeiro-form { display: flex; flex-direction: column; gap: 1.25rem; }
        
        .form-input, .form-select {
            width: 100%;
            background: var(--color-bg);
            border-color: var(--color-border);
            padding: 0.75rem;
            border-radius: 8px;
        }
        
         /* Type Toggle (Segmented Control) */
        .type-toggle {
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: var(--color-bg);
            padding: 4px;
            border-radius: 8px;
            border: 1px solid var(--color-border);
            gap: 4px;
        }
        .type-option {
            text-align: center;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.2s;
            color: var(--color-text-secondary);
            border: 1px solid transparent;
        }
        .type-option:hover { background: var(--color-bg-tertiary); }
        
        input[name="tipo_movimento"]:checked + .type-option[data-value="recebimento"] {
            background: rgba(16, 185, 129, 0.15);
            color: var(--color-success);
            border-color: rgba(16, 185, 129, 0.3);
        }
        input[name="tipo_movimento"]:checked + .type-option[data-value="pagamento"] {
            background: rgba(239, 68, 68, 0.15);
            color: var(--color-danger);
            border-color: rgba(239, 68, 68, 0.3);
        }
        input[name="tipo_movimento"] { display: none; }

        .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        /* CSS Chart & Tooltips */
        .simple-chart {
            display: flex;
            align-items: flex-end;
            gap: 2rem;
            height: 200px;
            padding-top: 2rem;
            border-bottom: 1px solid var(--color-border);
            position: relative;
            /* Guide Lines (Grid) */
            background: repeating-linear-gradient(
                0deg,
                var(--color-border) 0px,
                var(--color-border) 1px,
                transparent 1px,
                transparent 50px
            );
        }
        
        .chart-bar-group {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            height: 100%;
            justify-content: flex-end;
            position: relative; /* Context for tooltip */
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .chart-bar-group:hover {
            transform: translateY(-5px);
        }
        
        /* Tooltip Container */
        .chart-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(17, 24, 39, 0.95);
            color: #fff;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.75rem;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s, transform 0.2s;
            margin-bottom: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 4px;
            text-align: center;
        }
        
        .tooltip-row { display: flex; align-items: center; gap: 6px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        
        .chart-bar-group:hover .chart-tooltip {
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
        }

        .bar-container {
            display: flex;
            gap: 8px;
            align-items: flex-end;
            height: 100%; /* Important for internal bar scaling */
            width: 60%;
        }
        .bar {
            width: 100%;
            border-radius: 4px 4px 0 0;
            transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy effect */
            min-height: 4px;
            position: relative;
        }
        .bar-rec { background: linear-gradient(180deg, var(--color-success) 0%, rgba(16, 185, 129, 0.6) 100%); }
        .bar-pag { background: linear-gradient(180deg, var(--color-danger) 0%, rgba(239, 68, 68, 0.6) 100%); }
        
        .chart-label { font-size: 0.85rem; font-weight: 500; color: var(--color-text-secondary); margin-top: 8px; }

    </style>

    <div class="page-header">
      <h1 class="page-title">Gestão Financeira</h1>
    </div>

    <div class="finance-layout">
        <!-- LEFT: FORM -->
        <div class="form-card">
            <h2 class="form-title" id="form-title">Novo Lançamento</h2>
            <p class="form-subtitle">Registre receitas e despesas para manter o controle.</p>
            
            <form id="financeiro-form">
                <input type="hidden" id="movimento-id">
                
                <div class="form-group">
                    <label class="form-label">Tipo de Lançamento</label>
                    <div class="type-toggle">
                        <label>
                            <input type="radio" name="tipo_movimento" value="recebimento" checked>
                            <div class="type-option" data-value="recebimento">⬇ Receita</div>
                        </label>
                        <label>
                            <input type="radio" name="tipo_movimento" value="pagamento">
                            <div class="type-option" data-value="pagamento">⬆ Despesa</div>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Descrição</label>
                    <input type="text" class="form-input" id="descricao" required placeholder="Ex: Pagamento de Fornecedor">
                </div>

                <div class="form-group">
                    <label class="form-label">Valor (R$)</label>
                    <input type="number" step="0.01" class="form-input" id="valor" required placeholder="0,00" style="font-size: 1.2rem; font-weight: 600;">
                </div>

                <div class="date-row">
                    <div class="form-group">
                        <label class="form-label">Vencimento</label>
                        <input type="date" class="form-input" id="data_vencimento" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pagamento</label>
                        <input type="date" class="form-input" id="data_pagamento">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Cliente / Parceiro (Opcional)</label>
                    <select class="form-input form-select" id="cliente_id">
                        <option value="">Selecione...</option>
                        ${clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-input form-select" id="status">
                        <option value="pendente">Pendente - Aguardando</option>
                        <option value="pago">Confirmado / Pago</option>
                        <option value="atrasado">Atrasado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary" id="save-btn" style="width: 100%; padding: 0.8rem;">Salvar Lançamento</button>
                    <button type="button" class="btn btn-secondary" id="cancel-btn" style="width: 100%; display: none;">Cancelar Edição</button>
                </div>
            </form>
        </div>

        <!-- RIGHT: DASHBOARD & LIST -->
        <div style="display: flex; flex-direction: column;">
            
            <!-- KPI CARDS -->
            ${fluxoCaixa ? renderKPICards(fluxoCaixa) : ''}
            
            <!-- CHART AREA (Visual Placeholder for logic) -->
            ${fluxoCaixa ? renderCSSChart(fluxoCaixa) : ''}

            <!-- LIST -->
            <div class="list-card" style="background: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: 12px; padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.1rem; font-weight: 600;">Últimas Movimentações</h3>
                    <div style="display: flex; gap: 0.5rem;">
                       <select class="form-input form-select" id="filter-type" style="width: auto; padding: 6px 30px 6px 12px; font-size: 0.85rem;">
                           <option value="">Todos os Tipos</option>
                           <option value="recebimento">Receitas</option>
                           <option value="pagamento">Despesas</option>
                       </select>
                    </div>
                </div>
                
                <div id="finance-list-container">
                    ${renderFinanceTable(pagamentosList)}
                </div>
            </div>
        </div>
    </div>
    `;

    setupEventListeners(container);
}

function renderKPICards(fluxo: FluxoCaixaResponse) {
    return `
    <div class="dashboard-grid">
        <div class="kpi-card">
            <span class="kpi-label">Receita Realizada</span>
            <span class="kpi-value" style="color: var(--color-success);">${formatCurrency(fluxo.total_recebimentos)}</span>
            <span class="kpi-sub">Total recebido no período</span>
        </div>
        <div class="kpi-card">
            <span class="kpi-label">Despesas Realizadas</span>
            <span class="kpi-value" style="color: var(--color-danger);">${formatCurrency(fluxo.total_pagamentos)}</span>
             <span class="kpi-sub">Total pago no período</span>
        </div>
        <div class="kpi-card">
            <span class="kpi-label">Saldo Líquido</span>
            <span class="kpi-value" style="color: ${fluxo.saldo_total >= 0 ? 'var(--color-primary-light)' : 'var(--color-danger)'};">
                ${formatCurrency(fluxo.saldo_total)}
            </span>
             <span class="kpi-sub">Reserva acumulada</span>
        </div>
    </div>`;
}

function renderCSSChart(fluxo: FluxoCaixaResponse) {
    // Simple bar visualizer based on totals (Scaling to 100%)
    const max = Math.max(fluxo.total_recebimentos, fluxo.total_pagamentos, 1);
    const recH = Math.round((fluxo.total_recebimentos / max) * 100);
    const pagH = Math.round((fluxo.total_pagamentos / max) * 100);

    return `
    <div class="chart-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
            <div>
                 <h3 style="font-size: 1rem; font-weight: 600;">Balanço Visual</h3>
                 <p style="font-size: 0.85rem; color: var(--color-text-muted);">Comparativo dinâmico</p>
            </div>
            <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--color-text-secondary);">
                <div style="display:flex; align-items:center; gap:4px;"><div style="width:10px; height:10px; background:var(--color-success); border-radius:2px;"></div> Receitas</div>
                <div style="display:flex; align-items:center; gap:4px;"><div style="width:10px; height:10px; background:var(--color-danger); border-radius:2px;"></div> Despesas</div>
            </div>
        </div>
        
        <div class="simple-chart">
            <div class="chart-bar-group">
                <!-- Tooltip -->
                <div class="chart-tooltip">
                    <span style="font-weight:600; font-size: 0.9rem; margin-bottom:4px; display:block;">Este Mês</span>
                    <div class="tooltip-row">
                        <div class="dot" style="background: var(--color-success)"></div>
                        <span>Receitas: ${formatCurrency(fluxo.total_recebimentos)}</span>
                    </div>
                    <div class="tooltip-row">
                        <div class="dot" style="background: var(--color-danger)"></div>
                        <span>Despesas: ${formatCurrency(fluxo.total_pagamentos)}</span>
                    </div>
                     <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:4px; padding-top:4px; font-weight:600; color: ${fluxo.saldo_total >= 0 ? '#34d399' : '#f87171'}">
                        Saldo: ${formatCurrency(fluxo.saldo_total)}
                    </div>
                </div>

                <div class="bar-container">
                    <div class="bar bar-rec" style="height: ${recH}%;"></div>
                    <div class="bar bar-pag" style="height: ${pagH}%;"></div>
                </div>
                <span class="chart-label">Total do Período</span>
            </div>
        </div>
    </div>
    `;
}

function renderFinanceTable(list: Pagamento[]) {
    if (list.length === 0) return '<div class="empty-state">Nenhuma movimentação encontrada.</div>';

    return `
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th>Movimento</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${list.map(p => `
                    <tr>
                        <td>
                            <div style="font-weight: 600;">${p.descricao || 'Sem descrição'}</div>
                            <div style="font-size: 0.75rem; color: var(--color-text-muted);">${p.cliente_id ? (clientesList.find(c => c.id === p.cliente_id)?.nome || 'Cliente') : 'Diversos'}</div>
                        </td>
                        <td style="font-weight: 600; color: ${p.tipo === 'recebimento' ? 'var(--color-success)' : 'var(--color-danger)'};">
                            ${p.tipo === 'recebimento' ? '+' : '-'} ${formatCurrency(p.valor)}
                        </td>
                        <td>${formatDate(p.data_vencimento)}</td>
                        <td><span class="badge ${getStatusBadgeClass(p.status)}">${getStatusLabel(p.status)}</span></td>
                        <td>
                            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                <button class="btn btn-secondary btn-sm edit-btn" data-id="${p.id}" title="Editar">✏️</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}" title="Excluir">🗑️</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;
}

function setupEventListeners(container: HTMLElement) {
    const form = document.getElementById('financeiro-form') as HTMLFormElement;
    const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
    const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
    const formTitle = document.getElementById('form-title') as HTMLElement;

    // Filter Logic
    document.getElementById('filter-type')?.addEventListener('change', async (e) => {
        const val = (e.target as HTMLSelectElement).value;
        const filtered = val ? pagamentosList.filter(p => p.tipo === val) : pagamentosList;
        document.getElementById('finance-list-container')!.innerHTML = renderFinanceTable(filtered);
    });

    // Edit Handler
    container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const editBtn = target.closest('.edit-btn') as HTMLElement;
        const deleteBtn = target.closest('.delete-btn') as HTMLElement;

        if (editBtn) {
            const id = editBtn.dataset.id!;
            const item = pagamentosList.find(p => p.id === id);
            if (item) {
                editingId = id;
                (document.getElementById('movimento-id') as HTMLInputElement).value = item.id;
                (document.getElementById('descricao') as HTMLInputElement).value = item.descricao || '';
                (document.getElementById('valor') as HTMLInputElement).value = item.valor.toString();
                (document.getElementById('data_vencimento') as HTMLInputElement).value = item.data_vencimento.split('T')[0];
                if (item.data_pagamento) (document.getElementById('data_pagamento') as HTMLInputElement).value = item.data_pagamento.split('T')[0];
                (document.getElementById('cliente_id') as HTMLSelectElement).value = item.cliente_id || '';
                (document.getElementById('status') as HTMLSelectElement).value = item.status;

                // Set Radio
                const radio = document.querySelector(`input[name="tipo_movimento"][value="${item.tipo}"]`) as HTMLInputElement;
                if (radio) radio.checked = true;

                // UI
                formTitle.textContent = 'Editar Lançamento';
                saveBtn.textContent = 'Atualizar Lançamento';
                cancelBtn.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        if (deleteBtn) {
            if (confirm('Tem certeza que deseja excluir?')) {
                const id = deleteBtn.dataset.id!;
                financeiro.delete(id).then(() => {
                    showToast('Excluído com sucesso', 'success');
                    renderFinanceiro(container); // Reload all
                }).catch(err => showToast('Erro ao excluir', 'error'));
            }
        }
    });

    cancelBtn.addEventListener('click', () => {
        resetForm(form, saveBtn, cancelBtn, formTitle);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const status = (document.getElementById('status') as HTMLSelectElement).value;
        let data_pagamento = (document.getElementById('data_pagamento') as HTMLInputElement).value;
        const data_vencimento = (document.getElementById('data_vencimento') as HTMLInputElement).value;

        // UX: Se marcou como pago mas não pôs data, assume data do vencimento (ou hoje, backend já trata se vazio, mas aqui garante visualmente se recarregar)
        if (status === 'pago' && !data_pagamento) {
            data_pagamento = data_vencimento; // Assume pago no vencimento para simplificar
        }

        const data = {
            tipo: (document.querySelector('input[name="tipo_movimento"]:checked') as HTMLInputElement).value as any,
            descricao: (document.getElementById('descricao') as HTMLInputElement).value,
            valor: parseFloat((document.getElementById('valor') as HTMLInputElement).value),
            data_vencimento: data_vencimento,
            data_pagamento: data_pagamento || undefined,
            cliente_id: (document.getElementById('cliente_id') as HTMLSelectElement).value || undefined,
            status: status as any
        };

        const originalText = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.textContent = 'Salvando...';

        try {
            if (editingId) {
                await financeiro.update(editingId, data);
                showToast('Atualizado com sucesso!', 'success');
            } else {
                await financeiro.create(data);
                showToast('Lançamento criado!', 'success');
            }
            editingId = null; // Reset editing state
            renderFinanceiro(container); // Rebuilds the UI (fresh form)
        } catch (err: any) {
            showToast(err.message || 'Erro ao salvar', 'error');
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
        }
    });
}

function resetForm(form: HTMLFormElement, saveBtn: HTMLButtonElement, cancelBtn: HTMLButtonElement, title: HTMLElement) {
    editingId = null;
    form.reset();
    // Reset radio defaults
    (document.querySelector('input[name="tipo_movimento"][value="recebimento"]') as HTMLInputElement).checked = true;
    title.textContent = 'Novo Lançamento';
    saveBtn.textContent = 'Salvar Lançamento';
    saveBtn.disabled = false;
    cancelBtn.style.display = 'none';
}
