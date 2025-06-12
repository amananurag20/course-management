const Course = require("../models/Course");
const User = require("../models/User");
const McqQuestion = require("../models/McqQuestion");

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

    // Get user ID from request
    const userId = req.user?._id;
    console.log("userId",req.user);

    // Process modules to control data access
    const processedModules = course.modules.map((module, index) => {
      // Convert module to plain object for manipulation
      const moduleObj = module.toObject();

      // First module is always accessible with full data
      if (index === 0) {
        return moduleObj;
      }

      // For other modules, check if previous module has MCQ and completion status
      const prevModule = course.modules[index - 1];
      
      // If previous module has no MCQ, automatically give access to current module
      if (!prevModule.mcqQuestion) {
        return moduleObj;
      }

      // If previous module has MCQ, check if user has completed it
      const userExistsInPrevModule = prevModule.completedBy?.some(
        completion => completion.user.toString() === userId?.toString()
      );

      // If user exists in previous module's completedBy, send full data
      if (userExistsInPrevModule) {
        return moduleObj;
      }

      // If module is locked, remove resource URLs
      return {
        ...moduleObj,
        resources: moduleObj.resources.map(resource => ({
          _id: resource._id,
          title: resource.title,
          type: resource.type
        }))
      };
    });

    const processedCourse = {
      ...course.toObject(),
      modules: processedModules
    };

    res.json(processedCourse);
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

    // Check if user is instructor or admin
    if (course.instructor.toString() !== req.user.userId && req.user.role !== 'admin') {
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

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
};

// Module Management
const addModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.modules.push(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error adding module", error: error.message });
  }
};

const updateModule = async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.params;
    const course = await Course.findById(courseId);
    if (!course || !course.modules[moduleIndex]) {
      return res.status(404).json({ message: "Course or module not found" });
    }

    course.modules[moduleIndex] = { ...course.modules[moduleIndex].toObject(), ...req.body };
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error updating module", error: error.message });
  }
};

const deleteModule = async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.params;
    const course = await Course.findById(courseId);
    if (!course || !course.modules[moduleIndex]) {
      return res.status(404).json({ message: "Course or module not found" });
    }

    course.modules.splice(moduleIndex, 1);
    await course.save();
    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting module", error: error.message });
  }
};

// Resource Management
const addResource = async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.params;
    const course = await Course.findById(courseId);
    if (!course || !course.modules[moduleIndex]) {
      return res.status(404).json({ message: "Course or module not found" });
    }

    course.modules[moduleIndex].resources.push(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error adding resource", error: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const { courseId, moduleIndex, resourceIndex } = req.params;
    const course = await Course.findById(courseId);
    if (!course || !course.modules[moduleIndex] || !course.modules[moduleIndex].resources[resourceIndex]) {
      return res.status(404).json({ message: "Course, module, or resource not found" });
    }

    course.modules[moduleIndex].resources[resourceIndex] = {
      ...course.modules[moduleIndex].resources[resourceIndex].toObject(),
      ...req.body
    };
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error updating resource", error: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { courseId, moduleIndex, resourceIndex } = req.params;
    const course = await Course.findById(courseId);
    if (!course || !course.modules[moduleIndex] || !course.modules[moduleIndex].resources[resourceIndex]) {
      return res.status(404).json({ message: "Course, module, or resource not found" });
    }

    course.modules[moduleIndex].resources.splice(resourceIndex, 1);
    await course.save();
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resource", error: error.message });
  }
};

// Module MCQ Management
const getModuleMCQ = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const course = await Course.findById(courseId).populate("modules.mcqQuestion");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    const question = module.mcqQuestion || null;
    res.json({ questions: question ? [question] : [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching module quiz", error: error.message });
  }
};

const addModuleQuiz = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const quiz = await McqQuestion.create(req.body);
    module.mcqQuestion = quiz._id;
    await course.save();
    res.status(201).json({ moduleId, quiz });
  } catch (error) {
    res.status(500).json({ message: "Error adding module quiz", error: error.message });
  }
};

const updateModuleQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await McqQuestion.findByIdAndUpdate(quizId, req.body, { new: true, runValidators: true });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating module quiz", error: error.message });
  }
};

const deleteModuleQuiz = async (req, res) => {
  try {
    const { courseId, moduleId, quizId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    await McqQuestion.findByIdAndDelete(quizId);
    module.mcqQuestion = undefined;
    await course.save();
    res.json({ moduleId, quizId });
  } catch (error) {
    res.status(500).json({ message: "Error deleting module quiz", error: error.message });
  }
};

// Enrollment Management
const getEnrollments = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("students", "name email")
      .select("students");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course.students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error: error.message });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const [course, student] = await Promise.all([
      Course.findById(courseId),
      User.findById(studentId)
    ]);

    if (!course || !student) {
      return res.status(404).json({ message: "Course or student not found" });
    }

    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: "Student already enrolled" });
    }

    course.students.push(studentId);
    student.enrolledCourses.push(courseId);
    await Promise.all([course.save(), student.save()]);

    res.json({ message: "Student enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling student", error: error.message });
  }
};

const unenrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const [course, student] = await Promise.all([
      Course.findById(courseId),
      User.findById(studentId)
    ]);

    if (!course || !student) {
      return res.status(404).json({ message: "Course or student not found" });
    }

    course.students = course.students.filter(id => id.toString() !== studentId);
    student.enrolledCourses = student.enrolledCourses.filter(id => id.toString() !== courseId);
    await Promise.all([course.save(), student.save()]);

    res.json({ message: "Student unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unenrolling student", error: error.message });
  }
};

// Course Progress & Analytics
const getCourseProgress = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("students", "name email")
      .populate("modules.completedBy.user", "name email");
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const progress = course.modules.map(module => ({
      moduleId: module._id,
      title: module.title,
      totalStudents: course.students.length,
      completedCount: module.completedBy.length,
      completionRate: (module.completedBy.length / course.students.length) * 100,
      completedBy: module.completedBy
    }));

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course progress", error: error.message });
  }
};

const getCourseAnalytics = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("students", "name email")
      .populate("modules.completedBy.user", "name email");
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const analytics = {
      totalStudents: course.students.length,
      moduleCompletion: course.modules.map(module => ({
        moduleId: module._id,
        title: module.title,
        completionRate: (module.completedBy.length / course.students.length) * 100,
      })),
      overallProgress: course.modules.reduce((acc, module) => 
        acc + (module.completedBy.length / course.students.length), 0) / course.modules.length * 100
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course analytics", error: error.message });
  }
};

const getModuleCompletion = async (req, res) => {
  try {
    const { courseId, moduleIndex } = req.params;
    const course = await Course.findById(courseId);
    
    if (!course || !course.modules[moduleIndex]) {
      return res.status(404).json({ message: "Course or module not found" });
    }

    const module = course.modules[moduleIndex];
    const completion = {
      moduleId: module._id,
      title: module.title,
      totalStudents: course.students.length,
      completedCount: module.completedBy.length,
      completionRate: (module.completedBy.length / course.students.length) * 100,
      completedBy: module.completedBy
    };

    res.json(completion);
  } catch (error) {
    res.status(500).json({ message: "Error fetching module completion", error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addModule,
  updateModule,
  deleteModule,
  addResource,
  updateResource,
  deleteResource,
  getEnrollments,
  enrollStudent,
  unenrollStudent,
  getCourseProgress,
  getCourseAnalytics,
  getModuleCompletion,
  getModuleMCQ,
  addModuleQuiz,
  updateModuleQuiz,
  deleteModuleQuiz
};
