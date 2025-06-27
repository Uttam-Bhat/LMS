import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const StreamManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', created: '', classId: '' });
  const [classes, setClasses] = useState([]);
  const [streamList, setStreamList] = useState([]);

  useEffect(() => {
    // Fetch classes for dropdown
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/class/display');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes', error);
        setClasses([]);
      }
    };

    const fetchStreams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/stream/display');
        setStreamList(response.data);
      } catch (error) {
        console.error('Error fetching streams', error);
        setStreamList([]);
      }
    };

    fetchClasses();
    fetchStreams();
  }, []);

  const openModal = (item) => {
    setEditItem(item);
    setForm(item ? {
      name: item.name,
      description: item.description,
      created: item.created,
      classId: item.classId || ''
    } : { name: '', description: '', created: '', classId: '' });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStream = async () => {
    try {
      await axios.post('http://localhost:3000/api/stream/add', {
        sname: form.name,
        des: form.description,
        cdate: form.created,
        cls_id: form.classId
      });
      setShowModal(false);
      setForm({ name: '', description: '', created: '', classId: '' });

      // Refresh stream list after adding
      const response = await axios.get('http://localhost:3000/api/stream/display');
      setStreamList(response.data);
    } catch (error) {
      console.error('Failed to add stream:', error);
      alert('Failed to add stream. Please try again.');
    }
  };

  const filtered = streamList.filter(s => 
  (s.name || s.sname || '').toLowerCase().includes(search.toLowerCase())
);

  return (
    <DashboardLayout>
      <div className="stream-management">
        <div className="stream-header">
          <h1>Manage Streams</h1>
          <button className="add-stream-btn" onClick={() => { setShowModal(true); setEditItem(null); }}>
            Add Stream
          </button>
        </div>

        <div className="stream-search-box input">
          <input
            type="text"
            placeholder="Search streams..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Class</th><th>Created</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name || s.sname}</td>
                  <td>{s.description || s.des}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ background: '#e8f0fe', color: '#2563eb', fontWeight: 600, padding: '2px 10px', borderRadius: 8, fontSize: '0.98rem' }}>
                        {s.className || s.class_name || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td>{s.created || s.cdate}</td>
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
                <label style={{ fontWeight: 500, marginBottom: 4 }}>Class</label>
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
                <label style={{ fontWeight: 500 }}>Created Date</label>
                <input
                  type="date"
                  name="created"
                  value={form.created}
                  onChange={handleInputChange}
                  required
                />
                <button className="add-stream-btn" onClick={handleAddStream}>
                  {editItem ? 'Save' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StreamManagement;
