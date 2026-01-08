const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        youtubeUrl: {
            type: String,
            required: true,
        },
        embedUrl: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            default: "Course Instructor",
        },
        article: {
            title: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            readTime: {
                type: String,
                default: "5 min read",
            },
            difficulty: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced"],
                default: "Beginner",
            },
            topics: [
                {
                    type: String,
                },
            ],
            relatedLinks: [
                {
                    title: String,
                    url: String,
                },
            ],
            codeExamples: [
                {
                    title: String,
                    code: String,
                    language: {
                        type: String,
                        default: "javascript",
                    },
                },
            ],
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
reelSchema.index({ order: 1 });
reelSchema.index({ isActive: 1 });

module.exports = mongoose.model("Reel", reelSchema);
