import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const ClassesManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ class_name: '', description: '', section: '', created: '' });
  const [classes, setClasses] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const openModal = (item) => {
    setEditItem(item);
    setForm(item ? { class_name: item.class_name, description: item.description, section: item.section, created: item.created } : { class_name: '', description: '', section: '', created: '' });
    setShowModal(true);
    setStatusMessage('');
  };

  const handleSave = async () => {
    if (!form.class_name || !form.description || !form.section || !form.created) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const payload = {
        class_name: form.class_name,
        description: form.description,
        section: form.section,
        cdate: form.created,
      };
      console.log(payload);
      const response = await axios.post('http://localhost:3000/api/admin/class', payload);
      if (response.status === 201 || response.status === 200) {
        setClasses(prev => [
          ...prev,
          { ...payload, created: form.created, id: response.data.id || Date.now() }
        ]);
        alert('Class added successfully');
        setShowModal(false);
      } else {
        alert('Failed to add class');
      }
    } catch (error) {
      if (error.response) {
        alert('Failed to add class: ' + JSON.stringify(error.response.data));
      } else {
        alert('Failed to add class. Please check console.');
      }
      console.error('Failed to add class:', error);
    }
  };
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/admin/class");
        setClasses(response.data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };
    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/class/${id}`);
      setClasses(prev => prev.filter(cls => cls.id !== id));
      setStatusMessage('Class deleted successfully.');
    } catch (error) {
      console.error('Error deleting class:', error);
      setStatusMessage('Failed to delete class.');
    }
  };

  const filtered = classes.filter(s => s.class_name && s.class_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="stream-management">
        <div className="stream-header">
          <h1>Manage Classes</h1>
          <button className="add-stream-btn" onClick={() => openModal(null)}>Add Class</button>
        </div>
        <div className="stream-filters">
          <div className="stream-search-box">
            <input type="text" placeholder="Search classes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr><th>Class Name</th><th>Description</th><th>Section</th><th>Created</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.class_name}</td>
                  <td>{s.description}</td>
                  <td>{s.section}</td>
                  <td>{s.created}</td>
                  <td>
                    <div className="stream-action-buttons">
                      <button className="stream-edit-btn" onClick={() => openModal(s)}>Edit</button>
                      <button className="stream-delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
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
                <h2>{editItem ? 'Edit Class' : 'Add Class'}</h2>
                <button className="stream-close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  name="class_name"
                  placeholder="Class Name"
                  value={form.class_name}
                  onChange={handleInputChange}
                  style={{ fontWeight: 500 }}
                  required
                />
                <input
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="section"
                  placeholder="Section (e.g. A, B, C)"
                  value={form.section}
                  onChange={handleInputChange}
                  required
                />
                <label style={{ fontWeight: 500 }}>Created Date</label>
                <input
                  type="date"
                  name="created"
                  value={form.created}
                  onChange={handleInputChange}
                  required
                />
                <button className="add-stream-btn" style={{ marginTop: '0.5rem' }} onClick={handleSave}>
                  {editItem ? 'Save Changes' : 'Add Class'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassesManagement;
