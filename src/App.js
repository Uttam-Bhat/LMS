import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Login/RegisterForm';
import ForgotPassword from './components/Login/ForgotPassword';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserManagement from './components/Dashboard/UserManagement';
import CourseManagement from './components/Dashboard/CourseManagement';
import ExamManagement from './components/Dashboard/ExamManagement';
import ResultsPlaceholder from './components/Dashboard/ResultsPlaceholder';
import TeachersManagement from './components/Dashboard/TeachersManagement';
import StudentsManagement from './components/Dashboard/StudentsManagement';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App; 