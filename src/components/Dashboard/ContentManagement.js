import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (association === 'course') {
          const res = await axios.get('http://localhost:3000/api/course/display');
          setCourses(res.data.courses || res.data);
        } else {
          const res = await axios.get('http://localhost:3000/api/subject/display');
          setSubjects(res.data.subjects || res.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [association]);

  const fetchContents = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/content/display');
      console.log('Raw API response:', res.data);
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
    }
  };

  useEffect(() => {
    fetchContents();
  }, [association]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !contentType || (!file && !editContent) || !selectedAssociationId) {
      alert("Please fill in all fields and select a course or subject.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("des", description);
    formData.append("c_type", contentType.toLowerCase());
    if (file) formData.append("file", file);
    if (association === "course") {
      const selectedCourse = courses.find(course => (course.courseId || course.cid)?.toString() === selectedAssociationId);
      if (!selectedCourse) {
        alert("Invalid course selected");
        return;
      }
      formData.append("coursename", selectedCourse.coursename);
    } else {
      const selectedSubject = subjects.find(subject => subject.su_id.toString() === selectedAssociationId);
      if (!selectedSubject) {
        alert("Invalid subject selected");
        return;
      }
      formData.append("su_name", selectedSubject.su_name);
    }
    try {
      if (editContent) {
        await axios.put(`http://localhost:3000/api/content/update/${editContent.ct_id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Content updated successfully");
      } else {
        await axios.post("http://localhost:3000/api/content/add", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Content added successfully");
      }
      closeModal();
      fetchContents();
    } catch (err) {
      console.error("Upload error:", err);
      alert(editContent ? "Failed to update content" : "Failed to add content");
    }
  };

  const handleDeleteContent = async (ct_id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/content/delete/${ct_id}`);
      fetchContents();
      alert('Content deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete content');
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

  // Debug log to show what is being rendered
  console.log('Contents to display:', contents);

  return (
    <DashboardLayout>
      <div style={{padding: '2.5rem 2rem', background: '#f8fafc', minHeight: '100vh'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{fontSize: 36, color: '#2563eb'}}><i className="fas fa-users"></i></span>
              <span style={{fontSize: '2.2rem', fontWeight: 700, color: '#2563eb', letterSpacing: 0.5}}>Content Management</span>
            </div>
            <div style={{color: '#377dff', fontSize: '1.1rem', fontWeight: 400, marginTop: 2, marginLeft: 48}}>Manage all educational content across the platform</div>
          </div>
          <button onClick={() => setShowModal(true)} style={{background: '#2563eb', color: '#fff', border: '2.5px solid #fff', boxShadow: '0 0 0 2.5px #2563eb', borderRadius: 10, padding: '0.9rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer'}}>Upload New Content</button>
        </div>

        <div style={{background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #e0e7ef', padding: '2rem 2.5rem', marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start', maxWidth: 1400}}>
          <input
            type="text"
            placeholder="Search Content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{flex: 1, minWidth: 220, maxWidth: 260, padding: '0.9rem 1.2rem', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1.08rem', background: '#fff', color: '#222', outline: 'none', boxShadow: 'none', transition: 'border 0.2s'}}
          />
        </div>

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
                        style={{
                          display: 'inline-block',
                          background: '#16a34a',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 12px',
                          fontWeight: 500,
                          textDecoration: 'none',
                          fontSize: '0.98rem',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          margin: 0
                        }}
                      >
                        View
                      </a>
                    </td>
                    <td style={{padding: 10, border: '1px solid #e2e8f0'}}>{content.coursename || content.su_name || '-'}</td>
                    <td style={{padding: 10, border: '1px solid #e2e8f0', textAlign: 'center'}}>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
                        <button className="action-btn edit" style={{background: '#f3f4f6', border: '1px solid #2563eb', color: '#2563eb', borderRadius: 6, padding: '4px 10px', cursor: 'pointer'}} title="Edit" onClick={() => handleEditContent(content)}><FaEdit /></button>
                        <button className="action-btn delete" style={{background: '#f3f4f6', border: '1px solid #e11d48', color: '#e11d48', borderRadius: 6, padding: '4px 10px', cursor: 'pointer'}} title="Delete" onClick={() => handleDeleteContent(content.ct_id)}><FaTrashAlt /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentManagement;
