// Mock API for testing without backend
// This replaces the real API when loaded

// Mock user data
const mockUsers = {
    'admin@example.com': {
        email: 'admin@example.com',
        password: 'admin123',
        user: {
            id: '1',
            _id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            isApproved: true
        },
        token: 'mock-admin-token-12345'
    },
    'alumni@example.com': {
        email: 'alumni@example.com',
        password: 'alumni123',
        user: {
            id: '2',
            _id: '2',
            name: 'Alumni User',
            email: 'alumni@example.com',
            role: 'alumni',
            isApproved: true
        },
        token: 'mock-alumni-token-12345'
    },
    'student@example.com': {
        email: 'student@example.com',
        password: 'student123',
        user: {
            id: '3',
            _id: '3',
            name: 'Student User',
            email: 'student@example.com',
            role: 'student',
            isApproved: true
        },
        token: 'mock-student-token-12345'
    }
};

// Mock API functions
function mockApiRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (endpoint === '/auth/login') {
                const { email, password } = JSON.parse(options.body);
                const user = mockUsers[email];
                
                if (user && user.password === password) {
                    resolve({
                        token: user.token,
                        user: user.user
                    });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            } else if (endpoint === '/auth/register') {
                const userData = JSON.parse(options.body);
                resolve({
                    token: 'mock-token-' + Date.now(),
                    user: {
                        id: Date.now().toString(),
                        name: userData.name,
                        email: userData.email,
                        role: userData.role,
                        isApproved: userData.role === 'student'
                    },
                    message: 'Registration successful'
                });
            } else if (endpoint === '/auth/me') {
                const user = window.utils.getUser();
                resolve({
                    user: user,
                    profile: null
                });
            } else {
                // For other endpoints, return mock data
                resolve({ message: 'Mock data - backend not connected' });
            }
        }, 500); // Simulate network delay
    });
}

// Replace API functions with mocks
window.api = {
    auth: {
        login: (email, password) => mockApiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),
        register: (userData) => mockApiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        getMe: () => mockApiRequest('/auth/me')
    },
    admin: {
        getDashboard: () => Promise.resolve({
            statistics: {
                totalAlumni: 0,
                approvedAlumni: 0,
                pendingAlumni: 0,
                totalStudents: 0,
                activeUsers: 0,
                totalEvents: 0,
                upcomingEvents: 0,
                totalJobs: 0
            },
            recentRegistrations: []
        }),
        getAlumni: () => Promise.resolve({ alumni: [], totalPages: 1, currentPage: 1, total: 0 }),
        approveAlumni: () => Promise.resolve({ message: 'Approved' }),
        deleteAlumni: () => Promise.resolve({ message: 'Deleted' }),
        getJobs: () => Promise.resolve({ jobs: [] }),
        deleteJob: () => Promise.resolve({ message: 'Deleted' }),
        exportCSV: () => Promise.resolve(new Blob()),
        exportPDF: () => Promise.resolve(new Blob())
    },
    alumni: {
        getProfile: () => Promise.resolve({
            profile: {
                user: { name: 'Alumni User', email: 'alumni@example.com' },
                graduationYear: 2020,
                department: 'Computer Science',
                company: 'Tech Corp',
                position: 'Software Engineer'
            }
        }),
        updateProfile: () => Promise.resolve({ message: 'Updated' }),
        searchAlumni: () => Promise.resolve({ profiles: [] }),
        getEvents: () => Promise.resolve({ events: [] }),
        registerEvent: () => Promise.resolve({ message: 'Registered' }),
        unregisterEvent: () => Promise.resolve({ message: 'Unregistered' }),
        getJobs: () => Promise.resolve({ jobs: [] }),
        postJob: () => Promise.resolve({ message: 'Posted' }),
        getAnnouncements: () => Promise.resolve({ announcements: [] })
    },
    student: {
        getAlumni: () => Promise.resolve({ profiles: [] }),
        getAlumniById: () => Promise.resolve({ profile: {} }),
        getEvents: () => Promise.resolve({ events: [] }),
        registerEvent: () => Promise.resolve({ message: 'Registered' }),
        getJobs: () => Promise.resolve({ jobs: [] }),
        getAnnouncements: () => Promise.resolve({ announcements: [] })
    }
};

console.log('✅ Mock API enabled - No backend required!');

