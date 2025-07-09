// Contenido de signIn.js de la respuesta anterior, que ya incluye la verificación contra db.json
document.addEventListener('DOMContentLoaded', () => {
    const navbarBurger = document.getElementById('navbarBurger');
    const navbarMenu = document.getElementById('navbarMenu');

    if (navbarBurger && navbarMenu) {
        navbarBurger.addEventListener('click', () => {
            navbarBurger.classList.toggle('is-active');
            navbarMenu.classList.toggle('is-active');
        });
    }

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    const showError = (element, message) => {
        element.textContent = message;
        element.style.display = 'block';
        const inputControl = element.previousElementSibling;
        if (inputControl && inputControl.querySelector('input')) {
            inputControl.querySelector('input').classList.add('is-danger');
        }
    };

    const hideError = (element) => {
        element.textContent = '';
        element.style.display = 'none';
        const inputControl = element.previousElementSibling;
        if (inputControl && inputControl.querySelector('input')) {
            inputControl.querySelector('input').classList.remove('is-danger');
        }
    };

    loginForm.addEventListener('submit', async (event) => { // 'async' es importante aquí
        event.preventDefault();

        let isValid = true;

        hideError(usernameError);
        hideError(passwordError);

        if (usernameInput.value.trim() === '') {
            showError(usernameError, 'Username is required.');
            isValid = false;
        } else if (!usernameInput.value.trim().endsWith('@riwi.io')) {
            showError(usernameError, 'The email must end with "@riwi.io".');
            isValid = false;
        }

        if (passwordInput.value.trim() === '') {
            showError(passwordError, 'Password is required.');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await fetch('http://localhost:3000/users');
                if (response.ok) {
                    const users = await response.json();
                    const foundUser = users.find(user => 
                        user.email === usernameInput.value.trim() && 
                        user.password === passwordInput.value.trim()
                    );

                    if (foundUser) {
                        alert('Login successful! Redirecting to desktop...');
                        window.location.href = '../desktop/desktop.html';
                    } else {
                        showError(usernameError, 'Invalid email or password.');
                        showError(passwordError, 'Invalid email or password.');
                    }
                } else {
                    console.error('Failed to fetch users:', response.statusText);
                    alert('Login failed. Could not connect to user database.');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please check if the server is running.');
            }
        }
    });

    usernameInput.addEventListener('blur', () => {
        if (usernameInput.value.trim() === '') {
            hideError(usernameError); 
        } else if (!usernameInput.value.trim().endsWith('@riwi.io')) {
            showError(usernameError, 'The email must end with "@riwi.io".');
        } else {
            hideError(usernameError);
        }
    });

    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value.trim() === '') {
            hideError(passwordError); 
        } else {
            hideError(passwordError);
        }
    });
});