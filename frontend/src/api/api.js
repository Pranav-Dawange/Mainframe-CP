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
  ask: (query) => api.post('/assistant', { query }),
};

export default api;
