import React, { useState } from 'react';
import './loginform.css';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', formData);
  };

  return (
    <div className="login-container">
      <p className="create-account-text">
        New to the platform? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Create an account</a>
      </p>
      <form onSubmit={handleSubmit} className="login-form">
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