import axios from 'axios';

const API_BASE_URL = '/api';

// API functions
const api = {
  // Jobs
  getJobs: (params) => axios.get(`${API_BASE_URL}/jobs`, { params }),
  getJob: (id) => axios.get(`${API_BASE_URL}/jobs/${id}`),
  createJob: (data) => axios.post(`${API_BASE_URL}/jobs`, data),
  updateJob: (id, data) => axios.put(`${API_BASE_URL}/jobs/${id}`, data),
  deleteJob: (id) => axios.delete(`${API_BASE_URL}/jobs/${id}`),
  getEmployerJobs: () => axios.get(`${API_BASE_URL}/jobs/employer/my-jobs`),

  // Applications
  applyForJob: (data) => axios.post(`${API_BASE_URL}/applications`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getJobApplications: (jobId) => axios.get(`${API_BASE_URL}/applications/job/${jobId}`),
  getMyApplications: () => axios.get(`${API_BASE_URL}/applications/my-applications`),
  updateApplicationStatus: (id, status) => 
    axios.patch(`${API_BASE_URL}/applications/${id}/status`, { status })
};

export default api;