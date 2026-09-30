export interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  lessons: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  completed: boolean;
}

export interface LoginUiState {
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage: string | null;
  emailError: string | null;
  passwordError: string | null;
}

export type DashboardStatus = 'loading' | 'success' | 'empty' | 'error';

export interface DashboardUiState {
  status: DashboardStatus;
  courses: Course[];
  errorMessage: string | null;
  isFromCache: boolean;
  isRefreshing: boolean;
}

export interface CourseDetailsUiState {
  status: 'loading' | 'success' | 'error';
  course: Course | null;
  lessons: Lesson[];
  errorMessage: string | null;
}
