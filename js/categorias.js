// ========================================
// LOCAL STORAGE
// ========================================

const STORAGE_KEY = "categorias";

const categoriasPadrao = [
  {
    id: 1,
    nome: "Faculdade",
    cor: "#3b82f6",
    descricao: "Anotações de aulas e resumos.",
    notas: 12,
  },
  {
    id: 2,
    nome: "Pessoal",
    cor: "#8b5cf6",
    descricao: "Reflexões e metas pessoais.",
    notas: 5,
  },
  {
    id: 3,
    nome: "Trabalho",
    cor: "#22c55e",
    descricao: "Tarefas e projetos do trabalho.",
    notas: 8,
  },
];

let categorias = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!categorias) {
  categorias = categoriasPadrao;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
}

function salvarCategorias() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
}

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let idEditando = null;
let idExcluindo = null;
let corSelecionada = "#3b82f6";

// ========================================
// RENDERIZAR
// ========================================

function renderizar() {
  const grade = document.getElementById("grade-categorias");

  const vazio = document.getElementById("vazio");

  if (categorias.length === 0) {
    grade.innerHTML = "";

    vazio.style.display = "block";
  } else {
    vazio.style.display = "none";

    grade.innerHTML = categorias
      .map(
        (cat) => `
        <div
          class="card"
          style="--cor-cat:${cat.cor}"
        >

          <div class="card-topo">

            <span class="card-nome">
              ${escaparHtml(cat.nome)}
            </span>

            <span class="card-qtd">
              ${cat.notas}
              nota${cat.notas !== 1 ? "s" : ""}
            </span>

          </div>

          ${
            cat.descricao
              ? `
            <p class="card-desc">
              ${escaparHtml(cat.descricao)}
            </p>
          `
              : ""
          }

          <div class="card-acoes">

            <button
              class="btn-acao ver"
              onclick="verNotas(${cat.id})"
            >
              📄 Ver notas
            </button>

            <button
              class="btn-acao"
              onclick="editarCategoria(${cat.id})"
            >
              ✏️ Editar
            </button>

            <button
              class="btn-acao excluir"
              onclick="pedirExclusao(${cat.id})"
            >
              🗑 Excluir
            </button>

          </div>

        </div>
      `,
      )
      .join("");
  }

  atualizarEstatisticas();
}

// ========================================
// ESTATÍSTICAS
// ========================================

function atualizarEstatisticas() {
  const total = categorias.length;

  const totalNotas = categorias.reduce((soma, c) => soma + c.notas, 0);

  document.getElementById("total-categorias").textContent = total;

  document.getElementById("total-notas").textContent = totalNotas;

  if (total === 0) {
    document.getElementById("top-nome").textContent = "—";
  } else {
    const top = categorias.reduce((a, b) => (b.notas > a.notas ? b : a));

    document.getElementById("top-nome").textContent = top.nome;
  }
}

// ========================================
// MODAL
// ========================================

function abrirModal(id = null) {
  idEditando = id;

  corSelecionada = "#3b82f6";

  document.getElementById("modal-titulo").textContent = id
    ? "Editar Categoria"
    : "Nova Categoria";

  document.getElementById("campo-nome").value = "";

  document.getElementById("campo-descricao").value = "";

  if (id) {
    const cat = categorias.find((c) => c.id === id);

    document.getElementById("campo-nome").value = cat.nome;

    document.getElementById("campo-descricao").value = cat.descricao;

    corSelecionada = cat.cor;
  }

  document.querySelectorAll(".cor-btn").forEach((btn) => {
    btn.classList.toggle("selecionada", btn.dataset.cor === corSelecionada);
  });

  document.getElementById("overlay-modal").classList.add("aberto");

  setTimeout(() => {
    document.getElementById("campo-nome").focus();
  }, 100);
}

function fecharModal() {
  document.getElementById("overlay-modal").classList.remove("aberto");

  idEditando = null;
}

// ========================================
// CORES
// ========================================

function selecionarCor(cor, botao) {
  corSelecionada = cor;

  document
    .querySelectorAll(".cor-btn")
    .forEach((btn) => btn.classList.remove("selecionada"));

  botao.classList.add("selecionada");
}

// ========================================
// SALVAR
// ========================================

function salvarCategoria() {
  const nome = document.getElementById("campo-nome").value.trim();

  const descricao = document.getElementById("campo-descricao").value.trim();

  if (!nome) {
    const campo = document.getElementById("campo-nome");

    campo.style.borderColor = "#ef4444";

    campo.focus();

    setTimeout(() => {
      campo.style.borderColor = "";
    }, 1500);

    return;
  }

  if (idEditando) {
    const cat = categorias.find((c) => c.id === idEditando);

    cat.nome = nome;
    cat.cor = corSelecionada;
    cat.descricao = descricao;

    salvarCategorias();

    mostrarToast("Categoria atualizada!");
  } else {
    categorias.push({
      id: Date.now(),
      nome,
      cor: corSelecionada,
      descricao,
      notas: 0,
    });

    salvarCategorias();

    mostrarToast("Categoria criada!");
  }

  fecharModal();
  renderizar();
}

function editarCategoria(id) {
  abrirModal(id);
}

// ========================================
// EXCLUIR
// ========================================

function pedirExclusao(id) {
  idExcluindo = id;

  const cat = categorias.find((c) => c.id === id);

  document.getElementById("nome-excluir").textContent = cat.nome;

  document.getElementById("overlay-excluir").classList.add("aberto");
}

function fecharExcluir() {
  document.getElementById("overlay-excluir").classList.remove("aberto");

  idExcluindo = null;
}

function confirmarExclusao() {
  if (!idExcluindo) return;

  const nome = categorias.find((c) => c.id === idExcluindo)?.nome;

  categorias = categorias.filter((c) => c.id !== idExcluindo);

  salvarCategorias();

  fecharExcluir();

  renderizar();

  mostrarToast(`"${nome}" excluída.`);
}

// ========================================
// VER NOTAS
// ========================================

function verNotas(id) {
  const categoria = categorias.find((c) => c.id === id);

  localStorage.setItem("categoriaSelecionada", JSON.stringify(categoria));

  mostrarToast(`Abrindo notas de "${categoria.nome}"...`);

  setTimeout(() => {
    window.location.href = "notas.html";
  }, 1000);
}

// ========================================
// TOAST
// ========================================

function mostrarToast(msg) {
  const toast = document.getElementById("toast");

  toast.textContent = msg;

  toast.classList.add("visivel");

  setTimeout(() => {
    toast.classList.remove("visivel");
  }, 2500);
}

// ========================================
// ESCAPAR HTML
// ========================================

function escaparHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ========================================
// TECLADO
// ========================================

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    fecharModal();
    fecharExcluir();
  }
});

// ========================================
// INICIAR
// ========================================

renderizar();
