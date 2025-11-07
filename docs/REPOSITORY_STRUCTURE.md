# Repository Structure - Workspace

**Last Updated:** November 7, 2025
**Status:** Authoritative reference for self-hosted deployment model

This document explains the repository structure for the Workspace platform and how the **self-hosted deployment model** works.

---

## Overview

### Self-Hosted Architecture

Each researcher deploys their **own independent workspace** with:
- Own Vercel deployment (e.g., `alis-workspace.vercel.app`)
- Own GitHub content repository (e.g., `workspace-ali`)
- Own Supabase project (auth + cache)
- Own GitHub OAuth app (for repo access)

**Key Concept:** There is NO centralized multi-tenant deployment. Each user owns their infrastructure.

### Repository Types

The Workspace system uses **TWO types of repositories**:

1. **Main Application Repository** - The app code (this repo)
2. **Template Repository** - The template users fork to create their content repo

---

## 1. Main Application Repository

**Name:** `workspace-by-ali`
**Owner:** `writingsbyali-hub` (or your personal account)
**Type:** Private/Public application repository
**Purpose:** Contains the Astro web application that powers Workspace by Ali

### Contains:
- ✅ Astro application code
- ✅ API endpoints (`/src/pages/api/`)
- ✅ UI components (`/src/components/`)
- ✅ Authentication system (Supabase)
- ✅ GitHub OAuth integration
- ✅ Documentation (`/docs/`)
- ✅ Configuration files

### Key Files:
- `astro.config.mjs` - Astro configuration
- `keystatic.config.ts` - Keystatic CMS configuration
- `package.json` - Dependencies
- `.env` - Environment variables (not committed)

### Deployment:
- Hosted on Vercel
- Connected to this repository

---

## 2. Template Repository ✅

**Name:** `workspace-by-ali-template` (branding name)
**Standard User Repo Naming:** `workspace-{username}` (e.g., `workspace-ali`, `workspace-sarah`)
**Owner:** `writingsbyali-hub`
**Type:** Public template repository
**URL:** https://github.com/writingsbyali-hub/workspace-by-ali-template
**Purpose:** Template that users fork to create their personal workspace content repository

### Status: ✅ DEPLOYED

