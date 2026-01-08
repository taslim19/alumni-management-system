// Student Events

export async function renderStudentEvents() {
    const app = document.getElementById('app');
    window.utils.showLoading(app);
    
    try {
        const data = await window.api.student.getEvents();
        
        app.innerHTML = `
            <div class="container">
                <h1 style="margin-bottom: 2rem;">Events</h1>
                <div class="grid grid-cols-3">
                    ${data.events && data.events.length > 0
                        ? data.events.map(event => {
                            const user = window.utils.getUser();
                            const isRegistered = event.registeredUsers?.some(u => u._id === user.id);
                            return `
                                <div class="card">
                                    <h3>${event.title}</h3>
                                    <p>${event.description}</p>
                                    <p><strong>Date:</strong> ${window.utils.formatDate(event.date)}</p>
                                    <p><strong>Location:</strong> ${event.location}</p>
                                    ${!isRegistered ? `
                                        <button onclick="registerEvent('${event._id}')" 
                                                class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                                            Register
                                        </button>
                                    ` : '<span class="badge badge-success">Registered</span>'}
                                </div>
                            `;
                        }).join('')
                        : '<p>No events found</p>'
                    }
                </div>
            </div>
        `;
    } catch (error) {
        window.utils.showError(app, error.message);
    }
}

window.registerEvent = async (id) => {
    try {
        await window.api.student.registerEvent(id);
        alert('Successfully registered for event!');
        window.router.loadPage();
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

