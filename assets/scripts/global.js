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

    // Load active events on index.html if the container exists
    if (activeEventsContainer) { // Now targeting the existing #events div
        showActiveEvents();
    }

    // Load contact messages on page load (only if Messages exists in contact.html)
    if (Messages) {
        showContactMessages();
    }

    // Show contact messages count on page load (only if contactMessagesCount exists in desktop.html)
    if (contactMessagesCount) {
        showContactMessagesCount();
    }

    // Show registered emails count on page load (only if registeredEmails exists in desktop.html)
    if (registeredEmails) {
        showEmailsCount();
    }

    // Show events count on page load (only if activeEvents, etc. exist in desktop.html)
    if (activeEvents && inactiveEvents && cancelledEvents && totalEvents) {
        showEventsCount();
    }

    // Show subscribed emails on page load (only if showEmails exists in suscription.html)
    if (showEmails) {
        showEmailsSubscribed();
    }

    // Load events on eventManagement page load (only if eventsTableBody exists)
    if (eventsTableBody) {
        showEvents(); // Display events in the table
    }
});


// Constants
const APP_URL = "http://localhost:3000";

// Subscribed emails elements (used in index.html footer and suscription.html)
// --------------------------
const subscribedButton = document.getElementById('subscriptButton')
const subscribedEmailInput = document.getElementById('subscribedEmail')

// Contact elements (used in contact.html and index.html contact form)
// ----------------
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const sendMessageButton = document.getElementById('send-message');
const Messages = document.getElementById('contact-messages'); // Container for messages in contact.html
const searchEmailButton = document.getElementById('search-email');


// Subscribed emails table container (used in suscription.html)
// --------------------------
const showEmails = document.getElementById("emails-subscribed")

// Desktop elements (used in desktop.html)
// ----------------
const activeEvents = document.getElementById('active-events');
const inactiveEvents = document.getElementById('inactive-events');
const cancelledEvents = document.getElementById('cancelled-events');
const totalEvents = document.getElementById('total-events');
const registeredEmails = document.getElementById('registered-emails');
const contactMessagesCount = document.getElementById('contact-messages-count');


// Events Management elements (specific to eventManagement.html)
// --------------------------
const eventsTableBody = document.getElementById('events-table-body'); // For displaying events
const newEventButton = document.getElementById('new-event');
const searchEventButton = document.getElementById('search-event');

const newEventModal = document.getElementById('new-event-modal');
const cancelNewEventButton = document.getElementById('cancel-new-event-button');
const saveEventButton = document.getElementById('save-event-button');
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');
const eventLocationInput = document.getElementById('event-location');
const eventPriceInput = document.getElementById('event-price');
const eventStatusSelect = document.getElementById('event-status');
const eventImageInput = document.getElementById('event-image'); // NEW: Image URL input
const eventDescriptionInput = document.getElementById('event-description'); // NEW: Description input

const editEventModal = document.getElementById('edit-event-modal');
const editEventIdInput = document.getElementById('edit-event-id');
const editEventNameInput = document.getElementById('edit-event-name');
const editEventDateInput = document.getElementById('edit-event-date');
const editEventLocationInput = document.getElementById('edit-event-location');
const editEventPriceInput = document.getElementById('edit-event-price');
const editEventStatusSelect = document.getElementById('edit-event-status');
const editEventImageInput = document.getElementById('edit-event-image'); // NEW: Image URL edit input
const editEventDescriptionInput = document.getElementById('edit-event-description'); // NEW: Description edit input
const updateEventButton = document.getElementById('update-event-button');
const cancelEditEventButton = document.getElementById('cancel-edit-event-button');

// Index.html Events container (now targeting the existing #events div in index.html)
const activeEventsContainer = document.getElementById('events');


// Event Listeners (wrapped in conditionals to prevent errors on other pages)
// --------------------------------------------------------------------------

// Events (specific to eventManagement.html)
// ----------------------------------------

// Open new event modal
if (newEventButton) {
    newEventButton.addEventListener('click', () => {
        if (newEventModal) {
            newEventModal.classList.add('is-active');
        }
    });
}

// Close new event modal
if (newEventModal) { // Check if the new event modal exists
    document.querySelectorAll('.modal-background, .modal-close, #cancel-new-event-button').forEach(button => {
        button.addEventListener('click', () => {
            newEventModal.classList.remove('is-active');
            clearEventForm(); // Clear the form when closing
        });
    });
}

