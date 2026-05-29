import { useEffect, useState } from 'react';
import { useBoard } from '../../contexts/BoardContext';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { TaskStatus, Priority, STATUS_LABELS, PRIORITY_LABELS, PRIORITY_COLORS } from '../../types';
import { formatDate, formatRelativeDate } from '../../services/storage';

const statusOptions: { value: string; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: { value: string; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function TaskModal() {
  const { activeTask, setActiveTask, comments, history, loadComments, loadHistory, addComment, editTask, removeTask } = useBoard();
  const { users, user } = useAuth();
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editAssignee, setEditAssignee] = useState('');

  useEffect(() => {
    if (activeTask) {
      loadComments(activeTask.id);
      loadHistory(activeTask.id);
    }
  }, [activeTask?.id]);

  if (!activeTask) return null;

  const assignee = users.find((u) => u.id === activeTask.assigneeId);
  const creator = users.find((u) => u.id === activeTask.creatorId);
  const isViewer = user?.role === 'viewer';
  const canEdit = !isViewer;

  const handleSave = () => {
    const updates: Record<string, string> = {};
    if (editTitle !== activeTask.title) updates.title = editTitle;
    if (editDesc !== activeTask.description) updates.description = editDesc;
    if (editStatus !== activeTask.status) updates.status = editStatus as TaskStatus;
    if (editPriority !== activeTask.priority) updates.priority = editPriority as Priority;
    if (editAssignee !== (activeTask.assigneeId || '')) updates.assigneeId = editAssignee || null;
    if (Object.keys(updates).length > 0) editTask(activeTask.id, updates);
    setEditing(false);
  };

  const startEditing = () => {
    setEditTitle(activeTask.title);
    setEditDesc(activeTask.description);
    setEditStatus(activeTask.status);
    setEditPriority(activeTask.priority);
    setEditAssignee(activeTask.assigneeId || '');
    setEditing(true);
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    addComment(activeTask.id, comment.trim());
    setComment('');
  };

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      removeTask(activeTask.id);
    }
  };

  const isOverdue = activeTask.dueDate && new Date(activeTask.dueDate) < new Date();

  return (
    <Modal isOpen={!!activeTask} onClose={() => setActiveTask(null)} title="" size="xl">
      <div className="space-y-6">
        {editing ? (
          <div className="space-y-4">
            <Input label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Description</label>
              <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={4} className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Select label="Status" options={statusOptions} value={editStatus} onChange={(e) => setEditStatus(e.target.value)} />
              <Select label="Priority" options={priorityOptions} value={editPriority} onChange={(e) => setEditPriority(e.target.value)} />
              <Select label="Assignee" options={[{ value: '', label: 'Unassigned' }, ...users.filter((u) => u.role !== 'viewer').map((u) => ({ value: u.id, label: u.name }))]} value={editAssignee} onChange={(e) => setEditAssignee(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[activeTask.priority] }} />
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{activeTask.title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <Badge variant={activeTask.status === 'done' ? 'success' : activeTask.status === 'review' ? 'warning' : activeTask.status === 'in_progress' ? 'info' : 'primary'}>{STATUS_LABELS[activeTask.status]}</Badge>
                  <Badge variant={activeTask.priority === 'critical' ? 'danger' : activeTask.priority === 'high' ? 'warning' : activeTask.priority === 'medium' ? 'primary' : 'default'}>{PRIORITY_LABELS[activeTask.priority]}</Badge>
                  <span>Created {formatRelativeDate(activeTask.createdAt)}</span>
                  {activeTask.dueDate && <span className={isOverdue ? 'text-[var(--accent-danger)]' : ''}>Due {formatRelativeDate(activeTask.dueDate)}</span>}
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-2 shrink-0">
                  <Button variant="secondary" size="sm" onClick={startEditing} icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  }>Edit</Button>
                  {user?.role === 'admin' && (
                    <Button variant="danger" size="sm" onClick={handleDelete} icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      }>Delete</Button>
                  )}
                </div>
              )}
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed">{activeTask.description}</p>

            {activeTask.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeTask.tags.map((tag) => <Badge key={tag} variant="default">{tag}</Badge>)}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-tertiary)]">Assignee:</span>
                {assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={assignee.name} size="sm" />
                    <span className="text-[var(--text-primary)]">{assignee.name}</span>
                  </div>
                ) : <span className="text-[var(--text-tertiary)]">Unassigned</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-tertiary)]">Creator:</span>
                {creator && <div className="flex items-center gap-2"><Avatar name={creator.name} size="sm" /><span className="text-[var(--text-primary)]">{creator.name}</span></div>}
              </div>
            </div>

            {activeTask.dueDate && (
              <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-[var(--accent-danger)]' : 'text-[var(--text-secondary)]'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Due {formatDate(activeTask.dueDate)}
              </div>
            )}
          </>
        )}

        <div className="border-t border-[var(--border-color)] pt-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-wider">Comments</h3>
          <div className="space-y-4 mb-4">
            {comments.length === 0 && <p className="text-sm text-[var(--text-tertiary)]">No comments yet.</p>}
            {comments.map((c) => {
              const commentUser = users.find((u) => u.id === c.userId);
              return (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={commentUser?.name || 'Unknown'} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--text-primary)]">{commentUser?.name || 'Unknown'}</span>
                      <span className="text-xs text-[var(--text-tertiary)]">{formatRelativeDate(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{c.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {canEdit && (
            <div className="flex gap-2">
              <input value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }} placeholder="Write a comment..." className="flex-1 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent" />
              <Button size="sm" onClick={handleSendComment} disabled={!comment.trim()}>Send</Button>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--border-color)] pt-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-wider">Activity History</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {history.length === 0 && <p className="text-sm text-[var(--text-tertiary)]">No history yet.</p>}
            {history.map((h) => {
              const historyUser = users.find((u) => u.id === h.userId);
              return (
                <div key={h.id} className="flex items-start gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--text-secondary)]">
                      <span className="font-medium text-[var(--text-primary)]">{historyUser?.name || 'Unknown'}</span>
                      {' '}{h.action === 'created' ? 'created' : h.action === 'moved' ? `moved from ${h.oldValue.replace('_', ' ')} to ${h.newValue.replace('_', ' ')}` : h.action === 'assigned' ? `assigned to ${users.find((u) => u.id === h.newValue)?.name || h.newValue}` : h.action} this task
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">{formatRelativeDate(h.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
