# .workspace/ Directory

Welcome to your workspace preferences directory! 👋

This directory contains your personal workspace settings and preferences, automatically synced across all your devices via GitHub.

## Files

### `preferences.json`
Your workspace preferences - how the app looks and behaves:

- **theme**: Light/dark theme preference
- **editor**: Editor settings (view mode, auto-save, etc.)
- **navigation**: Navigation preferences
- **accessibility**: Accessibility settings

### `state.json`
Your workspace session state - what you're working on:

- **session**: Current project, open files
- **recentActivity**: Recently viewed projects and docs
- **ui**: UI state (dismissed notifications, tour progress)

## How It Works

**Automatic Sync**
- Changes sync to GitHub within seconds
- Works across all your devices
- Cached locally for offline access

**Version Control**
- All changes tracked in Git
- View history: `git log .workspace/`
- Restore old settings: `git checkout <commit> .workspace/preferences.json`

**Privacy**
- These files live in YOUR repository
- You control who can see them
- No third-party storage

## Editing Preferences

You can edit these files in three ways:

1. **Through the app** (recommended)
   - Use the settings page
   - Changes sync automatically

2. **Directly in GitHub**
   - Edit files on github.com
   - Refresh your workspace to see changes

3. **Locally in your repo**
   - Edit files in your text editor
   - Commit and push to sync

## File Format

Both files are JSON with a simple structure:

```json
{
  "version": "1.0.0",
  "theme": {
    "mode": "workspace-dark",
    "preferSystemTheme": false
  },
  ...
}
```

**Tip**: Use a JSON validator to avoid syntax errors!

## Troubleshooting

**Changes not syncing?**
1. Check your internet connection
2. Check browser console for errors
3. Try refreshing the page

**Lost your preferences?**
```bash
# View change history
git log .workspace/preferences.json

# Restore from previous commit
git checkout <commit-hash> .workspace/preferences.json
```

**Want to start fresh?**
```bash
# Delete and let the app recreate with defaults
rm -rf .workspace/
```

**Keep state local-only?**
Add to `.gitignore` to prevent syncing:
```gitignore
.workspace/state.json
```

## Learn More

- [GitHub Preferences Guide](../docs/GITHUB_PREFERENCES_GUIDE.md)
- [Workspace Documentation](../README.md)
- [Report an Issue](https://github.com/writingsbyali-hub/workspace-by-ali/issues)

---

**Happy researching!** 🚀
