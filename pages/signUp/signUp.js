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
        element.textContent = message; // Set the error message text
        element.style.display = 'block'; // Make the error message visible
        const inputControl = element.previousElementSibling; // Get the parent div of the input
        if (inputControl && inputControl.querySelector('input')) {
            // Add 'is-danger' class to the input field if it exists
            inputControl.querySelector('input').classList.add('is-danger');
        }
    };

    // Function to hide an error message
    const hideError = (element) => {
        element.textContent = ''; // Clear the error message text
        element.style.display = 'none'; // Hide the error message
        const inputControl = element.previousElementSibling; // Get the parent div of the input
        if (inputControl && inputControl.querySelector('input')) {
            // Remove 'is-danger' class from the input field if it exists
            inputControl.querySelector('input').classList.remove('is-danger');
        }
    };

    // Function to validate email format and domain
    const isValidEmail = (email) => {
        const emailFormatRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailFormatRegex.test(String(email).toLowerCase()) && String(email).toLowerCase().endsWith('@riwi.io');
    };

    // --- NEW FUNCTION: Check if email already exists ---
    const emailExists = async (email) => {
        try {
            const response = await fetch(`http://localhost:3000/users?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const users = await response.json();
                return users.length > 0; // If length > 0, email exists
            }
            console.error('Error checking email existence:', response.statusText);
            return false; // Assume not existing if there's an error
        } catch (error) {
            console.error('Network error checking email existence:', error);
            return false; // Assume not existing if there's a network error
        }
    };

    // Add submit event listener to the registration form
    registerForm.addEventListener('submit', async (event) => { // Added 'async' keyword
        event.preventDefault(); // Prevent the default form submission

        let isValid = true; // Flag to track overall form validity

        // Hide any existing error messages before re-validation
        hideError(nameError);
        hideError(emailError);
        hideError(passwordError);
        hideError(confirmPasswordError);

        // Validate Full Name field
        if (nameInput.value.trim() === '') {
            showError(nameError, 'Full Name is required.');
            isValid = false;
        }

        // Validate Email Address field
        const emailValue = emailInput.value.trim(); // Get email value once
        if (emailValue === '') {
            showError(emailError, 'Email Address is required.');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailError, 'Please enter a valid @riwi.io email address.');
            isValid = false;
        } else {
            // Check if email already exists ONLY if preliminary email format is valid
            const exists = await emailExists(emailValue);
            if (exists) {
                showError(emailError, 'This email is already registered. Please use a different one or log in.');
                isValid = false;
            }
        }

        // Validate Password field
        if (passwordInput.value.trim() === '') {
            showError(passwordError, 'Password is required.');
            isValid = false;
        } else if (passwordInput.value.length < 6) { 
            showError(passwordError, 'Password must be at least 6 characters long.');
            isValid = false;
        }

        // Validate Confirm Password field
        if (confirmPasswordInput.value.trim() === '') {
            showError(confirmPasswordError, 'Confirm Password is required.');
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordError, 'Passwords do not match.');
            isValid = false;
        }

        // If all validations pass, attempt to save the user
        if (isValid) {
            const newUser = {
                name: nameInput.value.trim(),
                email: emailValue, // Use the already trimmed email
                password: passwordInput.value.trim()
            };

            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Registration successful! Redirecting to login...');
                    console.log('User registered:', data);
                    // --- Crucial: Ensure redirection happens AFTER alert and successful save ---
                    window.location.href = '../signIn/signIn.html'; 
                } else {
                    // Handle non-OK responses from json-server (e.g., if server is down or other issues)
                    alert('Registration failed. Server responded with an error. Please try again.');
                    console.error('Registration error:', response.status, response.statusText);
                }
            } catch (error) {
                // Handle network errors (e.g., json-server not running)
                console.error('Error during registration (network or server issue):', error);
                alert('An error occurred during registration. Please ensure the server (json-server) is running at http://localhost:3000.');
            }
        }
    });

    // Add blur event listeners for real-time validation feedback
    emailInput.addEventListener('blur', async () => { // Added 'async'
        const emailValue = emailInput.value.trim();
        if (emailValue === '') {
            hideError(emailError); 
        } else if (!isValidEmail(emailValue)) {
            showError(emailError, 'Please enter a valid @riwi.io email address.');
        } else {
            const exists = await emailExists(emailValue); // Check existence on blur
            if (exists) {
                showError(emailError, 'This email is already registered. Please use a different one or log in.');
            } else {
                hideError(emailError); 
            }
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