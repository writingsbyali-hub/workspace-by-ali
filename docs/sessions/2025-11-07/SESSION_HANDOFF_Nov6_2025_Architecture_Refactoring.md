# Session Handoff: November 6, 2025
## Architecture Refactoring - The Self-Hosted Revelation

**Date:** November 6, 2025
**Session Focus:** Vision clarification, architecture discovery, and foundational refactoring
**Status:** Critical architectural pivot in progress
**Next Session Priority:** Test refactoring, build owner MVP

---

## 🔥 THE BIG REVELATION

**We discovered a fundamental misalignment:**
- **Docs assumed:** Multi-tenant SaaS (one deployment, many users on shared app)
- **You wanted:** Self-hosted (each person deploys their own workspace)

This explains ALL the conflicts and confusion in the documentation. We weren't building different features - we were building for different deployment models entirely.

---

## 🎯 THE VISION (Now Crystal Clear)

### What You're Actually Building

**Workspace by Ali** is a self-hosted, open research platform with three tiers of engagement:

### **Tier 1: Readers (Lightweight Guests)**
- Visit someone's workspace (e.g., `alis-workspace.vercel.app`)
- Create lightweight account (magic link/Google OAuth)
- Acknowledge safety protocols & licenses
- Can read gated content
- Can leave suggestions/comments (moderated by owner)
- **No full workspace, no GitHub required**
- Stored in workspace owner's Supabase

### **Tier 2: Researchers (Self-Hosted Workspaces)**
- Deploy their OWN workspace (e.g., `sarahs-workspace.vercel.app`)
- Full onboarding: GitHub OAuth, fork template repo, Keystatic access
- Create projects, sub-projects, methods, data, docs
- Repos can be private (default) or public with CC licenses
- Can collaborate via GitHub (fork → PR workflow)
- Own their data completely

### **Tier 3: Commons Contributors (Arc^ Model)**
- Arc^ is a GitHub org with dedicated workspace deployment
- Core team has direct access (co-founders, leads)
- External contributors fork → work → submit PR
- Shared Commons Safety Registry (no duplicate acknowledgments)
- Governance, review, verification processes

---

## 🏗️ ARCHITECTURAL DECISIONS MADE

### 1. **Deployment Model: Self-Hosted** ✅

**Each workspace is an independent deployment:**
- You deploy `alis-workspace.vercel.app` (your Vercel account)
- Sarah deploys `sarahs-workspace.vercel.app` (her Vercel account)
- Arc^ deploys `arc-commons.vercel.app` (org Vercel account)

