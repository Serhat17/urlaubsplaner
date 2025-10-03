import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EnhancedManagerDashboard from './pages/EnhancedManagerDashboard';
import EnhancedAdminDashboard from './pages/EnhancedAdminDashboard';
import { Role } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/employee"
            element={
              <ProtectedRoute requiredRole={Role.EMPLOYEE}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manager"
            element={
              <ProtectedRoute requiredRole={Role.MANAGER}>
                <EnhancedManagerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={Role.SUPER_MANAGER}>
                <EnhancedAdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
