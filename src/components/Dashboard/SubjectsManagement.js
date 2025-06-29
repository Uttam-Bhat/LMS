import axios from 'axios';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './StreamManagement.css';

const SubjectsManagement = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', created: '', streamId: '' });
  const [streams, setStreams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
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
      const response = await axios.get('http://localhost:3000/api/stream/display');
      console.log('Fetched streams:', response.data);
      setStreams(response.data);
    } catch (error) {
      console.error('Failed to fetch streams:', error);
      setStreams([]);
    }
  };

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

  const openModal = (item) => {
    if (streams.length === 0) {
      alert('Please wait for streams to load before editing.');
      return;
    }
    
    console.log('Opening modal for item:', item);
    console.log('Available streams:', streams);
    
    setEditItem(item);
    
    // Find the matching stream - try multiple approaches
    let streamMatch = streams.find(s => s.sname === item.sname);
    
    // If not found by exact name, try case-insensitive match
    if (!streamMatch) {
      streamMatch = streams.find(s => 
        s.sname && item.sname && 
        s.sname.toLowerCase() === item.sname.toLowerCase()
      );
    }
    
    // If still not found, try matching by stream ID if available
    if (!streamMatch && item.streamId) {
      streamMatch = streams.find(s => s.sid === item.streamId);
    }
    
    console.log('Found stream match:', streamMatch);
    
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
      name: item.su_name || '',
      description: item.des || '',
      created: formattedDate,
      streamId: streamMatch ? streamMatch.sid.toString() : '',
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    const stream = streams.find(s => s.sid === parseInt(form.streamId));
    // Convert yyyy-mm-dd to dd-mm-yyyy
    const formatDateForAPI = (dateStr) => {
      if (!dateStr) return '';
      const [yyyy, mm, dd] = dateStr.split('-');
      return `${dd}-${mm}-${yyyy}`;
    };
    const payload = {
      su_name: form.name,
      des: form.description,
      cdate: formatDateForAPI(form.created),
      sname: stream ? stream.sname : '',
    };

    try {
      if (editItem) {
        // Edit mode
        await axios.put(`http://localhost:3000/api/subject/edit/${editItem.su_id || editItem.id}`, payload);
      } else {
        // Add mode
        await axios.post('http://localhost:3000/api/subject/add', payload);
      }
      fetchSubjects();
      setShowModal(false);
      setForm({ name: '', description: '', created: '', streamId: '' });
      setEditItem(null);
    } catch (err) {
      console.error('Error saving subject:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting subject with ID:', id);
      await axios.delete(`http://localhost:3000/api/subject/delete/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error('Error deleting subject:', err);
      alert('Failed to delete subject. Please try again.');
    }
  };

  const filteredSubjects = subjects.filter(s =>
    s.su_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="stream-management">
        <div className="stream-header">
          <h1>Manage Subjects</h1>
          <button className="add-stream-btn" onClick={() => {
            if (streams.length === 0) {
              alert('Please wait for streams to load before adding a subject.');
              return;
            }
            setShowModal(true);
            setEditItem(null);
            setForm({ name: '', description: '', created: '', streamId: '' });
          }}>
            Add Subject
          </button>
        </div>

        <div className="stream-filters">
          <div className="stream-search-box">
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="stream-table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading subjects...</p>
            </div>
          ) : (
            <table className="stream-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Stream</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map(s => (
                  <tr key={s._id || s.id}>
                    <td>{s.su_name}</td>
                    <td>{s.des}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          background: '#e8f0fe', color: '#2563eb', fontWeight: 600,
                          padding: '2px 10px', borderRadius: 8, fontSize: '0.98rem'
                        }}>
                          {s.sname || 'N/A'}
                        </div>
                      </div>
                    </td>
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

        {showModal && (
          <div className="stream-modal-overlay">
            <div className="stream-modal">
              <div className="stream-modal-header">
                <h2>{editItem ? 'Edit Subject' : 'Add Subject'}</h2>
                <button className="stream-close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div>
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
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream.sid} value={stream.sid}>
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
      </div>
    </DashboardLayout>
  );
};

export default SubjectsManagement;
