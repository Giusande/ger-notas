function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 3000);
}

function clearError() {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.style.display = "none";
  errorDiv.textContent = "";
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember")?.checked || false;

  clearError();

  if (!email || !password) {
    Swal.fire({ icon: 'error', title: 'Campos incompletos', text: 'Por favor, preencha todos os campos!', confirmButtonColor: '#3b82f6' });
    return;
  }

  if (!isValidEmail(email)) {
    Swal.fire({ icon: 'error', title: 'E-mail inválido', text: 'Por favor, insira um e-mail válido!', confirmButtonColor: '#3b82f6' });
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const session = {
      email: user.email,
      name: user.name,
      loggedIn: true,
    };

    if (remember) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      sessionStorage.setItem("session", JSON.stringify(session));
    }

    Swal.fire({ icon: 'success', title: 'Login realizado!', text: `Bem-vindo(a), ${user.name}!`, timer: 1500, showConfirmButton: false });

    window.location.href = "index.html";

    console.log("Login realizado:", session);
  } else {
    Swal.fire({ icon: 'error', title: 'Erro no login', text: 'E-mail ou senha incorretos!', confirmButtonColor: '#3b82f6' });
  }
}

function togglePassword(inputId, toggleElement) {
  const passwordInput = document.getElementById(inputId);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleElement.textContent = "🔒";
  } else {
    passwordInput.type = "password";
    toggleElement.textContent = "👁️";
  }
}

function checkSession() {
  const session =
    localStorage.getItem("session") || sessionStorage.getItem("session");
  if (session) {
    const userData = JSON.parse(session);
    if (userData.loggedIn) {
      console.log("Usuário já logado:", userData);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkSession();

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const togglePasswordBtn = document.querySelector(".toggle-password");
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      togglePassword("password", togglePasswordBtn);
    });
  }

  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("input", () => {
      if (emailInput.value.trim() !== "") {
        clearError();
      }
    });
  }

  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      if (passwordInput.value !== "") {
        clearError();
      }
    });
  }
});
