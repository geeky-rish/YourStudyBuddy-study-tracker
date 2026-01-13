import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus } from 'react-icons/fa';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        color: '#3b82f6',
    });

    const { name, color } = formData;

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const { data } = await axios.get('/api/subjects', config);
            setSubjects(data);
        } catch (error) {
            toast.error('Could not fetch subjects');
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const { data } = await axios.post('/api/subjects', formData, config);
            setSubjects([...subjects, data]);
            setFormData({ name: '', color: '#3b82f6' });
            toast.success('Subject added');
        } catch (error) {
            toast.error('Could not add subject');
        }
    };

    const deleteSubject = async (id) => {
        if (!window.confirm('Are you sure? This will delete all sessions associated with this subject.')) return;

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            await axios.delete(`/api/subjects/${id}`, config);
            setSubjects(subjects.filter((sub) => sub._id !== id));
            toast.success('Subject deleted');
        } catch (error) {
            toast.error('Could not delete subject');
        }
    };

    return (
        <div className="container" style={{ marginTop: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>

                {/* Form */}
                <div className="card">
                    <h3>Add Subject</h3>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label>Subject Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Color Tag</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    style={{ width: '50px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
                                />
                                <div style={{ alignSelf: 'center', color: '#aaa' }}>{color}</div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-block" style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                            <FaPlus /> Add Subject
                        </button>
                    </form>
                </div>

                {/* List */}
                <div>
                    <h3>Your Subjects</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        {subjects.length > 0 ? (
                            subjects.map((sub) => (
                                <div key={sub._id} className="card" style={{ borderLeft: `5px solid ${sub.color}`, padding: '15px', position: 'relative' }}>
                                    <h4 style={{ margin: 0 }}>{sub.name}</h4>
                                    <button
                                        onClick={() => deleteSubject(sub._id)}
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: '#ef4444' }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No subjects added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subjects;
