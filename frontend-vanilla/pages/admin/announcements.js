// Admin Announcements

export async function renderAdminAnnouncements() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container">
            <div class="flex-between" style="margin-bottom: 1.5rem;">
                <h1>Announcements</h1>
                <button onclick="showAnnouncementModal()" class="btn btn-primary">Create Announcement</button>
            </div>
            <div id="announcementsContainer">Loading...</div>
        </div>
    `;
    loadAnnouncements();
}

async function loadAnnouncements() {
    try {
        const response = await fetch('http://localhost:5000/api/announcements', {
            headers: {
                'Authorization': `Bearer ${window.utils.getToken()}`
            }
        });
        const data = await response.json();
        
        const container = document.getElementById('announcementsContainer');
        if (data.announcements && data.announcements.length > 0) {
            container.innerHTML = data.announcements.map(ann => `
                <div class="card">
                    <div class="flex-between">
                        <div>
                            <h3>${ann.title}</h3>
                            <p>${ann.message}</p>
                            <p style="font-size: 0.875rem; color: var(--gray-500);">
                                Posted by ${ann.postedBy?.name} on ${window.utils.formatDate(ann.createdAt)}
                            </p>
                        </div>
                        <button onclick="deleteAnnouncement('${ann._id}')" class="btn btn-danger">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>No announcements</p>';
        }
    } catch (error) {
        document.getElementById('announcementsContainer').innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}

window.showAnnouncementModal = () => alert('Announcement creation modal - implement as needed');
window.deleteAnnouncement = async (id) => {
    if (confirm('Delete this announcement?')) {
        try {
            await fetch(`http://localhost:5000/api/admin/announcements/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${window.utils.getToken()}`
                }
            });
            loadAnnouncements();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
};

