import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, login as authLogin, register as authRegister, logout as authLogout, getUsers } from '../services/authService';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string) => boolean;
  register: (name: string, email: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser);
  const [users, setUsers] = useState<User[]>(getUsers);

  const refreshUsers = useCallback(() => setUsers(getUsers()), []);

  const login = useCallback((email: string): boolean => {
    const loggedInUser = authLogin(email);
    if (loggedInUser) { setUser(loggedInUser); return true; }
    return false;
  }, []);

  const register = useCallback((name: string, email: string): boolean => {
    try {
      const newUser = authRegister(name, email);
      setUser(newUser);
      setUsers(getUsers());
      return true;
    } catch { return false; }
  }, []);

  const logout = useCallback(() => { authLogout(); setUser(null); }, []);

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin', refreshUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
