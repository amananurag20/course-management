const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, totalPoints } = req.body;

    // Check if course exists and user is instructor
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({
          message: "Not authorized to create assignments for this course",
        });
    }

    const assignment = new Assignment({
      title,
      description,
      course: courseId,
      dueDate,
      totalPoints,
    });

    await assignment.save();

    // Add assignment to course
    course.assignments.push(assignment._id);
    await course.save();

    res.status(201).json(assignment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating assignment", error: error.message });
  }
};

// Get all assignments for a course
const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId }).populate(
      "submissions.student",
      "name email"
    );

    res.json(assignments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

// Submit assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content, attachments } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if assignment is still active
    if (!assignment.isActive) {
      return res
        .status(400)
        .json({ message: "Assignment is no longer active" });
    }

    // Check if due date has passed
    if (new Date() > new Date(assignment.dueDate)) {
      return res
        .status(400)
        .json({ message: "Assignment due date has passed" });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(assignment.course);
    if (!course.students.includes(req.user.userId)) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      (sub) => sub.student.toString() === req.user.userId
    );

    if (existingSubmission) {
      return res
        .status(400)
        .json({ message: "Already submitted this assignment" });
    }

    assignment.submissions.push({
      student: req.user.userId,
      content,
      attachments,
    });

    await assignment.save();
    res.json({ message: "Assignment submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting assignment", error: error.message });
  }
};

// Grade assignment submission
const gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { grade, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if user is course instructor
    const course = await Course.findById(assignment.course);
    if (course.instructor.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to grade submissions" });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    await assignment.save();

    res.json({ message: "Submission graded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error grading submission", error: error.message });
  }
};

module.exports = {
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  gradeSubmission,
};
