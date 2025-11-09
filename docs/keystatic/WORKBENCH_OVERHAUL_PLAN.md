# Workbench Overhaul Plan (Option B)
**Date:** November 9, 2025
**Status:** Planning - Ready for Implementation
**Estimated Effort:** 8-12 hours

---

## 🎯 Vision

Transform the workbench/projects page from a basic card view into a powerful dual-view interface with deep Keystatic integration, making content management seamless and intuitive.

## 📊 Current State (Issues Identified)

1. **Single View Only**: Only card view available, no directory/tree visualization
2. **No Quick Actions**: Can't edit project metadata without navigating to Keystatic
3. **No Deep Linking**: Can't open Keystatic at specific paths/items
4. **Navigation Disconnect**: Keystatic feels like separate app (no return links)
5. **Missing Directory Data**: Cards show "0 sub-projects • 0 updates" (data fetching issue)

## 🚀 Proposed Solution

### 1. Dual-View Interface (4 hours)

**Card View (Enhanced)**
- Keep existing card layout
- **Add action buttons to each card:**
  - ✏️ Edit Info → Opens Keystatic at `/keystatic/branch/main/collection/projects/item/{slug}`
  - 🔒 Edit Visibility → Opens Keystatic editor with focus on visibility field
  - 📄 Manage Docs → Opens docs collection filtered by project
  - 🗑️ Archive/Delete → Confirmation modal + direct action
- **+ Create Project** button (prominent, top-right)
- Show correct sub-project and update counts

**Directory View (New)**
- Use `ProjectTree.astro` component
- Same visual design as tree (folders, badges, expand/collapse)
- Click project name → navigate to project page
- Click action icons → open Keystatic editor
- Show full hierarchy: Projects → Sub-Projects → Updates

**View Toggle**
- Button to switch between Card and Directory views
- User preference saved to localStorage
- Smooth transition animation

### 2. Keystatic Deep Linking (2 hours)

**Implementation:**
```typescript
// Open Keystatic at specific item
const openInKeystatic = (collection: string, slug: string) => {
  const keystaticUrl = `/keystatic/branch/main/collection/${collection}/item/${slug}`;
  window.open(keystaticUrl, '_blank'); // Opens in new tab
};

// Open Keystatic create form
const createInKeystatic = (collection: string) => {
  const keystaticUrl = `/keystatic/branch/main/collection/${collection}/create`;
  window.open(keystaticUrl, '_blank');
};
```

**Card Actions:**
- Edit Info → `openInKeystatic('projects', project.slug)`
- Edit Visibility → Same URL, Keystatic auto-focuses field
- Create Project → `createInKeystatic('projects')`

### 3. Keystatic Navigation Improvements (2 hours)

**Add Navigation Bar in Keystatic:**
- Create custom header component for Keystatic
- Add breadcrumbs: `Keystatic > Collections > Projects > {item}`
- Add quick links:
  - ← Return to Workbench
  - ← View Public Website
  - 🏠 Workspace Home

**Options:**
1. Inject via Keystatic UI customization (if available)
2. Create wrapper page that embeds Keystatic in iframe with nav
3. Use browser extension or custom script

### 4. Directory-Style Keystatic UI (Optional - 2-4 hours)

**Goal:** Replace flat collection list with hierarchical tree

**Implementation:**
- Detect when user is in Keystatic
- Inject custom sidebar with tree navigation
- Use same `ProjectTree` component logic
- Clicking tree nodes navigates to Keystatic edit pages

**Challenges:**
- Keystatic UI is controlled by framework
- May require hacky DOM injection
- Could break with Keystatic updates

**Recommendation:** Start with external navigation first, evaluate if worth custom UI

---

## 📁 Files to Create/Modify

### New Files
- `src/components/workbench/DirectoryView.astro` - Directory tree for workbench
- `src/components/workbench/ProjectCardActions.tsx` - Action buttons for cards
- `src/components/workbench/ViewToggle.tsx` - Card/Directory toggle
- `src/components/keystatic/KeystaticNav.astro` - Navigation wrapper (optional)
- `src/lib/keystaticDeepLink.ts` - Deep linking utilities

### Modified Files
- `src/pages/workbench/projects.astro` - Add dual views
- `src/components/workbench/ProjectCard.tsx` - Add action buttons
- `src/styles/global.css` - Add workbench styles

