import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaUserPlus } from 'react-icons/fa';
import './CreateCourseModal.css';

const AddUserToCourseModal = ({ onClose, course, onUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([
    { id: 1, name: 'Mike Johnson', email: 'mike@example.com', class: '10A' },
    { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', class: '9B' },
    { id: 3, name: 'David Brown', email: 'david@example.com', class: '11A' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', class: '10B' },
    { id: 5, name: 'James Wilson', email: 'james@example.com', class: '12A' },
  ]);

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentSelect = (student) => {
    if (selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter(s => s.id !== studentId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding students to course:', selectedStudents);
    onUpdate && onUpdate(selectedStudents);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="create-course-modal" style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-header">
          <h2>Add Students to Course</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '1rem 0' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1877f2' }}>
            Course: {course?.name || 'Unknown Course'}
          </h3>
          
          <div className="form-group">
            <label>Search Students</label>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#666' 
              }} />
              <input
                type="text"
                placeholder="Search by name, email, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            {/* Available Students */}
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Available Students</h4>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto', 
                border: '1px solid #e1e1e1', 
                borderRadius: '8px',
                padding: '0.5rem'
              }}>
                {filteredStudents.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
                    No students found
                  </p>
                ) : (
                  filteredStudents.map(student => (
                    <div
                      key={student.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e1e1e1',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: selectedStudents.find(s => s.id === student.id) ? '#e7f0fe' : 'white',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => handleStudentSelect(student)}
                    >
                      <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {student.email} • {student.class}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Students */}
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>
                Selected Students ({selectedStudents.length})
              </h4>
              <div style={{ 
                maxHeight: '300px', 
                overflowY: 'auto', 
                border: '1px solid #e1e1e1', 
                borderRadius: '8px',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa'
              }}>
                {selectedStudents.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
                    No students selected
                  </p>
                ) : (
                  selectedStudents.map(student => (
                    <div
                      key={student.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e1e1e1',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        backgroundColor: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                          {student.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          {student.email} • {student.class}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(student.id)}
                        style={{
                          background: '#fee7e7',
                          color: '#f21818',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.25rem 0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="create-btn"
            onClick={handleSubmit}
            disabled={selectedStudents.length === 0}
            style={{ 
              opacity: selectedStudents.length === 0 ? 0.6 : 1,
              cursor: selectedStudents.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <FaUserPlus style={{ marginRight: '0.5rem' }} />
            Add {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserToCourseModal; 