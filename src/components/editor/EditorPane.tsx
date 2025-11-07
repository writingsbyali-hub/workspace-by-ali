/**
 * EditorPane Component
 * Textarea for markdown editing with enhanced features
 */

import React, { forwardRef, useCallback } from 'react';
import type { TextSelection } from '../../lib/editor-utils';

export interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange?: (selection: TextSelection) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  readOnly?: boolean;
}

export const EditorPane = forwardRef<HTMLTextAreaElement, EditorPaneProps>(
  (
    {
      value,
      onChange,
      onSelectionChange,
      placeholder = 'Start writing your markdown...',
      autoFocus = false,
      className = '',
      readOnly = false,
    },
    ref
  ) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    const handleSelect = useCallback(
      (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        if (onSelectionChange) {
          onSelectionChange({
            start: target.selectionStart,
            end: target.selectionEnd,
          });
        }
      },
      [onSelectionChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Handle Tab key - insert 2 spaces
        if (e.key === 'Tab') {
          e.preventDefault();
          const target = e.target as HTMLTextAreaElement;
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const newValue =
            value.substring(0, start) + '  ' + value.substring(end);
          onChange(newValue);

          // Set cursor position after the inserted spaces
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 2;
          }, 0);
        }
      },
      [value, onChange]
    );

    return (
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        className={`editor-textarea ${className}`}
        spellCheck={true}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        aria-label="Markdown editor"
      />
    );
  }
);

EditorPane.displayName = 'EditorPane';
