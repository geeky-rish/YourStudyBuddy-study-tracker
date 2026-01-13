import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaSignOutAlt, FaBook, FaHistory, FaChartPie } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar" style={{ background: '#1e1e1e', padding: '1rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaBook color="#3b82f6" /> StudyTracker
                </Link>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to="/">Dashboard</Link>
                            <Link to="/subjects">Subjects</Link>
                            <Link to="/history">History</Link>
                            <button
                                onClick={onLogout}
                                className="btn btn-danger"
                                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
