// Admin Jobs

export async function renderAdminJobs() {
    const app = document.getElementById('app');
    window.utils.showLoading(app);
    
    try {
        const data = await window.api.admin.getJobs();
        
        app.innerHTML = `
            <div class="container">
                <h1 style="margin-bottom: 2rem;">Job Postings Management</h1>
                <div class="card">
                    ${data.jobs && data.jobs.length > 0
                        ? data.jobs.map(job => `
                            <div style="padding: 1rem; border-bottom: 1px solid var(--gray-200);">
                                <div class="flex-between">
                                    <div>
                                        <h3>${job.title}</h3>
                                        <p style="color: var(--primary-600); font-weight: 600;">${job.company}</p>
                                        <p>${job.description}</p>
                                        <p style="font-size: 0.875rem; color: var(--gray-500);">
                                            Posted by ${job.postedBy?.name} on ${window.utils.formatDate(job.createdAt)}
                                        </p>
                                    </div>
                                    <button onclick="deleteJob('${job._id}')" class="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        `).join('')
                        : '<p>No job postings</p>'
                    }
                </div>
            </div>
        `;
    } catch (error) {
        window.utils.showError(app, error.message);
    }
}

window.deleteJob = async (id) => {
    if (confirm('Delete this job posting?')) {
        try {
            await window.api.admin.deleteJob(id);
            window.router.loadPage();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
};

