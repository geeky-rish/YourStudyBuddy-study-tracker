import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const History = () => {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const { data } = await axios.get('/api/sessions', config);
            setSessions(data);
        } catch (error) {
            toast.error('Could not fetch sessions');
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container" style={{ marginTop: '30px' }}>
            <h2>Study History</h2>
            {sessions.length > 0 ? (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {sessions.map((session) => (
                        <div key={session._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `5px solid ${session.subject.color}` }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{session.subject.name}</h4>
                                <div style={{ fontSize: '0.9rem', color: '#a0a0a0', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                                    <FaCalendarAlt /> {formatDate(session.date)}
                                </div>
                                {session.notes && <p style={{ marginTop: '5px', fontStyle: 'italic', fontSize: '0.9rem' }}>"{session.notes}"</p>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <FaClock color="#3b82f6" /> {session.duration} min
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No study sessions recorded yet.</p>
            )}
        </div>
    );
};

export default History;
