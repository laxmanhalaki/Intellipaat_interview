import { getDatabase } from './database';
import { Lesson } from '../types/course';
import { Logger } from '../utils/logger';
import { DatabaseError } from '../types/errors';

export class LessonDao {
  /**
   * Retrieves all lessons for a given course ID from SQLite (Read-Only).
   */
  async getLessonsForCourse(courseId: number): Promise<Lesson[]> {
    try {
      const db = getDatabase();
      const result = await db.execute(
        `SELECT id, course_id AS courseId, title, completed 
         FROM lessons 
         WHERE course_id = ? 
         ORDER BY id ASC`,
        [courseId]
      );

      const rows = result.rows || [];
      return rows.map((r: any) => ({
        id: Number(r.id),
        courseId: Number(r.courseId),
        title: String(r.title),
        completed: Number(r.completed) === 1,
      }));
    } catch (error) {
      Logger.error('SQLITE', `Failed to get lessons for course ${courseId}`, error);
      throw new DatabaseError('Failed to load lessons from database.', undefined, error);
    }
  }

  /**
   * Bulk inserts or replaces lessons in SQLite during sync/initial load.
   */
  async insertLessonsBatch(lessons: Lesson[]): Promise<void> {
    try {
      const db = getDatabase();
      await db.transaction(async (tx) => {
        for (const lesson of lessons) {
          await tx.execute(
            `INSERT OR REPLACE INTO lessons (id, course_id, title, completed) 
             VALUES (?, ?, ?, ?)`,
            [lesson.id, lesson.courseId, lesson.title, lesson.completed ? 1 : 0]
          );
        }
      });
      Logger.info('SQLITE', `Successfully inserted batch of ${lessons.length} lessons`);
    } catch (error) {
      Logger.error('SQLITE', 'Failed to insert lessons batch', error);
      throw new DatabaseError('Failed to persist lessons to database.', undefined, error);
    }
  }
}

export const defaultLessonDao = new LessonDao();
