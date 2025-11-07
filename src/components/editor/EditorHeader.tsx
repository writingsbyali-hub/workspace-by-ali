/**
 * EditorHeader Component
 * Title editing, view mode toggle, save status, and actions
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  Edit3,
  Columns2,
  Settings,
  Share2,
  Upload,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { SaveStatus } from '../../hooks/useAutoSave';
import type { ViewMode } from '../../hooks/useEditorShortcuts';

export interface EditorHeaderProps {
  documentId?: string;
  title: string;
  onTitleChange: (newTitle: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  saveStatus: SaveStatus;
  lastSaved?: Date | null;
  onBack?: () => void;
  onSettings?: () => void;
  onShare?: () => void;
  onPublish?: () => void;
}

const viewModes: Array<{ mode: ViewMode; label: string; icon: React.ComponentType<any> }> = [
  { mode: 'edit', label: 'Edit', icon: Edit3 },
  { mode: 'split', label: 'Split', icon: Columns2 },
  { mode: 'preview', label: 'Preview', icon: Eye },
];

export function EditorHeader({
  title,
  onTitleChange,
  viewMode,
  onViewModeChange,
  saveStatus,
  lastSaved,
  onBack,
  onSettings,
  onShare,
  onPublish,
}: EditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleValue(title);
  }, [title]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue !== title) {
      onTitleChange(titleValue.trim());
    } else {
      setTitleValue(title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitleValue(title);
      setIsEditingTitle(false);
    }
  };

  const formatLastSaved = (date: Date | null | undefined) => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return 'just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="editor-header">
      <div className="editor-header-left">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="header-btn"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {isEditingTitle ? (
          <input
            ref={inputRef}
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="title-input"
            aria-label="Document title"
          />
        ) : (
          <h1
            onClick={handleTitleClick}
            className="document-title"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTitleClick();
              }
            }}
          >
            {title || 'Untitled Document'}
          </h1>
        )}

        <div className="save-status">
          {saveStatus === 'saved' && (
            <>
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Saved {formatLastSaved(lastSaved)}
              </span>
            </>
          )}
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Saving...
              </span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-600 dark:text-red-400">
                Save failed
              </span>
            </>
          )}
        </div>
      </div>

      <div className="editor-header-center">
        <div className="view-mode-toggle" role="tablist">
          {viewModes.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={`view-mode-btn ${viewMode === mode ? 'active' : ''}`}
              role="tab"
              aria-selected={viewMode === mode}
              aria-label={`${label} mode`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="editor-header-right">
        {onSettings && (
          <button
            type="button"
            onClick={onSettings}
            className="header-btn"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
        {onShare && (
          <button
            type="button"
            onClick={onShare}
            className="header-btn"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
        {onPublish && (
          <button
            type="button"
            onClick={onPublish}
            className="btn btn-primary"
            aria-label="Publish"
          >
            <Upload className="w-4 h-4" />
            <span>Publish</span>
          </button>
        )}
      </div>
    </header>
  );
}
