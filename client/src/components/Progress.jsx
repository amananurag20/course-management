import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { format, startOfMonth, eachDayOfInterval } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  MdDownload,
  MdCalendarToday,
  MdTrendingUp,
  MdCheckCircle,
  MdAccessTime,
  MdPerson,
  MdEmail,
  MdSchool,
} from "react-icons/md";
import { useSidebarWidth } from "../hooks/useSidebarWidth";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock student data - replace with real data
const studentData = {
  name: "John Doe",
  email: "john.doe@example.com",
  studentId: "STU123456",
  course: "Full Stack Development",
  joinDate: "2024-01-15",
};

// Mock data - replace with real data from your backend
const mockProgressData = {
  monthlyProgress: {
    completed: 45,
    total: 100,
    dailyCompletions: Array.from({ length: 30 }, () =>
      Math.floor(Math.random() * 5)
    ),
  },
  courseProgress: {
    React: 75,
    JavaScript: 60,
    TypeScript: 40,
    "Node.js": 85,
    Python: 30,
  },
  timeSpent: {
    coding: 45,
    watching: 30,
    practice: 25,
  },
  recentAchievements: [
    { id: 1, title: "Completed React Basics", date: "2024-03-15" },
    { id: 2, title: "Solved 50 Exercises", date: "2024-03-14" },
    { id: 3, title: "7-Day Streak", date: "2024-03-13" },
  ],
};

