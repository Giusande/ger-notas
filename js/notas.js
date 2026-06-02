const NOTES_KEY = "notes";
const CATEGORIES_KEY = "categorias";

let notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];

let categorias = JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];

let editandoId = null;

const modal = document.getElementById("modal");
const notesGrid = document.querySelector(".notes-grid");

const noteForm = document.getElementById("noteForm");

const openModalBtn = document.getElementById("openModal");

const cancelBtn = document.querySelector(".cancel");

const searchInput = document.getElementById("search");


function carregarCategorias() {
  const select = document.getElementById("noteCategory");

  if (!select) return;

  select.innerHTML = "";

  categorias.forEach((categoria) => {
    select.innerHTML += `
      <option value="${categoria.id}">
        ${categoria.nome}
      </option>
    `;
  });
}

function abrirModal() {
  editandoId = null;

  noteForm.reset();

  modal.classList.add("active");
}

function fecharModal() {
  modal.classList.remove("active");

  noteForm.reset();

  editandoId = null;
}

openModalBtn?.addEventListener("click", abrirModal);

cancelBtn?.addEventListener("click", fecharModal);

function salvarNota(e) {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value.trim();

  const content = document.getElementById("noteContent").value.trim();

  const categoryId = Number(document.getElementById("noteCategory").value);

  const favorite = document.getElementById("favorite").checked;

  if (!title || !content) {
    alert("Preencha todos os campos.");
    return;
  }

  if (editandoId) {
    const nota = notes.find((n) => n.id === editandoId);

    nota.title = title;
    nota.content = content;
    nota.categoryId = categoryId;
    nota.favorite = favorite;
  } else {
    notes.push({
      id: Date.now(),

      title,

      content,

      categoryId,

      favorite,

      pinned: false,

      createdAt: new Date().toISOString(),
    });
  }

  salvarNotas();

  atualizarContadoresCategorias();

  renderizarNotas();

  fecharModal();
}

function salvarNotas() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function renderizarNotas() {
  if (!notesGrid) return;

  notesGrid.innerHTML = "";

  if (notes.length === 0) {
    notesGrid.innerHTML = `
      <p class="empty">
        Nenhuma nota criada.
      </p>
    `;

    return;
  }

  const notasOrdenadas = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;

    if (!a.pinned && b.pinned) return 1;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  notasOrdenadas.forEach((nota) => {
    const categoria = categorias.find((c) => c.id === nota.categoryId);

    notesGrid.innerHTML += `

      <article class="note">

        <span
          class="badge"
          style="
            background:${categoria?.cor}20;
            color:${categoria?.cor};
          "
        >
          ${categoria?.nome || "Sem categoria"}
        </span>

        <h3>
          ${nota.title}
        </h3>

        <p>
          ${nota.content}
        </p>

        <div class="note-footer">

          <small>

            ${new Date(nota.createdAt).toLocaleDateString("pt-BR")}

          </small>

          <div class="note-actions">

            <button
              class="icon-btn"
              onclick="toggleFavorite(${nota.id})"
            >

              <i class="
                ${nota.favorite ? "fa-solid favorite" : "fa-regular"}
                fa-star
              "></i>

            </button>

            <button
              class="icon-btn"
              onclick="togglePinned(${nota.id})"
            >

              <i class="
                fa-solid
                fa-thumbtack
                ${nota.pinned ? "pinned" : ""}
              "></i>

            </button>

            <button
              class="icon-btn"
              onclick="editarNota(${nota.id})"
            >

              <i class="fa-solid fa-pen"></i>

            </button>

            <button
              class="icon-btn"
              onclick="excluirNota(${nota.id})"
            >

              <i class="fa-solid fa-trash"></i>

            </button>

          </div>

        </div>

      </article>

    `;
  });
}

function editarNota(id) {
  const nota = notes.find((n) => n.id === id);

  if (!nota) return;

  editandoId = id;

  document.getElementById("noteTitle").value = nota.title;

  document.getElementById("noteContent").value = nota.content;

  document.getElementById("noteCategory").value = nota.categoryId;

  document.getElementById("favorite").checked = nota.favorite;

  modal.classList.add("active");
}

function excluirNota(id) {
  const confirmar = confirm("Deseja excluir esta nota?");

  if (!confirmar) return;

  notes = notes.filter((n) => n.id !== id);

  salvarNotas();

  atualizarContadoresCategorias();

  renderizarNotas();
}

function toggleFavorite(id) {
  const nota = notes.find((n) => n.id === id);

  if (!nota) return;

  nota.favorite = !nota.favorite;

  salvarNotas();

  renderizarNotas();
}

function togglePinned(id) {
  const nota = notes.find((n) => n.id === id);

  if (!nota) return;

  nota.pinned = !nota.pinned;

  salvarNotas();

  renderizarNotas();
}

searchInput?.addEventListener("input", (e) => {
  const termo = e.target.value.toLowerCase();

  const cards = document.querySelectorAll(".note");

  cards.forEach((card) => {
    card.style.display = card.innerText.toLowerCase().includes(termo)
      ? "block"
      : "none";
  });
});

function atualizarContadoresCategorias() {
  categorias.forEach((cat) => {
    cat.notas = notes.filter((nota) => nota.categoryId === cat.id).length;
  });

  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categorias));
}

function atualizarDashboard() {
  localStorage.setItem("dashboard_last_update", Date.now());
}

noteForm?.addEventListener("submit", salvarNota);

carregarCategorias();

atualizarContadoresCategorias();

renderizarNotas();

atualizarDashboard();
