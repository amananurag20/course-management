const express = require("express");
const { body } = require("express-validator");
const courseController = require("../controllers/course.controller");
const { protect } = require("../middleware/auth");
const validateRequest = require("../middleware/validate-request");
const checkRole = require("../middleware/check-role");
const noteController = require("../controllers/noteController");

const router = express.Router();

// Validation middleware
const courseValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("startDate").isISO8601().withMessage("Valid start date is required"),
  body("endDate")
    .isISO8601()
    .withMessage("Valid end date is required")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

// Course Management Routes
router.get("/", courseController.getCourses);
router.get("/:id", protect, courseController.getCourseById);
router.post(
  "/",
  protect,
  checkRole(["instructor", "admin"]),
  courseValidation,
  validateRequest,
  courseController.createCourse
);
router.put(
  "/:id",
  protect,
  checkRole(["instructor", "admin"]),
  courseValidation,
  validateRequest,
  courseController.updateCourse
);
router.delete(
  "/:id",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.deleteCourse
);

// Module Management Routes
router.post(
  "/:courseId/modules",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.addModule
);
router.put(
  "/:courseId/modules/:moduleIndex",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.updateModule
);
router.delete(
  "/:courseId/modules/:moduleIndex",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.deleteModule
);

// Resource Management Routes
router.post(
  "/:courseId/modules/:moduleIndex/resources",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.addResource
);
router.put(
  "/:courseId/modules/:moduleIndex/resources/:resourceIndex",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.updateResource
);
router.delete(
  "/:courseId/modules/:moduleIndex/resources/:resourceIndex",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.deleteResource
);

// Enrollment Management Routes
router.get(
  "/:courseId/enrollments",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.getEnrollments
);
router.post(
  "/:courseId/enroll/:studentId",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.enrollStudent
);
router.delete(
  "/:courseId/enroll/:studentId",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.unenrollStudent
);

// Course Progress & Analytics Routes
router.get(
  "/:courseId/progress",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.getCourseProgress
);
router.get(
  "/:courseId/analytics",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.getCourseAnalytics
);
router.get(
  "/:courseId/modules/:moduleIndex/completion",
  protect,
  checkRole(["instructor", "admin"]),
  courseController.getModuleCompletion
);

// Note Management Routes (existing)
router.get(
  "/:courseId/modules/:moduleIndex/resources/:resourceIndex/notes",
  protect,
  noteController.getResourceNotes
);
router.post(
  "/:courseId/modules/:moduleIndex/resources/:resourceIndex/notes",
  protect,
  noteController.addNote
);
router.put(
  "/:courseId/modules/:moduleIndex/resources/:resourceIndex/notes/:noteId",
  protect,
  noteController.updateNote
);
router.delete(
  "/:courseId/modules/:moduleIndex/resources/:resourceIndex/notes/:noteId",
  protect,
  noteController.deleteNote
);

module.exports = router;
