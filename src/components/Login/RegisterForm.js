import React, { useState } from 'react';
import './loginform.css';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    // Handle registration logic here
    console.log('Registration attempt with:', formData);
  };

  return (
    <div className="login-container">
      <p className="create-account-text">
        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Sign in</a>
      </p>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-header">
          <h2>Create Account</h2>
          <p>Please fill in your details to register</p>
        </div>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <i className="fas fa-user input-icon"></i>
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <i className="fas fa-at input-icon"></i>
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
            placeholder="Create your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <i className="fas fa-lock input-icon"></i>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <i className="fas fa-lock input-icon"></i>
        </div>
        <button type="submit" className="login-button">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegisterForm; 