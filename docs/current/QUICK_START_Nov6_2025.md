# Quick Start - November 6, 2025 Session

**For:** Next session continuation
**Date Created:** November 6, 2025
**Last Updated:** November 6, 2025, 7:30 PM
**Goal:** Get you up to speed in 5 minutes and continue building

---

## 🚀 TL;DR - Start Here

**What Happened Last Session (Nov 6):**
We discovered we were building **multi-tenant** (one app, many users) but you wanted **self-hosted** (each person deploys their own). We refactored the foundation to support this.

**What We Built:**
- ✅ Database schema (owner/reader roles, acknowledgments)
- ✅ Middleware (role detection, permissions)
- ✅ .env.example (self-hosting template)

**What's Next (Priority Order):**
1. Test refactoring (run migrations, check for errors)
2. Rename streams → sub-projects
3. Build owner setup wizard
4. Test YOUR workspace end-to-end

**Current Status:** Foundation ready, testing needed

---

## 📖 Read These (In Order)

### **1. Five-Minute Overview (Start Here)**
This file (you're reading it!)

### **2. Full Context (If You Have 30 Minutes)**
[SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md](./SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md)
- Complete story of what happened
- All decisions made
- Full architecture explanation

### **3. Current Snapshot (If You Need Details)**
[CURRENT_STATE.md](./CURRENT_STATE.md)
- What's working, what's not
- File status
- Testing status

### **4. Task List (To See Progress)**
[MASTER_TASKLIST.md](./MASTER_TASKLIST.md)
- Updated with refactoring phase
- Next session priorities listed

---

## 🎯 NEXT STEPS (Do These In Order)

### **Step 1: Test Refactoring** (~30-60 min)

**Open Supabase SQL Editor:**
1. Go to https://supabase.com/dashboard
2. Navigate to your project
3. SQL Editor tab

**Run Migration:**
```sql
-- Copy/paste contents of:
-- supabase/migrations/20241106000000_self_hosted_owner_reader.sql
-- Run it
```

**Verify Tables Created:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('workspace_settings', 'user_roles', 'reader_acknowledgments', 'reader_suggestions');
```

Should return 4 rows.

**Start Dev Server:**
```bash
npm run dev
```

**Check Console:**
- No errors? ✅ Good!
- Errors? 🔴 Debug middleware or types

**Test Login:**
1. Login to your workspace
2. You should be auto-assigned as owner
3. Check: Should redirect to `/setup` (not built yet, so might 404)

**Success Criteria:**
- [ ] Migration ran without errors
- [ ] 4 new tables exist
- [ ] Dev server starts
- [ ] No console errors
- [ ] Can log in

---

### **Step 2: Rename Streams → Sub-Projects** (~1-2 hours)

**Why:** "Streams" was confusing. "Sub-Projects" is clearer and supports hierarchy.

**Global Find/Replace:**
```
Find: stream
Replace: subproject
(case-sensitive, whole words)

Find: Stream
Replace: SubProject

Find: STREAM
Replace: SUBPROJECT
```

**Files to Update:**
- `keystatic.config.ts` - Collection name
- `src/lib/github.ts` - Function names
- `src/components/**/*.tsx` - UI labels
- `src/pages/**/*.astro` - Page references
- All API endpoints (`/api/streams` → `/api/subprojects`)

**Database Migration:**
Create `supabase/migrations/20241106000001_rename_streams.sql`:
```sql
-- Rename table
ALTER TABLE stream_cache RENAME TO subproject_cache;

-- Rename columns
ALTER TABLE subproject_cache RENAME COLUMN stream_slug TO subproject_slug;

-- Update indexes
-- (drop old, create new with new names)
```

**Test:**
- [ ] Keystatic shows "Sub-Projects" not "Streams"
- [ ] Can create sub-projects
- [ ] Dashboard displays sub-projects
- [ ] No errors in console

---

### **Step 3: Build Owner Setup Wizard** (~2-3 hours)

**Create `/setup` Page:**
1. Copy `src/pages/onboarding.astro` → `src/pages/setup.astro`
2. Update to be owner-specific:
   - Step 1: Welcome (explain owner role)
   - Step 2: Connect GitHub (existing OAuth flow)
   - Step 3: Fork template repo (existing API)
   - Step 4: Complete (redirect to dashboard)
3. Remove any multi-tenant assumptions

**Test:**
- [ ] Can access `/setup`
- [ ] GitHub OAuth works
- [ ] Repo fork works
- [ ] Redirects to dashboard on complete
- [ ] Can access Keystatic after setup

---

### **Step 4: Add Repo Visibility Toggle** (~1 hour)

**Add to Settings Page:**
```typescript
// Checkbox: Make workspace public
// Default: private
// Stores in workspace_settings.default_repo_visibility
```

**Update Project Pages:**
- Show lock icon if private
- Show public icon if public
- Display license if public

**Test:**
- [ ] Can toggle visibility in settings
- [ ] Projects show correct icon
- [ ] Setting persists

---

### **Step 5: Test End-to-End** (~30 min)

**Full Owner Flow:**
1. Fresh browser (clear localStorage)
2. Visit workspace
3. Login
4. Complete `/setup` wizard
5. Access Keystatic
6. Create a project
7. Create a sub-project
8. Edit content
9. Publish
10. View on dashboard

**Success Criteria:**
- [ ] All steps complete without errors
- [ ] Content saves to Git
- [ ] Dashboard displays correctly
- [ ] Your workspace is functional!

---

## 🚨 IF YOU GET STUCK

### **Migration Errors**
- Read error message carefully
- Check if tables already exist (drop them first)
- Verify Supabase connection
- Check SQL syntax

### **Middleware Errors**
- Check TypeScript types (`src/env.d.ts`)
- Verify Supabase queries work
- Add `console.log` to debug role detection
- Check if `workspace_settings` table has data

### **Build Errors**
- Run `npm install` (packages may be missing)
- Check import paths
- Verify TypeScript types match
- Clear `.astro` cache: `rm -rf .astro`

### **Keystatic Not Working**
- Check token proxy API (`/api/keystatic/token`)
- Verify GitHub token is stored in database
- Check Keystatic config for errors
- Try local mode first before GitHub mode

---

## 📊 PROGRESS CHECK

**After Completing Step 1:**
- [ ] Migrations work
- [ ] Middleware works
- Progress: ~35%

**After Completing Step 2:**
- [ ] Streams renamed everywhere
- Progress: ~40%

**After Completing Step 3:**
- [ ] Setup wizard functional
- Progress: ~50%

**After Completing Step 4:**
- [ ] Repo visibility toggle works
- Progress: ~55%

**After Completing Step 5:**
- [ ] YOUR workspace is functional!
- Progress: ~60%
- **Milestone:** Owner MVP Complete! 🎉

---

## 🎯 WHAT COMES AFTER (Phase 1B)

Once YOUR workspace works:

1. **Hierarchical Sub-Projects** (~2-3 hours)
   - Add `parent_subproject_id` to schema
   - Update UI to show tree structure
   - Breadcrumb navigation

2. **Vercel Deploy Button** (~1 hour)
   - Create `vercel.json`
   - Add deploy button to README
   - Test fresh deployment

3. **Deployment Documentation** (~2 hours)
   - Write self-hosting guide
   - Step-by-step with screenshots
   - Troubleshooting section

**Then Phase 2: Reader Accounts** (deferred for now)

---

## 💡 KEY REMINDERS

**Architecture:**
- Self-hosted (not multi-tenant)
- Each person deploys their own workspace
- Owner/reader roles (owner first)

**Terminology:**
- Sub-projects (not streams)
- Keystatic (not DecapCMS)
- `workspace-{username}` (not `workspace-by-{username}`)

**Priority:**
- Test first (make sure refactoring works)
- Owner MVP (get YOUR workspace working)
- Readers later (Phase 2)

**Testing:**
- Test after each change
- Check console for errors
- Verify in database (Supabase dashboard)

---

## 📞 NEED MORE INFO?

**Quick Reference:**
- Vision & Decisions → [SESSION_HANDOFF_Nov6_2025](./SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md)
- Current Status → [CURRENT_STATE.md](./CURRENT_STATE.md)
- Task Progress → [MASTER_TASKLIST.md](./MASTER_TASKLIST.md)
- Doc Updates → [REFACTORING_TRACKER.md](./REFACTORING_TRACKER.md)

**If Completely Lost:**
Start with SESSION_HANDOFF_Nov6_2025 - it has everything.

---

## ✅ SESSION GOALS (For Today)

**Minimum:**
- [ ] Migrations run successfully
- [ ] Dev server starts without errors

**Good:**
- [ ] Streams renamed to sub-projects
- [ ] Setup wizard started

**Excellent:**
- [ ] Setup wizard complete
- [ ] End-to-end owner flow works

**Stretch:**
- [ ] Repo visibility toggle
- [ ] Deploy button created

---

**Start with Step 1 (Test Refactoring) and work your way through!**

**Good luck! 🚀**

---

**Created:** November 6, 2025, 7:30 PM
**For Session:** November 7+ (next continuation)
**Priority:** Test → Rename → Build → Test
