import { clientes } from '../api/client';
import { showToast } from '../utils/helpers';
import { getIcon } from '../utils/icons';
import type { Cliente, ClienteCreate } from '../api/types';

let clientesList: Cliente[] = [];

export async function renderClientes(container: HTMLElement) {
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    clientesList = await clientes.list();
    renderClientesList(container);
  } catch (error) {
    container.innerHTML = '<div class="empty-state">Erro ao carregar clientes</div>';
  }
}

function renderClientesList(container: HTMLElement) {
  container.innerHTML = `
    <div class="card" style="margin-bottom: var(--spacing-lg);">
        <div class="card-header" style="border-bottom: none; padding-bottom: var(--spacing-xs);">
            <h2 class="card-title" style="font-size: 1.25rem;">Cadastro</h2>
        </div>
        <div style="padding-top: 0; color: var(--color-text-secondary); margin-bottom: var(--spacing-md);">
            Selecione o tipo para iniciar o cadastro.
        </div>

        <div class="form-group" style="max-width: 100%;">
            <label class="form-label" style="font-weight: 500;">Qual o tipo de cadastro?</label>
            <select class="form-input form-select" id="new-cadastro-select" style="background-color: var(--color-bg); border: 2px solid var(--color-primary);">
                <option value="" selected disabled>Selecione...</option>
                <option value="cliente">Cliente</option>
                <option value="parceiro">Parceiro</option>
                <option value="fornecedor">Fornecedor</option>
            </select>
        </div>
    </div>

    <!-- List Card -->
    <div class="card">
        <div class="card-header" style="display: flex; flex-direction: column; align-items: flex-start; gap: var(--spacing-xs); border-bottom: none;">
            <h2 class="card-title" style="font-size: 1.25rem;">Lista de Clientes e Parceiros</h2>
            <div style="color: var(--color-text-secondary); font-size: 0.875rem;">Visualize e gerencie seus cadastros.</div>
        </div>
    
        ${clientesList.length === 0 ?
      `<div class="empty-state"><div class="empty-state-icon">${getIcon('users', 'w-12 h-12')}</div>Nenhum cliente cadastrado</div>` :
      `<div class="table-container" style="margin-top: var(--spacing-md);">
        <table class="table" id="clientes-table">
            <thead>
            <tr>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Nome Fantasia/Nome</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Tipo</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Entidade</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Email</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Telefone</th>
                <th style="color: var(--color-text-secondary); font-weight: 500;">Ações</th>
            </tr>
            </thead>
            <tbody>
            ${clientesList.map(renderClienteRow).join('')}
            </tbody>
        </table>
        </div>`
    }
    </div>

    <!-- Modal Layout Updated -->
    <div class="modal-overlay" id="cliente-modal">
        <div class="modal" style="max-width: 600px; width: 95%;">
            <div class="modal-header">
                <h3 class="modal-title" id="modal-title">Novo Cadastro</h3>
                <button class="modal-close" id="close-modal">&times;</button>
            </div>
            <form id="cliente-form">
                <div class="modal-body">
                    <input type="hidden" id="cliente-id">
                    
                    <!-- Top Type Selector -->
                    <div class="form-group">
                        <label class="form-label" style="font-weight: 600;">Pessoa Física ou Jurídica?</label>
                        <select class="form-input form-select" id="tipo-pessoa" required>
                            <option value="pf">Pessoa Física</option>
                            <option value="pj">Pessoa Jurídica</option>
                        </select>
                    </div>

                    <!-- Accordion 1: Dados Básicos -->
                    <details open style="margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm);">
                        <summary style="cursor: pointer; font-weight: 600; color: var(--color-primary); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                            <span id="label-dados-basicos">1. Dados Pessoais</span>
                            <span style="font-size: 0.8em;">▼</span>
                        </summary>
                        <div style="padding-top: var(--spacing-md);">
                            <!-- PF Fields -->
                            <div id="fields-pf">
                                <div class="form-group">
                                    <label class="form-label">Nome Completo *</label>
                                    <input type="text" class="form-input" id="nome_pf">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">CPF *</label>
                                    <input type="text" class="form-input" id="cpf" placeholder="000.000.000-00">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Sexo</label>
                                    <select class="form-input form-select" id="sexo">
                                        <option value="">Selecione...</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Data de Nascimento</label>
                                    <input type="date" class="form-input" id="data_nascimento">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Profissão</label>
                                    <input type="text" class="form-input" id="profissao">
                                </div>
                            </div>

                            <!-- PJ Fields -->
                            <div id="fields-pj" style="display: none;">
                                <div class="form-group">
                                    <label class="form-label">Razão Social *</label>
                                    <input type="text" class="form-input" id="razao_social">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Nome Fantasia *</label>
                                    <input type="text" class="form-input" id="nome_fantasia">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">CNPJ *</label>
                                    <input type="text" class="form-input" id="cnpj" placeholder="00.000.000/0000-00">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Inscrição Estadual/Municipal</label>
                                    <input type="text" class="form-input" id="inscricao_estadual">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Ramo de Atividade</label>
                                    <input type="text" class="form-input" id="ramo_atividade">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Porte da Empresa</label>
                                    <select class="form-input form-select" id="porte_empresa">
                                        <option value="">Selecione...</option>
                                        <option value="mei">MEI</option>
                                        <option value="me">ME</option>
                                        <option value="epp">EPP</option>
                                        <option value="empresa_medio_porte">Médio Porte</option>
                                        <option value="grande_empresa">Grande Empresa</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Nº de Funcionários</label>
                                    <input type="number" class="form-input" id="num_funcionarios">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Faturamento Anual (R$)</label>
                                    <input type="text" class="form-input" id="faturamento_anual">
                                </div>
                            </div>
                        </div>
                    </details>

                    <!-- Accordion 2: Contato e Endereço -->
                    <details style="margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm);">
                        <summary style="cursor: pointer; font-weight: 600; color: var(--color-primary); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                            2. Dados de Contato e Endereço
                            <span style="font-size: 0.8em;">▼</span>
                        </summary>
                        <div style="padding-top: var(--spacing-md); display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                            <div class="form-group" style="grid-column: span 2;">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" id="email">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Telefone</label>
                                <input type="tel" class="form-input" id="telefone">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Endereço</label>
                                <input type="text" class="form-input" id="endereco">
                            </div>
                        </div>
                    </details>

                    <!-- Accordion 3: Informações Comerciais -->
                    <details style="margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-sm);">
                        <summary style="cursor: pointer; font-weight: 600; color: var(--color-primary); list-style: none; display: flex; justify-content: space-between; align-items: center;">
                            3. Informações Comerciais
                            <span style="font-size: 0.8em;">▼</span>
                        </summary>
                        <div style="padding-top: var(--spacing-md);">
                            <div class="form-group">
                                <label class="form-label">Setor</label>
                                <input type="text" class="form-input" id="setor" placeholder="Ex: Tecnologia, Varejo...">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Status do Cliente</label>
                                <select class="form-input form-select" id="status">
                                    <option value="potencial">Potencial</option>
                                    <option value="em_negociacao">Em Negociação</option>
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-top: var(--spacing-md);">
                                <label class="form-label">Observações</label>
                                <textarea class="form-input" id="observacoes" rows="3"></textarea>
                            </div>
                        </div>
                    </details>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancel-btn">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Adicionar</button>
                </div>
            </form>
        </div>
    </div>
    `;

  setupEventListeners(container);
}

