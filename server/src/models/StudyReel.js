const mongoose = require("mongoose");

const studyReelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        videoId: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
        },
        category: {
            type: String,
            enum: ["JavaScript", "React", "Node.js", "CSS", "HTML", "General"],
            default: "JavaScript",
        },
        difficulty: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },
        duration: {
            type: String,
            default: "1 min",
        },
        tags: [
            {
                type: String,
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
studyReelSchema.index({ category: 1, isActive: 1 });
studyReelSchema.index({ topic: 1 });
studyReelSchema.index({ order: 1 });

module.exports = mongoose.model("StudyReel", studyReelSchema);
