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

    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

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

    const isValidEmail = (email) => {
        const emailFormatRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailFormatRegex.test(String(email).toLowerCase()) && String(email).toLowerCase().endsWith('@riwi.io');
    };

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        let isValid = true;

        hideError(nameError);
        hideError(emailError);
        hideError(passwordError);
        hideError(confirmPasswordError);

        if (nameInput.value.trim() === '') {
            showError(nameError, 'Full Name is required.');
            isValid = false;
        }

        if (emailInput.value.trim() === '') {
            showError(emailError, 'Email Address is required.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailError, 'Please enter a valid @riwi.io email address.');
            isValid = false;
        }

        if (passwordInput.value.trim() === '') {
            showError(passwordError, 'Password is required.');
            isValid = false;
        } else if (passwordInput.value.length < 6) { 
            showError(passwordError, 'Password must be at least 6 characters long.');
            isValid = false;
        }

        if (confirmPasswordInput.value.trim() === '') {
            showError(confirmPasswordError, 'Confirm Password is required.');
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordError, 'Passwords do not match.');
            isValid = false;
        }

        if (isValid) {
            alert('Registration successful! (Form not actually submitted)');
        }
    });

    emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim() !== '' && !isValidEmail(emailInput.value.trim())) {
            showError(emailError, 'Please enter a valid @riwi.io email address.');
        } else {
            hideError(emailError);
        }
    });

    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value.trim() !== '' && passwordInput.value.length < 6) {
            showError(passwordError, 'Password must be at least 6 characters long.');
        } else {
            hideError(passwordError);
        }
    });

    confirmPasswordInput.addEventListener('blur', () => {
        if (confirmPasswordInput.value.trim() !== '' && passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordError, 'Passwords do not match.');
        } else {
            hideError(confirmPasswordError);
        }
    });
});