import React, { useState, useEffect } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdPerson,
  MdMoreVert,
  MdEmail,
  MdPhone,
  MdCalendarToday,
} from 'react-icons/md';
import axios from 'axios';

const UserCard = ({ user, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-purple-600 bg-purple-50';
      case 'instructor':
        return 'text-blue-600 bg-blue-50';
      case 'student':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <MdPerson className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <MdEmail className="mr-2" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <MdPhone className="mr-2" />
                  {user.phone}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <MdCalendarToday className="mr-2" />
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MdMoreVert className="text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                <button
                  onClick={() => {
                    onEdit(user);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <MdEdit className="mr-2" /> Edit User
                </button>
                <button
                  onClick={() => {
                    onDelete(user._id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <MdDelete className="mr-2" /> Delete User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Status: {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button
            onClick={() => onEdit(user)}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Manage User →
          </button>
        </div>
      </div>
    </div>
  );
};

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'student',
    isActive: user?.isActive ?? true,
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const submitData = { ...formData };
    if (!submitData.password) {
      delete submitData.password;
    }
    delete submitData.confirmPassword;
    onSubmit(submitData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {user ? 'Edit User' : 'Create New User'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="input"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active Account
          </label>
        </div>

        {!user && (
          <>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                required={!user}
                minLength={6}
              />
            </div>

            <div>
              <label className="label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input"
                required={!user}
                minLength={6}
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {user ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await axios.post('/api/users', userData);
      fetchUsers();
      setShowForm(false);
    } catch (err) {
      setError('Failed to create user');
      console.error(err);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      await axios.put(`/api/users/${selectedUser._id}`, userData);
      fetchUsers();
      setShowForm(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <MdAdd className="mr-2" /> Add New User
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {showForm ? (
        <UserForm
          user={selectedUser}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={(user) => {
                setSelectedUser(user);
                setShowForm(true);
              }}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Users; 