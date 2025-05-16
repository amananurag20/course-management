import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAccessTime,
  MdPeople,
  MdStar,
  MdCheck,
  MdChevronRight,
  MdSearch,
  MdFilterList,
} from "react-icons/md";
import { SidebarContext } from "../context/SidebarContext";

// Mock data for courses
const coursesData = [
  {
    id: 1,
    title: "Complete React Development",
    description: "Master modern React with Hooks, Context, Redux, and more",
    instructor: "John Doe",
    duration: "12 hours",
    level: "Intermediate",
    enrolled: true,
    rating: 4.8,
    students: 1234,
    thumbnail:
      "https://static.takeuforward.org/content/dsa-basic-2-advance-6djMbmGK",
    topics: ["React", "JavaScript", "Web Development"],
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    description: "Deep dive into JavaScript fundamentals and advanced patterns",
    instructor: "Jane Smith",
    duration: "15 hours",
    level: "Advanced",
    enrolled: false,
    rating: 4.9,
    students: 2156,
    thumbnail: "https://via.placeholder.com/300x200",
    topics: ["JavaScript", "Programming", "Web Development"],
  },
  {
    id: 3,
    title: "CSS Mastery",
    description: "Learn modern CSS techniques, Flexbox, Grid, and animations",
    instructor: "Mike Johnson",
    duration: "10 hours",
    level: "Beginner",
    enrolled: true,
    rating: 4.7,
    students: 1876,
    thumbnail: "https://via.placeholder.com/300x200",
    topics: ["CSS", "Web Design", "Frontend"],
  },
  {
    id: 4,
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js",
    instructor: "Sarah Wilson",
    duration: "18 hours",
    level: "Intermediate",
    enrolled: false,
    rating: 4.6,
    students: 1543,
    thumbnail: "https://via.placeholder.com/300x200",
    topics: ["Node.js", "Backend", "API Development"],
  },
];

const Courses = () => {
  const navigate = useNavigate();
  const { isGlobalSidebarOpen } = useContext(SidebarContext);
  const globalSidebarWidth = isGlobalSidebarOpen ? 250 : 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [enrolledFilter, setEnrolledFilter] = useState("all");

  // Filter courses based on search, level, and enrollment
  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || course.level.toLowerCase() === selectedLevel;
    const matchesEnrollment =
      enrolledFilter === "all" ||
      (enrolledFilter === "enrolled" && course.enrolled) ||
      (enrolledFilter === "not-enrolled" && !course.enrolled);

    return matchesSearch && matchesLevel && matchesEnrollment;
  });

  const handleCourseClick = (course) => {
    if (course.enrolled) {
      navigate(`/courses/${course.id}`);
    }
  };

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

        {/* Courses Grid - Adjust columns based on sidebar state */}
        <div
          className={`grid gap-6 transition-all duration-300 ${
            isGlobalSidebarOpen
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] ${
                course.enrolled ? "cursor-pointer hover:shadow-lg" : ""
              }`}
              onClick={() => handleCourseClick(course)}
            >
              {/* Course Image */}
              <div className="relative h-48">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.enrolled && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <MdCheck className="mr-1" />
                    Enrolled
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{course.title}</h3>
                  <div className="flex items-center text-yellow-400">
                    <MdStar />
                    <span className="ml-1 text-white">{course.rating}</span>
                  </div>
                </div>

                <p className="text-gray-400 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Meta */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <MdAccessTime className="mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <MdPeople className="mr-1" />
                    {course.students.toLocaleString()} students
                  </div>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Instructor and Level */}
                <div className="flex justify-between items-center text-sm">
                  <div className="text-purple-400">{course.instructor}</div>
                  <div className="text-gray-400">{course.level}</div>
                </div>

                {/* Action Button */}
                <button
                  className={`mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    course.enrolled
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {course.enrolled ? "Continue Learning" : "Enroll Now"}
                  <MdChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No courses found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
