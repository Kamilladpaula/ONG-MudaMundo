// ==============================================================
// =================== DADOS E CONSTANTES =======================
// ==============================================================

// Usuários internos do sistema (fins de prototipagem).
export const usuarios = {
  'diretor@mudamundo.org': {
    senha: '12345678',
    perfil: 'diretor',
    nome: 'Joana Silva'
  },
  'gerente.fin@mudamundo.org': {
    senha: '12345678',
    perfil: 'gerente-financeiro',
    nome: 'Maria Santos'

  },
  'gerente.proj@mudamundo.org': {
    senha: '12345678',
    perfil: 'gerente-projetos',
    nome: 'Carlos Souza'

  },
  'gerente.com@mudamundo.org': {
    senha: '12345678',
    perfil: 'gerente-comunicacao',
    nome: 'Ana Costa'

  },
  'equipe.fin@mudamundo.org': {
    senha: '12345678',
    perfil: 'equipe-financeira',
    nome: 'Pedro Alves'

  },
  'equipe.proj@mudamundo.org': {
    senha: '12345678',
    perfil: 'equipe-projetos',
    nome: 'Julia Lima'

  },
  'equipe.com@mudamundo.org': {
    senha: '12345678',
    perfil: 'equipe-comunicacao',
    nome: 'Roberto Dias'

  },
  'ti@mudamundo.org': {
    senha: '12345678',
    perfil: 'ti',
    nome: 'Técnico TI'

  }
};

// Mapeamento de componentes HTML por perfil de usuário.
export const mapaComponentes = {
  'diretor': {
    'dashboard': 'componentes/diretor-dashboard.html',
    'projeto-dashboard': 'componentes/gerente-projeto-dashboard.html',
    'financeiro-dashboard': 'componentes/financeiro-dashboard.html',
    'prest-contas': 'componentes/geral-prestcontas.html',
    'relatorio': 'componentes/diretor-relatorio.html',
    'profile': 'componentes/user-profile.html'
  },
  'gerente-financeiro': {
    'financeiro-dashboard': 'componentes/financeiro-dashboard.html',
    'financeiro-gestao': 'componentes/financeiro-gestao.html',
    'financeiro-contas': 'componentes/financeiro-prestcontas.html',
    'relatorio': 'componentes/equipe-financeira-relatorios.html',
    'profile': 'componentes/user-profile.html'
  },
  'gerente-projetos': {
    'projeto-dashboard': 'componentes/gerente-projeto-dashboard.html',
    'projeto-detalhes': 'componentes/gerente-projeto-detalhes.html',
    'projetos-voluntarios': 'componentes/equipe-projetos-voluntarios.html',
    'projetos-financeiro': 'componentes/equipe-projetos-financeiro.html',
    'profile': 'componentes/user-profile.html'

  },
  'gerente-comunicacao': {
    'comunicacao-dashboard': 'componentes/gerente-comunicacao-dashboard.html',
    'comunicacao-conteudo': 'componentes/gerente-comunicacao-conteudo.html',
    'midia': 'componentes/gerente-comunicacao-midia.html',
    'profile': 'componentes/user-profile.html'

  },
  'equipe-financeira': {
    'financeiro-gestao': 'componentes/financeiro-gestao.html',
    'form-transacao': 'componentes/equipe-financeira-form-transacao.html',
    'relatorio': 'componentes/equipe-financeira-relatorios.html',
    'financeiro-contas': 'componentes/financeiro-prestcontas.html',
    'profile': 'componentes/user-profile.html'

  },
  'equipe-projetos': {
    'projetos-dashboard': 'componentes/equipe-projetos-dashboard.html',
    'form-criar': 'componentes/equipe-projetos-form-criar.html',
    'form-editar': 'componentes/equipe-projetos-form-editar.html',
    'projetos-voluntarios': 'componentes/equipe-projetos-voluntarios.html',
    'projetos-financeiro': 'componentes/equipe-projetos-financeiro.html',
    'profile': 'componentes/user-profile.html'

  },
  'equipe-comunicacao': {
    'comunicacao-conteudo': 'componentes/gerente-comunicacao-conteudo.html',
    'form-campanha': 'componentes/equipe-comunicacao-form-campanha.html',
    'form-post': 'componentes/equipe-comunicacao-form-post.html',
    'upload-midia': 'componentes/equipe-comunicacao-upload-midia.html',
    'profile': 'componentes/user-profile.html'

  },
  'ti': {
    'config': 'componentes/ti-configuracoes.html',
    'usuarios': 'componentes/ti-gerenciar-usuarios.html',
    'profile': 'componentes/user-profile.html'

  },
  'voluntario': {
    'minha-area': 'componentes/voluntario-minha-area.html',
    'oportunidades': 'componentes/voluntario-oportunidades.html',
    'profile': 'componentes/user-profile.html'

  }
};

