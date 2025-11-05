// ==============================================================
// =================== LÓGICA DE COMPONENTES ====================
// ==============================================================

// Importa os dados e funções que os componentes precisam
import { dadosFinanceiros, nomesMeses, dadosProjetos, usuarios } from './data.js';
import { aplicarMascaras } from './formValidation.js';

// Variável de estado do gráfico (privada para este módulo)
let grafico; 

// --- FUNÇÕES DE DASHBOARD ---
function gerarGraficoImpacto(filtroMes = "todos") {
  const canvas = document.getElementById("graficoImpacto");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dadosFiltrados = filtroMes === "todos" ? dadosFinanceiros : [dadosFinanceiros[parseInt(filtroMes)]];
  const labels = filtroMes === "todos" ? nomesMeses : [nomesMeses[parseInt(filtroMes)]];

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Receita", data: dadosFiltrados.map(d => d.receita), backgroundColor: "#2e7d32" },
        { label: "Despesas", data: dadosFiltrados.map(d => d.despesas), backgroundColor: "#c62828" },
        { label: "Doações", data: dadosFiltrados.map(d => d.doacoes), backgroundColor: "#ff8c00" }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } }, scales: { y: { beginAtZero: true, ticks: { callback: value => `R$ ${value.toLocaleString("pt-BR")}` } } } }
  });
}

