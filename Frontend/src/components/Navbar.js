import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          📚 Smart Attendance
        </Link>

        {isAuthenticated && (
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/activities">Activities</Link>
            <Link to="/students">Students</Link>
            <Link to="/reports">Reports</Link>
          </div>
        )}

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-info">
                👤 {user?.fullName || user?.username}
              </span>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
