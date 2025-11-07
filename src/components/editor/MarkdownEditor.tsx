/**
 * MarkdownEditor Component
 * Main editor orchestrator combining all sub-components
 */

import React, { useState, useCallback, useEffect } from 'react';
import { EditorHeader } from './EditorHeader';
import { EditorToolbar } from './EditorToolbar';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { StatusBar } from './StatusBar';
import { TemplateModal, type Template } from './TemplateModal';
import { ShortcutsPanel } from './ShortcutsPanel';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useEditorShortcuts, type ViewMode } from '../../hooks/useEditorShortcuts';
import { useSyncScroll } from '../../hooks/useSyncScroll';
import { calculateStats } from '../../lib/markdown';
import {
  insertMarkdown,
  insertLink,
  insertImage,
  insertCodeBlock,
  insertTable,
  type MarkdownFormat,
  type InsertType,
  type TextSelection,
} from '../../lib/editor-utils';

export interface MarkdownEditorProps {
  documentId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialViewMode?: ViewMode;
  onSave: (content: string, title: string) => Promise<void>;
  onBack?: () => void;
  onPublish?: () => void;
  autoSaveEnabled?: boolean;
  autoSaveDebounce?: number;
}

export function MarkdownEditor({
  documentId,
  initialTitle = 'Untitled Document',
  initialContent = '',
  initialViewMode = 'split',
  onSave,
  onBack,
  onPublish,
  autoSaveEnabled = true,
  autoSaveDebounce = 2000,
}: MarkdownEditorProps) {
  // State
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [selection, setSelection] = useState<TextSelection>({ start: 0, end: 0 });
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hooks
  const { saveStatus, lastSaved, manualSave } = useAutoSave({
    content,
    title,
    onSave,
    debounceMs: autoSaveDebounce,
    enabled: autoSaveEnabled,
  });

  const { editorRef, previewRef } = useSyncScroll({
    enabled: viewMode === 'split',
  });

  // Calculate stats
  const stats = calculateStats(content);

  // Format handler
  const handleFormat = useCallback(
    (format: MarkdownFormat) => {
      if (!editorRef.current) return;

      const result = insertMarkdown(content, selection, format);
      setContent(result.newContent);

      // Update selection
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(
            result.newSelection.start,
            result.newSelection.end
          );
        }
      }, 0);
    },
    [content, selection, editorRef]
  );

  // Insert handler
  const handleInsert = useCallback(
    (type: InsertType) => {
      if (!editorRef.current) return;

      let result;
      switch (type) {
        case 'link':
          result = insertLink(content, selection);
          break;
        case 'image':
          result = insertImage(content, selection);
          break;
        case 'codeblock':
          result = insertCodeBlock(content, selection);
          break;
        case 'table':
          result = insertTable(content, selection);
          break;
      }

      setContent(result.newContent);

      // Update selection
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(
            result.newSelection.start,
            result.newSelection.end
          );
        }
      }, 0);
    },
    [content, selection, editorRef]
  );

  // Template handler
  const handleTemplateSelect = useCallback(
    (template: Template) => {
      const shouldReplace = !content.trim() || window.confirm(
        'Replace current content with template? This cannot be undone.'
      );

      if (shouldReplace) {
        setContent(template.content);
        setTitle(template.name);
      }
    },
    [content]
  );

  // Fullscreen handler
  const handleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Keyboard shortcuts
  useEditorShortcuts({
    onSave: manualSave,
    onFormat: handleFormat,
    onViewModeChange: setViewMode,
    onFullscreen: handleFullscreen,
    enabled: !isTemplateModalOpen && !isShortcutsOpen,
  });

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('editorViewMode', viewMode);
  }, [viewMode]);

  // Load persisted view mode
  useEffect(() => {
    const savedMode = localStorage.getItem('editorViewMode') as ViewMode;
    if (savedMode && ['edit', 'preview', 'split'].includes(savedMode)) {
      setViewMode(savedMode);
    }
  }, []);

  return (
    <div className={`markdown-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      <EditorHeader
        documentId={documentId}
        title={title}
        onTitleChange={setTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        saveStatus={saveStatus}
        lastSaved={lastSaved}
        onBack={onBack}
        onPublish={onPublish}
      />

      <EditorToolbar
        onFormat={handleFormat}
        onInsert={handleInsert}
        onTemplate={() => setIsTemplateModalOpen(true)}
        onFullscreen={handleFullscreen}
      />

      <main className="editor-main">
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`editor-pane-wrapper ${viewMode === 'split' ? 'split' : 'full'}`}>
            <EditorPane
              ref={editorRef}
              value={content}
              onChange={setContent}
              onSelectionChange={setSelection}
              autoFocus={true}
            />
          </div>
        )}

        {viewMode === 'split' && <div className="pane-divider" />}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`preview-pane-wrapper ${viewMode === 'split' ? 'split' : 'full'}`}>
            <PreviewPane ref={previewRef} markdown={content} />
          </div>
        )}
      </main>

      <StatusBar
        stats={stats}
        onShowShortcuts={() => setIsShortcutsOpen(true)}
      />

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleTemplateSelect}
      />

      <ShortcutsPanel
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
