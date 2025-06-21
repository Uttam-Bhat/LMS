import React, { useState } from 'react';
import './CreateCourseModal.css';

const examTypes = [
  'Internal',
  'Midterm',
  'Final',
  'Quiz',
  'Other'
];

const examTemplates = [
  { id: 1, name: 'Mid-term Template' },
  { id: 2, name: 'Final Exam Template' },
  { id: 3, name: 'Quiz Template' }
];

const CreateExamModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    duration: '',
    type: '',
    numQuestions: '',
    templateId: ''
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
            <label>Time of Exam</label>
            <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2 hours" required />
          </div>
          <div className="form-group">
            <label>Exam Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
              <option value="">Select type</option>
              {examTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Number of Questions</label>
            <input type="number" min="1" value={form.numQuestions} onChange={e => setForm({ ...form, numQuestions: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Question Template</label>
            <select value={form.templateId} onChange={e => setForm({ ...form, templateId: e.target.value })} required>
              <option value="">Select template</option>
              {examTemplates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
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