import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const ContentManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [association, setAssociation] = useState('chapter');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('Video');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <DashboardLayout>
      <div style={{padding: '2.5rem 2rem', background: '#f8fafc', minHeight: '100vh'}}>
        {/* Header */}
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
        {/* Filter Card - Only Search Bar */}
        <div style={{background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px #e0e7ef', padding: '2rem 2.5rem', marginBottom: 40, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start', maxWidth: 1400}}>
          <input
            type="text"
            placeholder="Search Content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{flex: 1, minWidth: 220, maxWidth: 260, padding: '0.9rem 1.2rem', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1.08rem', background: '#fff', color: '#222', outline: 'none', boxShadow: 'none', transition: 'border 0.2s'}}
          />
        </div>
        {/* Upload Modal */}
        {showModal && (
          <div className="stream-modal-overlay" style={{alignItems: 'center', justifyContent: 'center'}}>
            <div className="stream-modal" style={{maxWidth: 380, width: '100%', padding: '1.2rem 1.2rem 1rem 1.2rem', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'stretch', boxSizing: 'border-box', overflow: 'visible', height: 'auto'}}>
              <div className="stream-modal-header" style={{marginBottom: 4, alignItems: 'center', display: 'flex', justifyContent: 'space-between'}}>
                <h2 style={{fontWeight: 700, fontSize: '1.18rem', margin: 0}}>Upload New Content</h2>
                <button className="stream-close-btn" style={{fontSize: 20, marginTop: -4}} onClick={() => setShowModal(false)}>×</button>
              </div>
              <form style={{display: 'flex', flexDirection: 'column', gap: 8, width: '100%', boxSizing: 'border-box', height: 'auto'}}>
                <div style={{width: '100%'}}>
                  <label style={{fontWeight: 600, marginBottom: 2, display: 'block', fontSize: 13}}>Content Association</label>
                  <div style={{display: 'flex', gap: 8, marginTop:2, flexWrap: 'Wrap'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: 3, fontSize: 12}}>
                      <input type="radio" style={{marginBottom:2}} name="association" value="course" checked={association === 'course'} onChange={() => setAssociation('course')} /> Course
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: 3, fontSize: 12}}>
                      <input type="radio" style={{marginBottom:2}} name="association" value="subject" checked={association === 'subject'} onChange={() => setAssociation('subject')} /> Subject
                    </label>
                  </div>
                </div>
                <div style={{width: '100%'}}>
                  <label style={{fontWeight: 600, marginBottom: 2, display: 'block', fontSize: 13}}>Select {association.charAt(0).toUpperCase() + association.slice(1)}</label>
                  <select style={{width: '100%', padding: '0.45rem 0.7rem', border: '1px solid #e1e1e1', borderRadius: 6, fontSize: 13, marginBottom: 0}}>
                    <option value="">Select {association}</option>
                  </select>
                </div>
                <div style={{width: '100%'}}>
                  <label style={{fontWeight: 600, marginBottom: 2, display: 'block', fontSize: 13}}>Title *</label>
                  <input type="text" style={{width: '95%', padding: '0.45rem 0.7rem', border: '1px solid #e1e1e1', borderRadius: 6, fontSize: 13}} value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div style={{width: '100%'}}>
                  <label style={{fontWeight: 600, marginBottom: 2, display: 'block', fontSize: 13}}>Description</label>
                  <textarea style={{width: '95%', minHeight: 40, padding: '0.45rem 0.7rem', border: '1px solid #e1e1e1', borderRadius: 6, fontSize: 13, resize: 'vertical'}} value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div style={{width: '100%'}}>
                  <label style={{fontWeight: 600, marginBottom: 2, display: 'block', fontSize: 13}}>Content Type *</label>
                  <select style={{width: '100%', padding: '0.45rem 0.7rem', border: '1px solid #e1e1e1', borderRadius: 6, fontSize: 13}} value={contentType} onChange={e => setContentType(e.target.value)} required>
                    <option value="Video">Video</option>
                    <option value="Document">Document</option>
                    <option value="Image">Image</option>
                  </select>
                </div>
                <div style={{width: '100%'}}>
                  <label style={{fontWeight: 600, marginBottom: 2, display: 'block', fontSize: 13}}>Upload File *</label>
                  <div style={{border: '2px dashed #b0b8c1', borderRadius: 8, padding: 10, textAlign: 'center', background: '#fafbfc', marginBottom: 0}}>
                    <input type="file" style={{display: 'none'}} id="file-upload" onChange={handleFileChange} />
                    <label htmlFor="file-upload" style={{cursor: 'pointer', color: '#2563eb', fontWeight: 500, fontSize: 13, display: 'block'}}>
                      <span style={{fontSize: 18, display: 'block', color: '#b0b8c1', marginBottom: 2}}><i className="fas fa-file-upload"></i></span>
                      Click to upload or drag and drop
                    </label>
                    <div style={{color: '#888', fontSize: 10, marginTop: 1}}>MP4 up to 100MB</div>
                    {file && <div style={{marginTop: 2, color: '#2563eb', fontWeight: 500, fontSize: 12}}>{file.name}</div>}
                  </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 2, width: '100%'}}>
                  <button type="button" className="add-stream-btn" style={{background: '#f3f4f6', color: '#222', border: '1px solid #e1e1e1', fontWeight: 500, fontSize: 13, padding: '0.4rem 1rem'}} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="add-stream-btn" style={{background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, padding: '0.4rem 1rem'}}>Upload Content</button>
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