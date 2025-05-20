const express = require("express");
const router = express.Router();
const { executeCode } = require("../services/codeExecutionService");
const { validateSubmission } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

// Submit code for execution
router.post("/execute", protect, validateSubmission, async (req, res) => {
  let container = null;
  try {
    const { code, language, problemId } = req.body;
    const userId = req.user.id;

    console.log(
      `[${new Date().toISOString()}] Starting execution for ${language} code`
    );
    console.log(`Problem ID: ${problemId}`);

    // Fetch problem details and test cases
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
        details: "The requested problem does not exist",
      });
    }

    // Validate language support
    const supportedLanguage = problem.codeStubs.some(
      (stub) => stub.language.toUpperCase() === language.toUpperCase()
    );
    if (!supportedLanguage) {
      return res.status(400).json({
        error: "Unsupported language",
        details: `Language ${language} is not supported for this problem`,
      });
    }

    // Additional validation for JavaScript code
    if (language.toLowerCase() === "javascript") {
      if (!code.includes("function") && !code.includes("=>")) {
        return res.status(400).json({
          error: "Invalid JavaScript code",
          details: "Code must be a function or arrow function",
        });
      }

      if (code.includes("while(true)") || code.includes("for(;;)")) {
        return res.status(400).json({
          error: "Invalid JavaScript code",
          details: "Code contains potential infinite loops",
        });
      }
    }

    console.log("Executing code...");
    // Execute the code with problem details
    const results = await executeCode({
      code,
      language,
      problem,
      testCases: problem.testCases,
    });

    console.log("Code execution completed");
    console.log(
      `Results: ${results.passed}/${results.total} test cases passed`
    );

    // Save submission to database
    const submission = new Submission({
      user: userId,
      problem: problemId,
      code,
      language,
      status: results.passed === results.total ? "Accepted" : "Wrong Answer",
      runtime: results.time,
      memory: results.memory,
      testCases: results.cases,
    });

    await submission.save();
    console.log("Submission saved to database");

    res.json(results);
  } catch (error) {
    console.error("Code execution error:", error);
    console.error("Error stack:", error.stack);

    // Check for specific error types
    if (error.message.includes("memory")) {
      return res.status(500).json({
        error: "Memory limit exceeded",
        details: "Your code is using too much memory",
      });
    }

    if (error.message.includes("timeout")) {
      return res.status(500).json({
        error: "Time limit exceeded",
        details: "Your code is taking too long to execute",
      });
    }

    if (error.message.includes("container")) {
      return res.status(500).json({
        error: "Container error",
        details: "Failed to execute code in container. Please try again.",
      });
    }

    // More detailed error response
    res.status(500).json({
      error: "Code execution failed",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Get submission history
router.get("/history/:problemId", protect, async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    const submissions = await Submission.find({
      problem: problemId,
      user: userId,
    })
      .sort({ createdAt: -1 })
      .select("status runtime memory language createdAt");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

module.exports = router;
