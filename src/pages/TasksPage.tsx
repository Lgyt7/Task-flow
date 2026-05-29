import { useState, useMemo } from 'react';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { STATUS_LABELS, PRIORITY_LABELS, PRIORITY_COLORS, TaskStatus, Priority } from '../types';
import { formatRelativeDate } from '../services/storage';
import { CreateTaskModal } from '../components/task/CreateTaskModal';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function TasksPage() {
  const { tasks, setActiveTask } = useBoard();
  const { users, user } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      return true;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [tasks, search, filterStatus, filterPriority]);

  const statusColors: Record<TaskStatus, 'primary' | 'info' | 'warning' | 'success'> = {
    todo: 'primary',
    in_progress: 'info',
    review: 'warning',
    done: 'success',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">All Tasks</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{filtered.length} of {tasks.length} tasks</p>
        </div>
        {user && user.role !== 'viewer' && (
          <Button variant="gradient" size="sm" onClick={() => setShowCreate(true)} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          }>New Task</Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          } />
        </div>
        <div className="w-full sm:w-48">
          <Select options={statusOptions} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
        </div>
        <div className="w-full sm:w-48">
          <Select options={priorityOptions} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task) => {
          const assignee = users.find((u) => u.id === task.assigneeId);
          return (
            <div key={task.id} onClick={() => setActiveTask(task)} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 hover:shadow-md transition-all cursor-pointer animate-fadeIn">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }} />
                    <h3 className="font-semibold text-[var(--text-primary)] truncate">{task.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-1 mb-2">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusColors[task.status]}>{STATUS_LABELS[task.status]}</Badge>
                    <Badge variant={task.priority === 'critical' ? 'danger' : task.priority === 'high' ? 'warning' : 'default'}>{PRIORITY_LABELS[task.priority]}</Badge>
                    {task.tags.map((tag) => <Badge key={tag} variant="default">{tag}</Badge>)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {assignee && <Avatar name={assignee.name} size="sm" />}
                  <span className="text-xs text-[var(--text-tertiary)]">{formatRelativeDate(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--text-tertiary)]">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p>No tasks found</p>
          </div>
        )}
      </div>
      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
