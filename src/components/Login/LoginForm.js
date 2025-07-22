import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './loginform.css';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, token } = await login(formData.email, formData.password);

      toast.success(`Welcome ${user.fullname}!`);
      // Store user information
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_type', user.user_type);
      
      // Store student_id for enrollment and other student actions
      if (user.user_type === 'student' && user.st_id) {
        localStorage.setItem('student_id', user.st_id);
      } else {
        localStorage.removeItem('student_id');
      }

      // Set token expiry (1 hour from now)
      const expiry = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('token_expiry', expiry);

      // Role-based redirection
      if (user.user_type === 'admin') {
        navigate('/admin');
      } else if (user.user_type === 'student') {
        navigate('/student');
      } else {
        alert('Unknown user type');
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <p className="create-account-text">
        New to the platform? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Create an account</a>
      </p>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-header">
          <h2>Welcome Back!</h2>
          <p>Please sign in to continue</p>
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <i className="fas fa-envelope input-icon"></i>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <i className="fas fa-lock input-icon"></i>
        </div>
        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }} className="forgot-password">
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 