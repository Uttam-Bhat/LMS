import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';
import { FaBook, FaSearch, FaPlus } from 'react-icons/fa';

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch classes
        const classRes = await axios.get('http://localhost:3000/api/class/display');
        setClasses(classRes.data);
        // Fetch streams
        const streamRes = await axios.get('http://localhost:3000/api/stream/display');
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
      const response = await axios.get('http://localhost:3000/api/subject/subject-display');
      console.log('Fetched subjects:', response.data);
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setSubjects([]);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/chapter/display');
      console.log('Fetched chapters:', response.data);
      setChapters(response.data);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
      setChapters([]);
    }
  };

  const openModal = (item) => {
    if (subjects.length === 0) {
      alert('Please wait for subjects to load before editing.');
      return;
    }
    
    console.log('Opening modal for item:', item);
    console.log('Available subjects:', subjects);
    
    setEditItem(item);
    
    // Find the matching subject
    let subjectMatch = subjects.find(s => s.su_name === item.su_name);
    
    // If not found by exact name, try case-insensitive match
    if (!subjectMatch) {
      subjectMatch = subjects.find(s => 
        s.su_name && item.su_name && 
        s.su_name.toLowerCase() === item.su_name.toLowerCase()
      );
    }
    
    console.log('Found subject match:', subjectMatch);
    
    // Convert date from dd-mm-yyyy to yyyy-mm-dd for the date input
    const formatDateForInput = (dateStr) => {
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
    };

    const formattedDate = formatDateForInput(item.cdate);
    console.log('Original date:', item.cdate, 'Formatted date:', formattedDate);

    setForm({
      ch_name: item.ch_name || '',
      des: item.des || '',
      cdate: formattedDate,
      su_name: subjectMatch ? subjectMatch.su_name : '',
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
    const streamObj = availableStreams.find(s => String(s.sid) === String(selectedStream));
    const classObj = classes.find(c => String(c.cls_id) === String(selectedClass));

    if (!form.ch_name || !form.des || !form.cdate || !subjectObj || !streamObj || !classObj) {
      alert('All fields are required.');
      return;
    }

    const payload = {
      ch_name: form.ch_name,
      des: form.des,
      cdate: formatDateForAPI(form.cdate),
      subject_id: subjectObj.su_id,
      stream_id: streamObj.sid,
      class_id: classObj.cls_id,
    };

    try {
      if (editItem) {
        // Edit mode
        await axios.put(`http://localhost:3000/api/chapter/edit/${editItem.ch_id || editItem.id}`, payload);
      } else {
        // Add mode
        await axios.post('http://localhost:3000/api/chapter/add', payload);
      }
      fetchChapters();
      setShowModal(false);
      setForm({ ch_name: '', des: '', cdate: '', su_name: '' });
      setEditItem(null);
    } catch (err) {
      console.error('Error saving chapter:', err);
      alert('Failed to save chapter. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting chapter with ID:', id);
      await axios.delete(`http://localhost:3000/api/chapter/delete/${id}`);
      fetchChapters();
    } catch (err) {
      console.error('Error deleting chapter:', err);
      alert('Failed to delete chapter. Please try again.');
    }
  };

  const filteredChapters = chapters.filter(s =>
    s.ch_name.toLowerCase().includes(search.toLowerCase())
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

  // Debug: log availableStreams and selectedClass before rendering
  console.log('Available streams for class', selectedClass, availableStreams);

  // Debug logs for data inspection
  console.log('Chapters:', filteredChapters);
  console.log('Subjects:', subjects);
  console.log('Streams:', streams);
  console.log('Classes:', classes);

  return (
    <DashboardLayout>
      <div className="chapter-management-header" style={{ padding: '2rem 0 1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FaBook size={32} color="#2563eb" />
          <div>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2rem', color: '#2563eb' }}>Manage Chapters</h1>
            <div style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>Add and manage academic chapters</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, maxWidth: 1100, margin: '0 auto 24px auto' }}>
        {/* Filter/search bar and add button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
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
          <select
            value={''}
            onChange={() => {}}
            style={{
              minWidth: 140,
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              fontSize: '1rem',
              background: '#f9fafb',
              color: '#1a1a1a',
              outline: 'none',
            }}
            disabled
          >
            <option>Name A–Z</option>
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
                alert('Please wait for subjects to load before adding a chapter.');
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
              {filteredChapters.map(s => {
                // Find the subject, stream, and class by their IDs (string comparison)
                const subject = subjects.find(sub => String(sub.su_id) === String(s.subject_id));
                const stream = streams.find(str => String(str.sid) === String(s.stream_id));
                const classObj = classes.find(cls => String(cls.cls_id) === String(s.class_id));

                return (
                  <tr key={s._id || s.id}>
                    <td>{classObj?.class_name || 'N/A'}</td>
                    <td>{stream?.sname || 'N/A'}</td>
                    <td>{subject?.su_name || 'N/A'}</td>
                    <td>{s.ch_name}</td>
                    <td>{s.des}</td>
                    <td>{s.cdate}</td>
                    <td>
                      <div className="stream-action-buttons">
                        <button className="stream-edit-btn" onClick={() => openModal(s)}>Edit</button>
                        <button className="stream-delete-btn" onClick={() => handleDelete(s.ch_id || s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

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
    </DashboardLayout>
  );
};

export default ChaptersManagement; 