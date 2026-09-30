import React, { createContext, useContext, useState, useCallback } from 'react';
import { defaultAuthRepository, UserSession } from '../repositories/authRepository';
import { Logger } from '../utils/logger';

interface AuthContextValue {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);

  const login = useCallback(async (email: string, pass: string) => {
    const session = await defaultAuthRepository.login(email, pass);
    setUser(session);
    Logger.info('AUTH', `User logged in: ${session.email}`);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    Logger.info('AUTH', 'User logged out.');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => useContext(AuthContext);
