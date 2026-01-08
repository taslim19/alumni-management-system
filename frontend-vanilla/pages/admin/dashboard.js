// Admin Dashboard

export async function renderAdminDashboard() {
    const app = document.getElementById('app');
    window.utils.showLoading(app);
    
    try {
        const data = await window.api.admin.getDashboard();
        const stats = data.statistics;
        
        app.innerHTML = `
            <div class="container">
                <h1 style="margin-bottom: 2rem;">Admin Dashboard</h1>
                
                <div class="grid grid-cols-4" style="margin-bottom: 2rem;">
                    <div class="card">
                        <h3>Total Alumni</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: var(--primary-600);">${stats.totalAlumni || 0}</p>
                    </div>
                    <div class="card">
                        <h3>Approved Alumni</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: #10b981;">${stats.approvedAlumni || 0}</p>
                    </div>
                    <div class="card">
                        <h3>Pending Approval</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: #f59e0b;">${stats.pendingAlumni || 0}</p>
                    </div>
                    <div class="card">
                        <h3>Upcoming Events</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: var(--primary-600);">${stats.upcomingEvents || 0}</p>
                    </div>
                    <div class="card">
                        <h3>Active Jobs</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: var(--primary-600);">${stats.totalJobs || 0}</p>
                    </div>
                    <div class="card">
                        <h3>Total Students</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: var(--primary-600);">${stats.totalStudents || 0}</p>
                    </div>
                    <div class="card">
                        <h3>Active Users</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: var(--primary-600);">${stats.activeUsers || 0}</p>
                    </div>
                    <div class="card">
                        <h3>Total Events</h3>
                        <p style="font-size: 2rem; font-weight: bold; color: var(--primary-600);">${stats.totalEvents || 0}</p>
                    </div>
                </div>
                
                <div class="card">
                    <h2 class="card-header">Recent Registrations</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.recentRegistrations && data.recentRegistrations.length > 0
                                ? data.recentRegistrations.map(user => `
                                    <tr>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td><span class="badge badge-info">${user.role}</span></td>
                                        <td>${user.isApproved 
                                            ? '<span class="badge badge-success">Approved</span>' 
                                            : '<span class="badge badge-warning">Pending</span>'}</td>
                                        <td>${window.utils.formatDate(user.createdAt)}</td>
                                    </tr>
                                `).join('')
                                : '<tr><td colspan="5" class="text-center">No recent registrations</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        window.utils.showError(app, error.message);
    }
}