const Progress = () => {
  const progressRef = useRef(null);
  const { getContentStyle } = useSidebarWidth();

  const generateDailyLabels = () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: today });
    return days.map((day) => format(day, "d MMM"));
  };

  // Line chart data for daily progress
  const dailyProgressData = {
    labels: generateDailyLabels(),
    datasets: [
      {
        label: "Exercises Completed",
        data: mockProgressData.monthlyProgress.dailyCompletions,
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.5)",
        tension: 0.4,
      },
    ],
  };

  // Bar chart data for course progress
  const courseProgressData = {
    labels: Object.keys(mockProgressData.courseProgress),
    datasets: [
      {
        label: "Course Completion (%)",
        data: Object.values(mockProgressData.courseProgress),
        backgroundColor: [
          "rgba(147, 51, 234, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  // Doughnut chart data for time distribution
  const timeDistributionData = {
    labels: ["Coding Practice", "Video Lessons", "Exercises"],
    datasets: [
      {
        data: Object.values(mockProgressData.timeSpent),
        backgroundColor: [
          "rgba(147, 51, 234, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: "transparent",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
    },
  };

  const downloadPDF = async () => {
    try {
      const contentElement = progressRef.current;
      const clone = contentElement.cloneNode(true);

      // Style and append the clone first
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.background = "rgb(17, 24, 39)";
      clone.style.width = "1200px";
      clone.style.transform = "none";
      document.body.appendChild(clone);

      // Process SVG and color issues before chart processing
      preprocessClone(clone);

      // Function to convert chart to image
      const chartToImage = async (originalCanvas) => {
        const originalChart = ChartJS.getChart(originalCanvas);
        if (!originalChart) return null;

        // Create a new canvas for the chart
        const newCanvas = document.createElement("canvas");
        newCanvas.width = 800;
        newCanvas.height = 400;
        const ctx = newCanvas.getContext("2d");

        // Set background
        ctx.fillStyle = "rgb(31, 41, 55)";
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // Create new chart configuration
        const newConfig = JSON.parse(JSON.stringify(originalChart.config));
        newConfig.options = {
          ...newConfig.options,
          animation: false,
          responsive: false,
          maintainAspectRatio: false,
          width: 800,
          height: 400,
          plugins: {
            ...newConfig.options?.plugins,
            legend: {
              ...newConfig.options?.plugins?.legend,
              labels: {
                ...newConfig.options?.plugins?.legend?.labels,
                color: "rgb(255, 255, 255)",
                font: { size: 14 },
              },
            },
          },
          scales:
            newConfig.type !== "doughnut"
              ? {
                  x: {
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    ticks: { color: "rgb(255, 255, 255)", font: { size: 12 } },
                  },
                  y: {
                    grid: { color: "rgba(255, 255, 255, 0.1)" },
                    ticks: { color: "rgb(255, 255, 255)", font: { size: 12 } },
                  },
                }
              : undefined,
        };

        // Update colors
        if (newConfig.type === "line") {
          newConfig.data.datasets[0].borderColor = "rgb(147, 51, 234)";
          newConfig.data.datasets[0].backgroundColor =
            "rgba(147, 51, 234, 0.5)";
          newConfig.data.datasets[0].borderWidth = 3;
        } else if (newConfig.type === "bar") {
          newConfig.data.datasets[0].backgroundColor = [
            "rgb(147, 51, 234)",
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
            "rgb(239, 68, 68)",
          ];
        } else if (newConfig.type === "doughnut") {
          newConfig.data.datasets[0].backgroundColor = [
            "rgb(147, 51, 234)",
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
          ];
        }

        // Create and render new chart
        const newChart = new ChartJS(ctx, newConfig);
        await new Promise((resolve) => {
          newChart.options.animation = {
            onComplete: () => resolve(),
          };
          newChart.update("none");
        });

        // Convert to image
        const imageUrl = newCanvas.toDataURL("image/png");
        newChart.destroy();
        return imageUrl;
      };

      // Process each chart container
      const chartContainers = clone.querySelectorAll('[class*="h-[300px]"]');

      // Add data-chart-id to original canvases for reference
      contentElement.querySelectorAll("canvas").forEach((canvas, index) => {
        canvas.setAttribute("data-chart-id", `chart-${index}`);
      });

      // Process each chart container
      for (const container of chartContainers) {
        const canvas = container.querySelector("canvas");
        if (canvas) {
          // Find corresponding original canvas
          const originalCanvas = contentElement.querySelector(
            `canvas[data-chart-id="${canvas.getAttribute("data-chart-id")}"]`
          );
          if (originalCanvas) {
            const imageUrl = await chartToImage(originalCanvas);
            if (imageUrl) {
              const img = document.createElement("img");
              img.src = imageUrl;
              img.style.width = "100%";
              img.style.height = "100%";
              img.style.objectFit = "contain";
              canvas.replaceWith(img);
            }
          }
        }
      }

      // Generate PDF with additional color handling
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "rgb(17, 24, 39)",
        logging: true,
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
        onclone: (clonedDoc) => {
          const style = document.createElement("style");
          style.textContent = `
            * {
              color: rgb(255, 255, 255) !important;
            }
            .bg-gray-800 {
              background-color: rgb(31, 41, 55) !important;
            }
            .bg-gray-900 {
              background-color: rgb(17, 24, 39) !important;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            [class*="text-"] {
              color: rgb(255, 255, 255) !important;
            }
            [class*="bg-"] {
              background-color: rgb(31, 41, 55) !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      // Remove clone after PDF generation
      document.body.removeChild(clone);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // Add header with branding
      pdf.setFillColor(147, 51, 234); // Purple color
      pdf.rect(0, 0, pageWidth, 25, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text("Learning Progress Report", pageWidth / 2, 15, {
        align: "center",
      });

      // Add student details
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(12);
      const studentDetails = [
        `Name: ${studentData.name}`,
        `Email: ${studentData.email}`,
        `Student ID: ${studentData.studentId}`,
        `Course: ${studentData.course}`,
        `Join Date: ${format(new Date(studentData.joinDate), "MMMM d, yyyy")}`,
        `Report Generated: ${format(new Date(), "MMMM d, yyyy")}`,
      ];

      studentDetails.forEach((detail, index) => {
        pdf.text(detail, margin, margin + 25 + index * 7);
      });

      // Calculate image dimensions to fit page width while maintaining aspect ratio
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If content is too tall, create multiple pages
      const maxHeightPerPage = pageHeight - margin * 2 - 80; // Account for header and margins
      let remainingHeight = imgHeight;
      let sourceY = 0;
      let currentPage = 0;

      while (remainingHeight > 0) {
        if (currentPage > 0) {
          pdf.addPage();
        }

        const heightOnThisPage = Math.min(remainingHeight, maxHeightPerPage);
        const sourceHeight = (heightOnThisPage / imgHeight) * canvas.height;

        pdf.addImage(
          canvas,
          "PNG",
          margin,
          currentPage === 0 ? margin + 70 : margin,
          imgWidth,
          heightOnThisPage,
          null,
          "FAST",
          0,
          sourceY
        );

        remainingHeight -= heightOnThisPage;
        sourceY += sourceHeight;
        currentPage++;
      }

      // Add footer on each page
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Generated from Course Management System - Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - margin,
          { align: "center" }
        );
      }

      // Save the PDF
      pdf.save(
        `progress-report-${studentData.name
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  const preprocessClone = (clone) => {
    // Convert all SVG icons to a simple div with background color
    const icons = clone.querySelectorAll("svg");
    icons.forEach((icon) => {
      const div = document.createElement("div");
      div.style.width = "24px";
      div.style.height = "24px";
      div.style.backgroundColor = "rgb(167, 139, 250)";
      div.style.borderRadius = "4px";
      icon.parentNode.replaceChild(div, icon);
    });

    // Handle any remaining Tailwind classes with oklch colors
    const elements = clone.getElementsByTagName("*");
    Array.from(elements).forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.color.includes("oklch")) {
        element.style.color = "rgb(255, 255, 255)";
      }
      if (computedStyle.backgroundColor.includes("oklch")) {
        element.style.backgroundColor = "rgb(31, 41, 55)";
      }
    });
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-6 transition-all duration-300"
      style={getContentStyle()}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Learning Progress</h1>
          <button
            onClick={downloadPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <MdDownload size={20} />
            <span>Download Report</span>
          </button>
        </div>

        <div ref={progressRef}>
          {/* Header with Student Info */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <MdPerson className="text-purple-400" size={20} />
                <span>{studentData.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MdEmail className="text-purple-400" size={20} />
                <span>{studentData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MdSchool className="text-purple-400" size={20} />
                <span>{studentData.course}</span>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-purple-400 mb-2">
                <MdCheckCircle size={24} />
                <span className="text-sm">Completion Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {mockProgressData.monthlyProgress.completed}%
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-400 mb-2">
                <MdTrendingUp size={24} />
                <span className="text-sm">Exercises Completed</span>
              </div>
              <div className="text-2xl font-bold">
                {mockProgressData.monthlyProgress.completed}/
                {mockProgressData.monthlyProgress.total}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-400 mb-2">
                <MdAccessTime size={24} />
                <span className="text-sm">Hours Spent</span>
              </div>
              <div className="text-2xl font-bold">
                {Object.values(mockProgressData.timeSpent).reduce(
                  (a, b) => a + b,
                  0
                )}
                h
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                <MdCalendarToday size={24} />
                <span className="text-sm">Current Streak</span>
              </div>
              <div className="text-2xl font-bold">7 days</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Progress Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Daily Progress</h2>
              <div className="h-[300px]">
                <Line data={dailyProgressData} options={chartOptions} />
              </div>
            </div>

            {/* Course Progress Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
              <div className="h-[300px]">
                <Bar data={courseProgressData} options={chartOptions} />
              </div>
            </div>

            {/* Time Distribution Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Time Distribution</h2>
              <div className="h-[300px]">
                <Doughnut
                  data={timeDistributionData}
                  options={doughnutOptions}
                />
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Recent Achievements
              </h2>
              <div className="space-y-4">
                {mockProgressData.recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-purple-400">
                        <MdCheckCircle size={20} />
                      </div>
                      <span>{achievement.title}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {format(new Date(achievement.date), "MMM d, yyyy")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
