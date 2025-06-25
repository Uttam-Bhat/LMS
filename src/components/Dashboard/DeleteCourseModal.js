import React from 'react';
import { FaTimes, FaExclamationTriangle, FaTrashAlt } from 'react-icons/fa';
import './CreateCourseModal.css';

const DeleteCourseModal = ({ onClose, course, onDelete }) => {
  const handleDelete = () => {
    console.log('Deleting course:', course);
    onDelete && onDelete(course.id);
    onClose();
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
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <FaExclamationTriangle style={{ color: '#856404', fontSize: '1.2rem' }} />
            <span style={{ color: '#856404', fontWeight: '500' }}>
              Warning: This action cannot be undone!
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1a1a1a', marginBottom: '0.5rem' }}>
              Are you sure you want to delete this course?
            </h3>
            <p style={{ color: '#666', fontSize: '1rem' }}>
              Course: <strong>{course?.name || 'Unknown Course'}</strong>
            </p>
          </div>

          <div style={{
            background: '#f8f9fa',
            border: '1px solid #e1e1e1',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>This will permanently delete:</h4>
            <ul style={{ color: '#666', margin: 0, paddingLeft: '1.5rem' }}>
              <li>All course content and materials</li>
              <li>Student enrollment records</li>
              <li>Course progress and completion data</li>
              <li>All associated assignments and quizzes</li>
              <li>Course analytics and reports</li>
            </ul>
          </div>

          <div style={{
            background: '#e7f0fe',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: '#1877f2', margin: 0, fontSize: '0.9rem' }}>
              <strong>Note:</strong> Students currently enrolled in this course will be automatically unenrolled.
              Consider archiving the course instead if you want to preserve the data.
            </p>
          </div>
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
            Delete Course Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal; 