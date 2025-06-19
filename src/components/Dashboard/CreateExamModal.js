import React, { useState } from 'react';
import './CreateCourseModal.css';

const CreateExamModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name: '',
    date: '',
    duration: ''
  });
  return (
    <div className="modal-overlay">
      <div className="create-course-modal">
        <div className="modal-header">
          <h2>Create New Exam</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onClose(); }}>
          <div className="form-group">
            <label>Exam Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required />
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="create-btn">Create Exam</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal; 