import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, PRIORITY_COLORS, PRIORITY_LABELS } from '../../types';
import { useBoard } from '../../contexts/BoardContext';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../common/Avatar';
import { formatRelativeDate } from '../../services/storage';

export function TaskCard({ task }: { task: Task }) {
  const { setActiveTask } = useBoard();
  const { users } = useAuth();
  const assignee = users.find((u) => u.id === task.assigneeId);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { type: 'task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setActiveTask(task)}
      className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md hover:border-[var(--border-focus)]/20 transition-all duration-200 cursor-pointer animate-fadeIn overflow-hidden"
    >
      <div className="h-1" style={{ backgroundColor: `var(--column-${task.status})` }} />
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">{task.title}</h4>
          <span className="shrink-0 w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }} title={PRIORITY_LABELS[task.priority]} />
        </div>
        {task.description && <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-2.5">{task.description}</p>}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 text-[11px] font-medium rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {assignee ? <Avatar name={assignee.name} size="sm" /> : <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[11px] text-[var(--text-tertiary)]">?</div>}
            {task.dueDate && (
              <span className={`text-[11px] ${new Date(task.dueDate) < new Date() ? 'text-[var(--accent-danger)]' : 'text-[var(--text-tertiary)]'}`}>
                {formatRelativeDate(task.dueDate)}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[var(--text-tertiary)]">{formatRelativeDate(task.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
