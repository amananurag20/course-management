const Course = require("../models/Course");
const User = require("../models/User");

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, startDate, endDate, modules } = req.body;
    const course = new Course({
      title,
      description,
      instructor: req.user.userId,
      startDate,
      endDate,
      modules,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};

// Get all courses (with optional filters)
const getCourses = async (req, res) => {
  try {
    const { search, instructor, isActive } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (instructor) {
      query.instructor = instructor;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .populate("students", "name email")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("students", "name email")
      .populate("assignments");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Resources are already embedded in the modules, no need to populate
    console.log("Course data:", JSON.stringify(course, null, 2));
    res.json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is instructor
    if (course.instructor.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this course" });
    }

    // If updating modules, validate the resources
    if (req.body.modules) {
      req.body.modules = req.body.modules.map((module) => ({
        ...module,
        resources: module.resources || [],
      }));
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
      .populate("instructor", "name email")
      .populate("students", "name email")
      .populate("assignments");

    res.json(updatedCourse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

// Enroll in course
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;

    // First check if user is already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Add user to course students using $addToSet to prevent duplicates
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { students: userId } },
      { new: true }
    );

    // Add course to user's enrolled courses using $addToSet
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    // Get updated course details
    const updatedCourse = await Course.findById(courseId)
      .populate("instructor", "name email")
      .populate("students", "name email");

    res.json({
      message: "Successfully enrolled in course",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      message: "Error enrolling in course",
      error: error.message,
    });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  enrollInCourse,
};
