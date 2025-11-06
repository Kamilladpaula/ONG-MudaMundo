// ============================================================
// ACESSIBILIDADE – MÓDULO WCAG 2.1 AA
// ============================================================

/**
 * Aplica foco visível ao navegar por teclado (Tab)
 */
function aplicarFocoVisivel() {
  const style = document.createElement('style');
  style.textContent = `
    :focus {
      outline: 3px solid #0e9401 !important;
      outline-offset: 3px !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Configura o skip link (Pular para o conteúdo principal)
 */
function configurarSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  const main = document.querySelector('#conteudo-principal');

  if (skipLink && main) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      main.setAttribute('tabindex', '-1');
      main.focus();
    });
  }
}

/**
 * Controla submenus e navegação por teclado
 */
function configurarNavegacaoTeclado() {
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;

    // Abre ou fecha submenu com Enter ou Espaço
    if ((e.key === 'Enter' || e.key === ' ') && active.classList.contains('tem-submenu')) {
      e.preventDefault();
      const expanded = active.getAttribute('aria-expanded') === 'true';
      active.setAttribute('aria-expanded', !expanded);
      const submenu = active.nextElementSibling;
      if (submenu) submenu.hidden = expanded;
    }

    // Fecha todos os submenus com Esc
    if (e.key === 'Escape') {
      document.querySelectorAll('.tem-submenu').forEach(link => {
        link.setAttribute('aria-expanded', 'false');
        if (link.nextElementSibling) link.nextElementSibling.hidden = true;
      });
    }
  });
}

/**
 * Função principal que inicializa todos os recursos de acessibilidade
 */
export function inicializarAcessibilidade() {
  aplicarFocoVisivel();
  configurarSkipLink();
  configurarNavegacaoTeclado();
  console.log('✅ Acessibilidade (WCAG 2.1 AA) inicializada');
}
