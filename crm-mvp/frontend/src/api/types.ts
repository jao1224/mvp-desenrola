// Tipos base
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'gestor' | 'colaborador';
    is_active: boolean;
    created_at: string;
}

export interface Setting {
    key: string;
    value: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface SettingUpdate {
    value: string;
    description?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Cliente
export type DocumentType = 'cpf' | 'cnpj';
export type ClientStatus = 'ativo' | 'potencial' | 'em_negociacao' | 'inativo';
export type PipelineStage = 'potencial' | 'contato' | 'demonstracao' | 'orcamento' | 'negociacao' | 'assinatura' | 'fechado' | 'encerrado';

export interface Cliente {
    id: string;
    nome: string;
    documento: string;
    documento_tipo: DocumentType;
    email?: string;
    telefone?: string;
    setor?: string;
    endereco?: string;
    observacoes?: string;
    status?: ClientStatus;
    pipeline_stage?: PipelineStage;
    created_at?: string;
    updated_at?: string;

    // Campos PF
    sexo?: string;
    data_nascimento?: string;
    profissao?: string;

    // Campos PJ
    razao_social?: string;
    nome_fantasia?: string;
    inscricao_estadual?: string;
    ramo_atividade?: string;
    porte_empresa?: string;
    num_funcionarios?: string;
    faturamento_anual?: string;
}

export type ClienteCreate = Omit<Cliente, 'id' | 'created_at' | 'updated_at'>;

export interface Interacao {
    id: string;
    cliente_id: string;
    tipo: string;
    descricao: string;
    created_at: string;
}

// Projeto
export type ProjectStatus = 'planejamento' | 'em_execucao' | 'pausado' | 'concluido' | 'cancelado';

export interface Projeto {
    id: string;
    nome: string;
    descricao?: string;
    status: ProjectStatus;
    cliente_id: string;
    responsavel_id?: string;
    contrato_id?: string;
    prazo_inicio?: string;
    prazo_final?: string;
    created_at: string;
    updated_at?: string;
    cliente_nome?: string;
    responsavel_nome?: string;
}

export interface Entregavel {
    id: string;
    projeto_id: string;
    nome: string;
    descricao?: string;
    prazo?: string;
    concluido: boolean;
    concluido_em?: string;
    created_at: string;
}

// Contrato
export interface Contrato {
    id: string;
    numero: string;
    cliente_id: string;
    data_inicio: string;
    data_termino: string;
    valor: number;
    condicoes?: string;
    observacoes?: string;
    created_at: string;
    updated_at?: string;
    cliente_nome?: string;
    dias_para_vencimento?: number;
}

export interface Documento {
    id: string;
    contrato_id: string;
    nome: string;
    nome_original: string;
    caminho: string;
    tipo_mime?: string;
    tamanho?: number;
    created_at: string;
}

// Financeiro
export type PaymentType = 'recebimento' | 'pagamento';
export type PaymentStatus = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

export interface Pagamento {
    id: string;
    tipo: PaymentType;
    valor: number;
    data_vencimento: string;
    data_pagamento?: string;
    status: PaymentStatus;
    descricao?: string;
    cliente_id?: string;
    projeto_id?: string;
    created_at: string;
    cliente_nome?: string;
}

export interface FluxoCaixaItem {
    mes: string;
    recebimentos: number;
    pagamentos: number;
    saldo: number;
}

export interface FluxoCaixaResponse {
    periodo: string;
    total_recebimentos: number;
    total_pagamentos: number;
    saldo_total: number;
    itens: FluxoCaixaItem[];
}

export interface DashboardStats {
    clientes_ativos: number;
    clientes_potenciais: number;
    projetos_em_andamento: number;
    projetos_concluidos: number;
    contratos_ativos: number;
    contratos_vencendo: number;
    receitas_pendentes: number;
    receitas_recebidas: number;
    despesas_pendentes: number;
    despesas_pagas: number;
}

export interface AtividadeRecente {
    id: string;
    action: string;
    entity_type?: string;
    entity_id?: string;
    details?: string;
    user_name: string;
    created_at: string;
}

// Agendamento
export type AgendamentoStatus = 'pendente' | 'realizado' | 'cancelado';
export type AgendamentoTipo = 'reuniao' | 'call' | 'visita' | 'outro';

export interface Agendamento {
    id: string;
    cliente_id: string;
    cliente_nome?: string;
    titulo: string;
    descricao?: string;
    data_hora: string;
    duracao_minutos: number;
    status: AgendamentoStatus;
    tipo: AgendamentoTipo;
    cor?: string;
    created_at: string;
}

export interface AgendamentoCreate {
    cliente_id: string;
    titulo: string;
    descricao?: string;
    data_hora: string;
    duracao_minutos: number;
    status: AgendamentoStatus;
    tipo: AgendamentoTipo;
    cor?: string;
}

export interface AgendamentoUpdate {
    cliente_id?: string;
    titulo?: string;
    descricao?: string;
    data_hora?: string;
    duracao_minutos?: number;
    status?: AgendamentoStatus;
    tipo?: AgendamentoTipo;
    cor?: string;
}

// Orçamento
export type OrcamentoStatus = 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';

export interface Orcamento {
    id: string;
    cliente_id: string;
    cliente_nome?: string;
    titulo: string;
    descricao?: string;
    configuracao: any; // JSON com módulos, integrações e variáveis
    valor_setup: number;
    valor_mensal: number;
    valor_total: number;
    detalhes_calculo: any;
    status: OrcamentoStatus;
    created_at: string;
    updated_at: string;
}

export interface OrcamentoCreate {
    cliente_id: string;
    titulo: string;
    descricao?: string;
    configuracao: any;
}

export interface OrcamentoUpdate {
    titulo?: string;
    descricao?: string;
    configuracao?: any;
    status?: OrcamentoStatus;
}

export interface PriceCalculationRequest {
    configuracao: any;
}

export interface PriceCalculationResponse {
    valor_setup: number;
    valor_mensal: number;
    valor_total: number;
    detalhes: any;
}
