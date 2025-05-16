import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdPerson, MdSettings, MdLogout, MdExpandMore } from "react-icons/md";
import { logout } from "../store/slices/authSlice";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <MdPerson size={20} />,
      onClick: () => navigate("/profile"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <MdSettings size={20} />,
      onClick: () => navigate("/settings"),
    },
    {
      id: "logout",
      label: "Logout",
      icon: <MdLogout size={20} />,
      onClick: handleLogout,
      className: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <MdPerson size={20} />
          )}
        </div>
        <span className="text-sm font-medium text-gray-200">
          {user?.name || "User"}
        </span>
        <MdExpandMore
          size={20}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm font-medium text-gray-200">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors hover:bg-gray-700
                ${item.className || "text-gray-300 hover:text-white"}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
