import React, { useState } from 'react';
import './loginform.css';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
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
          <label>ID</label>
          <input
            type="text"
            name="id"
            placeholder="Enter your ID"
            value={formData.id}
            onChange={handleChange}
            required
          />
          <i className="fas fa-id-card input-icon"></i>
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
        <button type="submit" className="login-button">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default RegisterForm; 