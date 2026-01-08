const express = require("express");
const router = express.Router();
const reelController = require("../controllers/reel.controller");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", reelController.getAllReels);
router.get("/:id", reelController.getReelById);

// Protected routes (require authentication)
router.post("/", protect, reelController.createReel);
router.put("/:id", protect, reelController.updateReel);
router.delete("/:id", protect, reelController.deleteReel);

module.exports = router;
