import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import DashboardSeeker from './pages/DashboardSeeker';
import DashboardEmployer from './pages/DashboardEmployer';
import JobList from './pages/JobList';
import JobPost from './pages/JobPost';
import ResumeBuilder from './pages/ResumeBuilder';
import Applications from './pages/Applications';
import VoiceAssistant from './components/VoiceAssistant';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/jobs" element={<JobList />} />
              <Route
                path="/dashboard/seeker"
                element={
                  <ProtectedRoute role="seeker">
                    <DashboardSeeker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/employer"
                element={
                  <ProtectedRoute role="employer">
                    <DashboardEmployer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute role="employer">
                    <JobPost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume-builder"
                element={
                  <ProtectedRoute role="seeker">
                    <ResumeBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute>
                    <Applications />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <VoiceAssistant />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;