function exportarCSV() {
  const csv = [["Mês", "Receita", "Despesas", "Doações"], ...dadosFinanceiros.map((d, i) => [nomesMeses[i], d.receita, d.despesas, d.doacoes])];
  const csvContent = csv.map(l => l.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "relatorio-financeiro.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function inicializarDashboard() {
  gerarGraficoImpacto();
  const select = document.getElementById("filtro-mes");
  if (select) select.addEventListener("change", () => gerarGraficoImpacto(select.value));
  const btnExportar = document.getElementById("btn-exportar-csv");
  if (btnExportar) btnExportar.addEventListener("click", exportarCSV);
}

// --- FUNÇÃO DO PERFIL DE USUÁRIO ---
export function inicializarUserProfile() {
  // Pega os elementos principais
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  const form = document.getElementById('form-user-profile');
  
  // Se não achar o form ou o usuário, para a execução
  if (!form || !usuarioLogado) {
    console.error("Erro: Formulário de perfil ou usuário não encontrado.");
    return;
  }

  // Pega os inputs do formulário
  const fotoPerfil = document.getElementById('profile-photo');
  const inputNome = document.getElementById('profile-name');
  const inputEmail = document.getElementById('profile-email');
  const inputTelefone = document.getElementById('profile-phone');
  const inputCep = document.getElementById('profile-cep');
  const inputCidade = document.getElementById('profile-city');
  const inputEstado = document.getElementById('profile-state');
  
  // Pega os botões
  const btnEdit = document.getElementById('btn-edit');
  const btnSave = document.getElementById('btn-save');
  const btnCancel = document.getElementById('btn-cancel');
  const btnChangePhoto = document.getElementById('btn-change-photo');
  const inputPhoto = document.getElementById('profile-photo-input');

  // --- 1. FUNÇÃO PARA CARREGAR OS DADOS ---
  function carregarDadosUsuario() {
    const extras = JSON.parse(localStorage.getItem(`perfilExtra_${usuarioLogado.email}`)) || {};
    
    // Preenche os 'extras' do localStorage.
    inputTelefone.value = extras.telefone || '';
    inputCep.value = extras.cep || '';
    inputCidade.value = extras.cidade || '';
    inputEstado.value = extras.estado || '';
    
    // Carrega a foto salva, se existir
    fotoPerfil.src = localStorage.getItem(`fotoPerfil_${usuarioLogado.email}`) || '../img/user-default.svg';
    
    // Garante que os dados do template (nome/email) sejam recarregados em caso de 'cancelar'
    inputNome.value = usuarioLogado.nome;
    inputEmail.value = usuarioLogado.email;
  }

  // --- 2. FUNÇÃO PARA ALTERNAR O MODO DE EDIÇÃO ---
  const toggleEditMode = (isEditing) => {
    // Define quais inputs podem ser editados
    const inputs = [inputNome, inputTelefone, inputCep, inputCidade, inputEstado];
    
    if (isEditing) {
      inputs.forEach(input => input.removeAttribute('readonly'));
      btnChangePhoto.style.display = 'block'; // Mostra botão de alterar foto
      document.querySelector('.senha-wrapper').style.display = 'block'; // Mostra campo de senha
      
      btnEdit.style.display = 'none'; // Esconde Editar
      btnSave.style.display = 'inline-block'; // Mostra Salvar
      btnCancel.style.display = 'inline-block'; // Mostra Cancelar
    } else {
      inputs.forEach(input => input.setAttribute('readonly', true));
      btnChangePhoto.style.display = 'none'; // Esconde botão de alterar foto
      document.querySelector('.senha-wrapper').style.display = 'none'; // Esconde campo de senha
      
      btnEdit.style.display = 'inline-block'; // Mostra Editar
      btnSave.style.display = 'none'; // Esconde Salvar
      btnCancel.style.display = 'none'; // Esconde Cancelar
    }
  };

  // --- 3. ADICIONA OS EVENT LISTENERS ---

  if (btnEdit) btnEdit.addEventListener('click', () => toggleEditMode(true));

  if (btnCancel) btnCancel.addEventListener('click', () => {
    toggleEditMode(false);
    carregarDadosUsuario(); // Recarrega os dados originais salvos
  });

  if (inputPhoto) inputPhoto.addEventListener('change', function () {
    if (this.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        fotoPerfil.src = e.target.result;
        // Salva a foto imediatamente no localStorage
        localStorage.setItem(`fotoPerfil_${usuarioLogado.email}`, e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    // 1. Pega os novos valores dos inputs
    const novoNome = inputNome.value.trim();
    const novoTelefone = inputTelefone.value.trim();
    const novoCep = inputCep.value.trim();
    const novaCidade = inputCidade.value.trim();
    const novoEstado = inputEstado.value.trim();
    const novaSenha = document.getElementById('profile-password').value.trim(); // Pega a senha

    // 2. Atualiza o objeto 'usuarioLogado' (da sessionStorage)
    usuarioLogado.nome = novoNome;
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
    
    // 3. Atualiza os 'extras' (do localStorage)
    const novosDados = {
      telefone: novoTelefone,
      cep: novoCep,
      cidade: novaCidade,
      estado: novoEstado
    };
    localStorage.setItem(`perfilExtra_${usuarioLogado.email}`, JSON.stringify(novosDados));

    // 4. Atualiza a senha (simulação)
    if (novaSenha && usuarios[usuarioLogado.email]) {
        if(novaSenha.length < 8) return alert('A senha deve ter no mínimo 8 caracteres.');
        usuarios[usuarioLogado.email].senha = novaSenha;
        console.log("Senha do usuário (simulado) atualizada.");
        document.getElementById('profile-password').value = ''; // Limpa o campo
    }

    alert('Perfil atualizado com sucesso!');

    // 5. Volta ao modo de visualização
    toggleEditMode(false);

    // 6. ATUALIZA OS CABEÇALHOS ESTÁTICOS
    const h1Componente = document.querySelector('.main-header h1');
    if (h1Componente) h1Componente.textContent = `Perfil de ${novoNome}`;
    
    const pComponente = document.querySelector('.main-header p');
    if (pComponente) pComponente.textContent = `Visualize e gerencie suas informações. (${usuarioLogado.email})`;

    // Atualiza o H1 principal do PAINEL (fora do componente)
    const h1Painel = document.querySelector('.mains-header h1');
    if (h1Painel) h1Painel.textContent = `Bem-vindo(a), ${novoNome}!`;
  });

  // --- 4. INICIALIZA O COMPONENTE ---
  carregarDadosUsuario(); // Carrega os dados do localStorage na primeira vez
  toggleEditMode(false); // Garante que começa no modo 'readonly'
  if (typeof aplicarMascaras === 'function') {
    aplicarMascaras(); // Aplica máscaras nos inputs de tel, cep
  }
}

// --- FUNÇÕES DE PÁGINAS PÚBLICAS ---
export function gerarGraficoUsoRecursos() {
  const canvas = document.getElementById("graficoUsoRecursos");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dados = {
    labels: [
      'Educação Ambiental', 'Proteção da Vida', 'Apoio a Comunidades',
      'Custos Administrativos', 'Captação de Recursos'
    ],
    datasets: [{
      label: 'Uso de Recursos',
      data: [35, 30, 20, 10, 5],
      backgroundColor: ['#2ecc71', '#3498db', '#9b59b6', '#f39c12', '#e74c3c'],
      hoverOffset: 4
    }]
  };

  new Chart(ctx, {
    type: 'doughnut',
    data: dados,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
}

export function inicializarFiltrosProjetos() {
  const filtroCategoria = document.getElementById('categoria');
  const filtroStatus = document.getElementById('status');
  const resultadoFiltro = document.getElementById('resultado-filtro');
  const btnIrParaProjeto = document.getElementById('ir-para-projeto');
  const todosProjetos = document.querySelectorAll('.projeto-item');

  function aplicarFiltros() {
    const categoria = filtroCategoria.value;
    const status = filtroStatus.value;

    const projetosFiltrados = dadosProjetos.filter(p => {
      const matchCategoria = (categoria === 'todos') || (p.categoria === categoria);
      const matchStatus = (status === 'todos') || (p.status === status);
      return matchCategoria && matchStatus;
    });

    resultadoFiltro.innerHTML = '<option value="">Selecione um projeto</option>';
    if (projetosFiltrados.length > 0) {
      projetosFiltrados.forEach(p => {
        const option = document.createElement('option');
        option.value = p.url;
        option.textContent = p.nome;
        resultadoFiltro.appendChild(option);
      });
      resultadoFiltro.disabled = false;
    } else {
      resultadoFiltro.innerHTML = '<option>Nenhum projeto encontrado</option>';
      resultadoFiltro.disabled = true;
    }

    todosProjetos.forEach(artigo => {
      const idArtigo = artigo.id.replace('projeto-', '');
      if (projetosFiltrados.some(p => p.id === idArtigo)) {
        artigo.style.display = '';
      } else {
        artigo.style.display = 'none';
      }
    });

    btnIrParaProjeto.disabled = true;
  }

  if (filtroCategoria) filtroCategoria.addEventListener('change', aplicarFiltros);
  if (filtroStatus) filtroStatus.addEventListener('change', aplicarFiltros);
  if (resultadoFiltro) resultadoFiltro.addEventListener('change', () => {
    btnIrParaProjeto.disabled = resultadoFiltro.value === '';
  });
  if (btnIrParaProjeto) btnIrParaProjeto.addEventListener('click', () => {
    if (resultadoFiltro.value) window.location.href = resultadoFiltro.value;
  });
}

export function inicializarFormularioDoacao() {
  const opcoesPagamento = document.querySelectorAll('input[name="pagamento"]');
  if (!opcoesPagamento.length) return;

  const detalhesPix = document.getElementById('detalhes-pix');
  const detalhesCartao = document.getElementById('detalhes-cartao');
  const detalhesBoleto = document.getElementById('detalhes-boleto');

  opcoesPagamento.forEach(opcao => {
    opcao.addEventListener('change', () => {
      if (detalhesPix) detalhesPix.classList.add('hidden');
      if (detalhesCartao) detalhesCartao.classList.add('hidden');
      if (detalhesBoleto) detalhesBoleto.classList.add('hidden');

      const idDetalhe = `detalhes-${opcao.value}`;
      document.getElementById(idDetalhe)?.classList.remove('hidden');
    });
  });
}

export function inicializarFiltrosBlog() {
  const linksFiltro = document.querySelectorAll('.filtros-categorias a');
  const posts = document.querySelectorAll('.post-card');
  if (!linksFiltro.length || !posts.length) return;

  linksFiltro.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      linksFiltro.forEach(l => l.classList.remove('ativo'));
      link.classList.add('ativo');

      const filtro = link.getAttribute('data-filtro');

      posts.forEach(post => {
        const categoriaPost = post.getAttribute('data-categoria');
        const mostrar = (filtro === 'todos' || filtro === categoriaPost);
        post.style.display = mostrar ? 'block' : 'none';
      });
    });
  });
}

// --- FUNÇÕES DE COMPONENTES INTERNOS DA SPA ---
export function inicializarFiltrosVoluntarios() {
  const filtroProjeto = document.getElementById('filtro-projeto-voluntario');
  const filtroStatus = document.getElementById('filtro-status-voluntario');
  const tabelaCorpo = document.querySelector('.tabela-dados-bordas tbody');
  if (!filtroProjeto || !filtroStatus || !tabelaCorpo) return;

  const todasLinhas = Array.from(tabelaCorpo.querySelectorAll('tr'));

  function aplicarFiltrosVoluntarios() {
    const projetoSelecionado = filtroProjeto.value;
    const statusSelecionado = filtroStatus.value;
    const mapaProjetos = {
      'reflorestamento': 'Reflorestamento Comunitário',
      'hortas-urbanas': 'Hortas Urbanas Comunitárias'
    };

    todasLinhas.forEach(linha => {
      const nomeProjeto = linha.children[1].textContent.trim();
      const statusElement = linha.children[3].querySelector('.status');
      const status = statusElement ? statusElement.className.split(' ')[1].replace('status-', '') : '';

      const projetoMatch = (projetoSelecionado === 'todos') || (nomeProjeto === mapaProjetos[projetoSelecionado]);
      const statusMatch = (statusSelecionado === 'todos') || (status === statusSelecionado);

      linha.style.display = (projetoMatch && statusMatch) ? '' : 'none';
    });
  }

  filtroProjeto.addEventListener('change', aplicarFiltrosVoluntarios);
  filtroStatus.addEventListener('change', aplicarFiltrosVoluntarios);
}

export function inicializarFiltrosMidia() {
  const filtroStatus = document.getElementById('filtro-status-midia');
  const midiaGrid = document.querySelector('.midia-grid');
  if (!filtroStatus || !midiaGrid) return;

  const todosCards = Array.from(midiaGrid.querySelectorAll('.card-midia'));

  function aplicarFiltroMidia() {
    const statusSelecionado = filtroStatus.value;
    todosCards.forEach(card => {
      const statusCard = card.getAttribute('data-status');
      const statusMatch = (statusSelecionado === 'todos' || statusSelecionado === statusCard);
      card.style.display = statusMatch ? '' : 'none';
    });
  }

  filtroStatus.addEventListener('change', aplicarFiltroMidia);
  aplicarFiltroMidia(); // Aplica o filtro inicial
}

export function inicializarFiltrosOportunidades() {
  const filtroPalavraChave = document.getElementById('filtro-palavra-chave');
  const filtroTipoAtuacao = document.getElementById('filtro-tipo-atuacao');
  const filtroLocalizacao = document.getElementById('filtro-localizacao');
  const postsGrid = document.querySelector('.posts-grid');
  if (!postsGrid || !filtroPalavraChave || !filtroTipoAtuacao || !filtroLocalizacao) return;

  const todosCards = Array.from(postsGrid.querySelectorAll('.post-card'));

  function aplicarFiltrosOportunidades() {
    const termoBusca = filtroPalavraChave.value.toLowerCase().trim();
    const tipoAtuacao = filtroTipoAtuacao.value;
    const localizacaoBusca = filtroLocalizacao.value.toLowerCase().trim();
    const mapaAtuacao = {
      'campo': 'Ação em Campo',
      'educacional': 'Educacional',
      'remoto': 'Remoto / Administrativo'
    };

    todosCards.forEach(card => {
      const titulo = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const resumo = card.querySelector('.post-resumo')?.textContent.toLowerCase() || '';
      const textoCard = `${titulo} ${resumo}`;
      const categoriaCard = card.querySelector('.post-categoria')?.textContent.trim() || '';
      const localizacaoCard = card.querySelector('.card-meta-info span:first-child')?.textContent.toLowerCase() || '';

      const matchPalavraChave = termoBusca === '' || textoCard.includes(termoBusca);
      const matchTipoAtuacao = tipoAtuacao === 'todos' || categoriaCard === mapaAtuacao[tipoAtuacao];
      const matchLocalizacao = localizacaoBusca === '' || localizacaoCard.includes(localizacaoBusca);

      card.style.display = (matchPalavraChave && matchTipoAtuacao && matchLocalizacao) ? '' : 'none';
    });
  }

  filtroPalavraChave.addEventListener('input', aplicarFiltrosOportunidades);
  filtroTipoAtuacao.addEventListener('change', aplicarFiltrosOportunidades);
  filtroLocalizacao.addEventListener('input', aplicarFiltrosOportunidades);
  aplicarFiltrosOportunidades(); // Aplica ao carregar
}

export function gerarCertificado(nomeVoluntario, nomeProjeto, dataConclusao, horas) {
  // Verifica se a biblioteca jspdf está carregada
  if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
    console.error("Erro: A biblioteca jsPDF não está carregada.");
    alert("Erro ao gerar o PDF. Verifique se a biblioteca jsPDF foi carregada.");
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("landscape", "mm", "a4");
  const largura = doc.internal.pageSize.getWidth();
  const altura = doc.internal.pageSize.getHeight();

  // Fundo
  doc.setFillColor(253, 248, 243);
  doc.rect(0, 0, largura, altura, "F");
  // Moldura
  doc.setDrawColor(169, 179, 136); // #a9b388
  doc.setLineWidth(2);
  doc.rect(10, 10, largura - 20, altura - 20);

  // Logo (com fallback)
  try {
    doc.addImage("../img/Logo-nome.png", "PNG", (largura / 2) - 30, 18, 60, 20);
  } catch (e) {
    console.warn("Não foi possível carregar a imagem do logo no PDF:", e);
    doc.text("Logo Muda Mundo", largura / 2, 30, { align: "center" });
  }

  // Título
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(26);
  doc.text("CERTIFICADO DE PARTICIPAÇÃO", largura / 2, 60, { align: "center" });
  // Linha
  doc.setDrawColor(169, 179, 136);
  doc.setLineWidth(0.8);
  doc.line(largura / 2 - 50, 65, largura / 2 + 50, 65);

  // Corpo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  const texto = `Certificamos que ${nomeVoluntario}, participou ativamente do projeto "${nomeProjeto}", realizado pela ONG Muda Mundo, concluído em ${dataConclusao}, contribuindo com ${horas} de trabalho voluntário em prol da sustentabilidade, solidariedade e transformação social.`;
  doc.text(texto, 35, 90, { maxWidth: 230, align: "justify" });

  // Data
  const dataAtual = new Date().toLocaleDateString("pt-BR");
  doc.setFontSize(12);
  doc.text(`Brasília, ${dataAtual}`, largura / 2, 140, { align: "center" });

  // Assinatura (com fallback)
  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  try {
    doc.addImage("../img/assinatura.png", "PNG", largura - 115, 153, 60, 25);
  } catch(e) {
    console.warn("Não foi possível carregar a imagem da assinatura no PDF:", e);
    doc.text("Joana Silva", largura - 85, 160, { align: "center" });
  }
  doc.text("________________________________________", largura - 85, 165, { align: "center" });
  doc.text("Direção – ONG Muda Mundo", largura - 85, 173, { align: "center" });

  // Rodapé
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text("CNPJ: 12.345.678/0000-99  |  www.mudamundo.org", largura / 2, altura - 15, { align: "center" });

  // Salvar
  doc.save(`Certificado_${nomeVoluntario}_${nomeProjeto}.pdf`);
}

// --- FUNÇÃO GENÉRICA (ABAS, BOTÕES, ETC) ---
export function inicializarEventosComponente() {
  if (typeof aplicarMascaras === 'function') aplicarMascaras();

  // Adiciona listener de submit a formulários dinâmicos
  document.querySelectorAll('.conteudo-wrapper form:not(#form-user-profile):not([data-listener-attached])').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      alert('Formulário enviado com sucesso! (Simulação)');
      form.reset();
    });
    form.dataset.listenerAttached = 'true';
  });

  // Lógica para inputs de arquivo customizados
  document.querySelectorAll('.conteudo-wrapper input[type="file"]:not(#profile-photo-input):not([data-listener-attached])').forEach(input => {
    input.addEventListener('change', function () {
      const nameDisplay = this.closest('.input-file-wrapper')?.querySelector('.input-file-name');
      if (nameDisplay) {
        if (this.files && this.files.length > 1) nameDisplay.textContent = `${this.files.length} arquivos selecionados`;
        else if (this.files && this.files.length === 1) nameDisplay.textContent = this.files[0].name;
        else nameDisplay.textContent = 'Nenhum arquivo selecionado';
      }
    });
    input.dataset.listenerAttached = 'true';
  });

  // Lógica para navegação por abas
  document.querySelectorAll('.abas-navegacao .aba:not([data-listener-attached])').forEach(aba => {
    aba.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.abas-navegacao .aba').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.aba-painel').forEach(painel => painel.classList.remove('active'));
      document.querySelector(this.getAttribute('href'))?.classList.add('active');
    });
    aba.dataset.listenerAttached = 'true';
  });

  // Delegação de eventos para botões na área de conteúdo
  const conteudoWrapper = document.querySelector('.conteudo-wrapper');
  if (conteudoWrapper && !conteudoWrapper.dataset.delegateAttached) {
    conteudoWrapper.addEventListener('click', e => {
      const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
      
      if (e.target.matches('.btn-tabela-aprovar')) {
        e.preventDefault();
        if (confirm('Deseja aprovar este item?')) alert('Item aprovado com sucesso!');
      }
      if (e.target.matches('.btn-tabela-recusar')) {
        e.preventDefault();
        if (confirm('Deseja recusar este item?')) alert('Item recusado!');
      }
      if (e.target.matches('.btn-certificado')) {
        e.preventDefault();

        const botao = e.target;
        const linha = botao.closest('tr');
        const nomeProjeto = linha.children[0].textContent.trim();
        const dataConclusao = linha.children[1].textContent.trim();
        const horas = linha.children[2].textContent.trim();

        if (!usuarioLogado || !usuarioLogado.nome) {
          alert('Erro: usuário não identificado.');
          return;
        }

        const nomeVoluntario = usuarioLogado.nome;
        gerarCertificado(nomeVoluntario, nomeProjeto, dataConclusao, horas);
      }
      
      // O 'data-componente' foi removido para evitar dependência circular
      // A navegação agora é responsabilidade do router.js
    });
    conteudoWrapper.dataset.delegateAttached = 'true';
  }
}