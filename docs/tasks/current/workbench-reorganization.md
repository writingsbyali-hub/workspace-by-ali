# Workbench Reorganization

**Started:** November 8, 2025
**Status:** Phase 1 Complete ✅, Phase 2 Ready
**Estimated Total Time:** 16-23 hours
**Agent Strategy:** Chain specialized agents sequentially for complex features

## Goal

Transform the current dashboard into a public workspace with a separate owner workbench:
- Public workspace at root `/` (accessible to all)
- Owner workbench at `/workbench/*` (authenticated owner only)
- Safety gating system for sensitive content
- Complete Git-first architecture throughout

## Progress Tracker

```
Phase 1: Foundation & Routes       [████████████████████]  100% ✅ COMPLETE
Phase 2: Public Workspace Pages    [░░░░░░░░░░░░░░░░░░░░]    0% ⏳ Next
Phase 3: Safety Gating System      [░░░░░░░░░░░░░░░░░░░░]    0% ⏳ Pending
Phase 4: Workbench Updates         [░░░░░░░░░░░░░░░░░░░░]    0% ⏳ Pending
Phase 5: Component Library         [░░░░░░░░░░░░░░░░░░░░]    0% ⏳ Pending
Phase 6: Testing & Polish          [░░░░░░░░░░░░░░░░░░░░]    0% ⏳ Pending
Phase 7: Documentation & Deploy    [░░░░░░░░░░░░░░░░░░░░]    0% ⏳ Pending

Overall Progress:                  [███░░░░░░░░░░░░░░░░░]   14% 🟢 Phase 1 done
```

---

## ✅ Phase 1: Foundation & Route Reorganization (2-3 hours)

**Agent:** frontend-developer (implementation focus)
**Status:** ✅ COMPLETED November 8, 2025
**Time Spent:** ~2.5 hours

### 1.1 Route Structure Migration ✅

- [x] Create `/workbench/*` directory structure
- [x] Move dashboard pages: `index.astro`, `settings.astro`, `profile.astro` → `workbench/`
- [x] Move specialized pages: `setup.astro`, `onboarding.astro` → `workbench/`
- [x] Update middleware protection rules for `/workbench/*` routes
- [x] Add redirect logic: authenticated owner → `/workbench`, others → `/`
- [x] Update all internal navigation links (DashboardLayout, components)

**Files Modified:**
- `src/pages/workbench/` (new directory)
- `src/middleware.ts`
- `src/components/layouts/DashboardLayout.astro`
- All dashboard components with hardcoded links

### 1.2 Terminology Standardization ✅

- [x] Search codebase for "stream" references, replace with "sub-project"
- [x] Update database field names in types (stream → subproject)
- [x] Update UI labels: "Streams" → "Sub-Projects"
- [x] Update Keystatic collection navigation labels

**Files Modified:**
- `src/lib/types/database.ts`
- `keystatic.config.ts`
- All component files with "stream" references

### Success Criteria ✅

- [x] All dashboard routes moved to `/workbench/*`
- [x] Middleware correctly protects owner routes
- [x] No broken links or 404 errors
- [x] Consistent "sub-project" terminology throughout

---

## ⏳ Phase 2: Public Workspace Pages (4-6 hours)

**Agent Chain:** ux-researcher → ui-designer → frontend-developer
**Status:** 🟡 Ready to start
**Estimated Time:** 4-6 hours

### 2.1 Design & Layout Foundation (~1 hour)

**Agents:** ux-researcher → ui-designer → frontend-developer

**Tasks:**
- [ ] **UX Research:** Analyze user journey for public visitors vs readers vs owners
- [ ] **UI Design:** Create WorkspaceLayout component (public header, footer, no owner tools)
- [ ] **Frontend:** Implement `WorkspaceLayout.astro` with responsive navigation

**Deliverables:**
- `src/components/layouts/WorkspaceLayout.astro`
- Public navigation component
- Footer with researcher branding

