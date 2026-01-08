import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAccessTime,
  MdPeople,
  MdStar,
  MdCheck,
  MdChevronRight,
  MdSearch,
  MdFilterList,
  MdError,
} from "react-icons/md";
import { SidebarContext } from "../context/SidebarContext";
import { courseService } from "../services/courseService";

const CourseCard = ({ course, isEnrolled, onEnroll, onNavigate }) => (
  <div
    className={`bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] ${
      isEnrolled ? "cursor-pointer hover:shadow-lg" : ""
    }`}
    onClick={() => isEnrolled && onNavigate(course._id)}
  >
    {/* Course Image */}
    <div className="relative h-48">
      <img
        src={course.thumbnail || "https://via.placeholder.com/300x200"}
        alt={course.title}
        className="w-full h-full object-cover"
      />
      {isEnrolled && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <MdCheck className="mr-1" />
          Enrolled
        </div>
      )}
    </div>

    {/* Course Content */}
    <div className="p-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-bold text-white">{course.title}</h3>
      </div>

      <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>

      {/* Course Meta */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center">
          <MdPeople className="mr-1" />
          {course.students?.length || 0} students
        </div>
      </div>

      {/* Instructor */}
      <div className="flex justify-between items-center text-sm">
        <div className="text-purple-400">
          {course.instructor?.name || "Instructor"}
        </div>
      </div>

      {/* Action Button */}
      {!isEnrolled ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnroll(course._id);
          }}
          className="mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300 bg-purple-600 hover:bg-purple-700"
        >
          Enroll Now
          <MdChevronRight className="ml-1" />
        </button>
      ) : (
        <button className="mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300 bg-green-600 hover:bg-green-700">
          Continue Learning
          <MdChevronRight className="ml-1" />
        </button>
      )}
    </div>
  </div>
);

const Courses = () => {
  const navigate = useNavigate();
  const { isGlobalSidebarOpen } = useContext(SidebarContext);
  const globalSidebarWidth = isGlobalSidebarOpen ? 250 : 0;

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [enrolledFilter, setEnrolledFilter] = useState("all");

  // Fetch courses and enrolled courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allCourses, profile] = await Promise.all([
          courseService.getAllCourses(),
          courseService.getEnrolledCourses(),
        ]);

        setCourses(allCourses);
        setEnrolledCourseIds(new Set(profile.map((course) => course._id)));
      } catch (err) {
        setError(err.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle course enrollment
  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollInCourse(courseId);
      setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
    } catch (err) {
      setError(err.message || "Failed to enroll in course");
    }
  };

  // Filter courses based on search, level, and enrollment
  const filteredCourses = courses.filter((course) => {
    const isEnrolled = enrolledCourseIds.has(course._id);
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || course.level?.toLowerCase() === selectedLevel;
    const matchesEnrollment =
      enrolledFilter === "all" ||
      (enrolledFilter === "enrolled" && isEnrolled) ||
      (enrolledFilter === "not-enrolled" && !isEnrolled);

    return matchesSearch && matchesLevel && matchesEnrollment;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-900 text-white transition-all duration-300"
      style={{ paddingLeft: `${globalSidebarWidth}px` }}
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-gray-400">
            Explore our comprehensive collection of courses
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 text-red-400 rounded-lg flex items-center">
            <MdError className="mr-2" size={20} />
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <MdSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={enrolledFilter}
              onChange={(e) => setEnrolledFilter(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="enrolled">Enrolled</option>
              <option value="not-enrolled">Not Enrolled</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div
          className={`grid gap-6 transition-all duration-300 ${
            isGlobalSidebarOpen
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isEnrolled={enrolledCourseIds.has(course._id)}
              onEnroll={handleEnroll}
              onNavigate={(courseId) => navigate(`/courses/${courseId}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
