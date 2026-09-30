import { Course, Lesson } from '../types/course';

export const MOCK_USER_CREDENTIALS = {
  email: 'student@example.com',
  password: 'secret123',
} as const;

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Python Programming',
    instructor: 'John Smith',
    progress: 50,
    lessons: 4,
  },
  {
    id: 2,
    title: 'Generative AI',
    instructor: 'Sarah Williams',
    progress: 25,
    lessons: 4,
  },
  {
    id: 3,
    title: 'Full Stack Development',
    instructor: 'David Brown',
    progress: 25,
    lessons: 4,
  },
];

export const MOCK_LESSONS: Record<number, Lesson[]> = {
  1: [
    { id: 101, courseId: 1, title: 'Introduction', completed: true },
    { id: 102, courseId: 1, title: 'Variables & Data Types', completed: true },
    { id: 103, courseId: 1, title: 'Functions', completed: false },
    { id: 104, courseId: 1, title: 'Object Oriented Programming', completed: false },
  ],
  2: [
    { id: 201, courseId: 2, title: 'Generative AI Basics', completed: true },
    { id: 202, courseId: 2, title: 'Prompt Engineering', completed: false },
    { id: 203, courseId: 2, title: 'LLM Fine-tuning', completed: false },
    { id: 204, courseId: 2, title: 'RAG Architecture', completed: false },
  ],
  3: [
    { id: 301, courseId: 3, title: 'HTML & CSS Fundamentals', completed: true },
    { id: 302, courseId: 3, title: 'JavaScript & React', completed: false },
    { id: 303, courseId: 3, title: 'Node.js & Express', completed: false },
    { id: 304, courseId: 3, title: 'Database Design', completed: false },
  ],
};
