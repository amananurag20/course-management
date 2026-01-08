const Reel = require("../models/Reel");

// Get all reels
exports.getAllReels = async (req, res) => {
    try {
        const reels = await Reel.find({ isActive: true }).sort({ order: 1 });
        res.json(reels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reels", error: error.message });
    }
};

// Get single reel by ID
exports.getReelById = async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }
        res.json(reel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reel", error: error.message });
    }
};

// Create new reel (admin only)
exports.createReel = async (req, res) => {
    try {
        const reel = new Reel(req.body);
        await reel.save();
        res.status(201).json(reel);
    } catch (error) {
        res.status(400).json({ message: "Error creating reel", error: error.message });
    }
};

// Update reel (admin only)
exports.updateReel = async (req, res) => {
    try {
        const reel = await Reel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }
        res.json(reel);
    } catch (error) {
        res.status(400).json({ message: "Error updating reel", error: error.message });
    }
};

// Delete reel (admin only)
exports.deleteReel = async (req, res) => {
    try {
        const reel = await Reel.findByIdAndDelete(req.params.id);
        if (!reel) {
            return res.status(404).json({ message: "Reel not found" });
        }
        res.json({ message: "Reel deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reel", error: error.message });
    }
};
