# Testing Guide: GitHub-Backed Preferences System

This guide will help you test the new GitHub-backed preferences system to ensure it works correctly before deploying to production.

## Prerequisites

Before testing, ensure:

1. ✅ You have a GitHub account
2. ✅ You've connected your GitHub account to the workspace
3. ✅ You have a repository forked from the template
4. ✅ The repository has a `.workspace/` directory with `preferences.json` and `state.json`

## Test Scenarios

### 1. Theme Preference Sync

**Test Case 1.1: Change theme and verify sync**

1. Open your workspace in the browser
2. Click the theme toggle button in the header
3. **Expected**: Theme changes immediately
4. Open DevTools → Application → Local Storage
5. **Expected**: See `theme` in localStorage
6. Open DevTools → Network tab
7. **Expected**: See a request to GitHub API (`api.github.com/repos/.../contents/.workspace/preferences.json`)
8. Go to your GitHub repository → `.workspace/preferences.json`
9. **Expected**: `theme.mode` field reflects the new theme

**Test Case 1.2: Cross-tab sync**

1. Open your workspace in Tab 1
2. Open your workspace in Tab 2 (same browser)
3. In Tab 1, change the theme
4. **Expected**: Tab 2 theme updates within 1-2 seconds
5. No page refresh needed

**Test Case 1.3: Cross-device sync**

1. On Computer 1, change theme to dark
2. On Computer 2 (or different browser), reload the workspace
3. **Expected**: Theme is dark (may take 5 min due to cache TTL)
4. Force refresh (Ctrl/Cmd + Shift + R) to bypass cache
5. **Expected**: Theme updates immediately

---

### 2. Project Selection Sync

**Test Case 2.1: Select a project**

1. Open workspace dashboard
2. Use the project switcher to select a project
3. **Expected**: Project selection changes immediately
4. Check `.workspace/state.json` in your GitHub repo
5. **Expected**: `session.currentProjectId` updated

**Test Case 2.2: Project persists across sessions**

1. Select a project
2. Close the browser tab
3. Open workspace again
4. **Expected**: Same project is still selected

---

### 3. Editor View Mode Sync

**Test Case 3.1: Change editor view mode**

1. Open the markdown editor
2. Switch view mode (Edit → Preview → Split)
3. **Expected**: View mode changes immediately
4. Check `.workspace/preferences.json` in GitHub
5. **Expected**: `editor.defaultViewMode` updated

**Test Case 3.2: View mode persists**

1. Change view mode to "Preview"
2. Navigate away from editor
3. Return to editor
4. **Expected**: Still in "Preview" mode

---

### 4. Migration from localStorage

**Test Case 4.1: Existing localStorage data**

1. Open DevTools → Console
2. Run:
   ```javascript
   localStorage.setItem('theme', 'workspace-dark');
   localStorage.setItem('currentProjectId', 'test-project-123');
   localStorage.setItem('editorViewMode', 'split');
   ```
3. Reload the page
4. **Expected**: Console shows migration messages
5. Check `.workspace/preferences.json` and `.workspace/state.json` in GitHub
6. **Expected**: Values from localStorage are now in GitHub
7. Check localStorage
8. **Expected**: `preferences_migrated` flag set to `'true'`

**Test Case 4.2: Migration runs once**

1. After successful migration, reload page
2. **Expected**: No migration messages in console
3. **Expected**: No duplicate GitHub commits

---

### 5. Offline Support

**Test Case 5.1: Work offline**

1. Open workspace while online
2. Change theme
3. Open DevTools → Network → Toggle "Offline" mode
4. Change theme again
5. **Expected**: Theme changes in UI
6. **Expected**: Console shows errors about failed GitHub sync
7. **Expected**: localStorage cache updated
8. Toggle "Online" mode
9. **Expected**: Queued changes sync to GitHub

**Test Case 5.2: Load while offline**

1. With offline mode enabled, open workspace
2. **Expected**: Workspace loads with cached preferences
3. **Expected**: Theme from localStorage cache applied
4. **Expected**: Project selection from localStorage cache applied

---

### 6. Error Handling

**Test Case 6.1: GitHub API failure**

1. Temporarily revoke GitHub token access
2. Change theme
3. **Expected**: UI still updates (optimistic)
4. **Expected**: Console shows error
5. **Expected**: UI rolls back after error (if applicable)
6. Re-authorize GitHub
7. **Expected**: Next change syncs successfully

**Test Case 6.2: Invalid preferences file**

1. In GitHub, edit `.workspace/preferences.json` to invalid JSON
2. Reload workspace
3. **Expected**: App loads with default preferences
4. **Expected**: Console shows error about invalid JSON
5. Fix the JSON in GitHub
6. Reload workspace
7. **Expected**: Preferences load correctly

