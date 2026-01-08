// Alumni Search

export async function renderAlumniSearch() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container">
            <h1 style="margin-bottom: 2rem;">Search Alumni</h1>
            <div class="card">
                <div class="grid grid-cols-4" style="gap: 1rem; margin-bottom: 1rem;">
                    <input type="text" id="searchInput" class="form-input" placeholder="Search...">
                    <input type="text" id="departmentFilter" class="form-input" placeholder="Department">
                    <input type="number" id="yearFilter" class="form-input" placeholder="Graduation Year">
                    <input type="text" id="companyFilter" class="form-input" placeholder="Company">
                </div>
            </div>
            <div id="resultsContainer">Loading...</div>
        </div>
    `;
    
    loadResults();
    
    document.getElementById('searchInput').addEventListener('input', window.utils.debounce(loadResults, 500));
    document.getElementById('departmentFilter').addEventListener('input', window.utils.debounce(loadResults, 500));
    document.getElementById('yearFilter').addEventListener('input', window.utils.debounce(loadResults, 500));
    document.getElementById('companyFilter').addEventListener('input', window.utils.debounce(loadResults, 500));
}

async function loadResults() {
    const container = document.getElementById('resultsContainer');
    const params = {
        query: document.getElementById('searchInput').value,
        department: document.getElementById('departmentFilter').value,
        graduationYear: document.getElementById('yearFilter').value,
        company: document.getElementById('companyFilter').value
    };
    
    try {
        const data = await window.api.alumni.searchAlumni(params);
        
        if (data.profiles && data.profiles.length > 0) {
            container.innerHTML = `
                <div class="grid grid-cols-3">
                    ${data.profiles.map(profile => `
                        <div class="card">
                            <h3>${profile.user?.name}</h3>
                            <p>${profile.user?.email}</p>
                            <p><strong>Department:</strong> ${profile.department || 'N/A'}</p>
                            <p><strong>Graduated:</strong> ${profile.graduationYear || 'N/A'}</p>
                            ${profile.company ? `<p><strong>Company:</strong> ${profile.company}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            container.innerHTML = '<p>No results found</p>';
        }
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}