// Mapeamento explícito do dashboard padrão para cada perfil.
export const mapaDashboardPadrao = {
  'diretor': 'dashboard',
  'gerente-financeiro': 'financeiro-dashboard',
  'gerente-projetos': 'projeto-dashboard',
  'gerente-comunicacao': 'comunicacao-dashboard',
  'equipe-projetos': 'projetos-dashboard',
  'equipe-financeira': 'financeiro-gestao',
  'equipe-comunicacao': 'comunicacao-conteudo',
  'ti': 'config',
  'voluntario': 'minha-area'
  // Perfis sem um dashboard aqui podem ter um fallback.
};

// Dados simulados para os gráficos.
export const dadosFinanceiros = [
  { mes: 0, receita: 8000, despesas: 4200, doacoes: 500 },
  { mes: 1, receita: 8500, despesas: 4600, doacoes: 600 },
  { mes: 2, receita: 9000, despesas: 4900, doacoes: 750 },
  { mes: 3, receita: 9200, despesas: 5100, doacoes: 1000 },
  { mes: 4, receita: 9400, despesas: 5300, doacoes: 1200 },
  { mes: 5, receita: 10000, despesas: 6000, doacoes: 1500 },
  { mes: 6, receita: 11000, despesas: 6500, doacoes: 1700 },
  { mes: 7, receita: 11500, despesas: 6700, doacoes: 1900 },
  { mes: 8, receita: 12000, despesas: 7000, doacoes: 2200 },
  { mes: 9, receita: 12500, despesas: 7300, doacoes: 2500 },
  { mes: 10, receita: 13000, despesas: 7500, doacoes: 2700 },
  { mes: 11, receita: 13500, despesas: 7700, doacoes: 3000 }
];
export const nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
let grafico; // Instância global do gráfico para ser destruída e recriada.


// Dados dos projetos para a página de filtros
export const dadosProjetos = [
  { id: 'reflorestamento', nome: 'Reflorestamento Comunitário', categoria: 'educacao', status: 'ativo', url: 'projetos/reflorestamento.html' },
  { id: 'eduambiental', nome: 'Educação Ambiental', categoria: 'educacao', status: 'concluido', url: 'projetos/eduambiental.html' },
  { id: 'vida-selvagem', nome: 'Vida Selvagem', categoria: 'protecao-vida', status: 'ativo', url: 'projetos/vida-selvagem.html' },
  { id: 'resgates', nome: 'Resgates de animais em enchentes', categoria: 'Resgates', status: 'ativo', url: 'projetos/resgates.html' }
];

// Converte o ID do perfil em um nome legível.
export function formatarPerfil(perfil) {
  const perfis = {
    'diretor': 'Diretor',
    'gerente-financeiro': 'Gerente Financeiro',
    'gerente-projetos': 'Gerente de Projetos',
    'gerente-comunicacao': 'Gerente de Comunicação',
    'equipe-financeira': 'Equipe Financeira',
    'equipe-projetos': 'Equipe de Projetos',
    'equipe-comunicacao': 'Equipe de Comunicação',
    'ti': 'TI',
    'voluntario': 'Voluntário'
  };
  return perfis[perfil] || perfil;
}