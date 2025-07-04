import React from 'react';

const ConfirmDialog = ({ open, title = 'Are you sure?', message = '', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 10,
        padding: '2rem',
        minWidth: 320,
        boxShadow: '0 2px 16px #0002',
        textAlign: 'center',
      }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem' }}>{title}</h2>
        <div style={{ marginBottom: 24, color: '#444' }}>{message}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '0.5rem 1.5rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            style={{
              background: '#e5e7eb',
              color: '#222',
              border: 'none',
              borderRadius: 6,
              padding: '0.5rem 1.5rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 