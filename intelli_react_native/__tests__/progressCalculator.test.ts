import { calculateProgress } from '../src/utils/progressCalculator';

describe('calculateProgress', () => {
  it('should return 0 when totalLessons is 0 (prevent divide by zero)', () => {
    expect(calculateProgress(0, 0)).toBe(0);
    expect(calculateProgress(2, 0)).toBe(0);
  });

  it('should return 0% when no lessons are completed', () => {
    expect(calculateProgress(0, 4)).toBe(0);
  });

  it('should calculate 25% for 1 out of 4 lessons', () => {
    expect(calculateProgress(1, 4)).toBe(25);
  });

  it('should calculate 50% for 2 out of 4 lessons', () => {
    expect(calculateProgress(2, 4)).toBe(50);
  });

  it('should calculate 75% for 3 out of 4 lessons', () => {
    expect(calculateProgress(3, 4)).toBe(75);
  });

  it('should return 100% when all lessons are completed', () => {
    expect(calculateProgress(4, 4)).toBe(100);
  });

  it('should round to nearest whole integer', () => {
    // 1 / 3 = 33.33% -> 33%
    expect(calculateProgress(1, 3)).toBe(33);
    // 2 / 3 = 66.66% -> 67%
    expect(calculateProgress(2, 3)).toBe(67);
  });
});
