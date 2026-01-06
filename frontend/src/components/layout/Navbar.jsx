import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    return `/${user.role}/dashboard`;
  };

  const getNavLinks = () => {
    if (!user) return null;

    if (user.role === 'admin') {
      return (
        <>
          <Link to="/admin/dashboard" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Dashboard
          </Link>
          <Link to="/admin/alumni" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Alumni
          </Link>
          <Link to="/admin/events" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Events
          </Link>
          <Link to="/admin/announcements" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Announcements
          </Link>
          <Link to="/admin/jobs" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Jobs
          </Link>
        </>
      );
    }

    if (user.role === 'alumni') {
      return (
        <>
          <Link to="/alumni/dashboard" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Dashboard
          </Link>
          <Link to="/alumni/profile" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Profile
          </Link>
          <Link to="/alumni/search" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Search Alumni
          </Link>
          <Link to="/alumni/events" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Events
          </Link>
          <Link to="/alumni/jobs" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Jobs
          </Link>
        </>
      );
    }

    if (user.role === 'student') {
      return (
        <>
          <Link to="/student/dashboard" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Dashboard
          </Link>
          <Link to="/student/alumni" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Alumni
          </Link>
          <Link to="/student/events" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Events
          </Link>
          <Link to="/student/jobs" className="px-4 py-2 text-gray-700 hover:text-primary-600">
            Jobs
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={getDashboardPath()} className="flex items-center space-x-2">
              <FiHome className="h-6 w-6 text-primary-600" />
              <span className="text-xl font-bold text-primary-600">Alumni Network</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-1">
              {getNavLinks()}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FiUser className="h-5 w-5" />
                  <span className="text-sm">{user.name}</span>
                  {user.role === 'alumni' && !user.isApproved && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                      Pending
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

