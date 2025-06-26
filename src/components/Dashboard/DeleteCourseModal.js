import React from 'react';
import { FaTimes, FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';
import './CreateCourseModal.css';
import axios from 'axios';

const DeleteCourseModal = ({ onClose, course, onDelete }) => {
  const handleDelete = async () => {
    if (!course.courseId) {
      alert('Error: Course ID is missing. Cannot delete this course.');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/course/delete/${course.courseId}`);
      alert('Course deleted successfully!');
      onDelete && onDelete(course.courseId);
      onClose();
    } catch (error) {
      alert('Failed to delete course.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-course-modal" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>Delete Course</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
          <FaExclamationTriangle style={{ color: '#f21818', fontSize: '2rem', marginBottom: '1rem' }} />
          <h3 style={{ color: '#1a1a1a', marginBottom: '0.5rem' }}>
            Are you sure you want to delete this course?
          </h3>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Course: <strong>{course?.coursename || 'Unknown Course'}</strong>
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            style={{
              background: '#f21818',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#d41414'}
            onMouseOut={(e) => e.target.style.background = '#f21818'}
          >
            <FaTrashAlt />
            Delete Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal; 