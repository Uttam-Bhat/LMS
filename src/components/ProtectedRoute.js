import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('token_expiry');
  const isAuthenticated = token && expiry && Date.now() < Number(expiry);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute; 