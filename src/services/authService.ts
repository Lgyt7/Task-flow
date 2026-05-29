import { User, UserRole } from '../types';
import { getItem, setItem, removeItem, generateId } from './storage';

const USERS_KEY = 'taskflow_users';
const CURRENT_USER_KEY = 'taskflow_current_user';

const DEFAULT_USERS: User[] = [
  { id: 'admin-1', name: 'Alex Johnson', email: 'alex@taskflow.dev', avatar: 'AJ', role: 'admin', createdAt: new Date('2024-01-01').toISOString() },
  { id: 'user-1', name: 'Sarah Chen', email: 'sarah@taskflow.dev', avatar: 'SC', role: 'member', createdAt: new Date('2024-02-15').toISOString() },
  { id: 'user-2', name: 'Marcus Williams', email: 'marcus@taskflow.dev', avatar: 'MW', role: 'member', createdAt: new Date('2024-03-01').toISOString() },
  { id: 'user-3', name: 'Emily Rodriguez', email: 'emily@taskflow.dev', avatar: 'ER', role: 'viewer', createdAt: new Date('2024-03-15').toISOString() },
];

export function getUsers(): User[] {
  return getItem<User[]>(USERS_KEY, DEFAULT_USERS);
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(CURRENT_USER_KEY, null);
}

export function login(email: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (user) {
    setItem(CURRENT_USER_KEY, user);
    return user;
  }
  return null;
}

export function register(name: string, email: string): User {
  const users = getUsers();
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  const newUser: User = {
    id: generateId(), name, email, avatar: initials,
    role: 'member', createdAt: new Date().toISOString(),
  };
  setItem(USERS_KEY, [...users, newUser]);
  setItem(CURRENT_USER_KEY, newUser);
  return newUser;
}

export function logout(): void {
  removeItem(CURRENT_USER_KEY);
}

export function updateUserRole(userId: string, role: UserRole): User | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;
  users[index] = { ...users[index], role };
  setItem(USERS_KEY, users);
  return users[index];
}

export function deleteUser(userId: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== userId);
  if (filtered.length === users.length) return false;
  setItem(USERS_KEY, filtered);
  return true;
}
