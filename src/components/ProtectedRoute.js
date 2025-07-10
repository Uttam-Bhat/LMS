import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuth = isAuthenticated();
  const userType = localStorage.getItem('user_type');

  // Check if user is authenticated
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (if specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    // Redirect based on user type
    if (userType === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userType === 'student') {
      return <Navigate to="/student" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 