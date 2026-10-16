import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome to Job Buddy</h1>
        <p>Your AI-powered job search companion</p>
      </div>

      <div className="grid grid-3 mb-3">
        <div className="card text-center">
          <h3>🔍 Find Jobs</h3>
          <p>Browse thousands of jobs from multiple sources</p>
          <Link to="/jobs" className="btn btn-primary">Explore Jobs</Link>
        </div>

        <div className="card text-center">
          <h3>📝 Build Resume</h3>
          <p>Create professional resumes in minutes</p>
          <Link to="/resume-builder" className="btn btn-primary">Build Resume</Link>
        </div>

        <div className="card text-center">
          <h3>🎤 Voice Assistant</h3>
          <p>Navigate using voice commands</p>
          <small>Try saying "Go to Home" or "Show Jobs"</small>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="card text-center">
          <h2>Get Started Today</h2>
          <p>Join thousands of job seekers and employers</p>
          <div className="flex-center gap-2 mt-2">
            <Link to="/register" className="btn btn-primary">Sign Up Free</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      ) : (
        <div className="card text-center">
          <h2>Welcome back, {user.name}! 👋</h2>
          <p>Ready to continue your {user.role === 'seeker' ? 'job search' : 'hiring'} journey?</p>
          <div className="flex-center gap-2 mt-2">
            <Link 
              to={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'} 
              className="btn btn-primary"
            >
              Go to Dashboard
            </Link>
            <Link to="/jobs" className="btn btn-secondary">Browse Jobs</Link>
          </div>
        </div>
      )}

      <div className="grid grid-2 mt-3">
        <div className="card">
          <h3>For Job Seekers</h3>
          <ul>
            <li>✓ Smart job matching</li>
            <li>✓ One-click applications</li>
            <li>✓ Professional resume builder</li>
            <li>✓ Application tracking</li>
          </ul>
        </div>

        <div className="card">
          <h3>For Employers</h3>
          <ul>
            <li>✓ Post jobs in seconds</li>
            <li>✓ Manage applicants</li>
            <li>✓ Reach qualified candidates</li>
            <li>✓ Automated job expiry</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;