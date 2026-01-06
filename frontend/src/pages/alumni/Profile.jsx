import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUpload, FiSave } from 'react-icons/fi';

const AlumniProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    graduationYear: '',
    department: '',
    degree: '',
    company: '',
    position: '',
    location: {
      city: '',
      state: '',
      country: ''
    },
    bio: '',
    linkedin: '',
    github: '',
    website: '',
    phone: '',
    skills: [],
    privacySettings: {
      showEmail: false,
      showPhone: false,
      showLocation: true
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/alumni/profile');
      const profileData = response.data.profile;
      setProfile(profileData);
      setFormData({
        graduationYear: profileData.graduationYear || '',
        department: profileData.department || '',
        degree: profileData.degree || '',
        company: profileData.company || '',
        position: profileData.position || '',
        location: {
          city: profileData.location?.city || '',
          state: profileData.location?.state || '',
          country: profileData.location?.country || ''
        },
        bio: profileData.bio || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        website: profileData.website || '',
        phone: profileData.phone || '',
        skills: profileData.skills || [],
        privacySettings: profileData.privacySettings || {
          showEmail: false,
          showPhone: false,
          showLocation: true
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value }
      });
    } else if (name.startsWith('privacySettings.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        privacySettings: { ...formData.privacySettings, [field]: !formData.privacySettings[field] }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData({ ...formData, skills });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post('/api/alumni/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Profile photo uploaded successfully');
      fetchProfile();
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put('/api/alumni/profile', formData);
      alert('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <img
              src={profile?.user?.profilePhoto || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
              <FiUpload className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{profile?.user?.name}</h2>
            <p className="text-gray-600">{profile?.user?.email}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Degree</label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GitHub</label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            maxLength={1000}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
          <input
            type="text"
            value={formData.skills.join(', ')}
            onChange={handleSkillsChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., JavaScript, React, Node.js"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="privacySettings.showEmail"
                checked={formData.privacySettings.showEmail}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show email to other users</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="privacySettings.showPhone"
                checked={formData.privacySettings.showPhone}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show phone to other users</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="privacySettings.showLocation"
                checked={formData.privacySettings.showLocation}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Show location to other users</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          <FiSave className="h-5 w-5" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </form>
    </div>
  );
};

export default AlumniProfile;

