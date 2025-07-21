import React, { useState } from 'react';

const SendMessage = () => {
  const [mode, setMode] = useState('email'); // 'email' or 'class'
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');

  // Dummy class/stream options for UI
  const classOptions = [
    { value: '', label: 'Select Class' },
    { value: '1', label: 'I PUC' },
    { value: '2', label: 'II PUC' }
  ];
  const streamOptions = [
    { value: '', label: 'Select Stream' },
    { value: '9', label: 'Commerce' },
    { value: '10', label: 'Science' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement backend integration
    alert('Message sent! (UI only)');
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e0e7ef', padding: '2rem' }}>
      <h2 style={{ color: '#2563eb', fontWeight: 700, marginBottom: 24 }}>Send Message</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setMode('email')}
          style={{ background: mode === 'email' ? '#2563eb' : '#e5e7eb', color: mode === 'email' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
        >
          Direct Email
        </button>
        <button
          onClick={() => setMode('class')}
          style={{ background: mode === 'class' ? '#2563eb' : '#e5e7eb', color: mode === 'class' ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}
        >
          Class/Stream Wise
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {mode === 'email' ? (
          <>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Recipient Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter email address"
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}
            />
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              placeholder="Type your message..."
              rows={5}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}
            />
          </>
        ) : (
          <>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Class</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}
            >
              {classOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Stream</label>
            <select
              value={selectedStream}
              onChange={e => setSelectedStream(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}
            >
              {streamOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block' }}>Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              placeholder="Type your message..."
              rows={5}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 16 }}
            />
          </>
        )}
        <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default SendMessage; 