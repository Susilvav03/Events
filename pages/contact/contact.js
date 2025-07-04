// Constants
const contactMessages = document.getElementById('contact-messages');
const searchEmailButton = document.getElementById('search-email');

// Events
searchEmailButton.addEventListener('click', () => {
    const email = prompt('Enter the email to search for messages:');
    if (email) {
        searchByEmail(email);
    }
});

// Save new contact message


// Search by email
async function searchByEmail(email) {
    const response = await fetch(`https://api.example.com/contact-messages?email=${email}`);
    const messages = await response.json();
    displayMessages(messages);
}

// Show contact messages
async function showContactMessages() {
    try {
        const response = await fetch('https://api.example.com/contact-messages');
        const messages = response.json();

        const card = document.createElement('article');
        card.className = 'card p-5 mx-5';

        card.innerHTML = `
            <header class="card-header">
                <p class="card-header-title">${messages.name}</p>
                <time datetime="${messages.date}" class="has-text-left-tablet has-text-left-mobile px-5">${messages.date}</time>
            </header>
            <div class="card-content">
                <div class="content">
                    ${messages.content}
                </div>
            </div>
            <footer class="card-footer">
                <a href="mailto:${messages.email}" class="card-footer-item">${messages.email}</a>
            </footer>
        `;

        contactMessages.appendChild(card);
        return contactMessages;
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        contactMessages.innerHTML = '<div class="error">Failed to load messages.</div>';
    }
}

