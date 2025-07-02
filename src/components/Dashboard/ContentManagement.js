import axios from 'axios';
import { useEffect, useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !contentType || !file || !selectedAssociationId) {
      alert("Please fill in all fields and select a course or subject.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("des", description);
    formData.append("c_type", contentType.toLowerCase());
    formData.append("file", file);

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
      const res = await axios.post("http://localhost:3000/api/content/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Content added successfully");
      setShowModal(false);
      setTitle('');
      setDescription('');
      setSelectedAssociationId('');
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to add content");
    }
  };

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
                <h2 style={{fontWeight: 700, fontSize: '1.18rem', margin: 0}}>Upload New Content</h2>
                <button className="stream-close-btn" style={{fontSize: 20, marginTop: -4}} onClick={() => setShowModal(false)}>×</button>
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
                <div>
                  <label style={{fontWeight: 600, fontSize: 13}}>Upload File *</label>
                  <div style={{border: '2px dashed #b0b8c1', borderRadius: 8, padding: 10, textAlign: 'center', background: '#fafbfc'}}>
                    <input type="file" id="file-upload" onChange={handleFileChange} hidden />
                    <label htmlFor="file-upload" style={{cursor: 'pointer', color: '#2563eb', fontWeight: 500, fontSize: 13}}>
                      <span style={{fontSize: 18, color: '#b0b8c1'}}><i className="fas fa-file-upload"></i></span>
                      Click to upload or drag and drop
                    </label>
                    {file && <div style={{marginTop: 6, color: '#2563eb', fontWeight: 500, fontSize: 12}}>{file.name}</div>}
                  </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12}}>
                  <button type="button" style={{background: '#f3f4f6', color: '#222', border: '1px solid #e1e1e1', fontWeight: 500, fontSize: 13, padding: '0.4rem 1rem'}} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" style={{background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, padding: '0.4rem 1rem'}}>Upload Content</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContentManagement;
