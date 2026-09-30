import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Configure Axios request interceptor to automatically attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configure Axios response interceptor for token expiration or unauthorized handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user from localStorage when unauthorized or token expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(username, password) {
    const response = await api.post('/api/login', { username, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        role: response.data.role
      }));
    }
    return response.data;
  },

  async signup(username, password, role = 'user') {
    const response = await api.post('/api/signup', { username, password, role });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/api/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser() {
    try {
      const user = localStorage.getItem('user');
      if (!user) return null;
      const parsed = JSON.parse(user);
      if (parsed && typeof parsed === 'object' && parsed.username) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  }
};

export const mainframeService = {
  async submitTransaction(accountNum, amount) {
    const formData = new FormData();
    formData.append('account_num', accountNum);
    formData.append('amount', amount);
    
    const response = await api.post('/api/submit-transaction', formData);
    return response.data;
  },

  async generateReport() {
    const formData = new FormData();
    formData.append('account_num', 'N/A');
    formData.append('amount', '0');

    const response = await api.post('/api/submit-transaction', formData);
    return response.data;
  }
};

export default api;
