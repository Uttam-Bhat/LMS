import React from 'react';
import './CreateCourseModal.css';

const ViewReportsModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="create-course-modal">
      <div className="modal-header">
        <h2>View Reports</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div style={{ padding: '1rem 0' }}>
        <p>This is a placeholder for the reports dialog. Show analytics and reports here.</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="cancel-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

export default ViewReportsModal; 