import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';
import axios from 'axios';

const ChaptersManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', created: '', subjectId: '' });
  const [subjects, setSubjects] = useState([]);
  const chapters = [
    { id: 1, name: 'Chapter 1', description: 'Intro', created: '6/5/2025', subjectId: '1', subjectName: 'Mathematics' },
    { id: 2, name: 'Chapter 2', description: 'Advanced', created: '6/5/2025', subjectId: '2', subjectName: 'Physics' },
  ];
  const filtered = chapters.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    // Fetch subjects for dropdown
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/subject/display');
        setSubjects(response.data);
      } catch (error) {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  const openModal = (item) => {
    setEditItem(item);
    setForm(item ? { name: item.name, description: item.description, created: item.created, subjectId: item.subjectId || '' } : { name: '', description: '', created: '', subjectId: '' });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="stream-management">
        <div className="stream-header">
          <h1>Manage Chapters</h1>
          <button className="add-stream-btn" onClick={() => { setShowModal(true); setEditItem(null); }}>Add Chapter</button>
        </div>
        <div className="stream-filters">
          <div className="stream-search-box">
            <input type="text" placeholder="Search chapters..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Subject</th><th>Created</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.description}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{background:'#e8f0fe',color:'#2563eb',fontWeight:600,padding:'2px 10px',borderRadius:8,fontSize:'0.98rem'}}>
                        {s.subjectName || 'N/A'}
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
                <h2>{editItem ? 'Edit Chapter' : 'Add Chapter'}</h2>
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
                {/* Subject Dropdown */}
                <label style={{fontWeight: 500, marginBottom: 4}}>Subject</label>
                <select
                  name="subjectId"
                  value={form.subjectId}
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
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id || subject._id} value={subject.id || subject._id}>{subject.name}</option>
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
export default ChaptersManagement; 