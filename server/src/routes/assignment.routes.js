const express = require("express");
const { body } = require("express-validator");
const assignmentController = require("../controllers/assignment.controller");
const authMiddleware = require("../middleware/auth");
const validateRequest = require("../middleware/validate-request");
const checkRole = require("../middleware/check-role");

const router = express.Router();

// Validation middleware
const assignmentValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("dueDate").isISO8601().withMessage("Valid due date is required"),
  body("totalPoints")
    .isInt({ min: 0 })
    .withMessage("Total points must be a positive number"),
];

const submissionValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Submission content is required"),
];

const gradeValidation = [
  body("grade")
    .isInt({ min: 0 })
    .withMessage("Grade must be a positive number"),
  body("feedback").trim().notEmpty().withMessage("Feedback is required"),
];

// Routes
router.use(authMiddleware); // Protect all assignment routes

router.post(
  "/course/:courseId",
  checkRole(["instructor", "admin"]),
  assignmentValidation,
  validateRequest,
  assignmentController.createAssignment
);

router.get("/course/:courseId", assignmentController.getCourseAssignments);

router.post(
  "/:assignmentId/submit",
  submissionValidation,
  validateRequest,
  assignmentController.submitAssignment
);

router.post(
  "/:assignmentId/submissions/:submissionId/grade",
  checkRole(["instructor", "admin"]),
  gradeValidation,
  validateRequest,
  assignmentController.gradeSubmission
);

module.exports = router;
