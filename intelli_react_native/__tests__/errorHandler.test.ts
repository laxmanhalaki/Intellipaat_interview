import { normalizeError } from '../src/utils/errorHandler';
import { AppError, ApiError, DatabaseError } from '../src/types/errors';

describe('Error Handler Utilities', () => {
  describe('normalizeError', () => {
    it('returns the same instance if already an AppError', () => {
      const err = new ApiError(404, 'Resource not found');
      const normalized = normalizeError(err);
      expect(normalized).toBe(err);
      expect(normalized.category).toBe('API');
    });

    it('wraps a standard JavaScript Error into an AppError', () => {
      const standardError = new Error('Disk full');
      const normalized = normalizeError(standardError, 'Storage failure');
      expect(normalized).toBeInstanceOf(AppError);
      expect(normalized.category).toBe('UNKNOWN');
      expect(normalized.userMessage).toBe('Storage failure');
      expect(normalized.technicalMessage).toContain('Disk full');
      expect(normalized.originalError).toBe(standardError);
    });

    it('wraps string errors properly', () => {
      const normalized = normalizeError('Network timeout');
      expect(normalized).toBeInstanceOf(AppError);
      expect(normalized.technicalMessage).toBe('Network timeout');
    });

    it('handles unexpected arbitrary objects or null', () => {
      const normalized = normalizeError({ code: 500 });
      expect(normalized).toBeInstanceOf(AppError);
      expect(normalized.technicalMessage).toBe('{"code":500}');
    });

    it('preserves DatabaseError properties', () => {
      const dbErr = new DatabaseError('Failed query', 'Syntax error');
      const normalized = normalizeError(dbErr);
      expect(normalized.category).toBe('DATABASE');
      expect(normalized.userMessage).toBe('Failed query');
    });
  });
});
