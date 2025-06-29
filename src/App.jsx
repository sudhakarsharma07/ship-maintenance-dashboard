import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipsPage from './pages/ShipsPage';
import ShipDetailPage from './pages/ShipDetailPage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/UI/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import NotificationCenter from './components/Notifications/NotificationCenter';

function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <NotificationCenter />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="ships" element={<ShipsPage />} />
          <Route path="ships/:shipId" element={<ShipDetailPage />} />
          <Route path="jobs" element={<JobsPage />} />
          
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;