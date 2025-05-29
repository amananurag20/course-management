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

// Routes
router.post(
  "/",
  protect,
  checkRole(["instructor", "admin"]),
  courseValidation,
  validateRequest,
  courseController.createCourse
);

router.get("/", courseController.getCourses);
router.get("/:id", protect,courseController.getCourseById);

router.put(
  "/:id",
  protect,
  checkRole(["instructor", "admin"]),
  courseValidation,
  validateRequest,
  courseController.updateCourse
);

router.post("/:id/enroll", protect, courseController.enrollInCourse);
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
