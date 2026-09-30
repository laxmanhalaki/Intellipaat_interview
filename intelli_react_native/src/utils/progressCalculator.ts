/**
 * Calculates progress percentage rounded to the nearest integer.
 * @param completedLessons Number of completed lessons
 * @param totalLessons Total number of lessons in the course
 * @returns Progress percentage between 0 and 100
 */
export function calculateProgress(completedLessons: number, totalLessons: number): number {
  if (totalLessons <= 0) {
    return 0;
  }
  if (completedLessons <= 0) {
    return 0;
  }
  const percentage = Math.round((completedLessons / totalLessons) * 100);
  return Math.min(100, Math.max(0, percentage));
}
