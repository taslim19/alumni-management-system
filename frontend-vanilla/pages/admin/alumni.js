// Admin Alumni Management

let currentPage = 1;

export async function renderAdminAlumni() {
    const app = document.getElementById('app');
    window.utils.showLoading(app);
    
    try {
        await loadAlumni();
    } catch (error) {
        window.utils.showError(app, error.message);
    }
}

async function loadAlumni() {
    const app = document.getElementById('app');
    const search = document.getElementById('searchInput')?.value || '';
    const isApproved = document.getElementById('statusFilter')?.value || '';
    
    const params = {
        page: currentPage,
        limit: 10,
        ...(search && { search }),
        ...(isApproved && { isApproved })
    };
    
    const data = await window.api.admin.getAlumni(params);
    
    app.innerHTML = `
        <div class="container">
            <div class="flex-between" style="margin-bottom: 1.5rem;">
                <h1>Alumni Management</h1>
                <div>
                    <button onclick="exportData('csv')" class="btn btn-primary">Export CSV</button>
                    <button onclick="exportData('pdf')" class="btn btn-danger">Export PDF</button>
                </div>
            </div>
            
            <div class="card">
                <div class="grid grid-cols-3" style="gap: 1rem;">
                    <input type="text" id="searchInput" class="form-input" placeholder="Search by name or email..." 
                           onkeyup="debounceSearch()">
                    <select id="statusFilter" class="form-input" onchange="loadAlumni()">
                        <option value="">All Status</option>
                        <option value="true">Approved</option>
                        <option value="false">Pending</option>
                    </select>
                </div>
            </div>
            
            <div class="card">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Graduation Year</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.alumni && data.alumni.length > 0
                            ? data.alumni.map(item => {
                                const user = item.user || item;
                                const profile = item.user ? item : null;
                                return `
                                    <tr>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${profile?.department || 'N/A'}</td>
                                        <td>${profile?.graduationYear || 'N/A'}</td>
                                        <td>${profile?.company || 'N/A'}</td>
                                        <td>${user.isApproved 
                                            ? '<span class="badge badge-success">Approved</span>' 
                                            : '<span class="badge badge-warning">Pending</span>'}</td>
                                        <td>
                                            <button onclick="toggleApproval('${user._id}', ${!user.isApproved})" 
                                                    class="btn ${user.isApproved ? 'btn-secondary' : 'btn-primary'}" 
                                                    style="margin-right: 0.5rem;">
                                                ${user.isApproved ? 'Reject' : 'Approve'}
                                            </button>
                                            <button onclick="deleteAlumni('${user._id}')" class="btn btn-danger">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')
                            : '<tr><td colspan="7" class="text-center">No alumni found</td></tr>'
                        }
                    </tbody>
                </table>
                
                ${data.totalPages > 1 ? `
                    <div class="flex-between mt-4">
                        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} 
                                class="btn btn-secondary">Previous</button>
                        <span>Page ${currentPage} of ${data.totalPages}</span>
                        <button onclick="changePage(${currentPage + 1})" ${currentPage === data.totalPages ? 'disabled' : ''} 
                                class="btn btn-secondary">Next</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

window.debounceSearch = window.utils.debounce(() => {
    currentPage = 1;
    loadAlumni();
}, 500);

window.changePage = (page) => {
    currentPage = page;
    loadAlumni();
};

window.toggleApproval = async (id, isApproved) => {
    if (!confirm(`Are you sure you want to ${isApproved ? 'approve' : 'reject'} this alumni?`)) return;
    
    try {
        await window.api.admin.approveAlumni(id, isApproved);
        alert('Status updated successfully!');
        loadAlumni();
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

window.deleteAlumni = async (id) => {
    if (!confirm('Are you sure you want to delete this alumni?')) return;
    
    try {
        await window.api.admin.deleteAlumni(id);
        alert('Alumni deleted successfully!');
        loadAlumni();
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

window.exportData = async (format) => {
    try {
        const response = format === 'csv' 
            ? await window.api.admin.exportCSV()
            : await window.api.admin.exportPDF();
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `alumni_export.${format}`;
        a.click();
    } catch (error) {
        alert('Error exporting data: ' + error.message);
    }
};

