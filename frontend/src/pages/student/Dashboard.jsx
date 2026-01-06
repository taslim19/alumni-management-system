import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiBriefcase } from 'react-icons/fi';

const StudentDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/student/alumni"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Browse Alumni</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Connect</p>
            </div>
            <FiUsers className="h-8 w-8 text-primary-600" />
          </div>
        </Link>
        <Link
          to="/student/events"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Explore</p>
            </div>
            <FiCalendar className="h-8 w-8 text-primary-600" />
          </div>
        </Link>
        <Link
          to="/student/jobs"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Job Opportunities</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">View</p>
            </div>
            <FiBriefcase className="h-8 w-8 text-primary-600" />
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome!</h2>
        <p className="text-gray-600">
          As a student, you can browse alumni profiles, view job postings, and register for events.
          Use the navigation above to explore the alumni network.
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;

