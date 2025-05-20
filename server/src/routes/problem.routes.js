const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");
const { protect, authorize } = require("../middleware/auth");

// Public routes
router.get("/", problemController.getProblems);
router.get("/:id", problemController.getProblem);
router.get("/:id/hints", problemController.getHints);

// Protected routes (require authentication)
router.get("/:id/solution", protect, problemController.getSolution);
router.get("/:id/testcases", protect, problemController.getTestCases);

// Admin only routes
router.post("/", protect, authorize("admin"), problemController.createProblem);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  problemController.updateProblem
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  problemController.deleteProblem
);

module.exports = router;
