/**
 * Editor Shortcuts Hook
 * Handles keyboard shortcuts for the markdown editor
 */

import { useEffect } from 'react';
import type { MarkdownFormat } from '../lib/editor-utils';

export type ViewMode = 'edit' | 'preview' | 'split';

export interface UseEditorShortcutsOptions {
  onSave?: () => void;
  onFormat?: (format: MarkdownFormat) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onFullscreen?: () => void;
  onFind?: () => void;
  enabled?: boolean;
}

export function useEditorShortcuts({
  onSave,
  onFormat,
  onViewModeChange,
  onFullscreen,
  onFind,
  enabled = true,
}: UseEditorShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const isShift = e.shiftKey;

      // Cmd/Ctrl + S - Save
      if (isMod && !isShift && e.key === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Cmd/Ctrl + B - Bold
      if (isMod && !isShift && e.key === 'b') {
        e.preventDefault();
        onFormat?.('bold');
        return;
      }

      // Cmd/Ctrl + I - Italic
      if (isMod && !isShift && e.key === 'i') {
        e.preventDefault();
        onFormat?.('italic');
        return;
      }

      // Cmd/Ctrl + K - Link
      if (isMod && !isShift && e.key === 'k') {
        e.preventDefault();
        // This will be handled by toolbar directly
        return;
      }

      // Cmd/Ctrl + Shift + E - Edit mode
      if (isMod && isShift && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onViewModeChange?.('edit');
        return;
      }

      // Cmd/Ctrl + Shift + P - Preview mode
      if (isMod && isShift && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        onViewModeChange?.('preview');
        return;
      }

      // Cmd/Ctrl + Shift + S - Split mode
      if (isMod && isShift && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onViewModeChange?.('split');
        return;
      }

      // Cmd/Ctrl + Shift + F - Fullscreen
      if (isMod && isShift && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        onFullscreen?.();
        return;
      }

      // Cmd/Ctrl + F - Find
      if (isMod && !isShift && e.key === 'f') {
        e.preventDefault();
        onFind?.();
        return;
      }

      // Cmd/Ctrl + 1 - H1
      if (isMod && e.key === '1') {
        e.preventDefault();
        onFormat?.('h1');
        return;
      }

      // Cmd/Ctrl + 2 - H2
      if (isMod && e.key === '2') {
        e.preventDefault();
        onFormat?.('h2');
        return;
      }

      // Cmd/Ctrl + 3 - H3
      if (isMod && e.key === '3') {
        e.preventDefault();
        onFormat?.('h3');
        return;
      }

      // Cmd/Ctrl + Shift + C - Code block
      if (isMod && isShift && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        // This will be handled by toolbar directly
        return;
      }

      // Cmd/Ctrl + E - Code inline
      if (isMod && !isShift && e.key === 'e') {
        e.preventDefault();
        onFormat?.('code');
        return;
      }

      // Cmd/Ctrl + Shift + X - Strikethrough
      if (isMod && isShift && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        onFormat?.('strikethrough');
        return;
      }

      // Cmd/Ctrl + Shift + 7 - Ordered list
      if (isMod && isShift && e.key === '7') {
        e.preventDefault();
        onFormat?.('ol');
        return;
      }

      // Cmd/Ctrl + Shift + 8 - Unordered list
      if (isMod && isShift && e.key === '8') {
        e.preventDefault();
        onFormat?.('ul');
        return;
      }

      // Cmd/Ctrl + Shift + 9 - Todo list
      if (isMod && isShift && e.key === '9') {
        e.preventDefault();
        onFormat?.('todo');
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enabled,
    onSave,
    onFormat,
    onViewModeChange,
    onFullscreen,
    onFind,
  ]);
}

/**
 * Get shortcut display text for the current platform
 */
export function getShortcutText(shortcut: string): string {
  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  const mod = isMac ? '⌘' : 'Ctrl';
  const shift = isMac ? '⇧' : 'Shift';
  const alt = isMac ? '⌥' : 'Alt';

  return shortcut
    .replace('Mod', mod)
    .replace('Shift', shift)
    .replace('Alt', alt);
}

/**
 * List of all available shortcuts
 */
export const EDITOR_SHORTCUTS = [
  { name: 'Save', shortcut: 'Mod+S' },
  { name: 'Bold', shortcut: 'Mod+B' },
  { name: 'Italic', shortcut: 'Mod+I' },
  { name: 'Inline Code', shortcut: 'Mod+E' },
  { name: 'Strikethrough', shortcut: 'Mod+Shift+X' },
  { name: 'Link', shortcut: 'Mod+K' },
  { name: 'Heading 1', shortcut: 'Mod+1' },
  { name: 'Heading 2', shortcut: 'Mod+2' },
  { name: 'Heading 3', shortcut: 'Mod+3' },
  { name: 'Unordered List', shortcut: 'Mod+Shift+8' },
  { name: 'Ordered List', shortcut: 'Mod+Shift+7' },
  { name: 'Todo List', shortcut: 'Mod+Shift+9' },
  { name: 'Code Block', shortcut: 'Mod+Shift+C' },
  { name: 'Edit Mode', shortcut: 'Mod+Shift+E' },
  { name: 'Preview Mode', shortcut: 'Mod+Shift+P' },
  { name: 'Split Mode', shortcut: 'Mod+Shift+S' },
  { name: 'Fullscreen', shortcut: 'Mod+Shift+F' },
  { name: 'Find', shortcut: 'Mod+F' },
] as const;
