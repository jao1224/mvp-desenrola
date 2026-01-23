import type {
    User,
    LoginRequest,
    TokenResponse,
    Cliente,
    ClienteCreate,
    Interacao,
    Projeto,
    Entregavel,
    Contrato,
    Pagamento,
    DashboardStats,
    FluxoCaixaResponse,
    AtividadeRecente,
    Agendamento,
    AgendamentoCreate,
    AgendamentoUpdate,
    Setting,
    SettingUpdate,
    Orcamento,
    OrcamentoCreate,
    OrcamentoUpdate,
    PriceCalculationRequest,
    PriceCalculationResponse
} from './types';

const API_BASE = '/api';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        credentials: 'include',
        cache: 'no-store',
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
        throw new ApiError(response.status, error.detail || 'Erro na requisição');
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

// Auth
export const auth = {
    login: (data: LoginRequest) =>
        request<TokenResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

    logout: () =>
        request<void>('/auth/logout', { method: 'POST' }),

    me: () =>
        request<User>('/auth/me'),

    register: (data: { email: string; password: string; name: string }) =>
        request<User>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

    updateProfile: (id: string, data: Partial<{ name: string; email: string; password: string }>) =>
        request<User>(`/auth/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    listUsers: () =>
        request<User[]>('/auth/users'),

    createUser: (data: { email: string; password: string; name: string; role: string }) =>
        request<User>('/auth/users', { method: 'POST', body: JSON.stringify(data) }),

    deleteUser: (id: string) =>
        request<void>(`/auth/users/${id}`, { method: 'DELETE' }),
};

// Clientes
export const clientes = {
    list: (params?: { status?: string; setor?: string; search?: string }) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<Cliente[]>(`/clientes${query}`);
    },

    get: (id: string) =>
        request<Cliente & { interacoes: Interacao[] }>(`/clientes/${id}`),

    create: (data: ClienteCreate) =>
        request<Cliente>('/clientes', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Partial<ClienteCreate>) =>
        request<Cliente>(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
        request<void>(`/clientes/${id}`, { method: 'DELETE' }),

    addInteracao: (clienteId: string, data: { tipo: string; descricao: string }) =>
        request<Interacao>(`/clientes/${clienteId}/interacoes`, { method: 'POST', body: JSON.stringify(data) }),
};

// Projetos
export const projetos = {
    list: (params?: { status?: string; cliente_id?: string }) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<Projeto[]>(`/projetos${query}`);
    },

    get: (id: string) =>
        request<Projeto & { entregaveis: Entregavel[] }>(`/projetos/${id}`),

    create: (data: Partial<Projeto>) =>
        request<Projeto>('/projetos', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Partial<Projeto>) =>
        request<Projeto>(`/projetos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
        request<void>(`/projetos/${id}`, { method: 'DELETE' }),

    addEntregavel: (projetoId: string, data: { nome: string; descricao?: string; prazo?: string }) =>
        request<Entregavel>(`/projetos/${projetoId}/entregaveis`, { method: 'POST', body: JSON.stringify(data) }),

    updateEntregavel: (projetoId: string, entregavelId: string, data: Partial<Entregavel>) =>
        request<Entregavel>(`/projetos/${projetoId}/entregaveis/${entregavelId}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Contratos
export const contratos = {
    list: (params?: { cliente_id?: string }) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<Contrato[]>(`/contratos${query}`);
    },

    alertas: (dias: number = 30) =>
        request<Contrato[]>(`/contratos/alertas?dias=${dias}`),

    get: (id: string) =>
        request<Contrato>(`/contratos/${id}`),

    create: (data: Partial<Contrato>) =>
        request<Contrato>('/contratos', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Partial<Contrato>) =>
        request<Contrato>(`/contratos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
        request<void>(`/contratos/${id}`, { method: 'DELETE' }),

    preview: (data: { orcamento_id: string; cliente_id: string; template_name?: string }) =>
        request<{ html_content: string }>('/contratos/preview', { method: 'POST', body: JSON.stringify(data) }),

    uploadDocument: (contratoId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return request<any>(`/contratos/${contratoId}/documentos`, {
            method: 'POST',
            body: formData as any, // Cast to any to bypass default JSON handling if needed
            headers: {} // Empty headers to let browser set Content-Type: multipart/form-data with boundary
        });
    },

    deleteDocument: (contratoId: string, documentoId: string) =>
        request<void>(`/contratos/${contratoId}/documentos/${documentoId}`, { method: 'DELETE' }),
};

// Financeiro
export const financeiro = {
    list: (params?: { tipo?: string; status?: string; cliente_id?: string }) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<Pagamento[]>(`/financeiro${query}`);
    },

    create: (data: Partial<Pagamento>) =>
        request<Pagamento>('/financeiro', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: Partial<Pagamento>) =>
        request<Pagamento>(`/financeiro/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
        request<void>(`/financeiro/${id}`, { method: 'DELETE' }),

    fluxoCaixa: (meses: number = 6) =>
        request<FluxoCaixaResponse>(`/financeiro/fluxo-caixa?meses=${meses}`),

    dashboard: () =>
        request<DashboardStats>('/financeiro/dashboard'),

    atividades: (limit: number = 10) =>
        request<AtividadeRecente[]>(`/financeiro/atividades?limit=${limit}`),
};

// Agendamentos
export const agendamentos = {
    list: (params?: { cliente_id?: string; status?: string }) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<Agendamento[]>(`/agendamentos${query}`);
    },

    create: (data: AgendamentoCreate) =>
        request<Agendamento>('/agendamentos', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: AgendamentoUpdate) =>
        request<Agendamento>(`/agendamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
        request<void>(`/agendamentos/${id}`, { method: 'DELETE' }),
};

// Orçamentos
export const orcamentos = {
    list: (params?: { cliente_id?: string; status?: string }) => {
        const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
        return request<Orcamento[]>(`/orcamentos${query}`);
    },

    get: (id: string) =>
        request<Orcamento>(`/orcamentos/${id}`),

    create: (data: OrcamentoCreate) =>
        request<Orcamento>('/orcamentos', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, data: OrcamentoUpdate) =>
        request<Orcamento>(`/orcamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
        request<void>(`/orcamentos/${id}`, { method: 'DELETE' }),

    calculate: (data: PriceCalculationRequest) =>
        request<PriceCalculationResponse>('/orcamentos/calculate', { method: 'POST', body: JSON.stringify(data) }),
};

// Configurações
export const settings = {
    list: () =>
        request<Setting[]>('/config/'),

    get: (key: string) =>
        request<Setting>(`/config/${key}`),

    update: (key: string, data: SettingUpdate) =>
        request<Setting>(`/config/${key}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export { ApiError };