---

## 🎨 UI Design Specs

### Card Actions Layout
```
┌─────────────────────────────────────┐
│ Project Title                    🟢 │
│ 2 sub-projects • 5 updates          │
│ Hardware • Last updated 2 days ago  │
│                                     │
│ [✏️ Edit] [🔒 Gate] [📄 Docs] [⋮]  │
└─────────────────────────────────────┘
```

### View Toggle
```
[🃏 Cards] [🌲 Directory]  [+ Create Project]
```

### Directory View
- Reuse `ProjectTree` component
- Add click handlers for deep linking
- Show action menu on hover
- Collapsible by default (user can expand)

---

## 🔧 Technical Implementation

### Phase 1: Dual Views (2 hours)
1. Create ViewToggle component
2. Add localStorage for preference
3. Implement Card/Directory conditional rendering
4. Style transitions

### Phase 2: Card Actions (2 hours)
1. Create ProjectCardActions component
2. Add action handlers (openInKeystatic, etc.)
3. Style action buttons
4. Add confirmation modals

### Phase 3: Deep Linking (2 hours)
1. Create keystaticDeepLink utility
2. Wire up all action buttons
3. Test navigation to correct Keystatic paths
4. Handle edge cases (missing data, etc.)

### Phase 4: Keystatic Nav (2 hours)
1. Design navigation component
2. Decide implementation approach
3. Add breadcrumbs and return links
4. Test across Keystatic pages

### Phase 5: Testing & Polish (1-2 hours)
1. Test all workflows
2. Fix data fetching (sub-project counts)
3. Add loading states
4. Improve error handling

---

## 🐛 Issues to Fix

### Data Fetching Bug
Current cards show "0 sub-projects • 0 updates" even when data exists.

**Root Cause:** Workbench uses Supabase cache tables that aren't populated

**Solutions:**
1. Update workbench to use Keystatic reader (like public pages)
2. Ensure webhook populates cache correctly
3. Add fallback to GitHub API if cache empty

**Recommended:** Use Keystatic reader for consistency

---

## 🎓 Learning from .claude/agents

**Suggested Agents to Create:**

1. **backend-architect** - For Supabase/cache/API work
2. **ui-designer** - For card actions and view toggle design
3. **frontend-developer** - For React components and interactivity
4. **integration-specialist** - For Keystatic deep linking

**Example Agent Usage:**
```bash
# Create backend agent for data fetching fix
.claude/agents/backend-architect.md

# Use agent during development
Task: Fix workbench data fetching to show correct counts
Agent: backend-architect
```

---

## 📝 Session Start Prompt

**Copy this when ready to start Option B:**

```markdown
Hi! Ready to implement Workbench Overhaul (Option B).

Please read: docs/keystatic/WORKBENCH_OVERHAUL_PLAN.md

Context:
- Directory tree component already built (src/components/workspace/ProjectTree.astro)
- Currently only used on public pages
- Need to integrate into workbench with actions

Goals:
1. Dual-view workbench (card + directory)
2. Action buttons on cards (Edit, Gate, Docs)
3. Deep linking to Keystatic editor
4. Keystatic navigation improvements
5. Fix data fetching bug (show correct counts)

Let's start with planning phase - create task breakdown and identify which specialized agents to use.
```

---

## 🚦 Success Criteria

**Workbench Improvements:**
- ✅ Card and Directory views both available
- ✅ View preference persists across sessions
- ✅ Action buttons work on all cards
- ✅ Correct sub-project/update counts displayed
- ✅ + Create Project button prominent and functional

**Keystatic Integration:**
- ✅ Edit actions open Keystatic at correct path
- ✅ Keystatic opens in new tab (or iframe with nav)
- ✅ Return to Workbench link visible in Keystatic
- ✅ Create forms open directly from workbench

**User Experience:**
- ✅ Smooth view transitions
- ✅ Loading states during data fetch
- ✅ Error handling for edge cases
- ✅ Mobile-responsive design
- ✅ Keyboard navigation support

---

**Document Status:** Planning Complete - Ready for Implementation
**Last Updated:** November 9, 2025
**Author:** Claude Code
**Related:** docs/keystatic/ENHANCEMENT_PLAN.md Priority 3
