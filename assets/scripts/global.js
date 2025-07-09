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

    if (themeToggleBtn) { // Added check to ensure the button exists
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('theme', 'light-theme');
            } else {
                body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('theme', 'dark-theme');
            }
        });
    }
    // ... rest of your DOMContentLoaded code
});

// Constants
const APP_URL = "http://localhost:3000";

// Subscribed emails elements
// --------------------------
const subscribedButton = document.getElementById('subscriptButton')
const subscribedEmailInput = document.getElementById('subscribedEmail')

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


// Events Management elements
// --------------------------
const eventsTableBody = document.getElementById('events-table-body'); // New: for displaying events

const newEventButton = document.getElementById('new-event');
const searchEventButton = document.getElementById('search-event'); // NEW: Search event button

const newEventModal = document.getElementById('new-event-modal');
const cancelNewEventButton = document.getElementById('cancel-new-event-button'); // Renamed ID
const saveEventButton = document.getElementById('save-event-button');
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');
const eventLocationInput = document.getElementById('event-location');
const eventPriceInput = document.getElementById('event-price');
const eventStatusSelect = document.getElementById('event-status');

const editEventModal = document.getElementById('edit-event-modal'); // New
const editEventIdInput = document.getElementById('edit-event-id'); // New
const editEventNameInput = document.getElementById('edit-event-name'); // New
const editEventDateInput = document.getElementById('edit-event-date'); // New
const editEventLocationInput = document.getElementById('edit-event-location'); // New
const editEventPriceInput = document.getElementById('edit-event-price'); // New
const editEventStatusSelect = document.getElementById('edit-event-status'); // New
const updateEventButton = document.getElementById('update-event-button'); // New
const cancelEditEventButton = document.getElementById('cancel-edit-event-button'); // New


// Events
// -------

// Load events on page load
document.addEventListener('DOMContentLoaded', () => {
    showEvents(); // Display events in the table
});

// Open new event modal
if (newEventButton) {
    newEventButton.addEventListener('click', () => {
        newEventModal.classList.add('is-active');
    });
}

// Close new event modal
document.querySelectorAll('.modal-background, .modal-close, #cancel-new-event-button').forEach(button => {
    button.addEventListener('click', () => {
        newEventModal.classList.remove('is-active');
        clearEventForm(); // Clear the form when closing
    });
});

// Save new event
if (saveEventButton) {
    saveEventButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const name = eventNameInput.value.trim();
        const date = eventDateInput.value;
        const location = eventLocationInput.value.trim();
        const price = parseFloat(eventPriceInput.value);
        const status = eventStatusSelect.value;

        if (!name || !date || !location || isNaN(price)) {
            alert("Please fill in all event fields correctly.");
            return;
        }

        await storeEvent(name, date, location, price, status);
        newEventModal.classList.remove('is-active');
        clearEventForm();
        await showEvents(); // Refresh the events list after adding
    });
}

// Open edit event modal and populate with data
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('edit-event-button')) {
        const eventId = event.target.dataset.id;
        await populateEditEventModal(eventId);
        editEventModal.classList.add('is-active');
    }
    // Handle delete button click
    if (event.target.classList.contains('delete-event-button')) {
        const eventId = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(eventId);
            await showEvents(); // Refresh the events list after deleting
        }
    }
});

// Close edit event modal
document.querySelectorAll('#edit-event-modal .modal-background, #edit-event-modal .modal-close, #cancel-edit-event-button').forEach(button => {
    button.addEventListener('click', () => {
        editEventModal.classList.remove('is-active');
    });
});

// Update event
if (updateEventButton) {
    updateEventButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const eventId = editEventIdInput.value;
        const name = editEventNameInput.value.trim();
        const date = editEventDateInput.value;
        const location = editEventLocationInput.value.trim();
        const price = parseFloat(editEventPriceInput.value);
        const status = editEventStatusSelect.value;

        if (!name || !date || !location || isNaN(price)) {
            alert("Please fill in all event fields correctly.");
            return;
        }

        await updateEvent(eventId, name, date, location, price, status);
        editEventModal.classList.remove('is-active');
        await showEvents(); // Refresh the events list after updating
    });
}

// NEW: Search event by name
if (searchEventButton) {
    searchEventButton.addEventListener('click', async () => {
        const query = prompt("Enter event name to search:").trim();
        if (query) {
            await searchEventsByName(query);
        } else if (query === "") {
            await showEvents(); // If search box is empty, show all events
        }
    });
}


// Contact Messages
// -----------------

// Load contact messages on page load
document.addEventListener('DOMContentLoaded', () => {
    showContactMessages();
});

