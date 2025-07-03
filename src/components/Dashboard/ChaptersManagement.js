import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

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
      const response = await axios.get('http://localhost:3000/api/subject/display');
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
    
    const payload = {
      ch_name: form.ch_name,
      des: form.des,
      cdate: formatDateForAPI(form.cdate),
      su_name: form.su_name,
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

  // Unique classes for dropdown
  const uniqueClasses = classes.filter((cls, idx, arr) =>
    arr.findIndex(c => c.class_name === cls.class_name) === idx
  );
  // Unique streams for dropdown, filtered by selected class
  const filteredStreams = selectedClass
    ? streams.filter(s => {
        const cls = classes.find(c => c.class_name === s.class_name && c.cls_id.toString() === selectedClass);
        return !!cls;
      })
    : streams;
  const uniqueStreams = filteredStreams.filter((stream, idx, arr) =>
    arr.findIndex(s => s.sname === stream.sname) === idx
  );
  // Unique subjects for dropdown, filtered by selected stream
  const filteredSubjects = selectedStream
    ? subjects.filter(sub => sub.sname === (streams.find(s => s.sid.toString() === selectedStream)?.sname))
    : subjects;
  const uniqueSubjects = filteredSubjects.filter((sub, idx, arr) =>
    arr.findIndex(s => s.su_name === sub.su_name) === idx
  );
  // When editing, set selectedClass and selectedStream based on subject
  useEffect(() => {
    if (editItem && streams.length && classes.length && subjects.length) {
      const subject = subjects.find(s => s.su_name === editItem.su_name);
      if (subject) {
        const stream = streams.find(s => s.sname === subject.sname);
        if (stream) {
          setSelectedStream(stream.sid.toString());
          const cls = classes.find(c => c.class_name === stream.class_name);
          if (cls) setSelectedClass(cls.cls_id.toString());
        }
      }
    }
  }, [editItem, streams, classes, subjects]);

  return (
    <DashboardLayout>
      <div className="stream-management">
        <div className="stream-header">
          <h1>Manage Chapters</h1>
          <button className="add-stream-btn" onClick={() => {
            if (subjects.length === 0) {
              alert('Please wait for subjects to load before adding a chapter.');
              return;
            }
            setShowModal(true);
            setEditItem(null);
            setForm({ ch_name: '', des: '', cdate: '', su_name: '' });
          }}>
            Add Chapter
          </button>
        </div>

        <div className="stream-filters">
          <div className="stream-search-box">
            <input
              type="text"
              placeholder="Search chapters..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
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
                  <th>Name</th>
                  <th>Description</th>
                  <th>Subject</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredChapters.map(s => (
                  <tr key={s._id || s.id}>
                    <td>{s.ch_name}</td>
                    <td>{s.des}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          background: '#e8f0fe', color: '#2563eb', fontWeight: 600,
                          padding: '2px 10px', borderRadius: 8, fontSize: '0.98rem'
                        }}>
                          {s.su_name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>{s.cdate}</td>
                    <td>
                      <div className="stream-action-buttons">
                        <button className="stream-edit-btn" onClick={() => openModal(s)}>Edit</button>
                        <button className="stream-delete-btn" onClick={() => handleDelete(s.ch_id || s.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                  {uniqueClasses.map(cls => (
                    <option key={cls.cls_id} value={cls.cls_id}>{cls.class_name}</option>
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
                  {uniqueStreams.map(stream => (
                    <option key={stream.sid} value={stream.sid}>{stream.sname}</option>
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
                  {uniqueSubjects.map(sub => (
                    <option key={sub.su_id} value={sub.su_name}>{sub.su_name}</option>
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
      </div>
    </DashboardLayout>
  );
};

export default ChaptersManagement; 