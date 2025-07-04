import React, { useState } from 'react';
import axios from 'axios';
import './CreateCourseModal.css';
import toast from 'react-hot-toast';

const examTypes = [
  'Internal',
  'Midterm',
  'Final',
  'Quiz',
  'Other'
];

const CreateExamModal = ({ onClose, templates, exam, refreshExams }) => {
  const [form, setForm] = useState({
    e_name: exam?.e_name || '',
    e_date: exam?.e_date || '',
    e_time: exam?.e_time || '',
    duration: exam?.duration || '',
    t_name: exam?.t_name || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.e_name || !form.e_date || !form.e_time || !form.duration || !form.t_name) {
      toast('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      if (exam && exam.e_id) {
        await axios.put(`http://localhost:3000/api/exam/edit/${exam.e_id}`, form);
        toast.success('Exam updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/exam/add', form);
        toast.success('Exam created successfully!');
      }
      if (refreshExams) await refreshExams();
      onClose();
    } catch (error) {
      console.error('Error saving exam:', error);
      toast.error('Failed to save exam.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-course-modal">
        <div className="modal-header">
          <h2>{exam ? 'Edit Exam' : 'Create New Exam'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Exam Name</label>
            <input type="text" value={form.e_name} onChange={e => setForm({ ...form, e_name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.e_date} onChange={e => setForm({ ...form, e_date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Time of Exam</label>
            <input type="time" value={form.e_time} onChange={e => setForm({ ...form, e_time: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2 hours" required />
          </div>
          <div className="form-group">
            <label>Question Template</label>
            <select value={form.t_name} onChange={e => setForm({ ...form, t_name: e.target.value })} required>
              <option value="">Select template</option>
              {templates.map(t => (
                <option key={t.t_id} value={t.t_name}>{t.t_name}</option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="create-btn" disabled={loading}>{loading ? (exam ? 'Saving...' : 'Creating...') : (exam ? 'Save Exam' : 'Create Exam')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal; 