// API Helper Functions

// Update this to your backend URL
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'http://54.255.148.254:5000/api';

// Make API request
async function apiRequest(endpoint, options = {}) {
    const token = window.utils.getToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
const authAPI = {
    login: (email, password) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    
    register: (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    
    getMe: () => {
        return apiRequest('/auth/me');
    }
};

// Admin API
const adminAPI = {
    getDashboard: () => apiRequest('/admin/dashboard'),
    getAlumni: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/admin/alumni?${queryString}`);
    },
    approveAlumni: (id, isApproved) => {
        return apiRequest(`/admin/alumni/${id}/approve`, {
            method: 'PUT',
            body: JSON.stringify({ isApproved })
        });
    },
    deleteAlumni: (id) => {
        return apiRequest(`/admin/alumni/${id}`, {
            method: 'DELETE'
        });
    },
    createEvent: (eventData) => {
        return apiRequest('/admin/events', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
    },
    updateEvent: (id, eventData) => {
        return apiRequest(`/admin/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
    },
    deleteEvent: (id) => {
        return apiRequest(`/admin/events/${id}`, {
            method: 'DELETE'
        });
    },
    createAnnouncement: (announcementData) => {
        return apiRequest('/admin/announcements', {
            method: 'POST',
            body: JSON.stringify(announcementData)
        });
    },
    getJobs: () => apiRequest('/admin/jobs'),
    deleteJob: (id) => {
        return apiRequest(`/admin/jobs/${id}`, {
            method: 'DELETE'
        });
    },
    exportCSV: () => {
        return fetch(`${API_BASE_URL}/admin/export/csv`, {
            headers: {
                'Authorization': `Bearer ${window.utils.getToken()}`
            }
        });
    },
    exportPDF: () => {
        return fetch(`${API_BASE_URL}/admin/export/pdf`, {
            headers: {
                'Authorization': `Bearer ${window.utils.getToken()}`
            }
        });
    }
};

// Alumni API
const alumniAPI = {
    getProfile: () => apiRequest('/alumni/profile'),
    updateProfile: (profileData) => {
        return apiRequest('/alumni/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },
    uploadPhoto: (file) => {
        const formData = new FormData();
        formData.append('photo', file);
        return apiRequest('/alumni/profile/photo', {
            method: 'POST',
            headers: {},
            body: formData
        });
    },
    searchAlumni: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/alumni/search?${queryString}`);
    },
    getEvents: () => apiRequest('/alumni/events'),
    registerEvent: (id) => {
        return apiRequest(`/alumni/events/${id}/register`, {
            method: 'POST'
        });
    },
    unregisterEvent: (id) => {
        return apiRequest(`/alumni/events/${id}/unregister`, {
            method: 'POST'
        });
    },
    getJobs: () => apiRequest('/alumni/jobs'),
    postJob: (jobData) => {
        return apiRequest('/alumni/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData)
        });
    },
    getAnnouncements: () => apiRequest('/alumni/announcements')
};

// Student API
const studentAPI = {
    getAlumni: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/student/alumni?${queryString}`);
    },
    getAlumniById: (id) => apiRequest(`/student/alumni/${id}`),
    getEvents: () => apiRequest('/student/events'),
    registerEvent: (id) => {
        return apiRequest(`/student/events/${id}/register`, {
            method: 'POST'
        });
    },
    getJobs: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/jobs?${queryString}`);
    },
    getAnnouncements: () => apiRequest('/student/announcements')
};

// Export API functions
window.api = {
    auth: authAPI,
    admin: adminAPI,
    alumni: alumniAPI,
    student: studentAPI
};

