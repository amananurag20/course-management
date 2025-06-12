import api from '../utils/api';

export const problemService = {
  getAll: (params) => api.get('/problems', { params }),
  getById: (id) => api.get(`/problems/${id}`),
  create: (data) => api.post('/problems', data),
  update: (id, data) => api.put(`/problems/${id}`, data),
  delete: (id) => api.delete(`/problems/${id}`),
  getByCourse: (courseId) => api.get(`/problems/course/${courseId}`),
  submitSolution: (id, solution) => api.post(`/problems/${id}/submit`, { solution }),
  getTestCases: (id) => api.get(`/problems/${id}/testcases`),
  updateTestCases: (id, testCases) => api.put(`/problems/${id}/test-cases`, { testCases }),
  getHints: (id) => api.get(`/problems/${id}/hints`),
  getSolution: (id) => api.get(`/problems/${id}/solution`),
}; 