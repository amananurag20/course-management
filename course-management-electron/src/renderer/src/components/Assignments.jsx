import React, { useState } from "react";
import { format } from "date-fns";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { useSidebarWidth } from "../hooks/useSidebarWidth";

const Assignments = () => {
  const { getContentStyle } = useSidebarWidth();
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "React Fundamentals Quiz",
      dueDate: "2024-03-20",
      status: "pending",
    },
    {
      id: 2,
      title: "JavaScript Project",
      dueDate: "2024-03-25",
      status: "completed",
    },
    {
      id: 3,
      title: "TypeScript Exercise",
      dueDate: "2024-03-22",
      status: "pending",
    },
  ]);

  const handleDelete = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-6 transition-all duration-300"
      style={getContentStyle()}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assignments</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
            <MdAdd size={20} />
            <span>New Assignment</span>
          </button>
        </div>

        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">{assignment.title}</h3>
                  <p className="text-gray-400">
                    Due: {format(new Date(assignment.dueDate), "MMMM d, yyyy")}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        assignment.status === "completed"
                          ? "bg-green-900 text-green-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit assignment"
                  >
                    <MdEdit size={20} className="text-blue-400" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete assignment"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    <MdDelete size={20} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
