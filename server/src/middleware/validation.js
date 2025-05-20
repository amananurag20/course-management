const validateSubmission = (req, res, next) => {
  const { code, language, problemId, testCases } = req.body;

  // Check if all required fields are present
  if (!code || !language || !problemId || !testCases) {
    return res.status(400).json({
      error: "Missing required fields",
      details: "code, language, problemId, and testCases are required",
    });
  }

  // Validate language
  const supportedLanguages = ["javascript", "python", "java", "cpp"];
  if (!supportedLanguages.includes(language)) {
    return res.status(400).json({
      error: "Unsupported language",
      details: `Supported languages are: ${supportedLanguages.join(", ")}`,
    });
  }

  // Validate code length
  if (code.length > 10000) {
    return res.status(400).json({
      error: "Code too long",
      details: "Maximum code length is 10000 characters",
    });
  }

  // Validate test cases
  if (!Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({
      error: "Invalid test cases",
      details: "testCases must be a non-empty array",
    });
  }

  // Validate each test case
  for (const testCase of testCases) {
    if (!testCase.input || !testCase.output) {
      return res.status(400).json({
        error: "Invalid test case",
        details: "Each test case must have input and output",
      });
    }
  }

  next();
};

module.exports = {
  validateSubmission,
};
