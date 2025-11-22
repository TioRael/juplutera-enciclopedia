// ===== TROCAR TEMA (funciona em todas as páginas) =====
document.addEventListener('DOMContentLoaded', () => {
  const botaoTema = document.getElementById('botao-tema');
  if (!botaoTema) return;

  const html = document.documentElement;

  // Carrega tema salvo ou define escuro como padrão
  const temaSalvo = localStorage.getItem('tema') || 'escuro';
  html.dataset.tema = temaSalvo;
  botaoTema.textContent = temaSalvo === 'claro' ? '☀️' : '🌙';

  // Alterna tema ao clicar
  botaoTema.addEventListener('click', () => {
    const novoTema = html.dataset.tema === 'claro' ? 'escuro' : 'claro';
    html.dataset.tema = novoTema;
    botaoTema.textContent = novoTema === 'claro' ? '☀️' : '🌙';
    localStorage.setItem('tema', novoTema);
  });
});

// ===== CARREGAR ITENS DO JSON (AGORA COM ESTILO ÉPICO) =====
async function carregarItens(tipo) {
  const container = document.getElementById('lista-itens');
  container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 80px; font-size: 1.4rem;">Invocando entidades antigas...</p>';

  try {
    const resposta = await fetch(`../dados/${tipo}.json`);
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
    
    const itens = await resposta.json();
    container.innerHTML = ''; // Limpa loading

    itens.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card-dinamico';
      card.onclick = () => abrirModal(item);

      const imagemHtml = item.imagem 
        ? `<img src="${item.imagem}" alt="${item.nome}" loading="lazy">` 
        : '<div style="height:100%; background: linear-gradient(135deg, #0a0a0a, #1a1a1a);"></div>';

      card.innerHTML = `
        ${imagemHtml}
        <div class="card-dinamico-glow"></div>
        <div class="card-dinamico-conteudo">
          <h3>${item.nome}</h3>
          <div class="linha-verde"></div>
          <p>${item.descricao ? item.descricao.substring(0, 120) + '...' : 'Um ser além da compreensão mortal.'}</p>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (erro) {
    console.error('Erro ao carregar JSON:', erro);
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px; background: rgba(231, 76, 60, 0.1); border-radius: 20px; border: 1px solid #e74c3c;">
        <h3 style="color: #e74c3c; font-family: 'Cinzel Decorative', serif;">Falha na Invocação</h3>
        <p style="color: var(--text-secondary); margin-top: 10px;">O véu entre os mundos está instável. Tente novamente.</p>
      </div>`;
  }
}
// ===== ABRIR MODAL =====
function abrirModal(item) {
  const modal = document.getElementById('modal');
  const imgModal = document.getElementById('modal-imagem');
  const divCaracteristicas = document.getElementById('modal-caracteristicas');

  document.getElementById('modal-titulo').textContent = item.nome;
  document.getElementById('modal-descricao').textContent = item.descricao || '';

  // Configuração da Imagem
  if (item.imagem) {
    imgModal.src = item.imagem;
    imgModal.alt = item.nome;
    imgModal.style.display = 'block';
  } else {
    imgModal.style.display = 'none';
  }

  // Características (Lista Dinâmica)
  if (item.caracteristicas && item.caracteristicas.length > 0) {
    divCaracteristicas.innerHTML = `
      <h4 style="color: var(--primary-color); margin: 20px 0 10px; border-bottom: 1px solid var(--text-secondary); padding-bottom: 5px;">
        Atributos e Detalhes:
      </h4>
      <ul style="padding-left: 20px; list-style: disc; color: var(--text-secondary);">
        ${item.caracteristicas.map(c => `<li style="margin-bottom: 5px;">${c}</li>`).join('')}
      </ul>
    `;
  } else {
    divCaracteristicas.innerHTML = '';
  }

  // IMPORTANTE: display flex para funcionar com o CSS de centralização moderna
  modal.style.display = 'flex';
}

// ===== FECHAR MODAL =====
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modal');
  if (!modal) return;
  
  // Fecha se clicar fora (overlay) ou no botão X
  if (e.target === modal || e.target.classList.contains('fechar')) {
    modal.style.display = 'none';
  }
});

// Fecha com a tecla ESC também (Usabilidade Google)
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('modal');
  if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
    modal.style.display = 'none';
  }
});