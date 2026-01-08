// Login Page

export async function renderLogin() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container" style="max-width: 500px; margin-top: 4rem;">
            <div class="card">
                <h2 class="card-header text-center">Sign In</h2>
                <form id="loginForm">
                    <div id="errorMessage" class="hidden"></div>
                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-envelope"></i> Email address
                        </label>
                        <input type="email" id="email" class="form-input" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <i class="fas fa-lock"></i> Password
                        </label>
                        <input type="password" id="password" class="form-input" required placeholder="Enter your password">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Sign In
                    </button>
                </form>
                <p class="text-center mt-4">
                    Don't have an account? <a href="/register">Create one</a>
                </p>
            </div>
        </div>
    `;
    
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
        errorDiv.classList.add('hidden');
        
        const result = await window.auth.login(email, password);
        
        if (result.success) {
            window.router.navigate(`/${result.user.role}/dashboard`);
        } else {
            errorDiv.className = 'alert alert-error';
            errorDiv.textContent = result.message;
            errorDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });
}

