// ============================================================
// ACESSIBILIDADE – WCAG 2.1 AA (controle por botão + sistema)
// ============================================================

let habilitado = false;
let estiloFocoEl = null;
let keydownHandler = null;
let skipHandler = null;
let usuarioEscolheu = false; // quando o usuário clica no botão, não auto-altera mais pelo sistema

// ---- util ----
function setBtnState(on) {
  const btn = document.querySelector('#a11y-toggle');
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(on));
  btn.setAttribute('aria-label', on ? 'Desativar recursos de acessibilidade' : 'Ativar recursos de acessibilidade');
}

// ---- foco visível (injeta/remover style) ----
function aplicarFocoVisivel() {
  if (estiloFocoEl) return;
  estiloFocoEl = document.createElement('style');
  estiloFocoEl.dataset.a11y = 'foco';
  estiloFocoEl.textContent = `
    :focus { outline: 3px solid #0e9401 !important; outline-offset: 3px !important; }
  `;
  document.head.appendChild(estiloFocoEl);
}
function removerFocoVisivel() {
  estiloFocoEl?.remove();
  estiloFocoEl = null;
}

// ---- skip link ----
function ligarSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  const main = document.querySelector('#conteudo-principal');
  if (!skipLink || !main) return;
  skipHandler = (e) => {
    e.preventDefault();
    main.setAttribute('tabindex', '-1');
    main.focus();
  };
  skipLink.addEventListener('click', skipHandler);
}
function desligarSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink && skipHandler) {
    skipLink.removeEventListener('click', skipHandler);
  }
  skipHandler = null;
}

// ---- navegação por teclado nos submenus ----
function ligarTeclado() {
  keydownHandler = (e) => {
    const active = document.activeElement;
    if ((e.key === 'Enter' || e.key === ' ') && active?.classList?.contains('tem-submenu')) {
      e.preventDefault();
      const expanded = active.getAttribute('aria-expanded') === 'true';
      active.setAttribute('aria-expanded', String(!expanded));
      const submenu = active.nextElementSibling;
      if (submenu) submenu.hidden = expanded;
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.tem-submenu').forEach(link => {
        link.setAttribute('aria-expanded', 'false');
        link.nextElementSibling && (link.nextElementSibling.hidden = true);
      });
    }
  };
  document.addEventListener('keydown', keydownHandler);
}
function desligarTeclado() {
  if (keydownHandler) document.removeEventListener('keydown', keydownHandler);
  keydownHandler = null;
}

// ---- liga/desliga principais ----
export function habilitarAcessibilidade() {
  if (habilitado) return;
  habilitado = true;
  aplicarFocoVisivel();
  ligarSkipLink();
  ligarTeclado();
  document.body.classList.add('a11y-on');
  localStorage.setItem('a11y', 'on');
  setBtnState(true);
  console.log('♿ acessibilidade ON');
}

export function desabilitarAcessibilidade() {
  if (!habilitado) return;
  habilitado = false;
  removerFocoVisivel();
  desligarSkipLink();
  desligarTeclado();
  document.body.classList.remove('a11y-on');
  localStorage.setItem('a11y', 'off');
  setBtnState(false);
  console.log('♿ acessibilidade OFF');
}

export function alternarAcessibilidade() {
  usuarioEscolheu = true;
  habilitado ? desabilitarAcessibilidade() : habilitarAcessibilidade();
}

// ---- integração com preferências do sistema/navegador ----
// habilita automaticamente se o sistema indicar contraste/cores forçadas.
// reduz movimentos via CSS (abaixo, seção 4).
const mqContraste = window.matchMedia?.('(prefers-contrast: more)');
const mqForced   = window.matchMedia?.('(forced-colors: active)');

function aplicarPreferenciasDoSistema() {
  if (usuarioEscolheu) return; // respeita escolha explícita do usuário
  if ((mqContraste && mqContraste.matches) || (mqForced && mqForced.matches)) {
    habilitarAcessibilidade();
  } else {
    // mantém estado salvo se houver
    const salvo = localStorage.getItem('a11y');
    if (salvo === 'on') habilitarAcessibilidade();
    else desabilitarAcessibilidade();
  }
}

export function inicializarAcessibilidadeControles() {
  // botão
  const btn = document.querySelector('#a11y-toggle');
  if (btn) {
    btn.addEventListener('click', alternarAcessibilidade);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternarAcessibilidade(); }
    });
  }
  // estado inicial: preferência do usuário (localStorage) > sistema
  const salvo = localStorage.getItem('a11y');
  if (salvo === 'on') habilitarAcessibilidade();
  else if (salvo === 'off') desabilitarAcessibilidade();
  else aplicarPreferenciasDoSistema();

  // escuta mudanças do sistema
  mqContraste?.addEventListener('change', aplicarPreferenciasDoSistema);
  mqForced?.addEventListener('change', aplicarPreferenciasDoSistema);
}

// ============================================================
// CONTRASTE ALTO – WCAG 2.1 AA  (critério 1.4.3 / 1.4.6)
// ============================================================

let contrasteAtivo = false;

export function ativarContraste() {
  contrasteAtivo = true;
  document.body.classList.add('high-contrast');
  localStorage.setItem('contraste', 'on');
  atualizarBotaoContraste(true);
  console.log('🌗 modo alto contraste ON');
}

export function desativarContraste() {
  contrasteAtivo = false;
  document.body.classList.remove('high-contrast');
  localStorage.setItem('contraste', 'off');
  atualizarBotaoContraste(false);
  console.log('🌗 modo alto contraste OFF');
}

export function alternarContraste() {
  contrasteAtivo ? desativarContraste() : ativarContraste();
}

function atualizarBotaoContraste(ativo) {
  const btn = document.querySelector('#contrast-toggle');
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(ativo));
  btn.setAttribute('aria-label', ativo ? 'Desativar alto contraste' : 'Ativar alto contraste');
}

// ---- inicialização do contraste ----
export function inicializarContraste() {
  const btn = document.querySelector('#contrast-toggle');
  if (btn) {
    btn.addEventListener('click', alternarContraste);
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternarContraste(); }
    });
  }

  // aplica o estado salvo ou preferência do sistema
  const salvo = localStorage.getItem('contraste');
  if (salvo === 'on') ativarContraste();
  else if (window.matchMedia('(prefers-contrast: more)').matches) ativarContraste();
}
