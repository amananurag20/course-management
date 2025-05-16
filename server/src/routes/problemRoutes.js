const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  submitSolution,
  submitMCQAnswer,
} = require("../controllers/problemController");

// Public routes
router.get("/", getProblems);
router.get("/:id", getProblem);

// Protected routes - require authentication
router.post("/", auth, createProblem);
router.put("/:id", auth, updateProblem);
router.delete("/:id", auth, deleteProblem);

// Submission routes
router.post("/:id/submit-solution", auth, submitSolution);
router.post("/:id/submit-mcq", auth, submitMCQAnswer);

module.exports = router;
