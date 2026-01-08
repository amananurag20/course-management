import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const executeCode = async ({ code, language, problemId, testCases }) => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.post(
        `${API_URL}/submissions/execute`,
        {
          code,
          language,
          problemId,
          testCases,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );
      return response.data;
    } catch (error) {
      retries++;

      if (retries === MAX_RETRIES) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(error.response.data.error || "Execution failed");
        } else if (error.code === "ECONNABORTED") {
          throw new Error("Execution timed out. Please try again.");
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error("Server is not responding. Please try again later.");
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(error.message || "Failed to execute code");
        }
      }

      // Wait before retrying with exponential backoff
      await sleep(RETRY_DELAY * Math.pow(2, retries - 1));
    }
  }
};

const getSubmissionHistory = async (problemId) => {
  try {
    const response = await axios.get(
      `${API_URL}/submissions/history/${problemId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch submission history");
  }
};

export const submissionService = {
  executeCode,
  getSubmissionHistory,
};
