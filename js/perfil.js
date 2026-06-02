const form = document.getElementById("perfilForm");
const mensagem = document.getElementById("mensagem");

const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
const perfilData = document.getElementById("perfilData");

const inputNome = document.getElementById("nome");
const inputSenha = document.getElementById("senha");

let users = JSON.parse(localStorage.getItem("users")) || [];

function formatarData(dataISO) {
  const data = new Date(dataISO);

  return data.toLocaleDateString("pt-BR");
}

function carregarPerfil() {
  if (users.length === 0) {
    mensagem.textContent = "Nenhum usuário encontrado.";

    mensagem.style.color = "#EF4444";

    return;
  }

  const usuario = users[0];

  perfilNome.textContent = usuario.name;
  perfilEmail.textContent = usuario.email;
  perfilData.textContent = formatarData(usuario.createdAt);

  inputNome.value = usuario.name;
}

window.addEventListener("DOMContentLoaded", carregarPerfil);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const novoNome = inputNome.value.trim();
  const novaSenha = inputSenha.value.trim();

  if (!novoNome) {
    mensagem.textContent = "O nome não pode ficar vazio.";

    mensagem.style.color = "#EF4444";

    return;
  }

  users[0].name = novoNome;

  if (novaSenha !== "") {
    users[0].password = novaSenha;
  }

  localStorage.setItem("users", JSON.stringify(users));

  perfilNome.textContent = novoNome;

  mensagem.textContent = "Perfil atualizado com sucesso!";

  mensagem.style.color = "#22C55E";

  inputSenha.value = "";

  setTimeout(() => {
    mensagem.textContent = "";
  }, 3000);
});

document.querySelector(".btn-sair").addEventListener("click", () => {
  const confirmar = confirm("Deseja sair da conta?");

  if (!confirmar) return;

  localStorage.removeItem("users");

  window.location.href = "login.html";
});

const temaBtn = document.getElementById("trocarTema");

temaBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const temaAtual = document.body.classList.contains("dark") ? "dark" : "light";

  localStorage.setItem("tema", temaAtual);
});
