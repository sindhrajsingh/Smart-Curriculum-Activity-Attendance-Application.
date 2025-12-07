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
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '0 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '24px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          📚 Smart Attendance
        </Link>

        {/* Navigation Links */}
        {isAuthenticated && (
          <div style={{
            display: 'flex',
            gap: '5px',
            alignItems: 'center'
          }}>
            <Link to="/" style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              background: 'rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Dashboard
            </Link>
            <Link to="/attendance" style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              background: 'rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Attendance
            </Link>
            <Link to="/activities" style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              background: 'rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Activities
            </Link>
            <Link to="/students" style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              background: 'rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Students
            </Link>
            <Link to="/reports" style={{
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              background: 'rgba(255,255,255,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              Reports
            </Link>
          </div>
        )}

        {/* User Actions - Right Side */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          {isAuthenticated ? (
            <>
              <span style={{
                color: '#fff',
                fontSize: '15px',
                fontWeight: '500',
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                👤 {user?.fullName || user?.username}
              </span>
              <button onClick={handleLogout} style={{
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#fff',
                background: 'rgba(239, 68, 68, 0.9)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#DC2626';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.9)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}>
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#fff',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                padding: '10px 24px',
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#667eea',
                background: '#fff',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}>
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
