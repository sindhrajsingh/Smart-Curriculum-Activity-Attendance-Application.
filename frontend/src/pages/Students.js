

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    grade: 'Freshman'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/students', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ firstName: '', lastName: '', email: '', studentId: '', grade: 'Freshman' });
      fetchStudents();
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteConfirm(null);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'Freshman': { bg: '#3B82F6', light: '#DBEAFE', text: '#1E40AF' },
      'Sophomore': { bg: '#10B981', light: '#D1FAE5', text: '#065F46' },
      'Junior': { bg: '#F59E0B', light: '#FEF3C7', text: '#92400E' },
      'Senior': { bg: '#8B5CF6', light: '#EDE9FE', text: '#5B21B6' }
    };
    return colors[grade] || { bg: '#6B7280', light: '#F3F4F6', text: '#1F2937' };
  };

  const getGradeIcon = (grade) => {
    const icons = {
      'Freshman': '🌱',
      'Sophomore': '🌿',
      'Junior': '🌳',
      'Senior': '🎓'
    };
    return icons[grade] || '📚';
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return { bg: '#10B981', text: '#065F46' };
    return { bg: '#6B7280', text: '#1F2937' };
  };

  const calculateStats = () => {
    const totalStudents = students.length;
    const gradeCount = students.reduce((acc, s) => {
      acc[s.grade] = (acc[s.grade] || 0) + 1;
      return acc;
    }, {});
    const activeCount = students.filter(s => s.status === 'Active').length;
    
    return { totalStudents, gradeCount, activeCount };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '5px solid rgba(255,255,255,0.3)',
          borderTop: '5px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '48px' }}>👨‍🎓</div>
              <div>
                <h1 style={{ margin: 0, fontSize: '36px', color: '#1F2937' }}>
                  Students Management
                </h1>
                <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '16px' }}>
                  Manage student records and information
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                background: showForm 
                  ? 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              {showForm ? '✖ Cancel' : '➕ Add Student'}
            </button>
          </div>

          {/* Statistics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            padding: '20px',
            background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
            borderRadius: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
                {stats.totalStudents}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Students</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10B981' }}>
                {stats.activeCount}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Active</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3B82F6' }}>
                {stats.gradeCount['Freshman'] || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Freshmen</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8B5CF6' }}>
                {stats.gradeCount['Senior'] || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Seniors</div>
            </div>
          </div>
        </div>

        {/* Add Student Form */}
        {showForm && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease'
          }}>
            <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', color: '#1F2937' }}>
              ➕ Add New Student
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      fontSize: '16px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      fontSize: '16px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      fontSize: '16px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Student ID *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter student ID"
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      fontSize: '16px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Grade Level *
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      fontSize: '16px',
                      border: '2px solid #E5E7EB',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'white',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  >
                    <option value="Freshman">🌱 Freshman</option>
                    <option value="Sophomore">🌿 Sophomore</option>
                    <option value="Junior">🌳 Junior</option>
                    <option value="Senior">🎓 Senior</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '15px 40px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  background: submitting 
                    ? 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                {submitting ? '⏳ Creating...' : '✓ Create Student'}
              </button>
            </form>
          </div>
        )}

        {/* Students Grid */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', color: '#1F2937' }}>
            📊 Student Records ({students.length})
          </h2>

          {students.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9CA3AF'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>👨‍🎓</div>
              <p style={{ fontSize: '18px', margin: 0 }}>No students yet</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Add your first student using the button above
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {students.map(student => {
                const gradeColors = getGradeColor(student.grade);
                const statusColors = getStatusColor(student.status);
                
                return (
                  <div
                    key={student._id}
                    style={{
                      background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                      borderRadius: '15px',
                      padding: '20px',
                      borderLeft: `5px solid ${gradeColors.bg}`,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <h3 style={{
                          margin: '0 0 5px 0',
                          fontSize: '20px',
                          color: '#1F2937',
                          fontWeight: 'bold'
                        }}>
                          {student.firstName} {student.lastName}
                        </h3>
                        <p style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#6B7280',
                          fontFamily: 'monospace'
                        }}>
                          ID: {student.studentId}
                        </p>
                      </div>
                      <div style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: gradeColors.text,
                        background: gradeColors.light,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {getGradeIcon(student.grade)} {student.grade}
                      </div>
                    </div>

                    <div style={{
                      padding: '12px',
                      background: 'white',
                      borderRadius: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#4B5563',
                        marginBottom: '8px'
                      }}>
                        <span>📧</span>
                        <span style={{ wordBreak: 'break-all' }}>{student.email}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '8px',
                        borderTop: '1px solid #E5E7EB'
                      }}>
                        <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>
                          Status:
                        </span>
                        <div style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: statusColors.text,
                          background: statusColors.bg
                        }}>
                          {student.status}
                        </div>
                      </div>
                    </div>

                    {showDeleteConfirm === student._id ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleDelete(student._id)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: 'white',
                            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          ✓ Confirm Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#4B5563',
                            background: 'white',
                            border: '2px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(student._id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#EF4444',
                          background: 'white',
                          border: '2px solid #FEE2E2',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#FEE2E2';
                          e.target.style.color = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = '#EF4444';
                        }}
                      >
                        🗑️ Delete Student
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Students;
