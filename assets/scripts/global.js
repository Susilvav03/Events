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

// Constants
const APP_URL = "http://localhost:3000";

// Subscribed emails elements
// --------------------------
const subscribedButton = document.getElementById('subscriptButton')
const subscribedEmailInput = document.getElementById('subscribedEmail')
if (subscribedButton && subscribedEmailInput) {
    subscribedButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = subscribedEmailInput.value.trim();
        if (!email) {
            alert("Please enter a valid email");
            return;
        }
        await saveSubscribedEmails(email);
    })
}


// Contact elements
// ----------------
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const sendMessageButton = document.getElementById('send-message');
const Messages = document.getElementById('contact-messages');
const searchEmailButton = document.getElementById('search-email');

// Subscribed emails elements
// --------------------------
const showEmails = document.getElementById("emails-subscribed")

// Desktop elements
// ----------------
const activeEvents = document.getElementById('active-events');
const inactiveEvents = document.getElementById('inactive-events');
const cancelledEvents = document.getElementById('cancelled-events');
const totalEvents = document.getElementById('total-events');
const registeredEmails = document.getElementById('registered-emails');
const contactMessagesCount = document.getElementById('contact-messages-count');

// Events

// Contact Messages
// -----------------

// Load contact messages on page load
document.addEventListener('DOMContentLoaded', () => {
    //showContactMessages();
});

// Search by email button click event
if(searchEmailButton) {
    searchEmailButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await searchContactByEmail();
});
}

// Store contact message button click event
if (sendMessageButton) {
sendMessageButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await storeContactMessage(contactName.value, contactEmail.value, contactMessage.value);
});
}

// Subscribed emails
// -----------------    

// Save subscribed email button click event
if (subscribedButton) {
subscribedButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await saveSubscribedEmails(subscribedEmailInput.value);
})
}


// Desktop
// --------

// Show contact messages count on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log("fgfgg");
    
    showContactMessagesCount();
});

document.addEventListener('DOMContentLoaded', () => {
    showEmailsSubscribed();
});

    document.addEventListener('DOMContentLoaded', () => {
        showEmailsSubscribed();
    });


    // Functions 

    // Contact Messages
    // -----------------

    // Save new contact message
    async function storeContactMessage(name, email, content) {
        // Validate inputs
        if (!name || !email || !content) {
            console.error("All fields are required.");
            return;
        }
        // Add contact message to the backend
        try {
            const res = await fetch(APP_URL + "/contact-messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    date: new Date().toISOString().split('T')[0],
                    content: content,
                    email: email
                })
            });

        } catch (error) {
            // Handle errors
            console.error(`Error storing contact message: ${error}`);
        }
    }

    // Show contact messages
    async function showContactMessages() {
        try {
            const res = await fetch(APP_URL + "/contact-messages");
            const messages = await res.json();
            Messages.innerHTML = ''; // Clear previous messages

            messages.forEach(message => {
                const messageElement = document.createElement('article');
                messageElement.className = 'card p-5 mx-5';
                messageElement.innerHTML = `
               
                <header class="card-header">
                    <p class="card-header-title">${message.name}</p>
                    <time datetime="${message.date}" class="has-text-left-tablet has-text-left-mobile px-5">${message.date}</time>
                </header>
                <div class="card-content">
                    <div class="content">
                        ${message.content}
                    </div>
                </div>
                <footer class="card-footer">
                    <a href="mailto:${message.email}" class="card-footer-item">${message.email}</a>
                </footer>
                    
            `;
                Messages.appendChild(messageElement);
            });

        } catch (error) {
            console.error(`Error fetching contact messages: ${error}`);
        }
    }

    // Search contact messages by email
    async function searchContactByEmail() {
        const email = prompt("Enter the email to search:").trim().toLowerCase();

        if (!email) {
            console.error("Please enter an email to search.");
            return;
        }

        try {
            const res = await fetch(`${APP_URL}/contact-messages?email=${encodeURIComponent(email)}`);
            const data = await res.json();

            Messages.innerHTML = ''; // Clear previous messages
            data.forEach(message => {
                const messageElement = document.createElement('article');
                messageElement.className = 'card p-5 mx-5';
                messageElement.innerHTML = `
               
                <header class="card-header">
                    <p class="card-header-title">${message.name}</p>
                    <time datetime="${message.date}" class="has-text-left-tablet has-text-left-mobile px-5">${message.date}</time>
                </header>
                <div class="card-content">
                    <div class="content">
                        ${message.content}
                    </div>
                </div>
                <footer class="card-footer">
                    <a href="mailto:${message.email}" class="card-footer-item">${message.email}</a>
                </footer>
                    
            `;
                Messages.appendChild(messageElement);
            });

        } catch (error) {
            console.error(`Error fetching contact messages by email: ${error}`);
        }
    }

    // Subscribed Emails
    // -----------------

    // Save subscribed emails
    async function saveSubscribedEmails(email) {
        if (!email) {
            console.error("Email is required");
            return;
        }

        try {
            const res = await fetch(APP_URL + "/suscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    date: new Date().toISOString().split('T')[0],
                })
            });
        } catch (error) {
            // Handle errors
            console.error(`Error storing contact message: ${error}`);
        }
    }

async function showEmailsSubscribed() {
    const res = await fetch(APP_URL + "/suscription");
    const emails = await res.json();
    showEmails.innerHTML = '';

    emails.forEach(email => {
        const emailElement = document.createElement('tr');
        emailElement.className = 'emails';
        emailElement.innerHTML = `
                <td>${email.id}</td>
                <td><a href="mailto:${email.email}">${email.email}</a></td>
                <td>${email.date}</td>
                <td></td>
        `;
        showEmails.appendChild(emailElement)
    })

    }


    // Desktop page
    // ---------------

// show number of contact messages
async function showContactMessagesCount() {
    try {
        const res = await fetch(APP_URL + "/contact-messages");
        const messages = await res.json();

        console.log(`Total contact messages: ${messages.length}`);
        
        contactMessagesCount.innerHTML = "";
        contactMessagesCount.innerHTML = messages.length;
    } catch (error) {
        console.error(`Error fetching contact messages count: ${error}`);
    }
}

    // Show registered emails
    // Show active events
    // Show inactive events
    // show cancelled events
    // Show total events

