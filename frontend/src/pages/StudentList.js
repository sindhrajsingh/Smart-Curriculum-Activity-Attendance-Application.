// src/pages/StudentList.js

import React, { useState, useEffect } from "react";
import axios from "axios";

// ================================
// Student List Component
// ================================
function StudentCards({ students, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const getGradeColor = (grade) => {
    const colors = {
      Freshman: { bg: "#3B82F6", light: "#DBEAFE", text: "#1E40AF" },
      Sophomore: { bg: "#10B981", light: "#D1FAE5", text: "#065F46" },
      Junior: { bg: "#F59E0B", light: "#FEF3C7", text: "#92400E" },
      Senior: { bg: "#8B5CF6", light: "#EDE9FE", text: "#5B21B6" },
    };
    return colors[grade] || { bg: "#6B7280", light: "#F3F4F6", text: "#1F2937" };
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? { bg: "#10B981", text: "#065F46" }
      : { bg: "#6B7280", text: "#1F2937" };
  };

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <h2>📊 Student Records ({students.length})</h2>

      {students.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h1>👨‍🎓</h1>
          <p>No students yet</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          }}
        >
          {students.map((student) => {
            const gradeColors = getGradeColor(student.grade);
            const statusColors = getStatusColor(student.status);

            return (
              <div
                key={student._id}
                style={{
                  background: "#F9FAFB",
                  padding: "20px",
                  borderRadius: "15px",
                  borderLeft: `5px solid ${gradeColors.bg}`,
                }}
              >
                {/* Top Info */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {student.firstName} {student.lastName}
                    </h3>
                    <small>ID: {student.studentId}</small>
                  </div>

                  <div
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      background: gradeColors.light,
                      color: gradeColors.text,
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    {student.grade}
                  </div>
                </div>

                {/* Email & Status Card */}
                <div
                  style={{
                    padding: "12px",
                    background: "white",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>

                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    Status:
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "20px",
                        background: statusColors.bg,
                        color: statusColors.text,
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {student.status}
                    </span>
                  </div>
                </div>

                {/* Delete Logic */}
                {showDeleteConfirm === student._id ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => {
                        onDelete(student._id);
                        setShowDeleteConfirm(null);
                      }}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#DC2626",
                        color: "white",
                        borderRadius: "8px",
                      }}
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "white",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(student._id)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "white",
                      color: "#DC2626",
                      borderRadius: "8px",
                      border: "2px solid #FEE2E2",
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
  );
}

// ================================
// Main Students Page
// ================================
function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    grade: "Freshman",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/students", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowForm(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        studentId: "",
        grade: "Freshman",
      });

      fetchStudents();
    } catch (error) {
      console.error("Error creating student:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const calculateStats = () => {
    const totalStudents = students.length;

    const gradeCount = students.reduce((acc, s) => {
      acc[s.grade] = (acc[s.grade] || 0) + 1;
      return acc;
    }, {});

    const activeCount = students.filter((s) => s.status === "Active").length;

    return { totalStudents, gradeCount, activeCount };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "5px solid rgba(255,255,255,0.3)",
            borderTop: "5px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <span style={{ fontSize: "48px" }}>👨‍🎓</span>

              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "36px",
                    color: "#1F2937",
                  }}
                >
                  Students Management
                </h1>

                <p style={{ marginTop: "5px", color: "#6B7280" }}>
                  Manage student records and information
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: "15px 30px",
                color: "white",
                borderRadius: "12px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                background: showForm
                  ? "gray"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {showForm ? "✖ Cancel" : "➕ Add Student"}
            </button>
          </div>

          {/* Stats */}
          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gap: "15px",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: 0, color: "#667eea" }}>
                {stats.totalStudents}
              </h2>
              <p>Total Students</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: 0, color: "#10B981" }}>
                {stats.activeCount}
              </h2>
              <p>Active</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: 0, color: "#3B82F6" }}>
                {stats.gradeCount["Freshman"] || 0}
              </h2>
              <p>Freshmen</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: 0, color: "#8B5CF6" }}>
                {stats.gradeCount["Senior"] || 0}
              </h2>
              <p>Seniors</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        {showForm && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              marginBottom: "30px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h2>Add New Student</h2>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                }}
              >
                {/* First Name */}
                <div>
                  <label>First Name *</label>
                  <input
                    required
                    value={formData.firstName}
                    placeholder="First Name"
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "2px solid #E5E7EB",
                    }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label>Last Name *</label>
                  <input
                    required
                    value={formData.lastName}
                    placeholder="Last Name"
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "2px solid #E5E7EB",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label>Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    placeholder="student@example.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "2px solid #E5E7EB",
                    }}
                  />
                </div>

                {/* Student ID */}
                <div>
                  <label>Student ID *</label>
                  <input
                    required
                    value={formData.studentId}
                    placeholder="Enter ID"
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "2px solid #E5E7EB",
                    }}
                  />
                </div>

                {/* Grade */}
                <div>
                  <label>Grade *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "2px solid #E5E7EB",
                    }}
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
                  marginTop: "20px",
                  padding: "15px 40px",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  background: submitting
                    ? "gray"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {submitting ? "⏳ Creating..." : "✓ Create Student"}
              </button>
            </form>
          </div>
        )}

        {/* Student Cards */}
        <StudentCards students={students} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default StudentList;
