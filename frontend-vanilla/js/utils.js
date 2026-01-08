// Utility Functions

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Get user from localStorage
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Set user in localStorage
function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// Set token in localStorage
function setToken(token) {
    localStorage.setItem('token', token);
}

// Clear auth data
function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Check if user has role
function hasRole(role) {
    const user = getUser();
    return user && user.role === role;
}

// Check if user is approved (for alumni)
function isApproved() {
    const user = getUser();
    return user && user.isApproved;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format datetime
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show loading spinner
function showLoading(container) {
    container.innerHTML = '<div class="spinner"></div>';
}

// Show error message
function showError(container, message) {
    container.innerHTML = `
        <div class="alert alert-error">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

// Show success message
function showSuccess(container, message) {
    container.innerHTML = `
        <div class="alert alert-success">
            <strong>Success:</strong> ${message}
        </div>
    `;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions
window.utils = {
    getToken,
    getUser,
    setUser,
    setToken,
    clearAuth,
    isAuthenticated,
    hasRole,
    isApproved,
    formatDate,
    formatDateTime,
    showLoading,
    showError,
    showSuccess,
    debounce
};

