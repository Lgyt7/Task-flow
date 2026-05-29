import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { useBoard } from '../../contexts/BoardContext';
import { useAuth } from '../../contexts/AuthContext';
import { Column } from './Column';
import { TaskModal } from '../task/TaskModal';
import { CreateTaskModal } from '../task/CreateTaskModal';

export function Board() {
  const { columns, moveTask, activeTask, setActiveTask, refresh } = useBoard();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const findColumn = (taskId: string) => columns.find((col) => col.tasks.some((t) => t.id === taskId));

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active) return;
    const activeTaskId = active.id as string;
    const overId = over.id as string;
    const activeCol = findColumn(activeTaskId);
    const overCol = columns.find((col) => col.id === overId || col.tasks.some((t) => t.id === overId));
    if (!activeCol || !overCol || activeCol.id === overCol.id) return;
    const overIndex = overCol.tasks.findIndex((t) => t.id === overId);
    moveTask(activeTaskId, overCol.id, overIndex >= 0 ? overIndex : overCol.tasks.length);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;
    const activeTaskId = active.id as string;
    const overId = over.id as string;
    const col = findColumn(activeTaskId);
    if (!col) return;
    const overCol = col.id === overId ? col : columns.find((c) => c.tasks.some((t) => t.id === overId));
    if (!overCol || col.id !== overCol.id) return;
    const oldIndex = col.tasks.findIndex((t) => t.id === activeTaskId);
    const newIndex = col.tasks.findIndex((t) => t.id === overId);
    if (oldIndex !== newIndex && newIndex >= 0) moveTask(activeTaskId, col.id, newIndex);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] tracking-tight">Board</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">Drag and drop tasks between columns</p>
        </div>
        {user && user.role !== 'viewer' && (
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            New Task
          </button>
        )}
      </div>
      {columns.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[var(--text-tertiary)]">
          <p>No columns available</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex gap-5 overflow-x-auto pb-4 flex-1 items-start">
            {columns.map((col) => (
              <Column key={col.id} column={col} />
            ))}
          </div>
        </DndContext>
      )}
      {activeTask && <TaskModal />}
      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
