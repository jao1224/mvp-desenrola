import './styles/main.css';
import { registerRoute, handleRoute, navigate } from './utils/helpers';
import { checkAuth, renderLoginPage } from './components/Auth';
import { renderLayout } from './components/Layout';
import { renderDashboard } from './pages/Dashboard';
import { renderClientes } from './pages/Clientes';
import { renderProjetos } from './pages/Projetos';
import { renderContratos } from './pages/Contratos';
import { renderFinanceiro } from './pages/Financeiro';
import { renderFunil } from './pages/Funil';
import { renderAgendamento } from './pages/Agendamento';
import { renderOrcamentos } from './pages/Orcamentos';
import { renderConfiguracoes } from './pages/Configuracoes';


const app = document.getElementById('app')!;

// Rotas protegidas
async function protectedRoute(page: string, renderFn: (container: HTMLElement) => Promise<void>) {
    const isAuth = await checkAuth();
    if (!isAuth) {
        renderLoginPage(app);
        return;
    }
    const content = renderLayout(app, page);
    await renderFn(content);
}

// Registrar rotas
registerRoute('/', async () => {
    const isAuth = await checkAuth();
    if (isAuth) {
        navigate('/dashboard');
    } else {
        renderLoginPage(app);
    }
});

registerRoute('/dashboard', () => protectedRoute('dashboard', renderDashboard));
registerRoute('/clientes', () => protectedRoute('clientes', renderClientes));
registerRoute('/funil', () => protectedRoute('funil', renderFunil));
registerRoute('/agendamento', () => protectedRoute('agendamento', renderAgendamento));
registerRoute('/orcamento', () => protectedRoute('orcamento', renderOrcamentos));
registerRoute('/contratos', () => protectedRoute('contratos', renderContratos));
registerRoute('/projetos', () => protectedRoute('projetos', renderProjetos));
registerRoute('/financeiro', () => protectedRoute('financeiro', renderFinanceiro));
registerRoute('/configuracoes', () => protectedRoute('configuracoes', renderConfiguracoes));

// Iniciar
handleRoute();
