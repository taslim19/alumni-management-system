// Register Page

export async function renderRegister() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container" style="max-width: 500px; margin-top: 4rem;">
            <div class="card">
                <h2 class="card-header text-center">Create Account</h2>
                <form id="registerForm">
                    <div id="errorMessage" class="hidden"></div>
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="name" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email address</label>
                        <input type="email" id="email" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role</label>
                        <select id="role" class="form-input" required>
                            <option value="alumni">Alumni</option>
                            <option value="student">Student</option>
                        </select>
                    </div>
                    <div id="alumniFields">
                        <div class="form-group">
                            <label class="form-label">Graduation Year</label>
                            <input type="number" id="graduationYear" class="form-input" min="1950" max="2025">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Department</label>
                            <input type="text" id="department" class="form-input">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" id="password" class="form-input" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Confirm Password</label>
                        <input type="password" id="confirmPassword" class="form-input" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Create Account
                    </button>
                </form>
                <p class="text-center mt-4">
                    Already have an account? <a href="/login">Sign in</a>
                </p>
            </div>
        </div>
    `;
    
    // Show/hide alumni fields based on role
    document.getElementById('role').addEventListener('change', (e) => {
        const alumniFields = document.getElementById('alumniFields');
        if (e.target.value === 'alumni') {
            alumniFields.style.display = 'block';
            document.getElementById('graduationYear').required = true;
            document.getElementById('department').required = true;
        } else {
            alumniFields.style.display = 'none';
            document.getElementById('graduationYear').required = false;
            document.getElementById('department').required = false;
        }
    });
    
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            errorDiv.className = 'alert alert-error';
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: password,
            role: document.getElementById('role').value
        };
        
        if (userData.role === 'alumni') {
            userData.graduationYear = parseInt(document.getElementById('graduationYear').value);
            userData.department = document.getElementById('department').value;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        errorDiv.classList.add('hidden');
        
        const result = await window.auth.register(userData);
        
        if (result.success) {
            alert(result.message || 'Registration successful!');
            window.router.navigate(`/${result.user.role}/dashboard`);
        } else {
            errorDiv.className = 'alert alert-error';
            errorDiv.textContent = result.message;
            errorDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
}

