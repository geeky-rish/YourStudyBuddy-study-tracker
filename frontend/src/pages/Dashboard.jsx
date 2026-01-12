import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { toast } from 'react-toastify';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { FaPlus, FaCheckCircle, FaBullseye } from 'react-icons/fa';

const Dashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [goal, setGoal] = useState({ dailyTargetMinutes: 0 });
    const [loading, setLoading] = useState(true);

    // New session form state
    const [showModal, setShowModal] = useState(false);
    const [newSession, setNewSession] = useState({
        subject: '',
        duration: '',
        notes: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const getTokenConfig = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = getTokenConfig();
            const [sessionsRes, subjectsRes, goalRes] = await Promise.all([
                apiClient.get('/api/sessions', config),
                apiClient.get('/api/subjects', config),
                apiClient.get('/api/goals', config),
            ]);
            setSessions(sessionsRes.data);
            setSubjects(subjectsRes.data);
            if (goalRes.data) setGoal(goalRes.data);
        } catch (error) {
            console.error(error);
            // Goal might be 404 first time, ignore
        }
        setLoading(false);
    };

    const handleAddSession = async (e) => {
        e.preventDefault();
        try {
            const config = getTokenConfig();
            const res = await apiClient.post('/api/sessions', newSession, config);
            setSessions([res.data, ...sessions]);
            setNewSession({ subject: '', duration: '', notes: '' });
            setShowModal(false);
            toast.success('Session Logged!');
        } catch (error) {
            toast.error('Error logging session');
        }
    };

    const handleSetGoal = async () => {
        const target = prompt("Enter daily goal in minutes:", goal.dailyTargetMinutes || 60);
        if (target) {
            try {
                const config = getTokenConfig();
                const res = await apiClient.post('/api/goals', { dailyTargetMinutes: target }, config);
                setGoal(res.data);
                toast.success('Goal updated');
            } catch (error) {
                toast.error('Failed to update goal');
            }
        }
    };

    // Calculations
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);
    const todayMinutes = todaySessions.reduce((acc, curr) => acc + curr.duration, 0);
    const goalProgress = goal.dailyTargetMinutes ? Math.min((todayMinutes / goal.dailyTargetMinutes) * 100, 100) : 0;

    // Pie Chart Data
    const subjectDistribution = sessions.reduce((acc, curr) => {
        const name = curr.subject.name;
        const color = curr.subject.color;
        if (!acc[name]) acc[name] = { name, value: 0, color };
        acc[name].value += curr.duration;
        return acc;
    }, {});
    const pieData = Object.values(subjectDistribution);

    // Bar Chart (Last 7 Days) - Simplified
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toDateString());
        }
        return days;
    };
    const weekDays = getLast7Days();
    const barData = weekDays.map(day => {
        const mins = sessions
            .filter(s => new Date(s.date).toDateString() === day)
            .reduce((acc, s) => acc + s.duration, 0);
        return { day: day.split(' ')[0], minutes: mins };
    });

    if (loading) return <div className="container" style={{ paddingTop: '50px' }}>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '30px', paddingBottom: '50px' }}>
            {/* Header Stats */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #1e1e1e 0%, #252525 100%)' }}>
                    <div>
                        <h4 style={{ color: '#a0a0a0' }}>Today's Study</h4>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{todayMinutes} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>min</span></div>
                    </div>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(#3b82f6 ${goalProgress}%, #333 0)`, position: 'relative', display: 'grid', placeItems: 'center' }}>
                        <div style={{ position: 'absolute', width: '52px', height: '52px', background: '#1e1e1e', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '0.8rem' }}>{Math.round(goalProgress)}%</div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ color: '#a0a0a0', display: 'flex', justifyContent: 'space-between' }}>
                        Daily Goal
                        <button onClick={handleSetGoal} style={{ background: 'none', color: '#3b82f6', fontSize: '0.9rem' }}>Edit</button>
                    </h4>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBullseye color="#22c55e" /> {goal.dailyTargetMinutes || 0} min
                    </div>
                </div>

                <button className="btn" onClick={() => setShowModal(true)} style={{ height: '100%', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <FaPlus /> Log Session
                </button>
            </section>

            {/* Charts */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                <div className="card" style={{ height: '350px' }}>
                    <h3>Weekly Progress</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={barData}>
                            <XAxis dataKey="day" stroke="#a0a0a0" />
                            <YAxis stroke="#a0a0a0" />
                            <Tooltip contentStyle={{ background: '#333', border: 'none' }} />
                            <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ height: '350px' }}>
                    <h3>Subject Distribution</h3>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#333', border: 'none' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#666' }}>No data available</div>
                    )}
                </div>
            </section>

            {/* Add Session Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'grid', placeItems: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                        <h2>Log Study Session</h2>
                        <form onSubmit={handleAddSession}>
                            <div className="form-group">
                                <label>Subject</label>
                                <select
                                    className="form-control"
                                    value={newSession.subject}
                                    onChange={e => setNewSession({ ...newSession, subject: e.target.value })}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(sub => (
                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={newSession.duration}
                                    onChange={e => setNewSession({ ...newSession, duration: e.target.value })}
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Notes (optional)</label>
                                <textarea
                                    className="form-control"
                                    value={newSession.notes}
                                    onChange={e => setNewSession({ ...newSession, notes: e.target.value })}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-block">Save</button>
                                <button type="button" className="btn btn-block" style={{ background: '#444' }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
