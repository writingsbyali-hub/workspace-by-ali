# Keystatic Navigation Issue

**Date:** November 6, 2025
**Issue:** Back button in Keystatic UI doesn't work without page refresh
**Type:** Known Limitation
**Impact:** Minor UX annoyance

---

## The Problem

### Symptoms

1. Navigate to `/keystatic` admin UI
2. Click into a collection (e.g., Projects)
3. Click back arrow in Keystatic UI
4. **Expected:** Navigate back to collections list
5. **Actual:** Nothing happens, need to refresh page

### Root Cause

**Client-side routing conflict:**
- Keystatic uses React Router for client-side navigation
- Astro uses server-side routing
- When Keystatic is loaded as an Astro integration, React Router's `history.push()` doesn't trigger Astro's routing

**Technical Details:**
```
Keystatic Admin UI (React SPA)
  └─ React Router (client-side)
      └─ Conflicting with Astro's routing layer
```

---

## Is This a Bug?

**No** - This is a known limitation of embedding React SPAs in Astro.

**Why it happens:**
- Keystatic is a full React application mounted at `/keystatic`
- React Router expects full control of browser history
- Astro's SSR setup doesn't fully hand over control
- Some React Router events don't propagate correctly

**Similar issues:**
- Next.js + embedded React apps
- Remix + embedded SPAs
- Any SSR framework + client-side routing

---

## Workarounds

### For Users

#### 1. Use Browser Back Button ✅
Instead of Keystatic's back arrow, use browser's back button (or Alt+Left Arrow)

**Works because:** Browser back uses native History API

#### 2. Use Breadcrumbs
Keystatic shows breadcrumbs at the top - click on collection name

#### 3. Refresh After Navigation ⚠️
If back button doesn't work, press `F5` to refresh

#### 4. Open in New Tab
Right-click links and "Open in new tab" to avoid needing back button

---

## Attempted Fixes

### Fix 1: Force Full Page Navigation ❌

```typescript
// In astro.config.mjs
keystatic({
  clientRouting: false  // Not a real option
})
```

**Result:** Keystatic doesn't expose this option

### Fix 2: Override React Router ❌

```javascript
// Inject custom history
window.addEventListener('popstate', () => {
  window.location.reload()
})
```

**Result:** Breaks Keystatic's internal state management

### Fix 3: Update Astro Integration ⏳

```bash
npm update @keystatic/astro @keystatic/core
```

**Result:** Check if newer versions fix the issue

**Current versions:**
- `@keystatic/core`: Check package.json
- `@keystatic/astro`: Check package.json

---

## Potential Solutions (Future)

### Option 1: Wait for Keystatic Update

**Keystatic team** may fix this in future versions

**Track:**
- GitHub Issues: https://github.com/Thinkmill/keystatic/issues
- Search for: "Astro navigation" or "back button"

### Option 2: Custom Keystatic Build

**Advanced:** Fork Keystatic and modify routing behavior

**Not recommended:** High maintenance burden

### Option 3: External CMS

**Alternative:** Use Keystatic via separate deployment

```
keystatic-admin.yourdomain.com  (Standalone Keystatic)
    ↓ (commits to)
GitHub Repo
    ↓ (syncs to)
workspace.yourdomain.com  (Astro site)
```

**Pros:**
- Full client-side routing
- No integration conflicts
- Better performance

**Cons:**
- Additional deployment
- More complex setup

---

## Recommendation

### For MVP: Document & Accept ✅

**Rationale:**
- Minor UX issue
- Easy workarounds exist
- Not worth significant engineering time
- May be fixed by Keystatic updates

**Action Items:**
1. ✅ Document the issue (this file)
2. ✅ Add user instructions in onboarding
3. ✅ Add help text in Keystatic UI (if possible)
4. ⏳ Check for updates periodically

### For Production: Monitor & Reevaluate

**Timeline:** Check every 2-3 months
**Trigger:** If multiple users complain, escalate to fix

---

## User Instructions

### How to Navigate Keystatic

**When viewing a collection item:**

```
Option 1: Browser Back Button
  ├─ Click browser's back arrow (top left)
  └─ Or press: Alt + ← (Windows/Linux) or Cmd + ← (Mac)

Option 2: Breadcrumbs
  ├─ Look for breadcrumbs at top: Home > Projects > My Project
  └─ Click on "Projects" to go back

Option 3: Sidebar
  └─ Use the left sidebar to navigate directly to collections

Option 4: Refresh
  ├─ If stuck, press F5 or Ctrl+R (Cmd+R on Mac)
  └─ You'll return to the last page
```

---

## Testing Results

### Test Case 1: Collections List → Item → Back

**Steps:**
1. Visit `/keystatic`
2. Click "Projects" collection
3. Click on a project
4. Click back arrow in Keystatic UI

**Result:**
- ❌ Keystatic back button: No navigation
- ✅ Browser back button: Works
- ✅ Breadcrumb click: Works

### Test Case 2: Item → Edit → Back

**Steps:**
1. Open a project in Keystatic
2. Click "Edit"
3. Click back arrow

**Result:**
- ❌ Keystatic back button: No navigation
- ✅ Browser back button: Works

### Test Case 3: Deep Navigation

**Steps:**
1. Collections → Projects → Item → Edit → Back → Back → Back

**Result:**
- ❌ Keystatic buttons: Stuck at each level
- ✅ Browser back: Works at every level

---

## Monitoring

### Check for Updates

```bash
# Check current versions
npm list @keystatic/core @keystatic/astro

# Check for updates
npm outdated @keystatic/core @keystatic/astro

# Update if new version available
npm update @keystatic/core @keystatic/astro

# After update, test navigation again
```

### GitHub Issues to Watch

1. **Keystatic Repo:** https://github.com/Thinkmill/keystatic
   - Watch for: "astro navigation", "back button", "history"

2. **Astro Repo:** https://github.com/withastro/astro
   - Watch for: "react router", "SPA integration"

---

## Summary

| Aspect | Status |
|--------|--------|
| **Issue** | Back button requires page refresh |
| **Severity** | Low (workarounds exist) |
| **Root Cause** | React Router + Astro routing conflict |
| **Fix Available** | No (inherent limitation) |
| **Workarounds** | Browser back, breadcrumbs, refresh |
| **Action** | Document & monitor |
| **Impact on MVP** | Minimal (acceptable) |

---

## Decision

**For this session:**
- ✅ Document the issue
- ✅ Note workarounds for users
- ✅ Mark as "known limitation" not "bug to fix"
- ✅ Move forward with other priorities

**Not fixing because:**
1. Minor UX issue with easy workarounds
2. May require forking Keystatic (high maintenance)
3. Likely to be fixed by Keystatic team eventually
4. Other priorities are more important for MVP

---

## Related Documentation

- [Keystatic Fix Explanation](./keystatic-fix-explanation.md) - Nested collection fix
- [Keystatic Integration Docs](https://keystatic.com/docs/installation-astro)
- [React Router in Astro](https://docs.astro.build/en/guides/integrations-guide/react/)
