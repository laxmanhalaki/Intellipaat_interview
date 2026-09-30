import { validateEmail, validatePassword } from '../src/utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('returns null for valid email addresses', () => {
      expect(validateEmail('student@example.com')).toBeNull();
      expect(validateEmail('user.name+tag@domain.co.uk')).toBeNull();
      expect(validateEmail('test_123@test.io')).toBeNull();
    });

    it('returns error message for empty or missing email', () => {
      expect(validateEmail('')).toBe('Email is required');
      expect(validateEmail('   ')).toBe('Email is required');
    });

    it('returns error message for invalid email format', () => {
      expect(validateEmail('plainaddress')).toBe('Invalid email address');
      expect(validateEmail('@missingusername.com')).toBe('Invalid email address');
      expect(validateEmail('missingdomain@.com')).toBe('Invalid email address');
      expect(validateEmail('spaces in@address.com')).toBe('Invalid email address');
    });
  });

  describe('validatePassword', () => {
    it('returns null for passwords with 6 or more characters', () => {
      expect(validatePassword('secret123')).toBeNull();
      expect(validatePassword('123456')).toBeNull();
      expect(validatePassword('abcdefghijk')).toBeNull();
    });

    it('returns error message for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
      expect(validatePassword('   ')).toBe('Password is required');
    });

    it('returns error message for passwords shorter than 6 characters', () => {
      expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
      expect(validatePassword('abc')).toBe('Password must be at least 6 characters');
    });
  });
});
