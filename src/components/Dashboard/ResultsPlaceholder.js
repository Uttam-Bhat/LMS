import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './ExamManagement.css';
import api from '../../services/authService';

const BarChartPlaceholder = ({ data, labels }) => (
  <div style={{ width: '100%', height: 220, background: '#f3f6fa', borderRadius: 12, display: 'flex', alignItems: 'flex-end', gap: 18, padding: 24, margin: '1.5rem 0' }}>
    {data.map((val, idx) => (
      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ height: `${val * 2}px`, width: 32, background: '#2563eb', borderRadius: 8, marginBottom: 8, transition: 'height 0.3s' }}></div>
        <div style={{ fontSize: 13, color: '#444', fontWeight: 600 }}>{labels[idx]}</div>
        <div style={{ fontSize: 12, color: '#888' }}>{val}%</div>
      </div>
    ))}
  </div>
);

const ResultsPlaceholder = () => {
  const [students, setStudents] = useState([]);
  const [studentResults, setStudentResults] = useState({}); // { student_id: [results] }
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState([
    { label: 'Total Exams', value: 0 },
    { label: 'Total Students', value: 0 },
    { label: 'Average Score', value: '0%' },
    { label: 'Pass Rate', value: '0%' },
  ]);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Fetch all students
        const res = await api.get('/student/student-display');
        const studentsArr = Array.isArray(res.data) ? res.data : [res.data];
        setStudents(studentsArr);
        setAdminStats(stats => stats.map(s => s.label === 'Total Students' ? { ...s, value: studentsArr.length } : s));
        // Fetch all exams for stats
        const examsRes = await api.get('/exam/display');
        const examsArr = Array.isArray(examsRes.data) ? examsRes.data : [examsRes.data];
        setAdminStats(stats => stats.map(s => s.label === 'Total Exams' ? { ...s, value: examsArr.length } : s));
        // For each student, fetch their results
        const resultsObj = {};
        let allScores = [];
        let passCount = 0;
        let totalCount = 0;
        let examScoreMap = {}; // { exam_id: [scores] }
        for (const stu of studentsArr) {
          const res2 = await api.get(`/exam-result/results/${stu.st_id}`);
          resultsObj[stu.st_id] = res2.data || [];
          res2.data.forEach(r => {
            allScores.push(r.score);
            totalCount++;
            if (r.score >= 40) passCount++;
            if (!examScoreMap[r.e_name]) examScoreMap[r.e_name] = [];
            examScoreMap[r.e_name].push(r.score);
          });
        }
        setStudentResults(resultsObj);
        // Calculate average score and pass rate
        const avgScore = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
        const passRate = totalCount ? (passCount / totalCount) * 100 : 0;
        setAdminStats(stats => stats.map(s => {
          if (s.label === 'Average Score') return { ...s, value: avgScore.toFixed(1) + '%' };
          if (s.label === 'Pass Rate') return { ...s, value: passRate.toFixed(1) + '%' };
          return s;
        }));
        // Bar chart: average score per exam
        const labels = Object.keys(examScoreMap);
        const data = labels.map(lab => {
          const arr = examScoreMap[lab];
          return arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
        });
        setChartLabels(labels);
        setChartData(data);
      } catch (err) {
        setStudents([]);
        setStudentResults({});
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <DashboardLayout>
      <div className="exam-management">
        <div className="page-header">
          <h1>Results & Reports (Admin)</h1>
        </div>
        <div className="exam-sections">
          <div className="exam-section-card">
            <div className="section-header">
              <h2>Summary</h2>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {adminStats.map(stat => (
                <div key={stat.label} className="stat-card" style={{ minWidth: 180, background: '#f3f6fa', borderRadius: 12, boxShadow: '0 2px 8px #e0e7ef' }}>
                  <div className="stat-content">
                    <h3 style={{ color: '#2563eb', fontWeight: 700 }}>{stat.label}</h3>
                    <p style={{ fontSize: 22, fontWeight: 700 }}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <BarChartPlaceholder data={chartData} labels={chartLabels} />
          </div>
          <div className="exam-section-card" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <h2>Student Results</h2>
            </div>
            <div style={{ margin: '1.5rem 0', borderRadius: 12, background: '#f8fafc', boxShadow: '0 2px 8px #e0e7ef', padding: '1.5rem 2rem' }}>
              {loading ? (
                <div>Loading...</div>
              ) : students.length === 0 ? (
                <div>No students found.</div>
              ) : students.map((student, idx) => (
                <div key={idx} style={{ marginBottom: 18, borderBottom: '1px solid #e5e7eb', paddingBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.user_info.fullname)}&background=2563eb&color=fff&size=64`} alt={student.user_info.fullname} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #2563eb' }} />
                    <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#2563eb' }}>{student.user_info.fullname}</div>
                    <button
                      style={{ marginLeft: 'auto', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.4em 1.2em', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
                      onClick={() => setExpanded(expanded === idx ? null : idx)}
                    >
                      {expanded === idx ? 'Hide Results' : 'Show Results'}
                    </button>
                  </div>
                  {expanded === idx && (
                    <div style={{ marginTop: 16 }}>
                      {studentResults[student.st_id] && studentResults[student.st_id].length > 0 ? (
                        <table className="users-table" style={{ background: '#fff', borderRadius: 8 }}>
                          <thead>
                            <tr>
                              <th>Exam</th>
                              <th>Date</th>
                              <th>Score</th>
                              <th>Correct</th>
                              <th>Wrong</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentResults[student.st_id].map((result, i) => (
                              <tr key={i}>
                                <td>{result.e_name}</td>
                                <td>{result.e_date}</td>
                                <td style={{ fontWeight: 700 }}>{result.score}%</td>
                                <td>{result.correct_answers}</td>
                                <td>{result.wrong_answers}</td>
                                <td>
                                  <span className={`status-badge ${result.score >= 40 ? 'active' : 'draft'}`}>{result.score >= 40 ? 'Passed' : 'Failed'}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ color: '#888', fontSize: 15 }}>No results found for this student.</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResultsPlaceholder; 