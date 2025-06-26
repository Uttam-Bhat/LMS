import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ChaptersManagement from './components/Dashboard/ChaptersManagement';
import ClassesManagement from './components/Dashboard/ClassesManagement';
import ContentManagement from './components/Dashboard/ContentManagement';
import CourseManagement from './components/Dashboard/CourseManagement';
import ExamManagement from './components/Dashboard/ExamManagement';
import ResultsPlaceholder from './components/Dashboard/ResultsPlaceholder';
import StreamManagement from './components/Dashboard/StreamManagement';
import StudentsManagement from './components/Dashboard/StudentsManagement';
import SubjectsManagement from './components/Dashboard/SubjectsManagement';
import TeachersManagement from './components/Dashboard/TeachersManagement';
import TopicsManagement from './components/Dashboard/TopicsManagement';
import UserManagement from './components/Dashboard/UserManagement';
import ForgotPassword from './components/Login/ForgotPassword';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Login/RegisterForm';
import AvailableCourses from './components/Student/AvailableCourses';
import MyCourses from './components/Student/MyCourses';
import RegisterExam from './components/Student/RegisterExam';
import StudentDashboard from './components/Student/StudentDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/teachers" element={<TeachersManagement />} />
          <Route path="/admin/students" element={<StudentsManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/exams" element={<ExamManagement />} />
          <Route path="/admin/results" element={<ResultsPlaceholder />} />
          <Route path="/admin/stream" element={<StreamManagement />} />
          <Route path="/admin/subjects" element={<SubjectsManagement />} />
          <Route path="/admin/chapters" element={<ChaptersManagement />} />
          <Route path="/admin/topics" element={<TopicsManagement />} />
          <Route path="/admin/content" element={<ContentManagement />} />
          <Route path="/admin/classes" element={<ClassesManagement />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/exam" element={<RegisterExam />} />
          <Route path="/student/notifications" element={<StudentDashboard />} />
          <Route path="/student/result" element={<StudentDashboard />} />
          <Route path="/student/Logout" element={<StudentDashboard />} />
          <Route path="/student/available-courses" element={<AvailableCourses />} />
          <Route path="/student/my-courses" element={<MyCourses />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App; 