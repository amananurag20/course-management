import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MdDashboard, 
  MdSchool, 
  MdQuiz, 
  MdCode, 
  MdPeople, 
  MdAssignment,
  MdLogout,
  MdMenu,
  MdClose,
  MdPerson,
  MdNotifications
} from 'react-icons/md';
import { logout } from '../../store/slices/authSlice';

const navItems = [
  { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MdSchool, label: 'Courses', path: '/courses' },
  { icon: MdQuiz, label: 'MCQ Questions', path: '/mcq-questions' },
  { icon: MdCode, label: 'Problems', path: '/problems' },
  { icon: MdPeople, label: 'Users', path: '/users' },
  { icon: MdAssignment, label: 'Assignments', path: '/assignments' },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white shadow-lg lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/dashboard" className="text-xl font-bold text-purple-600">
              Admin Panel
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <MdClose size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 mb-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`mr-3 h-6 w-6 ${
                    isActive ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <div className="px-3 py-2 rounded-lg mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <MdPerson className="text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              <MdLogout className="mr-3 h-6 w-6" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <MdMenu size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <MdNotifications size={24} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 