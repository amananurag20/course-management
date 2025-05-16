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

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("instructor", "name email");

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
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already enrolled
    if (course.students.includes(req.user.userId)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    course.students.push(req.user.userId);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { enrolledCourses: course._id },
    });

    res.json({ message: "Successfully enrolled in course" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error enrolling in course", error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  enrollInCourse,
};
