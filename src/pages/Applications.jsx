import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ Updated
import api from '../api/api'; // ✅ Updated
import LoadingSpinner from '../components/LoadingSpinner';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobApplications, setJobApplications] = useState({});
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, isEmployer } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      let response;
      
      if (isEmployer) {
        // For employers, get their jobs first, then applications for each job
        const jobsResponse = await api.getEmployerJobs();
        const jobs = jobsResponse.data.jobs || [];
        
        const applicationsMap = {};
        for (let job of jobs) {
          try {
            const appResponse = await api.getJobApplications(job._id);
            applicationsMap[job._id] = {
              job,
              applications: appResponse.data.applications || []
            };
          } catch (error) {
            applicationsMap[job._id] = {
              job,
              applications: []
            };
          }
        }
        
        setJobApplications(applicationsMap);
        // Set first job as selected by default
        if (jobs.length > 0) {
          setSelectedJob(jobs[0]._id);
        }
      } else {
        // For seekers, get their applications
        response = await api.getMyApplications();
        setApplications(response.data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await api.updateApplicationStatus(applicationId, status);
      // Refresh applications
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>{isEmployer ? 'Manage Applications' : 'My Applications'}</h1>
        <p>
          {isEmployer 
            ? 'Review and manage job applications' 
            : 'Track your job applications'
          }
        </p>
      </div>

      {isEmployer ? (
        /* Employer View */
        <div>
          {/* Job Selection */}
          {Object.keys(jobApplications).length > 0 && (
            <div className="card mb-2">
              <label>Select Job to View Applications:</label>
              <select
                className="form-select"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                {Object.entries(jobApplications).map(([jobId, data]) => (
                  <option key={jobId} value={jobId}>
                    {data.job.title} - {data.job.company} ({data.applications.length} applications)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Applications List */}
          {selectedJob && jobApplications[selectedJob] && (
            <div className="card">
              <h3>
                Applications for: {jobApplications[selectedJob].job.title}
              </h3>
              
              {jobApplications[selectedJob].applications.length > 0 ? (
                <div>
                  {jobApplications[selectedJob].applications.map(application => (
                    <div key={application._id} className="job-card">
                      <div className="flex-between">
                        <div>
                          <h4>{application.applicant?.name}</h4>
                          <p>{application.applicant?.email}</p>
                          {application.coverLetter && (
                            <p><strong>Cover Letter:</strong> {application.coverLetter}</p>
                          )}
                          {application.resume && (
                            <p>
                              <strong>Resume:</strong>{' '}
                              <a 
                                href={`/api/uploads/${application.resume.filename}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                              >
                                Download Resume
                              </a>
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <span className={`job-tag ${application.status}`}>
                            Status: {application.status}
                          </span>
                          
                          <select
                            value={application.status}
                            onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                            className="form-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          
                          <small>Applied on: {new Date(application.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No applications received for this job yet.</p>
              )}
            </div>
          )}

          {Object.keys(jobApplications).length === 0 && (
            <div className="card text-center">
              <h3>No Jobs Posted Yet</h3>
              <p>Start posting jobs to receive applications</p>
              <a href="/post-job" className="btn btn-primary">Post Your First Job</a>
            </div>
          )}
        </div>
      ) : (
        /* Seeker View */
        <div>
          {applications.length > 0 ? (
            <div className="grid grid-2">
              {applications.map(application => (
                <div key={application._id} className="job-card">
                  <div className="flex-between">
                    <div>
                      <h4>{application.job?.title}</h4>
                      <p>{application.job?.company} - {application.job?.location}</p>
                      <p><strong>Job Type:</strong> {application.job?.type}</p>
                      {application.coverLetter && (
                        <p><strong>Your Cover Letter:</strong> {application.coverLetter}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className={`job-tag ${application.status}`}>
                        {application.status}
                      </span>
                      <small>Applied on: {new Date(application.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center">
              <h3>No Applications Yet</h3>
              <p>Start applying to jobs to track your applications here</p>
              <a href="/jobs" className="btn btn-primary">Browse Jobs</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;