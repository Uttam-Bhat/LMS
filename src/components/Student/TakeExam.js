import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/authService';
import StudentLayout from './StudentLayout';
import toast from 'react-hot-toast';

function getSelectedOptionKey(selectedValue, question) {
  if (selectedValue === question.op_a) return "A";
  if (selectedValue === question.op_b) return "B";
  if (selectedValue === question.op_c) return "C";
  if (selectedValue === question.op_d) return "D";
  return null;
}

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0); // seconds
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef();
  const isMobile = window.innerWidth <= 900;

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
    if (loading || timer <= 0 || result) return;
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
  }, [loading, timer, result]);

  const handleOptionChange = (qid, opt) => {
    setAnswers(prev => ({ ...prev, [qid]: opt }));
  };

  const handleSubmit = async (navigateOnError = false) => {
    try {
      const student_id = localStorage.getItem('student_id');
      if (!student_id) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
        return;
      }
      // Send the selected option TEXT for each question
      const answersArr = Object.entries(answers).map(([qid, selected]) => ({
        q_id: Number(qid),
        selected // this is the option text, not the key
      }));
      const res = await api.post('/exam-result/submit', {
        student_id,
        exam_id: examId,
        answers: answersArr
      });
      setResult(res.data);
      toast.success('Exam submitted!');
    } catch (err) {
      if (navigateOnError) {
        navigate('/student/exam');
      } else {
        toast.error('Failed to submit exam.');
      }
    }
  };

  const handleEndTest = () => {
    setShowConfirm(true);
  };

  const handleConfirmEnd = () => {
    setShowConfirm(false);
    handleSubmit(true); // navigate on error
  };

  const handleCancelEnd = () => {
    setShowConfirm(false);
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
      <div className="dashboard-main-content" style={{ 
        position: 'relative', 
        minHeight: '80vh', 
        padding: 0, 
        margin: 0,
        ...(isMobile && {
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        })
      }}>
        {/* Timer and End Test button at top right of main content */}
        {!result && (
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'row' : 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: isMobile ? '90%' : '100%', 
            marginBottom: '1rem', 
            padding: isMobile ? '0.25rem 0.5rem' : '0.5rem 1rem', 
            background: '#fff', 
            borderRadius: 8, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
            border: '1px solid #e5e7eb',
            margin: isMobile ? '0 auto 1rem auto' : '0 0 1rem 0'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4 
            }}>
              <div style={{ 
                fontSize: isMobile ? 12 : 20, 
                color: '#dc2626' 
              }}>⏰</div>
              <div style={{ 
                background: '#dc2626', 
                color: '#fff', 
                fontSize: isMobile ? '0.75rem' : '1.1rem', 
                fontWeight: 700, 
                padding: isMobile ? '0.15rem 0.3rem' : '0.4rem 0.8rem', 
                borderRadius: 3, 
                boxShadow: '0 1px 4px rgba(220,38,38,0.3)' 
              }}>
                {formatTime(timer)}
              </div>
            </div>
            <button 
              onClick={handleEndTest} 
              style={{ 
                background: '#dc2626', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 3, 
                padding: isMobile ? '0.25rem 0.5rem' : '0.5rem 1rem', 
                fontSize: isMobile ? '0.65rem' : '1rem', 
                fontWeight: 600, 
                cursor: 'pointer', 
                boxShadow: '0 1px 4px rgba(220,38,38,0.3)', 
                transition: 'background 0.2s' 
              }}
            >
              End Test
            </button>
          </div>
        )}
        {showConfirm && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              boxShadow: '0 2px 16px #e0e7ef', 
              padding: isMobile ? '1.5rem 2rem' : '2rem 2.5rem', 
              minWidth: isMobile ? 280 : 320, 
              maxWidth: isMobile ? '90vw' : 420,
              textAlign: 'center' 
            }}>
              <div style={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.25rem', marginBottom: 18 }}>Are you sure you want to end the test?</div>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12, flexDirection: isMobile ? 'column' : 'row' }}>
                <button onClick={handleConfirmEnd} style={{ 
                  background: '#2563eb', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: isMobile ? '0.6em 1.5em' : '0.7em 2.2em', 
                  fontWeight: 600, 
                  fontSize: isMobile ? '0.9rem' : '1.08rem', 
                  cursor: 'pointer' 
                }}>Yes, End Test</button>
                <button onClick={handleCancelEnd} style={{ 
                  background: '#e5e7eb', 
                  color: '#222', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: isMobile ? '0.6em 1.5em' : '0.7em 2.2em', 
                  fontWeight: 600, 
                  fontSize: isMobile ? '0.9rem' : '1.08rem', 
                  cursor: 'pointer' 
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div style={{ 
          maxWidth: isMobile ? '95vw' : 700, 
          margin: isMobile ? '0 auto' : '0 auto', 
          padding: isMobile ? '0' : '2.5rem 0 0 0',
          width: isMobile ? '95vw' : 'auto',
          boxSizing: 'border-box'
        }}>
          {result && (
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              boxShadow: '0 2px 16px #e0e7ef', 
              padding: isMobile ? '1rem 0.8rem' : '2.5rem 3rem', 
              textAlign: 'center', 
              marginBottom: 32, 
              marginTop: isMobile ? 60 : 16 
            }}>
              <div style={{ fontSize: isMobile ? 24 : 38, marginBottom: 10 }}>✨🎉 Congratulations! 🎉✨</div>
              <div style={{ fontWeight: 700, fontSize: isMobile ? '1.2rem' : '2rem', color: '#2563eb', marginBottom: 8 }}>Your Score: {result.score ? result.score.toFixed(2) : 0}%</div>
              <div style={{ color: '#16a34a', fontSize: isMobile ? '0.9rem' : '1.15rem', marginBottom: 4 }}>Correct: {result.correct}</div>
              <div style={{ color: '#e11d48', fontSize: isMobile ? '0.9rem' : '1.15rem', marginBottom: 4 }}>Wrong: {result.wrong}</div>
              <div style={{ color: '#6b7280', fontSize: isMobile ? '0.8rem' : '1.08rem', marginBottom: 4 }}>Attempted: {result.attempted}</div>
              <div style={{ color: '#6b7280', fontSize: isMobile ? '0.8rem' : '1.08rem', marginBottom: 4 }}>Total Questions: {result.total || result.correct + result.wrong}</div>
              <button onClick={() => navigate('/student/exam')} style={{ 
                marginTop: 24, 
                background: '#2563eb', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: isMobile ? '0.6em 1.5em' : '0.9em 2.5em', 
                fontWeight: 700, 
                fontSize: isMobile ? '0.9rem' : '1.13rem', 
                cursor: 'pointer', 
                boxShadow: '0 1px 4px rgba(30,34,90,0.10)', 
                transition: 'background 0.18s, color 0.18s' 
              }}>Back to Exams</button>
            </div>
          )}
          {!result && (
            <div style={{ 
              background: '#fff', 
              borderRadius: 14, 
              boxShadow: '0 2px 12px #2563eb18', 
              padding: isMobile ? '1rem 0.8rem' : '2.2rem 2.5rem', 
              marginBottom: 24,
              marginTop: isMobile ? 0 : 0
            }}>
              <div style={{ fontWeight: 700, fontSize: isMobile ? '1.1rem' : '1.5rem', color: '#2563eb', marginBottom: 6 }}>{exam.e_name}</div>
              <div style={{ color: '#6b7280', fontSize: isMobile ? '0.8rem' : '1.08rem', marginBottom: 4 }}>Subject: {exam.su_name || 'N/A'}</div>
              <div style={{ color: '#6b7280', fontSize: isMobile ? '0.8rem' : '1.08rem', marginBottom: 4 }}>Time: {exam.e_time || 'N/A'}</div>
              <div style={{ color: '#6b7280', fontSize: isMobile ? '0.8rem' : '1.08rem', marginBottom: 4 }}>Duration: {exam.duration} min</div>
              <div style={{ color: '#6b7280', fontSize: isMobile ? '0.8rem' : '1.08rem', marginBottom: 4 }}>Description: {exam.des}</div>
            </div>
          )}
          {!result && (
            <div style={{ 
              background: '#fff', 
              borderRadius: 14, 
              boxShadow: '0 2px 12px #2563eb18', 
              padding: isMobile ? '1rem 0.8rem' : '2.2rem 2.5rem', 
              marginBottom: 24 
            }}>
              <div style={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.2rem', color: '#2563eb', marginBottom: 18 }}>Question Paper</div>
              {Array.isArray(questions) && questions.length > 0 ? (
                questions.map((q, idx) => (
                  <div key={q.q_id || q.id} style={{ marginBottom: isMobile ? 16 : 28 }}>
                    <div style={{ 
                      fontWeight: 600, 
                      color: '#222', 
                      fontSize: isMobile ? '0.9rem' : '1.08rem', 
                      marginBottom: 8,
                      lineHeight: isMobile ? '1.3' : '1.5'
                    }}>{idx + 1}. {q.question}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 4 : 8 }}>
                      {['op_a', 'op_b', 'op_c', 'op_d'].map(optKey => (
                        <label key={optKey} style={{ 
                          fontSize: isMobile ? '0.85rem' : '1.05rem', 
                          color: '#374151', 
                          background: '#f6f8fb', 
                          borderRadius: 6, 
                          padding: isMobile ? '8px 10px' : '7px 14px', 
                          cursor: 'pointer', 
                          border: answers[q.q_id || q.id] === q[optKey] ? '2px solid #2563eb' : '1px solid #e5e7eb', 
                          fontWeight: answers[q.q_id || q.id] === q[optKey] ? 700 : 400,
                          lineHeight: isMobile ? '1.2' : '1.4'
                        }}>
                          <input 
                            type="radio" 
                            name={`q_${q.q_id || q.id}`} 
                            value={q[optKey]} 
                            checked={answers[q.q_id || q.id] === q[optKey]} 
                            onChange={() => handleOptionChange(q.q_id || q.id, q[optKey])} 
                            style={{ marginRight: 8 }} 
                          />
                          {q[optKey]}
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#d32f2f', fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1.1rem' }}>No questions found for this exam.</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                <button onClick={handleSubmit} style={{ 
                  background: '#2563eb', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 8, 
                  padding: isMobile ? '0.6em 1.5em' : '0.9em 2.5em', 
                  fontWeight: 700, 
                  fontSize: isMobile ? '0.9rem' : '1.13rem', 
                  cursor: 'pointer', 
                  boxShadow: '0 1px 4px rgba(30,34,90,0.10)', 
                  transition: 'background 0.18s, color 0.18s' 
                }}>Submit</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default TakeExam; 