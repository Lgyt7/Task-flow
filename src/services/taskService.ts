import { Task, TaskStatus, TaskHistory, Comment, Activity } from '../types';
import { getItem, setItem, generateId } from './storage';

const TASKS_KEY = 'taskflow_tasks';
const HISTORY_KEY = 'taskflow_history';
const COMMENTS_KEY = 'taskflow_comments';
const ACTIVITIES_KEY = 'taskflow_activities';

const DEFAULT_TASKS: Task[] = [
  { id: 'task-1', title: 'Design new landing page', description: 'Create a modern landing page with hero section, features grid, and CTA.', status: 'todo', priority: 'high', assigneeId: 'user-1', creatorId: 'admin-1', tags: ['design', 'frontend'], dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(), order: 0 },
  { id: 'task-2', title: 'Implement user authentication', description: 'Set up JWT-based auth with login, registration, and OAuth support.', status: 'todo', priority: 'critical', assigneeId: 'user-2', creatorId: 'admin-1', tags: ['backend', 'security'], dueDate: new Date(Date.now() + 5 * 86400000).toISOString(), createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(), order: 1 },
  { id: 'task-3', title: 'Build API rate limiter', description: 'Implement rate limiting middleware using Redis cache.', status: 'in_progress', priority: 'medium', assigneeId: 'user-2', creatorId: 'admin-1', tags: ['backend', 'performance'], dueDate: new Date(Date.now() + 10 * 86400000).toISOString(), createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(), order: 0 },
  { id: 'task-4', title: 'Create dashboard charts', description: 'Build interactive charts for the analytics dashboard.', status: 'in_progress', priority: 'high', assigneeId: 'user-1', creatorId: 'admin-1', tags: ['frontend', 'analytics'], dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 0.5 * 86400000).toISOString(), order: 1 },
  { id: 'task-5', title: 'Write API documentation', description: 'Document all REST API endpoints using OpenAPI/Swagger.', status: 'review', priority: 'low', assigneeId: 'user-3', creatorId: 'admin-1', tags: ['docs'], dueDate: new Date(Date.now() + 14 * 86400000).toISOString(), createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 0.3 * 86400000).toISOString(), order: 0 },
  { id: 'task-6', title: 'Fix navigation bug on mobile', description: 'Hamburger menu does not close when clicking outside.', status: 'review', priority: 'high', assigneeId: 'user-1', creatorId: 'admin-1', tags: ['bug', 'mobile'], dueDate: new Date(Date.now() + 1 * 86400000).toISOString(), createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 0.1 * 86400000).toISOString(), order: 1 },
  { id: 'task-7', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', status: 'done', priority: 'medium', assigneeId: 'user-2', creatorId: 'admin-1', tags: ['devops', 'automation'], dueDate: new Date(Date.now() - 1 * 86400000).toISOString(), createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(), order: 0 },
  { id: 'task-8', title: 'Refactor state management', description: 'Migrate to cleaner state management with better TypeScript support.', status: 'done', priority: 'medium', assigneeId: 'user-1', creatorId: 'admin-1', tags: ['refactoring', 'frontend'], dueDate: null, createdAt: new Date(Date.now() - 21 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(), order: 1 },
];

export function getTasks(): Task[] {
  return getItem<Task[]>(TASKS_KEY, DEFAULT_TASKS);
}

export function getTaskById(id: string): Task | undefined {
  return getTasks().find((t) => t.id === id);
}

export function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Task {
  const tasks = getTasks();
  const statusTasks = tasks.filter((t) => t.status === task.status);
  const maxOrder = statusTasks.length > 0 ? Math.max(...statusTasks.map((t) => t.order)) : -1;
  const newTask: Task = { ...task, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), order: maxOrder + 1 };
  setItem(TASKS_KEY, [...tasks, newTask]);
  addHistory(newTask.id, task.creatorId, 'created', 'status', '', task.status);
  addActivity(task.creatorId, 'task_created', `Created task "${task.title}"`);
  return newTask;
}

export function updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>, userId: string): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;
  const oldTask = tasks[index];
  const updatedTask = { ...oldTask, ...updates, updatedAt: new Date().toISOString() };
  if (updates.status && updates.status !== oldTask.status) {
    addHistory(taskId, userId, 'moved', 'status', oldTask.status, updates.status);
    addActivity(userId, 'task_moved', `Moved "${oldTask.title}" to ${updates.status.replace('_', ' ')}`);
  }
  if (updates.assigneeId && updates.assigneeId !== oldTask.assigneeId) {
    addHistory(taskId, userId, 'assigned', 'assignee', oldTask.assigneeId || 'unassigned', updates.assigneeId);
  }
  setItem(TASKS_KEY, [...tasks.slice(0, index), updatedTask, ...tasks.slice(index + 1)]);
  return updatedTask;
}

export function reorderTask(taskId: string, newStatus: TaskStatus, newOrder: number, userId: string): void {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;
  const oldStatus = tasks[taskIndex].status;
  const task = { ...tasks[taskIndex], status: newStatus, updatedAt: new Date().toISOString() };
  let updatedTasks = tasks.filter((_, i) => i !== taskIndex);
  const statusTasks = updatedTasks.filter((t) => t.status === newStatus).sort((a, b) => a.order - b.order);
  statusTasks.splice(newOrder, 0, task);
  const reordered = statusTasks.map((t, i) => ({ ...t, order: i }));
  updatedTasks = updatedTasks.filter((t) => t.status !== newStatus).concat(reordered);
  setItem(TASKS_KEY, updatedTasks);
  if (oldStatus !== newStatus) {
    addHistory(taskId, userId, 'moved', 'status', oldStatus, newStatus);
    addActivity(userId, 'task_moved', `Moved "${task.title}" to ${newStatus.replace('_', ' ')}`);
  }
}

export function deleteTask(taskId: string, userId: string): boolean {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return false;
  setItem(TASKS_KEY, tasks.filter((t) => t.id !== taskId));
  addActivity(userId, 'task_deleted', `Deleted task "${task.title}"`);
  return true;
}

export function getHistory(taskId: string): TaskHistory[] {
  return getItem<TaskHistory[]>(HISTORY_KEY, []).filter((h) => h.taskId === taskId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function addHistory(taskId: string, userId: string, action: TaskHistory['action'], field: string, oldValue: string, newValue: string): void {
  const history = getItem<TaskHistory[]>(HISTORY_KEY, []);
  history.push({ id: generateId(), taskId, userId, action, field, oldValue, newValue, timestamp: new Date().toISOString() });
  setItem(HISTORY_KEY, history);
}

export function getComments(taskId: string): Comment[] {
  return getItem<Comment[]>(COMMENTS_KEY, []).filter((c) => c.taskId === taskId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addComment(taskId: string, userId: string, content: string): Comment {
  const comments = getItem<Comment[]>(COMMENTS_KEY, []);
  const comment: Comment = { id: generateId(), taskId, userId, content, createdAt: new Date().toISOString() };
  setItem(COMMENTS_KEY, [...comments, comment]);
  addActivity(userId, 'comment_added', 'Added a comment');
  return comment;
}

export function getActivities(): Activity[] {
  return getItem<Activity[]>(ACTIVITIES_KEY, []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function addActivity(userId: string, type: Activity['type'], description: string): void {
  const activities = getItem<Activity[]>(ACTIVITIES_KEY, []);
  activities.unshift({ id: generateId(), userId, type, description, timestamp: new Date().toISOString() });
  setItem(ACTIVITIES_KEY, activities.slice(0, 100));
}
