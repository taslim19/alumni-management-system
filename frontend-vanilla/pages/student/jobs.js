// Student Jobs

export async function renderStudentJobs() {
    const app = document.getElementById('app');
    window.utils.showLoading(app);
    
    try {
        const data = await window.api.student.getJobs();
        
        app.innerHTML = `
            <div class="container">
                <h1 style="margin-bottom: 2rem;">Job Opportunities</h1>
                <div class="card">
                    ${data.jobs && data.jobs.length > 0
                        ? data.jobs.map(job => `
                            <div style="padding: 1rem; border-bottom: 1px solid var(--gray-200);">
                                <h3>${job.title}</h3>
                                <p style="color: var(--primary-600); font-weight: 600;">${job.company}</p>
                                <p>${job.description}</p>
                                <p><strong>Location:</strong> ${job.location}</p>
                                <p><strong>Type:</strong> ${job.employmentType}</p>
                                <p><a href="mailto:${job.contactEmail}">Contact: ${job.contactEmail}</a></p>
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

