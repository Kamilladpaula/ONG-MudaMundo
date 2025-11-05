# Muda Mundo

Projeto front-end desenvolvido para apresentar a ONG fictícia **Muda Mundo** e prototipar um painel administrativo simples para gestão de projetos, voluntariado e finanças. A aplicação é totalmente estática (HTML, CSS e JavaScript puros) e pode ser aberta diretamente no navegador.

## Visão Geral

- Portal público com páginas dedicadas a apresentação institucional, projetos, blog, transparência financeira, voluntariado e captação de doações.
- Painel administrativo (SPA) que carrega componentes HTML dinamicamente com base no perfil do usuário autenticado.
- Dados simulados e persistência local com `localStorage`/`sessionStorage` para cadastro de voluntários, login e personalização de perfil.
- Integrações client-side com bibliotecas CDN (Chart.js e jsPDF) para geração de gráficos e exportação de relatórios.
- Conteúdos auxiliares na pasta `docs/`, como certificado de participação e relatório anual em PDF.

## Estrutura de Pastas

.
├── index.html             # Landing page principal
├── HTML/                  # Demais páginas públicas e o painel ('painel.html')
│   └── componentes/       # Fragmentos HTML consumidos pela SPA do painel
├── css/                   # Estilos globais
│   └── modulos/           # Módulos reutilizáveis
├── js/                    # Lógica da aplicação (rota do painel, componentes, dados simulados)
├── img/                   # Ícones, logotipos e banners
└── docs/                  # Materiais de apoio em PDF

## Páginas e Fluxos Principais

- `index.html`: destaque das campanhas, pilares de atuação e indicadores rápidos.
- `HTML/sobre.html`: história da ONG com timeline interativa.
- `HTML/projetos.html`: vitrine de projetos com filtros dinâmicos.
- `HTML/voluntariado.html` e `HTML/cadastro.html`: recrutamento de voluntários com máscaras de formulário.
- `HTML/doacoes.html`: seleção de campanhas e meios de pagamento (PIX, boleto, cartão).
- `HTML/blog.html`: listagem de artigos com filtro por categoria.
- `HTML/transparencia.html`: gráfico de distribuição de recursos (Chart.js).
- `HTML/painel.html`: painel restrito com navegação lateral, carregamento dinâmico de componentes e gráficos de impacto.

## Painel Administrativo (SPA)

- Autenticação simulada em `js/router.js`, validando credenciais pré-configuradas ou voluntários cadastrados.
- Carregamento condicional de componentes (`HTML/componentes/*.html`) e ajuste de menu conforme perfil definido em `js/data.js`.
- Módulos específicos em `js/components.js` inicializam filtros, formulários, dashboards e exportação CSV/PDF.
- Personalização de perfil salva no `localStorage`, incluindo foto, contatos e senha (simulação).

## Dependências

- [Chart.js](https://www.chartjs.org/) via CDN para gráficos de barras e rosca.
- [jsPDF](https://github.com/parallax/jsPDF) via CDN para exportação de certificado no painel.
- Máscaras de formulário e demais interações implementadas com JavaScript vanilla; nenhum bundler ou gerenciador de pacotes é necessário.

## Como Executar

1. Faça o download ou clone o repositório.
2. Abra `index.html` diretamente no navegador ou utilize uma extensão como **Live Server** para facilitar a navegação entre as páginas.
3. Para acessar o painel, abra `HTML/login.html`, informe uma das credenciais de teste e navegue a partir de `HTML/painel.html`.

> Observação: por ser um protótipo estático sem backend, todos os dados são armazenados apenas no navegador. Limpar cache/localStorage removerá cadastros e personalizações.

## Credenciais de Teste

| Perfil               | E-mail                         | Senha     |
|----------------------|--------------------------------|-----------|
| Diretor              | `diretor@mudamundo.org`        | `12345678`|
| Gerente Financeiro   | `gerente.fin@mudamundo.org`    | `12345678`|
| Gerente de Projetos  | `gerente.proj@mudamundo.org`   | `12345678`|
| Gerente de Comunicação | `gerente.com@mudamundo.org`  | `12345678`|
| Equipe Financeira    | `equipe.fin@mudamundo.org`     | `12345678`|
| Equipe de Projetos   | `equipe.proj@mudamundo.org`    | `12345678`|
| Equipe de Comunicação| `equipe.com@mudamundo.org`     | `12345678`|
| TI                   | `ti@mudamundo.org`             | `12345678`|

Usuários voluntários cadastrados pela interface receberão automaticamente o perfil `voluntario` e acesso restrito ao painel.

## Próximos Passos Sugeridos

1. Conectar a aplicação a um backend real para persistência de usuários, projetos e transações.
2. Melhorar a acessibilidade (ARIA, contraste, leitores de tela) e corrigir issues de encoding em caracteres especiais.
3. Implementar testes automatizados para os módulos críticos em `js/`.
