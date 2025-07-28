import api from '../../services/authService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBookOpen, FaPlus, FaSearch } from 'react-icons/fa';
import ConfirmDialog from './ConfirmDialog';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const SubjectsManagement = () => {
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', description: '', created: '', streamId: '' });
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const isMobile = window.innerWidth <= 900;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const classRes = await api.get('http://localhost:3000/api/class/display');
        setClasses(classRes.data);
        await fetchStreams();
        await fetchSubjects();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await api.get('http://localhost:3000/api/stream/display');
      console.log('Fetched streams:', response.data);
      if (Array.isArray(response.data)) {
        response.data.forEach((s, i) => {
          console.log(`Stream[${i}]:`, s);
        });
      }
      setStreams(response.data);
    } catch (error) {
      console.error('Failed to fetch streams:', error);
      setStreams([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get('http://localhost:3000/api/subject/subject-display');
      console.log('Fetched subjects:', response.data);
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setSubjects([]);
    }
  };

  const openModal = (item) => {
    if (streams.length === 0) {
      toast('Please wait for streams to load before editing.');
      return;
    }

    setEditItem(item);

    // Find the matching stream and class IDs from item
    let streamId = '';
    let classId = '';
    if (item.stream_info) {
      streamId = item.stream_info.sid ? item.stream_info.sid.toString() : '';
      classId = item.stream_info.class_info?.cls_id ? item.stream_info.class_info.cls_id.toString() : '';
    } else {
      // fallback for legacy data
      streamId = item.sid ? item.sid.toString() : '';
      classId = item.class_info?.cls_id ? item.class_info.cls_id.toString() : '';
    }

    // Convert date from dd-mm-yyyy to yyyy-mm-dd for the date input
    const formatDateForInput = (dateStr) => {
      if (!dateStr) return '';
      if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
        return dateStr;
      }
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      }
      return dateStr;
    };

    const formattedDate = formatDateForInput(item.cdate);

    setForm({
      code: item.sub_code || '',
      name: item.su_name || '',
      description: item.des || '',
      created: formattedDate,
      streamId: streamId,
    });
    setSelectedClass(classId); // Set the class dropdown directly
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return '';
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleAddOrUpdate = async () => {
    const stream = streams.find(s => String(s.sid) === String(form.streamId));
    const classObj = classes.find(c => String(c.cls_id) === String(selectedClass));
    if (!form.code || !form.name || !form.description || !form.created || !stream || !selectedClass || !stream.sid || !classObj || !classObj.cls_id) {
      setErrorMessage(`All fields are required. Debug info: code=${form.code}, name=${form.name}, description=${form.description}, created=${form.created}, stream=${!!stream}, selectedClass=${selectedClass}, stream.sid=${stream?.sid}, classObj.cls_id=${classObj?.cls_id}`);
      return;
    }
    const payload = {
      sub_code: form.code,
      su_name: form.name,
      des: form.description,
      cdate: formatDateForAPI(form.created),
      stream_id: stream.sid,
      class_id: classObj.cls_id,
    };
    console.log('Payload to be sent:', payload);
    setErrorMessage(''); // Clear error if validation passes
    try {
      if (editItem) {
        // Edit mode
        await api.put(`http://localhost:3000/api/subject/subject-edit/${editItem.su_id || editItem.id}`, payload);
      } else {
        // Add mode
        await api.post('http://localhost:3000/api/subject/subject-add', payload);
      }
      fetchSubjects();
      setShowModal(false);
      setForm({ code: '', name: '', description: '', created: '', streamId: '' });
      setEditItem(null);
    } catch (err) {
      setErrorMessage('Error saving subject. Please try again.');
      console.error('Error saving subject:', err);
    }
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`http://localhost:3000/api/subject/delete/${pendingDeleteId}`);
      fetchSubjects();
      toast.success('Subject deleted successfully!');
    } catch (err) {
      console.error('Error deleting subject:', err);
      toast.error('Failed to delete subject. Please try again.');
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const filteredSubjects = subjects.filter(s =>
    s.su_name.toLowerCase().includes(search.toLowerCase()) &&
    (
      !selectedClass || String(s.stream_info?.class_info?.cls_id) === String(selectedClass)
    ) &&
    (
      !selectedStream || String(s.stream_info?.sid) === String(selectedStream)
    )
  );

  // Filter streams by selected class
  const filteredStreams = selectedClass
    ? streams.filter(s =>
        s.class_info && s.class_info.cls_id && s.class_info.cls_id.toString() === selectedClass
      )
    : streams;

  // Helper to get unique streams by sname
  const getUniqueStreams = () => {
    const seen = new Set();
    return streams.filter(stream => {
      const sname = (stream.sname || '').trim().toLowerCase();
      const classId = String(stream.class_details?.cls_id || stream.class_id || stream.class_info?.cls_id || '');
      const key = `${sname}__${classId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // When editing, set selectedClass based on the stream/class
  useEffect(() => {
    if (editItem && streams.length && classes.length) {
      const stream = streams.find(s => s.sname === editItem.sname);
      if (stream) {
        const cls = classes.find(c => c.class_name === stream.class_name);
        if (cls) setSelectedClass(cls.cls_id.toString());
      }
    }
  }, [editItem, streams, classes]);

  return (
    <DashboardLayout>
      {!isMobile && (
      <div className="subject-management-header" style={{ padding: '2rem 0 1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaBookOpen size={32} color="#2563eb" />
          <div>
              <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Manage Subjects</h1>
            <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>Add and manage academic subjects</div>
          </div>
        </div>
      </div>
      )}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, maxWidth: 1100, margin: '0 auto 24px auto' }}>
          {/* Filter/search bar and add button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 18 }} />
              <input
                type="text"
                placeholder="Search subjects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '90%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: '1rem',
                  background: '#f9fafb',
                  color: '#1a1a1a',
                  outline: 'none',
                }}
              />
            </div>
            {/* Class dropdown filter */}
            <select
              value={selectedClass}
              onChange={e => {
                setSelectedClass(e.target.value);
                setSelectedStream('');
              }}
              style={{
                padding: '0.7rem 1.2rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: '1rem',
                background: '#f9fafb',
                color: '#1a1a1a',
                outline: 'none',
                minWidth: 160,
                marginLeft: 8
              }}
            >
              <option value=''>All Classes</option>
              {classes.map(cls => (
                <option key={cls.cls_id} value={cls.cls_id}>{cls.class_name}</option>
              ))}
            </select>
            {/* Stream dropdown filter, filtered by selected class */}
            <select
              value={selectedStream}
              onChange={e => setSelectedStream(e.target.value)}
              style={{
                padding: '0.7rem 1.2rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: '1rem',
                background: '#f9fafb',
                color: '#1a1a1a',
                outline: 'none',
                minWidth: 160,
                marginLeft: 8
              }}
              disabled={!selectedClass}
            >
              <option value=''>All Streams</option>
              {getUniqueStreams()
                .filter(stream => !selectedClass || String(stream.class_details?.cls_id) === String(selectedClass))
                .map(stream => (
                  <option key={stream.sid} value={stream.sid}>
                    {(stream.sname || '').trim()}
                  </option>
                ))}
            </select>
            <button
              className="add-stream-btn"
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
              }}
              onClick={() => {
                if (streams.length === 0) {
                  toast('Please wait for streams to load before adding a subject.');
                  return;
                }
                setShowModal(true);
                setEditItem(null);
                setForm({ code: '', name: '', description: '', created: '', streamId: '' });
              }}
            >
              <FaPlus /> Add Subject
            </button>
          </div>
          {/* Count box */}
          <div style={{
            minWidth: 110,
            minHeight: 70,
            background: '#f1f5f9',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0001',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#2563eb',
          }}>
            {subjects.length}
            <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#64748b', marginTop: 2 }}>Total Subjects</div>
          </div>
        </div>
      )}
      {isMobile && (
        <>
          {/* Mobile: Centered heading and subtitle */}
          <div style={{ padding: '1rem 0 1.5rem 0', textAlign: 'center' }}>
            <FaBookOpen size={36} color="#2563eb" style={{ marginBottom: 8 }} />
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb', letterSpacing: 0.2 }}>Manage Subjects</h1>
            <div style={{ color: '#6b7280', fontSize: '1.08rem', fontWeight: 500, marginTop: 2 }}>Add, assign, and manage academic subjects</div>
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            marginBottom: '1rem',
            padding: '0 20px',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div className="search-box" style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '350px'
            }}>
              <FaSearch style={{ 
                position: 'absolute', 
                left: 16, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#a0aec0', 
                fontSize: 18, 
                pointerEvents: 'none' 
              }} />
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: '1rem',
                background: '#f9fafb',
                color: '#1a1a1a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
            {/* Class dropdown filter for mobile */}
            <select
              value={selectedClass}
              onChange={e => {
                setSelectedClass(e.target.value);
                setSelectedStream('');
              }}
              style={{
                width: '100%',
                maxWidth: '350px',
                padding: '0.75rem 1.2rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: '1rem',
                background: '#f9fafb',
                color: '#1a1a1a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value=''>All Classes</option>
              {classes.map(cls => (
                <option key={cls.cls_id} value={cls.cls_id}>{cls.class_name}</option>
              ))}
            </select>
            {/* Stream dropdown filter for mobile */}
            <select
              value={selectedStream}
              onChange={e => setSelectedStream(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '350px',
                padding: '0.75rem 1.2rem',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: '1rem',
                background: '#f9fafb',
                color: '#1a1a1a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              disabled={!selectedClass}
            >
              <option value=''>All Streams</option>
              {getUniqueStreams()
                .filter(stream => !selectedClass || String(stream.class_details?.cls_id) === String(selectedClass))
                .map(stream => (
                  <option key={stream.sid} value={stream.sid}>
                    {(stream.sname || '').trim()}
                  </option>
                ))}
            </select>
          <button
            className="add-stream-btn"
              style={{ 
                width: '100%',
                maxWidth: '350px',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                borderRadius: 10,
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 8px #2563eb22',
                cursor: 'pointer'
              }}
            onClick={() => {
              if (streams.length === 0) {
                toast('Please wait for streams to load before adding a subject.');
                return;
              }
              setShowModal(true);
              setEditItem(null);
              setForm({ code: '', name: '', description: '', created: '', streamId: '' });
            }}
          >
            <FaPlus /> Add Subject
          </button>
          <div style={{
              width: '100%',
              maxWidth: '350px',
            minHeight: 70,
            background: '#f1f5f9',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0001',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#2563eb',
              padding: '1rem'
          }}>
            {subjects.length}
            <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#64748b', marginTop: 2 }}>Total Subjects</div>
          </div>
        </div>
        </>
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading subjects...</p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              width: '100%',
              maxWidth: '350px'
            }}>
          {filteredSubjects.map(s => (
                <div key={s.su_id || s.id} style={{
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
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#1a1a1a'
                      }}>
                        {s.su_name}
                      </h3>
                      <div style={{
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        marginTop: '0.25rem'
                      }}>
                        Code: {s.sub_code}
                </div>
              </div>
                    <div style={{
                      display: 'flex',
                      gap: 8
                    }}>
                      <button
                        onClick={() => openModal(s)}
                        style={{
                          background: '#2563eb',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                    Edit
                  </button>
                      <button
                        onClick={() => handleDelete(s.su_id || s.id)}
                        style={{
                          background: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                    Delete
                  </button>
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
                      <span style={{ fontWeight: 500 }}>Class:</span>
                      <span>{s.class_name || s.class_info?.class_name || s.stream_info?.class_info?.class_name || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Stream:</span>
                      <span>{s.stream_info?.sname || s.stream_name || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Created:</span>
                      <span>{s.cdate}</span>
                    </div>
                    {s.des && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 500 }}>Description:</span>
                        <span>{s.des}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isMobile && (
        <div className="stream-table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading subjects...</p>
            </div>
          ) : (
            <table className="stream-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Class</th>
                  <th>Stream</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map(s => (
                  <tr key={s.su_id || s.id}>
                    <td>{s.sub_code}</td>
                    <td>{s.su_name}</td>
                    <td>
                      <div style={{
                        background: '#e8f0fe', color: '#2563eb', fontWeight: 600,
                        padding: '2px 10px', borderRadius: 8, fontSize: '0.98rem', display: 'inline-block'
                      }}>
                        {s.class_name || s.class_info?.class_name || s.stream_info?.class_info?.class_name || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{
                        background: '#e8f0fe', color: '#2563eb', fontWeight: 600,
                        padding: '2px 10px', borderRadius: 8, fontSize: '0.98rem', display: 'inline-block'
                      }}>
                        {s.stream_info?.sname || s.stream_name || 'N/A'}
                      </div>
                    </td>
                    <td>{s.des}</td>
                    <td>{s.cdate}</td>
                    <td>
                      <div className="stream-action-buttons">
                        <button className="stream-edit-btn" onClick={() => openModal(s)}>Edit</button>
                        <button className="stream-delete-btn" onClick={() => handleDelete(s.su_id || s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showModal && (
        <div className="stream-modal-overlay">
          <div className="stream-modal">
            <div className="stream-modal-header">
              <h2>{editItem ? 'Edit Subject' : 'Add Subject'}</h2>
              <button className="stream-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div>
              {errorMessage && (
                <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>
              )}
              <input
                name="code"
                placeholder="Subject Code"
                value={form.code}
                onChange={handleInputChange}
              />
              <input
                name="name"
                placeholder="Subject Name"
                value={form.name}
                onChange={handleInputChange}
              />
              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleInputChange}
              />

              {/* Class Dropdown */}
              <label style={{ fontWeight: 500, marginBottom: 4 }}>Class</label>
              <select
                name="classId"
                value={selectedClass}
                onChange={e => { setSelectedClass(e.target.value); setForm(prev => ({ ...prev, streamId: '' })); }}
                style={{
                  width: '100%',
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e1e1e1',
                  borderRadius: 8,
                  fontSize: '1rem',
                  background: '#fff',
                  color: '#1a1a1a',
                  outline: 'none',
                }}
                required
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={String(cls.cls_id)} value={String(cls.cls_id)}>{cls.class_name}</option>
                ))}
              </select>

              {/* Stream Dropdown */}
              <label style={{ fontWeight: 500, marginBottom: 4 }}>Stream</label>
              <select
                name="streamId"
                value={form.streamId}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e1e1e1',
                  borderRadius: 8,
                  fontSize: '1rem',
                  background: '#fff',
                  color: '#1a1a1a',
                  outline: 'none',
                }}
                required
                disabled={!selectedClass}
              >
                <option value="">Select Stream</option>
                {streams
                  .filter(s => String(s.class_details?.cls_id) === String(selectedClass))
                  .map(stream => (
                    <option key={String(stream.sid)} value={String(stream.sid)}>
                      {stream.sname}
                    </option>
                  ))}
              </select>

              <label style={{ fontWeight: 500 }}>Created Date</label>
              <input
                type="date"
                name="created"
                value={form.created}
                onChange={handleInputChange}
                required
              />

              <button className="add-stream-btn" onClick={handleAddOrUpdate}>
                {editItem ? 'Save Changes' : 'Add Subject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Subject?"
        message="Are you sure you want to delete this subject? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </DashboardLayout>
  );
};

export default SubjectsManagement;
