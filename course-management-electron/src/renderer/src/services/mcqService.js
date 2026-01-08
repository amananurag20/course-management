import api from '../utils/api';

export const mcqService = {
  getAllMcqQuestions: async () => {
    try {
      const response = await api.get('/mcq-questions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMcqQuestionById: async (id) => {
    try {
      const response = await api.get(`/mcq-questions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  validateMcqAnswers: async (id, answers) => {
    try {
      const response = await api.post(`/mcq-questions/${id}/validate`, { answers });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  submitMcqQuiz: async (id, submissionData) => {
    try {
      const response = await api.post(`/mcq-questions/${id}/submit`, submissionData);
      if (!response.data?.data?.submission) {
        throw new Error('Invalid response format from server');
      }
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.response) {
        throw { status: 'fail', message: 'Server error occurred' };
      } else if (error.request) {
        throw { status: 'fail', message: 'No response from server' };
      } else {
        throw { status: 'fail', message: error.message };
      }
    }
  }
}; 