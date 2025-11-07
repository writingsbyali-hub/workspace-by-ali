/**
 * Sync Scroll Hook
 * Synchronizes scrolling between editor and preview panes
 */

import { useEffect, useRef, useState } from 'react';

export interface UseSyncScrollOptions {
  enabled?: boolean;
}

export interface UseSyncScrollReturn {
  editorRef: React.RefObject<HTMLTextAreaElement>;
  previewRef: React.RefObject<HTMLDivElement>;
  isSyncing: boolean;
  toggleSync: () => void;
}

export function useSyncScroll({
  enabled = true,
}: UseSyncScrollOptions = {}): UseSyncScrollReturn {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isSyncing, setIsSyncing] = useState(enabled);
  const lastScrollSource = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isSyncing) return;

    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    const handleEditorScroll = () => {
      // Prevent feedback loop
      if (lastScrollSource.current === 'preview') {
        return;
      }

      lastScrollSource.current = 'editor';

      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Calculate scroll percentage
      const editorScrollPercentage =
        editor.scrollTop / (editor.scrollHeight - editor.clientHeight);

      // Apply to preview
      const previewScrollTop =
        editorScrollPercentage * (preview.scrollHeight - preview.clientHeight);

      preview.scrollTop = previewScrollTop;

      // Reset source after a delay
      scrollTimeout.current = setTimeout(() => {
        lastScrollSource.current = null;
      }, 100);
    };

    const handlePreviewScroll = () => {
      // Prevent feedback loop
      if (lastScrollSource.current === 'editor') {
        return;
      }

      lastScrollSource.current = 'preview';

      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Calculate scroll percentage
      const previewScrollPercentage =
        preview.scrollTop / (preview.scrollHeight - preview.clientHeight);

      // Apply to editor
      const editorScrollTop =
        previewScrollPercentage * (editor.scrollHeight - editor.clientHeight);

      editor.scrollTop = editorScrollTop;

      // Reset source after a delay
      scrollTimeout.current = setTimeout(() => {
        lastScrollSource.current = null;
      }, 100);
    };

    editor.addEventListener('scroll', handleEditorScroll);
    preview.addEventListener('scroll', handlePreviewScroll);

    return () => {
      editor.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isSyncing]);

  const toggleSync = () => {
    setIsSyncing((prev) => !prev);
  };

  return {
    editorRef,
    previewRef,
    isSyncing,
    toggleSync,
  };
}
