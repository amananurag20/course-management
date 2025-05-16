import React from "react";

function Dashboard({ isSidebarCollapsed }) {
  // Placeholder data - in real app, this would come from your backend
  const stats = {
    activeDays: 15,
    totalCourses: 8,
    completedCourses: 3,
    hoursSpent: 45,
  };

  // Sample active days data
  const activeDays = [2, 3, 5, 8, 10, 12, 15, 17, 19, 20];
  const today = new Date().getDate();

  const getDateStatus = (date) => {
    if (date > today) return null; // Future date
    if (activeDays.includes(date)) return "active";
    return "inactive";
  };

  const enrolledCourses = [
    {
      id: 1,
      name: "React Fundamentals",
      progress: 75,
      lastAccessed: "2024-03-20",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZaLogERBCv8WDo2fSO-AoC2qtfMWhHwBvaA&s",
      instructor: "John Doe",
      duration: "8 weeks",
    },
    {
      id: 2,
      name: "Advanced JavaScript",
      progress: 45,
      lastAccessed: "2024-03-19",
      image:
        "https://placehold.co/400x200/1a1a1a/969696.png?text=Advanced+JavaScript",
      instructor: "Jane Smith",
      duration: "10 weeks",
    },
    {
      id: 3,
      name: "Node.js Basics",
      progress: 30,
      lastAccessed: "2024-03-18",
      image:
        "https://placehold.co/400x200/1a1a1a/969696.png?text=Node.js+Basics",
      instructor: "Mike Johnson",
      duration: "6 weeks",
    },
    {
      id: 4,
      name: "Web Development",
      progress: 60,
      lastAccessed: "2024-03-17",
      image:
        "https://placehold.co/400x200/1a1a1a/969696.png?text=Web+Development",
      instructor: "Sarah Wilson",
      duration: "12 weeks",
    },
    {
      id: 4,
      name: "Web Development",
      progress: 60,
      lastAccessed: "2024-03-17",
      image:
        "https://placehold.co/400x200/1a1a1a/969696.png?text=Web+Development",
      instructor: "Sarah Wilson",
      duration: "12 weeks",
    },
    {
      id: 4,
      name: "Web Development",
      progress: 60,
      lastAccessed: "2024-03-17",
      image:
        "https://placehold.co/400x200/1a1a1a/969696.png?text=Web+Development",
      instructor: "Sarah Wilson",
      duration: "12 weeks",
    },
    {
      id: 4,
      name: "Web Development",
      progress: 60,
      lastAccessed: "2024-03-17",
      image:
        "https://placehold.co/400x200/1a1a1a/969696.png?text=Web+Development",
      instructor: "Sarah Wilson",
      duration: "12 weeks",
    },
  ];

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
  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

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
                2 new this month
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
                    Total Hours Spent
                  </h3>
                  <p className="text-4xl font-bold text-white mb-1">
                    {stats.hoursSpent}
                  </p>
                  <p className="text-sm text-gray-400">learning hours</p>
                </div>
                <div className="text-3xl bg-orange-500 bg-opacity-20 rounded-full p-3 text-orange-500">
                  ⏱️
                </div>
              </div>
              <div className="mt-4 text-sm text-orange-400">+5 hours today</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enrolled Courses List */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 text-white">
                Enrolled Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="relative">
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Enrolled
                      </span>
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-white">
                        {course.name}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-400">
                          <span className="mr-2">👨‍🏫</span>
                          {course.instructor}
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <span className="mr-2">⏱️</span>
                          {course.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <span className="mr-2">🕒</span>
                          Last accessed: {course.lastAccessed}
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-gray-400">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg max-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {currentMonth}
                  </h2>
                  <p className="text-sm text-gray-400">{currentYear}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                    <span className="text-gray-400">◀</span>
                  </button>
                  <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                    <span className="text-gray-400">▶</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {Array.from({ length: 31 }, (_, i) => {
                  const date = i + 1;
                  const status = getDateStatus(date);
                  const isToday = date === today;

                  return (
                    <div
                      key={i}
                      className={`relative p-2 rounded-lg transition-all duration-200 
                        ${
                          isToday
                            ? "bg-blue-500 shadow-lg shadow-blue-500/30"
                            : "hover:bg-gray-600"
                        } 
                        ${
                          status === "active"
                            ? "border border-green-500/30"
                            : ""
                        } 
                        ${
                          status === "inactive"
                            ? "border border-red-500/30"
                            : ""
                        }`}
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-sm ${
                            isToday ? "text-white font-bold" : "text-gray-300"
                          }`}
                        >
                          {date}
                        </span>
                        {status && (
                          <div
                            className={`mt-1 text-xs
                            ${
                              status === "active"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {status === "active" ? "✓" : "✗"}
                          </div>
                        )}
                      </div>
                      {status === "active" && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-300">Active Days</span>
                  </div>
                  <span className="text-sm text-green-400">
                    {activeDays.length} days
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-300">Current Day</span>
                  </div>
                  <span className="text-sm text-blue-400">
                    {today} {currentMonth}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
