// Utilitários gerais

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
}

export function formatDateTime(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
}

export function formatDocument(doc: string, tipo: 'cpf' | 'cnpj'): string {
    const clean = doc.replace(/\D/g, '');
    if (tipo === 'cpf') {
        return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
        'ativo': 'badge-success',
        'potencial': 'badge-info',
        'em_negociacao': 'badge-warning',
        'inativo': 'badge-neutral',
        'planejamento': 'badge-info',
        'em_execucao': 'badge-warning',
        'pausado': 'badge-neutral',
        'concluido': 'badge-success',
        'cancelado': 'badge-danger',
        'pendente': 'badge-warning',
        'pago': 'badge-success',
        'atrasado': 'badge-danger',
    };
    return map[status] || 'badge-neutral';
}

export function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
        'ativo': 'Ativo',
        'potencial': 'Potencial',
        'em_negociacao': 'Em Negociação',
        'inativo': 'Inativo',
        'planejamento': 'Planejamento',
        'em_execucao': 'Em Execução',
        'pausado': 'Pausado',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado',
        'pendente': 'Pendente',
        'pago': 'Pago',
        'atrasado': 'Atrasado',
        'recebimento': 'Recebimento',
        'pagamento': 'Pagamento',
    };
    return map[status] || status;
}

// Toast notifications
let toastContainer: HTMLElement | null = null;

export function showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Simple router
type RouteHandler = () => void;
const routes: Record<string, RouteHandler> = {};

export function registerRoute(path: string, handler: RouteHandler) {
    routes[path] = handler;
}

export function navigate(path: string) {
    window.history.pushState({}, '', path);
    handleRoute();
}

export function handleRoute() {
    const path = window.location.pathname;
    const handler = routes[path] || routes['/'];
    if (handler) handler();
}

// Initialize router
window.addEventListener('popstate', handleRoute);
