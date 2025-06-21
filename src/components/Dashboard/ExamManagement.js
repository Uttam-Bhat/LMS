import React, { useState } from 'react';
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

const ExamManagement = () => {
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  // Sample data - replace with actual data from your backend
  const [templates, setTemplates] = useState([
    { id: 1, title: 'Mid-term Template', subject: 'Computer Science', questions: 30, status: 'active', questionList: [] },
    { id: 2, title: 'Final Exam Template', subject: 'Mathematics', questions: 50, status: 'draft', questionList: [] },
  ]);

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

  const handleCreateTemplate = () => {
    setEditTemplate(null);
    setShowTemplateModal(true);
  };
  const handleEditTemplate = (template) => {
    setEditTemplate(template);
    setShowTemplateModal(true);
  };

  return (
    <DashboardLayout>
      <div className="exam-management">
        <div className="page-header">
          <h1>Exam Management</h1>
          <button className="create-exam-btn" onClick={() => setShowCreateExamModal(true)}>
            <FaPlus />
            Create New Exam
          </button>
        </div>
        {showCreateExamModal && (
          <CreateExamModal onClose={() => setShowCreateExamModal(false)} />
        )}
        {showTemplateModal && (
          <CreateTemplateModal 
            onClose={() => setShowTemplateModal(false)} 
            template={editTemplate}
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
                    <button className="action-btn delete" title="Delete template">
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
              <button title="Add Schedule">
                <FaClock />
              </button>
            </div>
            <div className="schedule-list">
              {schedules.map(schedule => (
                <div key={schedule.id} className="schedule-item">
                  <div className="item-info">
                    <span className="item-title">{schedule.title}</span>
                    <span className="item-details">
                      {schedule.date} • {schedule.time} • {schedule.duration}
                    </span>
                  </div>
                  <div className="item-actions">
                    <button className="action-btn edit" title="Edit schedule">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" title="Delete schedule">
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamManagement; 