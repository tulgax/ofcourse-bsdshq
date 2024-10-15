import React, { useEffect, useState } from 'react';
import { Book, Clock, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllCourses, Course, getSectionCompletionStatus } from '../services/courseService';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user) {
        try {
          const allCourses = await getAllCourses();
          const userEnrolledCourses = allCourses.filter(course => 
            course.enrolledStudents?.includes(user.uid)
          );
          setEnrolledCourses(userEnrolledCourses);

          // Fetch progress for each enrolled course
          const progressPromises = userEnrolledCourses.map(async (course) => {
            const completionStatus = await getSectionCompletionStatus(course.id, user.uid);
            const completedSections = Object.values(completionStatus).filter(Boolean).length;
            const progress = (completedSections / course.sections.length) * 100;
            return { [course.id]: progress };
          });

          const progressResults = await Promise.all(progressPromises);
          const combinedProgress = Object.assign({}, ...progressResults);
          setCourseProgress(combinedProgress);
        } catch (error) {
          console.error('Error fetching enrolled courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  const totalHoursLearned = enrolledCourses.reduce((total, course) => {
    const hours = parseInt(course.duration.split(' ')[0]);
    return isNaN(hours) ? total : total + hours;
  }, 0);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <Book size={32} className="text-blue-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold mb-1">Enrolled Courses</h2>
          <p className="text-2xl md:text-3xl font-bold">{enrolledCourses.length}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <Clock size={32} className="text-green-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold mb-1">Hours of Content</h2>
          <p className="text-2xl md:text-3xl font-bold">{totalHoursLearned}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <Award size={32} className="text-yellow-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold mb-1">Certificates Earned</h2>
          <p className="text-2xl md:text-3xl font-bold">0</p>
        </div>
      </div>
      <h2 className="text-xl md:text-2xl font-semibold mb-4">My Courses</h2>
      {enrolledCourses.length === 0 ? (
        <p className="text-center py-4">You haven't enrolled in any courses yet. <Link to="/courses" className="text-blue-600 hover:underline">Browse courses</Link></p>
      ) : (
        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <span className="text-gray-600 text-sm mb-2 md:mb-0">Instructor: {course.instructorName}</span>
                <span className="text-gray-600 text-sm">Duration: {course.duration}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{Math.round(courseProgress[course.id] || 0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${courseProgress[course.id] || 0}%` }}
                  ></div>
                </div>
              </div>
              <Link to={`/courses/${course.id}`} className="text-blue-600 hover:underline text-sm">
                Continue Learning
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;