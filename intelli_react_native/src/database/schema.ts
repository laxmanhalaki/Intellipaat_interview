export const CREATE_COURSES_TABLE = `
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    instructor TEXT NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    lessons_count INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL
  );
`;

export const CREATE_LESSONS_TABLE = `
  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );
`;

export const CREATE_LESSONS_COURSE_ID_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
`;

export const CREATE_COURSES_UPDATED_AT_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_courses_updated_at ON courses(updated_at DESC);
`;
