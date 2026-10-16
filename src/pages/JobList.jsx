import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ Updated
import api from '../api/api'; 
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });

  const { isAuthenticated, isSeeker } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.getJobs({
        ...filters,
        page: pagination.currentPage,
        limit: 12
      });

      setJobs(response.data.jobs);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalJobs: response.data.totalJobs
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Find Your Dream Job</h1>
        <p>Discover opportunities that match your skills</p>
      </div>

      {/* Filters */}
      <div className="card mb-2">
        <div className="grid grid-3">
          <div className="form-group">
            <label>Search Jobs</label>
            <input
              type="text"
              className="form-control"
              placeholder="Job title, company, or keywords"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              placeholder="City or country"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Job Type</label>
            <select
              className="form-select"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="flex-between mt-1">
          <span>Showing {pagination.totalJobs} jobs</span>
          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Employer CTA */}
      {isAuthenticated && !isSeeker && (
        <div className="card alert-warning mb-2">
          <div className="flex-between">
            <div>
              <h4>Want to post a job?</h4>
              <p>Reach thousands of qualified candidates</p>
            </div>
            <Link to="/post-job" className="btn btn-primary">
              Post a Job
            </Link>
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-2">
            {jobs.map(job => (
              <JobCard 
                key={job._id || job.externalId} 
                job={job} 
                showApplyButton={isAuthenticated && isSeeker}
              />
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="card text-center">
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex-center gap-1 mt-3">
              <button
                className="btn btn-secondary"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </button>

              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                className="btn btn-secondary"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;