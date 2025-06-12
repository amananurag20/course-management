const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth");
const checkRole = require("../middleware/check-role");
const validateRequest = require("../middleware/validate-request");

const router = express.Router();

// Validation middleware
const userValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["student", "instructor", "admin"])
    .withMessage("Invalid role"),
];

// User Management Routes (Admin only)
router.get("/", protect, checkRole(["admin"]), userController.getAllUsers);
router.post("/", protect, checkRole(["admin"]), userValidation, validateRequest, userController.createUser);
router.get("/:id", protect, checkRole(["admin"]), userController.getUserById);
router.put("/:id", protect, checkRole(["admin"]), userValidation, validateRequest, userController.updateUser);
router.delete("/:id", protect, checkRole(["admin"]), userController.deleteUser);

// User Profile Routes (For authenticated users)
router.put("/profile", protect, userController.updateProfile);
router.post("/change-password", protect, [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
], validateRequest, userController.changePassword);

// User Progress and Enrollments
router.get("/:id/enrollments", protect, userController.getUserEnrollments);
router.get("/:id/progress", protect, userController.getUserProgress);

module.exports = router; 