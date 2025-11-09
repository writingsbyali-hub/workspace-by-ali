import { useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;       // GitHub username or "Anyone"
  dueDate?: string;          // ISO date string
  projectId?: string;        // Associated project
  githubIssueUrl?: string;   // Link to GitHub issue
  createdAt: string;
  updatedAt: string;
}

interface TaskListProps {
  tasks: Task[];
  maxVisible?: number;       // Default: 5
  showCreateButton?: boolean; // Default: true
  compact?: boolean;         // Default: false
}

export function TaskList({
  tasks,
  maxVisible = 5,
  showCreateButton = true,
  compact = false
}: TaskListProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleTasks = showAll ? tasks : tasks.slice(0, maxVisible);
  const hasMore = tasks.length > maxVisible;
  const incompleteTasks = tasks.filter(t => t.status !== 'done').length;

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2 className="task-list-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          Tasks
          {tasks.length > 0 && (
            <span className="task-count">({incompleteTasks})</span>
          )}
        </h2>
        {showCreateButton && (
          <button className="btn btn-ghost btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="task-list-empty">
          <p>No tasks yet. Create your first task to get started!</p>
        </div>
      ) : (
        <>
          <div className="task-items">
            {visibleTasks.map((task) => (
              <TaskItem key={task.id} task={task} compact={compact} />
            ))}
          </div>

          {hasMore && !showAll && (
            <button
              className="btn btn-ghost btn-full"
              onClick={() => setShowAll(true)}
            >
              Show {tasks.length - maxVisible} more tasks
            </button>
          )}
        </>
      )}
    </div>
  );
}

function TaskItem({ task, compact }: { task: Task; compact: boolean }) {
  const [checked, setChecked] = useState(task.status === 'done');

  return (
    <div className="task-item">
      <div
        className={`task-checkbox ${checked ? 'checked' : ''}`}
        onClick={() => setChecked(!checked)}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        )}
      </div>

      <div className="task-content">
        <div className={`task-title ${checked ? 'completed' : ''}`}>
          {task.title}
        </div>

        {!compact && (
          <div className="task-meta">
            {task.priority && (
              <span className={`task-priority ${task.priority}`}>
                {task.priority}
              </span>
            )}

            {task.assignedTo && (
              <span className="task-assigned">
                <div className="task-assignee-avatar">
                  {task.assignedTo.charAt(0).toUpperCase()}
                </div>
                {task.assignedTo}
              </span>
            )}

            {task.dueDate && (
              <span className="task-due-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {formatDate(task.dueDate)}
              </span>
            )}

            {task.githubIssueUrl && (
              <a href={task.githubIssueUrl} target="_blank" rel="noopener noreferrer" className="task-github-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View Issue
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  return `in ${diffDays} days`;
}

export default TaskList;
