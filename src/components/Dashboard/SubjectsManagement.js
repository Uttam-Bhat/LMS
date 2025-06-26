import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';
import axios from 'axios';

const SubjectsManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', created: '', streamId: '' });
  const [streams, setStreams] = useState([]);
  const subjects = [
    { id: 1, name: 'Mathematics', description: 'Math Subject', created: '6/5/2025', streamId: '1', streamName: 'Science' },
    { id: 2, name: 'Physics', description: 'Physics Subject', created: '6/5/2025', streamId: '2', streamName: 'Commerce' },
  ];
  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    // Fetch streams for dropdown
    const fetchStreams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stream/display');
        setStreams(response.data);
      } catch (error) {
        setStreams([]);
      }
    };
    fetchStreams();
  }, []);

  const openModal = (item) => {
    setEditItem(item);
    setForm(item ? { name: item.name, description: item.description, created: item.created, streamId: item.streamId || '' } : { name: '', description: '', created: '', streamId: '' });
    setShowModal(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  return (
    <DashboardLayout>
      <div className="stream-management">
        <div className="stream-header">
          <h1>Manage Subjects</h1>
          <button className="add-stream-btn" onClick={() => { setShowModal(true); setEditItem(null); }}>Add Subject</button>
        </div>
        <div className="stream-filters">
          <div className="stream-search-box">
            <input type="text" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Stream</th><th>Created</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.description}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{background:'#e8f0fe',color:'#2563eb',fontWeight:600,padding:'2px 10px',borderRadius:8,fontSize:'0.98rem'}}>
                        {s.streamName || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td>{s.created}</td>
                  <td>
                    <div className="stream-action-buttons">
                      <button className="stream-edit-btn" onClick={() => openModal(s)}>Edit</button>
                      <button className="stream-delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="stream-modal-overlay">
            <div className="stream-modal">
              <div className="stream-modal-header">
                <h2>{editItem ? 'Edit Subject' : 'Add Subject'}</h2>
                <button className="stream-close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
                <input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleInputChange}
                />
                <input
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleInputChange}
                />
                {/* Stream Dropdown */}
                <label style={{fontWeight: 500, marginBottom: 4}}>Stream</label>
                <select
                  name="streamId"
                  value={form.streamId}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e1e1e1',
                    borderRadius: 8,
                    fontSize: '1rem',
                    background: '#fff',
                    color: '#1a1a1a',
                    outline: 'none',
                  }}
                  required
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream.id || stream._id} value={stream.id || stream._id}>{stream.name}</option>
                  ))}
                </select>
                <label style={{fontWeight: 500}}>Created Date</label>
                <input
                  type="date"
                  name="created"
                  value={form.created}
                  onChange={handleInputChange}
                  required
                />
                <button className="add-stream-btn" onClick={() => setShowModal(false)}>{editItem ? 'Save' : 'Add'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default SubjectsManagement; 