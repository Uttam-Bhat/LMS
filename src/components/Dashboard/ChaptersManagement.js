import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBook, FaPlus, FaSearch } from 'react-icons/fa';
import api from '../../services/authService';
import ConfirmDialog from './ConfirmDialog';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

// Utility: Convert date from dd-mm-yyyy to yyyy-mm-dd for the date input
function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  // Check if date is already in yyyy-mm-dd format
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
    return dateStr;
  }
  // Convert from dd-mm-yyyy to yyyy-mm-dd
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return dateStr;
}

const ChaptersManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ ch_name: '', des: '', cdate: '', su_name: '' });
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const isMobile = window.innerWidth <= 900;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch classes
        const classRes = await api.get('http://localhost:3000/api/class/display');
        setClasses(classRes.data);
        // Fetch streams
        const streamRes = await api.get('http://localhost:3000/api/stream/display');
        setStreams(streamRes.data);
        await fetchSubjects();
        await fetchChapters();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('http://localhost:3000/api/subject/subject-display');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setSubjects([]);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await api.get('http://localhost:3000/api/chapter/display');
      setChapters(response.data);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
      setChapters([]);
    }
  };

  const openModal = (item) => {
    if (subjects.length === 0) {
      toast('Please wait for subjects to load before editing.');
      return;
    }

    setEditItem(item);

    // Use nested structure for subject, stream, and class
    const su_name = item.subject_info?.su_name || '';
    const stream_id = item.subject_info?.stream_info?.sid ? String(item.subject_info.stream_info.sid) : '';
    const class_id = item.subject_info?.stream_info?.class_info?.cls_id ? String(item.subject_info.stream_info.class_info.cls_id) : '';
    const formattedDate = formatDateForInput(item.cdate);

    setSelectedClass(class_id);
    setSelectedStream(stream_id);
    setForm({
      ch_name: item.ch_name || '',
      des: item.des || '',
      cdate: formattedDate,
      su_name,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    // Convert yyyy-mm-dd to dd-mm-yyyy
    const formatDateForAPI = (dateStr) => {
      if (!dateStr) return '';
      const [yyyy, mm, dd] = dateStr.split('-');
      return `${dd}-${mm}-${yyyy}`;
    };

    const subjectObj = subjects.find(s => s.su_name === form.su_name && s.stream_info?.sid?.toString() === selectedStream);
    const streamObj = streams.find(s => String(s.sid) === String(selectedStream));
    const classObj = classes.find(c => String(c.cls_id) === String(selectedClass));

    if (!form.ch_name || !form.des || !form.cdate || !subjectObj || !streamObj || !classObj) {
      toast('All fields are required.');
      return;
    }

    // Only send changed fields for update
    let payload = {
      ch_name: form.ch_name,
      des: form.des,
      cdate: formatDateForAPI(form.cdate),
      subject_id: subjectObj.su_id,
      stream_id: streamObj.sid,
      class_id: classObj.cls_id,
    };

    if (editItem) {
      // Compare with original values and only include changed fields
      const orig = editItem;
      const origSubjectId = orig.subject_info?.su_id;
      const origStreamId = orig.subject_info?.stream_info?.sid;
      const origClassId = orig.subject_info?.stream_info?.class_info?.cls_id;
      const origDate = formatDateForAPI(orig.cdate);
      payload = {};
      if (form.ch_name !== orig.ch_name) payload.ch_name = form.ch_name;
      if (form.des !== orig.des) payload.des = form.des;
      if (formatDateForAPI(form.cdate) !== origDate) payload.cdate = formatDateForAPI(form.cdate);
      if (subjectObj.su_id !== origSubjectId) payload.subject_id = subjectObj.su_id;
      if (streamObj.sid !== origStreamId) payload.stream_id = streamObj.sid;
      if (classObj.cls_id !== origClassId) payload.class_id = classObj.cls_id;
      if (Object.keys(payload).length === 0) {
        toast('No changes detected.');
        return;
      }
    }

    try {
      if (editItem) {
        // Edit mode
        await api.put(`http://localhost:3000/api/chapter/edit/${editItem.ch_id}`, payload);
      } else {
        // Add mode
        await api.post('http://localhost:3000/api/chapter/add', payload);
      }
      fetchChapters();
      setShowModal(false);
      setForm({ ch_name: '', des: '', cdate: '', su_name: '' });
      setEditItem(null);
      setSelectedClass('');
      setSelectedStream('');
    } catch (err) {
      console.error('Error saving chapter:', err);
      toast.error('Failed to save chapter. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`http://localhost:3000/api/chapter/delete/${pendingDeleteId}`);
      fetchChapters();
      toast.success('Chapter deleted successfully!');
    } catch (err) {
      console.error('Error deleting chapter:', err);
      toast.error('Failed to delete chapter. Please try again.');
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  // Filter chapters by selected subject
  const filteredChapters = chapters.filter(chap =>
    (!selectedClass || String(chap.subject_info?.stream_info?.class_info?.cls_id) === String(selectedClass)) &&
    (!selectedStream || String(chap.subject_info?.stream_info?.sid) === String(selectedStream)) &&
    (!selectedSubject || String(chap.su_id) === String(selectedSubject)) &&
    (chap.ch_name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Build uniqueClasses from subjects' stream_info.class_info
  const uniqueClasses = [];
  const classIds = new Set();
  subjects.forEach(s => {
    const cls = s.stream_info?.class_info;
    if (cls && !classIds.has(cls.cls_id)) {
      uniqueClasses.push(cls);
      classIds.add(cls.cls_id);
    }
  });
  // Build availableStreams for dropdown from streams for selected class using class_details.cls_id
  const availableStreams = streams.filter(
    stream => String(stream.class_details?.cls_id) === String(selectedClass)
  );
  // Build availableSubjects for dropdown from subjects for selected stream
  const availableSubjects = subjects
    .filter(s => s.stream_info?.sid?.toString() === selectedStream)
    .filter((sub, idx, arr) => sub && arr.findIndex(s2 => s2.su_id === sub.su_id) === idx);

  return (
    <DashboardLayout>
      {!isMobile && (
        <div className="chapter-management-header" style={{ padding: '2rem 0 1rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaBook size={32} color="#2563eb" />
            <div>
              <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Manage Chapters</h1>
              <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>Add and manage academic chapters</div>
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, maxWidth: 1100, margin: '0 auto 24px auto' }}>
          {/* Filter/search bar and add button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
            <div style={{ position: 'relative', flex: 1,justifyContent:'space-between'}}>
              <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 18 }} />
              <input
                type="text"
                placeholder="Search chapters..."
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
                }}
              />
            </div>
            {/* Class dropdown filter */}
            <select
              value={selectedClass}
              onChange={e => {
                setSelectedClass(e.target.value);
                setSelectedStream('');
                setSelectedSubject('');
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
              onChange={e => {
                setSelectedStream(e.target.value);
                setSelectedSubject('');
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
              disabled={!selectedClass}
            >
              <option value=''>All Streams</option>
              {streams.filter(stream => !selectedClass || String(stream.class_details?.cls_id) === String(selectedClass)).map(stream => (
                <option key={stream.sid} value={stream.sid}>{(stream.sname || '').trim()}</option>
              ))}
            </select>
            {/* Subject dropdown filter, filtered by selected stream */}
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
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
              disabled={!selectedStream}
            >
              <option value=''>All Subjects</option>
              {subjects.filter(sub => !selectedStream || String(sub.stream_info?.sid) === String(selectedStream)).map(sub => (
                <option key={sub.su_id} value={sub.su_id}>{sub.su_name}</option>
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
                if (subjects.length === 0) {
                  toast('Please wait for subjects to load before adding a chapter.');
                  return;
                }
                setShowModal(true);
                setEditItem(null);
                setForm({ ch_name: '', des: '', cdate: '', su_name: '' });
              }}
            >
              <FaPlus /> Add Chapter
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
            {chapters.length}
            <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#64748b', marginTop: 2 }}>Total Chapters</div>
          </div>
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
            <FaBook size={28} color="#2563eb" />
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ margin: 0, fontWeight: 700, fontSize: '1.5rem', color: '#2563eb' }}>Manage Chapters</h1>
              <div style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>Add and manage academic chapters</div>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', fontSize: 16 }} />
            <input
              type="text"
              placeholder="Search chapters..."
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

          {/* Class Dropdown */}
          <select
            value={selectedClass}
            onChange={e => {
              setSelectedClass(e.target.value);
              setSelectedStream('');
              setSelectedSubject('');
            }}
            style={{
              width: '100%',
              maxWidth: '350px',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: '1rem',
              background: '#fff',
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

          {/* Stream Dropdown */}
          <select
            value={selectedStream}
            onChange={e => {
              setSelectedStream(e.target.value);
              setSelectedSubject('');
            }}
            style={{
              width: '100%',
              maxWidth: '350px',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: '1rem',
              background: '#fff',
              color: '#1a1a1a',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            disabled={!selectedClass}
          >
            <option value=''>All Streams</option>
            {streams.filter(stream => !selectedClass || String(stream.class_details?.cls_id) === String(selectedClass)).map(stream => (
              <option key={stream.sid} value={stream.sid}>{(stream.sname || '').trim()}</option>
            ))}
          </select>

          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '350px',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: '1rem',
              background: '#fff',
              color: '#1a1a1a',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            disabled={!selectedStream}
          >
            <option value=''>All Subjects</option>
            {subjects.filter(sub => !selectedStream || String(sub.stream_info?.sid) === String(selectedStream)).map(sub => (
              <option key={sub.su_id} value={sub.su_id}>{sub.su_name}</option>
            ))}
          </select>

          {/* Add Chapter Button */}
          <button
            style={{
              width: '100%',
              maxWidth: '350px',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              borderRadius: 10,
              padding: '0.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 2px 8px #2563eb22',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (subjects.length === 0) {
                toast('Please wait for subjects to load before adding a chapter.');
                return;
              }
              setShowModal(true);
              setEditItem(null);
              setForm({ ch_name: '', des: '', cdate: '', su_name: '' });
            }}
          >
            <FaPlus /> Add Chapter
          </button>

          {/* Total Chapters Box */}
          <div style={{
            width: '100%',
            maxWidth: '350px',
            background: '#f1f5f9',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            boxShadow: '0 2px 8px #0001',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#2563eb',
          }}>
            {chapters.length}
            <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#64748b', marginTop: 4 }}>Total Chapters</div>
          </div>
        </div>
      )}
      {!isMobile && (
        <div className="stream-table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading chapters...</p>
            </div>
          ) : (
            <table className="stream-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Stream</th>
                  <th>Subject</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChapters.map(chapter => {
                  // Use the new nested structure from backend
                  const subjectInfo = chapter.subject_info || {};
                  const streamInfo = subjectInfo.stream_info || {};
                  const classInfo = streamInfo.class_info || {};

                  return (
                    <tr key={chapter.ch_id}>
                      <td>{classInfo.class_name || 'N/A'}</td>
                      <td>{streamInfo.sname || 'N/A'}</td>
                      <td>{subjectInfo.su_name || 'N/A'}</td>
                      <td>{chapter.ch_name}</td>
                      <td>{chapter.des}</td>
                      <td>{chapter.cdate}</td>
                      <td>
                        <div className="stream-action-buttons">
                          <button className="stream-edit-btn" onClick={() => openModal(chapter)}>Edit</button>
                          <button className="stream-delete-btn" onClick={() => handleDelete(chapter.ch_id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
          gap: 16
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading chapters...</p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              width: '100%',
              maxWidth: '350px'
            }}>
              {filteredChapters.map(chapter => {
                // Use the new nested structure from backend
                const subjectInfo = chapter.subject_info || {};
                const streamInfo = subjectInfo.stream_info || {};
                const classInfo = streamInfo.class_info || {};

                return (
                  <div key={chapter.ch_id} style={{
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
                        color: '#1a1a1a'
                      }}>
                        {chapter.ch_name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        gap: 8
                      }}>
                        <button
                          onClick={() => openModal(chapter)}
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
                          onClick={() => handleDelete(chapter.ch_id)}
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
                      <span>{classInfo.class_name || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Stream:</span>
                      <span>{streamInfo.sname || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Subject:</span>
                      <span>{subjectInfo.su_name || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Created:</span>
                      <span>{chapter.cdate}</span>
                    </div>
                    {chapter.des && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 500 }}>Description:</span>
                        <span>{chapter.des}</span>
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

      {showModal && (
        <div className="stream-modal-overlay">
          <div className="stream-modal">
            <div className="stream-modal-header">
              <h2>{editItem ? 'Edit Chapter' : 'Add Chapter'}</h2>
              <button className="stream-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div>
              <input
                name="ch_name"
                placeholder="Chapter Name"
                value={form.ch_name}
                onChange={handleInputChange}
              />
              <input
                name="des"
                placeholder="Description"
                value={form.des}
                onChange={handleInputChange}
              />

              {/* Class Dropdown */}
              <label style={{ fontWeight: 500, marginBottom: 4 }}>Class</label>
              <select
                name="classId"
                value={selectedClass}
                onChange={e => { setSelectedClass(e.target.value); setSelectedStream(''); setForm(prev => ({ ...prev, su_name: '' })); }}
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
                value={selectedStream}
                onChange={e => { setSelectedStream(e.target.value); setForm(prev => ({ ...prev, su_name: '' })); }}
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
                {availableStreams.map(stream => (
                  <option key={String(stream.sid)} value={String(stream.sid)}>{stream.sname}</option>
                ))}
              </select>
              {/* Subject Dropdown */}
              <label style={{ fontWeight: 500, marginBottom: 4 }}>Subject</label>
              <select
                name="su_name"
                value={form.su_name}
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
                disabled={!selectedStream}
              >
                <option value="">Select Subject</option>
                {availableSubjects.map(sub => (
                  <option key={String(sub.su_id)} value={sub.su_name}>{sub.su_name}</option>
                ))}
              </select>

              <label style={{ fontWeight: 500 }}>Created Date</label>
              <input
                type="date"
                name="cdate"
                value={form.cdate}
                onChange={handleInputChange}
                required
              />

              <button className="add-stream-btn" onClick={handleAddOrUpdate}>
                {editItem ? 'Save Changes' : 'Add Chapter'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Chapter?"
        message="Are you sure you want to delete this chapter? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
      />
    </DashboardLayout>
  );
};

export default ChaptersManagement; 