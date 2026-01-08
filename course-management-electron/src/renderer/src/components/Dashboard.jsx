import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService";
import { userActivityService } from "../services/userActivityService";
import { useSelector } from "react-redux";
import { MdCheck, MdChevronLeft, MdChevronRight } from "react-icons/md";

function Dashboard({ isSidebarCollapsed }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { user } = useSelector((state) => state.auth);

  // Fetch enrolled courses and user activity
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, activity] = await Promise.all([
          courseService.getEnrolledCourses(),
          userActivityService.getMonthlyActivity(currentYear, currentMonth + 1),
        ]);

        // Profile data already contains populated course objects
        setEnrolledCourses(profileData);
        setUserActivity(activity);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonth, currentYear]);

  // Track user activity when component mounts
  useEffect(() => {
    const trackActivity = async () => {
      try {
        await userActivityService.trackActivity("course_access", {
          page: "dashboard",
        });
      } catch (err) {
        console.error("Failed to track activity:", err);
      }
    };

    trackActivity();
  }, []);

  const stats = {
    activeDays: userActivity.length,
    totalCourses: enrolledCourses.length,
    completedCourses: enrolledCourses.filter((course) => course.isCompleted)
      .length,
    hoursSpent: 45, // This would need to be calculated from activity data
  };

  const getDateStatus = (date) => {
    const activityDate = new Date(currentYear, currentMonth, date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activityDate > today) return "future"; // Future date
    if (activityDate.getTime() === today.getTime()) return "today"; // Today's date

    const hasActivity = userActivity.some((activity) => {
      const activityDay = new Date(activity.date).getDate();
      return activityDay === date;
    });

    return hasActivity ? "active" : "inactive";
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 w-full">
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } min-h-screen bg-gray-900`}
      >
        <div className="p-6 space-y-6 bg-gray-900">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">
                    Active Days this Month
                  </h3>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.activeDays}
                  </p>
                  <p className="text-sm text-gray-400">days active</p>
                </div>
                <div className="text-3xl bg-blue-500 bg-opacity-20 rounded-full p-3 text-blue-500">
                  📅
                </div>
              </div>
              <div className="mt-4 text-sm text-green-400">
                +12% from last month
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">
                    Total Enrolled Courses
                  </h3>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.totalCourses}
                  </p>
                  <p className="text-sm text-gray-400">courses enrolled</p>
                </div>
                <div className="text-3xl bg-purple-500 bg-opacity-20 rounded-full p-3 text-purple-500">
                  📚
                </div>
              </div>
              <div className="mt-4 text-sm text-purple-400">
                {enrolledCourses.length > 0
                  ? `${enrolledCourses.length} active courses`
                  : "No courses yet"}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">
                    Completed Courses
                  </h3>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.completedCourses}
                  </p>
                  <p className="text-sm text-gray-400">courses completed</p>
                </div>
                <div className="text-3xl bg-green-500 bg-opacity-20 rounded-full p-3 text-green-500">
                  🎓
                </div>
              </div>
              <div className="mt-4 text-sm text-green-400">Well done!</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2">
                    Hours Spent Learning
                  </h3>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.hoursSpent}
                  </p>
                  <p className="text-sm text-gray-400">total hours</p>
                </div>
                <div className="text-3xl bg-yellow-500 bg-opacity-20 rounded-full p-3 text-yellow-500">
                  ⏱️
                </div>
              </div>
              <div className="mt-4 text-sm text-yellow-400">
                Keep up the good work!
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enrolled Courses List */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 text-white">
                Enrolled Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    <div className="relative">
                      <img
                        src={
                          course.thumbnail ||
                          "https://via.placeholder.com/400x200"
                        }
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <MdCheck className="mr-1" />
                        Enrolled
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-white">
                        {course.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-400">
                          <span className="mr-2">👨‍🏫</span>
                          {course.instructor?.name || "Instructor"}
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <span className="mr-2">👥</span>
                          {course.students?.length || 0} students
                        </div>
                        {course.lastAccessed && (
                          <div className="flex items-center text-sm text-gray-400">
                            <span className="mr-2">🕒</span>
                            Last accessed:{" "}
                            {new Date(course.lastAccessed).toLocaleDateString()}
                          </div>
                        )}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-gray-400">
                              {course.progress || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${course.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {enrolledCourses.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-400 mb-4">
                      You haven't enrolled in any courses yet.
                    </p>
                    <button
                      onClick={() => navigate("/courses")}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg max-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {monthNames[currentMonth]}
                  </h2>
                  <p className="text-sm text-gray-400">{currentYear}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors flex items-center justify-center text-gray-400 hover:text-white"
                    aria-label="Previous month"
                  >
                    <MdChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors flex items-center justify-center text-gray-400 hover:text-white"
                    aria-label="Next month"
                  >
                    <MdChevronRight size={24} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 text-center mb-4">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="text-gray-400 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (date) => {
                    const status = getDateStatus(date);
                    return (
                      <div
                        key={date}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm
                        ${
                          status === "active"
                            ? "bg-purple-500 text-white"
                            : status === "inactive"
                            ? "bg-red-500/20 text-red-400"
                            : status === "today"
                            ? "bg-blue-500 text-white ring-2 ring-blue-400"
                            : "text-gray-600"
                        }
                        ${
                          status !== "future"
                            ? "hover:scale-105 transition-transform cursor-pointer"
                            : ""
                        }
                        `}
                        title={
                          status === "active"
                            ? "Active day"
                            : status === "inactive"
                            ? "Inactive day"
                            : status === "today"
                            ? "Today"
                            : "Future date"
                        }
                      >
                        {date}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
