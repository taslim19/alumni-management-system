// Alumni Events

export async function renderAlumniEvents() {
    const app = document.getElementById('app');
    window.utils.showLoading(app);
    
    try {
        const data = await window.api.alumni.getEvents();
        
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
                                    <p><strong>Registered:</strong> ${event.registeredUsers?.length || 0}</p>
                                    <button onclick="toggleRegistration('${event._id}', ${isRegistered})" 
                                            class="btn ${isRegistered ? 'btn-secondary' : 'btn-primary'}" 
                                            style="width: 100%; margin-top: 1rem;">
                                        ${isRegistered ? 'Unregister' : 'Register'}
                                    </button>
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

window.toggleRegistration = async (id, isRegistered) => {
    try {
        if (isRegistered) {
            await window.api.alumni.unregisterEvent(id);
        } else {
            await window.api.alumni.registerEvent(id);
        }
        window.router.loadPage();
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