function renderClienteRow(cliente: Cliente): string {
  const entidade = cliente.documento_tipo === 'cnpj' ? 'P. Jurídica' : 'P. Física';
  // const tipo = 'Cliente'; // Default for MVP

  return `
    <tr data-id="${cliente.id}" style="border-bottom: 1px solid var(--color-border);">
        <td style="font-weight: 600; color: var(--color-text);">${cliente.nome}</td>
        <td><span style="background: rgba(59, 130, 246, 0.1); color: var(--color-info); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">Cliente</span></td>
        <td>${entidade}</td>
        <td style="color: var(--color-text-secondary);">${cliente.email || '-'}</td>
        <td style="color: var(--color-text-secondary);">${cliente.telefone || '-'}</td>
        <td>
            <div style="display: flex; gap: var(--spacing-sm);">
                <button class="btn btn-secondary btn-sm edit-btn" data-id="${cliente.id}" title="Editar" style="padding: 6px; background: transparent; border: 1px solid var(--color-border);">${getIcon('edit', 'w-4 h-4')}</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${cliente.id}" title="Excluir" style="padding: 6px; background: transparent; border: 1px solid var(--color-danger); color: var(--color-danger);">${getIcon('trash', 'w-4 h-4')}</button>
            </div>
        </td>
    </tr>
    `;
}

