import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import './ExamManagement.css';
import { 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaUpload, 
  FaFileAlt,
  FaQuestionCircle,
  FaClock
} from 'react-icons/fa';
import CreateExamModal from './CreateExamModal';
import CreateTemplateModal from './CreateTemplateModal';
import axios from 'axios';

const ExamManagement = () => {
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [exams, setExams] = useState([]);
  const [editExam, setEditExam] = useState(null);

  const questionSets = [
    { id: 1, title: 'Programming Basics', count: 100, type: 'Multiple Choice' },
    { id: 2, title: 'Data Structures', count: 75, type: 'Mixed' },
  ];

  const schedules = [
    { 
      id: 1, 
      title: 'Mid-term Examination', 
      date: '2024-04-15', 
      time: '09:00 AM',
      duration: '2 hours',
      status: 'upcoming'
    },
    { 
      id: 2, 
      title: 'Final Examination', 
      date: '2024-05-20', 
      time: '10:00 AM',
      duration: '3 hours',
      status: 'draft'
    },
  ];

  const fileInputRef = React.useRef();

  useEffect(() => {
    refreshTemplates();
    refreshExams();
  }, []);

  const refreshTemplates = async () => {
    try {
      const templatesRes = await axios.get('http://localhost:3000/api/template/list');
      const templatesData = Array.isArray(templatesRes.data) ? templatesRes.data : [];
      // Fetch questions for each template
      const fetchedTemplates = await Promise.all(
        templatesData.map(async (template) => {
          const res = await axios.get(`http://localhost:3000/api/question/by-template/${template.t_id}`);
          const questions = Array.isArray(res.data) ? res.data : [];
          return {
            ...template,
            id: template.t_id,
            title: template.t_name,
            subject: template.su_name,
            questions: questions.length,
            questionList: questions
          };
        })
      );
      setTemplates(fetchedTemplates.filter(Boolean));
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const refreshExams = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/exam/display');
      setExams(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleCreateTemplate = () => {
    setEditTemplate(null);
    setShowTemplateModal(true);
  };
  const handleEditTemplate = (template) => {
    setEditTemplate(template);
    setShowTemplateModal(true);
  };
  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/question/delete/${templateId}`);
      await refreshTemplates();
      alert('Template deleted successfully!');
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template.');
    }
  };

  const handleCreateExam = () => {
    setEditExam(null);
    setShowCreateExamModal(true);
  };
  const handleEditExam = (exam) => {
    setEditExam(exam);
    setShowCreateExamModal(true);
  };
  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/exam/delete/${examId}`);
      await refreshExams();
      alert('Exam deleted successfully!');
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete exam.');
    }
  };

  return (
    <DashboardLayout>
      <div className="exam-management">
        <div className="page-header">
          <h1>Exam Management</h1>
          <button className="create-exam-btn" onClick={handleCreateExam}>
            <FaPlus />
            Create New Exam
          </button>
        </div>
        {showCreateExamModal && (
          <CreateExamModal 
            onClose={() => { setShowCreateExamModal(false); setEditExam(null); refreshExams(); }}
            templates={templates}
            exam={editExam}
            refreshExams={refreshExams}
          />
        )}
        {showTemplateModal && (
          <CreateTemplateModal 
            onClose={() => setShowTemplateModal(false)} 
            template={editTemplate}
            refreshTemplates={refreshTemplates}
          />
        )}
        <div className="exam-sections">
          {/* Exam Templates Section */}
          <div className="exam-section-card">
            <div className="section-header">
              <h2>Exam Templates</h2>
              <button title="Create Template" onClick={handleCreateTemplate}>
                <FaPlus />
              </button>
            </div>
            <div className="template-list">
              {templates.map(template => (
                <div key={template.id} className="template-item">
                  <div className="item-info">
                    <span className="item-title">{template.title}</span>
                    <span className="item-details">
                      {template.subject} • {template.questions} questions
                    </span>
                  </div>
                  <div className="item-actions">
                    <button className="action-btn edit" title="Edit template" onClick={() => handleEditTemplate(template)}>
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" title="Delete template" onClick={() => handleDeleteTemplate(template.id)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Bank Section */}
          <div className="exam-section-card">
            <div className="section-header">
              <h2>Question Bank</h2>
              <button title="Upload Questions" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                <FaUpload />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={e => {
                  // You can handle the file upload here
                  // For now, just log the file name
                  if (e.target.files && e.target.files[0]) {
                    alert('Selected file: ' + e.target.files[0].name);
                  }
                }}
              />
            </div>
            <div className="question-bank">
              <div className="upload-area">
                <FaFileAlt className="upload-icon" />
                <p className="upload-text">
                  Drag and drop question files here or click to browse
                </p>
              </div>
              {questionSets.map(set => (
                <div key={set.id} className="question-set">
                  <div className="item-info">
                    <span className="item-title">{set.title}</span>
                    <span className="item-details">
                      {set.count} questions • {set.type}
                    </span>
                  </div>
                  <div className="item-actions">
                    <button className="action-btn edit" title="Edit questions">
                      <FaQuestionCircle />
                    </button>
                    <button className="action-btn delete" title="Delete set">
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Schedules Section */}
          <div className="exam-section-card">
            <div className="section-header">
              <h2>Exam Schedules</h2>
              <button title="Add Schedule" onClick={handleCreateExam}>
                <FaClock />
              </button>
            </div>
            <div className="schedule-list">
              {exams.length === 0 ? (
                <div className="no-exams">No exams found.</div>
              ) : (
                exams.map(exam => (
                  <div key={exam.e_id} className="schedule-item">
                    <div className="item-info">
                      <span className="item-title">{exam.e_name}</span>
                      <span className="item-details">
                        {exam.e_date} • {exam.e_time} • {exam.duration} • Template: {exam.t_name}
                      </span>
                    </div>
                    <div className="item-actions">
                      <button className="action-btn edit" title="Edit exam" onClick={() => handleEditExam(exam)}>
                        <FaEdit />
                      </button>
                      <button className="action-btn delete" title="Delete exam" onClick={() => handleDeleteExam(exam.e_id)}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamManagement; 