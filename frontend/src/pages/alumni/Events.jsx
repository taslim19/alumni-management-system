import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiMapPin, FiUsers, FiCheck } from 'react-icons/fi';

const AlumniEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/alumni/events');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await axios.post(`/api/alumni/events/${eventId}/register`);
      alert('Successfully registered for event');
      fetchEvents();
    } catch (error) {
      console.error('Error registering:', error);
      alert(error.response?.data?.message || 'Failed to register for event');
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await axios.post(`/api/alumni/events/${eventId}/unregister`);
      alert('Successfully unregistered from event');
      fetchEvents();
    } catch (error) {
      console.error('Error unregistering:', error);
      alert('Failed to unregister from event');
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isRegistered = event.registeredUsers?.some(
            user => user._id === JSON.parse(localStorage.getItem('user') || '{}').id
          );

          return (
            <div key={event._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                {isRegistered && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    Registered
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <p className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                </p>
                <p className="flex items-center">
                  <FiMapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </p>
                <p className="flex items-center">
                  <FiUsers className="h-4 w-4 mr-2" />
                  {event.registeredUsers?.length || 0} registered
                  {event.maxAttendees && ` / ${event.maxAttendees} max`}
                </p>
              </div>
              <button
                onClick={() => isRegistered ? handleUnregister(event._id) : handleRegister(event._id)}
                className={`w-full py-2 px-4 rounded-md ${
                  isRegistered
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isRegistered ? 'Unregister' : 'Register'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlumniEvents;

