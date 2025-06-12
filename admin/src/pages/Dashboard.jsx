import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  MdPeople, 
  MdSchool, 
  MdQuiz, 
  MdCode, 
  MdAssignment,
  MdAdd,
  MdTrendingUp,
  MdPerson,
  MdAccessTime,
  MdCheckCircle,
  MdPending,
  MdNotifications,
  MdRefresh
} from 'react-icons/md';
import { courseService } from '../services/courseService';
import { userService } from '../services/userService';
import { mcqService } from '../services/mcqService';
import { problemService } from '../services/problemService';

// Chart component (you can replace this with a proper chart library like recharts)
const SimpleBarChart = ({ data }) => (
  <div className="flex items-end space-x-2 h-40">
    {data.map((item, index) => (
      <div key={index} className="flex flex-col items-center">
        <div 
          className="w-8 bg-purple-500 rounded-t"
          style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
        ></div>
        <span className="text-xs mt-1">{item.label}</span>
      </div>
    ))}
  </div>
);

const StatCard = ({ icon: Icon, title, value, change, bgColor, onClick }) => (
  <div 
    className={`${bgColor} rounded-xl p-6 shadow-lg transition-transform hover:scale-105 cursor-pointer`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
        <Icon size={24} className="text-gray-700" />
      </div>
    </div>
    {change && (
      <p className="mt-4 text-sm">
        <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
        {' '}vs last month
      </p>
    )}
  </div>
);

const QuickActionCard = ({ icon: Icon, title, description, to }) => (
  <Link 
    to={to}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
  >
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
        <Icon size={24} className="text-purple-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalQuizzes: 0,
    totalProblems: 0,
    recentActivity: [],
    courseProgress: [],
    userEngagement: [],
    loading: true,
    error: null,
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Mock data for demonstration - replace with real data from your API
      const mockCourseProgress = [
        { label: 'Mon', value: 65 },
        { label: 'Tue', value: 75 },
        { label: 'Wed', value: 85 },
        { label: 'Thu', value: 78 },
        { label: 'Fri', value: 90 },
        { label: 'Sat', value: 82 },
        { label: 'Sun', value: 88 }
      ];

      // Fetch all statistics in parallel with error handling
      const [usersRes, coursesRes, mcqsRes, problemsRes] = await Promise.all([
        userService.getAll().catch(err => ({ data: [] })),
        courseService.getAll().catch(err => ({ data: [] })),
        mcqService.getAll().catch(err => ({ data: [] })),
        problemService.getAll().catch(err => ({ data: [] }))
      ]);

      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalCourses: coursesRes.data?.length || 0,
        totalQuizzes: mcqsRes.data?.length || 0,
        totalProblems: problemsRes.data?.length || 0,
        courseProgress: mockCourseProgress,
        loading: false,
        recentActivity: generateRecentActivity(coursesRes.data || [], usersRes.data || []),
        error: null
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard statistics. Please try again.'
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const generateRecentActivity = (courses, users) => {
    const activities = [
      ...(courses?.slice(0, 3) || []).map(course => ({
        icon: MdSchool,
        title: `New course: ${course.title || 'Untitled Course'}`,
        timestamp: new Date(course.createdAt).toLocaleDateString(),
        status: 'Active',
        type: 'success'
      })),
      ...(users?.slice(0, 3) || []).map(user => ({
        icon: MdPeople,
        title: `New user: ${user.name || 'Anonymous User'}`,
        timestamp: new Date(user.createdAt).toLocaleDateString(),
        status: 'Registered',
        type: 'info'
      }))
    ];
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
        <div className="text-center text-red-500 mb-4">
          {stats.error}
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <MdRefresh className="mr-2" />
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-purple-100">Here's what's happening in your learning platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={MdPeople}
          title="Total Users"
          value={stats.totalUsers}
          change={5.27}
          bgColor="bg-blue-50"
          onClick={() => window.location.href = '/users'}
        />
        <StatCard
          icon={MdSchool}
          title="Total Courses"
          value={stats.totalCourses}
          change={2.15}
          bgColor="bg-green-50"
          onClick={() => window.location.href = '/courses'}
        />
        <StatCard
          icon={MdQuiz}
          title="Total Quizzes"
          value={stats.totalQuizzes}
          change={-0.98}
          bgColor="bg-purple-50"
          onClick={() => window.location.href = '/mcq-questions'}
        />
        <StatCard
          icon={MdCode}
          title="Total Problems"
          value={stats.totalProblems}
          change={3.45}
          bgColor="bg-orange-50"
          onClick={() => window.location.href = '/problems'}
        />
      </div>

      {/* Course Progress and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Course Progress</h2>
          <SimpleBarChart data={stats.courseProgress} />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MdCheckCircle className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium">Completion Rate</p>
                  <p className="text-lg font-semibold">85%</p>
                </div>
              </div>
              <MdTrendingUp className="text-green-500 text-2xl" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MdAccessTime className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium">Average Time</p>
                  <p className="text-lg font-semibold">45 mins</p>
                </div>
              </div>
              <MdTrendingUp className="text-blue-500 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <Link to="/activity" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <activity.icon size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  activity.type === 'success' ? 'bg-green-100 text-green-800' :
                  activity.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pending Tasks</h2>
            <Link to="/tasks" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <MdPending className="text-yellow-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Course Reviews Pending</p>
                    <p className="text-xs text-gray-500">5 courses need review</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm font-medium text-yellow-600 hover:text-yellow-700">
                  Review
                </button>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MdAssignment className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Assignment Grading</p>
                    <p className="text-xs text-gray-500">12 assignments pending</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm font-medium text-purple-600 hover:text-purple-700">
                  Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 