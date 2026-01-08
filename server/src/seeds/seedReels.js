const mongoose = require("mongoose");
const Reel = require("../models/Reel");
const reelsDataPart1 = require("./reelsData");
const reelsDataPart2 = require("./reelsDataPart2");
require("dotenv").config();

// Combine all reels data
const allReelsData = [...reelsDataPart1, ...reelsDataPart2];

const seedReels = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing reels
        await Reel.deleteMany({});
        console.log("Cleared existing reels");

        // Insert new reels
        const reels = await Reel.insertMany(allReelsData);
        console.log(`Successfully seeded ${reels.length} reels`);

        // Display seeded reels
        reels.forEach((reel, index) => {
            console.log(`${index + 1}. ${reel.title} - ${reel.youtubeUrl}`);
        });

        console.log("\n✅ Seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding reels:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
    }
};

// Run the seed function
seedReels();
