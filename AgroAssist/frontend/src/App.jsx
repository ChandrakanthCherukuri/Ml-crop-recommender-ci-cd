import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AddSensorData from './pages/farmer/AddSensorData';
import SensorData from './pages/farmer/SensorData';
import MLPredictions from './pages/farmer/MLPredictions';
import PredictionHistory from './pages/farmer/PredictionHistory';

// Agronomist Pages
import AgronomistDashboard from './pages/agronomist/AgronomistDashboard';
import AgronomistFarmers from './pages/agronomist/AgronomistFarmers';
import AgronomistMLPredictions from './pages/agronomist/AgronomistMLPredictions';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAssignments from './pages/admin/AdminAssignments';
import AdminSensorData from './pages/admin/AdminSensorData';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Farmer Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/sensor-data"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <SensorData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/add-sensor-data"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <AddSensorData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/ml-predictions"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <MLPredictions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/prediction-history"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <PredictionHistory />
              </ProtectedRoute>
            }
          />

          {/* Agronomist Routes */}
          <Route
            path="/agronomist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['agronomist']}>
                <AgronomistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agronomist/farmers"
            element={
              <ProtectedRoute allowedRoles={['agronomist']}>
                <AgronomistFarmers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agronomist/ml-predictions"
            element={
              <ProtectedRoute allowedRoles={['agronomist']}>
                <AgronomistMLPredictions />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assignments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sensor-data"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSensorData />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
