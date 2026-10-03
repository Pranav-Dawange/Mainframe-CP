import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
      <FileQuestion className="w-24 h-24 text-gray-300 mb-6" />
      <h1 className="text-4xl font-extrabold text-primary mb-2">404</h1>
      <h2 className="text-xl font-medium text-gray-600 mb-8">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">Return to Home</Link>
    </div>
  );
};

export default NotFound;
