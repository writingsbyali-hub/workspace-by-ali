/**
 * React hook for accessing GitHub-backed workspace state
 */

import { useState, useEffect, useCallback } from 'react';
import { PreferencesAPI } from '../lib/preferences/api';
import type { WorkspaceState } from '../lib/preferences/types';

// Use the same API instance from usePreferences
let apiInstance: PreferencesAPI | null = null;

export function initializeStateAPI(api: PreferencesAPI) {
  apiInstance = api;
}

export function useWorkspaceState() {
  const [state, setState] = useState<WorkspaceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load state on mount
  useEffect(() => {
    if (!apiInstance) {
      setError(new Error('StateAPI not initialized.'));
      setLoading(false);
      return;
    }

    apiInstance
      .getState()
      .then(setState)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Update state with optimistic updates
  const updateState = useCallback(
    async (updates: Partial<WorkspaceState>) => {
      if (!apiInstance || !state) return;

      // Optimistic update
      const newState = { ...state, ...updates };
      setState(newState);

      try {
        // Sync to GitHub in background
        await apiInstance.updateState(updates);

        // Broadcast to other tabs
        if (typeof BroadcastChannel !== 'undefined') {
          const channel = new BroadcastChannel('workspace-state');
          channel.postMessage({ type: 'state-updated', data: newState });
          channel.close();
        }
      } catch (err) {
        // Rollback on error
        setState(state);
        setError(err as Error);
        console.error('[useWorkspaceState] Failed to update state:', err);
      }
    },
    [state]
  );

  // Convenience method: Set current project
  const setCurrentProject = useCallback(
    (projectId: string) => {
      return updateState({
        session: { ...state?.session, currentProjectId: projectId } as any,
      });
    },
    [state, updateState]
  );

  // Convenience method: Add to recent projects
  const addToRecentProjects = useCallback(
    (projectId: string) => {
      if (!state) return;

      const recentProjects = [
        projectId,
        ...state.recentActivity.recentProjects.filter((id) => id !== projectId),
      ].slice(0, 10); // Keep last 10

      return updateState({
        recentActivity: { ...state.recentActivity, recentProjects },
      });
    },
    [state, updateState]
  );

  // Listen for updates from other tabs
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel('workspace-state');

    channel.addEventListener('message', (event) => {
      if (event.data.type === 'state-updated') {
        setState(event.data.data);
      }
    });

    return () => channel.close();
  }, []);

  return {
    state,
    loading,
    error,
    updateState,
    setCurrentProject,
    addToRecentProjects,
  };
}
