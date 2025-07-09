document.addEventListener('DOMContentLoaded', () => {
    // Get references to the navbar elements
    const navbarBurger = document.getElementById('navbarBurger');
    const navbarMenu = document.getElementById('navbarMenu');

    // Add click event listener to the navbar burger for mobile menu toggle
    if (navbarBurger && navbarMenu) {
        navbarBurger.addEventListener('click', () => {
            navbarBurger.classList.toggle('is-active');
            navbarMenu.classList.toggle('is-active');
        });
    }

    // Get references to the registration form elements
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');

    // Get references to the error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Function to display an error message
    const showError = (element, message) => {
        element.textContent = message;
        element.style.display = 'block';
        const inputControl = element.previousElementSibling;
        if (inputControl && inputControl.querySelector('input')) {
            inputControl.querySelector('input').classList.add('is-danger');
        }
    };

    // Function to hide an error message
    const hideError = (element) => {
        element.textContent = '';
        element.style.display = 'none';
        const inputControl = element.previousElementSibling;
        if (inputControl && inputControl.querySelector('input')) {
            inputControl.querySelector('input').classList.remove('is-danger');
        }
    };

    // Function to validate email format and domain
    const isValidEmail = (email) => {
        const emailFormatRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailFormatRegex.test(String(email).toLowerCase()) && String(email).toLowerCase().endsWith('@riwi.io');
    };

    // Check if email already exists
    const emailExists = async (email) => {
        try {
            const response = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const users = await response.json();
                return users.length > 0;
            }
            console.error('Error checking email existence:', response.statusText);
            return false;
        } catch (error) {
            console.error('Network error checking email existence:', error);
            return false;
        }
    };

    // Submit event listener
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        let isValid = true;

        // Hide previous errors
        hideError(nameError);
        hideError(emailError);
        hideError(passwordError);
        hideError(confirmPasswordError);

        // Validate name
        if (nameInput.value.trim() === '') {
            showError(nameError, 'Full Name is required.');
            isValid = false;
        }

        // Validate email
        const emailValue = emailInput.value.trim();
        if (emailValue === '') {
            showError(emailError, 'Email Address is required.');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailError, 'Please enter a valid @riwi.io email address.');
            isValid = false;
        } else {
            const exists = await emailExists(emailValue);
            if (exists) {
