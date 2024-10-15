import React from 'react';
import { Book, Clock, Award } from 'lucide-react';

const UserDashboard: React.FC = () => {
  // Placeholder data for enrolled courses
  const enrolledCourses = [
    { id: 1, title: 'Introduction to React', progress: 60, lastAccessed: '2024-03-15' },
    { id: 2, title: 'Advanced JavaScript Concepts', progress: 30, lastAccessed: '2024-03-14' },
    { id: 3, title: 'Python for Data Science', progress: 80, lastAccessed: '2024-03-13' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Book size={32} className="text-blue-600 mb-2" />
          <h2 className="text-xl font-semibold mb-1">Enrolled Courses</h2>
          <p className="text-3xl font-bold">{enrolledCourses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Clock size={32} className="text-green-600 mb-2" />
          <h2 className="text-xl font-semibold mb-1">Hours Learned</h2>
          <p className="text-3xl font-bold">42</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Award size={32} className="text-yellow-600 mb-2" />
          <h2 className="text-xl font-semibold mb-1">Certificates Earned</h2>
          <p className="text-3xl font-bold">2</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
      <div className="space-y-4">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Progress: {course.progress}%</span>
              <span className="text-gray-600">Last accessed: {course.lastAccessed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;