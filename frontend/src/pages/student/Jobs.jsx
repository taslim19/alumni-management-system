import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBriefcase, FiMapPin, FiDollarSign } from 'react-icons/fi';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    employmentType: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [search, filters]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.employmentType && { employmentType: filters.employmentType })
      });

      const response = await axios.get(`/api/jobs?${params}`);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Opportunities</h1>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <select
            value={filters.employmentType}
            onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="text-lg text-primary-600 font-medium">{job.company}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
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
    </div>
  );
};

export default StudentJobs;

