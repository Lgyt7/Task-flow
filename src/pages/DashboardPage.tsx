import { useMemo } from 'react';
import { useBoard } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { getActivities } from '../services/taskService';
import { formatRelativeDate } from '../services/storage';

export function DashboardPage() {
  const { tasks } = useBoard();
  const { users, user } = useAuth();
  const activities = getActivities();

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const review = tasks.filter((t) => t.status === 'review').length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const critical = tasks.filter((t) => t.priority === 'critical').length;
    const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date()).length;
    const myTasks = tasks.filter((t) => t.assigneeId === user?.id).length;
    return { total, todo, inProgress, review, done, critical, overdue, myTasks };
  }, [tasks, user]);

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const userTaskCounts = useMemo(() => {
    return users.map((u) => ({
      ...u,
      count: tasks.filter((t) => t.assigneeId === u.id).length,
    })).sort((a, b) => b.count - a.count);
  }, [tasks, users]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Overview of your project</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: stats.total, gradient: 'from-blue-500 to-purple-500', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { label: 'In Progress', value: stats.inProgress, gradient: 'from-purple-500 to-pink-500', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          { label: 'Completed', value: stats.done, gradient: 'from-green-500 to-teal-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Overdue', value: stats.overdue, gradient: 'from-red-500 to-orange-500', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Critical', value: stats.critical, gradient: 'from-orange-500 to-red-500', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' },
          { label: 'My Tasks', value: stats.myTasks, gradient: 'from-indigo-500 to-blue-500', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-[var(--text-secondary)]">{stat.label}</p>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Progress Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-secondary)]">Completion Rate</span>
                <span className="font-medium text-[var(--text-primary)]">{completionRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
            {[
              { label: 'To Do', count: stats.todo, color: 'bg-blue-500' },
              { label: 'In Progress', count: stats.inProgress, color: 'bg-purple-500' },
              { label: 'Review', count: stats.review, color: 'bg-amber-500' },
              { label: 'Done', count: stats.done, color: 'bg-green-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--text-secondary)]">{item.label}</span>
                  <span className="font-medium text-[var(--text-primary)]">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Team Workload</h3>
          <div className="space-y-4">
            {userTaskCounts.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <Avatar name={u.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{u.name}</p>
                  <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${Math.min((u.count / Math.max(...userTaskCounts.map((x) => x.count), 1)) * 100, 100)}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{u.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.slice(0, 10).map((act) => {
            const activityUser = users.find((u) => u.id === act.userId);
            return (
              <div key={act.id} className="flex items-start gap-3 text-sm">
                <Avatar name={activityUser?.name || 'Unknown'} size="sm" />
                <div className="flex-1">
                  <p className="text-[var(--text-secondary)]"><span className="font-medium text-[var(--text-primary)]">{activityUser?.name || 'Unknown'}</span> {act.description}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{formatRelativeDate(act.timestamp)}</p>
                </div>
              </div>
            );
          })}
          {activities.length === 0 && <p className="text-sm text-[var(--text-tertiary)]">No activity yet.</p>}
        </div>
      </div>
    </div>
  );
}