### 2.2 Public Homepage (`/index.astro`) (~1-1.5 hours)

**Agents:** ui-designer + frontend-developer

**Tasks:**
- [ ] Hero section with workspace introduction
- [ ] Featured projects grid (pulled from Git)
- [ ] Latest updates timeline
- [ ] Clear CTAs: "Explore Projects" / "Start Your Own Workspace"
- [ ] About section preview
- [ ] NO authentication required

**Files:**
- `src/pages/index.astro` (complete rewrite for public)
- New components: `HeroSection.astro`, `FeaturedProjects.tsx`

### 2.3 Public Projects Gallery (`/projects/index.astro`) (~1 hour)

**Agent:** frontend-developer

**Tasks:**
- [ ] Fix Supabase query: `projects` table → `project_cache` or Keystatic reader
- [ ] Filter: show only `visibility: public` and `visibility: gated` (NOT `private`)
- [ ] Category filters, search functionality
- [ ] Card grid with project status, update count, last updated
- [ ] Click → `/projects/[slug]`

**Files:**
- `src/pages/projects/index.astro` (major refactor)
- Update `ProjectCard.tsx` for public display

### 2.4 Public Project Detail (`/projects/[slug].astro`) (~45 min)

**Agents:** frontend-developer + backend-architect

**Tasks:**
- [ ] Fetch project from Git (already correct in current code)
- [ ] Display full project details: description, methods, datasets
- [ ] Show sub-projects list with update timelines
- [ ] IF gated: Show SafetyModal component (Phase 3)
- [ ] IF private: Show 403 error or redirect
- [ ] Link to related updates

**Files:**
- `src/pages/projects/[slug].astro` (minimal changes, add gating logic)

### 2.5 Public Updates (`/updates/index.astro` & `/updates/[slug].astro`) (~30 min)

**Status:** No changes needed - already Git-first

**Tasks:**
- [ ] Ensure pages are accessible publicly (remove auth requirement)
- [ ] Test visibility filtering

### 2.6 About Page (`/about.astro`) (~30 min)

**Agent:** ui-designer

**Tasks:**
- [ ] Create researcher bio/introduction page
- [ ] Research interests, methodologies
- [ ] Contact information
- [ ] Link to workspace setup guide

**Files:**
- `src/pages/about.astro` (new)

### 2.7 Safety Center (`/safety.astro`) (~45 min)

**Agents:** ui-designer + frontend-developer

**Tasks:**
- [ ] List all safety protocols
- [ ] Explain gating system and why it exists
- [ ] Show authenticated user's acknowledgment history
- [ ] Re-acknowledgment UI if protocols updated

**Files:**
- `src/pages/safety.astro` (new)

### Phase 2 Success Criteria

- [ ] Public homepage is welcoming and clear
- [ ] Projects gallery shows correct filtered content
- [ ] Project detail pages respect visibility settings
- [ ] About and Safety pages provide complete information
- [ ] All pages work without authentication
- [ ] Navigation is intuitive for public visitors

---

## ⏳ Phase 3: Safety Gating System (3-4 hours)

**Agents:** ui-designer → frontend-developer → backend-architect
**Status:** 🔴 Not started (blocked by Phase 2)
**Estimated Time:** 3-4 hours

### 3.1 SafetyModal Component (~1.5 hours)

**Agents:** ui-designer → frontend-developer

**Tasks:**
- [ ] Design modal UI with protocol text
- [ ] Checkbox: "I have read and acknowledge..."
- [ ] Submit button → API call
- [ ] Loading and error states
- [ ] Close only after acknowledgment

**Files:**
- `src/components/workspace/SafetyModal.tsx` (new)

### 3.2 Acknowledgment API (~1 hour)

**Agent:** backend-architect

**Tasks:**
- [ ] Create `POST /api/safety/acknowledge` endpoint
- [ ] Validate user authentication
- [ ] Check if already acknowledged (content_slug + user_id)
- [ ] Insert into `reader_acknowledgments` table
- [ ] Return success with timestamp

