const users = JSON.parse(localStorage.getItem("users")) || [];

const notes = JSON.parse(localStorage.getItem("notes")) || [];

const categorias = JSON.parse(localStorage.getItem("categorias")) || [];

document.addEventListener("DOMContentLoaded", () => {
  carregarUsuario();
  carregarResumo();
  carregarUltimasNotas();
});

function carregarUsuario() {
  if (users.length === 0) return;

  const usuario = users[0];

  document.getElementById("username").textContent = usuario.name;

  document.getElementById("avatar").textContent = usuario.name
    .charAt(0)
    .toUpperCase();
}

function carregarResumo() {
  document.getElementById("totalNotes").textContent = notes.length;

  document.getElementById("totalCategories").textContent = categorias.length;

  const favoritas = notes.filter((nota) => nota.favorite);

  document.getElementById("favoriteNotes").textContent = favoritas.length;

  if (notes.length > 0) {
    const ultima = [...notes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )[0];

    document.getElementById("lastNote").textContent = ultima.title;
  } else {
    document.getElementById("lastNote").textContent = "-";
  }
}

function carregarUltimasNotas() {
  const container = document.getElementById("recentNotesList");

  container.innerHTML = "";

  const ultimas = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (ultimas.length === 0) {
    container.innerHTML = `
      <p>Nenhuma nota encontrada.</p>
    `;
    return;
  }

  ultimas.forEach((nota) => {
    const categoria = categorias.find(
      (cat) => Number(cat.id) === Number(nota.categoryId),
    );

    container.innerHTML += `
      <div class="note-card">

        <h3>${nota.title}</h3>
        <p style="margin-bottom: 10px;">${nota.content}</p>

        <span>
          ${categoria?.nome || "Sem categoria"}
        </span>

        <p>
          ${new Date(nota.createdAt).toLocaleDateString("pt-BR")}
        </p>

      </div>
    `;
  });
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  if (confirm("Deseja sair da conta?")) {
    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
  }
});
