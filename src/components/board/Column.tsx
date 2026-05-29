import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, STATUS_LABELS } from '../../types';
import { TaskCard } from './TaskCard';

export function Column({ column }: { column: ColumnType }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: 'column', status: column.id } });

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] lg:min-w-[300px] lg:w-[300px] shrink-0 max-h-full">
      <div className="flex items-center gap-2.5 mb-3 px-0.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `var(--column-${column.id})` }} />
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: `var(--column-${column.id})` }}>
          {STATUS_LABELS[column.id]}
        </h3>
        <span className="ml-auto text-xs font-medium tabular-nums px-2 py-0.5 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">{column.tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 rounded-xl border-2 transition-all duration-200 min-h-[120px] ${
          isOver ? 'border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/5' : 'border-dashed border-[var(--border-color)] bg-[var(--bg-primary)]/40'
        }`}
      >
        <SortableContext items={column.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {column.tasks.length === 0 && (
              <div className="flex items-center justify-center h-20 text-sm text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Drop tasks here
                </span>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
