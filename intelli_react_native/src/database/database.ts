import { open, DB } from '@op-engineering/op-sqlite';
import {
  CREATE_COURSES_TABLE,
  CREATE_LESSONS_TABLE,
  CREATE_LESSONS_COURSE_ID_INDEX,
  CREATE_COURSES_UPDATED_AT_INDEX,
} from './schema';
import { Logger } from '../utils/logger';
import { DatabaseError } from '../types/errors';

let dbInstance: DB | null = null;

export const getDatabase = (): DB => {
  if (!dbInstance) {
    try {
      Logger.info('SQLITE', 'Opening database CourseApp.db...');
      dbInstance = open({ name: 'CourseApp.db' });
      initSchema(dbInstance);
      Logger.info('SQLITE', 'Database CourseApp.db opened and schema initialized successfully.');
    } catch (error) {
      Logger.error('SQLITE', 'Failed to initialize database connection', error);
      throw new DatabaseError(
        'Unable to initialize offline storage.',
        'Database connection failed',
        error
      );
    }
  }
  return dbInstance;
};

export const initSchema = (db: DB): void => {
  try {
    db.executeSync('PRAGMA foreign_keys = ON;');
    db.executeSync(CREATE_COURSES_TABLE);
    db.executeSync(CREATE_LESSONS_TABLE);
    db.executeSync(CREATE_LESSONS_COURSE_ID_INDEX);
    db.executeSync(CREATE_COURSES_UPDATED_AT_INDEX);
  } catch (error) {
    Logger.error('SQLITE', 'Failed to initialize database schema', error);
    throw new DatabaseError(
      'Failed to create database tables.',
      'Schema execution error',
      error
    );
  }
};
