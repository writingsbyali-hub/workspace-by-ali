/**
 * React hook for accessing GitHub-backed workspace preferences
 */

import { useState, useEffect, useCallback } from 'react';
import { PreferencesAPI } from '../lib/preferences/api';
import type { WorkspacePreferences } from '../lib/preferences/types';

// Singleton API instance (will be initialized with user's GitHub token)
let apiInstance: PreferencesAPI | null = null;

export function initializePreferencesAPI(token: string, owner: string, repo: string, branch = 'main') {
  apiInstance = new PreferencesAPI(token, owner, repo, branch);
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<WorkspacePreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load preferences on mount
  useEffect(() => {
    if (!apiInstance) {
      setError(new Error('PreferencesAPI not initialized. Call initializePreferencesAPI first.'));
      setLoading(false);
      return;
    }

    apiInstance
      .getPreferences()
      .then(setPreferences)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Update preferences with optimistic updates
  const updatePreferences = useCallback(
    async (updates: Partial<WorkspacePreferences>) => {
      if (!apiInstance || !preferences) return;

      // Optimistic update - update UI immediately
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);

      try {
        // Sync to GitHub in background
        await apiInstance.updatePreferences(updates);

        // Broadcast to other tabs
        if (typeof BroadcastChannel !== 'undefined') {
          const channel = new BroadcastChannel('workspace-preferences');
          channel.postMessage({ type: 'preferences-updated', data: newPreferences });
          channel.close();
        }
      } catch (err) {
        // Rollback on error
        setPreferences(preferences);
        setError(err as Error);
        console.error('[usePreferences] Failed to update preferences:', err);
      }
    },
    [preferences]
  );

  // Convenience method: Set theme
  const setTheme = useCallback(
    (mode: 'workspace-light' | 'workspace-dark' | 'system') => {
      return updatePreferences({
        theme: { ...preferences?.theme, mode } as any,
      });
    },
    [preferences, updatePreferences]
  );

  // Convenience method: Set editor view mode
  const setEditorViewMode = useCallback(
    (viewMode: 'edit' | 'preview' | 'split') => {
      return updatePreferences({
        editor: { ...preferences?.editor, defaultViewMode: viewMode } as any,
      });
    },
    [preferences, updatePreferences]
  );

  // Listen for updates from other tabs
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel('workspace-preferences');

    channel.addEventListener('message', (event) => {
      if (event.data.type === 'preferences-updated') {
        setPreferences(event.data.data);
      }
    });

    return () => channel.close();
  }, []);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    setTheme,
    setEditorViewMode,
  };
}
