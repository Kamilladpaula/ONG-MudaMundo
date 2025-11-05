// ==============================================================
// =================== INICIALIZAÇÃO PRINCIPAL ==================
// ==============================================================

// Importa funções dos seus novos módulos
import { aplicarMascaras } from './formValidation.js';
import { fazerLogin, inicializarPainel } from './router.js';
import {
  inicializarFormularioDoacao,
  gerarGraficoUsoRecursos,
  inicializarFiltrosProjetos,
  inicializarFiltrosBlog
} from './components.js';

/**
 * Ponto de entrada da aplicação.
 * Este evento espera o HTML estar 100% carregado.
 */
document.addEventListener('DOMContentLoaded', () => {

  // --- LÓGICA PARA PÁGINAS PÚBLICAS (index.html, doacoes.html, etc.) ---
  const url = window.location.pathname;

  // Ativa o menu hambúrguer em todas as páginas públicas
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Aplica máscaras nos formulários públicos (cadastro, contato, doação)
  if (url.includes('cadastro') || url.includes('contato') || url.includes('doacao')) {
    aplicarMascaras(); // Importada de formValidation.js
  }

  // Lógica específica da página de DOACÕES
  if (url.includes('doacoes.html')) {
    inicializarFormularioDoacao(); // Importada de components.js
  }

  // Lógica específica da página de TRANSPARÊNCIA
  if (url.includes('transparencia.html')) {
    gerarGraficoUsoRecursos(); // Importada de components.js
  }

  // Lógica específica da página de PROJETOS
  if (url.includes('projetos.html')) {
    inicializarFiltrosProjetos(); // Importada de components.js
  }

  // Lógica específica da página do BLOG
  if (url.includes('blog.html')) {
    inicializarFiltrosBlog(); // Importada de components.js
  }

  // ===== PÁGINA SOBRE - TIMELINE INTERATIVA =====
  if (document.querySelector('.timeline')) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineContent = document.getElementById('timeline-content');
  
    const detalhesTimeline = {
      '2022': 'Em 2022, nasceu a Muda Mundo com a missão de reconectar pessoas à natureza. Nosso primeiro projeto de reflorestamento plantou mais de 1.000 mudas nativas.',
      '2023': 'Expandimos para educação ambiental, levando oficinas para 15 escolas públicas e capacitando mais de 500 crianças sobre sustentabilidade.',
      '2024': 'Inauguramos o centro de resgate de animais silvestres e apoiamos 10 comunidades tradicionais com práticas sustentáveis.',
      '2025': 'Firmamos parcerias estratégicas e lançamos programas inovadores de economia circular, alcançando mais de 5.000 pessoas diretamente.'
    };
  
    if (timelineItems.length > 0 && timelineContent) {
      timelineItems.forEach(item => {
        item.addEventListener('click', function() {
          // Remove active de todos
          timelineItems.forEach(i => i.classList.remove('active'));
          
          // Adiciona active no clicado
          this.classList.add('active');
          
          // Atualiza conteúdo
          const ano = this.querySelector('h3').textContent;
          timelineContent.innerHTML = `<h3>${ano}</h3><p>${detalhesTimeline[ano]}</p>`;
        });
      });
  
      // Ativa o primeiro item por padrão
      timelineItems[0].click();
    }
  }

  // --- LÓGICA PARA PÁGINA DE CADASTRO (cadastro.html) ---
  const formCadastro = document.querySelector('.form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', e => {
      e.preventDefault();
      const senha = document.getElementById('senha').value.trim();
      const confirmarSenha = document.getElementById('confirmar-senha').value.trim();

      if (senha !== confirmarSenha) return alert('As senhas não coincidem!');
      if (senha.length < 8) return alert('A senha deve ter no mínimo 8 caracteres!');

      // (Simulação de cadastro)
      const dadosCadastro = {
        nome: document.getElementById('nome-completo').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        cpf: document.getElementById('cpf').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        dataNascimento: document.getElementById('data-nascimento').value.trim(),
        cep: document.getElementById('cep').value.trim(),
        endereco: document.getElementById('endereco').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        estado: document.getElementById('estado').value.trim(),
        senha: String(senha),
        perfil: 'voluntario',
        dataCadastro: new Date().toISOString()
      };

      // (Simulação de salvar no localStorage)
      const usuariosSalvos = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [];
      if (usuariosSalvos.some(u => u.email === dadosCadastro.email)) return alert('Este e-mail já está cadastrado!');

      usuariosSalvos.push(dadosCadastro);
      localStorage.setItem('usuariosCadastrados', JSON.stringify(usuariosSalvos));
      
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      window.location.href = 'login.html';
    });
  }

  // --- LÓGICA PARA PÁGINA DE LOGIN (login.html) ---
  const formLogin = document.querySelector('.form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('email-login').value;
      const senha = document.getElementById('senha-login').value;

      try {
        // Usa a função importada do router.js
        const resultado = await fazerLogin(email, senha);
        
        if (resultado.sucesso) {
          // Salva o usuário na sessão
          sessionStorage.setItem('usuarioLogado', JSON.stringify({ 
            nome: resultado.nome, 
            perfil: resultado.perfil, 
            email: resultado.email 
          }));
          // Redireciona para o painel
          window.location.href = 'painel.html';
        } else {
          alert(resultado.mensagem);
        }
      } catch (erro) {
        console.error('Erro no login:', erro);
        alert('Erro ao fazer login. Tente novamente.');
      }
    });
  }

  // --- LÓGICA PARA PÁGINAS PRIVADAS (painel.html) ---
  // Verifica se estamos no corpo do painel
  if (document.querySelector('.painel-body')) {
    // Verifica se o usuário está logado
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado) {
      // Se não estiver logado, chuta para a página de login
      alert('Você precisa fazer login para acessar esta página!');
      window.location.href = 'login.html';
      return; // Para a execução do script
    }
    
    // Se estiver logado, inicia a SPA
    // Esta é a função que inicia todo o painel (SPA)
    // Importada do router.js
    inicializarPainel(usuarioLogado);
  }
});