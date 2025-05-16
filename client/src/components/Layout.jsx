import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileMenu from "./ProfileMenu";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-gray-900 overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-end px-6">
          <ProfileMenu />
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
