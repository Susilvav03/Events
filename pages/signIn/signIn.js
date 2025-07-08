document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Burger Toggle ---
    const navbarBurger = document.getElementById('navbarBurger');
    const navbarMenu = document.getElementById('navbarMenu');

    if (navbarBurger && navbarMenu) {
        navbarBurger.addEventListener('click', () => {
            navbarBurger.classList.toggle('is-active');
            navbarMenu.classList.toggle('is-active');
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to light
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
            // IMPORTANT: You need to define CSS rules for .light and .dark classes
            // in your signIn.css (or a shared global.css) for the visual theme change to work.
        });
    }

    // --- Form Validation for Login Page ---
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    // Function to show an error message
    const showError = (element, message) => {
        element.textContent = message;
        element.style.display = 'block'; // Make the error message visible
        const inputControl = element.previousElementSibling; // This is the .control div
        if (inputControl && inputControl.querySelector('input')) {
            inputControl.querySelector('input').classList.add('is-danger');
        }
    };

    // Function to hide an error message
    const hideError = (element) => {
        element.textContent = '';
        element.style.display = 'none'; // Hide the error message
        const inputControl = element.previousElementSibling; // This is the .control div
        if (inputControl && inputControl.querySelector('input')) {
            inputControl.querySelector('input').classList.remove('is-danger');
        }
    };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        let isValid = true;

        // Reset all errors first
        hideError(usernameError);
        hideError(passwordError);

        // Validate Username
        if (usernameInput.value.trim() === '') {
            showError(usernameError, 'Username is required.');
            isValid = false;
        }

        // Validate Password
        if (passwordInput.value.trim() === '') {
            showError(passwordError, 'Password is required.');
            isValid = false;
        }

        if (isValid) {
            alert('Login successful! (Form not actually submitted)');
            // In a real application, you would typically send this data to a server:
            // fetch('/api/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         username: usernameInput.value,
            //         password: passwordInput.value
            //     })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data.success) {
            //         alert('Login successful!');
            //         // Redirect to a dashboard or main application page
            //         window.location.href = '../desktop/desktop.html'; // Example redirect
            //     } else {
            //         // Show error message from server (e.g., invalid credentials)
            //         showError(passwordError, data.message || 'Invalid username or password.');
            //     }
            // })
            // .catch(error => {
            //     console.error('Error during login:', error);
            //     showError(passwordError, 'An error occurred. Please try again.');
            // });
        }
    });

    // Real-time validation feedback on blur
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