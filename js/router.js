// ==============================================================
// =================== ROTEADOR DA SPA ==========================
// ==============================================================

// Importa os dados que o roteador precisa
import { usuarios, mapaComponentes, mapaDashboardPadrao, formatarPerfil } from './data.js';
// Importa as funções de validação que o login precisa
import { validarEmail } from './formValidation.js';
// Importa TODAS as funções de inicialização de componentes
// 'components' será um objeto com todas as funções exportadas (ex: components.inicializarDashboard)
import * as components from './components.js';

// --- FUNÇÕES DE AUTENTICAÇÃO ---

/**
 * Simula o processo de login.
 * Exportada para ser usada pelo app.js na página de login.
 */
export async function fazerLogin(email, senha) {
  return new Promise((resolve) => {
    email = email.toLowerCase().trim();

    // 'usuarios' é importado do data.js
    if (usuarios[email]) {
      if (usuarios[email].senha === senha) {
        resolve({
          sucesso: true,
          perfil: usuarios[email].perfil,
          nome: usuarios[email].nome,
          email: email
        });
      } else {
        resolve({ sucesso: false, mensagem: 'Senha incorreta!' });
      }
      return;
    }
    
    // 'validarEmail' é importado do formValidation.js
    if (validarEmail(email)) {
      if (senha === '12345678') { // Senha padrão para voluntários (simulação)
        resolve({
          sucesso: true,
          perfil: 'voluntario',
          nome: email.split('@')[0], // Simula um nome
          email: email
        });
      } else {
        resolve({ sucesso: false, mensagem: 'Senha incorreta!' });
      }
      return;
    }
    resolve({ sucesso: false, mensagem: 'Email inválido ou não cadastrado!' });
  });
}

// --- FUNÇÕES DO PAINEL (SPA) ---

/**
 * Esta é a função principal que inicia o painel (SPA).
 * Exportada para ser usada pelo app.js.
 */
export function inicializarPainel(usuario) {
  const mainHeader = document.querySelector('.mains-header');
  if (mainHeader) {
    // 'formatarPerfil' é importado do data.js
    mainHeader.innerHTML = `<h1>Bem-vindo(a), ${usuario.nome}!</h1><p>Seu perfil: <strong>${formatarPerfil(usuario.perfil)}</strong></p>`;
  }
  
  configurarMenuPerfil(usuario.perfil);
  
  // 'mapaDashboardPadrao' é importado
  const secaoInicial = mapaDashboardPadrao[usuario.perfil] || 'dashboard';
  carregarComponente(usuario.perfil, secaoInicial);
  
  adicionarEventListenersPainel(usuario);
}

// --- Funções Internas do Roteador (não exportadas) ---

/**
 * Adiciona os eventos principais do painel (menu, logout, navegação).
 * É uma função local, chamada apenas por 'inicializarPainel'.
 */
function adicionarEventListenersPainel(usuario) {
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
  }

  const btnSair = document.querySelector('.sidebar-footer a');
  if (btnSair) {
    btnSair.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Deseja realmente sair?')) {
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = '../index.html'; // Volta para a página pública
      }
    });
  }

  // Este é o principal navegador da SPA
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Impede o recarregamento da página
      document.querySelectorAll('.sidebar-nav li').forEach(l => l.classList.remove('active'));
      this.parentElement.classList.add('active');
      // Chama o carregador de componente com o texto do link
      carregarComponentePorSecao(usuario.perfil, this.textContent.trim());
    });
  });
}

/**
 * Mostra/oculta itens do menu lateral com base no perfil.
 * É uma função local, chamada apenas por 'inicializarPainel'.
 */
function configurarMenuPerfil(perfil) {
  const permissoes = {
    'diretor': ['Dashboard', 'Dashboard de Projetos', 'Dashboard Financeiro', 'Prestação de Contas', 'Relatórios', 'Usuário'],
    'gerente-financeiro': ['Dashboard Financeiro', 'Gestão Financeira', 'Prestar Contas', 'Relatórios', 'Usuário'],
    'gerente-projetos': ['Dashboard de Projetos', 'Detalhes de Projeto', 'Gerenciar Voluntários', 'Financeiro', 'Usuário'],
    'gerente-comunicacao': ['Dashboard de Comunicação', 'Gestão de Conteúdo', 'Supervisão de Mídia', 'Usuário'],
    'equipe-financeira': ['Gestão Financeira', 'Transação', 'Prestar Contas', 'Relatórios', 'Usuário'],
    'equipe-projetos': ['Meu Dashboard', 'Criar Projeto', 'Editar Projeto', 'Gerenciar Voluntários', 'Financeiro', 'Usuário'],
    'equipe-comunicacao': ['Gestão de Conteúdo', 'Criar Campanha', 'Criar Post', 'Upload de Mídia', 'Usuário'],
    'ti': ['Configurações', 'Gerenciar Usuários', 'Usuário'],
    'voluntario': ['Minha Área', 'Oportunidades', 'Usuário']
  };
  
  const navItems = document.querySelectorAll('.sidebar-nav li');
  const permissoesUsuario = permissoes[perfil] || [];

  navItems.forEach(item => {
    // Remove emojis e espaços para fazer a verificação
    const linkText = item.querySelector('a').textContent.trim().replace(/📊|🗂️|📂|✏️|💰|🧾|🗃️|📚|🎨|👥|📑|⚙️|🏠|✨|👤|🔁|📤/g, '').trim();
    item.style.display = permissoesUsuario.includes(linkText) ? 'block' : 'none';
  });
}

