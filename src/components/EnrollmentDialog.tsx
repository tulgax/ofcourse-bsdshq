import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { Course } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';

interface EnrollmentDialogProps {
  course: Course;
  onClose: () => void;
  onEnroll: () => void;
}

const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({ course, onClose, onEnroll }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleEnroll = async () => {
    setIsProcessing(true);
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      onEnroll();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Course Enrollment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4 text-sm md:text-base">{course.description}</p>
          <div className="border-t border-b py-2 mb-4">
            <div className="flex justify-between">
              <span>Course Price:</span>
              <span className="font-semibold">₮{course.price.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₮{course.price.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={handleEnroll}
          disabled={isProcessing}
          className={`w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            'Pay and Enroll'
          )}
        </button>
      </div>
    </div>
  );
};

export default EnrollmentDialog;