// Authentication Functions

async function login(email, password) {
    try {
        const response = await window.api.auth.login(email, password);
        window.utils.setToken(response.token);
        window.utils.setUser(response.user);
        return { success: true, user: response.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function register(userData) {
    try {
        const response = await window.api.auth.register(userData);
        window.utils.setToken(response.token);
        window.utils.setUser(response.user);
        return { success: true, message: response.message, user: response.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function logout() {
    window.utils.clearAuth();
    window.router.navigate('/login');
}

async function checkAuth() {
    if (!window.utils.isAuthenticated()) {
        return false;
    }

    try {
        const response = await window.api.auth.getMe();
        window.utils.setUser(response.user);
        if (response.profile) {
            const user = window.utils.getUser();
            user.profile = response.profile;
            window.utils.setUser(user);
        }
        return true;
    } catch (error) {
        window.utils.clearAuth();
        return false;
    }
}

window.auth = {
    login,
    register,
    logout,
    checkAuth
};

