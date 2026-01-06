import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/admin/jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await axios.delete(`/api/admin/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job posting');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Job Postings Management</h1>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="text-lg text-primary-600 font-medium">{job.company}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Posted by {job.postedBy?.name} on {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(job._id)}
                className="text-red-600 hover:text-red-900"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-4">{job.description}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded">
                {job.location}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                {job.employmentType}
              </span>
              {job.salary && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded">
                  {job.salary.min && job.salary.max
                    ? `${job.salary.currency} ${job.salary.min} - ${job.salary.max}`
                    : 'Salary not specified'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminJobs;

