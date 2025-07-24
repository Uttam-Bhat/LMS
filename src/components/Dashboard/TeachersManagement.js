import React, { useState } from 'react';
import './UserManagement.css';
import { FaUserPlus, FaSearch, FaUserCircle, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';

const TeachersManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'John Doe', courses: 'Mathematics, Physics', classes: '10A, 11B' },
    { id: 2, name: 'Jane Smith', courses: 'Chemistry', classes: '9B, 12A' },
  ]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.courses.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.classes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (teacher) => {
    if (editTeacher) {
      setTeachers(teachers.map(t => t.id === editTeacher.id ? { ...teacher, id: editTeacher.id } : t));
    } else {
      setTeachers([...teachers, { ...teacher, id: Date.now() }]);
    }
    setShowModal(false);
    setEditTeacher(null);
  };

  const handleEdit = (teacher) => {
    setEditTeacher(teacher);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="user-management">
        <div className="page-header">
          <h1>Teachers Management</h1>
          <button 
            className="add-user-btn"
            onClick={() => { setShowModal(true); setEditTeacher(null); }}
          >
            <FaUserPlus />
            Add New Teacher
          </button>
        </div>
        <div className="dashboard-stats" style={{marginBottom: '2rem'}}>
          <div className="stat-card">
            <i className="fas fa-chalkboard-teacher"></i>
            <div className="stat-content">
              <h3>Total Teachers</h3>
              <p>{teachers.length}</p>
            </div>
          </div>
        </div>
        <div className="user-filters">
          <div className="search-box" style={{ position: 'relative', width: 300 }}>
            <span className="search-icon" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 18 }}><FaSearch /></span>
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #e1e1e1',
                borderRadius: 8,
                fontSize: '0.95rem',
              }}
            />
          </div>
        </div>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Courses Assigned</th>
                <th>Classes Teaching</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td>
                    <div className="user-info">
                      <FaUserCircle />
                      <span>{teacher.name}</span>
                    </div>
                  </td>
                  <td>{teacher.courses}</td>
                  <td>{teacher.classes}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" title="Edit teacher" onClick={() => handleEdit(teacher)}>
                        <FaPencilAlt />
                      </button>
                      <button className="delete-btn" title="Delete teacher" onClick={() => handleDelete(teacher.id)}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && (
          <TeacherModal
            onClose={() => { setShowModal(false); setEditTeacher(null); }}
            onSave={handleSave}
            teacher={editTeacher}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

function TeacherModal({ onClose, onSave, teacher }) {
  const [form, setForm] = useState({
    name: teacher?.name || '',
    courses: teacher?.courses || '',
    classes: teacher?.classes || '',
  });
  return (
    <div className="modal-overlay">
      <div className="create-user-modal">
        <div className="modal-header">
          <h2>{teacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Courses Assigned</label>
            <input type="text" value={form.courses} onChange={e => setForm({ ...form, courses: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Classes Teaching</label>
            <input type="text" value={form.classes} onChange={e => setForm({ ...form, classes: e.target.value })} required />
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="add-btn">{teacher ? 'Save' : 'Add Teacher'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeachersManagement; 