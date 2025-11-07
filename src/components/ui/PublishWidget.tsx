import { useState, useEffect } from 'react';

interface PublishStatus {
  success: boolean;
  has_repo: boolean;
  forked?: boolean;
  has_unpublished_changes?: boolean;
  commits_ahead?: number;
  commits_behind?: number;
  compare_url?: string;
  repo_url?: string;
}

export default function PublishWidget() {
  const [status, setStatus] = useState<PublishStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch publish status
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/publish');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch publish status:', error);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  // Load status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  // Handle publish
  const handlePublish = async () => {
    setPublishing(true);
    setMessage(null);

    try {
      const response = await fetch('/api/publish', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.up_to_date ? 'Already up to date!' : 'Changes published successfully!',
        });
        // Refresh status after publish
        setTimeout(() => {
          fetchStatus();
          setMessage(null);
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to publish changes',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error - failed to publish',
      });
    } finally {
      setPublishing(false);
    }
  };

  // Don't show widget if no repo
  if (!loading && (!status?.has_repo || !status?.forked)) {
    return null;
  }

  return (
    <>
      <h3 className="section-title">Publish Status</h3>

      {loading ? (
        <div className="status-indicator">
          <span className="text-sm">Checking status...</span>
        </div>
      ) : status?.has_unpublished_changes ? (
        <>
          <div className="status-indicator" style={{ background: 'var(--error-light, rgba(220, 38, 38, 0.1))' }}>
            <svg className="status-icon" width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="4" fill="var(--error)" />
            </svg>
            <span className="status-text">
              <strong>{status.commits_ahead}</strong> unpublished change{status.commits_ahead !== 1 ? 's' : ''}
            </span>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn btn-primary btn-block btn-sm"
            style={{ marginTop: '10px' }}
          >
            {publishing ? 'Publishing...' : 'Publish Now'}
          </button>
        </>
      ) : (
        <div className="status-indicator">
          <svg className="status-icon" width="12" height="12" viewBox="0 0 12 12">
            <circle cx="6" cy="6" r="4" fill="var(--success)" />
          </svg>
          <span className="status-text">All changes published</span>
        </div>
      )}

      {message && (
        <div className="status-message" style={{
          marginTop: '10px',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          background: message.type === 'success' ? 'var(--success-light, rgba(0, 208, 132, 0.1))' : 'var(--error-light, rgba(220, 38, 38, 0.1))',
          color: message.type === 'success' ? 'var(--success)' : 'var(--error)'
        }}>
          {message.text}
        </div>
      )}
    </>
  );
}
