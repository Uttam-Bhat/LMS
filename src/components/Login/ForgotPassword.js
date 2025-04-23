import React, { useState } from 'react';
import './loginform.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="login-container">
      <p className="create-account-text">
        Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Back to login</a>
      </p>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-header">
          <h2>Reset Password</h2>
          <p>Enter your email to receive a password reset link</p>
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <i className="fas fa-envelope input-icon"></i>
        </div>
        <button type="submit" className="login-button">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword; 