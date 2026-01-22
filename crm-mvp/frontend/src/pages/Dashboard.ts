import { financeiro } from '../api/client';
import { getIcon } from '../utils/icons';

export async function renderDashboard(container: HTMLElement) {
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    const stats = await financeiro.dashboard();

    // Dynamic data
    const today = new Date();
    const currentMonth = today.toLocaleString('pt-BR', { month: 'long' });

    // Mock data (removed user name as requested)
    const aniversariantes: Array<{ nome: string; cargo: string; data: string }> = [
      // { nome: 'Cliente Exemplo', cargo: 'Diretor', data: '25/01' }
    ];

    const datasImportantes = [
      { titulo: 'Janeiro Branco e Roxo', desc: 'Saúde mental e hanseníase' },
      { titulo: 'Confraternização Universal', desc: '', data: '01/01' }
    ];

    container.innerHTML = `
      <div class="page-header" style="margin-bottom: var(--spacing-lg);">
        <div>
          <h1 class="page-title" style="margin-bottom: 0.5rem;">Bem-vindo ao CRM</h1>
          <p style="color: var(--color-text-secondary);">Aqui está um resumo das suas atividades.</p>
        </div>
      </div>

      <!-- Activity Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
        
        <!-- Próximos Agendamentos -->
        <div class="card" style="height: 100%;">
          <div class="card-header" style="border: none; padding-bottom: 0;">
            <h2 class="card-title" style="display: flex; align-items: center; gap: var(--spacing-sm);">
              <span style="display: flex; align-items: center; color: var(--color-primary);">${getIcon('calendar', 'w-6 h-6')}</span> Próximos Agendamentos
            </h2>
          </div>
          <div style="padding-top: var(--spacing-sm); color: var(--color-text-muted);">
            <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">Compromissos para hoje e amanhã.</p>
            <div style="text-align: center; color: var(--color-text-muted);">
              Nenhum agendamento para hoje ou amanhã.
            </div>
          </div>
        </div>

        <!-- Aniversariantes -->
        <div class="card" style="height: 100%;">
          <div class="card-header" style="border: none; padding-bottom: 0;">
            <h2 class="card-title" style="display: flex; align-items: center; gap: var(--spacing-sm);">
              <span style="display: flex; align-items: center; color: var(--color-warning);">${getIcon('party', 'w-6 h-6')}</span> Aniversariantes de ${currentMonth}
            </h2>
          </div>
          <div style="padding-top: var(--spacing-xl);">
            ${aniversariantes.length === 0 ?
        '<p style="text-align: center; color: var(--color-text-muted);">Nenhum aniversariante neste mês.</p>' :
        aniversariantes.map(a => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
                <div>
                  <span style="font-weight: 500;">${a.nome}</span>
                  <span style="color: var(--color-text-muted); font-size: 0.875rem;">(${a.cargo})</span>
                </div>
                <div style="color: var(--color-text-muted);">${a.data}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Lembretes Financeiros -->
        <div class="card" style="height: 100%;">
          <div class="card-header" style="border: none; padding-bottom: 0;">
            <h2 class="card-title" style="display: flex; align-items: center; gap: var(--spacing-sm);">
              <span style="display: flex; align-items: center; color: var(--color-danger);">${getIcon('alert', 'w-6 h-6')}</span> Lembretes Financeiros
            </h2>
          </div>
          <div style="padding-top: var(--spacing-sm);">
             <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-xl);">Contas pendentes vencidas ou com vencimento nos próximos 5 dias.</p>
             <div style="text-align: center; color: var(--color-text-muted);">
              Nenhum lançamento pendente para os próximos dias.
            </div>
          </div>
        </div>

        <!-- Datas do Mês -->
        <div class="card" style="height: 100%;">
          <div class="card-header" style="border: none; padding-bottom: 0;">
            <h2 class="card-title" style="display: flex; align-items: center; gap: var(--spacing-sm);">
              <span style="display: flex; align-items: center; color: var(--color-info);">${getIcon('megaphone', 'w-6 h-6')}</span> Datas de janeiro
            </h2>
          </div>
          <div style="padding-top: var(--spacing-sm);">
             <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">Feriados e campanhas importantes.</p>
             
             ${datasImportantes.map(d => `
                <div style="margin-bottom: var(--spacing-md);">
                  ${d.desc ? `
                    <div style="background: var(--color-bg); padding: var(--spacing-md); border-radius: var(--radius-md); border-left: 4px solid var(--color-info);">
                      <div style="font-weight: 600; color: var(--color-info);">${d.titulo}</div>
                      <div style="font-size: 0.875rem; color: var(--color-text-secondary);">${d.desc}</div>
                    </div>
                  ` : `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                       <span style="font-weight: 500;">${d.titulo}</span>
                       <span style="color: var(--color-text-muted);">${d.data}</span>
                    </div>
                  `}
                </div>
             `).join('')}
          </div>
        </div>

      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        ${renderNewStatCard('Total de Clientes', stats.clientes_ativos + stats.clientes_potenciais, 'Clientes cadastrados no sistema', getIcon('users'))}
        ${renderNewStatCard('Total de Parceiros', 0, 'Parceiros cadastrados no sistema', getIcon('handshake'))}
        ${renderNewStatCard('Colaboradores', 1, 'Membros na sua equipe', getIcon('briefcase'))}
        ${renderNewStatCard('Orçamentos Criados', 2, 'Orçamentos gerados no sistema', getIcon('file-text'))}
        ${renderNewStatCard('Contratos Salvos', stats.contratos_ativos, 'Contratos salvos no sistema', getIcon('file'))}
        ${renderNewStatCard('Total de Projetos', stats.projetos_em_andamento + stats.projetos_concluidos, 'Projetos cadastrados no total', getIcon('rocket'))}
      </div>

    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = '<div class="empty-state">Erro ao carregar dashboard</div>';
  }
}

function renderNewStatCard(title: string, value: number, subtitle: string, iconSvg: string): string {
  return `
    <div class="card" style="display: flex; flex-direction: column; height: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-sm);">
        <span style="font-weight: 600; font-size: 1rem;">${title}</span>
        <span style="color: var(--color-text-muted); display: flex; align-items: center;">${iconSvg}</span>
      </div>
      <div style="font-size: 2.5rem; font-weight: 700; color: var(--color-text); line-height: 1; margin-bottom: var(--spacing-xs);">
        ${value}
      </div>
      <div style="font-size: 0.875rem; color: var(--color-text-muted);">
        ${subtitle}
      </div>
    </div>
  `;
}
