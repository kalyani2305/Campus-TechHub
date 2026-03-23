// ─────────────────────────────────────────
// FILE: src/services/api.js
// Axios instance — all calls to Spring Boot
// Base URL: http://localhost:8083
// ─────────────────────────────────────────
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8083',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────
export const loginApi         = (data) => API.post('/auth/login', data);
export const registerUserApi  = (data) => API.post('/user/createUser', data);

// ── Users ─────────────────────────────────
export const getAllUsersApi    = ()     => API.get('/user/allUsers');
export const deleteUserApi    = (u)    => API.delete(`/user/deleteUser/${u}`);

// ── Students ──────────────────────────────
export const registerStudentApi = (data) => API.post('/students/register', data);
export const getAllStudentsApi  = ()      => API.get('/students/allStudents');
export const deleteStudentApi  = (id)    => API.delete(`/students/deleteStudent/${id}`);
export const updateStudentApi  = (id, d) => API.put(`/students/updateStudent/${id}`, d);

// ── Job Postings ───────────────────────────
export const createJobApi   = (data)    => API.post('/job-postings/createJob', data);
export const getAllJobsApi   = (branch)  => API.get('/job-postings/allJobs', { params: branch ? { branch } : {} });
export const deleteJobApi   = (id)      => API.delete(`/job-postings/deleteJob/${id}`);
export const updateJobApi   = (id, d)   => API.put(`/job-postings/updateJob/${id}`, d);

// ── Job Applications ──────────────────────
export const applyJobApi        = (sId, jId) => API.post('/jobApplication/apply', null, { params: { studentId: sId, jobPostingId: jId } });
export const getAllApplicationsApi = ()       => API.get('/jobApplication/all');
export const updateAppStatusApi = (id, s)    => API.put(`/jobApplication/updateStatus/${id}/${s}`);
export const getMyApplicationsApi = (sId)    => API.get(`/jobApplication/myApplications/${sId}`);

// ── Interviews ────────────────────────────
export const scheduleInterviewApi  = (data) => API.post('/interview/schedule', data);
export const getAllInterviewsApi    = ()     => API.get('/interview/all');
export const getMyInterviewApi     = (sId)  => API.get(`/interview/myInterview/${sId}`);
export const updateInterviewStatus = (id,s) => API.put(`/interview/updateStatus/${id}/${s}`);

export default API;
