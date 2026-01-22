import { projetos, clientes as clientesApi } from '../api/client';
import { formatDate, getStatusBadgeClass, getStatusLabel, showToast } from '../utils/helpers';
import { getIcon } from '../utils/icons';
import type { Projeto, Cliente } from '../api/types';

let projetosList: Projeto[] = [];
let clientesList: Cliente[] = [];
let editingId: string | null = null;

export async function renderProjetos(container: HTMLElement) {
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    [projetosList, clientesList] = await Promise.all([
      projetos.list(),
      clientesApi.list()
    ]);
    renderSplitLayout(container);
  } catch (error) {
    container.innerHTML = '<div class="empty-state">Erro ao carregar projetos</div>';
    console.error(error);
  }
}

function renderSplitLayout(container: HTMLElement) {
  container.innerHTML = `
    <style>
        .projects-layout {
            display: grid;
            grid-template-columns: 420px 1fr; /* Aumentado para dar mais respiro aos inputs duplos */
            gap: 2rem;
            align-items: start;
        }
        @media (max-width: 900px) {
            .projects-layout {
                grid-template-columns: 1fr;
            }
        }
        .form-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 2rem; /* Mais padding interno */
            position: sticky;
            top: 1rem;
        }
        .list-card {
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 1.5rem;
        }
        .form-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--color-text);
        }
        .form-subtitle {
            font-size: 0.9rem;
            color: var(--color-text-muted);
            margin-bottom: 2rem;
            line-height: 1.5;
        }
        /* Alinhamento do Form */
        #projeto-form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem; /* Gap consistente entre form-groups */
        }
        .form-group {
            margin-bottom: 0; /* Zerar margin inferior padrão para usar gap do flex pai */
        }
        .form-input, .form-select {
            width: 100%;
            background: var(--color-bg);
            border-color: var(--color-border);
        }
        textarea.form-input {
            resize: vertical;
            min-height: 80px;
        }
        /* Date Grid Alignment */
        .date-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            width: 100%;
        }
        .radio-group {
            display: flex;
            gap: 1.5rem;
            margin-top: 0.5rem;
        }
        .radio-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: 500;
        }
        .radio-label input[type="radio"] {
            accent-color: var(--color-primary);
            width: 1.2rem;
            height: 1.2rem;
        }
    </style>

    <div class="page-header">
      <h1 class="page-title">Projetos</h1>
    </div>

    <div class="projects-layout">
        <!-- LEFT COLUMN: FORM -->
        <div class="form-card">
            <h2 class="form-title" id="form-title">Cadastrar Projeto</h2>
            <p class="form-subtitle">Preencha os dados para adicionar um novo projeto.</p>
            
            <form id="projeto-form">
                <input type="hidden" id="projeto-id">
                
                <div class="form-group">
                    <label class="form-label">Nome do Projeto</label>
                    <input type="text" class="form-input" id="nome" required placeholder="Ex: Novo App de Vendas">
                </div>

                <div class="form-group">
                    <label class="form-label">Tipo de Entidade</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="entity_type" value="cliente" checked> Cliente
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="entity_type" value="parceiro"> Parceiro
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Cliente / Parceiro</label>
                    <select class="form-input form-select" id="cliente_id" required>
                        <option value="">Selecione...</option>
                        ${renderClientOptions()}
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Descrição</label>
                    <textarea class="form-input" id="descricao" rows="3" placeholder="Descreva o escopo principal do projeto..."></textarea>
                </div>

                <div class="date-row">
                    <div class="form-group">
                        <label class="form-label">Data de Início</label>
                        <input type="date" class="form-input" id="prazo_inicio">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Previsão de Término</label>
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

                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
                    <button type="submit" class="btn btn-primary" id="save-btn" style="width: 100%;">Adicionar Projeto</button>
                    <button type="button" class="btn btn-secondary" id="cancel-btn" style="width: 100%; display: none;">Cancelar Edição</button>
                </div>
            </form>
        </div>

        <!-- RIGHT COLUMN: LIST -->
        <div class="list-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                     <h2 class="form-title" style="margin:0; display:flex; align-items:center; gap:8px;">${getIcon('folder')} Lista de Projetos</h2>
                     <p class="form-subtitle" style="margin:0;">Gerencie seus projetos e acompanhe prazos.</p>
                </div>
            </div>

            <div id="projects-list-container">
                ${renderProjectsTable()}
            </div>
        </div>
    </div>
    `;

  setupEventListeners(container);
}

function renderClientOptions() {
  return clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
}

function renderProjectsTable() {
  if (projetosList.length === 0) {
    return `<div class="empty-state"><div class="empty-state-icon">${getIcon('folder-open', 'w-12 h-12')}</div>Nenhum projeto cadastrado ainda.</div>`;
  }

  return `
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Projeto</th>
                <th>Cliente/Parceiro</th>
                <th>Data de Início</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${projetosList.map(p => {
    const cliente = clientesList.find(c => c.id === p.cliente_id);
    return `
                    <tr>
                        <td><strong>${p.nome}</strong></td>
                        <td>${cliente?.nome || '-'}</td>
                        <td>${p.prazo_inicio ? formatDate(p.prazo_inicio) : '-'}</td>
                        <td><span class="badge ${getStatusBadgeClass(p.status)}">${getStatusLabel(p.status)}</span></td>
                        <td>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary btn-sm edit-btn" data-id="${p.id}" title="Editar">${getIcon('edit', 'w-4 h-4')}</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}" title="Excluir">${getIcon('trash', 'w-4 h-4')}</button>
                            </div>
                        </td>
                    </tr>
                  `;
  }).join('')}
            </tbody>
          </table>
        </div>
    `;
}

