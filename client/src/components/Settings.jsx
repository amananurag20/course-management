import React, { useState } from "react";
import { useSidebarWidth } from "../hooks/useSidebarWidth";

const Settings = () => {
  const { getContentStyle } = useSidebarWidth();
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      dueDateReminders: true,
      progressUpdates: false,
    },
    display: {
      theme: "dark",
      chartStyle: "modern",
    },
  });

  const handleNotificationChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleDisplayChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      display: {
        ...prev.display,
        [key]: value,
      },
    }));
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-6 transition-all duration-300"
      style={getContentStyle()}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <div className="grid gap-6">
          {/* Notification Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={() =>
                    handleNotificationChange("emailNotifications")
                  }
                  className="form-checkbox h-5 w-5 text-purple-600 rounded"
                />
                <span>Email notifications for new assignments</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.dueDateReminders}
                  onChange={() => handleNotificationChange("dueDateReminders")}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded"
                />
                <span>Due date reminders</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications.progressUpdates}
                  onChange={() => handleNotificationChange("progressUpdates")}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded"
                />
                <span>Progress report updates</span>
              </label>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={settings.display.theme}
                  onChange={(e) => handleDisplayChange("theme", e.target.value)}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-600"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Chart Style
                </label>
                <select
                  value={settings.display.chartStyle}
                  onChange={(e) =>
                    handleDisplayChange("chartStyle", e.target.value)
                  }
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-600"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
