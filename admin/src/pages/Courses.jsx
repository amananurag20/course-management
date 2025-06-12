import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdSchool,
  MdPeople,
  MdCalendarToday,
  MdMoreVert,
  MdRefresh,
  MdBook,
  MdAccessTime
} from 'react-icons/md';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../store/slices/courseSlice';

const CourseCard = ({ course, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleClickOutside = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={course.thumbnail || 'https://via.placeholder.com/800x400?text=Course+Thumbnail'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <MdMoreVert className="text-gray-600" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(course);
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <MdEdit className="mr-2" /> Edit Course
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(course._id);
                }}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
              >
                <MdDelete className="mr-2" /> Delete Course
              </button>
            </div>
          )}
        </div>
      </div>
      <div 
        className="p-6 cursor-pointer" 
        role="button"
        onClick={() => navigate(`/courses/${course._id}`)}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <MdPeople className="mr-1" />
            <span>{course.students?.length || 0} Students</span>
          </div>
          <div className="flex items-center">
            <MdBook className="mr-1" />
            <span>{course.modules?.length || 0} Modules</span>
          </div>
          <div className="flex items-center">
            <MdCalendarToday className="mr-1" />
            <span>{new Date(course.startDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    startDate: course?.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
    endDate: course?.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
    status: course?.status || 'draft',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">{course ? 'Edit Course' : 'Create New Course'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            Course Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startDate">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endDate">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {course ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Fetching courses...');
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    console.log('Current courses:', courses);
  }, [courses]);

  const handleCreateCourse = async (courseData) => {
    try {
      await dispatch(createCourse(courseData)).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      await dispatch(updateCourse({ id: selectedCourse._id, data: courseData })).unwrap();
      setShowForm(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error('Failed to update course:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await dispatch(deleteCourse(courseId)).unwrap();
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button
          onClick={() => {
            setSelectedCourse(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <MdAdd className="mr-2" /> Add New Course
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-red-600">{error}</span>
          <button
            onClick={() => dispatch(fetchCourses())}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <MdRefresh className="mr-1" /> Retry
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {showForm ? (
        <CourseForm
          course={selectedCourse}
          onSubmit={selectedCourse ? handleUpdateCourse : handleCreateCourse}
          onCancel={() => {
            setShowForm(false);
            setSelectedCourse(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredCourses) && filteredCourses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              onEdit={(course) => {
                setSelectedCourse(course);
                setShowForm(true);
              }}
              onDelete={handleDeleteCourse}
            />
          ))}
          {(!Array.isArray(filteredCourses) || filteredCourses.length === 0) && !loading && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No courses found. {searchTerm ? 'Try a different search term.' : 'Create your first course!'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses; 