**Files:**
- `src/pages/api/safety/acknowledge.ts` (new)

### 3.3 Gating Logic Integration (~1.5 hours)

**Agent:** frontend-developer

**Tasks:**
- [ ] Update project detail page: check `gated` field
- [ ] Query `reader_acknowledgments` table for current user
- [ ] IF not acknowledged: show SafetyModal
- [ ] IF acknowledged: show full content
- [ ] Track acknowledgment date

**Files:**
- `src/pages/projects/[slug].astro`
- Update `checkContentAccess()` in `src/lib/github.ts`

### Phase 3 Success Criteria

- [ ] SafetyModal displays correctly on gated content
- [ ] Acknowledgment is recorded in database
- [ ] Users can access gated content after acknowledgment
- [ ] Modal cannot be bypassed
- [ ] Acknowledgment persists across sessions

---

## ⏳ Phase 4: Workbench Updates (2-3 hours)

**Agent:** frontend-developer
**Status:** 🔴 Not started
**Estimated Time:** 2-3 hours

### 4.1 Workbench Homepage (`/workbench/index.astro`) (~30 min)

**Current `/index.astro` moved to `/workbench/index.astro`**

**Tasks:**
- [ ] Update to use `project_cache` (already done Nov 8 ✅)
- [ ] Add "View Public Workspace" link in header
- [ ] Test Git webhook sync
- [ ] Verify stats and activity feeds

### 4.2 Workbench Projects (`/workbench/projects.astro`) (~1 hour)

**New page for owner project management**

**Tasks:**
- [ ] Full CRUD interface for projects
- [ ] Visibility toggles (public/gated/private)
- [ ] Quick edit links → Keystatic
- [ ] Sub-project management
- [ ] Archive/delete functionality

**Files:**
- `src/pages/workbench/projects.astro` (new)

### 4.3 Workbench Settings (`/workbench/settings.astro`) (~30 min)

**Move from `/settings.astro`**

**Tasks:**
- [ ] Workspace configuration
- [ ] GitHub connection status
- [ ] Webhook verification
- [ ] Reader account management (Phase 2 future)
- [ ] Export/backup options

### 4.4 Navigation Updates (~1 hour)

**Agent:** frontend-developer

**Tasks:**
- [ ] Update `DashboardLayout.astro` → `WorkbenchLayout.astro`
- [ ] Sidebar links: all `/workbench/*` routes
- [ ] Add "Public View" button
- [ ] Breadcrumb navigation for sub-projects

**Files:**
- Rename `src/components/layouts/DashboardLayout.astro` → `WorkbenchLayout.astro`
- Update all page imports

### Phase 4 Success Criteria

- [ ] Workbench homepage shows owner-specific stats
- [ ] Projects page allows full CRUD operations
- [ ] Settings page provides configuration options
- [ ] Navigation is clear and intuitive
- [ ] "View Public" link works correctly

---

## ⏳ Phase 5: Component Library (2-3 hours)

**Agents:** ui-designer → frontend-developer
**Status:** 🔴 Not started
**Estimated Time:** 2-3 hours

### 5.1 Workspace Components (~1.5 hours)

**Agent:** ui-designer → frontend-developer

**Tasks:**
- [ ] Create `src/components/workspace/` directory
- [ ] `ProjectGallery.tsx` - Public project grid
- [ ] `ProjectCard.tsx` - Public project card (separate from dashboard version)
- [ ] `SafetyModal.tsx` - Safety acknowledgment modal
- [ ] `WorkspaceHeader.tsx` - Public navigation header
- [ ] `ContentCard.tsx` - Generic content display

### 5.2 Workbench Components (~1 hour)

**Refactor existing dashboard components**

**Tasks:**
- [ ] Move `src/components/dashboard/` → `src/components/workbench/`
- [ ] Update imports across all pages
- [ ] Ensure no public pages import workbench components

