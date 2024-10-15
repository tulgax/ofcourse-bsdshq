import { ref, get, set, push, query, orderByChild, equalTo, update, remove } from 'firebase/database';
import { database, auth } from '../firebase';

export interface Course {
  id: string;
  instructorId: string;
  instructorName: string;
  instructorPhotoURL?: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  category: string;
  image: string;
  sections: CourseSection[];
  enrollments?: number;
  earnings?: number;
  createdAt: number;
  rating?: number;
  enrolledStudents?: string[];
  isActive: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  content: string;
  isLocked: boolean;
}

export const getAllCourses = async (): Promise<Course[]> => {
  const coursesRef = ref(database, 'courses');
  const snapshot = await get(coursesRef);
  
  if (snapshot.exists()) {
    const coursesData = snapshot.val();
    return Object.keys(coursesData)
      .map(key => ({
        id: key,
        ...coursesData[key],
        sections: coursesData[key].sections.map((section: CourseSection, index: number) => ({
          ...section,
          id: section.id || `${key}-section-${index}`
        }))
      }))
      .filter(course => course.isActive);
  }
  
  return [];
};

export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> => {
  const coursesRef = ref(database, 'courses');
  const instructorCoursesQuery = query(coursesRef, orderByChild('instructorId'), equalTo(instructorId));
  const snapshot = await get(instructorCoursesQuery);
  
  if (snapshot.exists()) {
    const coursesData = snapshot.val();
    return Object.keys(coursesData).map(key => ({
      id: key,
      ...coursesData[key],
      sections: coursesData[key].sections.map((section: CourseSection, index: number) => ({
        ...section,
        id: section.id || `${key}-section-${index}`
      }))
    }));
  }
  
  return [];
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
  const courseRef = ref(database, `courses/${courseId}`);
  const snapshot = await get(courseRef);
  
  if (snapshot.exists()) {
    const courseData = snapshot.val();
    return {
      id: courseId,
      ...courseData,
      sections: courseData.sections.map((section: CourseSection, index: number) => ({
        ...section,
        id: section.id || `${courseId}-section-${index}`
      }))
    };
  }
  
  return null;
};

export const createCourse = async (courseData: Omit<Course, 'id'>): Promise<string> => {
  const coursesRef = ref(database, 'courses');
  const newCourseRef = push(coursesRef);
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('User must be logged in to create a course');
  }

  const instructorData = {
    instructorId: currentUser.uid,
    instructorName: currentUser.displayName || 'Unknown Instructor',
    instructorPhotoURL: currentUser.photoURL || '',
  };

  const courseWithSectionIds = {
    ...courseData,
    sections: courseData.sections.map((section, index) => ({
      ...section,
      id: `${newCourseRef.key}-section-${index}`
    }))
  };

  await set(newCourseRef, {
    ...courseWithSectionIds,
    ...instructorData,
    createdAt: Date.now(),
    isActive: true
  });
  return newCourseRef.key as string;
};

export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<void> => {
  const courseRef = ref(database, `courses/${courseId}`);
  await update(courseRef, courseData);
};

export const updateCourseStatus = async (courseId: string, isActive: boolean): Promise<void> => {
  const courseRef = ref(database, `courses/${courseId}`);
  await update(courseRef, { isActive });
};

export const enrollInCourse = async (courseId: string, userId: string): Promise<void> => {
  const courseRef = ref(database, `courses/${courseId}`);
  const courseSnapshot = await get(courseRef);
  
  if (courseSnapshot.exists()) {
    const courseData = courseSnapshot.val();
    const enrolledStudents = courseData.enrolledStudents || [];
    const enrollments = (courseData.enrollments || 0) + 1;
    const earnings = (courseData.earnings || 0) + courseData.price;

    if (!enrolledStudents.includes(userId)) {
      enrolledStudents.push(userId);
      await update(courseRef, {
        enrolledStudents,
        enrollments,
        earnings
      });
    }
  } else {
    throw new Error('Course not found');
  }
};

export const markSectionAsCompleted = async (courseId: string, sectionId: string, userId: string): Promise<void> => {
  const completionRef = ref(database, `courseCompletions/${courseId}/${userId}/${sectionId}`);
  await set(completionRef, true);
};

export const unmarkSectionAsCompleted = async (courseId: string, sectionId: string, userId: string): Promise<void> => {
  const completionRef = ref(database, `courseCompletions/${courseId}/${userId}/${sectionId}`);
  await remove(completionRef);
};

export const getSectionCompletionStatus = async (courseId: string, userId: string): Promise<Record<string, boolean>> => {
  const completionRef = ref(database, `courseCompletions/${courseId}/${userId}`);
  const snapshot = await get(completionRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  }
  
  return {};
};