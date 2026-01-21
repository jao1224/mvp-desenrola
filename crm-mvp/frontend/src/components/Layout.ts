import { navigate } from '../utils/helpers';
import { logout, getCurrentUser } from './Auth';

export function renderLayout(container: HTMLElement, activePage: string) {
  const user = getCurrentUser();

  container.innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <div class="sidebar-logo">
          🚀 CRM MVP
        </div>
        <nav class="sidebar-nav">
          <div class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" data-page="dashboard">
            <span class="nav-item-icon">📊</span>
            Dashboard
          </div>
          <div class="nav-item ${activePage === 'clientes' ? 'active' : ''}" data-page="clientes">
            <span class="nav-item-icon">👥</span>
            Clientes e Parceiros
          </div>
          <div class="nav-item ${activePage === 'funil' ? 'active' : ''}" data-page="funil">
            <span class="nav-item-icon">🌪️</span>
            Funil de Negociações
          </div>
          <div class="nav-item ${activePage === 'agendamento' ? 'active' : ''}" data-page="agendamento">
            <span class="nav-item-icon">📅</span>
            Agendamento
          </div>
          <div class="nav-item ${activePage === 'orcamento' ? 'active' : ''}" data-page="orcamento">
            <span class="nav-item-icon">🧾</span>
            Orçamento
          </div>
          <div class="nav-item ${activePage === 'contratos' ? 'active' : ''}" data-page="contratos">
            <span class="nav-item-icon">📋</span>
            Contratos
          </div>
          <div class="nav-item ${activePage === 'projetos' ? 'active' : ''}" data-page="projetos">
            <span class="nav-item-icon">📁</span>
            Projetos
          </div>
          <div class="nav-item ${activePage === 'financeiro' ? 'active' : ''}" data-page="financeiro">
            <span class="nav-item-icon">💰</span>
            Financeiro
          </div>
          <div class="nav-item ${activePage === 'configuracoes' ? 'active' : ''}" data-page="configuracoes">
            <span class="nav-item-icon">⚙️</span>
            Configurações
          </div>
        </nav>
        <div style="margin-top: auto; padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
          <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 600;">
              ${user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div style="font-weight: 500;">${user?.name || 'Usuário'}</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">${user?.role || ''}</div>
            </div>
          </div>
          <button class="btn btn-secondary" style="width: 100%;" id="logout-btn">
            Sair
          </button>
        </div>
      </aside>
      <main class="main-content" id="page-content">
        <div class="loading"><div class="spinner"></div></div>
      </main>
    </div>
  `;

  // Navigation handlers
  document.querySelectorAll('.nav-item[data-page]').forEach((item) => {
    item.addEventListener('click', () => {
      const page = (item as HTMLElement).dataset.page;
      navigate(`/${page}`);
    });
  });

  // Logout handler
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  return document.getElementById('page-content') as HTMLElement;
}
