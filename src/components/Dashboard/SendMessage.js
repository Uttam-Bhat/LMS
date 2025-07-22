import React, { useState, useEffect } from 'react';
import api from '../../services/authService';
import toast from 'react-hot-toast';

const SendMessage = () => {
  const [mode, setMode] = useState('email'); // 'email' or 'class'
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [userList, setUserList] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [streamOptions, setStreamOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user list for email lookup
  useEffect(() => {
    api.get('/admin/users').then(res => {
      setUserList(Array.isArray(res.data) ? res.data : [res.data]);
    });
    // Fetch class options (correct endpoint)
    api.get('/class/display').then(res => {
      setClassOptions([{ value: '', label: 'Select Class' }, ...res.data.map(cls => ({ value: cls.cls_id, label: cls.class_name }))]);
    });
  }, []);

  // Fetch streams for selected class only, and ensure uniqueness
  useEffect(() => {
    if (!selectedClass) {
      setStreamOptions([{ value: '', label: 'Select Stream' }]);
      setSelectedStream('');
      return;
    }
    api.get(`/stream/display?class_id=${selectedClass}`).then(res => {
      console.log('Raw streams:', res.data);
      // Remove duplicate streams by sname (case-insensitive, trimmed)
      const seenNames = new Set();
      const unique = res.data.filter(s => {
        const name = (s.sname || '').trim().toLowerCase();
        if (seenNames.has(name)) return false;
        seenNames.add(name);
        return true;
      }).map(s => ({ value: s.sid, label: `${s.sname} (${s.class_details?.class_name || ''})` }));
      console.log('Unique streams:', unique);
      setStreamOptions([{ value: '', label: 'Select Stream' }, ...unique]);
    });
    setSelectedStream('');
  }, [selectedClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'email') {
        // Find user by email
        const user = userList.find(u => u.email === email);
        if (!user) {
          toast.error('No user found with that email.');
          setLoading(false);
          return;
        }
        await api.post('/message/msg-add', { user_id: user.id, msg: message });
        toast.success('Message sent to user!');
      } else {
        if (!selectedClass || !selectedStream) {
          toast.error('Please select both class and stream.');
          setLoading(false);
          return;
        }
        await api.post('/message/msg-add', { class_id: selectedClass, stream_id: selectedStream, msg: message });
        toast.success('Message sent to all students in class/stream!');
      }
      setEmail('');
      setMessage('');
      setSelectedClass('');
      setSelectedStream('');
    } catch (err) {
      toast.error('Failed to send message.');
    }
    setLoading(false);
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
              list="user-emails"
            />
            <datalist id="user-emails">
              {userList.map(u => <option key={u.id} value={u.email}>{u.fullname}</option>)}
            </datalist>
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
        <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 32px', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default SendMessage; 