// Save new event
if (saveEventButton) {
    saveEventButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const name = eventNameInput.value.trim();
        const date = eventDateInput.value;
        const location = eventLocationInput.value.trim();
        const price = parseFloat(eventPriceInput.value);
        const status = eventStatusSelect.value;
        const image = eventImageInput ? eventImageInput.value.trim() : ''; // NEW: Get image URL
        const description = eventDescriptionInput ? eventDescriptionInput.value.trim() : ''; // NEW: Get description

        if (!name || !date || !location || isNaN(price)) {
            alert("Please fill in all event fields correctly.");
            return;
        }

        await storeEvent(name, date, location, price, status, image, description); // NEW: Pass image and description
        if (newEventModal) {
            newEventModal.classList.remove('is-active');
        }
        clearEventForm();
        if (eventsTableBody) {
            await showEvents(); // Refresh the events list in eventManagement
        }
        if (activeEventsContainer) { // Refresh active events on index page
            await showActiveEvents();
        }
    });
}

// Open edit event modal and populate with data & Handle delete button click (general listener for dynamic buttons)
document.addEventListener('click', async (event) => {
    // Check if the clicked element has the 'edit-event-button' class
    if (event.target.classList.contains('edit-event-button')) {
        const eventId = event.target.dataset.id;
        if (editEventModal) { // Only attempt to populate and show if modal exists
            await populateEditEventModal(eventId);
            editEventModal.classList.add('is-active');
        }
    }
    // Handle delete button click
    if (event.target.classList.contains('delete-event-button')) {
        const eventId = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(eventId);
            if (eventsTableBody) { // Refresh table only if it exists
                await showEvents(); // Refresh the events list in eventManagement
            }
            if (activeEventsContainer) {
                await showActiveEvents(); // Refresh active events on index page
            }
        }
    }
});

// Close edit event modal
if (editEventModal) {
    document.querySelectorAll('#edit-event-modal .modal-background, #edit-event-modal .modal-close, #cancel-edit-event-button').forEach(button => {
        button.addEventListener('click', () => {
            editEventModal.classList.remove('is-active');
        });
    });
}

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
        const image = editEventImageInput ? editEventImageInput.value.trim() : ''; // NEW: Get image URL
        const description = editEventDescriptionInput ? editEventDescriptionInput.value.trim() : ''; // NEW: Get description

        if (!name || !date || !location || isNaN(price)) {
            alert("Please fill in all event fields correctly.");
            return;
        }

        await updateEvent(eventId, name, date, location, price, status, image, description); // NEW: Pass image and description
        if (editEventModal) {
            editEventModal.classList.remove('is-active');
        }
        if (eventsTableBody) {
            await showEvents(); // Refresh the events list in eventManagement
        }
        if (activeEventsContainer) {
            await showActiveEvents(); // Refresh active events on index page
        }
    });
}

// Search event by name
if (searchEventButton) {
    searchEventButton.addEventListener('click', async () => {
        const query = prompt("Enter event name to search:").trim();
        if (query) {
            await searchEventsByName(query);
        } else if (query === "" && eventsTableBody) { // If search box is empty, show all events
            await showEvents();
        }
    });
}


// Contact Messages (for contact.html and index.html forms)
// --------------------------------------------------------

// Search by email button click event (for contact.html)
if (searchEmailButton) {
    searchEmailButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await searchContactByEmail();
    });
}

// Store contact message button click event (for contact.html AND index.html forms)
// This will work for both as they now share the same IDs for form fields.
if (sendMessageButton) {
    sendMessageButton.addEventListener('click', async (event) => {
        event.preventDefault();
        // Use the common contact form variables
        await storeContactMessage(contactName.value, contactEmail.value, contactMessage.value);
        // Clear the form after sending, regardless of which page it's on
        if (contactName) contactName.value = '';
        if (contactEmail) contactEmail.value = '';
        if (contactMessage) contactMessage.value = '';
        alert("Mensaje enviado con éxito!");
    });
}


// Subscribed emails (used in index.html footer and suscription.html)
// ------------------------------------------------------------------

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
        subscribedEmailInput.value = ''; // Clear input after subscribing
        alert("¡Suscripción exitosa!");
    })
}


// Functions (these functions should inherently handle if their target elements are null, or are called conditionally)

