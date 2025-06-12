import api from '../utils/api';

export const authService = {
  // Authentication
  login: async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      if (data.token && data.user) {
        // Set the token in axios defaults for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        return data;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  logout: () => {
    // Clear the auth header
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
  getCurrentUser: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  resetPassword: async (token, password) => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },
  updateProfile: async (userData) => {
    const { data } = await api.put('/auth/profile', userData);
    return data;
  },
  changePassword: async (passwordData) => {
    const { data } = await api.post('/auth/change-password', passwordData);
    return data;
  },
  getProfile: () => api.get('/auth/profile'),
}; 