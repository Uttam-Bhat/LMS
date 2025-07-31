import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaFolderOpen, FaImage, FaSearch } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/authService';
import './StudentDashboard.css';
import StudentLayout from './StudentLayout';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('course'); // 'course' or 'subject'
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightCourse = params.get('highlightCourse');
  const [highlight, setHighlight] = useState(!!highlightCourse);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 900;

  useEffect(() => {
    const studentId = localStorage.getItem('student_id');
    if (!studentId) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }
    api.get('/content/display')
      .then(res => setMaterials(res.data.content || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (highlightCourse) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightCourse]);

  // Tab filtering
  const tabFilteredMaterials = materials.filter(item => {
    if (activeTab === 'course') {
      return item.coursename && item.coursename.trim() !== '';
    } else {
      return item.su_name && item.su_name.trim() !== '';
    }
  });

  // Search filtering
  const filteredMaterials = tabFilteredMaterials.filter(item =>
    (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.su_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.coursename || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.des || '').toLowerCase().includes(search.toLowerCase())
  );

  const updateCourseCompletion = (courseName, materialId) => {
    if (!courseName || !materialId) return;
    const key = 'courseCompletion';
    const viewedKey = 'viewedMaterials';
    // Track viewed materials per course
    const viewedRaw = localStorage.getItem(viewedKey);
    const viewed = viewedRaw ? JSON.parse(viewedRaw) : {};
    if (!viewed[courseName]) viewed[courseName] = [];
    if (viewed[courseName].includes(materialId)) return false; // Already viewed, do nothing
    viewed[courseName].push(materialId);
    localStorage.setItem(viewedKey, JSON.stringify(viewed));
    // Update completion with dynamic increment
    const total = materials.filter(m => m.coursename === courseName).length;
    const delta = total > 0 ? 100 / total : 10;
    const saved = localStorage.getItem(key);
    const map = saved ? JSON.parse(saved) : {};
    map[courseName] = Math.min(100, (map[courseName] || 0) + delta);
    localStorage.setItem(key, JSON.stringify(map));
    return true;
  };

  // Helper to get viewed materials for the current course
  const getViewedMaterials = (courseName) => {
    const viewedKey = 'viewedMaterials';
    const viewedRaw = localStorage.getItem(viewedKey);
    const viewed = viewedRaw ? JSON.parse(viewedRaw) : {};
    return viewed[courseName] || [];
  };

  return (
    <StudentLayout>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#2563eb', fontWeight: 600, fontSize: '1.1rem' }}>Loading materials...</div>
      ) : (
        <>
          {!isMobile && (
            <div style={{ padding: '2rem 0 1rem 0' ,display:'flex'}}>
              <div style={{ display: 'flex',flexDirection:'column', gap: 12 }}>
                <div style={{display:'flex',flexDirection:'row',gap:12}}>
                  <FaFolderOpen size={32} color="#2563eb" />
                  <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Study Materials</h1>
                </div>
                <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>Access all your learning materials here</div>
                <div style={{ position: 'relative', minWidth: 220, maxWidth: 320, flex: 1 }}>
                  <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 18 }} />
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      padding: '0.5rem 1rem 0.5rem 2.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      fontSize: '1rem',
                      background: '#f9fafb',
                      color: '#1a1a1a',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Sub-navbar for Course/Subject Materials */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 0, margin: '0 0 1.5rem 0', borderBottom: '2px solid #e5e7eb', width: '100%' }}>
              <button
                onClick={() => setActiveTab('course')}
                style={{
                  border: 'none',
                  background: 'none',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: activeTab === 'course' ? '#2563eb' : '#6b7280',
                  borderBottom: activeTab === 'course' ? '3px solid #2563eb' : '3px solid transparent',
                  padding: '0.7rem 2.2rem',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'color 0.2s, border-bottom 0.2s',
                  backgroundColor: activeTab === 'course' ? '#f6f8fb' : 'transparent',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8
                }}
              >
                Course Materials
              </button>
              <button
                onClick={() => setActiveTab('subject')}
                style={{
                  border: 'none',
                  background: 'none',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: activeTab === 'subject' ? '#2563eb' : '#6b7280',
                  borderBottom: activeTab === 'subject' ? '3px solid #2563eb' : '3px solid transparent',
                  padding: '0.7rem 2.2rem',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'color 0.2s, border-bottom 0.2s',
                  backgroundColor: activeTab === 'subject' ? '#f6f8fb' : 'transparent',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8
                }}
              >
                Subject Materials
              </button>
            </div>
          )}

          {isMobile && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              boxSizing: 'border-box',
              padding: '0 20px',
              gap: 16
            }}>
              {/* Mobile Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                width: '100%',
                padding: '1rem 0'
              }}>
                <FaFolderOpen size={28} color="#2563eb" />
                <div style={{ textAlign: 'center' }}>
                  <h1 style={{ margin: 0, fontWeight: 700, fontSize: '1.5rem', color: '#2563eb' }}>Study Materials</h1>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>Access all your learning materials here</div>
                </div>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 16 }} />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: '1rem',
                    background: '#fff',
                    color: '#1a1a1a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Tab buttons */}
              <div style={{ display: 'flex', gap: 0, width: '100%', maxWidth: '350px', borderBottom: '2px solid #e5e7eb' }}>
                <button
                  onClick={() => setActiveTab('course')}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: activeTab === 'course' ? '#2563eb' : '#6b7280',
                    borderBottom: activeTab === 'course' ? '3px solid #2563eb' : '3px solid transparent',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'color 0.2s, border-bottom 0.2s',
                    backgroundColor: activeTab === 'course' ? '#f6f8fb' : 'transparent',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                  }}
                >
                  Course Materials
                </button>
                <button
                  onClick={() => setActiveTab('subject')}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: activeTab === 'subject' ? '#2563eb' : '#6b7280',
                    borderBottom: activeTab === 'subject' ? '3px solid #2563eb' : '3px solid transparent',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'color 0.2s, border-bottom 0.2s',
                    backgroundColor: activeTab === 'subject' ? '#f6f8fb' : 'transparent',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8
                  }}
                >
                  Subject Materials
                </button>
              </div>
            </div>
          )}

          {!isMobile && (
            <div className="materials-section">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading materials...</div>
              ) : filteredMaterials.length === 0 ? (
                <div style={{ color: '#6b7a90', fontSize: '1.1rem' }}>No materials found.</div>
              ) : (
                <div style={{
                  overflowX: 'auto',
                  marginTop: '2rem',
                  marginBottom: '2rem',
                  maxWidth: 1200,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 12px #2563eb18',
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f6f8fb', color: '#2563eb', fontWeight: 700 }}>
                        <th style={{ padding: '12px 8px', textAlign: 'left' }}>Title</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left' }}>Type</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left' }}>{activeTab === 'course' ? 'Course' : 'Subject'}</th>
                        <th style={{ padding: '12px 8px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center' }}>View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaterials.map(item => {
                        const isHighlighted =
                          highlight && highlightCourse && item.coursename && item.coursename === highlightCourse;
                        const viewedMaterials = getViewedMaterials(item.coursename);
                        const isViewed = viewedMaterials.includes(item.ct_id);
                        return (
                          <tr
                            key={item.ct_id}
                            style={{
                              borderBottom: '1px solid #e5e7eb',
                              background: isHighlighted ? '#ffe066' : undefined,
                              transition: 'background 0.5s'
                            }}
                          >
                            <td style={{ padding: '10px 8px', fontWeight: 600, color: '#222' }}>
                              {item.title}
                              {isViewed && (
                                <span style={{ marginLeft: 8, color: '#059669', fontSize: '1.1em', verticalAlign: 'middle' }} title="Viewed">✔</span>
                              )}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#2563eb', fontWeight: 600 }}>
                              {item.c_type === 'image' ? <FaImage style={{ marginRight: 6 }} /> : <FaFolderOpen style={{ marginRight: 6 }} />}
                              {item.c_type}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#222', fontWeight: 500 }}>
                              {activeTab === 'course'
                                ? (item.coursename && item.coursename.trim() !== '' ? item.coursename : '-')
                                : (item.su_name && item.su_name.trim() !== '' ? item.su_name : '-')}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#555' }}>{item.des}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                              {item.file_path ? (
                                <a
                                  href={`http://localhost:3000/${item.file_path.replace('\\', '/').replace('\\', '/')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                    onClick={e => {
                                      const didUpdate = updateCourseCompletion(item.coursename, item.ct_id);
                                      if (!didUpdate) {
                                        // Prevent navigation if you want, or just do nothing
                                        // e.preventDefault();
                                      }
                                    }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    background: '#2563eb',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '6px 16px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 8px #2563eb22',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                  }}
                                >
                                  <FaEye style={{ marginRight: 6 }} /> View
                                </a>
                              ) : (
                                <span style={{ color: '#aaa' }}>No file</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {isMobile && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              boxSizing: 'border-box',
              padding: '0 20px',
              gap: 16,
              marginTop: '24px'
            }}>
              {filteredMaterials.length === 0 ? (
                <div style={{ color: '#6b7a90', fontSize: '1.1rem', textAlign: 'center', padding: '2rem' }}>No materials found.</div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  width: '100%',
                  maxWidth: '350px'
                }}>
                  {filteredMaterials.map(item => {
                    const isHighlighted = highlight && highlightCourse && item.coursename && item.coursename === highlightCourse;
                    const viewedMaterials = getViewedMaterials(item.coursename);
                    const isViewed = viewedMaterials.includes(item.ct_id);
                    
                    return (
                      <div key={item.ct_id} style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: '1rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '0.5rem'
                        }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                          }}>
                            {item.title}
                            {isViewed && (
                              <span style={{ color: '#059669', fontSize: '1.1em' }} title="Viewed">✔</span>
                            )}
                          </h3>
                          <div style={{
                            display: 'flex',
                            gap: 8
                          }}>
                            {item.file_path ? (
                              <a
                                href={`http://localhost:3000/${item.file_path.replace('\\', '/').replace('\\', '/')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => updateCourseCompletion(item.coursename, item.ct_id)}
                                style={{
                                  background: '#2563eb',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 6,
                                  padding: '0.5rem 0.75rem',
                                  fontSize: '0.8rem',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                              >
                                <FaEye /> View
                              </a>
                            ) : (
                              <span style={{ color: '#aaa', fontSize: '0.8rem' }}>No file</span>
                            )}
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                          fontSize: '0.9rem',
                          color: '#6b7280'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 500 }}>Type:</span>
                            <span style={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {item.c_type === 'image' ? <FaImage /> : <FaFolderOpen />}
                              {item.c_type}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 500 }}>{activeTab === 'course' ? 'Course:' : 'Subject:'}</span>
                            <span>{activeTab === 'course' ? (item.coursename || 'N/A') : (item.su_name || 'N/A')}</span>
                          </div>
                          {item.des && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: 500 }}>Description:</span>
                              <span>{item.des}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </StudentLayout>
  );
};

export default Materials; 