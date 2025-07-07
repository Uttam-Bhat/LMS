import axios from 'axios';
import { useEffect, useState } from 'react';
import './CreateCourseModal.css';
import toast from 'react-hot-toast';

const emptyQuestion = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correct: ''
};

const CreateTemplateModal = ({ onClose, template, refreshTemplates }) => {
  console.log('CreateTemplateModal received template:', template);
  const isQuestion = template && template.q_id && !template.t_id;
  const initialForm = isQuestion
    ? {
        name: template.t_name || '',
        subject: template.su_name || '',
        questions: [{
          text: template.question || '',
          optionA: template.op_a || '',
          optionB: template.op_b || '',
          optionC: template.op_c || '',
          optionD: template.op_d || '',
          correct: template.ans || ''
        }]
      }
    : {
        name: template?.t_name || '',
        subject: template?.su_name || '',
        questions: template?.questions?.length
          ? template.questions.map(q => ({
              q_id: q.q_id,
              text: q.question || q.text || '',
              optionA: q.op_a || q.optionA || '',
              optionB: q.op_b || q.optionB || '',
              optionC: q.op_c || q.optionC || '',
              optionD: q.op_d || q.optionD || '',
              correct: q.ans || q.correct || ''
            }))
          : [{ ...emptyQuestion }]
      };

  const [form, setForm] = useState(initialForm);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all subjects
    axios.get('http://localhost:3000/api/subject/subject-display').then(res => setSubjects(res.data));
  }, []);

  // When editing, set subject based on template
  useEffect(() => {
    if (template && template.su_name && subjects.length > 0) {
      setForm(prev => ({ ...prev, subject: template.su_name }));
    }
  }, [template, subjects]);

  const handleQuestionChange = (idx, field, value) => {
    const updated = form.questions.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q
    );
    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, { ...emptyQuestion }] });
  };

  const removeQuestion = async (idx) => {
    const question = form.questions[idx];
    if ((question.q_id || question.id) && template && template.t_id) {
      try {
        await axios.delete(`http://localhost:3000/api/question/delete/${question.q_id || question.id}`);
        setForm({
          ...form,
          questions: form.questions.filter((_, i) => i !== idx)
        });
        toast.success('Question deleted successfully!');
      } catch (error) {
        console.error('Error deleting question:', error);
        toast.error('Failed to delete question.');
      }
    } else {
      setForm({
        ...form,
        questions: form.questions.filter((_, i) => i !== idx)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.subject.trim()) {
      toast('Template name and subject are required.');
      return;
    }

    for (let q of form.questions) {
      if (!q.text || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correct) {
        toast('All fields in each question are required.');
        return;
      }
    }

    const payload = {
      t_name: form.name,
      su_name: form.subject,
      questions: form.questions.map(q => ({
        q_id: q.q_id,
        question: q.text,
        op_a: q.optionA,
        op_b: q.optionB,
        op_c: q.optionC,
        op_d: q.optionD,
        ans: q.correct
      }))
    };

    console.log('Submitting payload:', payload);

    try {
      if (template && template.t_id) {
        await axios.put(`http://localhost:3000/api/question/edit-by-template/${template.t_id}`, payload);
        toast.success('Template updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/question/add', payload);
        toast.success('Template created successfully!');
      }
      if (refreshTemplates) await refreshTemplates();
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-course-modal" style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <h2>{template ? 'Edit Exam Template' : 'Create Exam Template'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Template Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Subject</label>
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              required
            >
              <option value="">Select</option>
              {subjects.map(subject => (
                <option key={subject.su_id} value={subject.su_name}>{subject.su_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Questions</label>
            {form.questions.map((q, idx) => (
              <div key={q.q_id ? `q-${q.q_id}-${idx}` : `new-${idx}`}
                style={{
                  border: '1px solid #e1e1e1',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16
                }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <strong>Question {idx + 1}</strong>
                  {form.questions.length > 1 && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => removeQuestion(idx)}
                      style={{ marginLeft: 8 }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Question text"
                    value={q.text}
                    onChange={e => handleQuestionChange(idx, 'text', e.target.value)}
                    required
                  />
                </div>
                <div className="input-form">
                  <input
                    type="text"
                    className='input-option'
                    placeholder="Option A"
                    value={q.optionA}
                    onChange={e => handleQuestionChange(idx, 'optionA', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className='input-option'
                    placeholder="Option B"
                    value={q.optionB}
                    onChange={e => handleQuestionChange(idx, 'optionB', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className='input-option'
                    placeholder="Option C"
                    value={q.optionC}
                    onChange={e => handleQuestionChange(idx, 'optionC', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className='input-option'
                    placeholder="Option D"
                    value={q.optionD}
                    onChange={e => handleQuestionChange(idx, 'optionD', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Correct Answer</label>
                  <select
                    value={q.correct}
                    onChange={e => handleQuestionChange(idx, 'correct', e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="create-btn"
              onClick={addQuestion}
              style={{ marginTop: 8 }}
            >
              + Add Question
            </button>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              {template ? 'Save Template' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
