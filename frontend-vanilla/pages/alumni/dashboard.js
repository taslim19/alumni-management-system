// Alumni Dashboard

export async function renderAlumniDashboard() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container">
            <h1 style="margin-bottom: 2rem;">Alumni Dashboard</h1>
            
            <div class="grid grid-cols-4" style="margin-bottom: 2rem;">
                <a href="/alumni/profile" class="card" style="text-decoration: none; color: inherit;">
                    <h3>My Profile</h3>
                    <p style="font-size: 1.5rem; color: var(--primary-600);">View</p>
                </a>
                <a href="/alumni/events" class="card" style="text-decoration: none; color: inherit;">
                    <h3>Events</h3>
                    <p style="font-size: 1.5rem; color: var(--primary-600);">Browse</p>
                </a>
                <a href="/alumni/jobs" class="card" style="text-decoration: none; color: inherit;">
                    <h3>Job Postings</h3>
                    <p style="font-size: 1.5rem; color: var(--primary-600);">View</p>
                </a>
                <a href="/alumni/search" class="card" style="text-decoration: none; color: inherit;">
                    <h3>Search Alumni</h3>
                    <p style="font-size: 1.5rem; color: var(--primary-600);">Connect</p>
                </a>
            </div>
            
            <div class="grid grid-cols-2">
                <div class="card">
                    <h2 class="card-header">Upcoming Events</h2>
                    <div id="eventsList">Loading...</div>
                </div>
                <div class="card">
                    <h2 class="card-header">Announcements</h2>
                    <div id="announcementsList">Loading...</div>
                </div>
            </div>
        </div>
    `;
    
    // Load events and announcements
    try {
        const [eventsData, announcementsData] = await Promise.all([
            window.api.alumni.getEvents(),
            window.api.alumni.getAnnouncements()
        ]);
        
        const eventsList = document.getElementById('eventsList');
        if (eventsData.events && eventsData.events.length > 0) {
            eventsList.innerHTML = eventsData.events.slice(0, 3).map(event => `
                <div style="padding: 1rem; border-left: 4px solid var(--primary-500); margin-bottom: 1rem;">
                    <h4>${event.title}</h4>
                    <p style="font-size: 0.875rem; color: var(--gray-600);">
                        ${window.utils.formatDate(event.date)} • ${event.location}
                    </p>
                </div>
            `).join('');
        } else {
            eventsList.innerHTML = '<p>No upcoming events</p>';
        }
        
        const announcementsList = document.getElementById('announcementsList');
        if (announcementsData.announcements && announcementsData.announcements.length > 0) {
            announcementsList.innerHTML = announcementsData.announcements.slice(0, 3).map(ann => `
                <div style="margin-bottom: 1rem;">
                    <h4>${ann.title}</h4>
                    <p style="font-size: 0.875rem; color: var(--gray-600);">${ann.message}</p>
                    <p style="font-size: 0.75rem; color: var(--gray-400);">
                        ${window.utils.formatDate(ann.createdAt)}
                    </p>
                </div>
            `).join('');
        } else {
            announcementsList.innerHTML = '<p>No announcements</p>';
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

