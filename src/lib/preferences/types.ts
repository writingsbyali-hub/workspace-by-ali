/**
 * TypeScript types and schemas for GitHub-backed workspace preferences
 */

export interface WorkspacePreferences {
  version: string;
  theme: {
    mode: 'workspace-light' | 'workspace-dark' | 'system';
    preferSystemTheme: boolean;
  };
  editor: {
    defaultViewMode: 'edit' | 'preview' | 'split';
    autoSave: boolean;
    autoSaveDebounce: number; // milliseconds
  };
  navigation: {
    defaultProjectId?: string;
    lastViewedProjectId?: string;
    sidebarCollapsed?: boolean;
  };
  accessibility?: {
    reduceMotion?: boolean;
    highContrast?: boolean;
  };
}

export interface WorkspaceState {
  version: string;
  session: {
    currentProjectId?: string;
    currentSubProjectId?: string;
    openEditorFiles: string[];
  };
  recentActivity: {
    lastVisited: string; // ISO timestamp
    recentProjects: string[]; // Array of project IDs
    recentDocs: string[]; // Array of doc slugs
  };
  ui: {
    notificationsDismissed: string[];
    tourCompleted: boolean;
    onboardingStep?: number;
  };
}

export type PreferencesCache = {
  data: WorkspacePreferences;
  timestamp: number;
  sha: string;
};

export type StateCache = {
  data: WorkspaceState;
  timestamp: number;
  sha: string;
};
