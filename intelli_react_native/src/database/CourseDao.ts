import { getDatabase } from './database';
import { Course } from '../types/course';
import { Logger } from '../utils/logger';
import { DatabaseError } from '../types/errors';

export class CourseDao {
  /**
   * Retrieves courses from SQLite with pagination support.
   */
  async getAllCourses(limit: number = 50, offset: number = 0): Promise<Course[]> {
    try {
      const db = getDatabase();
      const result = await db.execute(
        `SELECT id, title, instructor, progress, lessons_count AS lessons 
         FROM courses 
         ORDER BY updated_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const rows = result.rows || [];
      return rows.map((r: any) => ({
        id: Number(r.id),
        title: String(r.title),
        instructor: String(r.instructor),
        progress: Number(r.progress),
        lessons: Number(r.lessons),
      }));
    } catch (error) {
      Logger.error('SQLITE', 'Failed to retrieve courses from database', error);
      throw new DatabaseError('Failed to load cached courses.', undefined, error);
    }
  }

  /**
   * Retrieves a single course by its ID.
   */
  async getCourseById(courseId: number): Promise<Course | null> {
    try {
      const db = getDatabase();
      const result = await db.execute(
        `SELECT id, title, instructor, progress, lessons_count AS lessons 
         FROM courses 
         WHERE id = ? 
         LIMIT 1`,
        [courseId]
      );

      const rows = result.rows || [];
      if (rows.length === 0) return null;

      const r = rows[0] as any;
      return {
        id: Number(r.id),
        title: String(r.title),
        instructor: String(r.instructor),
        progress: Number(r.progress),
        lessons: Number(r.lessons),
      };
    } catch (error) {
      Logger.error('SQLITE', `Failed to get course ${courseId}`, error);
      throw new DatabaseError('Failed to load course details.', undefined, error);
    }
  }

  /**
   * Bulk upserts courses into SQLite within an atomic transaction.
   */
  async insertOrReplaceCourses(courses: Course[]): Promise<void> {
    try {
      const db = getDatabase();
      const now = Date.now();
      Logger.time('bulk_upsert_courses');

      await db.transaction(async (tx) => {
        for (const course of courses) {
          await tx.execute(
            `INSERT OR REPLACE INTO courses (id, title, instructor, progress, lessons_count, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [course.id, course.title, course.instructor, course.progress, course.lessons, now]
          );
        }
      });

      Logger.timeEnd('bulk_upsert_courses');
      Logger.info('SQLITE', `Successfully upserted ${courses.length} courses`);
    } catch (error) {
      Logger.error('SQLITE', 'Bulk course upsert failed', error);
      throw new DatabaseError('Failed to persist courses to offline storage.', undefined, error);
    }
  }
}

export const defaultCourseDao = new CourseDao();
