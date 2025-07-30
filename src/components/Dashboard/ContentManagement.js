import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import api from '../../services/authService';
import ConfirmDialog from './ConfirmDialog';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const ContentManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [association, setAssociation] = useState('course');
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedAssociationId, setSelectedAssociationId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('Video');
  const [file, setFile] = useState(null);
  const [contents, setContents] = useState([]);
  const [editContent, setEditContent] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    // Clear previous list to avoid stale data
    setCourses([]);
    setSubjects([]);
    const fetchData = async () => {
      try {
        if (association === 'course') {
          const res = await api.get('http://localhost:3000/api/course/display');
          setCourses(res.data.courses || res.data);
        } else if (association === 'subject') {
          const res = await api.get('http://localhost:3000/api/subject/subject-display');
          // Try to handle both array and object response
          if (Array.isArray(res.data)) {
            setSubjects(res.data);
          } else if (Array.isArray(res.data.subjects)) {
            setSubjects(res.data.subjects);
          } else {
            setSubjects([]);
          }
        }
      } catch (err) {
        setCourses([]);
        setSubjects([]);
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
    setSelectedAssociationId(''); // Reset selection when switching
  }, [association]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/content/display');
      let contentArr = [];
      if (Array.isArray(res.data)) {
        contentArr = res.data;
      } else if (Array.isArray(res.data.data)) {
        contentArr = res.data.data;
      } else if (Array.isArray(res.data.contents)) {
        contentArr = res.data.contents;
      } else if (Array.isArray(res.data.content)) {
        contentArr = res.data.content;
      }
      setContents(contentArr);
    } catch (err) {
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [association]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !contentType || (!file && !editContent) || !selectedAssociationId) {
      toast.error('Please fill in all fields and select a course or subject.');
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("des", description);
    formData.append("c_type", contentType.toLowerCase());
    if (file) formData.append("file", file);
    if (association === "course") {
      formData.append("course_id", selectedAssociationId);
    } else if (association === "subject") {
      formData.append("subject_id", selectedAssociationId);
    }
    if ((association !== 'course' && association !== 'subject') || !selectedAssociationId) {
      toast.error('You must select either a course or a subject.');
      return;
    }
    try {
      if (editContent) {
        await api.put(`/content/edit/${editContent.ct_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success('Content updated successfully');
      } else {
        await api.post("/content/add", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        toast.success('Content added successfully');
      }
      closeModal();
      fetchContents();
    } catch (err) {
      console.error("Upload error:", err);
      let msg = err?.response?.data?.message || (editContent ? "Failed to update content" : "Failed to add content");
      toast.error(msg);
    }
  };

  const handleDelete = (ct_id) => {
    setPendingDeleteId(ct_id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/content/delete/${pendingDeleteId}`);
      fetchContents();
      toast.success('Content deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete content');
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleEditContent = (content) => {
    setEditContent(content);
    setShowModal(true);
    setTitle(content.title);
    setDescription(content.des);
    setContentType(content.c_type.charAt(0).toUpperCase() + content.c_type.slice(1));
    setSelectedAssociationId(content.coursename ? courses.find(c => c.coursename === content.coursename)?.courseId || '' : subjects.find(s => s.su_name === content.su_name)?.su_id || '');
    setAssociation(content.coursename ? 'course' : 'subject');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditContent(null);
    setTitle('');
    setDescription('');
    setContentType('Video');
    setSelectedAssociationId('');
    setFile(null);
  };

  // Fix: define isMobile at the top level
  const isMobile = window.innerWidth <= 900;

  return (
    <DashboardLayout>
      <div style={{padding: '2.5rem 2rem', background: '#f8fafc', minHeight: '100vh'}}>
        {/* Mobile: Centered heading and subtitle */}
        {isMobile ? (
          <div style={{ padding: '1rem 0 1rem 0', textAlign: 'center' }}>
            <span style={{ fontSize: 36, color: '#2563eb' }}><i className="fas fa-users"></i></span>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb', letterSpacing: 0.2 }}>Content Management</h1>
            <div style={{ color: '#6b7280', fontSize: '1.08rem', fontWeight: 500, marginTop: 2 }}>Manage all educational content across the platform</div>
          </div>
        ) : (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <span style={{fontSize: 36, color: '#2563eb'}}><i className="fas fa-users"></i></span>
                <span style={{fontSize: '2.2rem', fontWeight: 700, color: '#2563eb', letterSpacing: 0.5}}>Content Management</span>
              </div>
              <div style={{color: '#377dff', fontSize: '1.1rem', fontWeight: 400, marginTop: 2, marginLeft: 48}}>Manage all educational content across the platform</div>
            </div>
          </div>
        )}

        {/* Desktop: Filter/search bar and add button */}
        {!isMobile && (
          <div style={{background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #e0e7ef', padding: '2rem 2.5rem', marginBottom: 40, display: 'flex', flexDirection: 'row', gap: 18,justifyContent:'space-between', maxWidth: 1400}}>
            <input
              type="text"
              placeholder="Search Content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{flex: 1, minWidth: 220, maxWidth: 260, padding: '0.9rem 1.2rem', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1.08rem', background: '#fff', color: '#222', outline: 'none', boxShadow: 'none', transition: 'border 0.2s'}}
            />
            <button onClick={() => setShowModal(true)} style={{background: '#2563eb', color: '#fff', border: '2.5px solid #fff', boxShadow: '0 0 0 2.5px #2563eb', borderRadius: 10, padding: '0.9rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer',marginleft:'auto'}}>Upload New Content</button>
          </div>
        )}

        {/* Mobile: Search and add button */}
        {isMobile && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '0 1rem',
            marginBottom: '2rem'
          }}>
            <input
              type="text"
              placeholder="Search Content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '350px',
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: '1rem',
                background: '#fff',
                color: '#1a1a1a',
                outline: 'none'
              }}
            />
            <button 
              onClick={() => setShowModal(true)} 
              style={{
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.1rem',
                border: 'none',
                borderRadius: 10,
                padding: '0.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 2px 8px #2563eb22',
                cursor: 'pointer',
                maxWidth: '350px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <i className="fas fa-plus"></i> Upload New Content
            </button>
          </div>
        )}

        {showModal && (
          <div className="stream-modal-overlay" style={{alignItems: 'center', justifyContent: 'center'}}>
            <div className="stream-modal" style={{maxWidth: 430, width: '100%', padding: '1.2rem 1.2rem 1rem 1.2rem', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch', boxSizing: 'border-box', overflow: 'visible', height: 'auto'}}>
              <div className="stream-modal-header" style={{marginBottom: 4, alignItems: 'center', display: 'flex', justifyContent: 'space-between'}}>
                <h2 style={{fontWeight: 700, fontSize: '1.18rem', margin: 0}}>{editContent ? 'Edit Content' : 'Upload New Content'}</h2>
                <button className="stream-close-btn" style={{fontSize: 20, marginTop: -4}} onClick={closeModal}>×</button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <div>
                  <label style={{fontWeight: 600, fontSize: 13}}>Content Association</label>
                  <div style={{display: 'flex', gap: 10, marginTop: 4}}>
                    <label style={{display: 'flex', alignItems: 'center', fontSize: 13}}>
                      <input type="radio" name="association" value="course" checked={association === 'course'} onChange={() => setAssociation('course')} /> Course
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', fontSize: 13}}>
                      <input type="radio" name="association" value="subject" checked={association === 'subject'} onChange={() => setAssociation('subject')} /> Subject
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{fontWeight: 600, fontSize: 13}}>Select {association.charAt(0).toUpperCase() + association.slice(1)}</label>
                  <select value={selectedAssociationId} onChange={(e) => setSelectedAssociationId(e.target.value)} style={{width: '100%', padding: '0.45rem 0.7rem', border: '1px solid #e1e1e1', borderRadius: 6, fontSize: 13}}>
                    <option value="">Select {association}</option>
                    {association === 'course' ? (
                      courses.map(course => (
                        <option key={course.courseId || course.cid} value={(course.courseId || course.cid)}>{course.coursename}</option>
                      ))
                    ) : (
                      subjects.map(subject => (
                        <option key={subject.su_id} value={subject.su_id}>{subject.su_name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label style={{fontWeight: 600, fontSize: 13}}>Title *</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{width: '95%', padding: '0.45rem 0.7rem', border: '1px solid #e1e1e1', borderRadius: 6, fontSize: 13}} />
                </div>
                <div>
                  <label style={{fontWeight: 600, fontSize: 13}}>Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} style={{width: '95%', minHeight: 40, padding: '0.45rem 0.7rem', border: '1px solid #e1e1e1', borderRadius: 6, fontSize: 13, resize: 'vertical'}} />
                </div>
                <div>
                  <label style={{fontWeight: 600, fontSize: 13}}>Content Type *</label>
                  <select value={contentType} onChange={e => setContentType(e.target.value)} required style={{width: '100%', padding: '0.45rem 0.7rem', border: '1px solid #e1e1e1', borderRadius: 6, fontSize: 13}}>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                    <option value="Image">Image</option>
                  </select>
                </div>
                <div style={{ width: '100%' }}>
                  <label style={{ fontWeight: 600, marginBottom: 2, display: 'block', fontSize: 13 }}>Upload File *</label>
                  <div style={{
                    border: '2px dashed #b0b8c1',
                    borderRadius: 8,
                    padding: 10,
                    textAlign: 'center',
                    background: '#fafbfc',
                    marginBottom: 0
                  }}>
                    <input type="file" style={{ display: 'none' }} id="file-upload" onChange={handleFileChange} />
                    <label htmlFor="file-upload" style={{
                      cursor: 'pointer',
                      color: '#2563eb',
                      fontWeight: 500,
                      fontSize: 13,
                      display: 'block'
                    }}>
                      <span style={{
                        fontSize: 18,
                        display: 'block',
                        color: '#b0b8c1',
                        marginBottom: 2
                      }}>
                        <i className="fas fa-file-upload"></i>
                      </span>
                      Click to upload or drag and drop
                    </label>
                    <div style={{ color: '#888', fontSize: 10, marginTop: 1 }}>MP4 up to 100MB</div>
                    {file && (
                      <div style={{ marginTop: 2, color: '#2563eb', fontWeight: 500, fontSize: 12 }}>
                        {file.name}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12}}>
                  <button type="button" style={{background: '#f3f4f6', color: '#222', border: '1px solid #e1e1e1', fontWeight: 500, fontSize: 13, padding: '0.4rem 1rem'}} onClick={closeModal}>Cancel</button>
                  <button type="submit" style={{background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, padding: '0.4rem 1rem'}}>Upload Content</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Desktop: Table view */}
        {!isMobile && (
          <div style={{background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #e0e7ef', padding: '2rem 2.5rem', marginTop: 20, maxWidth: 1400}}>
            <h3 style={{marginBottom: 16, color: '#2563eb'}}>All Content</h3>
            <table className="management-table" style={{width: '100%', borderCollapse: 'collapse', fontSize: '1rem'}}>
              <thead>
                <tr style={{background: '#f3f4f6'}}>
                  <th style={{padding: 10, border: '1px solid #e2e8f0', textAlign: 'left'}}>Title</th>
                  <th style={{padding: 10, border: '1px solid #e2e8f0', textAlign: 'left'}}>Description</th>
                  <th style={{padding: 10, border: '1px solid #e2e8f0', textAlign: 'left'}}>Type</th>
                  <th style={{padding: 10, border: '1px solid #e2e8f0', textAlign: 'left'}}>File</th>
                  <th style={{padding: 10, border: '1px solid #e2e8f0', textAlign: 'left'}}>Course/Subject</th>
                  <th style={{padding: 10, border: '1px solid #e2e8f0', textAlign: 'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contents.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: 16}}>No content found.</td></tr>
                ) : (
                  contents.filter(c => c.title?.toLowerCase().includes(search.toLowerCase())).map(content => (
                    <tr key={content.ct_id} style={{borderBottom: '1px solid #e2e8f0'}}>
                      <td style={{padding: 10, border: '1px solid #e2e8f0'}}>{content.title}</td>
                      <td style={{padding: 10, border: '1px solid #e2e8f0'}}>{content.des}</td>
                      <td style={{padding: 10, border: '1px solid #e2e8f0'}}>{content.c_type}</td>
                      <td style={{padding: 10, border: '1px solid #e2e8f0'}}>
                        <a
                          href={`http://localhost:3000/${content.file_path.replace(/\\/g, '/')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'underline' }}
                        >
                          View File
                        </a>
                      </td>
                      <td style={{padding: 10, border: '1px solid #e2e8f0'}}>
                        {content.coursename || content.su_name}
                      </td>
                      <td style={{padding: 10, border: '1px solid #e2e8f0', textAlign: 'center'}}>
                        <button onClick={() => handleEditContent(content)} style={{background: '#2563eb', color: '#fff', border: '1px solid #2563eb', borderRadius: 6, padding: '0.4rem 0.8rem', fontSize: 12, marginRight: 5, cursor: 'pointer'}}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(content.ct_id)} style={{background: '#dc3545', color: '#fff', border: '1px solid #dc3545', borderRadius: 6, padding: '0.4rem 0.8rem', fontSize: 12, cursor: 'pointer'}}>
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile: Card view */}
        {isMobile && (
          <div style={{
            padding: '0 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading content...</div>
            ) : contents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No content found.</div>
            ) : (
              contents.filter(c => c.title?.toLowerCase().includes(search.toLowerCase())).map(content => (
                <div key={content.ct_id} style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  width: '100%',
                  maxWidth: '350px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1f2937' }}>{content.title}</h3>
                    <span style={{
                      background: '#2563eb',
                      color: '#fff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      {content.c_type}
                    </span>
                  </div>
                  
                  {content.des && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Description:</span>
                      <span>{content.des}</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: 500 }}>Course/Subject:</span>
                    <span>{content.coursename || content.su_name}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontWeight: 500 }}>File:</span>
                    <a
                      href={`http://localhost:3000/${content.file_path.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.9rem' }}
                    >
                      View File
                    </a>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    justifyContent: 'center'
                  }}>
                    <button 
                      onClick={() => handleEditContent(content)} 
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <FaEdit size={12} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(content.ct_id)} 
                      style={{
                        background: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <FaTrashAlt size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this content? This action cannot be undone.`}
      />
    </DashboardLayout>
  );
};

export default ContentManagement;