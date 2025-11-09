# GitHub-Backed Preferences System - Implementation Guide

This guide explains how the new GitHub-backed preferences system works and how to integrate it into your application.

## Overview

The workspace now uses **GitHub as the single source of truth** for all user preferences and settings. This enables:

- ✅ **Cross-device sync** - Your preferences follow you everywhere
- ✅ **Version control** - Preference history tracked in Git
- ✅ **Portability** - Clone your repo, get your settings
- ✅ **Offline support** - Works offline with local cache
- ✅ **No external storage** - Everything in YOUR GitHub repo

## Architecture

```
User's Browser
    ↓
PreferencesProvider (React Context)
    ↓
PreferencesAPI (GitHub integration)
    ↓
Three-tier caching:
    1. In-memory (5min TTL) ← Fastest
    2. localStorage (offline fallback) ← Fast
    3. GitHub API (source of truth) ← Authoritative
```

## File Structure

### In User's GitHub Repository

```
user-repo/
├── .workspace/
│   ├── preferences.json    # Theme, editor settings, etc.
│   ├── state.json          # Current project, recent activity
│   └── README.md           # User documentation
```

### In Application Code

```
src/
├── lib/
│   └── preferences/
│       ├── api.ts          # PreferencesAPI class
│       ├── types.ts        # TypeScript types
│       ├── defaults.ts     # Default values
│       ├── migrate.ts      # Migration from localStorage
│       └── index.ts        # Exports
├── components/
│   └── providers/
│       └── PreferencesProvider.tsx  # React context provider
└── hooks/
    ├── usePreferences.ts    # React hook
    └── useWorkspaceState.ts # State hook
```

## Step 1: Wrap Your App with PreferencesProvider

In your main layout or root component:

```tsx
import { PreferencesProvider } from './components/providers/PreferencesProvider';

// Get GitHub credentials from your auth system
const { gitHubToken, repoOwner, repoName } = getUserAuth();

function App() {
  return (
    <PreferencesProvider
      token={gitHubToken}
      owner={repoOwner}
      repo={repoName}
      branch="main"
    >
      {/* Your app components */}
    </PreferencesProvider>
  );
}
```

## Step 2: Use Preferences in Components

### Example: Theme Toggle

```tsx
import { usePreferencesWithFallback } from '../providers/PreferencesProvider';

export default function ThemeToggle() {
  const { preferences, setTheme, loading } = usePreferencesWithFallback();

  const currentTheme = preferences?.theme.mode || 'workspace-light';

  const toggleTheme = async () => {
    const newTheme = currentTheme === 'workspace-light'
      ? 'workspace-dark'
      : 'workspace-light';

    await setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme}>
      {currentTheme === 'workspace-dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

### Example: Project Switcher

```tsx
import { usePreferencesWithFallback } from '../providers/PreferencesProvider';

