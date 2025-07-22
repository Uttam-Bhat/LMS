import React, { useState, useEffect } from 'react';
import api from '../../services/authService';
import './CreateCourseModal.css';
import toast from 'react-hot-toast';

const examTypes = [
  'Internal',
  'Midterm',
  'Final',
  'Quiz',
  'Other'
];

// Add helper functions for formatting
function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  const [yyyy, mm, dd] = dateStr.split('-');
  return `${dd}-${mm}-${yyyy}`;
}

function formatTimeTo12Hour(timeStr) {
  if (!timeStr) return '';
  let [hour, minute] = timeStr.split(':');
  let ampm = 'AM';
  hour = parseInt(hour, 10);
  if (hour >= 12) {
    ampm = 'PM';
    if (hour > 12) hour -= 12;
  }
  if (hour === 0) hour = 12;
  return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
}

function formatDateForInput(dateStr) {
  // Converts yyyy-mm-dd or dd-mm-yyyy to yyyy-mm-dd for input type="date"
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts[0].length === 4) return dateStr; // already yyyy-mm-dd
    if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return dateStr;
}

function formatTimeForInput(timeStr) {
  // Converts HH:MM:SS or HH:MM AM/PM to HH:MM for input type="time"
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    let [time, ampm] = timeStr.split(' ');
    let [hour, minute] = time.split(':');
    hour = parseInt(hour, 10);
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  }
  if (timeStr.split(':').length === 3) {
    // HH:MM:SS
    return timeStr.slice(0, 5);
  }
  return timeStr;
}

const CreateExamModal = ({ onClose, templates, exam, refreshExams }) => {
  const [form, setForm] = useState({
    e_name: exam?.e_name || '',
    e_date: formatDateForInput(exam?.e_date) || '',
    e_time: formatTimeForInput(exam?.e_time) || '',
    duration: exam?.duration || '',
    template_id: exam?.template_id ? String(exam.template_id) : ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      e_name: exam?.e_name || '',
      e_date: formatDateForInput(exam?.e_date) || '',
      e_time: formatTimeForInput(exam?.e_time) || '',
      duration: exam?.duration || '',
      template_id: exam?.template_id ? String(exam.template_id) : ''
    });
  }, [exam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.e_name || !form.e_date || !form.e_time || !form.duration || !form.template_id) {
      toast('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        e_date: formatDateToDDMMYYYY(form.e_date),
        e_time: formatTimeTo12Hour(form.e_time),
      };
      if (exam && exam.e_id) {
        await api.put(`/exam/edit/${exam.e_id}`, payload);
        toast.success('Exam updated successfully!');
      } else {
        await api.post('/exam/add', payload);
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
            <label>Duration (minutes)</label>
            <input type="number" min="1" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 120" required />
          </div>
          <div className="form-group">
            <label>Question Template</label>
            <select value={form.template_id} onChange={e => setForm({ ...form, template_id: e.target.value })} required>
              <option value="">Select template</option>
              {templates.map(t => (
                <option key={t.t_id} value={t.t_id}>{t.t_name}</option>
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