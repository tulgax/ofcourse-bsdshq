import React from 'react';

const CourseSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseSkeleton;