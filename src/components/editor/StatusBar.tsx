/**
 * StatusBar Component
 * Displays document statistics and keyboard shortcuts
 */

import React from 'react';
import type { DocumentStats } from '../../lib/markdown';
import { formatStats } from '../../lib/markdown';

export interface StatusBarProps {
  stats: DocumentStats;
  onShowShortcuts?: () => void;
}

export function StatusBar({ stats, onShowShortcuts }: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span className="status-item">{formatStats(stats)}</span>
      </div>
      <div className="status-bar-right">
        {onShowShortcuts && (
          <button
            type="button"
            onClick={onShowShortcuts}
            className="status-link"
            aria-label="Show keyboard shortcuts"
          >
            Keyboard Shortcuts
          </button>
        )}
      </div>
    </div>
  );
}
