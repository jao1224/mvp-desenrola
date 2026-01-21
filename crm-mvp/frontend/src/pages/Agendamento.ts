import { agendamentos, clientes } from '../api/client';
import { Agendamento, Cliente } from '../api/types';
import { showToast } from '../utils/helpers';

// Cores fixas padronizadas por tipo de evento
const TYPE_COLORS: Record<string, string> = {
    reuniao: '#6366f1', // Indigo
    call: '#10b981',    // Emerald
    visita: '#f59e0b',  // Amber
    outro: '#94a3b8'    // Slate
};

export async function renderAgendamento(container: HTMLElement) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📅 Agendamento</h1>
            <button class="btn btn-primary" id="new-agendamento-btn">
                <span>➕</span> Novo Compromisso
            </button>
        </div>

        <div class="agendamento-layout" style="display: grid; grid-template-columns: 350px 1fr; gap: var(--spacing-lg); align-items: start;">
            
            <!-- Coluna Esquerda: Calendário -->
            <div class="card" style="padding: var(--spacing-md); position: sticky; top: var(--spacing-md);">
                <div style="margin-bottom: var(--spacing-md);">
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 4px;">Calendário</h3>
                    <p style="font-size: 0.85rem; color: var(--color-text-secondary);">Filtre seus compromissos por data</p>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                    <button class="btn btn-secondary btn-sm" id="prev-month" style="padding: 4px 8px;">◀</button>
                    <span id="calendar-month-year" style="font-weight: 600; font-size: 0.95rem; text-transform: capitalize;"></span>
                    <button class="btn btn-secondary btn-sm" id="next-month" style="padding: 4px 8px;">▶</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; margin-bottom: 8px;">
                    ${['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map(dia => `
                        <div style="font-size: 0.7rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase;">${dia}</div>
                    `).join('')}
                </div>
                <div id="calendar-days" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;">
                    <!-- Dias inseridos via JS -->
                </div>

                <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-md); border-top: 1px solid var(--color-border);">
                    <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 12px;">Legenda:</p>
                    <div id="calendar-legend" style="display: flex; flex-wrap: wrap; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${TYPE_COLORS.reuniao};"></span> Reunião
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${TYPE_COLORS.call};"></span> Call
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${TYPE_COLORS.visita};"></span> Visita
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 0.7rem;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${TYPE_COLORS.outro};"></span> Outro
                        </div>
                    </div>
                </div>
            </div>

            <!-- Coluna Direita: Lista de Compromissos -->
            <div class="card">
                <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                    <h3 id="list-title" style="font-size: 1.1rem; font-weight: 700;">Próximos Compromissos</h3>
                    <button class="btn btn-secondary btn-sm" id="clear-filter" style="display: none;">Ver Todos</button>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Horário/Data</th>
                                <th>Compromisso</th>
                                <th>Cliente</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="agendamentos-list">
                            <tr><td colspan="5" style="text-align:center; padding: 2rem;">Carregando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal de Agendamento -->
        <div class="modal-overlay" id="agendamento-modal">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title" id="modal-title">Novo Agendamento</h2>
                    <button class="modal-close" id="close-modal">&times;</button>
                </div>
                <form id="agendamento-form">
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Cliente *</label>
                            <select class="form-input" name="cliente_id" required id="cliente-select">
                                <option value="">Selecione um cliente...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input type="text" class="form-input" name="titulo" required placeholder="Ex: Reunião de Alinhamento">
                        </div>
                        <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                            <div class="form-group">
                                <label class="form-label">Data e Hora *</label>
                                <input type="datetime-local" class="form-input" name="data_hora" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Duração (min)</label>
                                <input type="number" class="form-input" name="duracao_minutos" value="60">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Tipo de Compromisso</label>
                            <div id="type-selector" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 8px;">
                                <div class="type-option" data-value="reuniao" style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${TYPE_COLORS.reuniao};"></span>
                                    <span style="font-weight: 500; font-size: 0.9rem;">👥 Reunião</span>
                                </div>
                                <div class="type-option" data-value="call" style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${TYPE_COLORS.call};"></span>
                                    <span style="font-weight: 500; font-size: 0.9rem;">📞 Call</span>
                                </div>
                                <div class="type-option" data-value="visita" style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${TYPE_COLORS.visita};"></span>
                                    <span style="font-weight: 500; font-size: 0.9rem;">🚗 Visita</span>
                                </div>
                                <div class="type-option" data-value="outro" style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 2px solid var(--color-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${TYPE_COLORS.outro};"></span>
                                    <span style="font-weight: 500; font-size: 0.9rem;">📝 Outro</span>
                                </div>
                            </div>
                            <input type="hidden" name="tipo" id="tipo-hidden" value="reuniao">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-input" name="status">
                                <option value="pendente">Pendente</option>
                                <option value="realizado">Realizado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Descrição</label>
                            <textarea class="form-input" name="descricao" rows="3"></textarea>
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

    // DOM Elements
    const listContainer = document.getElementById('agendamentos-list')!;
    const modal = document.getElementById('agendamento-modal')!;
    const form = document.getElementById('agendamento-form') as HTMLFormElement;
    const clienteSelect = document.getElementById('cliente-select') as HTMLSelectElement;
    const calendarDays = document.getElementById('calendar-days')!;
    const calendarLabel = document.getElementById('calendar-month-year')!;
    const listTitle = document.getElementById('list-title')!;
    const clearFilterBtn = document.getElementById('clear-filter')!;
    const typeOptions = document.querySelectorAll('.type-option');
    const tipoHidden = document.getElementById('tipo-hidden') as HTMLInputElement;

    // State
    let calendarViewDate = new Date();
    let selectedDate: Date | null = null;
    let cachedAgendamentos: Agendamento[] = [];
    let currentId: string | null = null;

    // Load Data
    async function loadData() {
        try {
            const [lista, listaClientes] = await Promise.all([
                agendamentos.list(),
                clientes.list()
            ]);

            cachedAgendamentos = lista;
            renderAll();
            renderClienteOptions(listaClientes);
        } catch (error) {
            showToast('Erro ao carregar dados', 'error');
        }
    }

    function renderAll() {
        renderCalendar();
        renderList();
    }

    function renderList() {
        let filtered = [...cachedAgendamentos].sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime());

        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            filtered = filtered.filter(a => a.data_hora.startsWith(dateStr));
            listTitle.innerHTML = `Compromissos - <span style="color: var(--color-primary);">${selectedDate.toLocaleDateString('pt-BR')}</span>`;
            clearFilterBtn.style.display = 'block';
        } else {
            listTitle.textContent = 'Próximos Compromissos';
            clearFilterBtn.style.display = 'none';
            // Only show upcoming ones by default if no date selected
            const now = new Date().toISOString();
            filtered = filtered.filter(a => a.data_hora >= now.split('T')[0]);
        }

        if (filtered.length === 0) {
            const emptyMsg = selectedDate ? 'Nenhum compromisso para esta data.' : 'Nenhum compromisso agendado.';
            listContainer.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2.5rem; color: var(--color-text-muted);">
                <div style="font-size: 1.5rem; margin-bottom: 8px;">📅</div>
                ${emptyMsg}
            </td></tr>`;
            return;
        }

        listContainer.innerHTML = filtered.map(item => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 4px; height: 24px; border-radius: 2px; background: ${TYPE_COLORS[item.tipo] || TYPE_COLORS.outro};"></div>
                        <div>
                            <div style="font-weight: 700; font-size: 1.1rem; color: var(--color-text); line-height: 1.1;">${new Date(item.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary); margin-top: 1px;">${new Date(item.data_hora).toLocaleDateString('pt-BR')}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="font-weight: 500;">${item.titulo}</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-secondary);">${getTipoLabel(item.tipo)}</div>
                </td>
                <td>${item.cliente_nome || 'N/A'}</td>
                <td>
                    <span class="badge ${getStatusClass(item.status)}">${item.status.toUpperCase()}</span>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-btn" data-id="${item.id}">✏️</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">🗑️</button>
                </td>
            </tr>
        `).join('');

        // Event Listeners for actions
        listContainer.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openModal(cachedAgendamentos.find(i => i.id === (btn as HTMLElement).dataset.id)));
        });

        listContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('Deseja excluir este agendamento?')) {
                    try {
                        await agendamentos.delete((btn as HTMLElement).dataset.id!);
                        showToast('Agendamento excluído');
                        loadData();
                    } catch (e) {
                        showToast('Erro ao excluir', 'error');
                    }
                }
            });
        });
    }

    function renderCalendar() {
        const year = calendarViewDate.getFullYear();
        const month = calendarViewDate.getMonth();
        const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

        calendarLabel.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarDays.innerHTML = '';

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            calendarDays.innerHTML += `<div class="calendar-day disabled" style="padding: 10px; text-align: center; color: var(--color-text-muted); opacity: 0.3; font-size: 0.85rem;">${prevMonthLastDay - i}</div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = cachedAgendamentos.filter(a => a.data_hora.startsWith(dateStr));
            const isSelected = selectedDate && selectedDate.toDateString() === dateObj.toDateString();
            const isToday = new Date().toDateString() === dateObj.toDateString();

            const dayEl = document.createElement('div');
            dayEl.className = `calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`;
            dayEl.style.cssText = `
                padding: 10px 5px;
                text-align: center;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 500;
                border-radius: 8px;
                position: relative;
                transition: all 0.2s;
                ${isSelected ? 'background: var(--color-primary); color: white;' : ''}
                ${!isSelected && isToday ? 'color: var(--color-primary); font-weight: 700;' : ''}
                ${!isSelected && !isToday ? 'color: var(--color-text);' : ''}
            `;

            if (!isSelected) {
                dayEl.onmouseover = () => dayEl.style.background = 'var(--color-bg-tertiary)';
                dayEl.onmouseout = () => dayEl.style.background = 'transparent';
            }

            const dots = dayEvents.slice(0, 4).map(e => `
                <div style="width: 5px; height: 5px; background: ${TYPE_COLORS[e.tipo] || TYPE_COLORS.outro}; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2);"></div>
            `).join('');

            dayEl.innerHTML = `
                <div style="position: relative; z-index: 1;">${day}</div>
                <div style="display: flex; gap: 2px; justify-content: center; position: absolute; bottom: 4px; left: 0; right: 0;">
                    ${dots}
                </div>
            `;

            dayEl.addEventListener('click', () => {
                selectedDate = dateObj;
                renderAll();
            });

            calendarDays.appendChild(dayEl);
        }
    }

    function getStatusClass(status: string) {
        switch (status) {
            case 'realizado': return 'badge-success';
            case 'cancelado': return 'badge-danger';
            default: return 'badge-warning';
        }
    }

    function getTipoLabel(tipo: string) {
        const labels: any = { reuniao: 'Reunião', call: 'Call', visita: 'Visita', outro: 'Outro' };
        return labels[tipo] || tipo;
    }

    function renderClienteOptions(lista: Cliente[]) {
        clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>' +
            lista.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
    }

    function selectType(value: string) {
        tipoHidden.value = value;
        typeOptions.forEach(opt => {
            const optEl = opt as HTMLElement;
            if (optEl.dataset.value === value) {
                optEl.style.borderColor = TYPE_COLORS[value];
                optEl.style.background = `${TYPE_COLORS[value]}15`;
            } else {
                optEl.style.borderColor = 'var(--color-border)';
                optEl.style.background = 'transparent';
            }
        });
    }

    function openModal(item?: Agendamento) {
        currentId = item?.id || null;
        document.getElementById('modal-title')!.textContent = item ? 'Editar Agendamento' : 'Novo Agendamento';

        if (item) {
            form.cliente_id.value = item.cliente_id;
            form.titulo.value = item.titulo;
            form.data_hora.value = item.data_hora.substring(0, 16);
            form.duracao_minutos.value = item.duracao_minutos;
            form.status.value = item.status;
            form.descricao.value = item.descricao || '';
            selectType(item.tipo);
        } else {
            form.reset();
            const defaultDate = selectedDate ? new Date(selectedDate) : new Date();
            if (!selectedDate) defaultDate.setMinutes(defaultDate.getMinutes() + 30);
            else defaultDate.setHours(new Date().getHours() + 1, 0, 0, 0);

            form.data_hora.value = new Date(defaultDate.getTime() - (defaultDate.getTimezoneOffset() * 60000)).toISOString().substring(0, 16);
            selectType('reuniao');
        }

        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        currentId = null;
    }

    document.getElementById('prev-month')!.addEventListener('click', () => {
        calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month')!.addEventListener('click', () => {
        calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
        renderCalendar();
    });

    clearFilterBtn.addEventListener('click', () => {
        selectedDate = null;
        renderAll();
    });

    typeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            selectType((opt as HTMLElement).dataset.value!);
        });
    });

    document.getElementById('new-agendamento-btn')!.addEventListener('click', () => openModal());
    document.getElementById('close-modal')!.addEventListener('click', closeModal);
    document.getElementById('cancel-btn')!.addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data: any = {
            cliente_id: formData.get('cliente_id'),
            titulo: formData.get('titulo'),
            data_hora: formData.get('data_hora'),
            duracao_minutos: parseInt(formData.get('duracao_minutos') as string),
            tipo: tipoHidden.value,
            status: formData.get('status'),
            descricao: formData.get('descricao')
        };

        try {
            if (currentId) {
                await agendamentos.update(currentId, data);
                showToast('Agendamento atualizado');
            } else {
                await agendamentos.create(data);
                showToast('Agendamento criado');
            }
            closeModal();
            loadData();
        } catch (error) {
            showToast('Erro ao salvar agendamento', 'error');
        }
    });

    loadData();
}
