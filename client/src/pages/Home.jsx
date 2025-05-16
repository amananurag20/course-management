import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Reels from "../components/Reels";
import Courses from "../components/Courses";
import Practice from "../components/Practice";

function Home() {
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Reels":
        return <Reels />;
      case "Courses":
        return <Courses />;
      case "Practice":
        return <Practice />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar onSelect={setSelectedComponent} />
      <div className="flex-1 p-4">{renderComponent()}</div>
    </div>
  );
}

export default Home;
