export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'admin' | 'member' | 'viewer';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  creatorId: string;
  tags: string[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  userId: string;
  action: 'created' | 'updated' | 'moved' | 'assigned' | 'deleted';
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'task_created' | 'task_moved' | 'task_updated' | 'task_deleted' | 'user_joined' | 'comment_added';
  description: string;
  timestamp: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
};
