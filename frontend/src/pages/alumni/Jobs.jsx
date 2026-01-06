import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiBriefcase, FiMapPin, FiDollarSign } from 'react-icons/fi';

const AlumniJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    employmentType: 'full-time',
    contactEmail: '',
    salary: { min: '', max: '', currency: 'USD' }
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/alumni/jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/alumni/jobs', formData);
      setShowModal(false);
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        employmentType: 'full-time',
        contactEmail: '',
        salary: { min: '', max: '', currency: 'USD' }
      });
      fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <FiPlus className="h-5 w-5" />
          <span>Post a Job</span>
        </button>
      </div>

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
            </div>
            <p className="text-gray-700 mb-4">{job.description}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded flex items-center">
                <FiMapPin className="h-4 w-4 mr-1" />
                {job.location}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                {job.employmentType}
              </span>
              {job.salary?.min && job.salary?.max && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded flex items-center">
                  <FiDollarSign className="h-4 w-4 mr-1" />
                  {job.salary.currency} {job.salary.min} - {job.salary.max}
                </span>
              )}
            </div>
            <div className="mt-4">
              <a
                href={`mailto:${job.contactEmail}`}
                className="text-primary-600 hover:text-primary-700"
              >
                Contact: {job.contactEmail}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Post a Job Opportunity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="6"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniJobs;

