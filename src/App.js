// FILE: src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard  from './pages/UserDashboard';

// Fixed ProtectedRoute — no state updates inside render
function ProtectedRoute({ children, role }) {
  const token = useSelector(s => s.auth.token);
  const user  = useSelector(s => s.auth.user);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const token = useSelector(s => s.auth.token);
  const user  = useSelector(s => s.auth.user);

  const home = token
    ? (user?.role === 'ADMIN' ? '/admin' : '/dashboard')
    : '/login';

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to={home} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to={home} replace /> : <RegisterPage />}
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="USER">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}