### Phase 5 Success Criteria

- [ ] Clear separation: workspace vs workbench components
- [ ] Components are reusable and well-documented
- [ ] No circular dependencies
- [ ] All imports updated correctly

---

## ⏳ Phase 6: Testing & Polish (2-3 hours)

**Agent Chain:** test-writer-fixer → frontend-developer → brand-guardian
**Status:** 🔴 Not started
**Estimated Time:** 2-3 hours

### 6.1 End-to-End Testing (~1 hour)

**Agent:** test-writer-fixer

**Owner Flow:**
1. [ ] Login → redirects to `/workbench`
2. [ ] Create project via Keystatic
3. [ ] Webhook syncs to cache
4. [ ] View in workbench dashboard
5. [ ] Publish (set `visibility: public`)
6. [ ] View on public workspace

**Reader Flow (Phase 2 prep):**
1. [ ] Browse public workspace (no auth)
2. [ ] Click gated project
3. [ ] SafetyModal appears
4. [ ] Must login/signup to acknowledge
5. [ ] View gated content

**Public Flow:**
1. [ ] Land on `/` (public homepage)
2. [ ] Browse projects
3. [ ] View public project details
4. [ ] Cannot access private content

### 6.2 Git-First Verification (~30 min)

**Agent:** backend-architect

**Tasks:**
- [ ] Audit all pages: NO queries to legacy `projects`/`subprojects` tables
- [ ] Verify webhook handler updates cache correctly
- [ ] Test cache fallback to Git if empty
- [ ] Confirm all content reads from Git as source of truth

### 6.3 Brand Consistency (~30-45 min)

**Agent:** brand-guardian

**Tasks:**
- [ ] Review all public pages for consistent voice/tone
- [ ] Check terminology consistency (Sub-Projects, not Streams)
- [ ] Verify UI component consistency
- [ ] Test dark mode across all pages
- [ ] Mobile responsiveness check

### Phase 6 Success Criteria

- [ ] All user flows work end-to-end
- [ ] No legacy database queries
- [ ] Brand consistency across all pages
- [ ] Mobile experience is excellent
- [ ] Dark mode works everywhere

---

## ⏳ Phase 7: Documentation & Deployment (1-2 hours)

**Agent:** devops-automator
**Status:** 🔴 Not started
**Estimated Time:** 1-2 hours

### 7.1 Update Documentation (~45 min)

**Tasks:**
- [ ] Update README with new route structure
- [ ] Document public vs workbench distinction
- [ ] Update deployment guide
- [ ] Create user guide (owner setup flow)
- [ ] Update MASTER_TASKLIST.md with completion status

**Files:**
- `README.md`
- `docs/MASTER_TASKLIST.md`
- `KEYSTATIC_SETUP.md`

### 7.2 Deployment Preparation (~45 min)

**Agent:** devops-automator

**Tasks:**
- [ ] Verify environment variables
- [ ] Test Vercel deployment with new routes
- [ ] Check middleware protection in production
- [ ] Verify GitHub webhook delivery
- [ ] Test OAuth flows

### Phase 7 Success Criteria

- [ ] Documentation is complete and accurate
- [ ] Deployment succeeds without errors
- [ ] All features work in production
- [ ] Users can follow setup guide successfully

---

## Summary

**Total Phases:** 7
**Estimated Time:** 16-23 hours
**Current Status:** Phase 1 complete ✅, Phase 2 ready to start

### Key Decisions

- ✅ Dashboard → Workbench (owner-only)
- ✅ Public workspace at root `/`
- ✅ Safety gating for sensitive content
- ✅ Git-first architecture throughout
- ✅ Agent-driven development for quality

### Next Steps

1. Start Phase 2: Public Workspace Pages
2. Begin with UX research for public visitor journey
3. Design and implement WorkspaceLayout component
4. Build public homepage

---

**Last Updated:** November 8, 2025
**Progress:** 14% complete (1/7 phases done)
