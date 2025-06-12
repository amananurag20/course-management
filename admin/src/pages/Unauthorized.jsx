import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
          <div className="mt-4">
            <Link
              to="/"
              className="text-purple-600 hover:text-purple-500 font-medium"
            >
              Return to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 