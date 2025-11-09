/**
 * GitHub-backed preferences system
 * Export all public APIs
 */

export { PreferencesAPI } from './api';
export { migrateToGitHub, needsMigration } from './migrate';
export { DEFAULT_PREFERENCES, DEFAULT_STATE } from './defaults';
export type { WorkspacePreferences, WorkspaceState, PreferencesCache, StateCache } from './types';
