import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { Task, TaskStatus, Column, Comment, TaskHistory } from '../types';
import { getTasks, createTask, updateTask, reorderTask, deleteTask as deleteTaskService, getComments as getCommentsService, addComment as addCommentService, getHistory } from '../services/taskService';
import { useAuth } from './AuthContext';

const STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
const STATUS_TITLES: Record<TaskStatus, string> = { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Done' };

interface BoardContextType {
  columns: Column[];
  tasks: Task[];
  activeTask: Task | null;
  comments: Comment[];
  history: TaskHistory[];
  setActiveTask: (task: Task | null) => void;
  loadComments: (taskId: string) => void;
  loadHistory: (taskId: string) => void;
  addComment: (taskId: string, content: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Task;
  editTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  moveTask: (taskId: string, newStatus: TaskStatus, newOrder: number) => void;
  removeTask: (taskId: string) => void;
  refresh: () => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<TaskHistory[]>([]);

  const refresh = useCallback(() => setTasks(getTasks()), []);

  const columns: Column[] = useMemo(() =>
    STATUS_ORDER.map((status) => ({
      id: status,
      title: STATUS_TITLES[status],
      tasks: tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order),
    })), [tasks]);

  const loadComments = useCallback((taskId: string) => setComments(getCommentsService(taskId)), []);
  const loadHistory = useCallback((taskId: string) => setHistory(getHistory(taskId)), []);

  const addComment = useCallback((taskId: string, content: string) => {
    if (!user) return;
    setComments((prev) => [...prev, addCommentService(taskId, user.id, content)]);
  }, [user]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Task => {
    const newTask = createTask(taskData);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, []);

  const editTask = useCallback((taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    if (!user) return;
    const updated = updateTask(taskId, updates, user.id);
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setActiveTask((prev) => (prev?.id === taskId ? updated : prev));
    }
  }, [user]);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus, newOrder: number) => {
    if (!user) return;
    reorderTask(taskId, newStatus, newOrder, user.id);
    setTasks(getTasks());
  }, [user]);

  const removeTask = useCallback((taskId: string) => {
    if (!user) return;
    deleteTaskService(taskId, user.id);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setActiveTask((prev) => (prev?.id === taskId ? null : prev));
  }, [user]);

  return (
    <BoardContext.Provider value={{ columns, tasks, activeTask, comments, history, setActiveTask, loadComments, loadHistory, addComment, addTask, editTask, moveTask, removeTask, refresh }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard(): BoardContextType {
  const context = useContext(BoardContext);
  if (!context) throw new Error('useBoard must be used within a BoardProvider');
  return context;
}
