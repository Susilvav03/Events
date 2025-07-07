document.addEventListener('DOMContentLoaded', () => {
    // Navbar burger functionality
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }   

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        // Default to dark theme if no preference is saved
        body.classList.add('dark-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
    });
});

// Contact Messages Page

// Constants
const APP_URL = "http://localhost:3000";
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const sendMessageButton = document.getElementById('send-message');
const Messages = document.getElementById('contact-messages');
const searchEmailButton = document.getElementById('search-email');

// Events

// Load contact messages on page load

// Search by email button click event

// Store contact message button click event
sendMessageButton.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent form submission

    // Validate inputs
    if (!contactName.value || !contactEmail.value || !contactMessage.value) {
        console.error("All fields are required.");
        return;
    }

    // Save new contact message
    await storeContactMessage(contactName.value, contactEmail.value, contactMessage.value);
});

// Functions 

// Save new contact message

async function storeContactMessage(name, email, content) {
    try {
        const res = await fetch(APP_URL +"/contact-messages", {
            "method": "POST",
            "Content-Type": "application/json",
            "body": JSON.stringify({
                "name" : contactName.value,
                "date" : new Date().toISOString().split('T')[0],
                "content" : contactMessage.value,
                "email" : contactEmail.value
            })
        });

        console.log(`Contact message stored: ${res.status} ${res.statusText}`);
        
    } catch (error) {
        console.error(`Error storing contact message: ${error}`);
    }
}



