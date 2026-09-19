import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../api/client';

interface User {
  username: string;
  role: 'admin' | 'tech';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, username: string, role: 'admin' | 'tech') => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await apiFetch<User>('/api/auth/me');
        setUser(userData);
      } catch (err) {
        // If token is expired or invalid, clear session
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCurrentUser();
  }, [token]);

  const login = (newToken: string, username: string, role: 'admin' | 'tech') => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser({ username, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};