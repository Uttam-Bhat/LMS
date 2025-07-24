import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './ExamManagement.css';
import api from '../../services/authService';

export const BarChartPlaceholder = ({ data, labels }) => (
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

const PIE_COLORS = [
  '#2563eb', // blue
  '#ef6c00', // orange
  '#2e7d32', // green
  '#8e24aa', // purple
  '#d32f2f', // red
  '#1976d2', // deep blue
  '#c2185b', // pink
  '#388e3c', // dark green
  '#fbc02d', // yellow
  '#5d4037', // brown
];

export const MultiPieChart = ({ data = [], labels = [] }) => {
  // data: array of values (average scores)
  // labels: array of exam names
  const total = data.reduce((a, b) => a + b, 0) || 1;
  const radius = 100;
  const center = radius + 10;
  const stroke = 0;
  let cumulative = 0;
  // Helper to get coordinates for a slice
  const getCoordinates = (percent) => {
    const angle = 2 * Math.PI * percent;
    return {
      x: center + radius * Math.cos(angle - Math.PI / 2),
      y: center + radius * Math.sin(angle - Math.PI / 2),
    };
  };
  // Helper to get label position
  const getLabelCoordinates = (start, end) => {
    const angle = 2 * Math.PI * (start + (end - start) / 2);
    return {
      x: center + (radius * 0.6) * Math.cos(angle - Math.PI / 2),
      y: center + (radius * 0.6) * Math.sin(angle - Math.PI / 2),
    };
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 24 }}>
      <svg width={center * 2} height={center * 2}>
        {data.map((value, idx) => {
          const percent = value / total;
          const start = cumulative;
          const end = cumulative + percent;
          const largeArc = percent > 0.5 ? 1 : 0;
          const startCoord = getCoordinates(start);
          const endCoord = getCoordinates(end);
          const pathData = [
            `M ${center} ${center}`,
            `L ${startCoord.x} ${startCoord.y}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${endCoord.x} ${endCoord.y}`,
            'Z',
          ].join(' ');
          const labelCoord = getLabelCoordinates(start, end);
          cumulative += percent;
          return (
            <g key={labels[idx] || idx}>
              <path d={pathData} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke="#fff" strokeWidth={stroke} />
              {percent > 0.04 && (
                <text
                  x={labelCoord.x}
                  y={labelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="1.1em"
                  fontWeight="bold"
                  fill="#222"
                >
                  {Math.round(percent * 100)}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 18, justifyContent: 'center' }}>
        {labels.map((label, idx) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 18, background: PIE_COLORS[idx % PIE_COLORS.length], display: 'inline-block', borderRadius: 4 }}></span>
            <span style={{ color: '#222', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const [studentSearch, setStudentSearch] = useState("");

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
        let examResultCount = {}; // { exam_id: count }
        for (const stu of studentsArr) {
          const res2 = await api.get(`/exam-result/results/${stu.st_id}`);
          resultsObj[stu.st_id] = res2.data || [];
          res2.data.forEach(r => {
            allScores.push(r.score);
            totalCount++;
            if (r.score >= 40) passCount++;
            if (!examResultCount[r.e_name]) examResultCount[r.e_name] = 0;
            examResultCount[r.e_name]++;
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
        // Pie chart: distribution of results per exam
        const labels = Object.keys(examResultCount);
        const data = labels.map(lab => examResultCount[lab]);
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

  // Filter students by search
  const filteredStudents = students.filter(student => {
    const q = studentSearch.toLowerCase();
    return (
      student.user_info.fullname.toLowerCase().includes(q) ||
      student.user_info.email.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="exam-management" style={{ padding: '2rem 0 1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 36, color: '#2563eb' }}><i className="fas fa-chart-bar"></i></span>
          <div>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Results & Reports</h1>
            <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>View analytics and student exam results</div>
          </div>
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
            {chartData.length > 0 && chartLabels.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
                <MultiPieChart data={chartData} labels={chartLabels} />
              </div>
            )}
          </div>
          <div className="exam-section-card" style={{ marginTop: '2rem' }}>
            <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
              <h2>Student Results</h2>
              <div style={{ position: 'relative', width: 180, flexShrink: 0 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 16 }}><i className="fas fa-search"></i></span>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.9rem 0.6rem 2.1rem',
                    border: '1px solid #e1e1e1',
                    borderRadius: 8,
                    fontSize: '0.95rem',
                  }}
                />
              </div>
            </div>
            <div style={{ margin: '1.5rem 0', borderRadius: 12, background: '#f8fafc', boxShadow: '0 2px 8px #e0e7ef', padding: '1.5rem 2rem' }}>
              {loading ? (
                <div>Loading...</div>
              ) : students.length === 0 ? (
                <div>No students found.</div>
              ) : filteredStudents.map((student, idx) => (
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
                    <div style={{ marginTop: 16, overflowX: 'auto', width: '100%' }}>
                      {studentResults[student.st_id] && studentResults[student.st_id].length > 0 ? (
                        <table className="users-table" style={{ background: '#fff', borderRadius: 8, minWidth: 600, width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
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