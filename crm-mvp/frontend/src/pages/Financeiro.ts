import { financeiro, clientes as clientesApi } from '../api/client';
import { formatDate, formatCurrency, getStatusBadgeClass, getStatusLabel, showToast } from '../utils/helpers';
import type { Pagamento, Cliente, FluxoCaixaResponse } from '../api/types';

let pagamentosList: Pagamento[] = [];
let clientesList: Cliente[] = [];

export async function renderFinanceiro(container: HTMLElement) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        [pagamentosList, clientesList] = await Promise.all([
            financeiro.list(),
            clientesApi.list()
        ]);
        renderFinanceiroPage(container);
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Erro ao carregar financeiro</div>';
    }
}

async function renderFinanceiroPage(container: HTMLElement) {
    let fluxoCaixa: FluxoCaixaResponse | null = null;
    try {
        fluxoCaixa = await financeiro.fluxoCaixa(6);
    } catch { }

    container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Financeiro</h1>
      <div style="display: flex; gap: var(--spacing-md);">
        <button class="btn btn-primary" id="add-recebimento-btn">+ Recebimento</button>
        <button class="btn btn-secondary" id="add-pagamento-btn">+ Pagamento</button>
      </div>
    </div>

    ${fluxoCaixa ? `
      <div class="card" style="margin-bottom: var(--spacing-lg);">
        <div class="card-header">
          <h2 class="card-title">📊 Fluxo de Caixa</h2>
          <span style="color: var(--color-text-muted);">${fluxoCaixa.periodo}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
          <div>
            <div style="color: var(--color-text-secondary);">Total Recebimentos</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-success);">${formatCurrency(fluxoCaixa.total_recebimentos)}</div>
          </div>
          <div>
            <div style="color: var(--color-text-secondary);">Total Pagamentos</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-danger);">${formatCurrency(fluxoCaixa.total_pagamentos)}</div>
          </div>
          <div>
            <div style="color: var(--color-text-secondary);">Saldo</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: ${fluxoCaixa.saldo_total >= 0 ? 'var(--color-success)' : 'var(--color-danger)'};">${formatCurrency(fluxoCaixa.saldo_total)}</div>
          </div>
        </div>
      </div>
    ` : ''}

    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Movimentações</h2>
        <div style="display: flex; gap: var(--spacing-md);">
          <select class="form-input form-select" id="tipo-filter" style="max-width: 150px;">
            <option value="">Todos</option>
            <option value="recebimento">Recebimentos</option>
            <option value="pagamento">Pagamentos</option>
          </select>
          <select class="form-input form-select" id="status-filter" style="max-width: 150px;">
            <option value="">Todos status</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>
      </div>
      
      ${pagamentosList.length === 0 ?
            '<div class="empty-state"><div class="empty-state-icon">💰</div>Nenhuma movimentação</div>' :
            `<div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${pagamentosList.map(renderPagamentoRow).join('')}
            </tbody>
          </table>
        </div>`
        }
    </div>

    <!-- Modal -->
    <div class="modal-overlay" id="pagamento-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">Novo Movimento</h3>
          <button class="modal-close" id="close-modal">&times;</button>
        </div>
        <form id="pagamento-form">
          <div class="modal-body">
            <input type="hidden" id="pagamento-id">
            <input type="hidden" id="tipo">
            <div class="form-group">
              <label class="form-label">Valor *</label>
              <input type="number" step="0.01" class="form-input" id="valor" required>
            </div>
            <div class="form-group">
              <label class="form-label">Descrição</label>
              <input type="text" class="form-input" id="descricao">
            </div>
            <div class="form-group">
              <label class="form-label">Cliente</label>
              <select class="form-input form-select" id="cliente_id">
                <option value="">Nenhum</option>
                ${clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label class="form-label">Data Vencimento *</label>
                <input type="date" class="form-input" id="data_vencimento" required>
              </div>
              <div class="form-group">
                <label class="form-label">Data Pagamento</label>
                <input type="date" class="form-input" id="data_pagamento">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-input form-select" id="status">
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="atrasado">Atrasado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `;

    setupEventListeners(container);
}

function renderPagamentoRow(pag: Pagamento): string {
    const cliente = clientesList.find(c => c.id === pag.cliente_id);
    return `
    <tr>
      <td><span class="badge ${pag.tipo === 'recebimento' ? 'badge-success' : 'badge-danger'}">${getStatusLabel(pag.tipo)}</span></td>
      <td>${pag.descricao || '-'}</td>
      <td>${cliente?.nome || '-'}</td>
      <td style="font-weight: 600; color: ${pag.tipo === 'recebimento' ? 'var(--color-success)' : 'var(--color-danger)'};">
        ${pag.tipo === 'recebimento' ? '+' : '-'} ${formatCurrency(pag.valor)}
      </td>
      <td>${formatDate(pag.data_vencimento)}</td>
      <td><span class="badge ${getStatusBadgeClass(pag.status)}">${getStatusLabel(pag.status)}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm edit-btn" data-id="${pag.id}">Editar</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${pag.id}">Excluir</button>
      </td>
    </tr>
  `;
}

function setupEventListeners(container: HTMLElement) {
    const modal = document.getElementById('pagamento-modal') as HTMLElement;
    const form = document.getElementById('pagamento-form') as HTMLFormElement;

    const openModal = (tipo: 'recebimento' | 'pagamento') => {
        form.reset();
        (document.getElementById('pagamento-id') as HTMLInputElement).value = '';
        (document.getElementById('tipo') as HTMLInputElement).value = tipo;
        (document.getElementById('modal-title') as HTMLElement).textContent =
            tipo === 'recebimento' ? 'Novo Recebimento' : 'Novo Pagamento';
        modal.classList.add('active');
    };

    document.getElementById('add-recebimento-btn')?.addEventListener('click', () => openModal('recebimento'));
    document.getElementById('add-pagamento-btn')?.addEventListener('click', () => openModal('pagamento'));

    document.getElementById('close-modal')?.addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('cancel-btn')?.addEventListener('click', () => modal.classList.remove('active'));

    document.querySelectorAll('.edit-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = (btn as HTMLElement).dataset.id!;
            const pag = pagamentosList.find(p => p.id === id);
            if (pag) {
                (document.getElementById('pagamento-id') as HTMLInputElement).value = pag.id;
                (document.getElementById('tipo') as HTMLInputElement).value = pag.tipo;
                (document.getElementById('valor') as HTMLInputElement).value = pag.valor.toString();
                (document.getElementById('descricao') as HTMLInputElement).value = pag.descricao || '';
                (document.getElementById('cliente_id') as HTMLSelectElement).value = pag.cliente_id || '';
                (document.getElementById('data_vencimento') as HTMLInputElement).value = pag.data_vencimento.split('T')[0];
                (document.getElementById('data_pagamento') as HTMLInputElement).value = pag.data_pagamento?.split('T')[0] || '';
                (document.getElementById('status') as HTMLSelectElement).value = pag.status;
                (document.getElementById('modal-title') as HTMLElement).textContent = 'Editar Movimento';
                modal.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const id = (btn as HTMLElement).dataset.id!;
            if (confirm('Tem certeza?')) {
                try {
                    await financeiro.delete(id);
                    showToast('Movimento excluído', 'success');
                    renderFinanceiro(container);
                } catch (error: any) {
                    showToast(error.message, 'error');
                }
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = (document.getElementById('pagamento-id') as HTMLInputElement).value;

        const data = {
            tipo: (document.getElementById('tipo') as HTMLInputElement).value as any,
            valor: parseFloat((document.getElementById('valor') as HTMLInputElement).value),
            descricao: (document.getElementById('descricao') as HTMLInputElement).value || undefined,
            cliente_id: (document.getElementById('cliente_id') as HTMLSelectElement).value || undefined,
            data_vencimento: (document.getElementById('data_vencimento') as HTMLInputElement).value,
            data_pagamento: (document.getElementById('data_pagamento') as HTMLInputElement).value || undefined,
            status: (document.getElementById('status') as HTMLSelectElement).value as any,
        };

        try {
            if (id) {
                await financeiro.update(id, data);
                showToast('Movimento atualizado', 'success');
            } else {
                await financeiro.create(data);
                showToast('Movimento criado', 'success');
            }
            modal.classList.remove('active');
            renderFinanceiro(container);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    });

    document.getElementById('tipo-filter')?.addEventListener('change', async (e) => {
        const tipo = (e.target as HTMLSelectElement).value;
        const status = (document.getElementById('status-filter') as HTMLSelectElement).value;
        pagamentosList = await financeiro.list({ tipo: tipo || undefined, status: status || undefined });
        renderFinanceiroPage(container);
    });

    document.getElementById('status-filter')?.addEventListener('change', async (e) => {
        const status = (e.target as HTMLSelectElement).value;
        const tipo = (document.getElementById('tipo-filter') as HTMLSelectElement).value;
        pagamentosList = await financeiro.list({ tipo: tipo || undefined, status: status || undefined });
        renderFinanceiroPage(container);
    });
}
