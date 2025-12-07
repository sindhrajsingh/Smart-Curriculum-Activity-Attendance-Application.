import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AttendanceList from './pages/AttendanceList';
import ActivityList from './pages/ActivityList';
import StudentList from './pages/StudentList';
import Reports from './pages/Reports';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/attendance" element={
                <PrivateRoute>
                  <AttendanceList />
                </PrivateRoute>
              } />
              
              <Route path="/activities" element={
                <PrivateRoute>
                  <ActivityList />
                </PrivateRoute>
              } />
              
              <Route path="/students" element={
                <PrivateRoute>
                  <StudentList />
                </PrivateRoute>
              } />
              
              <Route path="/reports" element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              } />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
