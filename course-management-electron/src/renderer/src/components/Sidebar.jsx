import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MdDashboard,
  MdSchool,
  MdVideoLibrary,
  MdAssignment,
  MdInsights,
  MdSettings,
  MdChevronLeft,
  MdChevronRight,
  MdPerson,
  MdCode,
  MdLogout,
} from "react-icons/md";
import { useSidebar } from "../context/SidebarContext";
import { logout } from "../store/slices/authSlice";

function Sidebar() {
  const { isGlobalSidebarOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard size={24} />,
      path: "/dashboard",
    },
    {
      id: "courses",
      label: "Courses",
      icon: <MdSchool size={24} />,
      path: "/courses",
    },
    {
      id: "practice",
      label: "Practice",
      icon: <MdCode size={24} />,
      path: "/practice",
    },
    {
      id: "reels",
      label: "Reels",
      icon: <MdVideoLibrary size={24} />,
      path: "/reels",
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: <MdAssignment size={24} />,
      path: "/assignments",
    },
    {
      id: "progress",
      label: "Progress",
      icon: <MdInsights size={24} />,
      path: "/progress",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <MdSettings size={24} />,
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 bg-gray-700 hover:bg-gray-600 rounded-full shadow-lg 
          transition-all duration-300 text-gray-300 hover:text-white
          ${!isGlobalSidebarOpen ? "ml-0" : "ml-56"}`}
      >
        {!isGlobalSidebarOpen ? (
          <MdChevronRight size={24} />
        ) : (
          <MdChevronLeft size={24} />
        )}
      </button>

      <div
        className={`fixed left-0 top-0 h-screen bg-gray-800 text-white shadow-lg 
        transition-all duration-300 ease-in-out flex flex-col
        ${!isGlobalSidebarOpen ? "w-20" : "w-64"}`}
      >
        {/* Profile Section */}
        <button
          onClick={() => handleNavigation("/profile")}
          className={`w-full p-6 border-b border-gray-700 transition-all duration-300 hover:bg-gray-700
          ${!isGlobalSidebarOpen ? "flex justify-center" : ""}`}
        >
          <div
            className={`flex items-center ${
              !isGlobalSidebarOpen ? "justify-center" : "space-x-4"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl flex-shrink-0">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <MdPerson size={24} />
              )}
            </div>
            {isGlobalSidebarOpen && (
              <div className="transition-all duration-300 text-left">
                <h2 className="font-semibold">{user?.name || "User"}</h2>
                <p className="text-sm text-gray-400 capitalize">
                  {user?.role || "Student"}
                </p>
              </div>
            )}
          </div>
        </button>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center ${
                    !isGlobalSidebarOpen ? "justify-center" : "space-x-3"
                  } p-3 rounded-lg transition-all duration-200 group
                  ${
                    location.pathname === item.path
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-700 text-gray-300 hover:text-white"
                  }`}
                  title={!isGlobalSidebarOpen ? item.label : ""}
                >
                  <span className="transition-colors">{item.icon}</span>
                  {isGlobalSidebarOpen && (
                    <span className="transition-colors">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              !isGlobalSidebarOpen ? "justify-center" : "space-x-3"
            } p-3 rounded-lg transition-all duration-200
            hover:bg-red-500/10 text-red-400 hover:text-red-300`}
            title={!isGlobalSidebarOpen ? "Logout" : ""}
          >
            <span className="transition-colors">
              <MdLogout size={24} />
            </span>
            {isGlobalSidebarOpen && (
              <span className="transition-colors">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
