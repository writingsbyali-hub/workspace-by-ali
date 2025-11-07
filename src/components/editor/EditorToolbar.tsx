/**
 * EditorToolbar Component
 * Formatting buttons for markdown editor
 */

import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  CodeSquare,
  Table as TableIcon,
  Quote,
  Minus,
  FileText,
  Maximize2,
} from 'lucide-react';
import type { MarkdownFormat, InsertType } from '../../lib/editor-utils';
import { getShortcutText } from '../../hooks/useEditorShortcuts';

export interface EditorToolbarProps {
  onFormat: (format: MarkdownFormat) => void;
  onInsert: (type: InsertType) => void;
  onTemplate?: () => void;
  onFullscreen?: () => void;
  activeFormats?: MarkdownFormat[];
  disabled?: boolean;
}

interface ToolbarButton {
  icon: React.ComponentType<{ className?: string }>;
  format?: MarkdownFormat;
  insertType?: InsertType;
  label: string;
  shortcut?: string;
  action?: 'template' | 'fullscreen';
}

const toolbarButtons: ToolbarButton[][] = [
  // Text formatting
  [
    { icon: Bold, format: 'bold', label: 'Bold', shortcut: 'Mod+B' },
    { icon: Italic, format: 'italic', label: 'Italic', shortcut: 'Mod+I' },
    {
      icon: Strikethrough,
      format: 'strikethrough',
      label: 'Strikethrough',
      shortcut: 'Mod+Shift+X',
    },
    { icon: Code, format: 'code', label: 'Inline Code', shortcut: 'Mod+E' },
  ],
  // Headings
  [
    { icon: Heading1, format: 'h1', label: 'Heading 1', shortcut: 'Mod+1' },
    { icon: Heading2, format: 'h2', label: 'Heading 2', shortcut: 'Mod+2' },
    { icon: Heading3, format: 'h3', label: 'Heading 3', shortcut: 'Mod+3' },
  ],
  // Lists
  [
    {
      icon: List,
      format: 'ul',
      label: 'Bullet List',
      shortcut: 'Mod+Shift+8',
    },
    {
      icon: ListOrdered,
      format: 'ol',
      label: 'Numbered List',
      shortcut: 'Mod+Shift+7',
    },
    {
      icon: CheckSquare,
      format: 'todo',
      label: 'Todo List',
      shortcut: 'Mod+Shift+9',
    },
  ],
  // Media
  [
    { icon: LinkIcon, insertType: 'link', label: 'Link', shortcut: 'Mod+K' },
    { icon: ImageIcon, insertType: 'image', label: 'Image' },
    {
      icon: CodeSquare,
      insertType: 'codeblock',
      label: 'Code Block',
      shortcut: 'Mod+Shift+C',
    },
    { icon: TableIcon, insertType: 'table', label: 'Table' },
  ],
  // Utilities
  [
    { icon: Quote, format: 'quote', label: 'Quote' },
    { icon: Minus, format: 'hr', label: 'Horizontal Rule' },
    { icon: FileText, action: 'template', label: 'Templates' },
    {
      icon: Maximize2,
      action: 'fullscreen',
      label: 'Fullscreen',
      shortcut: 'Mod+Shift+F',
    },
  ],
];

export function EditorToolbar({
  onFormat,
  onInsert,
  onTemplate,
  onFullscreen,
  activeFormats = [],
  disabled = false,
}: EditorToolbarProps) {
  const handleClick = (button: ToolbarButton) => {
    if (disabled) return;

    if (button.format) {
      onFormat(button.format);
    } else if (button.insertType) {
      onInsert(button.insertType);
    } else if (button.action === 'template') {
      onTemplate?.();
    } else if (button.action === 'fullscreen') {
      onFullscreen?.();
    }
  };

  const isActive = (button: ToolbarButton) => {
    return button.format && activeFormats.includes(button.format);
  };

  return (
    <div className="editor-toolbar">
      {toolbarButtons.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex > 0 && <div className="toolbar-divider" />}
          <div className="toolbar-group">
            {group.map((button, buttonIndex) => {
              const Icon = button.icon;
              const active = isActive(button);
              return (
                <button
                  key={buttonIndex}
                  type="button"
                  onClick={() => handleClick(button)}
                  disabled={disabled}
                  className={`toolbar-btn ${active ? 'active' : ''}`}
                  title={
                    button.shortcut
                      ? `${button.label} (${getShortcutText(button.shortcut)})`
                      : button.label
                  }
                  aria-label={button.label}
                  aria-pressed={active}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
