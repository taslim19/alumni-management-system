import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiCalendar, FiBriefcase, FiUsers, FiBell } from 'react-icons/fi';

const AlumniDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, announcementsRes] = await Promise.all([
        axios.get('/api/alumni/events'),
        axios.get('/api/alumni/announcements')
      ]);

      setRecentEvents(eventsRes.data.events.slice(0, 3));
      setAnnouncements(announcementsRes.data.announcements.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Alumni Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/alumni/profile"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">My Profile</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">View</p>
            </div>
            <FiUsers className="h-8 w-8 text-primary-600" />
          </div>
        </Link>
        <Link
          to="/alumni/events"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Browse</p>
            </div>
            <FiCalendar className="h-8 w-8 text-primary-600" />
          </div>
        </Link>
        <Link
          to="/alumni/jobs"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Job Postings</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">View</p>
            </div>
            <FiBriefcase className="h-8 w-8 text-primary-600" />
          </div>
        </Link>
        <Link
          to="/alumni/search"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Search Alumni</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Connect</p>
            </div>
            <FiUsers className="h-8 w-8 text-primary-600" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/alumni/events" className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div key={event._id} className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(event.date).toLocaleDateString()} • {event.location}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
            <FiBell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement._id}>
                  <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No announcements</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;

