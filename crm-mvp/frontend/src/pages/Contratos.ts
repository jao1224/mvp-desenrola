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
      orcamentosApi.list()
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
        <button class="tab-btn" data-tab="novo" style="padding: 10px 20px; border: none; background: none; border-bottom: 2px solid transparent; color: #666; cursor: pointer;">Novo Contrato</button>
    </div>

    <!-- TABS CONTENT -->
    <div id="tab-content-lista" class="tab-content">
        <div class="card">
            <div class="card-header" style="padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">Contratos Vigentes</h3>
                <button class="btn btn-primary" id="add-contrato-btn">+ Novo Contrato Manual</button>
            </div>
            ${renderTabelaContratos()}
        </div>
    </div>

    <div id="tab-content-novo" class="tab-content" style="display: none;">
        <div class="card" style="padding: 2rem;">
            <div style="display: flex; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                <button id="mode-btn-gerador" class="btn btn-primary" style="flex: 1;">🤖 Gerador Automático</button>
                <button id="mode-btn-upload" class="btn btn-secondary" style="flex: 1;">📎 Importar Arquivo</button>
            </div>

            <!-- SECTION GERADOR -->
            <div id="section-gerador">
                <h3 style="margin-top: 0;">Gerador de Minuta</h3>
                <p style="color: #666; margin-bottom: 2rem;">Gere uma minuta automaticamente a partir de um orçamento aprovado.</p>

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

            <!-- SECTION UPLOAD -->
            <div id="section-upload" style="display: none;">
                <h3 style="margin-top: 0;">Importar Contrato Existente</h3>
                <p style="color: #666; margin-bottom: 2rem;">Cadastre um contrato e anexe o arquivo (PDF, DOCX).</p>

                <form id="upload-contrato-form" style="max-width: 800px;">
                    <div class="form-group" style="margin-bottom: 1rem;">
                         <label class="form-label">Arquivo do Contrato *</label>
                         <div style="border: 2px dashed #666; padding: 2rem; text-align: center; border-radius: 8px; background: rgba(255, 255, 255, 0.05);">
                            <input type="file" id="upload_file" required accept=".pdf,.doc,.docx" style="display: none;" onchange="document.getElementById('file-label').innerText = this.files[0].name">
                            <label for="upload_file" id="file-label" style="cursor: pointer; color: var(--primary-color); font-weight: bold;">
                                Clique para selecionar ou arraste o arquivo aqui
                            </label>
                         </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Cliente *</label>
                            <select class="form-input form-select" id="upload_cliente_id" required>
                                <option value="">Selecione...</option>
                                ${clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Número do Contrato</label>
                            <input type="text" class="form-input" id="upload_numero" placeholder="Deixe vazio para gerar automático">
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                         <div class="form-group">
                            <label class="form-label">Valor Total</label>
                            <input type="number" step="0.01" class="form-input" id="upload_valor" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Data Início</label>
                            <input type="date" class="form-input" id="upload_data_inicio" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Data Término</label>
                            <input type="date" class="form-input" id="upload_data_termino" required>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end;">
                        <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                            Salvar e Importar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Manual (Mantido) -->
    <div class="modal-overlay" id="contrato-modal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">Novo Contrato (Manual)</h3>
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

    <!-- Modal Anexos -->
    <div class="modal-overlay" id="attachments-modal">
      <div class="modal" style="max-width: 600px;">
        <div class="modal-header">
          <h3 class="modal-title">Anexos do Contrato</h3>
          <button class="modal-close" id="close-attachments-modal">&times;</button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="attachment-contrato-id">
            
            <div style="border: 2px dashed #666; padding: 1.5rem; text-align: center; border-radius: 8px; margin-bottom: 2rem; background: rgba(255, 255, 255, 0.05);">
                <input type="file" id="modal_upload_file" style="display: none;">
                <label for="modal_upload_file" id="modal-file-label" style="cursor: pointer; color: var(--primary-color); font-weight: bold; display: block; margin-bottom: 0.5rem;">
                    + Adicionar Novo Arquivo
                </label>
                <button class="btn btn-primary btn-sm" id="btn-modal-upload" style="display: none;">Enviar</button>
            </div>

            <h4 style="margin-bottom: 1rem;">Arquivos Anexados</h4>
            <div id="attachments-list" style="max-height: 300px; overflow-y: auto;">
                <div class="loading"><div class="spinner"></div></div>
            </div>
        </div>
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
        <button class="btn btn-sm btn-outline attachments-btn" data-id="${contrato.id}" title="Anexos">📎</button>
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

      tabs.forEach(t => {
        (t as HTMLElement).style.borderBottom = '2px solid transparent';
        (t as HTMLElement).style.color = '#666';
        t.classList.remove('active');
      });
      (tab as HTMLElement).style.borderBottom = '2px solid var(--primary-color)';
      (tab as HTMLElement).style.color = 'inherit';
      tab.classList.add('active');

      contents.forEach(c => {
        (c as HTMLElement).style.display = 'none';
      });
      document.getElementById(`tab-content-${target}`)!.style.display = 'block';
    });
  });
}

