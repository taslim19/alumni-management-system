import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAlumni from './pages/admin/Alumni';
import AdminEvents from './pages/admin/Events';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminJobs from './pages/admin/Jobs';
import AlumniDashboard from './pages/alumni/Dashboard';
import AlumniProfile from './pages/alumni/Profile';
import AlumniSearch from './pages/alumni/Search';
import AlumniEvents from './pages/alumni/Events';
import AlumniJobs from './pages/alumni/Jobs';
import StudentDashboard from './pages/student/Dashboard';
import StudentAlumni from './pages/student/Alumni';
import StudentEvents from './pages/student/Events';
import StudentJobs from './pages/student/Jobs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/alumni"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminAlumni />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminEvents />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminAnnouncements />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminJobs />
                </PrivateRoute>
              }
            />
            
            {/* Alumni Routes */}
            <Route
              path="/alumni/dashboard"
              element={
                <PrivateRoute roles={['alumni']}>
                  <AlumniDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/alumni/profile"
              element={
                <PrivateRoute roles={['alumni']}>
                  <AlumniProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/alumni/search"
              element={
                <PrivateRoute roles={['alumni']}>
                  <AlumniSearch />
                </PrivateRoute>
              }
            />
            <Route
              path="/alumni/events"
              element={
                <PrivateRoute roles={['alumni']}>
                  <AlumniEvents />
                </PrivateRoute>
              }
            />
            <Route
              path="/alumni/jobs"
              element={
                <PrivateRoute roles={['alumni']}>
                  <AlumniJobs />
                </PrivateRoute>
              }
            />
            
            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <PrivateRoute roles={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/alumni"
              element={
                <PrivateRoute roles={['student']}>
                  <StudentAlumni />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/events"
              element={
                <PrivateRoute roles={['student']}>
                  <StudentEvents />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/jobs"
              element={
                <PrivateRoute roles={['student']}>
                  <StudentJobs />
                </PrivateRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

