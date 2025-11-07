/**
 * ShortcutsPanel Component
 * Displays keyboard shortcuts reference
 */

import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { EDITOR_SHORTCUTS, getShortcutText } from '../../hooks/useEditorShortcuts';

export interface ShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{ name: string; shortcut: string }>;
}

const groupedShortcuts: ShortcutGroup[] = [
  {
    title: 'General',
    shortcuts: [
      { name: 'Save', shortcut: 'Mod+S' },
      { name: 'Find', shortcut: 'Mod+F' },
      { name: 'Fullscreen', shortcut: 'Mod+Shift+F' },
    ],
  },
  {
    title: 'View Modes',
    shortcuts: [
      { name: 'Edit Mode', shortcut: 'Mod+Shift+E' },
      { name: 'Preview Mode', shortcut: 'Mod+Shift+P' },
      { name: 'Split Mode', shortcut: 'Mod+Shift+S' },
    ],
  },
  {
    title: 'Text Formatting',
    shortcuts: [
      { name: 'Bold', shortcut: 'Mod+B' },
      { name: 'Italic', shortcut: 'Mod+I' },
      { name: 'Inline Code', shortcut: 'Mod+E' },
      { name: 'Strikethrough', shortcut: 'Mod+Shift+X' },
    ],
  },
  {
    title: 'Headings',
    shortcuts: [
      { name: 'Heading 1', shortcut: 'Mod+1' },
      { name: 'Heading 2', shortcut: 'Mod+2' },
      { name: 'Heading 3', shortcut: 'Mod+3' },
    ],
  },
  {
    title: 'Lists',
    shortcuts: [
      { name: 'Unordered List', shortcut: 'Mod+Shift+8' },
      { name: 'Ordered List', shortcut: 'Mod+Shift+7' },
      { name: 'Todo List', shortcut: 'Mod+Shift+9' },
    ],
  },
  {
    title: 'Insert',
    shortcuts: [
      { name: 'Link', shortcut: 'Mod+K' },
      { name: 'Code Block', shortcut: 'Mod+Shift+C' },
    ],
  },
];

export function ShortcutsPanel({ isOpen, onClose }: ShortcutsPanelProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="modal-content">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            <h2 id="shortcuts-modal-title" className="modal-title">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="shortcuts-grid">
            {groupedShortcuts.map((group, index) => (
              <div key={index} className="shortcuts-group">
                <h3 className="shortcuts-group-title">{group.title}</h3>
                <div className="shortcuts-list">
                  {group.shortcuts.map((shortcut, idx) => (
                    <div key={idx} className="shortcut-item">
                      <span className="shortcut-name">{shortcut.name}</span>
                      <kbd className="shortcut-key">
                        {getShortcutText(shortcut.shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
