import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout
    logout();
    
    // Redirect to login page
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      Logging out...
    </div>
  );
};

export default Logout; 