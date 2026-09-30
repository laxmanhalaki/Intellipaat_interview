import { ApiError } from '../types/errors';
import { MOCK_USER_CREDENTIALS } from '../api/mockData';
import { Logger } from '../utils/logger';

export interface UserSession {
  email: string;
  token: string;
}

export class AuthRepository {
  /**
   * Simulates authentication against predefined mock credentials.
   * Resolves on match; rejects with ApiError(401) on invalid credentials.
   */
  async login(email: string, password: string): Promise<UserSession> {
    Logger.info('AUTH', `Attempting login for user: ${email}`);

    // Simulate 1000ms network delay
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

    if (
      email.trim().toLowerCase() === MOCK_USER_CREDENTIALS.email &&
      password === MOCK_USER_CREDENTIALS.password
    ) {
      Logger.info('AUTH', 'Login successful. Session token generated.');
      return {
        email: MOCK_USER_CREDENTIALS.email,
        token: 'mock_jwt_token_student_123',
      };
    }

    Logger.warn('AUTH', 'Login rejected: Invalid credentials provided.');
    throw new ApiError(401, 'Invalid email or password');
  }
}

export const defaultAuthRepository = new AuthRepository();
