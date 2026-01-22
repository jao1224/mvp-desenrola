import { contratos, clientes as clientesApi, orcamentos as orcamentosApi } from '../api/client';
import { formatDate, formatCurrency, showToast } from '../utils/helpers';
import type { Contrato, Cliente, Orcamento } from '../api/types';

let contratosList: Contrato[] = [];
let clientesList: Cliente[] = [];
let orcamentosList: Orcamento[] = [];

export async function renderContratos(container: HTMLElement) {
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    [contratosList, clientesList, orcamentosList] = await Promise.all([
      contratos.list(),
      clientesApi.list(),
      orcamentosApi.list() // Removed filter to show all budgets
    ]);
    if (!orcamentosList) orcamentosList = [];

    renderContratosTabs(container);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    container.innerHTML = '<div class="empty-state">Erro ao carregar dados. Tente novamente.</div>';
  }
}

function renderContratosTabs(container: HTMLElement) {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Contratos</h1>
    </div>

    <!-- TABS NAVIGATION -->
    <div class="tabs" style="margin-bottom: 20px; border-bottom: 1px solid #ddd;">
        <button class="tab-btn active" data-tab="lista" style="padding: 10px 20px; margin-right: 5px; border: none; background: none; border-bottom: 2px solid var(--primary-color); font-weight: bold; cursor: pointer;">Lista de Contratos</button>
        <button class="tab-btn" data-tab="gerador" style="padding: 10px 20px; border: none; background: none; border-bottom: 2px solid transparent; color: #666; cursor: pointer;">Gerador de Contratos</button>
    </div>

    <!-- TABS CONTENT -->
    <div id="tab-content-lista" class="tab-content">
        <!-- Conteúdo Lista (Original) -->
        <div class="card">
            <div class="card-header" style="padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">Contratos Vigentes</h3>
                <button class="btn btn-primary" id="add-contrato-btn">+ Novo Contrato Manual</button>
            </div>
            ${renderTabelaContratos()}
        </div>
    </div>

    <div id="tab-content-gerador" class="tab-content" style="display: none;">
        <!-- Conteúdo Gerador (Novo) -->
        <div class="card" style="padding: 2rem;">
            <h2 style="margin-top: 0;">Gerador de Contratos</h2>
            <p style="color: #666; margin-bottom: 2rem;">Selecione um cliente ou parceiro e um orçamento para gerar o contrato.</p>

            <form id="gerador-contrato-form">
                <div style="display: flex; gap: 2rem; margin-bottom: 2rem; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="radio" id="tipo_cliente" name="tipo_entidade" value="cliente" checked>
                        <label for="tipo_cliente" style="cursor: pointer; font-weight: 500;">Cliente</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="radio" id="tipo_parceiro" name="tipo_entidade" value="parceiro">
                        <label for="tipo_parceiro" style="cursor: pointer; font-weight: 500;">Parceiro</label>
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                    <div style="flex: 1;">
                        <select class="form-input form-select" id="gerador_entidade_id" required style="width: 100%; padding: 0.75rem;">
                            <option value="">Selecione o Cliente...</option>
                            ${clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div style="flex: 1;">
                        <select class="form-input form-select" id="gerador_orcamento_id" required style="width: 100%; padding: 0.75rem;">
                            <option value="">Selecione um orçamento...</option>
                            ${orcamentosList.map(o => `<option value="${o.id}">${o.titulo} [${o.status.toUpperCase()}] (${formatCurrency(o.valor_total)})</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                    <button type="button" id="btn-gerar-preview" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                        Gerar Minuta de Contrato
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Manual (Mantido) -->
    <div class="modal-overlay" id="contrato-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">Novo Contrato</h3>
          <button class="modal-close" id="close-modal">&times;</button>
        </div>
        <form id="contrato-form">
          <div class="modal-body">
            <input type="hidden" id="contrato-id">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label class="form-label">Número *</label>
                <input type="text" class="form-input" id="numero" required>
              </div>
              <div class="form-group">
                <label class="form-label">Valor *</label>
                <input type="number" step="0.01" class="form-input" id="valor" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Cliente *</label>
              <select class="form-input form-select" id="cliente_id" required>
                <option value="">Selecione...</option>
                ${clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
              </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label class="form-label">Data Início *</label>
                <input type="date" class="form-input" id="data_inicio" required>
              </div>
              <div class="form-group">
                <label class="form-label">Data Término *</label>
                <input type="date" class="form-input" id="data_termino" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Condições</label>
              <textarea class="form-input" id="condicoes" rows="3"></textarea>
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

  setupTabLogic();
  setupEventListeners(container);
}

function renderTabelaContratos(): string {
  if (contratosList.length === 0) {
    return '<div class="empty-state"><div class="empty-state-icon">📋</div>Nenhum contrato cadastrado</div>';
  }

  return `
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Início</th>
            <th>Término</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${contratosList.map(renderContratoRow).join('')}
        </tbody>
      </table>
    </div>`;
}

function renderContratoRow(contrato: Contrato): string {
  const cliente = clientesList.find(c => c.id === contrato.cliente_id);
  const hoje = new Date();
  const termino = new Date(contrato.data_termino);
  const diasRestantes = Math.ceil((termino.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  let badgeClass = 'badge-success';
  if (diasRestantes <= 0) badgeClass = 'badge-danger';
  else if (diasRestantes <= 30) badgeClass = 'badge-warning';

  return `
    <tr>
      <td><strong>${contrato.numero}</strong></td>
      <td>${cliente?.nome || '-'}</td>
      <td>${formatCurrency(contrato.valor)}</td>
      <td>${formatDate(contrato.data_inicio)}</td>
      <td>
        ${formatDate(contrato.data_termino)}
        <span class="badge ${badgeClass}" style="margin-left: 0.5rem;">
          ${diasRestantes <= 0 ? 'Vencido' : diasRestantes + ' dias'}
        </span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm edit-btn" data-id="${contrato.id}">Editar</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${contrato.id}">Excluir</button>
      </td>
    </tr>
  `;
}

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
      document.getElementById(`tab-content-${target}`)!.style.display = 'block';
    });
  });
}

function setupEventListeners(container: HTMLElement) {
  const modal = document.getElementById('contrato-modal') as HTMLElement;
  const form = document.getElementById('contrato-form') as HTMLFormElement;

  // Manual Contract Add
  document.getElementById('add-contrato-btn')?.addEventListener('click', () => {
    form.reset();
    (document.getElementById('contrato-id') as HTMLInputElement).value = '';
    (document.getElementById('modal-title') as HTMLElement).textContent = 'Novo Contrato';
    modal.classList.add('active');
  });

  // Close Modal Logic
  const closeModal = () => modal.classList.remove('active');
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('cancel-btn')?.addEventListener('click', closeModal);

  // Edit Logic
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const contrato = contratosList.find(c => c.id === id);
      if (contrato) {
        (document.getElementById('contrato-id') as HTMLInputElement).value = contrato.id;
        (document.getElementById('numero') as HTMLInputElement).value = contrato.numero;
        (document.getElementById('cliente_id') as HTMLSelectElement).value = contrato.cliente_id;
        (document.getElementById('valor') as HTMLInputElement).value = contrato.valor.toString();
        (document.getElementById('data_inicio') as HTMLInputElement).value = contrato.data_inicio.split('T')[0];
        (document.getElementById('data_termino') as HTMLInputElement).value = contrato.data_termino.split('T')[0];
        (document.getElementById('condicoes') as HTMLTextAreaElement).value = contrato.condicoes || '';
        (document.getElementById('modal-title') as HTMLElement).textContent = 'Editar Contrato';
        modal.classList.add('active');
      }
    });
  });

  // Delete Logic
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).dataset.id!;
      if (confirm('Tem certeza?')) {
        try {
          await contratos.delete(id);
          showToast('Contrato excluído', 'success');
          renderContratos(container);
        } catch (error: any) {
          showToast(error.message, 'error');
        }
      }
    });
  });

  // Form Submit (Manual)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = (document.getElementById('contrato-id') as HTMLInputElement).value;

    const data = {
      numero: (document.getElementById('numero') as HTMLInputElement).value,
      cliente_id: (document.getElementById('cliente_id') as HTMLSelectElement).value,
      valor: parseFloat((document.getElementById('valor') as HTMLInputElement).value),
      data_inicio: (document.getElementById('data_inicio') as HTMLInputElement).value,
      data_termino: (document.getElementById('data_termino') as HTMLInputElement).value,
      condicoes: (document.getElementById('condicoes') as HTMLTextAreaElement).value || undefined,
    };

    try {
      if (id) {
        await contratos.update(id, data);
        showToast('Contrato atualizado', 'success');
      } else {
        await contratos.create(data);
        showToast('Contrato criado', 'success');
      }
      modal.classList.remove('active');
      renderContratos(container);
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  });

  // Generator UI Logic (Dynamic Placeholders)
  const entityTypeRadios = document.querySelectorAll('input[name="tipo_entidade"]');
  const entitySelect = document.getElementById('gerador_entidade_id') as HTMLSelectElement;

  entityTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = (e.target as HTMLInputElement).value;
      if (type === 'cliente') {
        entitySelect.innerHTML = '<option value="">Selecione o Cliente...</option>' +
          clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
      } else {
        // Placeholder for Partners since we don't have an API for them yet
        entitySelect.innerHTML = '<option value="">Selecione o Parceiro...</option><option value="p1">Parceiro Exemplo Ltda</option>';
      }
    });
  });

  document.getElementById('btn-gerar-preview')?.addEventListener('click', () => {
    showToast('Funcionalidade de geração em desenvolvimento', 'info');
  });
}
