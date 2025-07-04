import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FaClock,
  FaEdit,
  FaFileAlt,
  FaPlus,
  FaQuestionCircle,
  FaTrashAlt,
  FaEye,
  FaUpload
} from 'react-icons/fa';
import CreateExamModal from './CreateExamModal';
import CreateTemplateModal from './CreateTemplateModal';
import DashboardLayout from './DashboardLayout';
import './ExamManagement.css';
import toast from 'react-hot-toast';

const ExamManagement = () => {
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [exams, setExams] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [editExam, setEditExam] = useState(null);


  const fileInputRef = React.useRef();

  useEffect(() => {
    refreshTemplates();
    refreshExams();
    fetchFiles();
  }, []);
  const fetchFiles = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/file/display');
    setUploadedFiles(res.data);
  } catch (err) {
    console.error('Error fetching files:', err);
  }
};
  const refreshTemplates = async () => {
    try {
      const templatesRes = await axios.get('http://localhost:3000/api/question/display');
      console.log('API /api/question/display response:', templatesRes.data); // Debug log
      const templatesData = Array.isArray(templatesRes.data) ? templatesRes.data : [];
      // Ensure t_id is included and pass all properties
     const fetchedTemplates = templatesData.map(template => ({ 
        ...template,
        id: template.t_id,
        t_id: template.t_id, // Ensure t_id is present for editing
        title: template.t_name,
        subject: template.su_name,
        questions: Array.isArray(template.questions) ? template.questions : [], // Always pass the array
        questionList: template.questions || []
      }));
      
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
    // If template is a question object, find the template by t_id
    const fullTemplate = templates.find(t => t.t_id === (template.t_id || template.id));
    if (fullTemplate) {
      setEditTemplate(fullTemplate);
    } else if (template.questions) {
      setEditTemplate(template);
    } else {
      // fallback: wrap the question as a template with one question
      setEditTemplate({
        t_id: template.t_id,
        t_name: template.t_name,
        su_name: template.su_name,
        questions: [template]
      });
    }
    setShowTemplateModal(true);
  };
  const handleDeleteTemplate = async (templateId) => {
  if (!window.confirm('Are you sure you want to delete this template?')) return;
  try {
    await axios.delete(`http://localhost:3000/api/question/delete-template/${templateId}`);
    await refreshTemplates();
    toast.success('Template deleted successfully!');
  } catch (error) {
    console.error('Error deleting template:', error);
    toast.error('Failed to delete template.');
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
      toast.success('Exam deleted successfully!');
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('Failed to delete exam.');
    }
  };
  const handleFileUpload = async (file) => {
  if (!file) return;
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:3000/api/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success('Upload successful!');
    console.log("Response:", response.data);
    // Optional: refresh questionSets from backend
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error('Upload failed');
  }
};
const handleDelete = async (fileId) => {
  try {
    await axios.delete(`http://localhost:3000/api/file/delete/${fileId}`);
    fetchFiles(); // Refresh list after delete
  } catch (err) {
    console.error('Delete error:', err);
    toast.error('Failed to delete file');
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
              {templates.map((template, idx) => (
                <div key={`template-${template.t_id}-${idx}`} className="template-item">
                  <div className="item-info">
                    <span className="item-title">{template.title}</span>
                    <span className="item-details">
                      {template.subject} • {template.questions.length} questions
                    </span>
                  </div>
                  <div className="item-actions">
                    <button className="action-btn edit" title="Edit template" onClick={() => handleEditTemplate(template)}>
                      <FaEdit />
                    </button>
                   <button
                    className="action-btn delete"
                    title="Delete template"
                    onClick={() => {
                    console.log('Deleting template:', template);
                    handleDeleteTemplate(template.t_id); 
                    }}
                  >
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
                  onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
              }}
            />
            </div>
            <div className="question-bank">
              <div
                className="upload-area"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFileUpload(e.dataTransfer.files[0]);
                    e.dataTransfer.clearData();
                }
               }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
            <FaFileAlt className="upload-icon" />
            <p className="upload-text">
             Drag and drop question files here or click to browse
           </p>
          </div>
              {uploadedFiles.map((file, idx) => (
  <div key={`file-${file.file_id || idx}`} className="question-set">
    <div className="item-info">
      <span className="item-title">{file.file_name}</span>
    </div>
    <div className="item-actions">
      <button
        className="action-btn edit"
        title="View File"
        onClick={() => window.open(`http://localhost:3000/${file.file_path.replace("\\", "/")}`, "_blank")}
      >
        <FaEye />
      </button>
      <button
        className="action-btn delete"
        title="Delete File"
        onClick={() => handleDelete(file.file_id)}
      >
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
                exams.map((exam, idx) => (
                  <div key={exam.e_id ? `exam-${exam.e_id}` : `exam-idx-${idx}`} className="schedule-item">
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