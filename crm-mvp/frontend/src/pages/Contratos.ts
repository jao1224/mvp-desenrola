import { contratos, clientes as clientesApi } from '../api/client';
import { formatDate, formatCurrency, showToast } from '../utils/helpers';
import type { Contrato, Cliente } from '../api/types';

let contratosList: Contrato[] = [];
let clientesList: Cliente[] = [];

export async function renderContratos(container: HTMLElement) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        [contratosList, clientesList] = await Promise.all([
            contratos.list(),
            clientesApi.list()
        ]);
        renderContratosList(container);
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Erro ao carregar contratos</div>';
    }
}

function renderContratosList(container: HTMLElement) {
    container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Contratos</h1>
      <button class="btn btn-primary" id="add-contrato-btn">+ Novo Contrato</button>
    </div>

    <div class="card">
      ${contratosList.length === 0 ?
            '<div class="empty-state"><div class="empty-state-icon">📋</div>Nenhum contrato cadastrado</div>' :
            `<div class="table-container">
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
        </div>`
        }
    </div>

    <!-- Modal -->
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

    setupEventListeners(container);
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

function setupEventListeners(container: HTMLElement) {
    const modal = document.getElementById('contrato-modal') as HTMLElement;
    const form = document.getElementById('contrato-form') as HTMLFormElement;

    document.getElementById('add-contrato-btn')?.addEventListener('click', () => {
        form.reset();
        (document.getElementById('contrato-id') as HTMLInputElement).value = '';
        (document.getElementById('modal-title') as HTMLElement).textContent = 'Novo Contrato';
        modal.classList.add('active');
    });

    document.getElementById('close-modal')?.addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('cancel-btn')?.addEventListener('click', () => modal.classList.remove('active'));

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
}
