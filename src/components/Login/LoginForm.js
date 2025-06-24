import React, { useState } from 'react';
import './loginform.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email: formData.email,
        password: formData.password
      });

      const user = response.data.user;

      alert(`Welcome ${user.fullname}!`);

      // Role-based redirection
      if (user.user_type === 'admin') {
        navigate('/admin');
      }else if (user.user_type === 'student') {
        navigate('/student');
      } else {
        alert('Unknown user type');
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Login failed');
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