import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Updated
import api from '../api/api'; 

const DashboardEmployer = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [jobsResponse] = await Promise.all([
        api.getEmployerJobs()
      ]);

      const jobs = jobsResponse.data.jobs || [];
      const activeJobs = jobs.filter(job => job.isActive);
      
      // Calculate total applications
      let totalApplications = 0;
      let newApplications = 0;

      for (let job of activeJobs) {
        try {
          const applicationsResponse = await api.getJobApplications(job._id);
          const applications = applicationsResponse.data.applications || [];
          totalApplications += applications.length;
          newApplications += applications.filter(app => app.status === 'pending').length;
        } catch (error) {
          console.error('Error fetching applications for job:', job._id);
        }
      }

      setStats({
        activeJobs: activeJobs.length,
        totalApplications,
        newApplications
      });

      setRecentJobs(activeJobs.slice(0, 5));
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
        <h1>Employer Dashboard</h1>
        <p>Manage your job postings and applicants</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.activeJobs}</span>
          <span className="stat-label">Active Jobs</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.totalApplications}</span>
          <span className="stat-label">Total Applications</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.newApplications}</span>
          <span className="stat-label">New Applications</span>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="flex-between mb-2">
            <h3>Quick Actions</h3>
          </div>
          <div className="flex flex-col gap-1">
            <Link to="/post-job" className="btn btn-primary">Post New Job</Link>
            <Link to="/jobs" className="btn btn-secondary">Browse Jobs</Link>
            <Link to="/applications" className="btn btn-secondary">View Applications</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex-between mb-2">
            <h3>Recent Job Postings</h3>
            <Link to="/jobs" className="btn btn-secondary">View All</Link>
          </div>
          {recentJobs.length > 0 ? (
            <div>
              {recentJobs.map(job => (
                <div key={job._id} className="job-card">
                  <h4>{job.title}</h4>
                  <div className="job-meta">
                    <span className="job-tag">{job.type}</span>
                    <span className="job-tag">{job.location}</span>
                  </div>
                  <p>{job.company}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No active jobs. <Link to="/post-job">Post your first job!</Link></p>
          )}
        </div>
      </div>

      <div className="card mt-2">
        <h3>Hiring Tips</h3>
        <div className="grid grid-3">
          <div className="tip-card">
            <h4>📋 Clear Job Descriptions</h4>
            <p>Write detailed job descriptions to attract qualified candidates</p>
          </div>
          <div className="tip-card">
            <h4>⚡ Quick Responses</h4>
            <p>Respond to applicants promptly to secure top talent</p>
          </div>
          <div className="tip-card">
            <h4>🎯 Targeted Posting</h4>
            <p>Post jobs with relevant skills and requirements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmployer;