import api from '../utils/api';

export const userService = {
  // User Management (Admin only)
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  
  // User Profile Management
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
  
  // User Progress and Enrollments
  getEnrollments: (userId) => api.get(`/users/${userId}/enrollments`),
  getProgress: (userId) => api.get(`/users/${userId}/progress`),
}; 