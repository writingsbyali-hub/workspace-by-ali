import { useState } from 'react';

export interface Notification {
  id: string;
  type: 'comment' | 'mention' | 'star' | 'fork' | 'issue' | 'pr' | 'task_assigned';
  title: string;
  description?: string;
  actor: {
    username: string;
    avatarUrl: string;
  };
  targetUrl: string;        // Link to the thing (issue, comment, etc.)
  read: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
  maxVisible?: number;      // Default: 5
  showMarkAllRead?: boolean; // Default: true
}

export function NotificationList({
  notifications,
  maxVisible = 5,
  showMarkAllRead = true
}: NotificationListProps) {
  const [items, setItems] = useState(notifications);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = items.filter(n => !n.read).length;
  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  const markAllRead = () => {
    setItems(items.map(n => ({ ...n, read: true })));
    // TODO: API call to mark all as read
  };

  return (
    <>
      <div className="section-header">
        <h3 className="section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          Notifications
          {unreadCount > 0 && (
            <span className="badge">{unreadCount}</span>
          )}
        </h3>
        {showMarkAllRead && unreadCount > 0 && (
          <button className="btn-text-sm" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="notification-empty">
          <p>No notifications yet. We'll let you know when something happens!</p>
        </div>
      ) : (
        <>
          <div className="notification-items">
            {visibleItems.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => window.location.href = notification.targetUrl}
              />
            ))}
          </div>

          {hasMore && !showAll && (
            <button
              className="btn btn-ghost btn-full btn-sm"
              onClick={() => setShowAll(true)}
            >
              Show {items.length - maxVisible} more
            </button>
          )}
        </>
      )}
    </>
  );
}

function NotificationItem({ notification, onClick }: {
  notification: Notification;
  onClick: () => void;
}) {
  return (
    <div
      className={`notification-item ${notification.read ? '' : 'unread'}`}
      onClick={onClick}
    >
      <img
        src={notification.actor.avatarUrl}
        alt={notification.actor.username}
        className="notification-avatar"
      />

      <div className="notification-content">
        <div className="notification-message">
          <strong>@{notification.actor.username}</strong> {notification.title}
        </div>

        {notification.description && (
          <div className="notification-description">
            {notification.description}
          </div>
        )}

        <div className="notification-time">
          {formatRelativeTime(notification.createdAt)}
        </div>
      </div>

      {getTypeIcon(notification.type)}
    </div>
  );
}

function getTypeIcon(type: Notification['type']) {
  const icons = {
    comment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    mention: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8A6 6 0 106 8v6M12 14v2"/></svg>,
    star: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    fork: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 1-1 2-2 2H8c-1 0-2-1-2-2V9M12 12v3"/></svg>,
    issue: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    pr: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7M6 9v12"/></svg>,
    task_assigned: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
  };

  return <div className="notification-type-icon">{icons[type]}</div>;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default NotificationList;
