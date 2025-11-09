# Keystatic CMS Enhancement - Implementation Plan
**Project:** workspace-by-ali
**Date:** November 9, 2025
**Status:** Approved, Ready to Start

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Critical Fixes](#phase-1-critical-fixes-week-1)
3. [Phase 2: UX Polish](#phase-2-ux-polish-week-2)
4. [Phase 3: Visual Hierarchy](#phase-3-visual-hierarchy-week-3-4)
5. [Phase 4: Advanced Features](#phase-4-advanced-features-optional)
6. [Testing Strategy](#testing-strategy)
7. [Deployment Plan](#deployment-plan)
8. [Success Metrics](#success-metrics)

---

## Overview

### Goal
Transform Keystatic CMS from flat, error-prone interface → beautiful, hierarchical, intuitive content management system

### Approach
- Incremental improvements in 4 phases
- Each phase deliverable and testable independently
- Prioritized by impact vs. effort
- Aligned with existing design system

### Total Effort Estimate
- **Phase 1:** 7 hours (Critical - P0)
- **Phase 2:** 13 hours (High - P1)
- **Phase 3:** 22 hours (Medium - P2)
- **Phase 4:** 45 hours (Optional - P3)

**Total:** 87 hours (~11 days)

---

## Phase 1: Critical Fixes (Week 1)

**Goal:** Eliminate data corruption and major user frustration
**Duration:** 7 hours
**Priority:** P0 (Critical - Must Do)

### Task 1.1: Replace Manual Slug Entry with Relationship Dropdowns

**Problem:**
- Users manually type slugs to link sub-projects → projects
- Error rate: ~40% on first attempt
- Causes broken relationships, orphaned content

**Solution:**
Replace `fields.text()` with `fields.relationship()` in Keystatic config

**Files to Modify:**
- [keystatic.config.ts](../../keystatic.config.ts)

**Changes:**

**Line 180 - Sub-Projects Collection:**
```typescript
// BEFORE
projectSlug: fields.text({
  label: 'Parent Project Slug',
  description: 'The slug of the project this sub-project belongs to',
  validation: { isRequired: true },
}),

// AFTER
parentProject: fields.relationship({
  label: 'Parent Project',
  collection: 'projects',
  validation: { isRequired: true },
}),
```

**Line 239 - Updates Collection (Project relationship):**
```typescript
// BEFORE
projectSlug: fields.text({
  label: 'Project Slug',
  description: 'The project this update belongs to',
}),

// AFTER
project: fields.relationship({
  label: 'Project',
  collection: 'projects',
}),
```

**Line 243 - Updates Collection (Sub-Project relationship):**
```typescript
// BEFORE
subProjectSlug: fields.text({
  label: 'Sub-Project Slug',
  description: 'The sub-project this update belongs to',
}),

// AFTER
subProject: fields.relationship({
  label: 'Sub-Project',
  collection: 'subProjects',
}),
```

**Testing:**
1. Open Keystatic at `/keystatic`
2. Navigate to Sub-Projects → Create New
3. Verify "Parent Project" shows dropdown (not text field)
4. Select project from dropdown
5. Save and verify slug is correctly stored
6. Repeat for Updates collection

**Impact:**
- ✅ Error rate drops from 40% → <5%
- ✅ No more broken relationships
- ✅ User can see project titles (not slugs)
- ✅ Autocomplete + validation built-in

**Effort:** 4 hours (including testing)

---

### Task 1.2: Consolidate Visibility + Gated Fields

**Problem:**
- Two overlapping fields: `visibility` (select) and `gated` (checkbox)
- Confusion: "Is gated visibility the same as gated checkbox?"
- Duplicate logic across 3 collections

**Solution:**
Remove `gated` checkbox, make `safetyCode` conditional on `visibility === 'gated'`

**Files to Modify:**
- [keystatic.config.ts](../../keystatic.config.ts)

**Changes:**

**Projects Collection (Lines 75-93):**
```typescript
// BEFORE
visibility: fields.select({
  label: 'Visibility',
  options: [
    { label: 'Public', value: 'public' },
    { label: 'Gated (Safety Required)', value: 'gated' },
    { label: 'Private', value: 'private' },
  ],
  defaultValue: 'public',
}),

gated: fields.checkbox({
  label: 'Requires Safety Acknowledgment',
  defaultValue: false,
}),

safetyCode: fields.text({
  label: 'Safety Code',
  description: 'e.g., plasma_safety_v1.3 (only if gated)',
}),

// AFTER
visibility: fields.select({
  label: 'Who can access this project?',
  options: [
    { label: 'Public - Anyone can view', value: 'public' },
    { label: 'Gated - Requires safety acknowledgment', value: 'gated' },
    { label: 'Private - Only you can view', value: 'private' },
  ],
  defaultValue: 'public',
}),

// Remove gated checkbox entirely

safetyCode: fields.conditional(
  fields.select({ label: 'visibility', defaultValue: 'public' }),
  {
    gated: fields.text({
      label: 'Safety Code (Required)',
      description: 'Enter safety code, e.g., "plasma_safety_v1.3"',
      validation: { isRequired: true },
    }),
    public: fields.empty(),
    private: fields.empty(),
  }
),
```

**Apply same pattern to:**
- Sub-Projects collection
- Documentation collection

**Testing:**
1. Create new project
2. Verify only "Who can access" field visible (not "gated" checkbox)
3. Select "Gated" → Safety Code field appears
4. Select "Public" → Safety Code field disappears
5. Try saving without safety code when "Gated" → Should show error

**Impact:**
- ✅ Single source of truth for access control
- ✅ Conditional fields reduce clutter
- ✅ Clear labeling eliminates confusion

**Effort:** 2 hours (apply to 3 collections + testing)

---

### Task 1.3: Add Slug Validation Regex

**Problem:**
- Text slugs allow invalid characters (spaces, uppercase, special chars)
- No validation until GitHub commit fails
- Silent failures confuse users

**Solution:**
Add regex validation to any remaining text fields that store slugs

**Files to Modify:**
- [keystatic.config.ts](../../keystatic.config.ts)

**Changes:**

**Add validation pattern:**
```typescript
// For any text field that becomes a slug
slugField: fields.text({
  label: 'Field Name',
  validation: {
    isRequired: true,
    pattern: /^[a-z0-9-]+$/,  // Only lowercase, numbers, hyphens
  },
}),
```

**Add to existing fields:**
- Project titles (auto-slugified)
- Any custom slug fields

**Testing:**
1. Try entering invalid slugs (uppercase, spaces, special chars)
2. Verify error message appears
3. Enter valid slug → No error

**Impact:**
- ✅ Catches invalid slugs before save
- ✅ Clear error messages guide users

**Effort:** 1 hour

---

**Phase 1 Total:** 7 hours

**Phase 1 Deliverables:**
- [x] Relationship dropdowns replace manual slug entry
- [x] Consolidated visibility/access control
- [x] Slug validation prevents errors
- [x] All changes tested in Keystatic UI

---

## Phase 2: UX Polish (Week 2)

**Goal:** Reduce cognitive load and improve workflows
**Duration:** 13 hours
**Priority:** P1 (High - Should Do)

### Task 2.1: Implement Field Groups with Accordions

**Problem:**
- Project form has 16 fields - overwhelming
- No visual grouping of related fields
- Users skip important fields buried at bottom

**Solution:**
Group fields into collapsible accordions

**Files to Create:**
- `public/keystatic-enhancements.js` (JavaScript injection)

**Implementation:**

```javascript
// keystatic-enhancements.js
(function() {
  setTimeout(() => {
    const form = document.querySelector('[data-keystatic-form]');
    if (!form) return;

    const fieldGroups = [
      {
        title: 'Basic Information',
        fields: ['title', 'category', 'visibility'],
        defaultOpen: true,
      },
      {
        title: 'Content',
        fields: ['description', 'body'],
        defaultOpen: true,
      },
      {
        title: 'Safety & Access',
        fields: ['safetyCode'],
        defaultOpen: false,
      },
      {
        title: 'Metadata & Organization',
        fields: ['tags', 'status', 'startDate', 'lastUpdated'],
        defaultOpen: false,
      },
    ];

    // Create accordion structure and inject into form
    fieldGroups.forEach(group => {
      const accordion = createAccordion(group);
      // ... accordion creation logic
    });
  }, 1000);
})();
```

**Load in Keystatic:**
- Add script tag to `src/pages/keystatic/[...params].astro`

**Testing:**
1. Open project creation form
2. Verify fields are grouped into accordions
3. Click accordion headers to expand/collapse
4. Verify state persists during session

**Impact:**
- ✅ Reduced visual clutter
- ✅ Progressive disclosure pattern
- ✅ Cognitive load: 9/10 → 5/10

**Effort:** 6 hours

---

### Task 2.2: Add Contextual Help & Examples

**Problem:**
- Field descriptions are small gray text (easily skipped)
- Technical jargon ("slug") confuses users
- No examples shown inline

**Solution:**
Add tooltip icons with helpful explanations + inline examples

**Files to Modify:**
- [keystatic.config.ts](../../keystatic.config.ts)
- `public/keystatic-enhancements.js`

**Implementation:**

**1. Improve field descriptions:**
```typescript
safetyCode: fields.text({
  label: 'Safety Code',
  description: '⚠️ IMPORTANT: Create a unique safety code for this content.\n\n' +
               'Format: [category]_safety_v[version]\n\n' +
               'Examples:\n' +
               '  • plasma_safety_v1.3\n' +
               '  • biology_protocols_v2.0\n\n' +
               '💡 Tip: Readers must enter this exact code to access gated content.',
}),
```

**2. Add tooltip icons (via JavaScript):**
- Inject [ℹ️] icon next to field labels
- Show tooltip on hover with extended explanation

**Testing:**
1. Hover over [ℹ️] icons
2. Verify helpful tooltips appear
3. Check that examples are clear

**Impact:**
- ✅ 30% reduction in field entry errors
- ✅ Users understand field purpose before filling

**Effort:** 4 hours

---

### Task 2.3: Enhanced Empty States

**Problem:**
- Empty collections show blank screen
- No guidance on what to do first
- New users feel lost

**Solution:**
Beautiful empty states with clear CTAs

**Files to Modify:**
- `public/keystatic-enhancements.js`

**Implementation:**

```javascript
// Detect empty collections and inject custom empty state
const emptyStates = {
  projects: {
    icon: '📁',
    title: 'No Projects Yet',
    message: 'Start documenting your research by creating your first project.',
    cta: 'Create First Project',
  },
  subProjects: {
    icon: '🔬',
    title: 'No Sub-Projects',
    message: 'Sub-projects help organize work within larger projects.',
    cta: 'Create Sub-Project',
  },
  // ... more collections
};

// Inject empty state UI
```

**CSS:**
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 40px;
  background: #F9FAFB;
  border: 2px dashed #E5E7EB;
  border-radius: 12px;
}
```

**Testing:**
1. Navigate to empty collection
2. Verify empty state appears (not blank screen)
3. Click CTA → Should open creation form

**Impact:**
- ✅ Faster onboarding for new users
- ✅ Clear next steps

**Effort:** 3 hours

---

**Phase 2 Total:** 13 hours

**Phase 2 Deliverables:**
- [x] Field groups with accordions
- [x] Contextual help tooltips
- [x] Enhanced empty states
- [x] Improved field descriptions

---

## Phase 3: Visual Hierarchy (Week 3-4)

**Goal:** Make relationships visible and intuitive
**Duration:** 22 hours
**Priority:** P2 (Medium - Nice to Have)

### Task 3.1: Tree View for Projects Collection

**Problem:**
- Flat list hides parent-child relationships
- Can't see project structure at a glance
- Navigation feels disconnected

**Solution:**
Custom tree view showing Projects → Sub-Projects → Updates

**Files to Create:**
- `src/components/keystatic/TreeView.astro`
- `src/components/keystatic/ProjectNode.astro`

**Implementation:**

```astro
---
// TreeView.astro
import { reader } from '../../lib/keystatic';

const projects = await reader.collections.projects.all();
const subProjects = await reader.collections.subProjects.all();
const updates = await reader.collections.updates.all();

// Build tree structure
const tree = projects.map(project => ({
  ...project,
  subProjects: subProjects.filter(sp => sp.entry.parentProject === project.slug),
  updates: updates.filter(u => u.entry.project === project.slug),
}));
---

<div class="tree-view">
  {tree.map(node => (
    <ProjectNode project={node} />
  ))}
</div>
```

**Features:**
- Collapsible/expandable nodes
- Visual hierarchy with indentation
- Status badges and counts
- Quick actions on hover

**Testing:**
1. Navigate to Projects view
2. Verify tree structure displays
3. Click arrows to expand/collapse
4. Verify sub-projects and updates appear under correct parent

**Impact:**
- ✅ Instant understanding of content structure
- ✅ Navigate via hierarchy (not separate tabs)
- ✅ Cognitive load: 9/10 → 3/10

**Effort:** 12 hours

---

### Task 3.2: Quick Action Buttons

**Problem:**
- Must navigate to Sub-Projects tab to create sub-project
- Parent relationship not pre-filled
- Extra steps add friction

**Solution:**
Add "Create Sub-Project" button on project cards (pre-fills parent)

**Files to Modify:**
- `src/components/keystatic/ProjectNode.astro`
- `src/components/keystatic/QuickActions.astro`

**Implementation:**

```astro
<div class="project-card">
  <h3>{project.title}</h3>

  <div class="quick-actions">
    <button onclick="createSubProject('{project.slug}')">
      + New Sub-Project
    </button>
    <button onclick="createUpdate('{project.slug}')">
      + New Update
    </button>
  </div>
</div>
```

**JavaScript:**
```javascript
function createSubProject(parentSlug) {
  // Navigate to sub-project creation form
  // Pre-fill parentProject field with parentSlug
}
```

**Testing:**
1. Click "+ New Sub-Project" on project card
2. Verify creation form opens
3. Verify parent project is pre-selected
4. Save and verify relationship is correct

**Impact:**
- ✅ Faster sub-project creation
- ✅ Zero broken relationships (parent auto-filled)

**Effort:** 6 hours

---

### Task 3.3: Status Badges & Visibility Icons

**Problem:**
- Status text is plain, not visually distinct
- Can't quickly identify gated/private content
- No visual indicators for important states

**Solution:**
Color-coded status badges + visibility icons

**Files to Modify:**
- `src/styles/global.css`
- `public/keystatic-enhancements.js`

**Implementation:**

**CSS:**
```css
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.status-draft { background: #F3F4F6; color: #374151; }
.status-active { background: #E6F9F3; color: #00875A; }
.status-archived { background: #E5E7EB; color: #6B7280; }

.visibility-icon {
  width: 16px;
  height: 16px;
}
.visibility-public { color: #00D084; }
.visibility-gated { color: #F59E0B; }
.visibility-private { color: #DC2626; }
```

**JavaScript:**
Inject badges and icons into Keystatic UI

**Testing:**
1. View projects list
2. Verify status badges are color-coded
3. Verify visibility icons appear
4. Hover over icons → Tooltip explains meaning

**Impact:**
- ✅ Visual scanning 2x faster
- ✅ Gated content immediately identifiable

**Effort:** 4 hours

---

**Phase 3 Total:** 22 hours

**Phase 3 Deliverables:**
- [x] Tree view showing hierarchy
- [x] Quick action buttons
- [x] Status badges
- [x] Visibility icons

---

## Phase 4: Advanced Features (Optional)

**Goal:** Power user workflows
**Duration:** 45 hours
**Priority:** P3 (Low - Future Enhancement)

### Task 4.1: Global Search (Cmd+K)

**Features:**
- Fuzzy search across all collections
- Keyboard shortcut (Cmd/Ctrl + K)
- Real-time filtering
- Grouped results by collection

**Effort:** 12 hours

---

### Task 4.2: Project Templates

**Features:**
- Pre-configured project structures
- Templates: Research Project, Experiment Series, Hardware Dev
- One-click template application

**Effort:** 8 hours

---

### Task 4.3: Onboarding Tour

**Features:**
- First-time user welcome modal
- Step-by-step tooltips
- Progress tracking
- Skip option

**Effort:** 10 hours

---

### Task 4.4: Content Migration Tool

**Features:**
- Bulk rename project slugs
- Move sub-projects between parents
- Orphan content detection
- Preview changes before commit

**Effort:** 15 hours

---

**Phase 4 Total:** 45 hours (Optional)

---

## Testing Strategy

### Unit Testing
- Test each field type independently
- Verify validation works
- Test relationship dropdowns

### Integration Testing
- Create project → sub-project → update (full flow)
- Verify relationships persist correctly
- Test edit/delete operations

### User Acceptance Testing
- 5 test users (2 new, 3 experienced)
- Tasks:
  1. Create new project
  2. Add sub-project
  3. Add update
  4. Find specific content
- Metrics: Time to complete, errors, satisfaction

### Regression Testing
- Verify existing content still loads
- Check GitHub commits work
- Validate Vercel deployment

---

## Deployment Plan

### Step 1: Local Testing
1. Implement Phase 1 changes
2. Test at `http://localhost:4321/keystatic`
3. Create test content
4. Verify GitHub commits

### Step 2: Staging Deployment
1. Deploy to Vercel preview branch
2. Test with production data
3. Monitor for errors

### Step 3: Production Deployment
1. Merge to main branch
2. Vercel auto-deploys
3. Monitor analytics
4. Gather user feedback

### Rollback Plan
- Git revert if critical issues
- Keep backup of old config
- Document all changes for easy reversal

---

## Success Metrics

### Quantitative Metrics

**Error Rates:**
- **Before:** 40% error rate on relationship creation
- **Target:** <5% error rate
- **Measurement:** Track form validation errors

**Time to Complete:**
- **Before:** 10-15 minutes to create project + sub-project
- **Target:** <5 minutes
- **Measurement:** User testing with timer

**Support Burden:**
- **Before:** 50% of tickets about slug issues
- **Target:** <10% slug-related tickets
- **Measurement:** Track support tickets by category

**Data Integrity:**
- **Before:** Unknown number of orphaned items
- **Target:** 0 orphaned content
- **Measurement:** Run orphan detection script weekly

### Qualitative Metrics

**System Usability Scale (SUS):**
- **Target:** >80 (industry "good" standard)
- **Measurement:** 10-question survey after Phase 2

**User Satisfaction:**
- **Target:** >4/5 stars
- **Measurement:** Post-task survey

**Onboarding Success:**
- **Target:** >90% can create first project without help
- **Measurement:** Track onboarding tour completion

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Keystatic API changes | Low | High | Pin package versions, test upgrades |
| User resistance to change | Medium | Low | Provide migration guide, tour |
| Performance degradation | Low | Medium | Monitor page load times |
| Relationship field bugs | Medium | High | Comprehensive testing, gradual rollout |

---

## Timeline

```
Week 1: Phase 1 (Critical Fixes)
├─ Day 1-2: Relationship dropdowns
├─ Day 3: Consolidate visibility fields
└─ Day 4: Slug validation + testing

Week 2: Phase 2 (UX Polish)
├─ Day 1-2: Field group accordions
├─ Day 3: Contextual help
└─ Day 4-5: Empty states + testing

Week 3-4: Phase 3 (Visual Hierarchy)
├─ Week 3: Tree view implementation
└─ Week 4: Quick actions + badges + testing

Month 2 (Optional): Phase 4
└─ Advanced features as time permits
```

---

## Next Steps

1. **Review this plan** - Confirm scope and priorities
2. **Set up development environment** - Ensure Keystatic works locally
3. **Create feature branch** - `git checkout -b feature/keystatic-improvements`
4. **Start Phase 1, Task 1.1** - Relationship dropdowns
5. **Test incrementally** - Commit after each task
6. **Deploy to staging** - Test before production
7. **Gather feedback** - Iterate based on user input

---

**Plan created:** November 9, 2025
**Status:** Approved and ready to implement
**First task:** Replace manual slug entry with relationship dropdowns
