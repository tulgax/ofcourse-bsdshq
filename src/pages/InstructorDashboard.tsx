import React, { useEffect, useState } from 'react';
import { Users, DollarSign, BookOpen, Edit, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCoursesByInstructor, updateCourseStatus, Course } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';
import CourseSkeleton from '../components/CourseSkeleton';

const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      if (user) {
        try {
          const fetchedCourses = await getCoursesByInstructor(user.uid);
          setCourses(fetchedCourses);
          
          // Calculate total enrollments and earnings
          const enrollments = fetchedCourses.reduce((sum, course) => sum + (course.enrollments || 0), 0);
          const earnings = fetchedCourses.reduce((sum, course) => sum + ((course.price || 0) * (course.enrollments || 0)), 0);
          
          setTotalEnrollments(enrollments);
          setTotalEarnings(earnings);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourses();
  }, [user]);

  const handleToggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      await updateCourseStatus(courseId, !currentStatus);
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, isActive: !currentStatus } : course
      ));
    } catch (error) {
      console.error('Error updating course status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}₮`;
  };

  return (
    <div className="space-y-8 px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Instructor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <BookOpen size={32} className="text-blue-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold mb-1">Total Courses</h2>
          <p className="text-2xl md:text-3xl font-bold">{courses.length}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <Users size={32} className="text-green-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold mb-1">Total Enrollments</h2>
          <p className="text-2xl md:text-3xl font-bold">{totalEnrollments}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <DollarSign size={32} className="text-yellow-600 mb-2" />
          <h2 className="text-lg md:text-xl font-semibold mb-1">Total Earnings</h2>
          <p className="text-2xl md:text-3xl font-bold">{formatCurrency(totalEarnings)}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-0">My Courses</h2>
        <Link to="/instructor/create-course" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center text-sm md:text-base">
          <Plus size={20} className="mr-2" />
          Create New Course
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <CourseSkeleton />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <p className="text-center py-4">You haven't created any courses yet. Click "Create New Course" to get started!</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm">Enrollments: {course.enrollments || 0}</p>
                <p className="text-gray-600 text-sm">Earnings: {formatCurrency((course.price || 0) * (course.enrollments || 0))}</p>
                <p className={`text-sm ${course.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <Link to={`/instructor/edit-course/${course.id}`} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300 flex items-center justify-center text-sm">
                  <Edit size={16} className="mr-2" />
                  Edit
                </Link>
                <button
                  onClick={() => handleToggleCourseStatus(course.id, course.isActive)}
                  className={`${
                    course.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white px-4 py-2 rounded-md transition duration-300 flex items-center justify-center text-sm`}
                >
                  {course.isActive ? (
                    <>
                      <ToggleRight size={16} className="mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} className="mr-2" />
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;