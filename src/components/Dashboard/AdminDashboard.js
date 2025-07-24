import api from '../../services/authService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCourseModal from './CreateCourseModal';
import CreateExamModal from './CreateExamModal';
import CreateUserModal from './CreateUserModal';
import DashboardLayout from './DashboardLayout';
import ViewReportsModal from './ViewReportsModal';
import { MultiPieChart } from './ResultsPlaceholder';

import './Dashboard.css';

const AdminDashboard = () => {
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showViewReportsModal, setShowViewReportsModal] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [resultsProcessed, setResultsProcessed] = useState(0);
  const [resultsChartData, setResultsChartData] = useState([]);
  const [resultsChartLabels, setResultsChartLabels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await api.get('/admin/users');
        setTotalUsers(response.data.length); // assuming it returns array of users
      } catch (error) {
        console.error('Failed to fetch total users:', error);
      }
    };

    fetchUserCount();
    const fetchCourseCount = async () => {
      try {
        const response = await api.get('/course/display');
        setTotalCourses(response.data.length); // assuming response.data is an array of courses
      } catch (error) {
        console.error('Failed to fetch total courses:', error);
      }
    };
    fetchCourseCount();
    const fetchExamCount = async () => {
      try {
        const response = await api.get('/exam/display');
        setTotalExams(Array.isArray(response.data) ? response.data.length : 0);
      } catch (error) {
        console.error('Failed to fetch total exams:', error);
      }
    };
    fetchExamCount();
    // Fetch templates for CreateExamModal
    const fetchTemplates = async () => {
      try {
        const templatesRes = await api.get('/question/display');
        setTemplates(Array.isArray(templatesRes.data) ? templatesRes.data : []);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };
    fetchTemplates();
    // Fetch processed results count and chart data
    const fetchResultsProcessed = async () => {
      try {
        // Fetch all students
        const studentsRes = await api.get('/student/student-display');
        const studentsArr = Array.isArray(studentsRes.data) ? studentsRes.data : [studentsRes.data];
        let totalResults = 0;
        let examResultCount = {};
        for (const stu of studentsArr) {
          const res2 = await api.get(`/exam-result/results/${stu.st_id}`);
          const results = res2.data || [];
          totalResults += results.length;
          results.forEach(r => {
            if (!examResultCount[r.e_name]) examResultCount[r.e_name] = 0;
            examResultCount[r.e_name]++;
          });
        }
        setResultsProcessed(totalResults);
        // Pie chart: distribution of results per exam
        const labels = Object.keys(examResultCount);
        const data = labels.map(lab => examResultCount[lab]);
        setResultsChartLabels(labels);
        setResultsChartData(data);
      } catch (err) {
        setResultsProcessed(0);
        setResultsChartLabels([]);
        setResultsChartData([]);
      }
    };
    fetchResultsProcessed();
  }, []);

  const handleExamCreated = () => {
    setShowCreateExamModal(false);
    // Refresh exam count after creating an exam
    api.get('/exam/display')
      .then(res => setTotalExams(Array.isArray(res.data) ? res.data.length : 0));
  };

  return (
    <DashboardLayout>
      <div className="dashboard-welcome">
        <h1>Welcome to LAMS Admin Dashboard</h1>
        <p>Manage your learning assessment system from here</p>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-book"></i>
            <div className="stat-content">
              <h3>Active Courses</h3>
              <p>{totalCourses}</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-file-alt"></i>
            <div className="stat-content">
              <h3>Exams Created</h3>
              <p>{totalExams}</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-chart-line"></i>
            <div className="stat-content">
              <h3>Results Processed</h3>
              <p>{resultsProcessed}</p>
            </div>
          </div>
        </div>

        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <div className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <h3>Create Course</h3>
              <p>Add a new course to the system</p>
              <button 
                className="quick-action-btn"
                onClick={() => setShowCreateCourseModal(true)}
              >
                Create Now
              </button>
            </div>
            <div className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>Add User</h3>
              <p>Register a new user account</p>
              <button 
                className="quick-action-btn"
                onClick={() => setShowCreateUserModal(true)}
              >
                Add User
              </button>
            </div>
            <div className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-file-medical"></i>
              </div>
              <h3>Create Exam</h3>
              <p>Create a new examination</p>
              <button 
                className="quick-action-btn"
                onClick={() => setShowCreateExamModal(true)}
              >
                Create Exam
              </button>
            </div>
            <div className="quick-action-card">
              <div className="quick-action-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3>View Reports</h3>
              <p>Access detailed analytics</p>
              <button 
                className="quick-action-btn"
                onClick={() => setShowViewReportsModal(true)}
              >
                View Reports
              </button>
            </div>
          </div>
        </div>

        {showCreateCourseModal && (
          <CreateCourseModal onClose={() => setShowCreateCourseModal(false)} />
        )}
        {showCreateUserModal && (
          <CreateUserModal onClose={() => setShowCreateUserModal(false)} />
        )}
        {showCreateExamModal && (
          <CreateExamModal 
            onClose={handleExamCreated}
            templates={templates}
          />
        )}
        {showViewReportsModal && (
          <ViewReportsModal 
            onClose={() => setShowViewReportsModal(false)}
            chartData={resultsChartData}
            chartLabels={resultsChartLabels}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 