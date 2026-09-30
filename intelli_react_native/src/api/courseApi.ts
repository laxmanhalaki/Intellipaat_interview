import { Course, Lesson } from '../types/course';
import { ApiError } from '../types/errors';
import { MOCK_COURSES, MOCK_LESSONS } from './mockData';
import { Logger } from '../utils/logger';

export interface CourseApi {
  fetchCourses(): Promise<Course[]>;
  fetchLessons(courseId: number): Promise<Lesson[]>;
}

export class MockCourseApi implements CourseApi {
  private shouldFailNext = false;
  private delayMs: number;

  constructor(delayMs = 800) {
    this.delayMs = delayMs;
  }

  /**
   * Diagnostic helper to simulate a transient network/server failure.
   */
  public setFailNext(fail: boolean): void {
    this.shouldFailNext = fail;
  }

  async fetchCourses(): Promise<Course[]> {
    Logger.info('API', 'Fetching remote courses (simulated)...');
    await new Promise<void>((resolve) => setTimeout(() => resolve(), this.delayMs));

    if (this.shouldFailNext) {
      this.shouldFailNext = false;
      Logger.warn('API', 'Simulated 500 error triggered for fetchCourses');
      throw new ApiError(500, 'Unable to load courses. Please check your connection.');
    }

    Logger.info('API', `Successfully fetched ${MOCK_COURSES.length} courses from remote API`);
    return JSON.parse(JSON.stringify(MOCK_COURSES));
  }

  async fetchLessons(courseId: number): Promise<Lesson[]> {
    Logger.info('API', `Fetching remote lessons for course ${courseId}...`);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), this.delayMs));

    const lessons = MOCK_LESSONS[courseId] || [];
    return JSON.parse(JSON.stringify(lessons));
  }
}

export const defaultCourseApi = new MockCourseApi();
