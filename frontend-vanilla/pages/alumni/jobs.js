// Alumni Jobs

export async function renderAlumniJobs() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container">
            <div class="flex-between" style="margin-bottom: 1.5rem;">
                <h1>Job Postings</h1>
                <button onclick="showJobModal()" class="btn btn-primary">Post a Job</button>
            </div>
            <div id="jobsContainer">Loading...</div>
        </div>
    `;
    
    loadJobs();
}

async function loadJobs() {
    try {
        const data = await window.api.alumni.getJobs();
        const container = document.getElementById('jobsContainer');
        
        if (data.jobs && data.jobs.length > 0) {
            container.innerHTML = data.jobs.map(job => `
                <div class="card">
                    <h3>${job.title}</h3>
                    <p style="color: var(--primary-600); font-weight: 600;">${job.company}</p>
                    <p>${job.description}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <p><strong>Type:</strong> ${job.employmentType}</p>
                    <p><a href="mailto:${job.contactEmail}">Contact: ${job.contactEmail}</a></p>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>No job postings</p>';
        }
    } catch (error) {
        document.getElementById('jobsContainer').innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}

window.showJobModal = () => alert('Job posting modal - implement as needed');

