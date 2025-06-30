import axios from 'axios';
import { useEffect, useState } from 'react';
import './CreateCourseModal.css';

const emptyQuestion = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correct: ''
};

const CreateTemplateModal = ({ onClose, template, refreshTemplates }) => {
  const [form, setForm] = useState({
    name: template?.t_name || '',
    subject: template?.su_name || '',
    questions: template?.questions?.length
      ? template.questions.map(q => ({
          text: q.question || q.text || '',
          optionA: q.op_a || q.optionA || '',
          optionB: q.op_b || q.optionB || '',
          optionC: q.op_c || q.optionC || '',
          optionD: q.op_d || q.optionD || '',
          correct: q.ans || q.correct || ''
        }))
      : [{ ...emptyQuestion }]
  });

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/subject/display');
        setSubjects(response.data);
        console.log("Fetched subjects:", response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      if (template && template.t_id) {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:3000/api/question/by-template/${template.t_id}`);
          const questions = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.questions)
              ? res.data.questions
              : [];
          setForm({
            name: template.t_name || '',
            subject: template.su_name || '',
            questions: questions.map(q => ({
              text: q.question || q.text || '',
              optionA: q.op_a || q.optionA || '',
              optionB: q.op_b || q.optionB || '',
              optionC: q.op_c || q.optionC || '',
              optionD: q.op_d || q.optionD || '',
              correct: q.ans || q.correct || ''
            }))
          });
        } catch (error) {
          console.error('Error fetching template details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    if (template && template.t_id) {
      fetchTemplateDetails();
    }
  }, [template]);

  const handleQuestionChange = (idx, field, value) => {
    const updated = form.questions.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q
    );
    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, { ...emptyQuestion }] });
  };

  const removeQuestion = (idx) => {
    setForm({
      ...form,
      questions: form.questions.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.subject.trim()) {
      alert('Template name and subject are required.');
      return;
    }

    for (let q of form.questions) {
      if (!q.text || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correct) {
        alert('All fields in each question are required.');
        return;
      }
    }

    const payload = {
      t_name: form.name,
      su_name: form.subject,
      questions: form.questions.map(q => ({
        question: q.text,
        op_a: q.optionA,
        op_b: q.optionB,
        op_c: q.optionC,
        op_d: q.optionD,
        ans: q.correct
      }))
    };

    try {
      if (template && template.t_id) {
        await axios.put(`http://localhost:3000/api/question/edit/${template.t_id}`, payload);
        alert('Template updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/question/add', payload);
        alert('Template created successfully!');
      }
      if (refreshTemplates) await refreshTemplates();
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template.');
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
              <option value="">Select Subject</option>
              {subjects.map(sub => (
                <option key={sub.su_id} value={sub.su_name}>
                  {sub.su_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Questions</label>
            {form.questions.map((q, idx) => (
              <div key={idx} style={{
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
