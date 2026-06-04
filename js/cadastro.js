function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';

    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

function clearError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    
    clearError();
    
    if (!name || !email || !password || !confirmPassword) {
        Swal.fire({ icon: 'error', title: 'Campos incompletos', text: 'Por favor, preencha todos os campos!', confirmButtonColor: '#3b82f6' });
        return;
    }
    

    if (name.length < 3) {
        Swal.fire({ icon: 'error', title: 'Nome inválido', text: 'Nome completo deve ter pelo menos 3 caracteres!', confirmButtonColor: '#3b82f6' });
        return;
    }
    
    
    if (!isValidEmail(email)) {
        Swal.fire({ icon: 'error', title: 'E-mail inválido', text: 'Por favor, insira um e-mail válido!', confirmButtonColor: '#3b82f6' });
        return;
    }
    
    
    if (password.length < 6) {
        Swal.fire({ icon: 'error', title: 'Senha fraca', text: 'A senha deve ter pelo menos 6 caracteres!', confirmButtonColor: '#3b82f6' });
        return;
    }
    

    if (password !== confirmPassword) {
        Swal.fire({ icon: 'error', title: 'Senhas não coincidem', text: 'As senhas digitadas não são iguais!', confirmButtonColor: '#3b82f6' });
        return;
    }
    
   
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
   
    const emailExists = users.some(user => user.email === email);
    
    if (emailExists) {
        Swal.fire({ icon: 'error', title: 'E-mail já cadastrado', text: 'Este e-mail já está cadastrado!', confirmButtonColor: '#3b82f6' });
        return;
    }
   
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    localStorage.setItem('users', JSON.stringify(users));
    
    
    Swal.fire({ icon: 'success', title: 'Cadastro realizado!', text: 'Conta criada com sucesso! Redirecionando...', timer: 2000, showConfirmButton: false });
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function togglePassword(inputId, toggleElement) {
    const passwordInput = document.getElementById(inputId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleElement.textContent = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleElement.textContent = '👁️';
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const togglePasswordBtn = document.querySelector('.toggle-password');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            togglePassword('password', togglePasswordBtn);
        });
    }
    
    const toggleConfirmPasswordBtn = document.querySelector('.toggle-confirm-password');
    if (toggleConfirmPasswordBtn) {
        toggleConfirmPasswordBtn.addEventListener('click', () => {
            togglePassword('confirmPassword', toggleConfirmPasswordBtn);
        });
    }
    
    const inputs = ['fullname', 'email', 'password', 'confirmPassword'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', () => {
                clearError();
            });
        }
    });
});