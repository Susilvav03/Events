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
            // in your signUp.css for the visual theme change to work.
        });
    }

    // --- Form Validation for Register Page ---
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

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

    // Email validation including @riwi.io domain check
    const isValidEmail = (email) => {
        const emailFormatRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailFormatRegex.test(String(email).toLowerCase()) && String(email).toLowerCase().endsWith('@riwi.io');
    };

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        let isValid = true;

        // Reset all errors first
        hideError(nameError);
        hideError(emailError);
        hideError(passwordError);
        hideError(confirmPasswordError);

        // Validate Full Name
        if (nameInput.value.trim() === '') {
            showError(nameError, 'Full Name is required.');
            isValid = false;
        }

        // Validate Email
        if (emailInput.value.trim() === '') {
            showError(emailError, 'Email Address is required.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailError, 'Please enter a valid @riwi.io email address.');
            isValid = false;
        }

        // Validate Password
        if (passwordInput.value.trim() === '') {
            showError(passwordError, 'Password is required.');
            isValid = false;
        } else if (passwordInput.value.length < 6) { 
            showError(passwordError, 'Password must be at least 6 characters long.');
            isValid = false;
        }

        // Validate Confirm Password
        if (confirmPasswordInput.value.trim() === '') {
            showError(confirmPasswordError, 'Confirm Password is required.');
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordError, 'Passwords do not match.');
            isValid = false;
        }

        if (isValid) {
            alert('Registration successful! (Form not actually submitted)');
            // In a real application, you would typically send this data to a server:
            // registerForm.submit(); // To submit the form normally (if action points to a server endpoint)
            // OR use fetch API for AJAX submission:
            // fetch('/api/register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         fullName: nameInput.value,
            //         email: emailInput.value,
            //         password: passwordInput.value
            //     })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if (data.success) {
            //         alert('Registration successful!');
            //         window.location.href = '../signIn/signIn.html'; // Redirect to login page
            //     } else {
            //         // Handle server-side errors
            //         alert('Registration failed: ' + (data.message || 'Unknown error.'));
            //     }
            // })
            // .catch(error => {
            //     console.error('Error during registration:', error);
            //     alert('An error occurred during registration. Please try again.');
            // });
        }
    });

    // Real-time validation feedback on blur for email, password, confirm password
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