import NetInfo from '@react-native-community/netinfo';
import { CourseApi, defaultCourseApi } from '../api/courseApi';
import { CourseDao, defaultCourseDao } from '../database/CourseDao';
import { LessonDao, defaultLessonDao } from '../database/LessonDao';
import { Course, Lesson } from '../types/course';
import { NetworkError } from '../types/errors';
import { Logger } from '../utils/logger';

export interface GetCoursesResult {
  courses: Course[];
  isFromCache: boolean;
}

export class CourseRepository {
  private isSimulatedOffline = false;

  constructor(
    private api: CourseApi = defaultCourseApi,
    private courseDao: CourseDao = defaultCourseDao,
    private lessonDao: LessonDao = defaultLessonDao
  ) {}

  setSimulatedOffline(simulated: boolean): void {
    this.isSimulatedOffline = simulated;
    Logger.info('NETINFO', `Offline simulation set to: ${simulated}`);
  }

  getIsSimulatedOffline(): boolean {
    return this.isSimulatedOffline;
  }

  async getCourses(): Promise<GetCoursesResult> {
    const netState = await NetInfo.fetch();
    const isOnline = !this.isSimulatedOffline && (netState.isConnected ?? false);
    Logger.info(
      'NETINFO',
      `getCourses called. Network connected: ${netState.isConnected}, simulatedOffline: ${this.isSimulatedOffline}`
    );

    // 1. If connected, attempt remote fetch first
    if (isOnline) {
      try {
        const remoteCourses = await this.api.fetchCourses();
        // Persist fresh courses to SQLite for offline access
        try {
          await this.courseDao.insertOrReplaceCourses(remoteCourses);
        } catch (dbError) {
          Logger.warn('SQLITE', 'Failed to cache remote courses into SQLite', dbError);
        }
        return { courses: remoteCourses, isFromCache: false };
      } catch (apiError) {
        Logger.warn('API', 'Remote fetch failed. Falling back to SQLite cache...', apiError);
        // Fallback to SQLite cache on API or network failure
        const cached = await this.courseDao.getAllCourses();
        if (cached && cached.length > 0) {
          Logger.info('SQLITE', `Returning ${cached.length} cached courses after API error`);
          return { courses: cached, isFromCache: true };
        }
        throw new NetworkError('Unable to load courses. Please check your connection.');
      }
    }

    // 2. If offline, query SQLite directly
    Logger.info('SQLITE', 'Offline mode detected. Reading courses from SQLite cache...');
    const cached = await this.courseDao.getAllCourses();
    if (cached && cached.length > 0) {
      return { courses: cached, isFromCache: true };
    }

    throw new NetworkError('No internet connection and no cached courses found.');
  }

  async getCourseDetails(courseId: number): Promise<{ course: Course | null; lessons: Lesson[] }> {
    const course = await this.courseDao.getCourseById(courseId);
    let lessons = await this.lessonDao.getLessonsForCourse(courseId);

    // If lessons not yet cached in SQLite, fetch from API and cache
    if (!lessons || lessons.length === 0) {
      try {
        const remoteLessons = await this.api.fetchLessons(courseId);
        if (remoteLessons && remoteLessons.length > 0) {
          await this.lessonDao.insertLessonsBatch(remoteLessons);
          lessons = remoteLessons;
        }
      } catch (err) {
        Logger.warn('API', `Could not fetch remote lessons for course ${courseId}`, err);
      }
    }

    return { course, lessons };
  }
}

export const defaultCourseRepository = new CourseRepository();
