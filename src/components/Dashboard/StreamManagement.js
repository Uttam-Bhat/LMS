import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const StreamManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const streams = [
    { id: 1, name: 'Science', description: 'Science Stream', created: '6/5/2025' },
    { id: 2, name: 'Commerce', description: 'Commerce Stream', created: '6/5/2025' },
  ];
  const filtered = streams.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
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
                <h2>{editItem ? 'Edit Stream' : 'Add Stream'}</h2>
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
export default StreamManagement; 