import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiBriefcase, FiMapPin } from 'react-icons/fi';

const StudentAlumni = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    graduationYear: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, search, filters]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(search && { search }),
        ...(filters.department && { department: filters.department }),
        ...(filters.graduationYear && { graduationYear: filters.graduationYear })
      });

      const response = await axios.get(`/api/student/alumni?${params}`);
      setProfiles(response.data.profiles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Alumni Directory</h1>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, company, position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <input
            type="text"
            placeholder="Department"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="number"
            placeholder="Graduation Year"
            value={filters.graduationYear}
            onChange={(e) => setFilters({ ...filters, graduationYear: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div key={profile._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={profile.user?.profilePhoto || '/default-avatar.png'}
                    alt={profile.user?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{profile.user?.name}</h3>
                    <p className="text-sm text-gray-600">{profile.user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {profile.department && (
                    <p className="text-gray-600">
                      <strong>Department:</strong> {profile.department}
                    </p>
                  )}
                  {profile.graduationYear && (
                    <p className="text-gray-600">
                      <strong>Graduated:</strong> {profile.graduationYear}
                    </p>
                  )}
                  {profile.company && (
                    <p className="text-gray-600 flex items-center">
                      <FiBriefcase className="h-4 w-4 mr-2" />
                      {profile.position} at {profile.company}
                    </p>
                  )}
                  {profile.location?.city && (
                    <p className="text-gray-600 flex items-center">
                      <FiMapPin className="h-4 w-4 mr-2" />
                      {profile.location.city}, {profile.location.state}
                    </p>
                  )}
                </div>
                {profile.bio && (
                  <p className="text-sm text-gray-500 mt-4 line-clamp-2">{profile.bio}</p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentAlumni;

