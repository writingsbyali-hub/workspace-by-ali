# Architecture Comparison - App vs Content Template

**Created:** November 6, 2025
**Purpose:** Clarify the relationship between the main app and template repo

---

## 🎯 Quick Answer

**NO, the old workspace is NOT deleted!**

There are actually **3 different things** that work together:

1. **Main Application** (workspace-by-ali) - The website code
2. **Template Repository** (workspace-by-ali-template) - Example content only
3. **User Repositories** (workspace-by-{username}) - Each user's personal content

---

## 📊 The Three Pieces

### 1️⃣ Main Application (This Repo)

**Location:** `workspace-by-ali` (this codebase)
**Purpose:** The actual Astro website application
**Contains:**
- ✅ All UI components (`src/components/`)
- ✅ All pages (`src/pages/`)
- ✅ All styles (Tailwind, global CSS)
- ✅ API endpoints (`src/pages/api/`)
- ✅ Keystatic configuration (`keystatic.config.ts`)
- ✅ Build configuration (`astro.config.mjs`)

**Deployed to:** Vercel (https://workspace.xbyali.page)

**Status:** ✅ **KEEP THIS - It's the main app!**

---

### 2️⃣ Template Repository

**Location:** https://github.com/writingsbyali-hub/workspace-by-ali-template
**Purpose:** Example content structure for new users
**Contains:**
- ✅ Example markdown files only (`content/`)
- ✅ Example project structure
- ✅ Example `.access.yml` for safety gating
- ✅ README and setup instructions
- ❌ NO app code
- ❌ NO components
- ❌ NO styles

**Used for:** Creating new user workspaces (gets forked)

**Status:** ✅ **KEEP THIS - Users fork it!**

---

### 3️⃣ User Repositories (Future)

**Location:** `workspace-{username}` (created when user signs up)
**Purpose:** Each user's personal content storage
**Contains:**
- ✅ User's projects (markdown)
- ✅ User's streams (markdown)
- ✅ User's updates (markdown)
- ✅ User's images/data
- ❌ NO app code

**Example:** When "alisa" signs up → gets `workspace-alisa` repo

**Status:** 🔜 **CREATED AUTOMATICALLY on signup**

**Note:** The repo is named `workspace-{username}` (not `workspace-by-{username}`) to keep it shorter and clearer. "Workspace by Ali" is YOUR brand name, not part of the user's repo name.

---

## 🔄 How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                    User's Browser                           │
│                                                             │
│  https://workspace.xbyali.page (Main App - Vercel)         │
│                                                             │
│  Pages:                                                     │
│  • / (dashboard) ───────────> Reads from User Repo         │
│  • /projects ────────────────> Reads from User Repo         │
│  • /keystatic ───────────────> Edits User Repo             │
│                                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Uses components/styles from Main App
                  │ Reads/writes content from User Repo
                  │
        ┌─────────┴──────────┐
        │                    │
        ↓                    ↓
┌──────────────┐      ┌──────────────────┐
│  Main App    │      │  User's GitHub   │
│  (Vercel)    │      │  Repo (Content)  │
│              │      │                  │
│ Components   │      │ content/         │
│ Styles       │      │   projects/      │
│ Pages        │      │   streams/       │
│ APIs         │      │   updates/       │
└──────────────┘      └──────────────────┘
                             ↑
                             │ Forked from
                             │
                      ┌──────────────────┐
                      │ Template Repo    │
                      │ (Example Content)│
                      │                  │
                      │ Example project  │
                      │ Example stream   │
                      │ Example update   │
                      └──────────────────┘
```

---

## 🎨 UI Comparison

### Main UI: http://127.0.0.1:4321/

**What it shows:**
- Dashboard with project cards
- Project detail pages
- Update timeline
- Profile settings
- Public-facing interface

**Who uses it:**
- End users viewing content
- Visitors browsing public projects

**Technology:**
- Astro pages
- React components from `src/components/`
- Your custom styles (Tailwind + global CSS)
- Tremor charts
- DaisyUI components

**Content source:**
- Reads from user's GitHub repo
- Fetches via GitHub API
- Cached in Supabase (`project_cache` table)

---

### Keystatic UI: http://127.0.0.1:4321/keystatic

**What it shows:**
- Admin panel for editing content
- Collection lists (Projects, Streams, Updates)
- Rich text editor
- Form fields for metadata

**Who uses it:**
- Content creators/editors
- Users managing their own workspace

**Technology:**
- Keystatic's built-in React UI
- Auto-generated from `keystatic.config.ts`
- NOT using your custom components
- Has its own styling (Keystatic's design)

**Content source:**
- Edits user's GitHub repo directly
- Commits changes to `draft` branch
- Can be configured to use local storage (dev mode)

---

## 🗂️ What Stays, What Goes, What's New

### ✅ KEEP - From Current Workspace

**All UI Components:**
- ✅ `src/components/ui/ProjectCard.tsx`
- ✅ `src/components/ui/StatCard.tsx`
- ✅ `src/components/ui/EmptyState.tsx`
- ✅ `src/components/ui/ProjectSwitcher.tsx`
- ✅ `src/components/layouts/DashboardLayout.astro`
- ✅ All other components

**All Pages:**
- ✅ `src/pages/index.astro` (homepage)
- ✅ `src/pages/dashboard.astro`
- ✅ `src/pages/projects.astro`
- ✅ `src/pages/updates.astro`
- ✅ `src/pages/login.astro`
- ✅ All other pages

**All Styles:**
- ✅ `src/styles/global.css`
- ✅ Tailwind configuration
- ✅ DaisyUI themes
- ✅ Brand colors (green theme)

**All APIs:**
- ✅ `src/pages/api/auth/*` (authentication)
- ✅ `src/pages/api/projects/*` (projects API)
- ✅ `src/pages/api/updates/*` (updates API)
- ✅ All other APIs

---

### 🔄 CHANGE - Data Source

**Old Way:**
- Projects stored in Supabase `projects` table
- Updates stored in Supabase `updates` table
- Database is source of truth

**New Way:**
- Projects stored in user's GitHub repo (markdown files)
- Updates stored in user's GitHub repo (markdown files)
- GitHub is source of truth
- Supabase only caches metadata for speed

**What this means:**
- Pages read from GitHub instead of Supabase
- Keystatic edits GitHub files
- Supabase cache improves performance
- Users own their data

---

### 🆕 ADD - New Features

**Keystatic CMS:**
- New admin UI at `/keystatic`
- Content editing interface
- Configured in `keystatic.config.ts`

**Git Workflow:**
- Draft branch for editing
- Main branch for published content
- Publish button merges draft → main

**User Repos:**
- Each user gets their own GitHub repo
- Forked from template on signup
- Contains their content only

---

## 📝 Example User Journey

### User: "Ali" Signs Up

**Step 1: First Login**
```
User visits: https://workspace.xbyali.page
Clicks: "Login with GitHub"
→ Authenticates via Supabase OAuth
```

**Step 2: Onboarding**
```
App checks: Does Ali have a GitHub token?
→ No, redirect to /api/auth/github-connect
→ Ali authorizes app to access repos
→ Token encrypted and stored in Supabase
```

**Step 3: Fork Template**
```
App checks: Does Ali have a workspace repo?
→ No, call POST /api/repo/fork
→ Creates "workspace-alisa" from template
→ Repo contains example projects/streams/updates
```

**Step 4: Dashboard**
```
User sees: "Ali's Workspace" (personalized header)
          Dashboard with example project
          "Powered by Workspace by Ali" (footer)
Content from: workspace-alisa repo (main branch)
Cached in: Supabase project_cache table
Rendered with: Main app components/styles
```

**Step 5: Edit Content**
```
User clicks: "Edit" → redirects to /keystatic
Opens: Project in Keystatic editor
Edits: Project title, description
Saves: Commits to draft branch in workspace-alisa
```

**Step 6: Publish**
```
User clicks: "Publish" button
App calls: POST /api/publish
Action: Merges draft → main branch
Result: Changes now visible on dashboard
```

---

## 🎯 Key Differences

### Keystatic vs Main UI

| Feature | Main UI | Keystatic UI |
|---------|---------|--------------|
| **URL** | `/`, `/dashboard`, `/projects` | `/keystatic` |
| **Purpose** | View and browse content | Edit and manage content |
| **Styling** | Your custom Tailwind/DaisyUI | Keystatic's built-in design |
| **Components** | Your React/Astro components | Keystatic's components |
| **Users** | Everyone (public + logged in) | Content editors only |
| **Edits** | Read-only | Can create/edit/delete |
| **Branch** | Reads from `main` | Edits `draft` |

---

## ❓ Common Questions

### Q: Will I lose my current components/styles?
**A:** No! All components and styles stay exactly as they are.

### Q: Do I need to rebuild the UI?
**A:** No! Your existing UI just changes where it gets data from (GitHub instead of Supabase).

### Q: Is Keystatic replacing my dashboard?
**A:** No! Keystatic is an ADDITIONAL admin panel. Your dashboard is the main UI.

### Q: Can users see Keystatic?
**A:** Only if they're editing their own content. Public users see your custom UI.

### Q: What about my Tremor charts and stats?
**A:** Keep them! They'll just read from the cache tables instead of old tables.

### Q: Do I need two websites?
**A:** No! It's ONE website with TWO interfaces:
- Public pages (your design)
- Admin editor (Keystatic)

---

## 🔧 Migration Path

### Phase 1: Keep Both Systems Running (Current)
```
✅ Old Supabase data still works
✅ New Git infrastructure being built
✅ Both coexist during development
```

### Phase 2: Migrate Data (Future)
```
1. Export projects from Supabase → Markdown
2. Create projects in user's GitHub repo
3. Verify everything displays correctly
4. Deprecate old tables (keep as backup)
```

### Phase 3: Full Git-First (Goal)
```
✅ All content in GitHub
✅ Keystatic for editing
✅ Your UI for viewing
✅ Supabase only for auth + cache + safety logs
```

---

## 📚 Mental Model

Think of it like this:

**Main App (workspace-by-ali) = The Restaurant**
- Has the building, kitchen, furniture, decor
- This is what customers see and use
- Never goes away

**Template (workspace-by-ali-template) = Recipe Book**
- Example recipes to get started
- New chefs get a copy
- Just a starting point

**User Repos (workspace-by-{username}) = Personal Cookbook**
- Each chef has their own cookbook
- Contains their unique recipes
- Stored separately from the restaurant

**Keystatic = Kitchen Prep Station**
- Where chefs write new recipes
- Edit existing recipes
- Organize their cookbook

**Main UI = Dining Room**
- Where customers see the menu
- Where food is presented
- Uses the restaurant's decor

---

## 🎬 Next Steps

1. **Keep developing in workspace-by-ali** (main app)
2. **Components/styles stay exactly as they are**
3. **Pages just need to read from GitHub instead of Supabase**
4. **Keystatic is bonus admin UI, not replacement**

---

**Bottom Line:**

Your existing work is **NOT wasted**. Everything you built stays. We're just changing the **data source** from Supabase tables to GitHub markdown files, and adding Keystatic as an **optional editor** for power users.

**Your beautiful UI → Still there**
**Your components → Still used**
**Your styles → Still applied**
**Your pages → Just read from different source**

---

**Questions? Ask in next session!**
