// Admin Events

export async function renderAdminEvents() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="flex-between" style="margin-bottom: 1.5rem;">
                <h1>Events Management</h1>
                <button onclick="showEventModal()" class="btn btn-primary">Create Event</button>
            </div>
            <div id="eventsContainer">Loading...</div>
        </div>
    `;
    loadEvents();
}

async function loadEvents() {
    try {
        const response = await fetch(`${window.api ? 'http://localhost:5000' : ''}/api/events`, {
            headers: {
                'Authorization': `Bearer ${window.utils.getToken()}`
            }
        });
        const data = await response.json();
        
        const container = document.getElementById('eventsContainer');
        if (data.events && data.events.length > 0) {
            container.innerHTML = `
                <div class="grid grid-cols-3">
                    ${data.events.map(event => `
                        <div class="card">
                            <h3>${event.title}</h3>
                            <p>${event.description}</p>
                            <p><strong>Date:</strong> ${window.utils.formatDate(event.date)}</p>
                            <p><strong>Location:</strong> ${event.location}</p>
                            <p><strong>Registered:</strong> ${event.registeredUsers?.length || 0}</p>
                            <div class="mt-4">
                                <button onclick="editEvent('${event._id}')" class="btn btn-secondary">Edit</button>
                                <button onclick="deleteEvent('${event._id}')" class="btn btn-danger">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            container.innerHTML = '<p>No events found</p>';
        }
    } catch (error) {
        document.getElementById('eventsContainer').innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}

window.showEventModal = () => alert('Event creation modal - implement as needed');
window.editEvent = (id) => alert('Edit event: ' + id);
window.deleteEvent = async (id) => {
    if (confirm('Delete this event?')) {
        try {
            await window.api.admin.deleteEvent(id);
            loadEvents();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
};

