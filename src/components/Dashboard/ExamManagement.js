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
import api from '../../services/authService';

const ExamManagement = () => {
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [exams, setExams] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [editExam, setEditExam] = useState(null);
  const isMobile = window.innerWidth <= 900;


  const fileInputRef = React.useRef();

  useEffect(() => {
    refreshTemplates();
    refreshExams();
    fetchFiles();
  }, []);
  const fetchFiles = async () => {
  try {
    const res = await api.get('/file/display');
    setUploadedFiles(res.data);
  } catch (err) {
    console.error('Error fetching files:', err);
  }
};
  const refreshTemplates = async () => {
    try {
      const templatesRes = await api.get('/question/display');
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
      const res = await api.get('/exam/display');
      // Map t_id or templateId to template_id for modal compatibility
      const exams = (Array.isArray(res.data) ? res.data : []).map(exam => ({
        ...exam,
        template_id: exam.template_id || exam.t_id || exam.templateId || ''
      }));
      setExams(exams);
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
    await api.delete(`/question/delete-template/${templateId}`);
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
      await api.delete(`/exam/delete/${examId}`);
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

      const response = await api.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success('Upload successful!');
      console.log("Response:", response.data);
      // Immediately refresh file list after upload
      fetchFiles();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error('Upload failed');
    }
  };
const handleDelete = async (fileId) => {
  try {
    await api.delete(`/file/delete/${fileId}`);
    fetchFiles(); // Refresh list after delete
  } catch (err) {
    console.error('Delete error:', err);
    toast.error('Failed to delete file');
  }
};

  // Card style for templates, files, and exams (remove border, keep boxShadow, center content)
  const mobileCardStyle = {
    background: '#fff',
    borderRadius: 16,
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    // border: '1px solid #e5e7eb', // REMOVE this line
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };
  // Upload area style (remove border, keep dashed border, center content)
  const mobileUploadAreaStyle = {
    maxWidth: '420px',
    border: '3px dashed #d1d5db',
    borderRadius: 16,
    padding: '3rem 1.5rem',
    textAlign: 'center',
    background: '#f9fafb',
    cursor: 'pointer',
    margin: '0 auto 1.5rem auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <DashboardLayout>
      <div className="exam-management" style={{ padding: '2rem 0 1rem 0' }}>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 36, color: '#2563eb' }}><FaFileAlt /></span>
            <div>
              <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Exam Management</h1>
              <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>Create, edit, and manage exams and question banks</div>
            </div>
          </div>
        )}
        
        {isMobile && (
          <div style={{
            width: '100vw',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '0',
            background: '#fff',
          }}>
            {/* Exam Templates Section */}
            <div style={{
              maxWidth: '380px',
              margin: '0 auto 2rem auto',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                margin: '0 0 1rem 0',
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                }}>Exam Templates</h2>
                <button
                  onClick={handleCreateTemplate}
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.6rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaPlus size={16} />
                </button>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                maxWidth: '380px',
                margin: '0 auto',
              }}>
                {templates.map((template, idx) => (
                  <div key={`template-${template.t_id}-${idx}`} style={mobileCardStyle}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: '#1a1a1a',
                      marginBottom: '0.5rem',
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      {template.title}
                    </h3>
                    <div style={{
                      fontSize: '1rem',
                      color: '#6b7280',
                      marginBottom: '0.8rem',
                      textAlign: 'center',
                      width: '100%'
                    }}>
                      • {template.questions.length} questions
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      justifyContent: 'center',
                      width: '100%'
                    }}>
                      <button
                        onClick={() => handleEditTemplate(template)}
                        style={{
                          background: '#2563eb',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0.6rem 1rem',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.t_id)}
                        style={{
                          background: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0.6rem 1rem',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Question Bank Section */}
            <div style={{
              maxWidth: '380px',
              margin: '0 auto 2rem auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                margin: '0 0 1rem 0',
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                }}>Question Bank</h2>
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.6rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaUpload size={16} />
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
              <div
                style={{
                  maxWidth: '380px',
                  border: '3px dashed #d1d5db',
                  borderRadius: 12,
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  background: '#f9fafb',
                  cursor: 'pointer',
                  margin: '0 auto 1rem auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
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
                <FaFileAlt size={36} color="#9ca3af" style={{ marginBottom: '0.8rem' }} />
                <p style={{
                  margin: 0,
                  fontSize: '1rem',
                  color: '#6b7280',
                  fontWeight: 500,
                  textAlign: 'center',
                  width: '100%'
                }}>
                  Tap to upload question files
                </p>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                maxWidth: '380px',
                margin: '0 auto',
              }}>
                {uploadedFiles.map((file, idx) => (
                  <div key={`file-${file.file_id || idx}`} style={mobileCardStyle}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#1a1a1a',
                      marginBottom: '0.8rem'
                    }}>
                      {file.file_name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      justifyContent: 'center',
                      width: '100%'
                    }}>
                      <button
                        onClick={() => window.open(`http://localhost:3000/${file.file_path.replace("\\", "/")}`, "_blank")}
                        style={{
                          background: '#2563eb',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0.6rem 1rem',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(file.file_id)}
                        style={{
                          background: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0.6rem 1rem',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Exam Schedules Section */}
            <div style={{
              maxWidth: '380px',
              margin: '0 auto 2rem auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                margin: '0 0 1rem 0',
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: '#1a1a1a',
                }}>Exam Schedules</h2>
                <button
                  onClick={handleCreateExam}
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.6rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FaPlus size={16} />
                </button>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                maxWidth: '380px',
                margin: '0 auto',
              }}>
                {exams.length === 0 ? (
                  <div style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb',
                    color: '#6b7280',
                    fontSize: '1rem'
                  }}>
                    No exams found.
                  </div>
                ) : (
                  exams.map((exam, idx) => (
                    <div key={exam.e_id ? `exam-${exam.e_id}` : `exam-idx-${idx}`} style={mobileCardStyle}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '0.5rem'
                      }}>
                        {exam.e_name}
                      </h3>
                      <div style={{
                        fontSize: '1rem',
                        color: '#6b7280',
                        lineHeight: '1.4',
                        marginBottom: '0.5rem'
                      }}>
                        {exam.e_date} • {exam.e_time} • {exam.duration} min
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#9ca3af',
                        marginBottom: '0.8rem'
                      }}>
                        Template: {exam.t_name}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: 8,
                        justifyContent: 'center',
                        width: '100%'
                      }}>
                        <button
                          onClick={() => handleEditExam(exam)}
                          style={{
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '0.6rem 1rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExam(exam.e_id)}
                          style={{
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '0.6rem 1rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
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
          {!isMobile && (
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
          )}

          {/* Question Bank Section */}
          {!isMobile && (
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
          )}

          {/* Exam Schedules Section */}
          {!isMobile && (
            <div className="exam-section-card">
              <div className="section-header">
                <h2>Exam Schedules</h2>
                <button title="Add Schedule" onClick={handleCreateExam}>
                  <FaPlus />
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamManagement; 