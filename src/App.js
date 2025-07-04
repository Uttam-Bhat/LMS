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
import UserManagement from './components/Dashboard/UserManagement';
import ForgotPassword from './components/Login/ForgotPassword';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Login/RegisterForm';
import AvailableCourses from './components/Student/AvailableCourses';
import MyCourses from './components/Student/MyCourses';
import RegisterExam from './components/Student/RegisterExam';
import StudentDashboard from './components/Student/StudentDashboard';
import Notification from './components/Student/Notification';
import StudentProfile from './components/Student/StudentProfile';
import StudentSettings from './components/Student/StudentSettings';
import AdminProfile from './components/Dashboard/AdminProfile';
import AdminSettings from './components/Dashboard/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/teachers" element={<ProtectedRoute><TeachersManagement /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute><StudentsManagement /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
          <Route path="/admin/exams" element={<ProtectedRoute><ExamManagement /></ProtectedRoute>} />
          <Route path="/admin/results" element={<ProtectedRoute><ResultsPlaceholder /></ProtectedRoute>} />
          <Route path="/admin/stream" element={<ProtectedRoute><StreamManagement /></ProtectedRoute>} />
          <Route path="/admin/subjects" element={<ProtectedRoute><SubjectsManagement /></ProtectedRoute>} />
          <Route path="/admin/chapters" element={<ProtectedRoute><ChaptersManagement /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
          <Route path="/admin/classes" element={<ProtectedRoute><ClassesManagement /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/exam" element={<ProtectedRoute><RegisterExam /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="/student/result" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/Logout" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/available-courses" element={<ProtectedRoute><AvailableCourses /></ProtectedRoute>} />
          <Route path="/student/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/settings" element={<ProtectedRoute><StudentSettings /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 