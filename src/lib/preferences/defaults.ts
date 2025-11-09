/**
 * Default values for workspace preferences and state
 */

import type { WorkspacePreferences, WorkspaceState } from './types';

export const DEFAULT_PREFERENCES: WorkspacePreferences = {
  version: '1.0.0',
  theme: {
    mode: 'system',
    preferSystemTheme: true,
  },
  editor: {
    defaultViewMode: 'split',
    autoSave: true,
    autoSaveDebounce: 2000,
  },
  navigation: {},
  accessibility: {},
};

export const DEFAULT_STATE: WorkspaceState = {
  version: '1.0.0',
  session: {
    openEditorFiles: [],
  },
  recentActivity: {
    lastVisited: new Date().toISOString(),
    recentProjects: [],
    recentDocs: [],
  },
  ui: {
    notificationsDismissed: [],
    tourCompleted: false,
  },
};
