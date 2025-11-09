/**
 * Migration utility to move localStorage preferences to GitHub
 * Runs once per user on first load after update
 */

import { PreferencesAPI } from './api';
import type { WorkspacePreferences, WorkspaceState } from './types';

/**
 * Migrate existing localStorage preferences to GitHub
 */
export async function migrateToGitHub(prefsAPI: PreferencesAPI): Promise<void> {
  // Check if already migrated
  if (typeof localStorage === 'undefined') return;

  const migrated = localStorage.getItem('preferences_migrated');
  if (migrated === 'true') {
    console.log('[Migration] Already migrated to GitHub');
    return;
  }

  console.log('[Migration] Starting localStorage → GitHub migration...');

  try {
    // ===== MIGRATE PREFERENCES =====
    const prefsUpdates: Partial<WorkspacePreferences> = {};

    // Migrate theme
    const theme = localStorage.getItem('theme');
    if (theme === 'workspace-light' || theme === 'workspace-dark') {
      prefsUpdates.theme = {
        mode: theme,
        preferSystemTheme: false,
      };
      console.log('[Migration] Found theme:', theme);
    }

    // Migrate editor view mode
    const viewMode = localStorage.getItem('editorViewMode');
    if (viewMode === 'edit' || viewMode === 'preview' || viewMode === 'split') {
      prefsUpdates.editor = {
        defaultViewMode: viewMode,
        autoSave: true,
        autoSaveDebounce: 2000,
      };
      console.log('[Migration] Found editor view mode:', viewMode);
    }

    // Write preferences if any found
    if (Object.keys(prefsUpdates).length > 0) {
      await prefsAPI.updatePreferences(prefsUpdates);
      console.log('[Migration] Migrated preferences to GitHub');
    }

    // ===== MIGRATE STATE =====
    const stateUpdates: Partial<WorkspaceState> = {};

    // Migrate current project
    const projectId = localStorage.getItem('currentProjectId');
    if (projectId) {
      stateUpdates.session = {
        currentProjectId: projectId,
        openEditorFiles: [],
      };
      console.log('[Migration] Found current project:', projectId);
    }

    // Write state if any found
    if (Object.keys(stateUpdates).length > 0) {
      await prefsAPI.updateState(stateUpdates);
      console.log('[Migration] Migrated state to GitHub');
    }

    // Mark migration complete
    localStorage.setItem('preferences_migrated', 'true');
    console.log('[Migration] Migration complete ✓');

  } catch (error) {
    console.error('[Migration] Failed to migrate:', error);
    // Don't mark as migrated, will retry next time
    throw error;
  }
}

/**
 * Check if migration is needed
 */
export function needsMigration(): boolean {
  if (typeof localStorage === 'undefined') return false;

  const migrated = localStorage.getItem('preferences_migrated');
  if (migrated === 'true') return false;

  // Check if there's anything to migrate
  const hasTheme = localStorage.getItem('theme') !== null;
  const hasViewMode = localStorage.getItem('editorViewMode') !== null;
  const hasProject = localStorage.getItem('currentProjectId') !== null;

  return hasTheme || hasViewMode || hasProject;
}
