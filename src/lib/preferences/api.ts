/**
 * GitHub-backed preferences API
 * Handles reading/writing preferences to user's GitHub repository
 */

import { Octokit } from 'octokit';
import type { WorkspacePreferences, WorkspaceState, PreferencesCache, StateCache } from './types';
import { DEFAULT_PREFERENCES, DEFAULT_STATE } from './defaults';

export class PreferencesAPI {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  // Cache management
  private preferencesCache: PreferencesCache | null = null;
  private stateCache: StateCache | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Update queue for debouncing
  private updateQueue: Array<{ key: string; value: any }> = [];
  private updateTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(token: string, owner: string, repo: string, branch = 'main') {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
  }

  // ===== READ OPERATIONS =====

  /**
   * Get preferences from GitHub (with caching)
   */
  async getPreferences(): Promise<WorkspacePreferences> {
    const path = '.workspace/preferences.json';

    // Check in-memory cache first
    if (this.preferencesCache && this.isCacheFresh(this.preferencesCache.timestamp)) {
      return this.preferencesCache.data;
    }

    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if ('content' in response.data && response.data.type === 'file') {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        const prefs = JSON.parse(content) as WorkspacePreferences;

        // Update in-memory cache
        this.preferencesCache = {
          data: prefs,
          timestamp: Date.now(),
          sha: response.data.sha,
        };

        // Update localStorage cache for offline access
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('preferences_cache', JSON.stringify(prefs));
          localStorage.setItem('preferences_sha', response.data.sha);
        }

        return prefs;
      }
    } catch (error: any) {
      // File doesn't exist yet (404) - return defaults
      if (error.status === 404) {
        return this.getDefaultPreferences();
      }

      // Network error - try localStorage cache
      if (typeof localStorage !== 'undefined') {
        const localCache = localStorage.getItem('preferences_cache');
        if (localCache) {
          console.warn('[PreferencesAPI] Using localStorage cache due to error:', error);
          return JSON.parse(localCache);
        }
      }

      console.error('[PreferencesAPI] Failed to fetch preferences:', error);
      throw error;
    }

    return this.getDefaultPreferences();
  }

  /**
   * Get workspace state from GitHub (with caching)
   */
  async getState(): Promise<WorkspaceState> {
    const path = '.workspace/state.json';

    // Check in-memory cache first
    if (this.stateCache && this.isCacheFresh(this.stateCache.timestamp)) {
      return this.stateCache.data;
    }

    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if ('content' in response.data && response.data.type === 'file') {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        const state = JSON.parse(content) as WorkspaceState;

        // Update in-memory cache
        this.stateCache = {
          data: state,
          timestamp: Date.now(),
          sha: response.data.sha,
        };

        // Update localStorage cache
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('state_cache', JSON.stringify(state));
          localStorage.setItem('state_sha', response.data.sha);
        }

        return state;
      }
    } catch (error: any) {
      // File doesn't exist yet (404) - return defaults
      if (error.status === 404) {
        return this.getDefaultState();
      }

      // Network error - try localStorage cache
      if (typeof localStorage !== 'undefined') {
        const localCache = localStorage.getItem('state_cache');
        if (localCache) {
          console.warn('[PreferencesAPI] Using localStorage cache for state due to error:', error);
          return JSON.parse(localCache);
        }
      }

      console.error('[PreferencesAPI] Failed to fetch state:', error);
      throw error;
    }

    return this.getDefaultState();
  }

  // ===== WRITE OPERATIONS =====

  /**
   * Update preferences in GitHub
   */
  async updatePreferences(updates: Partial<WorkspacePreferences>): Promise<void> {
    const path = '.workspace/preferences.json';

    try {
      // Get current preferences
      const current = await this.getPreferences();
      const sha = this.preferencesCache?.sha ||
                  (typeof localStorage !== 'undefined' ? localStorage.getItem('preferences_sha') : undefined) ||
                  undefined;

      // Deep merge with current
      const updated = this.deepMerge(current, updates) as WorkspacePreferences;

      // Write to GitHub
      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: 'Update workspace preferences',
        content: Buffer.from(JSON.stringify(updated, null, 2)).toString('base64'),
        sha,
        branch: this.branch,
      });

      // Update cache with new SHA
      this.preferencesCache = {
        data: updated,
        timestamp: Date.now(),
        sha: response.data.content?.sha || '',
      };

      // Update localStorage cache
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('preferences_cache', JSON.stringify(updated));
        localStorage.setItem('preferences_sha', response.data.content?.sha || '');
      }

    } catch (error: any) {
      // Handle SHA conflict (409) - refetch and retry
      if (error.status === 409) {
        console.warn('[PreferencesAPI] SHA conflict detected, refetching and retrying...');
        this.preferencesCache = null;
        return this.updatePreferences(updates);
      }
      throw error;
    }
  }

  /**
   * Update workspace state in GitHub
   */
  async updateState(updates: Partial<WorkspaceState>): Promise<void> {
    const path = '.workspace/state.json';

    try {
      // Get current state
      const current = await this.getState();
      const sha = this.stateCache?.sha ||
                  (typeof localStorage !== 'undefined' ? localStorage.getItem('state_sha') : undefined) ||
                  undefined;

      // Deep merge with current
      const updated = this.deepMerge(current, updates) as WorkspaceState;

      // Write to GitHub
      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: 'Update workspace state',
        content: Buffer.from(JSON.stringify(updated, null, 2)).toString('base64'),
        sha,
        branch: this.branch,
      });

      // Update cache with new SHA
      this.stateCache = {
        data: updated,
        timestamp: Date.now(),
        sha: response.data.content?.sha || '',
      };

      // Update localStorage cache
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('state_cache', JSON.stringify(updated));
        localStorage.setItem('state_sha', response.data.content?.sha || '');
      }

    } catch (error: any) {
      // Handle SHA conflict (409) - refetch and retry
      if (error.status === 409) {
        console.warn('[PreferencesAPI] SHA conflict detected for state, refetching and retrying...');
        this.stateCache = null;
        return this.updateState(updates);
      }
      throw error;
    }
  }

  // ===== BATCH OPERATIONS =====

  /**
   * Queue an update for batched processing (debounced)
   */
  queueUpdate(key: string, value: any): void {
    this.updateQueue.push({ key, value });

    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    this.updateTimer = setTimeout(() => {
      this.flushQueue();
    }, 3000); // 3 second debounce
  }

  /**
   * Flush queued updates to GitHub
   */
  private async flushQueue(): Promise<void> {
    if (this.updateQueue.length === 0) return;

    const updates = [...this.updateQueue];
    this.updateQueue = [];

    // Convert queue to update object
    const updateObj: any = {};
    for (const { key, value } of updates) {
      this.setNestedValue(updateObj, key, value);
    }

    try {
      await this.updateState(updateObj);
    } catch (error) {
      console.error('[PreferencesAPI] Failed to flush queue:', error);
      // Re-queue failed updates
      this.updateQueue.push(...updates);
    }
  }

  // ===== HELPER METHODS =====

  private isCacheFresh(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }

  private isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  private getDefaultPreferences(): WorkspacePreferences {
    return { ...DEFAULT_PREFERENCES };
  }

  private getDefaultState(): WorkspaceState {
    return { ...DEFAULT_STATE };
  }

  /**
   * Initialize preferences file in GitHub for first-time users
   */
  async initializePreferences(): Promise<void> {
    const path = '.workspace/preferences.json';

    try {
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: 'Initialize workspace preferences',
        content: Buffer.from(JSON.stringify(DEFAULT_PREFERENCES, null, 2)).toString('base64'),
        branch: this.branch,
      });
    } catch (error) {
      console.error('[PreferencesAPI] Failed to initialize preferences:', error);
      throw error;
    }
  }

  /**
   * Initialize state file in GitHub for first-time users
   */
  async initializeState(): Promise<void> {
    const path = '.workspace/state.json';

    try {
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message: 'Initialize workspace state',
        content: Buffer.from(JSON.stringify(DEFAULT_STATE, null, 2)).toString('base64'),
        branch: this.branch,
      });
    } catch (error) {
      console.error('[PreferencesAPI] Failed to initialize state:', error);
      throw error;
    }
  }
}
