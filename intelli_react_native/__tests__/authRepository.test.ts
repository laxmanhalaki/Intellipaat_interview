import { AuthRepository } from '../src/repositories/authRepository';
import { ApiError } from '../src/types/errors';

describe('AuthRepository', () => {
  let authRepo: AuthRepository;

  beforeEach(() => {
    authRepo = new AuthRepository();
  });

  it('authenticates successfully with valid credentials', async () => {
    const session = await authRepo.login('student@example.com', 'secret123');
    expect(session).toBeDefined();
    expect(session.email).toBe('student@example.com');
    expect(session.token).toBeTruthy();
  });

  it('authenticates case-insensitively for email', async () => {
    const session = await authRepo.login('STUDENT@EXAMPLE.COM', 'secret123');
    expect(session.email).toBe('student@example.com');
  });

  it('throws 401 ApiError with invalid password', async () => {
    await expect(authRepo.login('student@example.com', 'wrongpassword')).rejects.toThrow(ApiError);
    await expect(authRepo.login('student@example.com', 'wrongpassword')).rejects.toMatchObject({
      statusCode: 401,
      userMessage: 'Invalid email or password',
    });
  });

  it('throws 401 ApiError with unknown email', async () => {
    await expect(authRepo.login('unknown@example.com', 'secret123')).rejects.toThrow(ApiError);
  });
});
