import { useState } from 'react';
import { useBoard } from '../../contexts/BoardContext';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const { addTask } = useBoard();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      status: status as any,
      priority: priority as any,
      assigneeId: null,
      creatorId: user.id,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      dueDate: null,
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" required placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe the task..." className="w-full px-3 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Status" options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value)} />
          <Select label="Priority" options={priorityOptions} value={priority} onChange={(e) => setPriority(e.target.value)} />
        </div>
        <Input label="Tags" placeholder="design, frontend, urgent" value={tags} onChange={(e) => setTags(e.target.value)} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!title.trim()}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}
