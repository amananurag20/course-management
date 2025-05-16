const Problem = require("../models/Problem");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");

// Get all problems with optional filters
exports.getProblems = async (req, res) => {
  try {
    const { type, difficulty, topic, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topic = topic;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const problems = await Problem.find(query)
      .select("-solution -testCases.output") // Don't send solutions and hidden test cases
      .sort({ createdAt: -1 });

    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single problem by ID
exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select(
      "-solution -testCases.output"
    ); // Don't send solution and hidden test cases

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new problem
exports.createProblems = async (req, res) => {
  try {
    // Check if req.body is an array for multiple problems
    const problemsData = Array.isArray(req.body) ? req.body : [req.body];

    // Use create to insert one or more problems at once
    const savedProblems = await Problem.create(problemsData);

    res.status(201).json(savedProblems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a problem
exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a problem
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a solution for a coding problem
exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.type !== "coding") {
      return res.status(400).json({ message: "This is not a coding problem" });
    }

    // Create temporary directory for code execution
    const tempDir = path.join(__dirname, "../temp", Date.now().toString());
    await fs.mkdir(tempDir, { recursive: true });

    // Save code to file
    const filename = `solution.${language}`;
    const filepath = path.join(tempDir, filename);
    await fs.writeFile(filepath, code);

    // Run test cases in Docker container
    const results = await Promise.all(
      problem.testCases.map(async (testCase) => {
        const command = `docker run --rm -v ${tempDir}:/code code-runner:${language} /code/${filename} "${testCase.input}"`;

        try {
          const { stdout } = await exec(command);
          const passed = stdout.trim() === testCase.output.trim();
          return {
            passed,
            input: testCase.input,
            expectedOutput: testCase.isHidden ? "[Hidden]" : testCase.output,
            actualOutput: stdout.trim(),
            explanation: testCase.explanation,
          };
        } catch (error) {
          return {
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.isHidden ? "[Hidden]" : testCase.output,
            actualOutput: error.message,
            explanation: "Runtime error",
          };
        }
      })
    );

    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true });

    // Calculate score
    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    const score = Math.round((passedCount / totalCount) * 100);

    res.json({
      success: score === 100,
      score,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit answer for MCQ problem
exports.submitMCQAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.type !== "mcq") {
      return res.status(400).json({ message: "This is not an MCQ problem" });
    }

    const correctOption = problem.options.find((opt) => opt.isCorrect);
    const isCorrect = answer === correctOption.text;

    res.json({
      success: isCorrect,
      explanation: problem.explanation,
      correctAnswer: correctOption.text,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
