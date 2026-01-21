import { projetos, clientes as clientesApi } from '../api/client';
import { formatDate, getStatusBadgeClass, getStatusLabel, showToast } from '../utils/helpers';
import type { Projeto, Cliente } from '../api/types';

let projetosList: Projeto[] = [];
let clientesList: Cliente[] = [];

export async function renderProjetos(container: HTMLElement) {
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        [projetosList, clientesList] = await Promise.all([
            projetos.list(),
            clientesApi.list()
        ]);
        renderProjetosList(container);
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Erro ao carregar projetos</div>';
    }
}

function renderProjetosList(container: HTMLElement) {
    container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Projetos</h1>
      <button class="btn btn-primary" id="add-projeto-btn">+ Novo Projeto</button>
    </div>

    <div class="card">
      <div class="card-header">
        <select class="form-input form-select" id="status-filter" style="max-width: 200px;">
          <option value="">Todos os status</option>
          <option value="planejamento">Planejamento</option>
          <option value="em_execucao">Em Execução</option>
          <option value="pausado">Pausado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      
      ${projetosList.length === 0 ?
            '<div class="empty-state"><div class="empty-state-icon">📁</div>Nenhum projeto cadastrado</div>' :
            `<div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Prazo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${projetosList.map(renderProjetoRow).join('')}
            </tbody>
          </table>
        </div>`
        }
    </div>

    <!-- Modal -->
    <div class="modal-overlay" id="projeto-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">Novo Projeto</h3>
          <button class="modal-close" id="close-modal">&times;</button>
        </div>
        <form id="projeto-form">
          <div class="modal-body">
            <input type="hidden" id="projeto-id">
            <div class="form-group">
              <label class="form-label">Nome *</label>
              <input type="text" class="form-input" id="nome" required>
            </div>
            <div class="form-group">
              <label class="form-label">Cliente *</label>
              <select class="form-input form-select" id="cliente_id" required>
                <option value="">Selecione...</option>
                ${clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Descrição</label>
              <textarea class="form-input" id="descricao" rows="3"></textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
              <div class="form-group">
                <label class="form-label">Data Início</label>
                <input type="date" class="form-input" id="prazo_inicio">
              </div>
              <div class="form-group">
                <label class="form-label">Data Final</label>
                <input type="date" class="form-input" id="prazo_final">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-input form-select" id="status">
                <option value="planejamento">Planejamento</option>
                <option value="em_execucao">Em Execução</option>
                <option value="pausado">Pausado</option>
                <option value="concluido">Concluído</option>
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

function renderProjetoRow(projeto: Projeto): string {
    const cliente = clientesList.find(c => c.id === projeto.cliente_id);
    return `
    <tr>
      <td><strong>${projeto.nome}</strong></td>
      <td>${cliente?.nome || '-'}</td>
      <td><span class="badge ${getStatusBadgeClass(projeto.status)}">${getStatusLabel(projeto.status)}</span></td>
      <td>${projeto.prazo_final ? formatDate(projeto.prazo_final) : '-'}</td>
      <td>
        <button class="btn btn-secondary btn-sm edit-btn" data-id="${projeto.id}">Editar</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${projeto.id}">Excluir</button>
      </td>
    </tr>
  `;
}

function setupEventListeners(container: HTMLElement) {
    const modal = document.getElementById('projeto-modal') as HTMLElement;
    const form = document.getElementById('projeto-form') as HTMLFormElement;

    document.getElementById('add-projeto-btn')?.addEventListener('click', () => {
        form.reset();
        (document.getElementById('projeto-id') as HTMLInputElement).value = '';
        (document.getElementById('modal-title') as HTMLElement).textContent = 'Novo Projeto';
        modal.classList.add('active');
    });

    document.getElementById('close-modal')?.addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('cancel-btn')?.addEventListener('click', () => modal.classList.remove('active'));

    document.querySelectorAll('.edit-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = (btn as HTMLElement).dataset.id!;
            const projeto = projetosList.find(p => p.id === id);
            if (projeto) {
                (document.getElementById('projeto-id') as HTMLInputElement).value = projeto.id;
                (document.getElementById('nome') as HTMLInputElement).value = projeto.nome;
                (document.getElementById('cliente_id') as HTMLSelectElement).value = projeto.cliente_id;
                (document.getElementById('descricao') as HTMLTextAreaElement).value = projeto.descricao || '';
                (document.getElementById('prazo_inicio') as HTMLInputElement).value = projeto.prazo_inicio?.split('T')[0] || '';
                (document.getElementById('prazo_final') as HTMLInputElement).value = projeto.prazo_final?.split('T')[0] || '';
                (document.getElementById('status') as HTMLSelectElement).value = projeto.status;
                (document.getElementById('modal-title') as HTMLElement).textContent = 'Editar Projeto';
                modal.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const id = (btn as HTMLElement).dataset.id!;
            if (confirm('Tem certeza?')) {
                try {
                    await projetos.delete(id);
                    showToast('Projeto excluído', 'success');
                    renderProjetos(container);
                } catch (error: any) {
                    showToast(error.message, 'error');
                }
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = (document.getElementById('projeto-id') as HTMLInputElement).value;

        const data = {
            nome: (document.getElementById('nome') as HTMLInputElement).value,
            cliente_id: (document.getElementById('cliente_id') as HTMLSelectElement).value,
            descricao: (document.getElementById('descricao') as HTMLTextAreaElement).value || undefined,
            prazo_inicio: (document.getElementById('prazo_inicio') as HTMLInputElement).value || undefined,
            prazo_final: (document.getElementById('prazo_final') as HTMLInputElement).value || undefined,
            status: (document.getElementById('status') as HTMLSelectElement).value as any,
        };

        try {
            if (id) {
                await projetos.update(id, data);
                showToast('Projeto atualizado', 'success');
            } else {
                await projetos.create(data);
                showToast('Projeto criado', 'success');
            }
            modal.classList.remove('active');
            renderProjetos(container);
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    });

    document.getElementById('status-filter')?.addEventListener('change', async (e) => {
        const status = (e.target as HTMLSelectElement).value;
        projetosList = await projetos.list({ status: status || undefined });
        renderProjetosList(container);
    });
}
