import api from '../utils/api';

export const mcqService = {
  getAll: (params) => api.get('/mcq-questions', { params }),
  getById: (id) => api.get(`/mcq-questions/${id}`),
  create: (data) => api.post('/mcq-questions', data),
  update: (id, data) => api.patch(`/mcq-questions/${id}`, data),
  delete: (id) => api.delete(`/mcq-questions/${id}`),
  getByCourse: (courseId) => api.get(`/mcq-questions/course/${courseId}`),
  submitAnswer: (id, answer) => api.post(`/mcq-questions/${id}/submit`, { answer }),
  getRandomQuestions: () => api.get('/mcq-questions/random'),
  validateAnswer: (id, answers) => api.post(`/mcq-questions/${id}/validate`, { answers }),
  submitQuiz: (id, answers) => api.post(`/mcq-questions/${id}/submit`, { answers }),
  getSubmissionHistory: () => api.get('/mcq-questions/submissions/history'),
}; 