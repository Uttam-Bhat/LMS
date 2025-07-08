import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPencilAlt, FaTrashAlt, FaUserCircle, FaUserGraduate } from 'react-icons/fa';
import './UserManagement.css';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/student/student-display');
        setStudents(response.data || []);
      } catch (err) {
        setError('Failed to load students');
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    // Implement edit logic/modal here
    alert('Edit student: ' + student.user_info.fullname);
  };

  const handleDelete = (student) => {
    // Implement delete logic/modal here
    alert('Delete student: ' + student.user_info.fullname);
  };

  return (
    <div className="user-management">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <FaUserGraduate size={38} color="#377dff" style={{ flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 700, color: '#377dff', margin: 0 }}>Assigned Students</h1>
            <div style={{ color: '#5b6b7a', fontSize: '1.08rem', marginTop: 2 }}>View, edit, and manage assigned students</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* <button className="add-user-btn" style={{ fontWeight: 600, fontSize: 17, padding: '0.7rem 1.7rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaUserPlus style={{ fontSize: 18 }} /> Add Student
          </button> */}
          <div style={{ background: '#f8fafd', borderRadius: 16, padding: '0.7rem 1.5rem', boxShadow: '0 2px 8px rgba(30,34,90,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#377dff', fontWeight: 700, fontSize: 22 }}>{students.length}</span>
            <span style={{ color: '#5b6b7a', fontSize: 14 }}>Total Students</span>
          </div>
        </div>
      </div>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Stream</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="5">{error}</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="5">No assigned students found.</td></tr>
            ) : students.map(student => (
              <tr key={student.st_id}>
                <td>
                  <div className="user-info">
                    <FaUserCircle />
                    <span>{student.user_info.fullname}</span>
                  </div>
                </td>
                <td>{student.user_info.email}</td>
                <td>{student.user_info.class_info.class_name}</td>
                <td>{student.user_info.class_info.stream_info.sname}</td>
                <td style={{ textAlign: 'center' }}>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      title="Edit student"
                      aria-label="Edit student"
                      onClick={() => handleEdit(student)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete student"
                      aria-label="Delete student"
                      onClick={() => handleDelete(student)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsManagement; 