- [x] Repository created on GitHub
- [x] Content structure pushed
- [x] Configured as template repository
- [x] Referenced in fork endpoint ([src/pages/api/repo/fork.ts](../src/pages/api/repo/fork.ts#L25))

### Repository Naming Convention

**Template Repo:** `workspace-by-ali-template` (includes branding "by Ali")
**User Content Repos:** `workspace-{username}` (standardized format, no "by")

Examples:
- ✅ `workspace-ali` (Ali's content repo)
- ✅ `workspace-sarah` (Sarah's content repo)
- ❌ `workspace-by-ali` (not standard for user repos)

**Why Different Naming?**
- Template repo uses branding for attribution ("by Ali")
- User repos use clean standard format for consistency
- System automatically names forked repos as `workspace-{username}`

### Contains:

**⚠️ IMPORTANT:** Content structure uses **flat collections with relationship fields** (Keystatic limitation workaround).

```
workspace-by-ali-template/  (template repo)
├── content/
│   ├── projects/                    # Top-level projects (flat)
│   │   └── example-project/
│   │       ├── project.mdoc
│   │       └── .access.yml.example
│   │
│   ├── sub-projects/                # Flat collection (NOT nested!)
│   │   └── example-subproject/
│   │       ├── sub-project.mdoc     # Includes projectId relationship field
│   │       └── .access.yml.example
│   │
│   ├── updates/                     # Flat collection (NOT nested!)
│   │   └── 2025-11-05-welcome/
│   │       └── update.mdoc          # Includes projectId + subProjectId fields
│   │
│   ├── data/                        # Data files (organized by project)
│   │   └── example-project/
│   │       └── sample-data.csv
│   │
│   └── notes/                       # Personal notes
│       └── welcome.md
│
├── public/
│   └── images/
├── README.md                        # Workspace setup guide
├── SETUP.md                         # Detailed setup instructions
├── LICENSE                          # MIT License
└── .gitignore
```

**Terminology:** "Streams" renamed to "Sub-Projects" (Nov 6, 2025)

### Branches:

**Main Branch:**
- `main` - Published/public content
- Rebuilt by Vercel on every push
- Content visible to readers (based on visibility settings)

**Draft Branch:**
- `draft` - Work-in-progress content (created automatically on fork)
- Owner edits via Keystatic CMS
- Merged to `main` via "Publish" button

**Publishing Workflow:**
```
Owner edits in Keystatic → Commits to draft branch → Clicks "Publish" →
API merges draft → main → Vercel rebuilds → Content goes live
```

### How Users (Owners) Get This:

**Owner Setup Flow:**
1. User deploys Workspace app to their Vercel account
2. Configures their own Supabase project
3. Sets up their own GitHub OAuth app
4. Visits owner setup wizard at `/setup`
5. Connects GitHub with `repo` scope
6. System calls `POST /api/repo/fork`
7. Forks template as `workspace-{username}`
8. User becomes **owner** of their workspace
9. Can now access Keystatic at `/keystatic`

**Reader Signup (No Fork):**
- Readers do NOT fork repositories
- Readers sign up via `/reader-signup` (Phase 2)
- Stored in owner's Supabase
- Can view gated content after acknowledgment
- Cannot edit content or access Keystatic

---

## Repository Relationship

### Self-Hosted Deployment Model

Each owner deploys their own independent workspace:

```
┌─────────────────────────────────────────────────────────────────────┐
│  TEMPLATE REPOSITORY (Public)                                        │
│  workspace-by-ali-template                                           │
│  • Content structure                                                 │
│  • Example projects/sub-projects                                     │
│  • Setup documentation                                               │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               │ Forked by owners during setup
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│  ALI'S WORKSPACE (Self-Hosted)                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Vercel: alis-workspace.vercel.app                          │    │
│  │  ┌───────────────────────────────────────────────────────┐  │    │
│  │  │  workspace-by-ali app code (forked/deployed)          │  │    │
│  │  │  • Astro application                                  │  │    │
│  │  │  • API endpoints                                      │  │    │
│  │  │  • Keystatic CMS (/keystatic)                         │  │    │
│  │  └───────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                       │
│                               ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  GitHub: workspace-ali                                      │    │
│  │  • Ali's content repository                                 │    │
│  │  • Projects, sub-projects, updates                          │    │
│  │  • Branches: main (published), draft (work-in-progress)     │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                       │
│                               ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Supabase: ali-workspace-db                                 │    │
│  │  • Auth (Ali as owner, optional readers)                    │    │
│  │  • workspace_settings (Ali's config)                        │    │
│  │  • user_roles (Ali = owner, guests = readers)               │    │
│  │  • Cache tables (project_cache, stream_cache)               │    │
│  │  • reader_acknowledgments, reader_suggestions               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Owner: Ali                                                           │
│  Readers: Optional (guests who sign up to read gated content)        │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  SARAH'S WORKSPACE (Separate Self-Hosted Instance)                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Vercel: sarahs-workspace.vercel.app                        │    │
│  │  ┌───────────────────────────────────────────────────────┐  │    │
│  │  │  workspace-by-ali app code (forked/deployed)          │  │    │
│  │  └───────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                       │
│                               ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  GitHub: workspace-sarah                                    │    │
│  │  • Sarah's content repository                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                               │                                       │
│                               ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Supabase: sarah-workspace-db                               │    │
│  │  • Sarah's own database                                     │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Owner: Sarah                                                         │
│  Completely independent from Ali's workspace                          │
└───────────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- Each workspace is **completely independent**
- No shared database or deployment
- Each owner manages their own infrastructure and costs
- Readers are specific to each workspace (stored in that workspace's Supabase)
- Collaboration happens via Git (fork/PR) between independent workspaces

---

## Configuration in Main App

### Fork Endpoint Configuration

**File:** [src/pages/api/repo/fork.ts](../src/pages/api/repo/fork.ts)

```typescript
// Template repository configuration
const TEMPLATE_OWNER = 'writingsbyali-hub';
const TEMPLATE_REPO = 'workspace-by-ali-template';
```

**IMPORTANT:** If you rename or move the template repo, update these constants!

### Keystatic Configuration

**File:** [keystatic.config.ts](../keystatic.config.ts)

Keystatic is configured to work with the user's forked workspace repo, not the template.

---

## Local Development Setup

### Working on Main App:
```bash
# This repository (workspace-by-ali)
cd workspace-by-ali
npm run dev
```

### Working on Template:
```bash
# If you need to update the template locally
cd workspace-template/
# Make changes
git add .
git commit -m "Update template"
git push origin main
```

**Note:** The `/workspace-template/` folder in the main repo is kept in sync with the template repo for easy updates.

---

## Self-Hosted Deployment Process

### For New Owners (Complete Setup)

**Prerequisites:**
- GitHub account
- Vercel account
- Supabase account

**Step-by-Step:**

1. **Fork/Clone Main App Repository**
   - Fork `workspace-by-ali` to your GitHub account
   - Or: Click "Deploy to Vercel" button (future feature)

2. **Create Supabase Project**
   - Create new project on supabase.com
   - Run migrations in SQL Editor:
     - `supabase/migrations/20241106000000_self_hosted_owner_reader.sql`
     - `supabase/migrations/20241107000000_rename_streams_to_subprojects.sql`
   - Note: Project URL and Anon Key

3. **Create GitHub OAuth App**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth app
   - Authorization callback URL: `https://your-deployment.vercel.app/api/auth/callback`
   - Note: Client ID and Client Secret

4. **Deploy to Vercel**
   - Connect GitHub repo to Vercel
   - Set environment variables (see `.env.example`):
     - `PUBLIC_SUPABASE_URL`
     - `PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `GITHUB_CLIENT_ID`
     - `GITHUB_CLIENT_SECRET`
     - `GITHUB_CALLBACK_URL`
     - `TOKEN_ENCRYPTION_KEY` (generate random 32-char string)
   - Deploy

5. **Complete Owner Setup**
   - Visit your deployed workspace
   - Click "Get Started" or go to `/setup`
   - Connect GitHub account (grants `repo` scope)
   - Fork template repository (creates `workspace-{username}`)
   - You're now the **owner** of your workspace!

6. **Access Keystatic**
   - Go to `/keystatic`
   - Create your first project, sub-project, or update
   - Changes commit to `draft` branch
   - Click "Publish" to merge to `main`

**Result:** You have your own independent workspace instance!

---

## Deployment Checklist

### When Deploying Your Own Workspace (Owner):
- [ ] Supabase project created
- [ ] Migrations run successfully
- [ ] GitHub OAuth app created
- [ ] Environment variables set in Vercel
- [ ] App deployed to Vercel
- [ ] Owner setup completed at `/setup`
- [ ] Template forked as `workspace-{username}`
- [ ] Keystatic accessible at `/keystatic`
- [ ] Test: Create project, publish, verify it appears

### When Updating Template (Maintainer):
- [ ] Update content in `/workspace-template/`
- [ ] Update example projects/sub-projects
- [ ] Update README with setup instructions
- [ ] Push to `workspace-by-ali-template` repo
- [ ] Test fork endpoint creates repo correctly
- [ ] Verify flat structure works with Keystatic

### When Updating Main App (Maintainer):
- [ ] Push code to GitHub
- [ ] Vercel auto-deploys
- [ ] Test OAuth flow works
- [ ] Test fork endpoint
- [ ] Test publish endpoint (draft → main)
- [ ] Verify Keystatic integration

---

## Important Notes

### Self-Hosted Architecture
1. **No Shared Infrastructure:** Each workspace is completely independent
2. **Owner Owns Everything:** User owns their Vercel, Supabase, and GitHub resources
3. **No Multi-Tenant Database:** Each workspace has its own Supabase project
4. **Scalability:** Scales horizontally (each user = separate instance)

### Repository Naming
5. **Template Branding:** Template repo uses `workspace-by-ali-template` for attribution
6. **User Repo Standard:** User content repos named `workspace-{username}` (clean, consistent)
7. **Automatic Naming:** Fork endpoint automatically applies standard naming

### Content Structure
8. **Flat Collections:** Sub-projects and updates use flat structure (Keystatic workaround)
9. **Relationship Fields:** Use `projectId`, `subProjectId`, `parentSubProjectId` for hierarchy
10. **See Keystatic Docs:** [05_Keystatic_Integration.md](./architecture/05_Keystatic_Integration.md) for details

### Access Control
11. **Template is Public:** Template repo must be public so owners can fork it
12. **Main App Can Be Private:** Application code can remain private (owner's choice)
13. **Content Repos:** User content repos can be public or private (owner decides)
14. **Reader Access:** Readers don't need GitHub accounts, stored in owner's Supabase

---

## Troubleshooting

### Fork Endpoint Fails
- Check `TEMPLATE_OWNER` and `TEMPLATE_REPO` constants
- Verify template repo exists and is public
- Ensure template repo has "Template repository" enabled in settings

### Template Not Found
- Confirm URL: https://github.com/writingsbyali-hub/workspace-by-ali-template
- Check repo visibility (should be public)
- Verify GitHub token has access

### Local Template Out of Sync
```bash
# Update local workspace-template folder
cd workspace-template/
git pull origin main
```

---

## Related Documentation

- [SESSION_HANDOFF_Nov_6_2025_Git_APIs.md](./SESSION_HANDOFF_Nov_6_2025_Git_APIs.md) - Git infrastructure implementation
- [MASTER_TASKLIST.md](./MASTER_TASKLIST.md) - Project progress tracker
- [architecture/05_Keystatic_Integration.md](./architecture/05_Keystatic_Integration.md) - Keystatic setup

---

**Maintained by:** Claude + Ali
**Created:** November 6, 2025
**Purpose:** Clarify the dual-repository structure for future sessions
