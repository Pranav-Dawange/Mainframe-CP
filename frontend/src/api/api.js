import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
  }
  return Promise.reject(error);
});

export const authApi = {
  login: (data) => api.post('/login', data),
  signup: (data) => api.post('/signup', data),
  getMe: () => api.get('/me'),
};

export const documentApi = {
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  upload: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/documents/${id}`),
};

export const warrantyApi = {
  getAll: () => api.get('/warranties'),
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
};

export const activityApi = {
  getAll: () => api.get('/activity'),
};

export const searchApi = {
  search: (query) => api.get(`/search?q=${encodeURIComponent(query)}`),
};

export const assistantApi = {
  ask: (query, gemini_key = null, groq_key = null) => api.post('/assistant', { query, gemini_key, groq_key }),
};

export const mainframeApi = {
  getStatus: () => api.get('/mainframe/status'),
  getDatasets: () => api.get('/mainframe/datasets'),
  syncLifeVaultJcl: () => api.post('/mainframe/lvault-sync'),
  submitTransaction: (data) => api.post('/submit-transaction', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
};

export const expenseApi = {
  exportExcel: () => api.get('/expenses/export', { responseType: 'blob' }),
  syncExcel: () => api.post('/expenses/sync'),
  downloadUrl: 'http://localhost:8000/api/expenses/export',
};

export default api;