// Search by email button click event
if (searchEmailButton) {
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

// Desktop
// --------

// Show contact messages count on page load
document.addEventListener('DOMContentLoaded', () => {
    showContactMessagesCount();
});

// Show registered emails count on page load
document.addEventListener('DOMContentLoaded', () => {
    showEmailsCount();
});

// Show events count on page load
document.addEventListener('DOMContentLoaded', () => {
    showEventsCount();
});

// Show subscribed emails on page load
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
            const messageElement = document.createElement('div');
            messageElement.className = 'column is-full';
            messageElement.innerHTML = `
                <article class="card p-5">
                    <header class="card-header">
                        <p class="card-header-title">${message.name}</p>
                        <time datetime="${message.date}"
                            class="has-text-left-tablet has-text-left-mobile px-5">${message.date}</time>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            "${message.content}"
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="mailto:${message.email}"
                            class="card-footer-item">${message.email}</a>
                    </footer>
                </article>
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
            const messageElement = document.createElement('div');
            messageElement.className = 'column is-full';
            messageElement.innerHTML = `
                <article class="card p-5">
                    <header class="card-header">
                        <p class="card-header-title">${message.name}</p>
                        <time datetime="${message.date}"
                            class="has-text-left-tablet has-text-left-mobile px-5">${message.date}</time>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            "${message.content}"
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="mailto:${message.email}"
                            class="card-footer-item">${message.email}</a>
                    </footer>
                </article>

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
                <td>Active</td>
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

        contactMessagesCount.innerHTML = "";
        contactMessagesCount.innerHTML = messages.length;
    } catch (error) {
        console.error(`Error fetching contact messages count: ${error}`);
    }
}

// show number of registered emails
async function showEmailsCount() {
    try {
        const res = await fetch(APP_URL + "/suscription");
        const emails = await res.json();

        registeredEmails.innerHTML = "";
        registeredEmails.innerHTML = emails.length;
    } catch (error) {
        console.error(`Error fetching contact messages count: ${error}`);
    }
}

// Show active events
// Show inactive events
// show cancelled events
// Show total events
async function showEventsCount() {
    try {
        const res = await fetch(APP_URL + "/events")
        const events = await res.json()
        const active = events.filter(event => event.status === "active")
        const inactive = events.filter(event => event.status === "inactive")
        const cancelled = events.filter(event => event.status === "cancelled")
        activeEvents.innerHTML = active.length;
        inactiveEvents.innerHTML = inactive.length;
        cancelledEvents.innerHTML = cancelled.length;
        totalEvents.innerHTML = events.length;
    } catch (error) {
        console.error(`Error fetching events count: ${error}`);
    }
}


// Event Management Functions
// --------------------------

// Function to display events in the table
async function showEvents(eventsToDisplay = null) {
    try {
        const events = eventsToDisplay || await (await fetch(APP_URL + "/events")).json();
        eventsTableBody.innerHTML = ''; // Clear existing table rows

        if (events.length === 0) {
            eventsTableBody.innerHTML = '<tr><td colspan="5" class="has-text-centered">No events found.</td></tr>';
            return;
        }

        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.location}</td>
                <td>${event.status}</td>
                <td>
                    <button class="button is-small is-info mr-1 edit-event-button" data-id="${event.id}">Edit</button>
                    <button class="button is-small is-danger delete-event-button" data-id="${event.id}">Delete</button>
                </td>
            `;
            eventsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error(`Error fetching or displaying events: ${error}`);
    }
}

// Function to store a new event
async function storeEvent(name, date, location, price, status) {
    try {
        const res = await fetch(APP_URL + "/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                date: date,
                location: location,
                price: price,
                status: status
            })
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const newEvent = await res.json();
        console.log('New event added:', newEvent);
    } catch (error) {
        console.error(`Error storing event: ${error}`);
    }
}

// Function to populate the edit event modal with data
async function populateEditEventModal(eventId) {
    try {
        const res = await fetch(`${APP_URL}/events/${eventId}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const eventData = await res.json();

        editEventIdInput.value = eventData.id;
        editEventNameInput.value = eventData.name;
        editEventDateInput.value = eventData.date;
        editEventLocationInput.value = eventData.location;
        editEventPriceInput.value = eventData.price;
        editEventStatusSelect.value = eventData.status;

    } catch (error) {
        console.error(`Error fetching event data for edit: ${error}`);
    }
}

// Function to update an event
async function updateEvent(id, name, date, location, price, status) {
    try {
        const res = await fetch(`${APP_URL}/events/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                date: date,
                location: location,
                price: price,
                status: status
            })
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const updatedEvent = await res.json();
        console.log('Event updated:', updatedEvent);
    } catch (error) {
        console.error(`Error updating event: ${error}`);
    }
}

// Function to delete an event
async function deleteEvent(id) {
    try {
        const res = await fetch(`${APP_URL}/events/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        console.log('Event deleted successfully.');
    } catch (error) {
        console.error(`Error deleting event: ${error}`);
    }
}

// NEW: Function to search events by name
async function searchEventsByName(query) {
    try {
        const res = await fetch(`${APP_URL}/events?name_like=${encodeURIComponent(query)}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const filteredEvents = await res.json();
        showEvents(filteredEvents); // Display the filtered events
    } catch (error) {
        console.error(`Error searching events by name: ${error}`);
        eventsTableBody.innerHTML = '<tr><td colspan="5" class="has-text-centered">Error searching events.</td></tr>';
    }
}

// Function to clear the new event form fields
function clearEventForm() {
    eventNameInput.value = '';
    eventDateInput.value = '';
    eventLocationInput.value = '';
    eventPriceInput.value = '';
    eventStatusSelect.value = 'active'; // Reset to default
}