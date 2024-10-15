import React, { useState, useEffect } from 'react';
import { CheckCircle, Lock, Unlock, XCircle } from 'lucide-react';
import { CourseSection, markSectionAsCompleted, unmarkSectionAsCompleted, getSectionCompletionStatus } from '../services/courseService';
import { useAuth } from '../contexts/AuthContext';

interface CourseSectionListProps {
  courseId: string;
  sections: CourseSection[];
  isEnrolled: boolean;
}

const CourseSectionList: React.FC<CourseSectionListProps> = ({ courseId, sections, isEnrolled }) => {
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      if (user && isEnrolled) {
        const status = await getSectionCompletionStatus(courseId, user.uid);
        setCompletionStatus(status);
      }
    };

    fetchCompletionStatus();
  }, [courseId, user, isEnrolled]);

  const handleMarkAsCompleted = async (sectionId: string) => {
    if (user) {
      await markSectionAsCompleted(courseId, sectionId, user.uid);
      setCompletionStatus(prev => ({ ...prev, [sectionId]: true }));
    }
  };

  const handleUnmarkAsCompleted = async (sectionId: string) => {
    if (user) {
      await unmarkSectionAsCompleted(courseId, sectionId, user.uid);
      setCompletionStatus(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <h3 className="text-lg font-semibold mb-2 md:mb-0">{section.title}</h3>
            {isEnrolled ? (
              completionStatus[section.id] ? (
                <button
                  onClick={() => handleUnmarkAsCompleted(section.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition duration-300 flex items-center text-sm"
                >
                  <span className="mr-2">Unmark as completed</span>
                  <XCircle size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleMarkAsCompleted(section.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition duration-300 flex items-center text-sm"
                >
                  <span className="mr-2">Mark as completed</span>
                  <CheckCircle size={16} />
                </button>
              )
            ) : section.isLocked ? (
              <Lock className="text-gray-400" size={20} />
            ) : (
              <Unlock className="text-green-500" size={20} />
            )}
          </div>
          {(!section.isLocked || isEnrolled) && (
            <p className="text-gray-600 mt-2 text-sm">{section.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseSectionList;