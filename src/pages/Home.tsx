import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to LMS Platform</h1>
        <p className="text-xl text-gray-600 mb-8">Discover, Learn, and Grow with Our Online Courses</p>
        <Link to="/courses" className="bg-primary-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary-600 transition duration-300">
          Explore Courses
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-primary-500" />
          <h2 className="text-xl font-semibold mb-2">Wide Range of Courses</h2>
          <p className="text-gray-600">Explore courses in various fields and enhance your skills.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Users size={48} className="mx-auto mb-4 text-primary-500" />
          <h2 className="text-xl font-semibold mb-2">Expert Instructors</h2>
          <p className="text-gray-600">Learn from industry professionals and experienced educators.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Award size={48} className="mx-auto mb-4 text-primary-500" />
          <h2 className="text-xl font-semibold mb-2">Earn Certificates</h2>
          <p className="text-gray-600">Get recognized for your achievements with course certificates.</p>
        </div>
      </section>

      <section className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>High-quality courses designed by experts</li>
          <li>Flexible learning schedule to fit your lifestyle</li>
          <li>Interactive learning experiences with hands-on projects</li>
          <li>Supportive community of learners and instructors</li>
          <li>Regular updates to keep content current and relevant</li>
        </ul>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
        <Link to="/register" className="bg-primary-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary-600 transition duration-300">
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default Home;