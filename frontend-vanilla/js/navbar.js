// Navbar Component

function renderNavbar() {
    const navbar = document.getElementById('navbar');
    const user = window.utils.getUser();
    
    if (!user) {
        navbar.innerHTML = `
            <div class="navbar-content">
                <a href="/" class="navbar-brand">
                    <i class="fas fa-home"></i>
                    <span>Alumni Network</span>
                </a>
                <div class="navbar-links">
                    <a href="/login">Login</a>
                    <a href="/register" class="btn btn-primary">Register</a>
                </div>
            </div>
        `;
        return;
    }

    let navLinks = '';
    
    if (user.role === 'admin') {
        navLinks = `
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/alumni">Alumni</a>
            <a href="/admin/events">Events</a>
            <a href="/admin/announcements">Announcements</a>
            <a href="/admin/jobs">Jobs</a>
        `;
    } else if (user.role === 'alumni') {
        navLinks = `
            <a href="/alumni/dashboard">Dashboard</a>
            <a href="/alumni/profile">Profile</a>
            <a href="/alumni/search">Search Alumni</a>
            <a href="/alumni/events">Events</a>
            <a href="/alumni/jobs">Jobs</a>
        `;
    } else if (user.role === 'student') {
        navLinks = `
            <a href="/student/dashboard">Dashboard</a>
            <a href="/student/alumni">Alumni</a>
            <a href="/student/events">Events</a>
            <a href="/student/jobs">Jobs</a>
        `;
    }

    const pendingBadge = user.role === 'alumni' && !user.isApproved 
        ? '<span class="badge badge-warning">Pending</span>' 
        : '';

    navbar.innerHTML = `
        <div class="navbar-content">
            <a href="/${user.role}/dashboard" class="navbar-brand">
                <i class="fas fa-home"></i>
                <span>Alumni Network</span>
            </a>
            <div class="navbar-links">
                ${navLinks}
                <div class="navbar-user">
                    <i class="fas fa-user"></i>
                    <span>${user.name}</span>
                    ${pendingBadge}
                    <button onclick="window.auth.logout()" class="btn btn-secondary">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        </div>
    `;
}

window.navbar = {
    render: renderNavbar
};

