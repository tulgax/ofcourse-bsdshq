import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Book, Award, ArrowLeft, User } from 'lucide-react';
import { getCourse, Course, enrollInCourse } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';
import EnrollmentDialog from '../components/EnrollmentDialog';
import CourseSectionList from '../components/CourseSectionList';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (id) {
          const fetchedCourse = await getCourse(id);
          setCourse(fetchedCourse);
          // Check if the user is enrolled
          setIsEnrolled(fetchedCourse?.enrolledStudents?.includes(user?.uid || '') || false);
        } else {
          setError("Course ID is missing");
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    setShowEnrollmentDialog(true);
  };

  const handleEnrollmentComplete = async () => {
    if (course && user) {
      try {
        await enrollInCourse(course.id, user.uid);
        setIsEnrolled(true);
        setCourse(prevCourse => ({
          ...prevCourse!,
          enrolledStudents: [...(prevCourse?.enrolledStudents || []), user.uid]
        }));
      } catch (error) {
        console.error('Error enrolling in course:', error);
        setError('Failed to enroll in the course. Please try again.');
      }
    }
    setShowEnrollmentDialog(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !course) {
    return <div className="text-center py-8 text-red-600">Error: {error || "Course not found"}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/courses" className="flex items-center text-blue-600 mb-4">
        <ArrowLeft className="mr-2" size={20} />
        <span className="text-sm">Back to Courses</span>
      </Link>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <img src={course.image || `https://source.unsplash.com/random/1200x400?coding,${course.id}`} alt={course.title} className="w-full h-48 md:h-64 object-cover" />
        <div className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{course.title}</h1>
          <div className="flex flex-col md:flex-row md:items-center mb-6">
            <div className="flex items-center mb-2 md:mb-0 md:mr-4">
              {course.instructorPhotoURL ? (
                <img 
                  src={course.instructorPhotoURL} 
                  alt={course.instructorName} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
              )}
              <div>
                <p className="font-semibold">Instructor</p>
                <p>{course.instructorName}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center space-x-4">
              <div className="flex items-center">
                <Clock className="text-gray-400 mr-1" size={16} />
                <span className="text-sm">{course.duration}</span>
              </div>
              <div className="flex items-center">
                <Award className="text-gray-400 mr-1" size={16} />
                <span className="text-sm">{course.level}</span>
              </div>
              <div className="flex items-center">
                <Book className="text-gray-400 mr-1" size={16} />
                <span className="text-sm">{course.category}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 mb-6">{course.description}</p>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <span className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">₮{course.price.toLocaleString()}</span>
            {!isEnrolled ? (
              <button 
                onClick={handleEnroll}
                className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Enroll Now
              </button>
            ) : (
              <span className="text-green-600 font-semibold">Enrolled</span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-4">Course Content</h2>
          <CourseSectionList courseId={course.id} sections={course.sections} isEnrolled={isEnrolled} />
        </div>
      </div>
      {showEnrollmentDialog && (
        <EnrollmentDialog
          course={course}
          onClose={() => setShowEnrollmentDialog(false)}
          onEnroll={handleEnrollmentComplete}
        />
      )}
    </div>
  );
};

export default CourseDetails;