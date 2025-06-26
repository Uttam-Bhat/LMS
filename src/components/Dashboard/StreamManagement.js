import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';
import axios from 'axios';

const StreamManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', created: '', classId: '' });
  const [classes, setClasses] = useState([]);
  const streams = [
    { id: 1, name: 'Science', description: 'Science Stream', created: '6/5/2025', classId: '1', className: 'Class 10A' },
    { id: 2, name: 'Commerce', description: 'Commerce Stream', created: '6/5/2025', classId: '2', className: 'Class 9B' },
  ];
  const filtered = streams.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    // Fetch classes for dropdown
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/class/display');
        setClasses(response.data);
      } catch (error) {
        setClasses([]);
      }
    };
    fetchClasses();
  }, []);

  const openModal = (item) => {
    setEditItem(item);
    setForm(item ? { name: item.name, description: item.description, created: item.created, classId: item.classId || '' } : { name: '', description: '', created: '', classId: '' });
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
          <h1>Manage Streams</h1>
          <button className="add-stream-btn" onClick={() => { setShowModal(true); setEditItem(null); }}>Add Stream</button>
        </div>
        <div className="stream-filters">
          <div className="stream-search-box">
            <input type="text" placeholder="Search streams..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Class</th><th>Created</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.description}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{background:'#e8f0fe',color:'#2563eb',fontWeight:600,padding:'2px 10px',borderRadius:8,fontSize:'0.98rem'}}>
                        {s.className || 'N/A'}
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
                <h2>{editItem ? 'Edit Stream' : 'Add Stream'}</h2>
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
                {/* Class Dropdown */}
                <label style={{fontWeight: 500, marginBottom: 4}}>Class</label>
                <select
                  name="classId"
                  value={form.classId}
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
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.cls_id} value={cls.cls_id}>{cls.class_name}</option>
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
export default StreamManagement; 