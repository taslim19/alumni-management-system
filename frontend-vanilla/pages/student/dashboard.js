// Student Dashboard

export async function renderStudentDashboard() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container">
            <h1 style="margin-bottom: 2rem;">Student Dashboard</h1>
            
            <div class="grid grid-cols-3" style="margin-bottom: 2rem;">
                <a href="/student/alumni" class="card" style="text-decoration: none; color: inherit;">
                    <h3>Browse Alumni</h3>
                    <p style="font-size: 1.5rem; color: var(--primary-600);">Connect</p>
                </a>
                <a href="/student/events" class="card" style="text-decoration: none; color: inherit;">
                    <h3>Events</h3>
                    <p style="font-size: 1.5rem; color: var(--primary-600);">Explore</p>
                </a>
                <a href="/student/jobs" class="card" style="text-decoration: none; color: inherit;">
                    <h3>Job Opportunities</h3>
                    <p style="font-size: 1.5rem; color: var(--primary-600);">View</p>
                </a>
            </div>
            
            <div class="card">
                <h2>Welcome!</h2>
                <p>As a student, you can browse alumni profiles, view job postings, and register for events. 
                Use the navigation above to explore the alumni network.</p>
            </div>
        </div>
    `;
}

