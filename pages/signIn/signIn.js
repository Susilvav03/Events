document.addEventListener('DOMContentLoaded', () => {
    const navbarBurger = document.getElementById('navbarBurger');
    const navbarMenu = document.getElementById('navbarMenu');

    if (navbarBurger && navbarMenu) {
        navbarBurger.addEventListener('click', () => {
            navbarBurger.classList.toggle('is-active');
            navbarMenu.classList.toggle('is-active');
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.textContent = 'Light Theme';
    } else {
        themeToggle.textContent = 'Dark Theme';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light')) {
                body.classList.remove('light');
                body.classList.add('dark');
                themeToggle.textContent = 'Light Theme';
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark');
                body.classList.add('light');
                themeToggle.textContent = 'Dark Theme';
                localStorage.setItem('theme', 'light');
            }
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

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        let isValid = true;

        hideError(usernameError);
        hideError(passwordError);

        if (usernameInput.value.trim() === '') {
            showError(usernameError, 'Username is required.');
            isValid = false;
        }

        if (passwordInput.value.trim() === '') {
            showError(passwordError, 'Password is required.');
            isValid = false;
        }

        if (isValid) {
            alert('Login successful! (Form not actually submitted)');
        }
    });

    usernameInput.addEventListener('blur', () => {
        if (usernameInput.value.trim() === '') {
            showError(usernameError, 'Username is required.');
        } else {
            hideError(usernameError);
        }
    });

    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value.trim() === '') {
            showError(passwordError, 'Password is required.');
        } else {
            hideError(passwordError);
        }
    });
});