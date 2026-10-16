import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Updated
import api from '../api/api'; // ✅ Updated

const JobCard = ({ job, showApplyButton = true }) => {
  const [applying, setApplying] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      const formData = new FormData();
      formData.append('jobId', job._id);
      formData.append('coverLetter', applicationData.coverLetter);
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }

      await api.applyForJob(formData);
      alert('Application submitted successfully!');
      setShowApplicationModal(false);
      setApplicationData({ coverLetter: '', resume: null });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleFileChange = (e) => {
    setApplicationData(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  return (
    <>
      <div className="card job-card">
        <div className="flex-between">
          <div>
            <h3>{job.title}</h3>
            <p className="company-name">{job.company}</p>
          </div>
          {job.source === 'ncs' && (
            <span className="job-tag" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              NCS Job
            </span>
          )}
        </div>

        <div className="job-meta">
          <span className="job-tag">{job.type}</span>
          <span className="job-tag">{job.location}</span>
          {job.salary && <span className="job-tag">{job.salary}</span>}
        </div>

        <p className="job-description">
          {job.description.length > 150 
            ? `${job.description.substring(0, 150)}...` 
            : job.description
          }
        </p>

        <div className="flex-between mt-1">
          <small>
            Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
          </small>
          
          {showApplyButton && (
            <button 
              className="btn btn-primary"
              onClick={handleApplyClick}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h3>Apply for {job.title}</h3>
            <form onSubmit={handleApplicationSubmit}>
              <div className="form-group">
                <label>Cover Letter (Optional)</label>
                <textarea
                  className="form-control form-textarea"
                  placeholder="Why are you interested in this position?"
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData(prev => ({
                    ...prev,
                    coverLetter: e.target.value
                  }))}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Upload Resume (PDF, max 5MB)</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex-between mt-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApplicationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .company-name {
          color: #666;
          font-weight: 500;
        }

        .job-description {
          color: #555;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
};

export default JobCard;