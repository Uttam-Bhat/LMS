import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const ClassesManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', section: '' });
  const classes = [
    { id: 1, name: 'I PUC', description: 'First Year Pre-University', section: 'A', created: '6/5/2025' },
    { id: 2, name: 'II PUC', description: 'Second Year Pre-University', section: 'B', created: '6/5/2025' },
  ];
  const filtered = classes.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const openModal = (item) => {
    setEditItem(item);
    setForm(item ? { name: item.name, description: item.description, section: item.section } : { name: '', description: '', section: '' });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save logic here (API or state update)
    setShowModal(false);
  };

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
        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Section</th><th>Created</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.description}</td>
                  <td>{s.section}</td>
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
                <h2>{editItem ? 'Edit Class' : 'Add Class'}</h2>
                <button className="stream-close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  name="name"
                  placeholder="Class Name"
                  value={form.name}
                  onChange={handleInputChange}
                  style={{ fontWeight: 500 }}
                />
                <input
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleInputChange}
                />
                <input
                  name="section"
                  placeholder="Section (e.g. A, B, C)"
                  value={form.section}
                  onChange={handleInputChange}
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