/**
 * Context provider for GitHub-backed preferences
 * Initializes the PreferencesAPI and makes it available to all components
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { PreferencesAPI } from '../../lib/preferences/api';
import { migrateToGitHub, needsMigration } from '../../lib/preferences/migrate';
import type { WorkspacePreferences, WorkspaceState } from '../../lib/preferences/types';

interface PreferencesContextType {
  preferences: WorkspacePreferences | null;
  state: WorkspaceState | null;
  loading: boolean;
  error: Error | null;
  updatePreferences: (updates: Partial<WorkspacePreferences>) => Promise<void>;
  updateState: (updates: Partial<WorkspaceState>) => Promise<void>;
  setTheme: (mode: 'workspace-light' | 'workspace-dark' | 'system') => Promise<void>;
  setEditorViewMode: (viewMode: 'edit' | 'preview' | 'split') => Promise<void>;
  setCurrentProject: (projectId: string) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | null>(null);

interface PreferencesProviderProps {
  children: ReactNode;
  token?: string;
  owner?: string;
  repo?: string;
  branch?: string;
}

export function PreferencesProvider({
  children,
  token,
  owner,
  repo,
  branch = 'main'
}: PreferencesProviderProps) {
  const [api, setApi] = useState<PreferencesAPI | null>(null);
  const [preferences, setPreferences] = useState<WorkspacePreferences | null>(null);
  const [state, setState] = useState<WorkspaceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize API when credentials are available
  useEffect(() => {
    if (!token || !owner || !repo) {
      setLoading(false);
      return;
    }

    const apiInstance = new PreferencesAPI(token, owner, repo, branch);
    setApi(apiInstance);

    // Load initial data
    Promise.all([
      apiInstance.getPreferences(),
      apiInstance.getState(),
    ])
      .then(([prefs, st]) => {
        setPreferences(prefs);
        setState(st);

        // Run migration if needed
        if (needsMigration()) {
          console.log('[PreferencesProvider] Migration needed, starting migration...');
          return migrateToGitHub(apiInstance).then(() => {
            // Reload after migration
            return Promise.all([
              apiInstance.getPreferences(),
              apiInstance.getState(),
            ]);
          }).then(([prefs, st]) => {
            setPreferences(prefs);
            setState(st);
          });
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [token, owner, repo, branch]);

  // Update preferences with optimistic updates
  const updatePreferences = async (updates: Partial<WorkspacePreferences>) => {
    if (!api || !preferences) return;

    // Optimistic update
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    try {
      await api.updatePreferences(updates);

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
      throw err;
    }
  };

  // Update state with optimistic updates
  const updateState = async (updates: Partial<WorkspaceState>) => {
    if (!api || !state) return;

    // Optimistic update
    const newState = { ...state, ...updates };
    setState(newState);

    try {
      await api.updateState(updates);

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
      throw err;
    }
  };

  // Convenience methods
  const setTheme = async (mode: 'workspace-light' | 'workspace-dark' | 'system') => {
    if (!preferences) return;
    await updatePreferences({
      theme: { ...preferences.theme, mode },
    });
  };

  const setEditorViewMode = async (viewMode: 'edit' | 'preview' | 'split') => {
    if (!preferences) return;
    await updatePreferences({
      editor: { ...preferences.editor, defaultViewMode: viewMode },
    });
  };

  const setCurrentProject = async (projectId: string) => {
    if (!state) return;
    await updateState({
      session: { ...state.session, currentProjectId: projectId },
    });
  };

  // Listen for updates from other tabs
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const prefsChannel = new BroadcastChannel('workspace-preferences');
    const stateChannel = new BroadcastChannel('workspace-state');

    prefsChannel.addEventListener('message', (event) => {
      if (event.data.type === 'preferences-updated') {
        setPreferences(event.data.data);
      }
    });

    stateChannel.addEventListener('message', (event) => {
      if (event.data.type === 'state-updated') {
        setState(event.data.data);
      }
    });

    return () => {
      prefsChannel.close();
      stateChannel.close();
    };
  }, []);

  const value: PreferencesContextType = {
    preferences,
    state,
    loading,
    error,
    updatePreferences,
    updateState,
    setTheme,
    setEditorViewMode,
    setCurrentProject,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Hook to use preferences context
export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferencesContext must be used within PreferencesProvider');
  }
  return context;
}

// Hook with fallback for components that might render before provider
export function usePreferencesWithFallback() {
  const context = useContext(PreferencesContext);

  // If no context, use localStorage fallback
  if (!context) {
    const [theme, setThemeState] = useState<'workspace-light' | 'workspace-dark'>('workspace-light');
    const [currentProject, setCurrentProjectState] = useState<string | null>(null);
    const [viewMode, setViewModeState] = useState<'edit' | 'preview' | 'split'>('split');

    useEffect(() => {
      if (typeof localStorage !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') as 'workspace-light' | 'workspace-dark' | null;
        if (savedTheme) setThemeState(savedTheme);

        const savedProject = localStorage.getItem('currentProjectId');
        if (savedProject) setCurrentProjectState(savedProject);

        const savedViewMode = localStorage.getItem('editorViewMode') as 'edit' | 'preview' | 'split' | null;
        if (savedViewMode) setViewModeState(savedViewMode);
      }
    }, []);

    return {
      preferences: {
        theme: { mode: theme, preferSystemTheme: false },
        editor: { defaultViewMode: viewMode, autoSave: true, autoSaveDebounce: 2000 },
      } as any,
      state: {
        session: { currentProjectId: currentProject },
      } as any,
      loading: false,
      error: null,
      setTheme: async (mode: 'workspace-light' | 'workspace-dark') => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', mode);
          setThemeState(mode);
        }
      },
      setEditorViewMode: async (mode: 'edit' | 'preview' | 'split') => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('editorViewMode', mode);
          setViewModeState(mode);
        }
      },
      setCurrentProject: async (projectId: string) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('currentProjectId', projectId);
          setCurrentProjectState(projectId);
        }
      },
    };
  }

  return context;
}
