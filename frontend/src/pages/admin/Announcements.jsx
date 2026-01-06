import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: ['all'],
    isImportant: false
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/announcements', formData);
      setShowModal(false);
      setFormData({
        title: '',
        message: '',
        targetAudience: ['all'],
        isImportant: false
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Failed to save announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await axios.delete(`/api/admin/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
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
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <button
          onClick={() => {
            setEditingAnnouncement(null);
            setFormData({
              title: '',
              message: '',
              targetAudience: ['all'],
              isImportant: false
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <FiPlus className="h-5 w-5" />
          <span>Create Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className={`bg-white rounded-lg shadow p-6 ${
              announcement.isImportant ? 'border-l-4 border-yellow-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Posted by {announcement.postedBy?.name} on{' '}
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(announcement._id)}
                className="text-red-600 hover:text-red-900"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-700">{announcement.message}</p>
            <div className="mt-2 flex space-x-2">
              {announcement.targetAudience.map((audience) => (
                <span
                  key={audience}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {audience}
                </span>
              ))}
              {announcement.isImportant && (
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                  Important
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                <select
                  multiple
                  value={formData.targetAudience}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({ ...formData, targetAudience: values });
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All</option>
                  <option value="alumni">Alumni</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isImportant" className="ml-2 block text-sm text-gray-900">
                  Mark as Important
                </label>
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;

