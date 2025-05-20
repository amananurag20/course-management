const Problem = require("../models/Problem");

// Get all problems with filtering and pagination
exports.getProblems = async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, topic, type, search } = req.query;

    const query = {};

    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topic = topic;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const problems = await Problem.find(query)
      .select("-solution -testCases") // Exclude sensitive data
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Problem.countDocuments(query);

    res.json({
      problems,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single problem by ID
exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new problem
exports.createProblem = async (req, res) => {
  try {
    const problem = new Problem(req.body);
    const savedProblem = await problem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update problem
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

// Delete problem
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

// Get problem solution (protected route)
exports.getSolution = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("solution");
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json({ solution: problem.solution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get problem hints
exports.getHints = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("hints");
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json({ hints: problem.hints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get problem test cases (protected route)
exports.getTestCases = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("testCases");
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json({ testCases: problem.testCases });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