function setupEventListeners(container: HTMLElement) {
  // === EXISTING MANUAL MODAL ===
  const modal = document.getElementById('contrato-modal') as HTMLElement;
  const form = document.getElementById('contrato-form') as HTMLFormElement;

  // === ATTACHMENTS MODAL ===
  const attachModal = document.getElementById('attachments-modal') as HTMLElement;
  const closeAttachModal = document.getElementById('close-attachments-modal');

  if (closeAttachModal) {
    closeAttachModal.addEventListener('click', () => attachModal.classList.remove('active'));
  }

  // File Input Logic in Attach Modal
  const modalFileInput = document.getElementById('modal_upload_file') as HTMLInputElement;
  const modalUploadBtn = document.getElementById('btn-modal-upload') as HTMLButtonElement;
  if (modalFileInput) {
    modalFileInput.addEventListener('change', () => {
      if (modalFileInput.files && modalFileInput.files.length > 0) {
        (document.getElementById('modal-file-label') as HTMLElement).innerText = modalFileInput.files[0].name;
        modalUploadBtn.style.display = 'inline-block';
      }
    });
  }

  // Upload Action in Attach Modal
  if (modalUploadBtn) {
    modalUploadBtn.addEventListener('click', async () => {
      const file = modalFileInput.files?.[0];
      const contratoId = (document.getElementById('attachment-contrato-id') as HTMLInputElement).value;

      if (!file || !contratoId) return;

      modalUploadBtn.innerHTML = 'Enviando...';
      modalUploadBtn.disabled = true;

      try {
        await contratos.uploadDocument(contratoId, file);
        showToast('Arquivo anexado!', 'success');
        modalFileInput.value = ''; // Reset
        (document.getElementById('modal-file-label') as HTMLElement).innerText = '+ Adicionar Novo Arquivo';
        modalUploadBtn.style.display = 'none';
        loadAttachments(contratoId); // Refresh List
      } catch (e: any) {
        showToast(e.message, 'error');
      } finally {
        modalUploadBtn.innerHTML = 'Enviar';
        modalUploadBtn.disabled = false;
      }
    });
  }

  // Function to Load Attachments
  async function loadAttachments(id: string) {
    const listContainer = document.getElementById('attachments-list')!;
    listContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
      const details: any = await contratos.get(id); // Cast to any because types might be missing 'documentos'
      const docs = details.documentos || [];

      if (docs.length === 0) {
        listContainer.innerHTML = '<div style="color: #999; text-align: center; padding: 1rem;">Nenhum anexo encontrado.</div>';
        return;
      }

      // Note: Updated to use contratos.deleteDocument
      listContainer.innerHTML = docs.map((doc: any) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-bottom: 1px solid #eee;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-size: 1.2rem;">📄</span>
                      <div>
                          <div style="font-weight: 500;">${doc.nome_original}</div>
                          <div style="font-size: 0.8rem; color: #666;">${new Date(doc.created_at).toLocaleDateString()}</div>
                      </div>
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                      <a href="/uploads/${doc.nome}" target="_blank" class="btn btn-sm btn-outline" title="Baixar/Visualizar">⬇️</a>
                      <button class="btn btn-sm btn-danger delete-attachment-btn" data-id="${doc.id}" data-contract="${id}" title="Excluir">🗑️</button>
                  </div>
              </div>
            `).join('');

      // Add Delete Listeners
      listContainer.querySelectorAll('.delete-attachment-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const docId = (e.currentTarget as HTMLElement).dataset.id!;
          const contId = (e.currentTarget as HTMLElement).dataset.contract!;
          if (confirm('Excluir anexo?')) {
            try {
              await contratos.deleteDocument(contId, docId);
              showToast('Anexo excluído', 'success');
              loadAttachments(contId);
            } catch (err: any) {
              showToast(err.message, 'error');
            }
          }
        });
      });

    } catch (e) {
      listContainer.innerHTML = '<div style="color: red;">Erro ao carregar anexos.</div>';
    }
  }

  // Attachments Button Click (In List)
  document.querySelectorAll('.attachments-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      (document.getElementById('attachment-contrato-id') as HTMLInputElement).value = id;
      attachModal.classList.add('active');
      loadAttachments(id);
    });
  });

  // === MANUAL CONTRACT ACTIONS ===
  document.getElementById('add-contrato-btn')?.addEventListener('click', () => {
    form.reset();
    (document.getElementById('contrato-id') as HTMLInputElement).value = '';
    (document.getElementById('modal-title') as HTMLElement).textContent = 'Novo Contrato';
    modal.classList.add('active');
  });

  const closeModal = () => modal.classList.remove('active');
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('cancel-btn')?.addEventListener('click', closeModal);

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

  // === HUB LOGIC (GENERATOR + UPLOAD) ===

  // 1. Generator Dynamic Placeholders
  const entityTypeRadios = document.querySelectorAll('input[name="tipo_entidade"]');
  const entitySelect = document.getElementById('gerador_entidade_id') as HTMLSelectElement;

  entityTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = (e.target as HTMLInputElement).value;
      if (type === 'cliente') {
        entitySelect.innerHTML = '<option value="">Selecione o Cliente...</option>' +
          clientesList.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
      } else {
        entitySelect.innerHTML = '<option value="">Selecione o Parceiro...</option><option value="p1">Parceiro Exemplo Ltda</option>';
      }
    });
  });

  // 2. Toggle Mode Logic
  const btnModeGerador = document.getElementById('mode-btn-gerador');
  const btnModeUpload = document.getElementById('mode-btn-upload');
  const sectionGerador = document.getElementById('section-gerador');
  const sectionUpload = document.getElementById('section-upload');

  if (btnModeGerador && btnModeUpload && sectionGerador && sectionUpload) {
    btnModeGerador.addEventListener('click', () => {
      sectionGerador.style.display = 'block';
      sectionUpload.style.display = 'none';
      btnModeGerador.className = 'btn btn-primary';
      btnModeUpload.className = 'btn btn-secondary';
    });

    btnModeUpload.addEventListener('click', () => {
      sectionGerador.style.display = 'none';
      sectionUpload.style.display = 'block';
      btnModeGerador.className = 'btn btn-secondary';
      btnModeUpload.className = 'btn btn-primary';
    });
  }

  // 3. Upload Form Submit
  const uploadForm = document.getElementById('upload-contrato-form') as HTMLFormElement;
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = uploadForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Processando...';
      submitBtn.disabled = true;

      try {
        const fileInput = document.getElementById('upload_file') as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (!file) throw new Error("Selecione um arquivo");

        const clienteId = (document.getElementById('upload_cliente_id') as HTMLSelectElement).value;
        let numero = (document.getElementById('upload_numero') as HTMLInputElement).value;
        const valor = parseFloat((document.getElementById('upload_valor') as HTMLInputElement).value);
        const inicio = (document.getElementById('upload_data_inicio') as HTMLInputElement).value;
        const termino = (document.getElementById('upload_data_termino') as HTMLInputElement).value;

        if (!numero) {
          const now = new Date();
          numero = `IMP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        }

        // Create
        const contratoData = {
          numero,
          cliente_id: clienteId,
          valor,
          data_inicio: inicio,
          data_termino: termino,
          condicoes: `Contrato importado via upload. Arquivo original: ${file.name}`,
          observacoes: 'Importação Manual'
        };

        const newContrato = await contratos.create(contratoData);

        // Upload
        if (newContrato && newContrato.id) {
          await contratos.uploadDocument(newContrato.id, file);
          showToast('Contrato importado com sucesso!', 'success');
          uploadForm.reset();
          renderContratos(container);
          // Switch back to list
          (document.querySelector('.tab-btn[data-tab="lista"]') as HTMLElement).click();
        }

      } catch (error: any) {
        console.error(error);
        showToast(error.message || 'Erro ao importar contrato', 'error');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // 4. Generator Preview Logic
  document.getElementById('btn-gerar-preview')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-gerar-preview') as HTMLButtonElement;
    const clienteId = (document.getElementById('gerador_entidade_id') as HTMLSelectElement).value;
    const orcamentoId = (document.getElementById('gerador_orcamento_id') as HTMLSelectElement).value;

    if (!clienteId || !orcamentoId) {
      showToast('Selecione o Cliente e o Orçamento', 'warning');
      return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Gerando...';
    btn.disabled = true;

    try {
      const res = await contratos.preview({ orcamento_id: orcamentoId, cliente_id: clienteId });

      const container = document.getElementById('tab-content-novo')!;
      container.innerHTML = `
              <div style="max-width: 210mm; margin: 0 auto; padding: 20px; background: #525659;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 20px; color: white;">
                      <button class="btn btn-secondary" id="btn-voltar-gerador">← Voltar</button>
                      <div>
                          <button class="btn btn-primary" id="btn-imprimir-contrato">🖨️ Imprimir / Salvar PDF</button>
                      </div>
                  </div>
                  <div id="contract-preview-paper" style="background: white; padding: 0; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                      ${res.html_content}
                  </div>
              </div>
          `;

      document.getElementById('btn-voltar-gerador')?.addEventListener('click', () => {
        renderContratos(document.getElementById('app-container') || document.body);
      });

      document.getElementById('btn-imprimir-contrato')?.addEventListener('click', () => {
        const printContent = document.getElementById('contract-preview-paper')?.innerHTML;
        const win = window.open('', '', 'height=700,width=900');
        if (win) {
          win.document.write('<html><head><title>Contrato</title>');
          win.document.write('<style>@page { size: A4; margin: 0; } body { margin: 0; }</style>');
          win.document.write('</head><body>');
          win.document.write(printContent || '');
          win.document.write('</body></html>');
          win.document.close();
          win.focus();
          win.print();
        }
      });

    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Erro ao gerar minuta', 'error');
    } finally {
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  });
}
