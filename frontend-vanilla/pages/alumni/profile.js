// Alumni Profile

export async function renderAlumniProfile() {
    const app = document.getElementById('app');
    window.utils.showLoading(app);
    
    try {
        const data = await window.api.alumni.getProfile();
        const profile = data.profile;
        
        app.innerHTML = `
            <div class="container">
                <h1 style="margin-bottom: 2rem;">My Profile</h1>
                <div class="card">
                    <form id="profileForm">
                        <div class="grid grid-cols-2">
                            <div class="form-group">
                                <label class="form-label">Graduation Year</label>
                                <input type="number" id="graduationYear" class="form-input" value="${profile.graduationYear || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Department</label>
                                <input type="text" id="department" class="form-input" value="${profile.department || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Company</label>
                                <input type="text" id="company" class="form-input" value="${profile.company || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Position</label>
                                <input type="text" id="position" class="form-input" value="${profile.position || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">City</label>
                                <input type="text" id="city" class="form-input" value="${profile.location?.city || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">State</label>
                                <input type="text" id="state" class="form-input" value="${profile.location?.state || ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Bio</label>
                            <textarea id="bio" class="form-input form-textarea">${profile.bio || ''}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Profile</button>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('profileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const profileData = {
                graduationYear: parseInt(document.getElementById('graduationYear').value),
                department: document.getElementById('department').value,
                company: document.getElementById('company').value,
                position: document.getElementById('position').value,
                location: {
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value
                },
                bio: document.getElementById('bio').value
            };
            
            try {
                await window.api.alumni.updateProfile(profileData);
                alert('Profile updated successfully!');
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    } catch (error) {
        window.utils.showError(app, error.message);
    }
}

