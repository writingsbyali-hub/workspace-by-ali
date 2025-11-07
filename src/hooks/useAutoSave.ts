/**
 * Auto-save Hook
 * Handles debounced auto-save with status tracking
 */

import { useEffect, useState, useRef } from 'react';

export type SaveStatus = 'saved' | 'saving' | 'error';

export interface UseAutoSaveOptions {
  content: string;
  title: string;
  onSave: (content: string, title: string) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export interface UseAutoSaveReturn {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  manualSave: () => Promise<void>;
  isDirty: boolean;
}

export function useAutoSave({
  content,
  title,
  onSave,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>(content);
  const lastTitleRef = useRef<string>(title);
  const isSavingRef = useRef(false);

  // Track if content has changed
  useEffect(() => {
    const hasChanged =
      content !== lastContentRef.current || title !== lastTitleRef.current;
    setIsDirty(hasChanged);
  }, [content, title]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if content has changed
    const contentChanged = content !== lastContentRef.current;
    const titleChanged = title !== lastTitleRef.current;

    if (!contentChanged && !titleChanged) {
      return;
    }

    // Set status to saving
    setSaveStatus('saving');

    // Debounce the save
    timeoutRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;

      isSavingRef.current = true;

      try {
        await onSave(content, title);
        lastContentRef.current = content;
        lastTitleRef.current = title;
        setSaveStatus('saved');
        setLastSaved(new Date());
        setIsDirty(false);
      } catch (error) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
      } finally {
        isSavingRef.current = false;
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, title, onSave, debounceMs, enabled]);

  // Manual save function
  const manualSave = async () => {
    if (isSavingRef.current) return;

    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isSavingRef.current = true;
    setSaveStatus('saving');

    try {
      await onSave(content, title);
      lastContentRef.current = content;
      lastTitleRef.current = title;
      setSaveStatus('saved');
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (error) {
      console.error('Manual save error:', error);
      setSaveStatus('error');
      throw error;
    } finally {
      isSavingRef.current = false;
    }
  };

  return {
    saveStatus,
    lastSaved,
    manualSave,
    isDirty,
  };
}
