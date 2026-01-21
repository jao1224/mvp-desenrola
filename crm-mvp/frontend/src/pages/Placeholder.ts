export async function renderPlaceholder(container: HTMLElement, title: string) {
    container.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <h1>${title}</h1>
        </div>
        <div class="card" style="text-align: center; padding: 4rem 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🚧</div>
          <h2>Funcionalidade em Desenvolvimento</h2>
          <p style="color: var(--color-text-muted);">Estamos trabalhando duro para trazer esta funcionalidade para você em breve.</p>
        </div>
      </div>
    `;
}
