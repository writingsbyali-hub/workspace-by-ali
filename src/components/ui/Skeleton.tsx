import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Base Skeleton component for loading states
 *
 * @example
 * <Skeleton variant="text" width="100%" height={20} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" className="w-full h-48" />
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-base-300 rounded';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
}

/**
 * SkeletonText - For text content loading
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard - For project/update cards
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card bg-base-100 shadow-sm p-6', className)}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={20} width="70%" />
          <Skeleton variant="text" height={16} width="40%" />
        </div>
      </div>

      {/* Body */}
      <SkeletonText lines={2} className="mb-4" />

      {/* Footer */}
      <div className="flex items-center gap-2">
        <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
        <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
      </div>
    </div>
  );
}

/**
 * SkeletonList - For timeline/activity lists
 */
export function SkeletonList({
  items = 3,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height={18} width="60%" />
            <Skeleton variant="text" height={14} width="90%" />
            <Skeleton variant="text" height={14} width="70%" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonStat - For dashboard stat cards
 */
export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn('stat bg-base-100 rounded-lg', className)}>
      <Skeleton variant="text" height={16} width="40%" className="mb-2" />
      <Skeleton variant="text" height={32} width="60%" className="mb-1" />
      <Skeleton variant="text" height={14} width="50%" />
    </div>
  );
}

/**
 * SkeletonTable - For table rows
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant="text"
              height={16}
              width={colIndex === 0 ? '25%' : '100%'}
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonTaskList - For dashboard task list
 */
export function SkeletonTaskList({
  items = 5,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('task-list', className)} role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading tasks...</span>
      <div className="task-list-header">
        <Skeleton variant="text" height={24} width={120} />
        <Skeleton variant="rectangular" height={32} width={100} className="rounded-md" />
      </div>
      <div className="task-items">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="task-item">
            <Skeleton variant="rectangular" width={20} height={20} className="rounded" />
            <div className="task-content flex-1">
              <Skeleton variant="text" height={18} width="70%" className="mb-2" />
              <div className="flex gap-2">
                <Skeleton variant="rectangular" height={20} width={60} className="rounded-full" />
                <Skeleton variant="rectangular" height={20} width={80} className="rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SkeletonNotificationList - For notification sidebar
 */
export function SkeletonNotificationList({
  items = 5,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('notification-list', className)} role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading notifications...</span>
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" height={20} width={120} />
        <Skeleton variant="text" height={16} width={80} />
      </div>
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3">
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" height={16} width="90%" />
              <Skeleton variant="text" height={14} width="60%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SkeletonActivityLog - For recent activities
 */
export function SkeletonActivityLog({
  items = 4,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('activity-log', className)} role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading recent activities...</span>
      <div className="space-y-4">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-shrink-0">
              <Skeleton variant="circular" width={40} height={40} />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" height={18} width="80%" />
              <Skeleton variant="text" height={14} width="100%" />
              <Skeleton variant="text" height={14} width="70%" />
              <Skeleton variant="text" height={12} width="40%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * SkeletonProjectCard - For project cards on projects page
 */
export function SkeletonProjectCard({ className }: { className?: string }) {
  return (
    <div className={cn('project-card', className)} role="status" aria-busy="true">
      <span className="sr-only">Loading project...</span>
      {/* Header */}
      <div className="project-header">
        <Skeleton variant="rectangular" height={24} width={100} className="rounded-md" />
        <Skeleton variant="rectangular" height={24} width={60} className="rounded-md" />
      </div>

      {/* Title */}
      <Skeleton variant="text" height={28} width="80%" className="mb-3" />

      {/* Description */}
      <div className="space-y-2 mb-4 flex-1">
        <Skeleton variant="text" height={16} width="100%" />
        <Skeleton variant="text" height={16} width="100%" />
        <Skeleton variant="text" height={16} width="70%" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Skeleton variant="rectangular" height={24} width={60} className="rounded" />
        <Skeleton variant="rectangular" height={24} width={80} className="rounded" />
        <Skeleton variant="rectangular" height={24} width={50} className="rounded" />
      </div>

      {/* Meta */}
      <div className="flex gap-4 mb-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <Skeleton variant="text" height={14} width={100} />
        <Skeleton variant="text" height={14} width={80} />
      </div>

      {/* Link */}
      <Skeleton variant="text" height={16} width={120} />
    </div>
  );
}

/**
 * SkeletonProjectGrid - For projects page grid
 */
export function SkeletonProjectGrid({
  items = 6,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn('projects-grid', className)} role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading projects...</span>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonProjectCard key={i} />
      ))}
    </div>
  );
}
