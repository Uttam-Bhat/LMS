import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const TopicsManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const topics = [
    { id: 1, name: 'Algebra', description: 'Algebra Topic', created: '6/5/2025' },
    { id: 2, name: 'Mechanics', description: 'Mechanics Topic', created: '6/5/2025' },
  ];
  const filtered = topics.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <DashboardLayout>
      <div className="stream-management">
        <div className="stream-header">
          <h1>Manage Topics</h1>
          <button className="add-stream-btn" onClick={() => { setShowModal(true); setEditItem(null); }}>Add Topic</button>
        </div>
        <div className="stream-filters">
          <div className="stream-search-box">
            <input type="text" placeholder="Search topics..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="stream-table-container">
          <table className="stream-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Created</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.description}</td>
                  <td>{s.created}</td>
                  <td>
                    <div className="stream-action-buttons">
                      <button className="stream-edit-btn" onClick={() => { setEditItem(s); setShowModal(true); }}>Edit</button>
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
                <h2>{editItem ? 'Edit Topic' : 'Add Topic'}</h2>
                <button className="stream-close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
                <input placeholder="Name" defaultValue={editItem?.name || ''} />
                <input placeholder="Description" defaultValue={editItem?.description || ''} />
                <button className="add-stream-btn" onClick={() => setShowModal(false)}>{editItem ? 'Save' : 'Add'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default TopicsManagement; 