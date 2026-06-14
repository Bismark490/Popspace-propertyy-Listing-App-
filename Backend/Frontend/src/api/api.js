import axios from 'axios';

// Centralized Axios instance — all requests go through here
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attach JWT token to every outbound request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('propspace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle expired/invalid tokens globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('propspace_token');
      localStorage.removeItem('propspace_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