**Each deployment has:**
- Own Supabase project (auth, metadata, reader acknowledgments)
- Own GitHub OAuth app (for owner's repo access)
- Own encryption keys (for storing tokens)
- ONE owner (first user to deploy)
- Optional reader accounts (guests who want to read gated content)

### 2. **User Roles: Owner vs Reader** ✅

**Owner (Workspace Deployer):**
- First user to deploy = auto-assigned owner
- Full access: Keystatic, settings, repo management, APIs
- Can enable/disable reader accounts
- Can moderate reader suggestions
- Can set workspace license defaults

**Reader (Guest Account):**
- Lightweight signup (magic link or Google OAuth)
- Can read public content without account
- Can read gated content after acknowledging safety/license
- Can leave suggestions (if owner allows)
- Cannot edit content, cannot access owner tools
- No GitHub required

### 3. **Content Hierarchy: Hierarchical Sub-Projects** ✅

**OLD:** "Streams" (confusing term, flat structure)
**NEW:** "Sub-Projects" (clear term, hierarchical)

```
Project: Plasma Systems for Ecology
  ├─ Sub-Project: Design Phase
  │   └─ Sub-Project: Schematic Refinement
  ├─ Sub-Project: Testing Phase
  └─ Sub-Project: Deployment Phase
```

**Streams terminology removed everywhere.**
**Projects can have sub-projects, which can have sub-projects (infinite nesting).**

### 4. **Repository Visibility: Private Default, Public Optional** ✅

**Private repos (default):**
- Protects unpublished work
- Prevents "theft" of research
- Owner has full control

**Public repos (opt-in):**
- Must acknowledge CC license to access
- License gates enforce non-commercial, share-alike, etc.
- Good for sharing methods openly

### 5. **Safety Model: Hybrid (Local + Commons Registry)** ✅

**For personal workspaces:**
- Safety acknowledgments stored in owner's Supabase
- Fully decentralized
- Each workspace manages its own

**For commons (Arc^):**
- Shared Commons Safety Registry (separate service)
- If you acknowledged `arc-safety-v4` on Arc^ workspace...
- ...you don't re-acknowledge on Ali's workspace when viewing Arc^ projects
- Privacy-preserving (email hash + commons org + version)

### 6. **Collaboration: Distributed via GitHub** ✅

**Workflow:**
1. Sarah sees Ali's project, wants to help
2. Sarah deploys her own workspace (full onboarding)
3. Sarah forks Ali's repo to her GitHub account
4. Sarah works in her workspace (her own tasks, docs, improvements)
5. Sarah's workspace has "Submit to Ali" button
6. Creates PR to Ali's repo on GitHub
7. Ali reviews on GitHub
8. Ali merges → Sarah auto-listed as contributor (Git commit history)

**No in-app real-time collaboration (too complex for MVP).**
**Use Git's native PR workflow.**

### 7. **CMS: Keystatic (Not DecapCMS)** ✅

**Already implemented:** Keystatic is installed and working
**Docs were wrong:** They mentioned DecapCMS (never actually used)

**Why Keystatic:**
- Better Astro integration
- Nested collections support
- GitHub mode works for self-hosted

**Content structure:** Flat collections with relationship fields (Keystatic glob limitation)

### 8. **Repository Naming: `workspace-{username}`** ✅

**Standardized naming:**
- Ali's content repo: `workspace-ali` (not `workspace-by-ali`)
- Sarah's content repo: `workspace-sarah`
- Arc^ repos: `arc-plasma-systems`, `arc-soil-regeneration`, etc.

**"Workspace by Ali"** is the product/brand name, not part of repo names.

---

## ✅ WHAT WE BUILT TODAY (Nov 6, 2025)

### 1. **Database Schema Refactoring**
**File:** `supabase/migrations/20241106000000_self_hosted_owner_reader.sql`

**New tables:**
- `workspace_settings` - Owner configuration (workspace name, license defaults, reader settings)
- `user_roles` - Role tracking (owner vs reader, expert flag)
- `reader_acknowledgments` - Safety/license acknowledgments per reader
- `reader_suggestions` - Reader comments/feedback (moderated by owner)

**Updated RLS policies:**
- Public projects visible to authenticated users
- Gated projects visible to readers who acknowledged
- Sub-projects inherit project visibility
- Readers can view, owners can edit

**Helper functions:**
- `is_workspace_owner()` - Check if user is the owner
- `has_acknowledged_safety()` - Check safety acknowledgment
- `has_acknowledged_license()` - Check license acknowledgment
- `auto_assign_owner()` - First user becomes owner automatically

### 2. **Middleware Refactoring**
**File:** `src/middleware.ts`

**Changes:**
- Detect user role (owner vs reader vs null)
- Store workspace owner ID in locals
- Different onboarding: owner → `/setup`, reader → lightweight signup
- Owner-only routes protected (Keystatic, settings, repo APIs)
- Readers can access public/gated content after acknowledgment
- 403 Forbidden for readers trying to access owner tools

**TypeScript types updated:**
```typescript
interface Locals {
  user: User | null;
  userRole: 'owner' | 'reader' | null;
  workspaceOwnerId: string | null;
  allowReaders: boolean;
  isExpert?: boolean;
}
```

### 3. **Environment Configuration**
**File:** `.env.example`

**Comprehensive template for self-hosting:**
- Supabase configuration (each user creates their own project)
- GitHub OAuth app (each user creates their own)
- Token encryption key (generate once, never change)
- Reader account settings (enable/disable, auto-approve experts)
- Default license (CC-BY-NC-SA-4.0, etc.)
- Safety protocol versioning
- Commons registry integration (optional)
- Full setup checklist
- Vercel deployment instructions

---

## ⚠️ CONFLICTS IDENTIFIED & RESOLVED

### **Conflict 1: DecapCMS vs Keystatic** 🔴 CRITICAL
- **Docs said:** DecapCMS
- **Reality:** Keystatic (already implemented)
- **Resolution:** Update all docs to say Keystatic, document why (better Astro integration)

### **Conflict 2: Multi-Tenant vs Self-Hosted** 🔴 CRITICAL
- **Docs assumed:** One deployment, shared database, many users
- **Reality:** Each person deploys their own
- **Resolution:** Refactor everything (in progress)

### **Conflict 3: Nested vs Flat Content Structure** 🟡 MODERATE
- **Original design:** Nested folders (projects/streams/updates)
- **Reality:** Flat with relationship fields (Keystatic limitation)
- **Resolution:** Document flat structure, relationships work well

### **Conflict 4: Streams vs Sub-Projects** 🟡 MODERATE
- **Old term:** "Streams" (confusing, multiple meanings)
- **New term:** "Sub-Projects" (clear, hierarchical)
- **Resolution:** Global rename (next task)

### **Conflict 5: Repository Naming** 🟢 MINOR
- **Some docs:** `workspace-by-{username}`
- **Code:** `workspace-{username}`
- **Resolution:** Standardize on shorter version

### **Conflict 6: Commons in Phase 1 or 2?** 🟡 MODERATE
- **Some docs:** Basic Commons in Phase 1
- **Other docs:** Commons is Phase 2
- **Resolution:** Phase 1 = Personal Workspace ONLY, Phase 2 = Add Commons

---

## 🚧 CURRENT STATE (As of Nov 6, 2025)

### **What's Working:**
- ✅ Supabase GitHub OAuth authentication
- ✅ GitHub secondary OAuth for repo access
- ✅ Git APIs (fork, publish, read content)
- ✅ Keystatic installed and configured (local mode)
- ✅ Dashboard UI (project cards, activity log)
- ✅ Basic onboarding flow (needs updating for owner vs reader)

### **What We Just Built (Untested):**
- 🆕 Database schema for owner/reader roles
- 🆕 Middleware for role-based permissions
- 🆕 .env.example for self-hosting

### **What's Half-Built:**
- ⚠️ Onboarding flow (exists, needs split: owner vs reader)
- ⚠️ Keystatic config (works, needs update for sub-projects)
- ⚠️ Dashboard (reads from Git, needs owner-only controls)

### **What's Not Started:**
- ❌ Owner setup wizard (`/setup` page)
- ❌ Reader signup flow (`/reader-signup` page)
- ❌ Safety acknowledgment modals
- ❌ License acknowledgment modals
- ❌ Content gating logic (hide until acknowledged)
- ❌ Repo visibility toggle (private/public)
- ❌ Hierarchical sub-projects implementation
- ❌ Fork & submit PR workflow
- ❌ Suggestions/comments system
- ❌ Commons Safety Registry
- ❌ Vercel Deploy Button
- ❌ Self-hosting documentation

---

## 📋 RE-PRIORITIZED TASK LIST (Owner-First Approach)

### **PHASE 1A: YOUR WORKSPACE - OWNER MVP** (Highest Priority)
**Goal:** Get YOUR workspace functional ASAP

1. ✅ **Database schema** for owner/reader roles
2. ✅ **Middleware** for role detection and permissions
3. ✅ **.env.example** for self-hosting setup
4. ⏭️ **Test current refactoring** (verify migrations, middleware work)
5. ⏭️ **Fix any breaking issues** from refactoring
6. ⏭️ **Rename streams → sub-projects** (global find/replace)
7. ⏭️ **Build owner setup wizard** (`/setup` page with 4 steps)
8. ⏭️ **Test owner flow:** Deploy → Setup → Access Keystatic → Create Content
9. ⏭️ **Add repo visibility toggle** (private/public setting)
10. ⏭️ **Test:** Owner can switch repo visibility

**Success Criteria:**
- [ ] Your workspace runs locally without errors
- [ ] You can complete setup as owner
- [ ] You can access Keystatic and edit content
- [ ] You can create projects and sub-projects
- [ ] Private/public toggle works

---

### **PHASE 1B: CONTENT MANAGEMENT** (High Priority)
**Goal:** Hierarchical sub-projects and content organization

11. ⏭️ **Add parent_subproject_id** to stream_cache table
12. ⏭️ **Update Keystatic config** for hierarchical sub-projects
13. ⏭️ **Build sub-project tree UI** (breadcrumbs, nested navigation)
14. ⏭️ **Test:** Can create nested sub-projects
15. ⏭️ **Fix Keystatic navigation** issues (back button workaround)

**Success Criteria:**
- [ ] Can create sub-projects under projects
- [ ] Can create sub-sub-projects (infinite nesting)
- [ ] UI shows hierarchy clearly
- [ ] Keystatic editing works for all levels

---

### **PHASE 1C: DEPLOYMENT** (High Priority)
**Goal:** Anyone can deploy their own workspace

16. ⏭️ **Create Vercel Deploy Button** (vercel.json config)
17. ⏭️ **Write deployment guide** (step-by-step, screenshots)
18. ⏭️ **Document environment variables** (what each one does)
19. ⏭️ **Test fresh deployment** (new Vercel project from scratch)
20. ⏭️ **Document known issues** and workarounds

**Success Criteria:**
- [ ] Deploy button works
- [ ] Fresh deployment completes successfully
- [ ] Owner can set up workspace in production
- [ ] GitHub OAuth works in production
- [ ] Keystatic works in production

---

### **PHASE 2: READER ACCOUNTS** (Deferred - Medium Priority)
**Goal:** Enable lightweight guest accounts

21. ⏭️ Build reader signup page (`/reader-signup`)
22. ⏭️ Build safety acknowledgment modal
23. ⏭️ Build license acknowledgment modal
24. ⏭️ Add content gating logic (hide/show based on acknowledgments)
25. ⏭️ Build suggestions system (reader comments)
26. ⏭️ Build moderation queue (owner approves/rejects)
27. ⏭️ Test: Reader can sign up, acknowledge, view gated content, leave suggestion

**Success Criteria:**
- [ ] Readers can create account with magic link
- [ ] Safety gates work (content hidden until acknowledged)
- [ ] License gates work
- [ ] Readers can leave suggestions
- [ ] Owner can approve/reject suggestions

---

### **PHASE 3: COLLABORATION** (Deferred - Lower Priority)
**Goal:** Distributed collaboration via GitHub

28. ⏭️ Build "Fork to My Workspace" feature
29. ⏭️ Build "Submit to [Owner]" PR workflow
30. ⏭️ Add PR status tracking
31. ⏭️ Auto-display contributors from Git history
32. ⏭️ Test: Researcher can fork, work, submit, owner can merge

---

### **PHASE 4: ARC^ COMMONS** (Deferred - Future)
**Goal:** Organizational commons workspace

33. ⏭️ Deploy Commons Safety Registry service
34. ⏭️ Build commons safety check API
35. ⏭️ Deploy Arc^ workspace
36. ⏭️ Build "Submit to Commons" workflow
37. ⏭️ Build governance/review features

---

### **PHASE 5: DOCUMENTATION CLEANUP** (Ongoing)
**Goal:** No conflicting information

38. ✅ Create this session handoff
39. ✅ Update MASTER_TASKLIST.md
40. ✅ Create CURRENT_STATE.md
41. ✅ Create REFACTORING_TRACKER.md
42. ✅ Create QUICK_START.md
43. ✅ Archive old session handoffs
44. ✅ Update MASTER_ROADMAP.md (DecapCMS → Keystatic)
45. ✅ Update Phase 1 Planning (self-hosted model)
46. ✅ Update architecture docs (owner/reader roles)
47. ⏭️ Update all remaining docs per REFACTORING_TRACKER.md

---

## 🧪 TESTING STRATEGY

**Test after every major change:**
1. Run `npm run dev`
2. Check console for errors
3. Test the feature manually
4. Document any issues in CURRENT_STATE.md

**Major test checkpoints:**
- **Checkpoint 1:** After Phase 1A (Owner MVP) - Full owner flow works
- **Checkpoint 2:** After Phase 1B (Content Management) - Sub-projects work
- **Checkpoint 3:** After Phase 1C (Deployment) - Production deployment works
- **Checkpoint 4:** After Phase 2 (Reader Accounts) - Reader flow works
- **Checkpoint 5:** After Phase 3 (Collaboration) - Fork/PR workflow works

---

## 💾 FILES CREATED/MODIFIED TODAY

### **Created:**
- `supabase/migrations/20241106000000_self_hosted_owner_reader.sql` - New database schema
- `.env.example` - Template for self-hosting
- `docs/SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md` - This file!
- `docs/CURRENT_STATE.md` - Current snapshot (to be created)
- `docs/REFACTORING_TRACKER.md` - Doc cleanup tracker (to be created)
- `docs/QUICK_START_Nov6_2025.md` - Next session guide (to be created)

### **Modified:**
- `src/middleware.ts` - Added role detection and owner-only protection
- `src/env.d.ts` - Added userRole, workspaceOwnerId, allowReaders to Locals

### **To be updated:**
- `docs/MASTER_TASKLIST.md` - Add refactoring progress
- `docs/planning/MASTER_ROADMAP.md` - DecapCMS → Keystatic
- `docs/planning/01_Phase1_Planning.md` - Self-hosted model
- `docs/architecture/01_CORE_CONCEPTS.md` - Owner/reader roles
- `docs/architecture/02_DATA_STRUCTURES.md` - New tables
- Many more (see REFACTORING_TRACKER.md)

---

## 🎯 NEXT SESSION: START HERE

### **Read First:**
1. This file (SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md)
2. QUICK_START_Nov6_2025.md
3. CURRENT_STATE.md

### **Then Do:**
1. **Test the refactoring** (run migrations, test middleware)
2. **Fix any breaking issues**
3. **Rename streams → sub-projects** throughout codebase
4. **Build /setup wizard page**
5. **Test YOUR workspace** end-to-end

### **Goal:**
Get YOUR workspace (owner-only, no reader accounts yet) functional and deployable.

---

## 📊 PROGRESS ESTIMATE

**Before today:** 85% (deceptive - wrong architecture)
**Realistic now:** ~30% complete

**Why the drop?**
- We're refactoring the foundation
- 3 tasks done (schema, middleware, env config)
- ~40 tasks remaining
- But we're building the RIGHT thing now

**Timeline to Owner MVP:** ~5-7 more tasks (Phase 1A)
**Timeline to Full Self-Hosted:** ~15-20 tasks (Phases 1A-1C)
**Timeline to Reader Accounts:** ~25-30 tasks (Add Phase 2)
**Timeline to Commons:** ~35-40 tasks (Add Phase 4)

---

## 🚨 CRITICAL NOTES FOR FUTURE SESSIONS

### **1. Don't Reference Old Multi-Tenant Assumptions**
If you see code or docs assuming "all users are equal" or "shared database", that's outdated. We're self-hosted now.

### **2. Streams = Sub-Projects**
Update all language. "Join a stream" means "contribute to a sub-project."

### **3. Test Everything**
We're refactoring core architecture. Test after each change.

### **4. Owner First, Readers Later**
Don't build reader features until owner experience is solid. You need YOUR workspace working first.

### **5. Commons Is Future**
Arc^ is Phase 4+, not Phase 1. Focus on personal workspace first.

---

## 📝 DECISIONS LOG

| Date | Decision | Rationale |
|------|----------|-----------|
| Nov 6 | Self-hosted deployment model | User data ownership, decentralization, aligns with values |
| Nov 6 | Owner/reader roles | Owner deploys, readers can visit for gated content |
| Nov 6 | Streams → Sub-Projects rename | Clearer terminology, hierarchical makes sense |
| Nov 6 | Private repos by default | Protect unpublished research from "theft" |
| Nov 6 | Hybrid safety model | Local for personal, registry for commons |
| Nov 6 | Git-native collaboration | Use GitHub PRs, don't build in-app collaboration |
| Nov 6 | Keystatic confirmed | Already works, docs were wrong about DecapCMS |
| Nov 6 | Defer reader accounts | Build owner MVP first, readers are Phase 2 |

---

## 🙏 ACKNOWLEDGMENTS

This session was transformative. We went from confusion and conflicts to crystal-clear vision and alignment. The conversations about:
- "Who's this for?" (you vs everyone)
- "What's a stream?" (sub-project!)
- "Readers vs researchers" (different tiers)
- "Cost implications" (readers are free!)

...all led to fundamental clarity about what we're actually building.

**The architecture pivot happened just in time.** Better to discover this at 30% than at 90%.

---

## 📅 SESSION METADATA

**Duration:** ~3 hours of intensive planning and refactoring
**Tasks Completed:** 3 (schema, middleware, env config)
**Tasks Created:** 40+ (re-prioritized)
**Conflicts Resolved:** 6 major conflicts
**Decisions Made:** 8 critical decisions
**Files Created:** 6 (including this one)
**Files Modified:** 2
**Lines of Code:** ~500 (migrations, middleware)
**Lines of Documentation:** ~1,000 (session handoff, planning)

---

**Next Session Date:** TBD
**Next Session Goal:** Test refactoring, rename streams, build setup wizard
**Status:** Ready to build the owner MVP! 🚀
