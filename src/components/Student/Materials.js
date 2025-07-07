import axios from 'axios';
import { useEffect, useState } from 'react';
import StudentLayout from './StudentLayout';
import './StudentDashboard.css';
import { FaFolderOpen, FaSearch, FaBook, FaInfoCircle, FaImage, FaEye } from 'react-icons/fa';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/content/display')
      .then(res => setMaterials(res.data.content || []))
      .catch(() => setMaterials([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredMaterials = materials.filter(item =>
    (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.su_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.des || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="dashboard-main-content">
        <div style={{ padding: '2rem 0 1rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaFolderOpen size={32} color="#2563eb" />
            <div>
              <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Study Materials</h1>
              <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>Access all your learning materials here</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaSearch style={{ color: '#a0aec0', fontSize: 18 }} />
              <input
                type="text"
                placeholder="Search materials..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: '1rem',
                  background: '#f9fafb',
                  color: '#1a1a1a',
                  outline: 'none',
                  minWidth: 220
                }}
              />
            </div>
          </div>
        </div>
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
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Subject</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map(item => (
                    <tr key={item.ct_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 600, color: '#222' }}>{item.title}</td>
                      <td style={{ padding: '10px 8px', color: '#2563eb', fontWeight: 600 }}>
                        {item.c_type === 'image' ? <FaImage style={{ marginRight: 6 }} /> : <FaFolderOpen style={{ marginRight: 6 }} />}
                        {item.c_type}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#222', fontWeight: 500 }}>
                        {item.su_name && item.su_name.trim() !== ''
                          ? item.su_name
                          : (item.coursename && item.coursename.trim() !== '' ? item.coursename : '-')}
                      </td>
                      <td style={{ padding: '10px 8px', color: '#555' }}>{item.des}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {item.file_path ? (
                          <a
                            href={`http://localhost:3000/${item.file_path.replace('\\', '/')}`}
                            target="_blank"
                            rel="noopener noreferrer"
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Materials; 