import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeStyles = {
    small: { width: '20px', height: '20px', fontSize: '0.9rem' },
    medium: { width: '40px', height: '40px', fontSize: '1.1rem' },
    large: { width: '60px', height: '60px', fontSize: '1.3rem' }
  };

  const currentSize = sizeStyles[size];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      background: '#f8fafc',
      gap: '1rem'
    }}>
      <div style={{
        width: currentSize.width,
        height: currentSize.height,
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <div style={{
        color: '#6b7280',
        fontSize: currentSize.fontSize,
        fontWeight: 500
      }}>
        {message}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner; 