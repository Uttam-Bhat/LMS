import React, { useState } from 'react';
import './loginform.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: captcha, 3: reset
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/user/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.status === 200) {
        setStep(2);
        toast.success('Email verified!');
      } else if (res.status === 404) {
        toast.error('Email not found');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Email not found');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleCaptcha = (e) => {
    e.preventDefault();
    if (captchaInput.trim().toUpperCase() !== captcha) {
      setCaptchaError('Captcha does not match');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }
    setCaptchaError('');
    setStep(3);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    if (!newPassword || !confirmPassword) {
      setResetError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/user/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await res.json();
      if (res.status === 200) {
        setLoading(false);
        setResetSuccess('Password reset successfully!');
        toast.success('Password reset successfully!');
        setStep(1);
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
      } else {
        setLoading(false);
        setResetError(data.message || 'Failed to reset password');
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setLoading(false);
      setResetError('Network error');
      toast.error('Network error');
    }
  };

  return (
    <div className="login-container">
      <p className="create-account-text">
        Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Back to login</a>
      </p>
      <form className="login-form" style={step > 1 ? { maxWidth: 480, minHeight: 420, transition: 'all 0.3s' } : {}}>
        <div className="form-header">
          <h2>Reset Password</h2>
          <p>Enter your email to reset your password</p>
        </div>
        {step === 1 && (
          <>
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
            <button className="login-button" onClick={handleVerify} type="submit">
              Verify
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                style={{ background: '#f3f6fa', color: '#888' }}
              />
              <i className="fas fa-envelope input-icon"></i>
            </div>
            <div className="form-group" style={{ textAlign: 'center' }}>
              <label>Captcha</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{
                  background: '#f3f6fa',
                  border: '2px dashed #2563eb',
                  borderRadius: 8,
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: '#2563eb',
                  padding: '0.5rem 1.2rem',
                  userSelect: 'none',
                  fontFamily: 'monospace',
                }}>{captcha}</div>
                <button type="button" style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 20, cursor: 'pointer' }} onClick={() => setCaptcha(generateCaptcha())} title="Refresh Captcha">
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter captcha"
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                style={{ textAlign: 'center', letterSpacing: 2 }}
                required
              />
              {captchaError && <div style={{ color: '#e11d48', fontSize: '0.98rem', marginTop: 4 }}>{captchaError}</div>}
            </div>
            <button className="login-button" onClick={handleCaptcha} type="submit">
              Next
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                style={{ background: '#f3f6fa', color: '#888' }}
              />
              <i className="fas fa-envelope input-icon"></i>
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <i className="fas fa-lock input-icon"></i>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <i className="fas fa-lock input-icon"></i>
            </div>
            {resetError && <div style={{ color: '#e11d48', fontSize: '0.98rem', marginBottom: 8 }}>{resetError}</div>}
            {resetSuccess && <div style={{ color: '#16a34a', fontSize: '0.98rem', marginBottom: 8 }}>{resetSuccess}</div>}
            <button className="login-button" onClick={handleReset} type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword; 