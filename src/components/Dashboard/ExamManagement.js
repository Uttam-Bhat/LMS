import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FaClock,
  FaEdit,
  FaFileAlt,
  FaPlus,
  FaTrashAlt,
  FaUpload
} from 'react-icons/fa';
import CreateExamModal from './CreateExamModal';
import CreateTemplateModal from './CreateTemplateModal';
import DashboardLayout from './DashboardLayout';
import './ExamManagement.css';

const ExamManagement = () => {
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const fileInputRef = React.useRef();

useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/template/display');
      const templatesData = response.data;
      // Fetch question count for each template
      const templatesWithCounts = await Promise.all(
        templatesData.map(async (template) => {
          try {
            const res = await axios.get(`http://localhost:3000/api/question/by-template/${template.t_id}`);
            // Robustly extract questions array from API response
            const questions = Array.isArray(res.data)
              ? res.data
              : Array.isArray(res.data.questions)
                ? res.data.questions
                : [];
            return { ...template, questions };
          } catch (err) {
            console.error(`Failed to fetch questions for template ${template.t_id}`, err);
            return { ...template, questions: [] };
          }
        })
      );
      setTemplates(templatesWithCounts);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  fetchTemplates();
}, []);

  const handleCreateTemplate = () => {
    setEditTemplate(null);
    setShowTemplateModal(true);
  };
  const handleEditTemplate = (template) => {
    setEditTemplate(template);
    setShowTemplateModal(true);
  };
const handleDeleteTemplate = async (t_id) => {
  if (!window.confirm('Are you sure you want to delete this template?')) return;
  try {
    await axios.delete(`http://localhost:3000/api/template/delete/${t_id}`);
    alert('Template deleted successfully');
    // Remove template from local state
    setTemplates(prevTemplates => prevTemplates.filter(template => template.t_id !== t_id));
  } catch (error) {
    console.error('Failed to delete template:', error);
    alert('Error deleting template');
  }
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
                <div key={template.t_id} className="template-item">
                  <div className="item-info">
                    <span className="item-title">{template.t_name}</span>
                    <span className="item-details">
                     {template.su_name} • {template.questions?.length || 0} questions
                    </span>
                  </div>
                  <div className="item-actions">
                    <button className="action-btn edit" title="Edit template" onClick={() => handleEditTemplate(template)}>
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" title="Delete template" onClick={() => handleDeleteTemplate(template.t_id)}>
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
              {/* Static Example Schedules */}
              <div className="schedule-item">
                <div className="item-info">
                  <span className="item-title">Mid-term Examination</span>
                  <span className="item-details">
                    2024-04-15 • 09:00 AM • 2 hours
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
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamManagement;
