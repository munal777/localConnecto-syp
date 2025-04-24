import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Import the icon from lucide-react
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col border-t-1 border-gray-200 items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      {/* Icon */}
      <AlertTriangle className="w-24 h-24 text-yellow-500 mb-4" />

      {/* Heading */}
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>

      {/* Subheading */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>

      {/* Description */}
      <p className="text-gray-600 mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Button to go back home */}
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;