function setupEventListeners(container: HTMLElement) {
  const form = document.getElementById('projeto-form') as HTMLFormElement;
  const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
  const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
  const formTitle = document.getElementById('form-title') as HTMLElement;
  const clientSelect = document.getElementById('cliente_id') as HTMLSelectElement;

  // Entity Type Toggle
  document.querySelectorAll('input[name="entity_type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = (e.target as HTMLInputElement).value;
      if (type === 'cliente') {
        clientSelect.innerHTML = '<option value="">Selecione...</option>' + renderClientOptions();
        clientSelect.disabled = false;
      } else {
        clientSelect.innerHTML = '<option value="placeholder">Parceiro Exemplo (Mock)</option>';
        clientSelect.disabled = true; // Block while no API
      }
    });
  });

  // Edit Handler
  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const editBtn = target.closest('.edit-btn') as HTMLElement;

    if (editBtn) {
      const id = editBtn.dataset.id!;
      const projeto = projetosList.find(p => p.id === id);

      if (projeto) {
        editingId = id;
        // Populate form
        (document.getElementById('projeto-id') as HTMLInputElement).value = projeto.id;
        (document.getElementById('nome') as HTMLInputElement).value = projeto.nome;

        // Select correct entity type radio logic potentially here, keeping simple for now
        // Assuming clients only for MVP list
        (document.querySelector('input[name="entity_type"][value="cliente"]') as HTMLInputElement).checked = true;
        clientSelect.innerHTML = '<option value="">Selecione...</option>' + renderClientOptions();
        clientSelect.value = projeto.cliente_id;

        (document.getElementById('descricao') as HTMLTextAreaElement).value = projeto.descricao || '';
        (document.getElementById('prazo_inicio') as HTMLInputElement).value = projeto.prazo_inicio?.split('T')[0] || '';
        (document.getElementById('prazo_final') as HTMLInputElement).value = projeto.prazo_final?.split('T')[0] || '';
        (document.getElementById('status') as HTMLSelectElement).value = projeto.status;

        // UI Updates
        formTitle.textContent = 'Editar Projeto';
        saveBtn.textContent = 'Atualizar Projeto';
        cancelBtn.style.display = 'block';

        // Scroll to top on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // Delete Handler
  container.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const deleteBtn = target.closest('.delete-btn') as HTMLElement;

    if (deleteBtn) {
      if (confirm('Tem certeza que deseja excluir este projeto?')) {
        const id = deleteBtn.dataset.id!;
        try {
          await projetos.delete(id);
          showToast('Projeto excluído', 'success');
          // Refresh list
          projetosList = projetosList.filter(p => p.id !== id);
          document.getElementById('projects-list-container')!.innerHTML = renderProjectsTable();
        } catch (error: any) {
          showToast('Erro ao excluir projeto', 'error');
        }
      }
    }
  });

  // Cancel Edit Handler
  cancelBtn.addEventListener('click', () => {
    resetForm(form, saveBtn, cancelBtn, formTitle);
  });

  // Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Handling Partner Placeholders
    const isPartner = (document.querySelector('input[name="entity_type"]:checked') as HTMLInputElement).value === 'parceiro';
    if (isPartner) {
      showToast('Cadastro de parcerias estará disponível em breve.', 'warning');
      return;
    }

    const data = {
      nome: (document.getElementById('nome') as HTMLInputElement).value,
      cliente_id: (document.getElementById('cliente_id') as HTMLSelectElement).value,
      descricao: (document.getElementById('descricao') as HTMLTextAreaElement).value || undefined,
      prazo_inicio: (document.getElementById('prazo_inicio') as HTMLInputElement).value || undefined,
      prazo_final: (document.getElementById('prazo_final') as HTMLInputElement).value || undefined,
      status: (document.getElementById('status') as HTMLSelectElement).value as any,
    };


    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';

    try {
      if (editingId) {
        const updated = await projetos.update(editingId, data);
        showToast('Projeto atualizado!', 'success');
        // Update local list
        const idx = projetosList.findIndex(p => p.id === editingId);
        if (idx !== -1) projetosList[idx] = updated;
      } else {
        const created = await projetos.create(data);
        showToast('Projeto criado!', 'success');
        projetosList.push(created);
      }

      document.getElementById('projects-list-container')!.innerHTML = renderProjectsTable();
      resetForm(form, saveBtn, cancelBtn, formTitle);

    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = editingId ? 'Atualizar Projeto' : 'Adicionar Projeto';
    }
  });
}

function resetForm(form: HTMLFormElement, saveBtn: HTMLButtonElement, cancelBtn: HTMLButtonElement, formTitle: HTMLElement) {
  editingId = null;
  form.reset();
  formTitle.textContent = 'Cadastrar Projeto';
  saveBtn.textContent = 'Adicionar Projeto';
  cancelBtn.style.display = 'none';

  // Reset entity type to client
  const clientRadio = document.querySelector('input[name="entity_type"][value="cliente"]') as HTMLInputElement;
  if (clientRadio) {
    clientRadio.checked = true;
    clientRadio.dispatchEvent(new Event('change')); // Trigger reset of select options
  }
}
