import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/authService';
import StudentLayout from './StudentLayout';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0); // seconds
  const [answers, setAnswers] = useState({});
  const timerRef = useRef();

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        // Fetch exam details
        const examRes = await api.get(`/exam/${examId}`);
        setExam(examRes.data);
        // Fetch questions for this exam (dynamic)
        const qRes = await api.get(`/exam/${examId}/questions`);
        setQuestions(qRes.data);
        // Set timer (duration in minutes to seconds)
        const duration = examRes.data.duration ? parseInt(examRes.data.duration) : 30;
        setTimer(duration * 60);
      } catch (err) {
        setExam(null);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
    // eslint-disable-next-line
  }, [examId]);

  // Timer logic
  useEffect(() => {
    if (loading || timer <= 0) return;
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [loading, timer]);

  const handleOptionChange = (qid, opt) => {
    setAnswers(prev => ({ ...prev, [qid]: opt }));
  };

  const handleSubmit = () => {
    // Submit answers to API here
    alert('Exam submitted!');
    navigate('/student/exam');
  };

  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <StudentLayout><div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#2563eb' }}>Loading exam...</div></StudentLayout>;
  }
  if (!exam) {
    return <StudentLayout><div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#d32f2f' }}>Exam not found.</div></StudentLayout>;
  }

  return (
    <StudentLayout>
      <div className="dashboard-main-content" style={{ position: 'relative', minHeight: '80vh', padding: 0, margin: 0 }}>
        {/* Timer at top right of main content */}
        <div style={{ position: 'absolute', top: 18, right: 32, background: '#fff', color: '#2563eb', fontWeight: 700, fontSize: 22, borderRadius: 8, boxShadow: '0 2px 8px #2563eb22', padding: '0.7rem 2.2rem', zIndex: 10 }}>
          ⏰ {formatTime(timer)}
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 0 0 0' }}>
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #2563eb18', padding: '2.2rem 2.5rem', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: '1.5rem', color: '#2563eb', marginBottom: 6 }}>{exam.e_name}</div>
            <div style={{ color: '#6b7280', fontSize: '1.08rem', marginBottom: 4 }}>Subject: {exam.su_name || 'N/A'}</div>
            <div style={{ color: '#6b7280', fontSize: '1.08rem', marginBottom: 4 }}>Time: {exam.e_time || 'N/A'}</div>
            <div style={{ color: '#6b7280', fontSize: '1.08rem', marginBottom: 4 }}>Duration: {exam.duration} min</div>
            <div style={{ color: '#6b7280', fontSize: '1.08rem', marginBottom: 4 }}>Description: {exam.des}</div>
          </div>
          {/* Questions */}
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #2563eb18', padding: '2.2rem 2.5rem', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2563eb', marginBottom: 18 }}>Question Paper</div>
            {Array.isArray(questions) && questions.length > 0 ? (
              questions.map((q, idx) => (
                <div key={q.q_id || q.id} style={{ marginBottom: 28 }}>
                  <div style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', marginBottom: 8 }}>{idx + 1}. {q.question}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['op_a', 'op_b', 'op_c', 'op_d'].map(optKey => (
                      <label key={optKey} style={{ fontSize: '1.05rem', color: '#374151', background: '#f6f8fb', borderRadius: 6, padding: '7px 14px', cursor: 'pointer', border: answers[q.q_id || q.id] === q[optKey] ? '2px solid #2563eb' : '1px solid #e5e7eb', fontWeight: answers[q.q_id || q.id] === q[optKey] ? 700 : 400 }}>
                        <input type="radio" name={`q_${q.q_id || q.id}`} value={q[optKey]} checked={answers[q.q_id || q.id] === q[optKey]} onChange={() => handleOptionChange(q.q_id || q.id, q[optKey])} style={{ marginRight: 10 }} />
                        {q[optKey]}
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#d32f2f', fontWeight: 600, fontSize: '1.1rem' }}>No questions found for this exam.</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
              <button onClick={handleSubmit} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9em 2.5em', fontWeight: 700, fontSize: '1.13rem', cursor: 'pointer', boxShadow: '0 1px 4px rgba(30,34,90,0.10)', transition: 'background 0.18s, color 0.18s' }}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default TakeExam; 