export default function ProjectSwitcher({ projects }) {
  const { state, setCurrentProject } = usePreferencesWithFallback();

  const currentProjectId = state?.session?.currentProjectId;

  const handleSelectProject = async (projectId: string) => {
    await setCurrentProject(projectId);
  };

  return (
    <select
      value={currentProjectId || ''}
      onChange={(e) => handleSelectProject(e.target.value)}
    >
      {projects.map(p => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  );
}
```

### Example: Editor View Mode

```tsx
import { usePreferencesWithFallback } from '../providers/PreferencesProvider';

export default function EditorViewMode() {
  const { preferences, setEditorViewMode } = usePreferencesWithFallback();

  const viewMode = preferences?.editor?.defaultViewMode || 'split';

  return (
    <div>
      <button onClick={() => setEditorViewMode('edit')}>Edit</button>
      <button onClick={() => setEditorViewMode('preview')}>Preview</button>
      <button onClick={() => setEditorViewMode('split')}>Split</button>

      <p>Current mode: {viewMode}</p>
    </div>
  );
}
```

## Step 3: Migration from localStorage

The system automatically migrates existing localStorage data on first load. The migration runs once per user and moves:

- `theme` → `.workspace/preferences.json`
- `currentProjectId` → `.workspace/state.json`
- `editorViewMode` → `.workspace/preferences.json`

No action needed - it happens automatically!

## API Reference

### PreferencesProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `token` | string | Yes | GitHub personal access token |
| `owner` | string | Yes | GitHub username/org |
| `repo` | string | Yes | Repository name |
| `branch` | string | No | Branch name (default: 'main') |

### usePreferencesWithFallback() Hook

Returns:

```typescript
{
  // Data
  preferences: WorkspacePreferences | null;
  state: WorkspaceState | null;
  loading: boolean;
  error: Error | null;

  // Update methods
  updatePreferences: (updates: Partial<WorkspacePreferences>) => Promise<void>;
  updateState: (updates: Partial<WorkspaceState>) => Promise<void>;

  // Convenience methods
  setTheme: (mode: 'workspace-light' | 'workspace-dark' | 'system') => Promise<void>;
  setEditorViewMode: (mode: 'edit' | 'preview' | 'split') => Promise<void>;
  setCurrentProject: (projectId: string) => Promise<void>;
}
```

### Data Types

```typescript
interface WorkspacePreferences {
  version: string;
  theme: {
    mode: 'workspace-light' | 'workspace-dark' | 'system';
    preferSystemTheme: boolean;
  };
  editor: {
    defaultViewMode: 'edit' | 'preview' | 'split';
    autoSave: boolean;
    autoSaveDebounce: number;
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

interface WorkspaceState {
  version: string;
  session: {
    currentProjectId?: string;
    currentSubProjectId?: string;
    openEditorFiles: string[];
  };
  recentActivity: {
    lastVisited: string;
    recentProjects: string[];
    recentDocs: string[];
  };
  ui: {
    notificationsDismissed: string[];
    tourCompleted: boolean;
    onboardingStep?: number;
  };
}
```

## Optimistic Updates

All preference updates use **optimistic updates** for instant UX:

1. UI updates immediately (no spinner needed)
2. GitHub sync happens in background
3. Rollback on error
4. BroadcastChannel syncs across tabs

```tsx
const { setTheme } = usePreferencesWithFallback();

// UI updates instantly, GitHub sync happens async
await setTheme('workspace-dark'); // <-- Returns immediately
```

## Cross-Tab Sync

Changes in one browser tab automatically sync to other tabs via BroadcastChannel API:

```
Tab 1: User changes theme → Updates GitHub → Broadcasts event
Tab 2: Receives broadcast → Updates local state → UI reflects change
```

## Offline Support

The system works offline using a three-tier cache:

1. **In-memory cache** (5 min TTL) - Fastest, cleared on page reload
2. **localStorage cache** - Persists across sessions, used when offline
3. **GitHub API** - Source of truth, synced when online

```
Online:  GitHub API → Cache → Component
Offline: localStorage Cache → Component (read-only)
Back online: Queued writes flush to GitHub
```

## Error Handling

All operations handle errors gracefully:

```tsx
const { setTheme, error } = usePreferencesWithFallback();

try {
  await setTheme('workspace-dark');
} catch (err) {
  console.error('Failed to save theme:', err);
  // UI already rolled back automatically
}

// Or check error state
if (error) {
  return <div>Error: {error.message}</div>;
}
```

## Performance Considerations

### Caching Strategy

- **Read**: In-memory (instant) → localStorage (fast) → GitHub (2-3s)
- **Write**: Optimistic UI update (instant) → GitHub (async)
- **TTL**: 5 minutes for in-memory cache

### Rate Limiting

GitHub API limits: 5,000 requests/hour (authenticated)

Our usage:
- ~12 reads/hour (5 min cache)
- ~20 writes/hour (debounced)
- **Total**: ~32 requests/hour (well under limit)

### Debouncing

Frequent updates are debounced to prevent commit spam:

```typescript
// Theme changes: Immediate (rare, user-initiated)
setTheme('dark'); // → GitHub commit immediately

// Editor view mode: 3s debounce (may toggle frequently)
setEditorViewMode('split'); // → Waits 3s before commit

// Can be configured per preference type
```

## Security

### Token Storage

GitHub tokens are:
- ✅ Encrypted with AES-256-GCM before storage
- ✅ Stored in Supabase `user_repos` table
- ✅ Never exposed to client code
- ✅ Decrypted server-side only

### Data Privacy

- Preferences live in **user's own repository**
- If repo is private, preferences are private
- No third-party storage
- User owns and controls all data

## Troubleshooting

### Preferences not syncing?

1. Check GitHub API rate limits (visible in DevTools network tab)
2. Check browser console for errors
3. Verify GitHub token has repo access
4. Check internet connection

### Lost preferences?

Preferences are version-controlled in Git! Restore from history:

```bash
# View preference change history
git log .workspace/preferences.json

# Restore from specific commit
git checkout <commit-hash> .workspace/preferences.json
```

### Want to start fresh?

```bash
# Delete .workspace/ directory
rm -rf .workspace/

# Reload app - files will be recreated with defaults
```

## Migration Checklist

- [x] Install preferences system files
- [x] Wrap app with PreferencesProvider
- [x] Update components to use usePreferencesWithFallback()
- [x] Test theme changes sync across tabs
- [x] Test offline → online transition
- [x] Verify migration from localStorage works
- [ ] Deploy to production
- [ ] Monitor GitHub API usage
- [ ] Gather user feedback

## Next Steps

1. **Test thoroughly** in development
2. **Monitor GitHub API usage** after deployment
3. **Add more preferences** as needed (extend WorkspacePreferences interface)
4. **Consider adding** a preferences UI/settings page
5. **Document** for users in your main README

---

**Questions?** Check the [.workspace README](../.workspace-README.md) or [file an issue](https://github.com/writingsbyali-hub/workspace-by-ali/issues).
