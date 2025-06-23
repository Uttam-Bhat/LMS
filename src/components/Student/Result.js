import React from 'react';

const Result = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="create-course-modal">
      <div className="modal-header">
        <h2>Result</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div style={{ padding: '1rem 0' }}>
        <p>This is a placeholder for the Result modal.</p>
      </div>
    </div>
  </div>
);

export default Result;