// Contact Messages Functions
// --------------------------

// Save new contact message
async function storeContactMessage(name, email, content) {
    // Validate inputs
    if (!name || !email || !content) {
        console.error("All fields are required.");
        alert("Por favor, rellena todos los campos del formulario de contacto.");
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
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        console.log('Contact message stored successfully.');
        // Refresh messages on contact page if it exists
        if (Messages) {
            await showContactMessages();
        }
        // Update count on desktop page if it exists
        if (contactMessagesCount) {
            await showContactMessagesCount();
        }
    } catch (error) {
        // Handle errors
        console.error(`Error storing contact message: ${error}`);
        alert("Hubo un error al enviar tu mensaje. Inténtalo de nuevo.");
    }
}

// Show contact messages (for contact.html)
async function showContactMessages() {
    try {
        const res = await fetch(APP_URL + "/contact-messages");
        const messages = await res.json();
        if (Messages) { // Ensure Messages element exists before manipulating
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
        }
    }
    catch (error) {
        console.error(`Error fetching contact messages: ${error}`);
    }
}

// Search contact messages by email (for contact.html)
async function searchContactByEmail() {
    const email = prompt("Enter the email to search:").trim().toLowerCase();

    if (!email) {
        console.error("Please enter an email to search.");
        return;
    }

    try {
        const res = await fetch(`${APP_URL}/contact-messages?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (Messages) { // Ensure Messages element exists before manipulating
            Messages.innerHTML = ''; // Clear previous messages
            if (data.length === 0) {
                Messages.innerHTML = '<div class="column is-full has-text-centered"><p class="subtitle">No se encontraron mensajes para este email.</p></div>';
                return;
            }
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
        }
    } catch (error) {
        console.error(`Error fetching contact messages by email: ${error}`);
    }
}

// Subscribed Emails Functions
// ---------------------------

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
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        console.log('Email subscribed successfully.');
        // Refresh emails on subscription page if it exists
        if (showEmails) {
            await showEmailsSubscribed();
        }
        // Update count on desktop page if it exists
        if (registeredEmails) {
            await showEmailsCount();
        }
    } catch (error) {
        // Handle errors
        console.error(`Error storing subscription: ${error}`);
        alert("Hubo un error al suscribirte. Inténtalo de nuevo.");
    }
}

async function showEmailsSubscribed() {
    try {
        const res = await fetch(APP_URL + "/suscription");
        const emails = await res.json();
        if (showEmails) { // Ensure showEmails element exists before manipulating
            showEmails.innerHTML = '';

            if (emails.length === 0) {
                showEmails.innerHTML = '<tr><td colspan="4" class="has-text-centered">No hay emails suscritos.</td></tr>';
                return;
            }

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
    } catch (error) {
        console.error(`Error fetching subscribed emails: ${error}`);
    }
}


// Desktop page Functions
// ----------------------

// show number of contact messages
async function showContactMessagesCount() {
    try {
        const res = await fetch(APP_URL + "/contact-messages");
        const messages = await res.json();

        if (contactMessagesCount) { // Ensure element exists
            contactMessagesCount.innerHTML = messages.length;
        }
    } catch (error) {
        console.error(`Error fetching contact messages count: ${error}`);
    }
}

// show number of registered emails
async function showEmailsCount() {
    try {
        const res = await fetch(APP_URL + "/suscription");
        const emails = await res.json();

        if (registeredEmails) { // Ensure element exists
            registeredEmails.innerHTML = emails.length;
        }
    } catch (error) {
        console.error(`Error fetching registered emails count: ${error}`);
    }
}

// Show active events, inactive events, cancelled events, total events
async function showEventsCount() {
    try {
        const res = await fetch(APP_URL + "/events")
        const events = await res.json()
        const active = events.filter(event => event.status === "active")
        const inactive = events.filter(event => event.status === "inactive")
        const cancelled = events.filter(event => event.status === "cancelled")

        // Ensure elements exist before updating
        if (activeEvents) activeEvents.innerHTML = active.length;
        if (inactiveEvents) inactiveEvents.innerHTML = inactive.length;
        if (cancelledEvents) cancelledEvents.innerHTML = cancelled.length;
        if (totalEvents) totalEvents.innerHTML = events.length;
    } catch (error) {
        console.error(`Error fetching events count: ${error}`);
    }
}


// Event Management Functions (specific to eventManagement.html)
// -------------------------------------------------------------

// Function to display events in the table
async function showEvents(eventsToDisplay = null) {
    try {
        if (!eventsTableBody) return; // Exit if the table body element doesn't exist

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
async function storeEvent(name, date, location, price, status, image, description) { // NEW: Add image, description parameters
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
                status: status,
                image: image,       // NEW: Include image
                description: description // NEW: Include description
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
        if (!editEventIdInput || !editEventNameInput || !editEventDateInput || !editEventLocationInput || !editEventPriceInput || !editEventStatusSelect || !editEventImageInput || !editEventDescriptionInput) { // NEW: Check new elements
            console.warn("Edit event modal elements not found.");
            return; // Exit if elements are missing
        }

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
        editEventImageInput.value = eventData.image || '';       // NEW: Populate image
        editEventDescriptionInput.value = eventData.description || ''; // NEW: Populate description

    } catch (error) {
        console.error(`Error fetching event data for edit: ${error}`);
    }
}

// Function to update an event
async function updateEvent(id, name, date, location, price, status, image, description) { // NEW: Add image, description parameters
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
                status: status,
                image: image,        // NEW: Include image
                description: description // NEW: Include description
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

// Function to search events by name
async function searchEventsByName(query) {
    try {
        if (!eventsTableBody) return; // Exit if the table body element doesn't exist

        const res = await fetch(`${APP_URL}/events?name_like=${encodeURIComponent(query)}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const filteredEvents = await res.json();
        showEvents(filteredEvents); // Display the filtered events
    } catch (error) {
        console.error(`Error searching events by name: ${error}`);
        if (eventsTableBody) {
            eventsTableBody.innerHTML = '<tr><td colspan="5" class="has-text-centered">Error searching events.</td></tr>';
        }
    }
}

// Function to clear the new event form fields (eventManagement.html)
function clearEventForm() {
    if (eventNameInput) eventNameInput.value = '';
    if (eventDateInput) eventDateInput.value = '';
    if (eventLocationInput) eventLocationInput.value = '';
    if (eventPriceInput) eventPriceInput.value = '';
    if (eventStatusSelect) eventStatusSelect.value = 'active'; // Reset to default
    if (eventImageInput) eventImageInput.value = '';         // NEW: Clear image input
    if (eventDescriptionInput) eventDescriptionInput.value = ''; // NEW: Clear description input
}

// Function for Index page to display active events in the existing #events div
async function showActiveEvents() {
    try {
        if (!activeEventsContainer) return; // Exit if element doesn't exist

        const res = await fetch(APP_URL + "/events");
        const allEvents = await res.json();
        const activeEvents = allEvents.filter(event => event.status === "active");

        activeEventsContainer.innerHTML = ''; // Clear previous content

        if (activeEvents.length === 0) {
            activeEventsContainer.innerHTML = '<div class="column is-full has-text-centered"><p class="subtitle">No hay eventos activos en este momento.</p></div>';
            return;
        }

        activeEvents.forEach(event => {
            const eventCard = document.createElement('div');
            // Using Bulma column classes for responsiveness
            eventCard.className = 'column is-one-third-desktop is-half-tablet is-full-mobile';
            eventCard.innerHTML = `
                <div class="card">
                    <div class="card-image">
                        <figure class="image is-4by3">
                            <img src="${event.image || 'https://via.placeholder.com/480x320?text=Event+Image'}" alt="${event.name}">
                        </figure>
                    </div>
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-4">${event.name}</p>
                                <p class="subtitle is-6">${event.location}</p>
                            </div>
                        </div>
                        <div class="content">
                            <p>${event.description || 'No description available.'}</p>
                            <p><strong>Fecha:</strong> ${event.date}</p>
                            <p><strong>Precio:</strong> $${event.price}</p>
                            <br>
                            <button class="button is-primary is-fullwidth">Comprar Entradas</button>
                        </div>
                    </div>
                </div>
            `;
            activeEventsContainer.appendChild(eventCard);
        });

    } catch (error) {
        console.error(`Error fetching or displaying active events for index page: ${error}`);
        if (activeEventsContainer) {
            activeEventsContainer.innerHTML = '<div class="column is-full has-text-centered"><p class="has-text-danger">Error al cargar los eventos.</p></div>';
        }
    }
}