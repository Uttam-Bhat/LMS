import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/authService';
import StudentLayout from './StudentLayout';

const StudentDashboard = () => {
  const [showCourse, setShowCourse] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const navigate = useNavigate();
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [enrolledCoursesCount, setEnrolledCoursesCount] = useState(0);
  const [recentContent, setRecentContent] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageScore, setAverageScore] = useState(0);
  const [completedExams, setCompletedExams] = useState(0);
  const [passedExams, setPassedExams] = useState(0);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (!email) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get current user
        const userRes = await api.get('/admin/users');
        const loggedInEmail = localStorage.getItem('user_email');
        const userList = Array.isArray(userRes.data) ? userRes.data : [userRes.data];
        const user = userList.find(u => u.email === loggedInEmail);
        if (!user) {
          setLoading(false);
          return;
        }
        // Get student info
        const studentRes = await api.get('/student/student-display');
        const studentList = Array.isArray(studentRes.data) ? studentRes.data : [studentRes.data];
        const student = studentList.find(s => s.user_info.id === user.id);
        setStudentInfo(student);
        if (!student) {
          setLoading(false);
          return;
        }
        // Get enrollments for this student
        const enrollmentsRes = await api.get('/enroll/enroll-display');
        const studentEnrollments = enrollmentsRes.data.filter(e => String(e.st_id) === String(student.st_id));
        setEnrolledCoursesCount(studentEnrollments.length);
        // Collect enrolled course IDs
        const enrolledCourseIds = studentEnrollments.map(e => String(e.course_info.cid));
        // Collect enrolled course names
        const enrolledCourseNames = studentEnrollments.map(e => e.course_info.coursename);
        console.log('ENROLLED COURSE IDs:', enrolledCourseIds);
        console.log('ENROLLED COURSE NAMES:', enrolledCourseNames);
        // --- UPCOMING EXAMS ---
        const examsRes = await api.get('/exam/display');
        const allExams = Array.isArray(examsRes.data) ? examsRes.data : [examsRes.data];
        console.log('FIRST EXAM FULL OBJECT:', JSON.stringify(allExams[0], null, 2));
        console.log('ALL EXAMS COUNT:', allExams.length);
        
        // Get student's class and stream IDs
        const studentClassId = student?.user_info?.class_info?.cls_id;
        const studentStreamId = student?.user_info?.class_info?.stream_info?.sid;
        console.log('STUDENT CLASS ID:', studentClassId);
        console.log('STUDENT STREAM ID:', studentStreamId);
        
        // Get subjects for this student's class and stream
        const subjectsRes = await api.get('/subject/subject-display');
        console.log('ALL SUBJECTS:', subjectsRes.data);
        console.log('FIRST SUBJECT:', JSON.stringify(subjectsRes.data[0], null, 2));
        const studentSubjects = subjectsRes.data.filter(subject => {
          // Use the correct nested field structure
          const subjectClassId = subject.stream_info?.class_info?.cls_id;
          const subjectStreamId = subject.stream_info?.sid;
          const isMatch = String(subjectClassId) === String(studentClassId) && 
                         String(subjectStreamId) === String(studentStreamId);
          console.log('SUBJECT:', subject.su_name, 'CLASS ID:', subjectClassId, 'STREAM ID:', subjectStreamId, 'MATCH:', isMatch);
          return isMatch;
        });
        console.log('STUDENT SUBJECTS:', studentSubjects);
        const studentSubjectIds = studentSubjects.map(subject => String(subject.su_id));
        console.log('STUDENT SUBJECT IDs:', studentSubjectIds);
        
        // Filter exams by subject ID
        const filteredExams = allExams.filter(exam => {
          const examSubjectId = String(exam.su_id);
          const isMatch = studentSubjectIds.includes(examSubjectId);
          console.log('EXAM:', exam.e_name, 'SUBJECT ID:', examSubjectId, 'MATCH:', isMatch);
          return isMatch;
        });
        console.log('FILTERED EXAMS COUNT:', filteredExams.length);
        setUpcomingExams(filteredExams);
        // --- RECENT CONTENT (MATERIALS) ---
        const contentRes = await api.get('/content/display');
        const allMaterials = contentRes.data.content || contentRes.data || [];
        console.log('FIRST MATERIAL:', allMaterials[0]);
        // Collect student subject names
        const studentSubjectNames = studentSubjects.map(subject => subject.su_name);
        console.log('STUDENT SUBJECT NAMES:', studentSubjectNames);
        allMaterials.forEach(item => {
          if (item.su_name) {
            console.log('SUBJECT MATERIAL:', item.title, '| su_name:', item.su_name);
          }
        });
        const normalize = str => (str || '').toLowerCase().trim();
        const relevantMaterials = allMaterials.filter(item => {
          const courseMatch = item.coursename && enrolledCourseNames.some(name => normalize(name) === normalize(item.coursename));
          const subjectMatch = item.su_name && studentSubjectNames.some(name => normalize(name) === normalize(item.su_name));
          return courseMatch || subjectMatch;
        });
        // Show latest 3
        const latestMaterials = relevantMaterials
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
          .slice(0, 3);
        // Find most recent course and subject material
        let recentCourse = null;
        let recentSubject = null;
        relevantMaterials.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        for (const item of relevantMaterials) {
          if (!recentCourse && item.coursename) recentCourse = item;
          if (!recentSubject && item.su_name) recentSubject = item;
          if (recentCourse && recentSubject) break;
        }
        setRecentContent([recentCourse, recentSubject].filter(Boolean));
        // --- STUDENT EXAM RESULTS ---
        const examResultsRes = await api.get(`/exam-result/results/${student.st_id}`);
        const examResults = Array.isArray(examResultsRes.data) ? examResultsRes.data : [examResultsRes.data];
        setCompletedExams(examResults.length);
        const passed = examResults.filter(r => r.score >= 40);
        setPassedExams(passed.length);
        const avg = examResults.length ? (examResults.reduce((a, b) => a + b.score, 0) / examResults.length) : 0;
        setAverageScore(avg);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div style={{padding: '2.5rem 2rem', background: '#f6f8fb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{fontSize: '1.2rem', color: '#6b7280'}}>Loading dashboard...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div style={{padding: '2.5rem 2rem', background: '#f6f8fb', minHeight: '100vh'}}>
        <h1 style={{fontSize: '2rem', fontWeight: 700, color: '#377dff', marginBottom: 0}}>
          Welcome back, {studentInfo?.user_info?.fullname || 'Student'}!
        </h1>
        <p style={{color: '#5b6b7a', fontSize: '1.1rem', marginBottom: '2.2rem'}}>
          Here's what's happening with your learning journey
        </p>
        <div style={{display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap'}}>
          <div style={{background: '#eef5ff', borderRadius: '16px', padding: '1.2rem 2.2rem', minWidth: 180, flex: 1}}>
            <div style={{color: '#377dff', fontWeight: 600, marginBottom: 4}}>Enrolled Courses</div>
            <div style={{fontSize: '2rem', fontWeight: 700}}>{enrolledCoursesCount}</div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}><span style={{marginLeft: 4}}><i className="fas fa-book-open"></i></span></div>
          </div>
          <div style={{background: '#eafff3', borderRadius: '16px', padding: '1.2rem 2.2rem', minWidth: 180, flex: 1}}>
            <div style={{color: '#1dbf73', fontWeight: 600, marginBottom: 4}}>Average Score</div>
            <div style={{fontSize: '2rem', fontWeight: 700}}>{averageScore.toFixed(0)}%</div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}><span style={{marginLeft: 4}}><i className="fas fa-signal"></i></span></div>
          </div>
          <div style={{background: '#f7f3ff', borderRadius: '16px', padding: '1.2rem 2.2rem', minWidth: 180, flex: 1}}>
            <div style={{color: '#a259ff', fontWeight: 600, marginBottom: 4}}>Completed Exams</div>
            <div style={{fontSize: '2rem', fontWeight: 700}}>{completedExams}</div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}><span style={{marginLeft: 4}}><i className="fas fa-clipboard-list"></i></span></div>
          </div>
          <div style={{background: '#fff8e1', borderRadius: '16px', padding: '1.2rem 2.2rem', minWidth: 180, flex: 1}}>
            <div style={{color: '#ffb300', fontWeight: 600, marginBottom: 4}}>Passed Exams</div>
            <div style={{fontSize: '2rem', fontWeight: 700}}>{passedExams}</div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 6}}><span style={{marginLeft: 4}}><i className="fas fa-check-circle"></i></span></div>
          </div>
        </div>
        <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {/* Recent Content Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(30,34,90,0.07)',
            padding: '2.5rem 2vw',
            marginBottom: '1.5rem',
            width: '100%',
            maxWidth: '100%',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#2563eb', marginBottom: 6 }}>Recent Content</div>
            <div style={{ color: '#6b7a90', fontSize: '1.05rem', marginBottom: 16 }}>Latest learning materials for your courses</div>
            {recentContent.length === 0 ? (
              <div>
                <div style={{ fontWeight: 600, color: '#222', fontSize: '1.08rem', marginBottom: 6 }}>No content available</div>
                <div style={{ color: '#6b7a90', fontSize: '1rem' }}>Check back later for new content.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%', flexWrap: 'wrap' }}>
                {recentContent.map((item, idx) => (
                  <div key={item.ct_id} style={{
                    background: idx === 0 ? '#eaf1ff' : '#f7f3ff',
                    borderRadius: 10,
                    boxShadow: '0 1px 4px rgba(30,34,90,0.04)',
                    padding: '1.1rem 1.3rem',
                    minWidth: 180,
                    maxWidth: 240,
                    flex: '1 1 180px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    border: idx === 0 ? '2px solid #2563eb' : '2px solid #a259ff',
                    position: 'relative',
                    marginBottom: 8,
                  }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '1.01rem',
                      color: idx === 0 ? '#2563eb' : '#a259ff',
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      {idx === 0 ? 'Course' : 'Subject'}
                    </div>
                    <div style={{ fontWeight: 600, color: '#222', fontSize: '1.01rem', marginBottom: 2, minHeight: 22 }}>
                      {item.title}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.93rem', marginBottom: 2 }}>
                      {item.coursename ? `Course: ${item.coursename}` : `Subject: ${item.su_name}`}
                    </div>
                    <div style={{ color: '#374151', fontSize: '0.91rem', marginBottom: 4, minHeight: 18 }}>
                      {item.des}
                    </div>
                    <div>
                      {item.file_path ? (
                        <a
                          href={`http://localhost:3000/${item.file_path.replace('\\', '/').replace('\\', '/')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: idx === 0 ? '#2563eb' : '#a259ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: '4px 12px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            fontSize: '0.97rem',
                            boxShadow: '0 2px 8px #2563eb22',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            marginTop: 4
                          }}
                        >
                          <FaEye style={{ marginRight: 5 }} /> View
                        </a>
                      ) : (
                        <span style={{ color: '#aaa' }}>No file</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Upcoming Exams Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(30,34,90,0.07)',
            padding: '2.5rem 2vw',
            marginBottom: '1.5rem',
            width: '100%',
            maxWidth: '100%',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxSizing: 'border-box',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#059669', marginBottom: 6 }}>Upcoming Exams</div>
            <div style={{ color: '#6b7280', fontSize: '1.05rem', marginBottom: 18 }}>Your next scheduled examinations</div>
            {upcomingExams.length === 0 ? (
              <div style={{ color: '#6b7280', fontSize: '1rem', marginTop: 12 }}>No upcoming exams. Check back later for scheduled exams.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
                {upcomingExams.map((exam) => (
                  <div key={exam.e_id} style={{
                    background: '#f8fafc',
                    borderRadius: 10,
                    boxShadow: '0 1px 4px rgba(30,34,90,0.04)',
                    padding: '1.5rem 2vw',
                    width: '100%',
                    maxWidth: '100%',
                    minHeight: 120,
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    boxSizing: 'border-box',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>{exam.e_name}</div>
                      <div style={{ color: '#374151', fontSize: '1.01rem', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <i className="far fa-calendar-alt" style={{ marginRight: 4 }}></i> {exam.e_date}
                        <i className="far fa-clock" style={{ margin: '0 4px' }}></i> {exam.e_time}
                        <span style={{ marginLeft: 14 }}><i className="fas fa-hourglass-half" style={{ marginRight: 4 }}></i> {exam.duration} Minutes</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.99rem', marginTop: 6 }}>Template: {exam.t_name}</div>
                    </div>
                    <span style={{
                      background: '#d1fae5',
                      color: '#059669',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                      padding: '4px 18px',
                      marginLeft: 18,
                    }}>Upcoming</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;