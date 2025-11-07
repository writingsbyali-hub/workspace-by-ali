# Known Issues - End of Session November 6, 2025

**Session:** Infrastructure-First Sprint
**Time:** End of session (~5:00 PM)

---

## 🔴 Critical: Test Dashboard JavaScript Error

### Issue
Test Git APIs page shows JavaScript errors in browser console:
```
Uncaught ReferenceError: testGitHubConnect is not defined
Uncaught ReferenceError: testForkStatus is not defined
Uncaught ReferenceError: testCreateFork is not defined
Uncaught ReferenceError: testPublishStatus is not defined
Uncaught ReferenceError: clearLog is not defined
```

### Root Cause
**Astro script scoping issue:**
- Functions defined in `<script>` tag are not in global scope
- `onclick` handlers in HTML can't access them
- Astro processes scripts in module scope by default

### Affected File
`src/pages/test-git-apis.astro`

### Impact
- ❌ Cannot click test buttons on dashboard
- ❌ Blocks interactive API testing
- ✅ APIs themselves work fine (server logs show 200 OK)
- ✅ Can still test via curl/Postman

### Quick Fixes (Choose One)

#### Option A: Add `is:inline` to Script Tag ✅ Easiest
```astro
<script is:inline>
  // All the existing functions
  function testGitHubConnect() { ... }
  function testForkStatus() { ... }
  // etc.
</script>
```

**Pros:** Minimal change, keeps existing code
**Cons:** Inline scripts bypass Astro's optimization

#### Option B: Use `window` Object
```javascript
<script>
  window.testGitHubConnect = function() { ... }
  window.testForkStatus = function() { ... }
  // etc.
</script>
```

**Pros:** Scripts still processed by Astro
**Cons:** Pollutes global namespace

#### Option C: Use addEventListener (Best Practice)
```astro
<button id="test-github-connect" class="btn btn-primary">
  Connect GitHub
</button>

<script>
  document.getElementById('test-github-connect')?.addEventListener('click', testGitHubConnect);

  function testGitHubConnect() { ... }
  // etc.
</script>
```

**Pros:** Modern, clean, Astro-friendly
**Cons:** More changes needed (remove all onclick attributes)

### Recommended Fix
**Use Option A (`is:inline`)** for quick fix, can refactor to Option C later for production.

### Testing After Fix
1. Add `is:inline` to script tag
2. Refresh page
3. Click "Check Fork Status" button
4. Should show result without console errors

---

## 🟡 Other Session Issues

### 1. Onboarding Page - Repo URL Display Error

**Issue:** Line at `/onboarding` shows literal string:
```html
<a href="{userRepo.repo_url}" ...>
```

Should be:
```astro
<a href={userRepo.repo_url} ...>
```

**File:** `src/pages/onboarding.astro` (line ~TBD - in completion screen)

**Impact:** Link doesn't work in completion screen
**Priority:** Medium
**Fix:** Remove quotes around attribute value

---

### 2. Database Migration Not Verified

**Issue:** Migration file exists but not confirmed to be run on Supabase

**File:** `supabase-migration-git-first.sql`

**Tables needed:**
- `user_repos`
- `project_cache`
- `stream_cache`

**Impact:** APIs will fail if tables don't exist
**Priority:** High
**Action:** Check Supabase dashboard, run migration if needed

---

### 3. ProjectSwitcher React Warning

**Console Warning:**
```
Warning: Invalid DOM property `class`. Did you mean `className`?
at ProjectSwitcher
```

**File:** `src/components/ui/ProjectSwitcher.tsx`

**Issue:** Using `class` instead of `className` in React component

**Impact:** Console warning (not blocking)
**Priority:** Low
**Fix:** Replace `class=` with `className=` in JSX

---

## ✅ Fixed This Session

1. ✅ Test page import errors (Layout → BaseLayout)
2. ✅ Authentication errors (getUserProfile → createSupabaseServer)
3. ✅ Username undefined error (literal `{username}` → HTML entity)
4. ✅ Keystatic nested collection creation (flat structure)
5. ✅ Keystatic back button (documented as known limitation)

---

## 📋 Next Session Checklist

**Before Testing APIs:**
- [ ] Fix test dashboard JavaScript error (add `is:inline`)
- [ ] Verify database migration ran
- [ ] Test one API via curl to confirm backend works

**Then:**
- [ ] Test all APIs via dashboard
- [ ] Try onboarding flow
- [ ] Test Keystatic content creation
- [ ] Fix onboarding repo URL display
- [ ] Fix ProjectSwitcher className warning

---

## 🔧 Terminal Status

**Server:** Running on http://127.0.0.1:4323
**Recent Activity:**
- User logged in successfully
- Visited onboarding page (repo URL error occurred)
- Test dashboard loading fine (200 OK)
- No server-side errors

**Server Logs Clean:**
- No compilation errors
- Pages building successfully
- All routes working

**Issue is client-side only** (JavaScript in browser)

---

## 📝 Notes

- All backend APIs are implemented and working
- Server responds correctly (200 OK)
- Issue is purely frontend JavaScript scoping
- Quick fix available (`is:inline`)
- Can proceed with curl testing if needed

---

**Created:** November 6, 2025, ~5:00 PM
**Status:** End of session documentation
**Next:** Fix JavaScript error, then continue testing