/**
 * Mapeia o texto do item de menu para uma chave de componente (ex: 'profile').
 * É uma função local, chamada apenas por 'carregarComponentePorSecao'.
 */
function mapearSecao(textoSecao) {
  const mapa = {
    '✏️ Editar Projeto': 'form-editar',
    '✨ Oportunidades': 'oportunidades',
    '⚙️ Configurações': 'config',
    '🎨 Supervisão de Mídia': 'midia',
    '📤 Upload de Mídia': 'upload-midia',
    '🏠 Minha Área': 'minha-area',
    '👤 Usuário': 'profile',
    '👥 Gerenciar Voluntários': 'projetos-voluntarios',
    '👥 Gerenciar Usuários': 'usuarios',
    '💰 Gestão Financeira': 'financeiro-gestao',
    '📂 Criar Campanha': 'form-campanha',
    '📂 Criar Post': 'form-post',
    '📂 Criar Projeto': 'form-criar',
    '📊 Dashboard de Comunicação': 'comunicacao-dashboard',
    '📊 Dashboard de Projetos': 'projeto-dashboard',
    '📊 Dashboard Financeiro': 'financeiro-dashboard',
    '📊 Dashboard': 'dashboard',
    '📊 Meu Dashboard': 'projetos-dashboard',
    '📑 Relatórios': 'relatorio', // Ajustado para ser 'relatorio' genérico
    '📚 Gestão de Conteúdo': 'comunicacao-conteudo',
    '🗂️ Detalhes de Projeto': 'projeto-detalhes',
    '🗃️ Prestação de Contas': 'prest-contas',
    '🗃️ Prestar Contas': 'financeiro-contas',
    '🔁 Transação': 'form-transacao',
    '🧾 Financeiro': 'projetos-financeiro'
  };
  
  // Tratamento especial para "Relatórios" que tem duas entradas
  if (textoSecao === '📑 Relatórios') {
      return 'relatorio'; // ou uma lógica mais específica se necessário
  }

  return mapa[textoSecao] || 'dashboard'; // 'dashboard' como fallback
}

/**
 * Função auxiliar para traduzir o clique do menu em uma seção.
 * É uma função local.
 */
function carregarComponentePorSecao(perfil, textoSecao) {
  const secao = mapearSecao(textoSecao);
  carregarComponente(perfil, secao);
}

/**
 * O coração do roteador: carrega o HTML, aplica o template e chama os inicializadores.
 * É uma função local.
 */
async function carregarComponente(perfil, secao) {
  const conteudoWrapper = document.querySelector('.conteudo-wrapper');
  if (!conteudoWrapper) return;

  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuarioLogado) {
    alert('Sessão expirada. Faça login novamente.');
    window.location.href = 'login.html';
    return;
  }

  // 'mapaComponentes' é importado do data.js
  const caminhoComponente = mapaComponentes[perfil]?.[secao];

  if (!caminhoComponente) {
    console.error(`Componente não encontrado para perfil '${perfil}' e seção '${secao}'`);
    conteudoWrapper.innerHTML = `<div class="main-header"><h1>Seção Indisponível</h1><p>Esta funcionalidade não está disponível para o seu perfil.</p></div>`;
    return;
  }

  // Feedback visual de carregamento
  conteudoWrapper.innerHTML = `<div style="text-align: center; padding: 60px 20px;"><p>Carregando...</p></div>`;

  try {
    // 1. Busca o arquivo .html
    const response = await fetch(caminhoComponente);
    if (!response.ok) throw new Error(`Componente não encontrado: ${response.statusText}`);
    
    // 2. Pega o HTML como TEXTO puro
    let htmlTemplate = await response.text();

    // 3. Aplica a lógica do Template {{...}}
    htmlTemplate = htmlTemplate.replace(/{{usuario_nome}}/g, usuarioLogado.nome);
    htmlTemplate = htmlTemplate.replace(/{{usuario_email}}/g, usuarioLogado.email);
    htmlTemplate = htmlTemplate.replace(/{{usuario_perfil}}/g, formatarPerfil(usuarioLogado.perfil));

    // 4. Injeta o HTML já processado (com os dados)
    conteudoWrapper.innerHTML = htmlTemplate;

    // 5. Chama os inicializadores do components.js
    // requestAnimationFrame garante que o DOM foi atualizado antes de rodar os scripts
    requestAnimationFrame(() => {
      
      // Chama a função genérica primeiro (para abas, formulários genéricos, etc)
      if (components.inicializarEventosComponente) {
        components.inicializarEventosComponente();
      }
      
      // Chama as funções específicas baseadas no que está no HTML carregado
      // Usamos seletores para garantir que a função só rode se o componente existir
      if (conteudoWrapper.querySelector('#graficoImpacto')) {
        components.inicializarDashboard();
      }
      if (conteudoWrapper.querySelector('#user-profile-component')) {
        components.inicializarUserProfile();
      }
      if (conteudoWrapper.querySelector('#form-filtros-voluntarios')) {
        components.inicializarFiltrosVoluntarios();
      }
      if (conteudoWrapper.querySelector('#filtro-status-midia')) {
        components.inicializarFiltrosMidia();
      }
      if (conteudoWrapper.querySelector('#form-filtros-oportunidades')) {
        components.inicializarFiltrosOportunidades();
      }
      
      // (Adicione outros 'if' para outros componentes específicos aqui)
      
    });
  } catch (error) {
    console.error('Erro ao carregar componente:', error);
    conteudoWrapper.innerHTML = `<div class="main-header"><h1>Erro ao Carregar</h1><p>Não foi possível carregar esta seção. Tente novamente.</p></div>`;
  }
}