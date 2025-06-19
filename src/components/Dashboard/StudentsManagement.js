import React, { useState } from 'react';
import './UserManagement.css';
import { FaUserPlus, FaSearch, FaUserCircle, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';

const StudentsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [students, setStudents] = useState([
    { id: 1, name: 'Mike Johnson', class: '10A', exam: 'Math Final', score: '92%', course: 'Mathematics' },
    { id: 2, name: 'Sarah Williams', class: '9B', exam: 'Physics Midterm', score: '85%', course: 'Physics' },
  ]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.exam.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (student) => {
    if (editStudent) {
      setStudents(students.map(s => s.id === editStudent.id ? { ...student, id: editStudent.id } : s));
    } else {
      setStudents([...students, { ...student, id: Date.now() }]);
    }
    setShowModal(false);
    setEditStudent(null);
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="user-management">
        <div className="page-header">
          <h1>Students Management</h1>
          <button 
            className="add-user-btn"
            onClick={() => { setShowModal(true); setEditStudent(null); }}
          >
            <FaUserPlus />
            Add New Student
          </button>
        </div>
        <div className="dashboard-stats" style={{marginBottom: '2rem'}}>
          <div className="stat-card">
            <i className="fas fa-user-graduate"></i>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p>{students.length}</p>
            </div>
          </div>
        </div>
        <div className="user-filters">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="user-info">
                      <FaUserCircle />
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td>{student.class}</td>
                  <td>{student.exam}</td>
                  <td>{student.score}</td>
                  <td>{student.course}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" title="Edit student" onClick={() => handleEdit(student)}>
                        <FaPencilAlt />
                      </button>
                      <button className="delete-btn" title="Delete student" onClick={() => handleDelete(student.id)}>
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
          <StudentModal
            onClose={() => { setShowModal(false); setEditStudent(null); }}
            onSave={handleSave}
            student={editStudent}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

function StudentModal({ onClose, onSave, student }) {
  const [form, setForm] = useState({
    name: student?.name || '',
    class: student?.class || '',
    exam: student?.exam || '',
    score: student?.score || '',
    course: student?.course || '',
  });
  return (
    <div className="modal-overlay">
      <div className="create-user-modal">
        <div className="modal-header">
          <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Class</label>
            <input type="text" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Exam</label>
            <input type="text" value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Score</label>
            <input type="text" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Course (Currently Doing)</label>
            <input type="text" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required />
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="add-btn">{student ? 'Save' : 'Add Student'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentsManagement; 