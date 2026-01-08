import api from "../utils/api";

export const problemService = {
  // Get all coding problems
  getAllProblems: async () => {
    const response = await api.get("/problems");
    return response.data.problems; // Return the problems array from the response
  },

  // Get a single problem by ID
  getProblemById: async (problemId) => {
    const response = await api.get(`/problems/${problemId}`);
    return response.data;
  },

  // Get problem hints
  getProblemHints: async (problemId) => {
    const response = await api.get(`/problems/${problemId}/hints`);
    return response.data.hints;
  },

  // Get problem solution
  getProblemSolution: async (problemId) => {
    const response = await api.get(`/problems/${problemId}/solution`);
    return response.data.solution;
  },

  // Get problem test cases
  getProblemTestCases: async (problemId) => {
    const response = await api.get(`/problems/${problemId}/testcases`);
    return response.data.testCases;
  },
};
