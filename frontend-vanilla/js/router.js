// Simple Router

const routes = {
    '/': 'login',
    '/login': 'login',
    '/register': 'register',
    '/admin/dashboard': 'admin-dashboard',
    '/admin/alumni': 'admin-alumni',
    '/admin/events': 'admin-events',
    '/admin/announcements': 'admin-announcements',
    '/admin/jobs': 'admin-jobs',
    '/alumni/dashboard': 'alumni-dashboard',
    '/alumni/profile': 'alumni-profile',
    '/alumni/search': 'alumni-search',
    '/alumni/events': 'alumni-events',
    '/alumni/jobs': 'alumni-jobs',
    '/student/dashboard': 'student-dashboard',
    '/student/alumni': 'student-alumni',
    '/student/events': 'student-events',
    '/student/jobs': 'student-jobs'
};

const pageLoaders = {
    'login': () => import('./pages/login.js').then(m => m.renderLogin()),
    'register': () => import('./pages/register.js').then(m => m.renderRegister()),
    'admin-dashboard': () => import('./pages/admin/dashboard.js').then(m => m.renderAdminDashboard()),
    'admin-alumni': () => import('./pages/admin/alumni.js').then(m => m.renderAdminAlumni()),
    'admin-events': () => import('./pages/admin/events.js').then(m => m.renderAdminEvents()),
    'admin-announcements': () => import('./pages/admin/announcements.js').then(m => m.renderAdminAnnouncements()),
    'admin-jobs': () => import('./pages/admin/jobs.js').then(m => m.renderAdminJobs()),
    'alumni-dashboard': () => import('./pages/alumni/dashboard.js').then(m => m.renderAlumniDashboard()),
    'alumni-profile': () => import('./pages/alumni/profile.js').then(m => m.renderAlumniProfile()),
    'alumni-search': () => import('./pages/alumni/search.js').then(m => m.renderAlumniSearch()),
    'alumni-events': () => import('./pages/alumni/events.js').then(m => m.renderAlumniEvents()),
    'alumni-jobs': () => import('./pages/alumni/jobs.js').then(m => m.renderAlumniJobs()),
    'student-dashboard': () => import('./pages/student/dashboard.js').then(m => m.renderStudentDashboard()),
    'student-alumni': () => import('./pages/student/alumni.js').then(m => m.renderStudentAlumni()),
    'student-events': () => import('./pages/student/events.js').then(m => m.renderStudentEvents()),
    'student-jobs': () => import('./pages/student/jobs.js').then(m => m.renderStudentJobs())
};

function getRoute() {
    return window.location.pathname;
}

function navigate(path) {
    window.history.pushState({}, '', path);
    loadPage();
}

async function loadPage() {
    const path = getRoute();
    const route = routes[path] || 'login';
    const app = document.getElementById('app');
    
    // Check authentication for protected routes
    if (path !== '/login' && path !== '/register') {
        const isAuth = await window.auth.checkAuth();
        if (!isAuth) {
            navigate('/login');
            return;
        }
        
        const user = window.utils.getUser();
        
        // Check role-based access
        if (path.startsWith('/admin') && user.role !== 'admin') {
            navigate(`/${user.role}/dashboard`);
            return;
        }
        if (path.startsWith('/alumni') && user.role !== 'alumni') {
            navigate(`/${user.role}/dashboard`);
            return;
        }
        if (path.startsWith('/student') && user.role !== 'student') {
            navigate(`/${user.role}/dashboard`);
            return;
        }
        
        // Check approval for alumni
        if (user.role === 'alumni' && !user.isApproved) {
            app.innerHTML = `
                <div class="container">
                    <div class="card">
                        <h2>Account Pending Approval</h2>
                        <p>Your account is pending admin approval. Please wait for approval to access the system.</p>
                    </div>
                </div>
            `;
            window.navbar.render();
            return;
        }
    }
    
    // Render navbar
    window.navbar.render();
    
    // Load page
    try {
        window.utils.showLoading(app);
        await pageLoaders[route]();
    } catch (error) {
        console.error('Error loading page:', error);
        window.utils.showError(app, 'Failed to load page');
    }
}

// Handle browser back/forward
window.addEventListener('popstate', loadPage);

// Handle link clicks
document.addEventListener('click', (e) => {
    if (e.target.matches('[href^="/"]')) {
        e.preventDefault();
        navigate(e.target.getAttribute('href'));
    }
});

window.router = {
    navigate,
    loadPage
};