function setupEventListeners(container: HTMLElement) {
  const modal = document.getElementById('cliente-modal') as HTMLElement;
  const form = document.getElementById('cliente-form') as HTMLFormElement;
  const newCadastroSelect = document.getElementById('new-cadastro-select') as HTMLSelectElement;

  // 1. Open Modal on Selection
  newCadastroSelect?.addEventListener('change', () => {
    if (newCadastroSelect.value) {
      resetForm();
      // Default to PF
      const tipoPessoaSelect = document.getElementById('tipo-pessoa') as HTMLSelectElement;
      tipoPessoaSelect.value = 'pf';
      tipoPessoaSelect.dispatchEvent(new Event('change'));

      modal.classList.add('active');
      newCadastroSelect.value = ''; // Reset for next use
    }
  });

  // 2. Toggle PF / PJ
  const tipoPessoaSelect = document.getElementById('tipo-pessoa') as HTMLSelectElement;
  const fieldsPF = document.getElementById('fields-pf') as HTMLElement;
  const fieldsPJ = document.getElementById('fields-pj') as HTMLElement;
  const labelDados = document.getElementById('label-dados-basicos') as HTMLElement;

  tipoPessoaSelect?.addEventListener('change', () => {
    const isPF = tipoPessoaSelect.value === 'pf';

    if (isPF) {
      fieldsPF.style.display = 'block';
      fieldsPJ.style.display = 'none';
      labelDados.textContent = '1. Dados Pessoais';
      setRequired('nome_pf', true);
      setRequired('cpf', true);
      setRequired('razao_social', false);
      setRequired('nome_fantasia', false);
      setRequired('cnpj', false);
    } else {
      fieldsPF.style.display = 'none';
      fieldsPJ.style.display = 'block';
      labelDados.textContent = '1. Dados Básicos da Empresa';
      setRequired('nome_pf', false);
      setRequired('cpf', false);
      setRequired('razao_social', true);
      setRequired('nome_fantasia', true);
      setRequired('cnpj', true);
    }
  });

  function setRequired(id: string, required: boolean) {
    const el = document.getElementById(id);
    if (el) {
      if (required) el.setAttribute('required', 'true');
      else el.removeAttribute('required');
    }
  }

  // Close logic
  document.getElementById('close-modal')?.addEventListener('click', () => modal.classList.remove('active'));
  document.getElementById('cancel-btn')?.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Edit Logic
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const cliente = clientesList.find(c => c.id === id);

      if (cliente) {
        resetForm();
        (document.getElementById('cliente-id') as HTMLInputElement).value = cliente.id;
        (document.getElementById('modal-title') as HTMLElement).textContent = 'Editar Cadastro';

        // Determine Type
        const isPJ = cliente.documento_tipo === 'cnpj';
        const tipoSelect = document.getElementById('tipo-pessoa') as HTMLSelectElement;
        tipoSelect.value = isPJ ? 'pj' : 'pf';
        tipoSelect.dispatchEvent(new Event('change'));

        // Populate Fields
        if (isPJ) {
          (document.getElementById('nome_fantasia') as HTMLInputElement).value = cliente.nome;
          (document.getElementById('cnpj') as HTMLInputElement).value = cliente.documento;
          // Try to parse extras from observacoes or specific fields
          (document.getElementById('inscricao_estadual') as HTMLInputElement).value = cliente.inscricao_estadual || '';
          (document.getElementById('razao_social') as HTMLInputElement).value = cliente.razao_social || '';
          // ... other fields
        } else {
          (document.getElementById('nome_pf') as HTMLInputElement).value = cliente.nome;
          (document.getElementById('cpf') as HTMLInputElement).value = cliente.documento;
        }

        // Common
        (document.getElementById('email') as HTMLInputElement).value = cliente.email || '';
        (document.getElementById('telefone') as HTMLInputElement).value = cliente.telefone || '';
        (document.getElementById('endereco') as HTMLInputElement).value = cliente.endereco || '';
        (document.getElementById('setor') as HTMLInputElement).value = cliente.setor || '';
        (document.getElementById('status') as HTMLSelectElement).value = cliente.status || 'potencial';
        (document.getElementById('observacoes') as HTMLTextAreaElement).value = cliente.observacoes || '';

        modal.classList.add('active');
      }
    });
  });

  // Delete Logic
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).dataset.id!;
      if (confirm('Tem certeza que deseja excluir este cadastro?')) {
        try {
          await clientes.delete(id);
          showToast('Cadastro excluído com sucesso', 'success');
          renderClientes(container);
        } catch (error: any) {
          showToast(error.message || 'Erro ao excluir', 'error');
        }
      }
    });
  });

  // Submit Logic
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = (document.getElementById('cliente-id') as HTMLInputElement).value;
    const tipoPessoa = (document.getElementById('tipo-pessoa') as HTMLSelectElement).value;
    const isPF = tipoPessoa === 'pf';

    // Base Data
    const baseData: Partial<ClienteCreate> = {
      nome: isPF
        ? (document.getElementById('nome_pf') as HTMLInputElement).value
        : (document.getElementById('nome_fantasia') as HTMLInputElement).value,
      documento: isPF
        ? (document.getElementById('cpf') as HTMLInputElement).value
        : (document.getElementById('cnpj') as HTMLInputElement).value,
      documento_tipo: isPF ? 'cpf' : 'cnpj',
      email: (document.getElementById('email') as HTMLInputElement).value || undefined,
      telefone: (document.getElementById('telefone') as HTMLInputElement).value || undefined,
      endereco: (document.getElementById('endereco') as HTMLInputElement).value || undefined,
      setor: (document.getElementById('setor') as HTMLInputElement).value || undefined,
      status: (document.getElementById('status') as HTMLSelectElement).value as any,
      observacoes: (document.getElementById('observacoes') as HTMLTextAreaElement).value || undefined,
    };

    // Capture Extras
    const extras: any = {};
    if (isPF) {
      extras.sexo = (document.getElementById('sexo') as HTMLSelectElement).value;
      extras.data_nascimento = (document.getElementById('data_nascimento') as HTMLInputElement).value;
      extras.profissao = (document.getElementById('profissao') as HTMLInputElement).value;
    } else {
      extras.razao_social = (document.getElementById('razao_social') as HTMLInputElement).value;
      extras.inscricao_estadual = (document.getElementById('inscricao_estadual') as HTMLInputElement).value;
      extras.ramo_atividade = (document.getElementById('ramo_atividade') as HTMLInputElement).value;
      extras.porte_empresa = (document.getElementById('porte_empresa') as HTMLSelectElement).value;
      extras.num_funcionarios = (document.getElementById('num_funcionarios') as HTMLInputElement).value;
      extras.faturamento_anual = (document.getElementById('faturamento_anual') as HTMLInputElement).value;
    }

    // Clean extras (remove empty)
    Object.keys(extras).forEach(key => !extras[key] && delete extras[key]);

    // Merge extras into baseData for frontend usage (and backend if supported)
    Object.assign(baseData, extras);

    // Append formatted extras to observacoes for backward compatibility
    if (Object.keys(extras).length > 0) {
      const formattedExtras = Object.entries(extras)
        .map(([k, v]) => `${k.replace(/_/g, ' ').toUpperCase()}: ${v}`)
        .join('\n');

      baseData.observacoes = baseData.observacoes
        ? `${baseData.observacoes}\n\n[DADOS ADICIONAIS]\n${formattedExtras}`
        : `[DADOS ADICIONAIS]\n${formattedExtras}`;
    }

    try {
      if (id) {
        await clientes.update(id, baseData);
        showToast('Atualizado com sucesso', 'success');
      } else {
        await clientes.create(baseData as ClienteCreate);
        showToast('Criado com sucesso', 'success');
      }
      modal.classList.remove('active');
      renderClientes(container);
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar', 'error');
    }
  });

  // Helper to reset form
  function resetForm() {
    form.reset();
    document.querySelectorAll('details').forEach(d => d.open = false);
    (document.querySelector('details') as HTMLDetailsElement).open = true; // Open first one
  }
}

// Re-implemented simple table update helper if needed,
// though renderClientes(container) is usually safer to refresh everything.



