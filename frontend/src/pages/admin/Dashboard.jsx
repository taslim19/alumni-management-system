import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiCalendar, FiBriefcase, FiCheckCircle, FiClock } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.statistics);
      setRecentRegistrations(response.data.recentRegistrations);
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

  const chartData = [
    { name: 'Approved', value: stats?.approvedAlumni || 0 },
    { name: 'Pending', value: stats?.pendingAlumni || 0 }
  ];

  const COLORS = ['#3b82f6', '#f59e0b'];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Alumni"
          value={stats?.totalAlumni || 0}
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Approved Alumni"
          value={stats?.approvedAlumni || 0}
          icon={FiCheckCircle}
          color="green"
        />
        <StatCard
          title="Pending Approval"
          value={stats?.pendingAlumni || 0}
          icon={FiClock}
          color="yellow"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={FiCalendar}
          color="purple"
        />
        <StatCard
          title="Active Jobs"
          value={stats?.totalJobs || 0}
          icon={FiBriefcase}
          color="indigo"
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={FiUsers}
          color="pink"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={FiUsers}
          color="teal"
        />
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          icon={FiCalendar}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alumni Approval Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {recentRegistrations.length > 0 ? (
              recentRegistrations.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'alumni' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                    {!user.isApproved && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent registrations</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

