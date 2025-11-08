# Current State - November 6, 2025

**Last Updated:** November 6, 2025, 7:00 PM
**Status:** Architecture refactoring in progress (foundation complete, testing needed)
**Next Priority:** Test refactoring, build owner MVP

---

## 🎯 Quick Summary

**Where We Are:**
- ✅ Foundation refactored for self-hosted model
- ⏳ Owner MVP next (setup wizard, testing)
- 📊 ~30% complete (realistic estimate)

**What Works:**
- Supabase auth, GitHub OAuth, Git APIs, Keystatic (partial)

**What's New (Untested):**
- Owner/reader database schema, role-based middleware, env config

**What's Next:**
- Test refactoring → rename streams → build setup wizard

---

## 🏗️ ARCHITECTURE MODEL (Decided Nov 6)

### **Deployment:** Self-Hosted ✅

Each researcher deploys their own workspace:
- `alis-workspace.vercel.app` (Ali's Vercel account)
- `sarahs-workspace.vercel.app` (Sarah's Vercel account)
- `arc-commons.vercel.app` (Arc^ org account)

Each deployment has:
- Own Supabase project
- Own GitHub OAuth app
- ONE owner (first user)
- Optional reader accounts

### **User Tiers:**

**1. Readers (Lightweight)**
- Sign up on someone's workspace
- Acknowledge safety/licenses
- View gated content
- Leave suggestions
- No GitHub, no full workspace

**2. Researchers (Self-Hosted)**
- Deploy own workspace
- Full GitHub integration
- Own content repos
- Create projects & sub-projects
- Collaborate via fork/PR

**3. Commons Contributors (Arc^)**
- Contribute to org repos
- Shared safety registry
- Governance & review

---

## ✅ WHAT'S WORKING (Tested & Stable)

### **Authentication** 100% ✅
- Supabase GitHub OAuth (user accounts)
- GitHub secondary OAuth (repo access)
- Token encryption (AES-256-GCM)
- Session management
- Protected routes

**Files:**
- `src/lib/supabaseClient.ts`
- `src/lib/supabaseServer.ts`
- `src/middleware.ts`

---

### **Git Infrastructure** 100% ✅
- Fork API (creates `workspace-{username}` repos)
- Publish API (merges draft → main)
- GitHub API utilities (fetch projects, docs, etc.)
- Template repo structure
- Token proxy for Keystatic

**Files:**
- `src/pages/api/repo/fork.ts`
- `src/pages/api/publish.ts`
- `src/lib/github.ts`
- `src/pages/api/keystatic/token.ts`

---

### **Keystatic CMS** 90% ✅
- Installed and configured
- Local mode works
- GitHub mode configured
- 3 collections: Projects, Streams (flat), Updates
- Token proxy API

**Known Issues:**
- Back button navigation workaround needed
- Nested glob patterns don't work for creation
- Flat structure with relationships (workaround in place)

**Files:**
- `keystatic.config.ts`
- `astro.config.mjs`

---

### **Dashboard & UI** 85% ✅
- Project cards (displays Git content)
- Activity log timeline
- Project detail pages (read from Git)
- Doc detail pages (read from Git)
- Settings page
- Onboarding flow (needs splitting: owner vs reader)
- Theme switcher

**Files:**
- `src/pages/index.astro` (dashboard)
- `src/pages/projects.astro`
- `src/pages/projects/[id].astro`
- `src/pages/docs/[id].astro`
- `src/components/ui/*`

---

## 🆕 WHAT'S JUST BUILT (Untested - Nov 6)

### **Database Schema** NEW ⏳
Created `supabase/migrations/20241106000000_self_hosted_owner_reader.sql`

**New Tables:**
- `workspace_settings` - Owner config, defaults, reader settings
- `user_roles` - Owner vs reader roles, expert flags
- `reader_acknowledgments` - Safety/license tracking per reader
- `reader_suggestions` - Comments system for readers

**Updated Tables:**
- `project_cache` - New RLS policies for reader access
- `stream_cache` - New RLS policies for readers

**Functions:**
- `is_workspace_owner()` - Check if user is owner
- `has_acknowledged_safety()` - Check safety acknowledgment
- `has_acknowledged_license()` - Check license acknowledgment
- `auto_assign_owner()` - First user becomes owner

**Status:** ⏳ **Migration file created, NOT YET RUN in Supabase**

**Next Step:** Run migration in Supabase SQL Editor

---

### **Middleware Refactoring** NEW ⏳
Updated `src/middleware.ts`

**Changes:**
- Detect user role (owner / reader / null)
- Store workspace owner ID in locals
- Different onboarding: owner → `/setup`, reader → `/reader-signup`
- Owner-only routes protected (Keystatic, settings, APIs)
- Readers can access public/gated content after acknowledgment

**TypeScript Types Updated:**
`src/env.d.ts` now includes:
```typescript
userRole: 'owner' | 'reader' | null
workspaceOwnerId: string | null
allowReaders: boolean
isExpert?: boolean
```

**Status:** ⏳ **Code written, NOT YET TESTED**

**Next Step:** Start dev server, check for errors

---

### **Environment Configuration** NEW ✅
Created `.env.example`

**What It Includes:**
- Supabase config (each user creates own project)
- GitHub OAuth (each user creates own app)
- Token encryption key
- Reader account settings
- Safety protocol versioning
- Commons registry (optional)
- Full setup checklist
- Vercel deployment instructions

**Status:** ✅ Template ready for self-hosters

---

## ⏸️ WHAT'S HALF-BUILT (Needs Work)

### **Onboarding Flow** NEEDS SPLITTING
**Current:** `/onboarding` (assumes all users equal)
**Needs to be:**
- `/setup` - Owner wizard (GitHub + repo fork)
- `/reader-signup` - Reader flow (magic link, lightweight)

**Status:** Existing `/onboarding` code can be adapted

**Files:**
- `src/pages/onboarding.astro` - Needs to become `/setup`
- Need to create `src/pages/reader-signup.astro`

---

### **Keystatic Config** NEEDS UPDATE
**Current:** Uses "streams" terminology, flat structure
**Needs:**
- Rename to "subProjects"
- Add parent_subproject_id for hierarchy
- Update UI labels

**Status:** Works, but needs terminology update

---

### **Dashboard** NEEDS OWNER CONTROLS
**Current:** Shows content, but no role-specific features
**Needs:**
- "Edit" buttons only for owner
- Reader vs owner messaging
- Workspace settings link (owner only)

**Status:** Functional, needs permission checks

---

## ❌ WHAT'S NOT STARTED (To-Do)

### **Phase 1A: Owner MVP** (Next Priority)
- [ ] Run database migrations
- [ ] Test middleware (check for errors)
- [ ] Rename streams → sub-projects (global)
- [ ] Build `/setup` wizard page
- [ ] Add repo visibility toggle
- [ ] Test end-to-end owner flow

### **Phase 1B: Content Management**
- [ ] Hierarchical sub-projects (add parent_id)
- [ ] Sub-project tree UI
- [ ] Breadcrumb navigation

### **Phase 1C: Deployment**
- [ ] Vercel Deploy Button
- [ ] Deployment documentation
- [ ] Production testing

### **Phase 2: Reader Accounts** (Deferred)
- [ ] `/reader-signup` page
- [ ] Safety acknowledgment modals
- [ ] License acknowledgment modals
- [ ] Content gating logic
- [ ] Suggestions/comments system
- [ ] Moderation queue

### **Phase 3: Collaboration** (Deferred)
- [ ] Fork to workspace button
- [ ] Submit PR button
- [ ] PR tracking
- [ ] Contributors auto-display

### **Phase 4: Arc^ Commons** (Future)
- [ ] Commons Safety Registry
- [ ] Arc^ workspace deployment
- [ ] Submit to Commons workflow

---

## 🚨 KNOWN ISSUES

### **Critical (Blocking)**
None currently - refactoring complete, testing needed

### **High (Important)**
1. **Keystatic back button** - Doesn't work, need redirect workaround
2. **Migrations not run** - New schema exists but not applied to database
3. **Middleware untested** - Role detection code written but not tested
4. **Streams terminology** - Still says "streams" everywhere, should be "sub-projects"

### **Medium (Nice to Fix)**
5. **No hierarchical sub-projects** - Current structure is flat
6. **No repo visibility toggle** - Can't switch private/public yet
7. **Old onboarding flow** - Doesn't split owner vs reader

### **Low (Future)**
8. **No Vercel Deploy Button** - Manual setup required
9. **No deployment docs** - Self-hosting not documented yet
10. **No reader features** - Safety gates, suggestions, etc. not built

---

## 📊 PROGRESS ESTIMATE

**Overall:** ~30% complete (realistic)

**Why 30% (not 85% anymore)?**
- Previous 85% was based on wrong architecture (multi-tenant)
- We're refactoring to RIGHT architecture (self-hosted)
- Foundation is solid (auth, Git, Keystatic)
- But need to rebuild owner/reader flows
- Defer reader & collaboration features

**Breakdown by Phase:**
- ✅ Authentication & Git APIs: 100% (done)
- 🟡 Owner MVP: 15% (foundation done, wizard needed)
- ⏳ Content Management: 0% (sub-projects hierarchy)
- ⏳ Deployment: 0% (button + docs)
- ⏳ Reader Accounts: 0% (deferred)
- ⏳ Collaboration: 0% (deferred)
- ⏳ Commons: 0% (future)

---

## 🧪 TESTING STATUS

### **Never Tested:**
- Owner/reader database schema
- Middleware role detection
- Owner-only route protection
- Workspace settings table

### **Tested & Working:**
- Supabase auth
- GitHub OAuth (both primary & secondary)
- Git APIs (fork, publish, read)
- Keystatic (local mode)
- Dashboard UI
- Project/doc pages

### **Needs Re-Testing:**
- Onboarding flow (will be split)
- Middleware (refactored)
- Any page that uses role detection

---

## 📁 FILE STATUS

### **Created This Session (Nov 6):**
- ✅ `supabase/migrations/20241106000000_self_hosted_owner_reader.sql`
- ✅ `.env.example`
- ✅ `docs/SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md`
- ✅ `docs/CURRENT_STATE.md` (this file)
- ⏳ `docs/REFACTORING_TRACKER.md` (next)
- ⏳ `docs/QUICK_START_Nov6_2025.md` (next)

### **Modified This Session:**
- ✅ `src/middleware.ts` - Role detection, owner-only routes
- ✅ `src/env.d.ts` - Added role/workspace fields to Locals
- ✅ `docs/MASTER_TASKLIST.md` - Added refactoring phase

### **Needs Updating:**
- ⏳ `keystatic.config.ts` - Rename streams → subProjects
- ⏳ `src/pages/onboarding.astro` - Become `/setup`
- ⏳ All UI components - Update "streams" labels
- ⏳ Planning docs - DecapCMS → Keystatic, multi-tenant → self-hosted
- ⏳ Architecture docs - Add owner/reader roles

---

## 🎯 NEXT SESSION: START HERE

### **1. Read These First:**
- [SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md](./SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md) - Full context
- [QUICK_START_Nov6_2025.md](./QUICK_START_Nov6_2025.md) - Quick guide
- This file (CURRENT_STATE.md) - Current snapshot

### **2. Then Do (In Order):**

**Test Refactoring (~30-60 min)**
1. Open Supabase SQL Editor
2. Run migration: `supabase/migrations/20241106000000_self_hosted_owner_reader.sql`
3. Verify tables created: `workspace_settings`, `user_roles`, `reader_acknowledgments`, `reader_suggestions`
4. Run `npm run dev`
5. Check console for errors
6. Test login (should assign you as owner)
7. Check middleware: `console.log(Astro.locals.userRole)` should show "owner"

**Fix Any Issues (~30 min)**
- If migration errors: Fix SQL, re-run
- If middleware errors: Debug role detection
- If build errors: Fix imports/types

**Rename Streams → Sub-Projects (~1-2 hours)**
- Global find/replace in codebase
- Update Keystatic config
- Update UI labels
- Create migration to rename database columns

**Build Setup Wizard (~2-3 hours)**
- Copy `/onboarding` to `/setup`
- Adapt for owner-only flow
- Test end-to-end

### **3. Success Criteria:**
- [ ] Migrations run without errors
- [ ] Dev server starts without errors
- [ ] You're detected as owner role
- [ ] Setup wizard completes successfully
- [ ] Can access Keystatic
- [ ] Can create/edit content

---

## 💡 REMINDERS FOR FUTURE SESSIONS

**Don't Assume Multi-Tenant:**
If you see code assuming "all users equal" or "shared database", that's outdated. We're self-hosted now.

**Streams = Sub-Projects:**
Anywhere you see "streams", mentally replace with "sub-projects."

**Owner First, Readers Later:**
Don't build reader features until owner experience works perfectly.

**Test Everything:**
We're refactoring core architecture. Test after every change.

**Arc^ Is Future:**
Commons features are Phase 4+, not Phase 1.

---

## 📞 SUPPORT / QUESTIONS

If confused:
1. Read SESSION_HANDOFF_Nov6_2025 (most comprehensive)
2. Check this file (current snapshot)
3. Review MASTER_TASKLIST (progress tracker)
4. Check REFACTORING_TRACKER (doc cleanup status)

If blocked:
- Document the issue in this file
- Mark affected task as blocked in MASTER_TASKLIST
- Continue with next unblocked task

---

**Status:** Ready to test refactoring and build owner MVP! 🚀
**Last Updated:** November 6, 2025, 7:00 PM