---

### 7. Performance

**Test Case 7.1: Cache performance**

1. Open workspace
2. Check Network tab for GitHub API calls
3. **Expected**: Initial load makes 2 requests (preferences + state)
4. Reload page within 5 minutes
5. **Expected**: No GitHub API calls (served from cache)
6. Wait 5+ minutes, reload page
7. **Expected**: GitHub API calls made (cache expired)

**Test Case 7.2: Optimistic updates**

1. Change theme
2. **Expected**: UI updates < 50ms (instant)
3. **Expected**: No loading spinner needed
4. Network tab shows GitHub API call happens async

---

## Automated Test Checklist

### Unit Tests

```bash
# Run unit tests for preferences API
npm test src/lib/preferences/

# Test coverage
npm run test:coverage
```

**Expected results:**
- [ ] PreferencesAPI.getPreferences() returns cached data
- [ ] PreferencesAPI.updatePreferences() merges correctly
- [ ] Migration script detects localStorage correctly
- [ ] Encryption/decryption works
- [ ] Cache TTL expires correctly

### Integration Tests

```bash
# Run integration tests
npm test -- --grep "preferences integration"
```

**Expected results:**
- [ ] Cross-tab sync works via BroadcastChannel
- [ ] Offline → online transition syncs changes
- [ ] Migration runs once and sets flag

---

## Manual Verification Checklist

Before deploying to production:

- [ ] **Theme sync works** (single tab)
- [ ] **Theme sync works** (cross-tab)
- [ ] **Theme sync works** (cross-device)
- [ ] **Project selection syncs** to GitHub
- [ ] **Editor view mode syncs** to GitHub
- [ ] **Migration from localStorage** works
- [ ] **Migration runs only once**
- [ ] **Offline mode** uses cache
- [ ] **Online mode** syncs to GitHub
- [ ] **Invalid JSON** doesn't crash app
- [ ] **GitHub API errors** handled gracefully
- [ ] **Cache expires** after 5 minutes
- [ ] **Optimistic updates** are instant
- [ ] **No memory leaks** (check DevTools Memory tab)
- [ ] **No console errors** (in normal operation)

---

## Debugging Tips

### Check preferences state

```javascript
// In browser console
// View current preferences
const prefs = JSON.parse(localStorage.getItem('preferences_cache'));
console.log(prefs);

// View current state
const state = JSON.parse(localStorage.getItem('state_cache'));
console.log(state);

// Check migration status
console.log(localStorage.getItem('preferences_migrated'));
```

### Force refresh from GitHub

```javascript
// Clear cache and reload
localStorage.removeItem('preferences_cache');
localStorage.removeItem('state_cache');
localStorage.removeItem('preferences_sha');
localStorage.removeItem('state_sha');
location.reload();
```

### Monitor GitHub API calls

```javascript
// Log all fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (args[0].includes('api.github.com')) {
    console.log('GitHub API call:', args);
  }
  return originalFetch.apply(this, args);
};
```

### View BroadcastChannel messages

```javascript
// Listen to preference updates
const channel = new BroadcastChannel('workspace-preferences');
channel.addEventListener('message', (event) => {
  console.log('Preferences updated:', event.data);
});
```

---

## Known Limitations

1. **5-minute cache TTL**: Changes on another device may take up to 5 minutes to appear (force refresh to bypass)
2. **BroadcastChannel**: Only works in modern browsers (gracefully degrades)
3. **GitHub API rate limit**: 5,000 requests/hour (should never hit this with normal usage)
4. **Offline writes**: Queued but may be lost if browser crashes before sync

---

## Troubleshooting

### "Preferences not syncing"

1. Check browser console for errors
2. Verify GitHub token is valid
3. Check GitHub API rate limit
4. Clear cache and reload

### "Migration not working"

1. Check localStorage has data to migrate
2. Verify `preferences_migrated` flag not already set
3. Check console for migration logs

### "Cross-tab sync not working"

1. Verify BroadcastChannel supported (modern browsers only)
2. Check both tabs are on same domain
3. Check console for errors

---

## Success Criteria

The system is ready for production when:

✅ All test cases pass
✅ No console errors in normal operation
✅ Cross-device sync works reliably
✅ Migration completes successfully
✅ Offline support works as expected
✅ Performance is acceptable (<100ms for UI updates)
✅ GitHub API usage is within limits

---

**Questions?** Check the [GitHub Preferences Guide](./GITHUB_PREFERENCES_GUIDE.md) or [file an issue](https://github.com/writingsbyali-hub/workspace-by-ali/issues).
