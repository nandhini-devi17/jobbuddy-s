import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Updated
import api from '../api/api'; 

const DashboardSeeker = () => {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    savedJobs: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [applicationsResponse] = await Promise.all([
        api.getMyApplications()
      ]);

      const applications = applicationsResponse.data.applications || [];
      
      setStats({
        applications: applications.length,
        interviews: applications.filter(app => app.status === 'accepted').length,
        savedJobs: 0 // You can implement saved jobs feature later
      });

      setRecentApplications(applications.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Job Seeker Dashboard</h1>
        <p>Manage your job search and applications</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.applications}</span>
          <span className="stat-label">Applications</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.interviews}</span>
          <span className="stat-label">Interviews</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.savedJobs}</span>
          <span className="stat-label">Saved Jobs</span>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="flex-between mb-2">
            <h3>Quick Actions</h3>
          </div>
          <div className="flex flex-col gap-1">
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            <Link to="/resume-builder" className="btn btn-secondary">Build Resume</Link>
            <Link to="/applications" className="btn btn-secondary">View Applications</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex-between mb-2">
            <h3>Recent Applications</h3>
            <Link to="/applications" className="btn btn-secondary">View All</Link>
          </div>
          {recentApplications.length > 0 ? (
            <div>
              {recentApplications.map(application => (
                <div key={application._id} className="job-card">
                  <h4>{application.job?.title}</h4>
                  <p>{application.job?.company}</p>
                  <span className={`job-tag ${application.status}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No applications yet. <Link to="/jobs">Start applying!</Link></p>
          )}
        </div>
      </div>

      <div className="card mt-2">
        <h3>Job Search Tips</h3>
        <div className="grid grid-3">
          <div className="tip-card">
            <h4>📝 Update Your Resume</h4>
            <p>Keep your resume current with latest skills and experiences</p>
          </div>
          <div className="tip-card">
            <h4>🎯 Targeted Applications</h4>
            <p>Apply to jobs that match your skills and interests</p>
          </div>
          <div className="tip-card">
            <h4>🔔 Stay Active</h4>
            <p>Check regularly for new job postings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSeeker;