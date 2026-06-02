document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const guestActions = document.getElementById("guestActions");

  const userProfile = document.getElementById("userProfile");

  const welcomeText = document.getElementById("welcomeText");

  const profileAvatar = document.getElementById("profileAvatar");

  if (users.length > 0) {
    const usuario = users[0];

    guestActions.style.display = "none";
    userProfile.style.display = "block";

    welcomeText.textContent = `Olá, ${usuario.name}`;

    profileAvatar.textContent = usuario.name.charAt(0).toUpperCase();
  }
});

const trigger = document.getElementById("userTrigger");

const menu = document.getElementById("dropdownMenu");

trigger?.addEventListener("click", () => {
  menu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!trigger.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove("active");
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  const confirmar = confirm("Deseja sair da conta?");

  if (confirmar) {
    localStorage.removeItem("users");

    window.location.href = "login.html";
  }
});

document.getElementById("startBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.length > 0) {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "login.html";
  }
});
