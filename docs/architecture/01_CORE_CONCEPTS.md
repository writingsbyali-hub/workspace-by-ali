# Core Architectural Concepts

**Authors:** Ali · Lumen · Claude
**Date:** November 7, 2025
**Status:** Authoritative reference for Workspace architecture
**Related:** [Glossary](01_Workspace_Language_and_Structure_Glossary.md), [Data Structures](02_DATA_STRUCTURES.md)

---

## Overview

This document defines the foundational architectural concepts for the **Workspace** platform—a self-hosted, Git-backed research workspace system designed for autonomy, collaboration, and ethical knowledge sharing.

**Core Philosophy:**
- **Self-hosted**: Each researcher owns their deployment, data, and infrastructure
- **Git-first**: Content lives in Git repositories (source of truth)
- **Lightweight**: Supabase used only for auth, metadata cache, and safety logs
- **Collaborative**: Fork/PR workflow enables distributed collaboration
- **Ethical**: Safety protocols, license compliance, and proper attribution built-in

---

## 1. Deployment Models

### 1.1 Self-Hosted Architecture

**Definition:** Each researcher deploys their own independent workspace instance on their own infrastructure (Vercel account, GitHub repos, Supabase project).

**Key Characteristics:**
- **Isolation**: Each workspace is completely independent
- **Ownership**: User owns deployment, data, and costs
- **Portability**: Full data export/import, migration supported
- **One Owner**: Each deployment has exactly ONE owner (the person who deployed it)
- **Optional Readers**: Owner can enable guest accounts for content access

**Infrastructure per Deployment:**
```
Researcher's Workspace Instance
├── Vercel Deployment (e.g., alis-workspace.vercel.app)
├── GitHub Repository (e.g., workspace-ali)
├── Supabase Project (auth, cache, safety logs)
└── GitHub OAuth App (for repo access)
```

**Examples:**
- **Ali's Workspace**: `alis-workspace.vercel.app` (Ali's Vercel account)
- **Sarah's Workspace**: `sarahs-workspace.vercel.app` (Sarah's Vercel account)
- **Arc^ Commons**: `arc-commons.vercel.app` (Arc^ org Vercel account)

### 1.2 Personal vs Commons Workspaces

| Aspect | Personal Workspace | Commons Workspace |
|--------|-------------------|-------------------|
| **Purpose** | Individual research, exploration | Verified organizational knowledge |
| **Owner** | Individual researcher | Organization (e.g., Arc^) |
| **Publishing** | Auto-publish (owner decides) | Manual review + verification |
| **Governance** | Owner's discretion | Organizational policies + ethics framework |
| **Access** | Private by default, optional readers | Public verified content, gated protocols |
| **Collaboration** | Fork/PR from other researchers | Core team + external contributors |
| **Example** | Ali's plasma research | Arc^ Commons (authoritative plasma systems) |

**Relationship:**
- Personal workspaces are "gardens" (cultivation & experimentation)
- Commons workspaces are "forests" (verified shared knowledge)
- Researchers can submit from Personal → Commons via PR

---

## 2. User Roles & Permissions

### 2.1 Role Hierarchy

```
┌─────────────────────────────────────────┐
│         OWNER (Workspace Deployer)       │
│  • Full control over workspace          │
│  • Access to Keystatic CMS              │
│  • Manage settings, readers, content    │
└─────────────────────────────────────────┘
                    ↓ can enable
┌─────────────────────────────────────────┐
│         READER (Lightweight Guest)       │
│  • View public content                  │
│  • View gated content (after ack.)      │
│  • Leave suggestions (if allowed)       │
│  • No editing, no owner tools           │
└─────────────────────────────────────────┘
```

### 2.2 Owner Role

**Definition:** The person who deployed the workspace. Has full control over their instance.

**Identification:**
- First user to deploy automatically becomes owner (via database trigger)
- Stored in `workspace_settings.owner_id` (one per deployment)
- Role tracked in `user_roles` table

**Capabilities:**
- ✅ Create/edit/delete projects, sub-projects, updates
- ✅ Access Keystatic CMS
- ✅ Manage workspace settings
- ✅ Enable/disable reader accounts
- ✅ Moderate reader suggestions
- ✅ Publish content (merge draft → main)
- ✅ Manage repository settings
- ✅ Fork from other workspaces
- ✅ Submit PRs to Commons

**Technical Implementation:**
```typescript
// Middleware role detection
const { data: role } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .single();

if (role?.role === 'owner') {
  Astro.locals.userRole = 'owner';
  Astro.locals.workspaceOwnerId = user.id;
}
```

### 2.3 Reader Role

**Definition:** A guest account on someone else's workspace, created to access gated content.

**Sign-up Flow:**
1. User visits workspace (not authenticated)
2. Clicks "Sign up as Reader" to access gated content
3. Authenticates via magic link or Google OAuth
4. Assigned reader role in owner's Supabase
5. Must acknowledge safety protocols/licenses to view gated content

**Capabilities:**
- ✅ Read public content (no account needed)
- ✅ Read gated content (after acknowledgment)
- ✅ Leave suggestions/comments (if owner allows)
- ❌ Cannot edit any content
- ❌ Cannot access Keystatic
- ❌ Cannot access owner settings
- ❌ Cannot fork or submit PRs

**Storage:**
- Reader accounts stored in owner's Supabase
- Acknowledgments tracked per reader in `reader_acknowledgments`
- Suggestions stored in `reader_suggestions`

### 2.4 Researcher Role

**Definition:** Someone who has deployed their own workspace (they are the owner of their own instance).

This is NOT a database role—it's a conceptual distinction:
- **Reader** on someone else's workspace = lightweight guest
- **Owner** of your own workspace = full researcher with deployment

**Path to becoming a researcher:**
1. Fork template repository (`workspace-template`)
2. Deploy to Vercel
3. Set up Supabase project
4. Configure GitHub OAuth app
5. Become owner of your workspace
6. Create content, collaborate via Git

### 2.5 Permission Matrix

| Action | Owner | Reader | Unauthenticated |
|--------|-------|--------|-----------------|
| View public content | ✅ | ✅ | ✅ |
| View gated content | ✅ | ✅ (after ack.) | ❌ |
| View private content | ✅ | ❌ | ❌ |
| Create/edit content | ✅ | ❌ | ❌ |
| Access Keystatic | ✅ | ❌ | ❌ |
| Manage workspace | ✅ | ❌ | ❌ |
| Leave suggestions | ✅ | ✅ (if allowed) | ❌ |
| Fork repository | ✅ | ❌ | ❌ |

---

## 3. Content Hierarchy

### 3.1 Structure Overview

```
Workspace
└── Projects
    └── Sub-Projects (formerly "Streams")
        └── Sub-Projects (nested infinitely)
            └── Updates (markdown posts)
                └── Data (CSV, JSON files)
```

### 3.2 Project

**Definition:** A top-level research initiative or body of work.

**Examples:**
- "Plasma Systems for Ecology"
- "Remote Sensing for Salt Marshes"
- "Arc^ Soil Regeneration Research"

**Properties:**
- Unique slug (e.g., `plasma-ecology`)
- Title, description, license
- Visibility: public, gated, private
- Metadata cached in `project_cache` table

**Storage:**
- Metadata: `content/projects/{slug}/project.mdoc` (Keystatic format)
- Cached in Supabase `project_cache` table

### 3.3 Sub-Project (formerly "Stream")

**Definition:** A hierarchical subdivision of a project, representing a phase, aspect, or nested experiment.

**Terminology Change (Nov 6, 2025):**
- **OLD:** "Streams" (confusing, multiple meanings)
- **NEW:** "Sub-Projects" (clear, supports hierarchy)

**Key Characteristics:**
- Can be nested infinitely: Project → Sub-Project → Sub-Sub-Project → ...
- Useful for organizing phases (Design, Testing, Deployment)
- Useful for organizing aspects (Hardware, Software, Data Analysis)
- Each can have its own methods, docs, updates, data

**Example Hierarchy:**
```
Project: Plasma Systems for Ecology
  ├─ Sub-Project: Design Phase
  │   ├─ Sub-Project: Schematic Refinement
  │   └─ Sub-Project: Material Selection
  ├─ Sub-Project: Testing Phase
  │   └─ Sub-Project: Bench Testing
  └─ Sub-Project: Deployment Phase
```

**Storage:**
- Metadata: `content/sub-projects/{slug}/sub-project.mdoc`
- Cached in Supabase `stream_cache` table (table name not yet renamed)
- Relationship: `project_id` (foreign key to project)
- Future: `parent_subproject_id` for hierarchy (not yet implemented)

**Keystatic Limitation:**
- Nested glob patterns (`content/projects/*/sub-projects/*`) don't work for **creating** new items
- Current workaround: Flat collection with `projectId` relationship field
- See [Keystatic Integration](05_Keystatic_Integration.md) for details

### 3.4 Update

**Definition:** A markdown post documenting research progress, reflections, or findings.

**Properties:**
- Title, date, author
- Markdown content
- Linked to project and/or sub-project
- Optional attachments (images, data files)

**Storage:**
- Content: `content/updates/{slug}/update.mdoc`
- Rendered on workspace dashboard

### 3.5 Data Attachments

**Definition:** CSV, JSON, or other data files uploaded alongside updates.

**Types:**
- Raw data (sensor readings, experimental results)
- Processed data (cleaned datasets)
- Visualization inputs (chart data)

**Storage:**
- Files: `content/data/{project}/{filename}`
- Metadata: Referenced in update frontmatter

---

## 4. Data Flow & Source of Truth

### 4.1 Git as Source of Truth

**Principle:** All content lives in Git repositories. Supabase is only a cache.

```
┌──────────────────────────────────────────┐
│   Git Repository (Source of Truth)       │
│   • Projects: content/projects/          │
│   • Sub-Projects: content/sub-projects/  │
│   • Updates: content/updates/            │
│   • Data: content/data/                  │
└──────────────────────────────────────────┘
                    ↓
            Astro Content API
            (reads at build)
                    ↓
┌──────────────────────────────────────────┐
│   Supabase (Cache Only)                  │
│   • project_cache (metadata)             │
│   • stream_cache (sub-project metadata)  │
│   • user_repos (fork tracking)           │
│   • safety_acknowledgments               │
└──────────────────────────────────────────┘
```

**Why Git?**
- ✅ Version control built-in
- ✅ Full history and rollback
- ✅ Collaboration via fork/PR
- ✅ Data portability (export = clone repo)
- ✅ Transparency (all changes logged)
- ✅ No vendor lock-in

**Why Supabase?**
- ✅ Authentication (GitHub OAuth)
- ✅ Metadata cache (fast queries without Git API)
- ✅ Safety acknowledgment tracking
- ✅ Reader management
- ✅ Suggestions/comments system

### 4.2 Content Workflow

**Owner creating content:**
```
1. Owner accesses Keystatic CMS (/keystatic)
2. Creates/edits project, sub-project, or update
3. Keystatic commits to `draft` branch
4. Owner clicks "Publish" button
5. API merges draft → main
6. Deployment rebuilds (Astro reads from main)
7. Supabase cache updated via webhook/build hook
```

**Reader accessing content:**
```
1. Reader visits workspace (authenticated)
2. Page reads from Supabase cache (fast)
3. If gated, checks reader_acknowledgments table
4. If acknowledged, displays content
5. If not, shows acknowledgment modal
```

### 4.3 Cache Invalidation

**When to invalidate cache:**
- After publishing (draft → main merge)
- After deleting content
- After changing visibility settings
- On manual refresh

**How cache is updated:**
- Webhook from GitHub (push event)
- Build hook from Vercel (post-deploy)
- Manual API call (`/api/sync-cache`)

---

## 5. Authentication & Authorization

### 5.1 Authentication Flows

**Primary Auth (Supabase GitHub OAuth):**
- Used for user accounts (owners and readers)
- Provides user identity and session management
- No repo access

**Secondary Auth (GitHub OAuth for Repos):**
- Used for GitHub repo access
- Provides `repo` scope token
- Encrypted and stored in `user_repos` table
- Used by Keystatic and Git APIs

**Implementation:**
```typescript
// Primary auth (user account)
const { data: { user } } = await supabase.auth.getUser();

// Secondary auth (repo access)
const { data: tokenData } = await supabase
  .from('user_repos')
  .select('encrypted_github_token')
  .eq('user_id', user.id)
  .single();

const githubToken = await decrypt(tokenData.encrypted_github_token);
```

### 5.2 Authorization via RLS Policies

**Row Level Security (RLS)** enforces permissions at the database level.

**Example: Project Visibility**
```sql
-- Public projects visible to authenticated users
CREATE POLICY "Public projects visible"
  ON project_cache FOR SELECT
  USING (visibility = 'public' AND auth.uid() IS NOT NULL);

-- Gated projects visible to readers who acknowledged
CREATE POLICY "Gated projects visible after acknowledgment"
  ON project_cache FOR SELECT
  USING (
    visibility = 'gated'
    AND EXISTS (
      SELECT 1 FROM reader_acknowledgments
      WHERE user_id = auth.uid()
      AND acknowledgment_type = 'safety'
      AND project_slug = project_cache.project_slug
    )
  );
```

**Key RLS Policies:**
- `workspace_settings`: Only owner can view/edit
- `user_roles`: Users can view own roles, owner can manage all
- `reader_acknowledgments`: Users can view/insert own, owner can view all
- `reader_suggestions`: Users can view own, owner can manage all
- `project_cache`: Visibility-based access (public, gated, private)
- `stream_cache`: Inherits project visibility

### 5.3 Route Protection

**Middleware (`src/middleware.ts`) enforces route-level access:**

```typescript
// Owner-only routes
const ownerOnlyRoutes = [
  '/keystatic',
  '/settings',
  '/setup',
  '/api/repo/fork',
  '/api/publish',
];

if (ownerOnlyRoutes.some(route => url.pathname.startsWith(route))) {
  if (userRole !== 'owner') {
    return Response.redirect(new URL('/', url));
  }
}
```

**Route Types:**
- **Public**: Anyone can access (landing page, public projects)
- **Authenticated**: Requires login (dashboard, gated content)
- **Owner-only**: Requires owner role (Keystatic, settings, APIs)

---

## 6. Safety Protocol System

### 6.1 Purpose

**Why safety protocols?**
- Some research involves hazards (high voltage, plasma, chemicals)
- Readers must understand risks before accessing detailed instructions
- Owners must ensure responsible knowledge sharing
- Legal protection for workspace deployers

### 6.2 Acknowledgment Types

| Type | Purpose | Example Code |
|------|---------|--------------|
| **Safety** | Acknowledging hazard protocols | `safety-v1.2.0` |
| **License** | Acknowledging content license (CC, etc.) | `CC-BY-NC-SA-4.0` |
| **Terms** | Acknowledging terms of use | `terms-v1.0.0` |

### 6.3 Gating Levels

**Public Content:**
- No acknowledgment required
- Visible to everyone (including unauthenticated)
- General descriptions, overviews, completed results

**Gated Content:**
- Requires safety/license acknowledgment
- Visible only to authenticated readers who acknowledged
- Detailed protocols, methods, hazardous procedures

**Private Content:**
- Owner-only
- Not visible to readers
- Unpublished drafts, personal notes

### 6.4 Acknowledgment Flow

```
1. Reader clicks on gated project/sub-project
2. System checks reader_acknowledgments table
3. If not acknowledged:
   a. Display safety protocol modal
   b. User reads and confirms understanding
   c. System records acknowledgment with timestamp
   d. Content becomes accessible
4. If acknowledged:
   a. Display content immediately
```

**Database Storage:**
```sql
INSERT INTO reader_acknowledgments (
  user_id,
  workspace_owner_id,
  acknowledgment_type,
  acknowledgment_code,
  project_slug
) VALUES (
  'reader-uuid',
  'owner-uuid',
  'safety',
  'safety-v1.2.0',
  'plasma-ecology'
);
```

### 6.5 Safety Versioning

**Why versioning?**
- Safety protocols evolve (new hazards discovered, better practices)
- Readers must re-acknowledge updated protocols
- Audit trail of who acknowledged which version when

**Version Format:** `{type}-v{major}.{minor}.{patch}`
- Example: `safety-v1.2.0`
- Major bump: Requires re-acknowledgment
- Minor bump: Optional re-acknowledgment
- Patch bump: No re-acknowledgment needed

**Implementation:**
```typescript
// Check if user acknowledged latest version
const latestVersion = 'safety-v1.2.0';
const userAcknowledgment = await supabase
  .from('reader_acknowledgments')
  .select('acknowledgment_code')
  .eq('user_id', userId)
  .eq('project_slug', projectSlug)
  .eq('acknowledgment_type', 'safety')
  .single();

if (userAcknowledgment.acknowledgment_code !== latestVersion) {
  // Show re-acknowledgment modal
}
```

---

## 7. Collaboration Model

### 7.1 Distributed Git Workflow

**Personal ↔ Personal:**
```
Ali's Workspace (workspace-ali)
         ↓ fork
Sarah's Workspace (workspace-sarah)
         ↓ make changes
         ↓ submit PR
Ali's Workspace (reviews & merges)
```

**Personal → Commons:**
```
Ali's Personal Workspace
         ↓ completes research
         ↓ fork commons repo
         ↓ submit PR
Arc^ Commons Workspace
         ↓ human review
         ↓ automated validation
         ↓ merge if verified
Published to Arc^ Commons (authoritative)
```

### 7.2 Fork/PR Workflow

**Forking:**
1. User clicks "Fork to my workspace"
2. API forks GitHub repo
3. User works in their workspace
4. Changes tracked in their Git history

**Submitting PRs:**
1. User clicks "Submit to [workspace]"
2. API creates PR on target repo
3. Owner reviews changes
4. Owner merges or requests changes

**Implementation:**
```typescript
// Fork API
POST /api/repo/fork
{
  "templateOwner": "arc-plasma",
  "templateRepo": "arc-commons"
}
// Creates: user's fork at workspace-{username}

// Submit PR
POST /api/submit-pr
{
  "targetOwner": "arc-plasma",
  "targetRepo": "arc-commons",
  "sourceBranch": "main",
  "title": "Add plasma ecology research",
  "body": "..."
}
```

### 7.3 Contribution Attribution

**Git-native attribution:**
- All commits include author info
- PRs link to contributor profiles
- License files cite all contributors

**UI attribution:**
- Contributors list on project pages
- Author bylines on updates
- Acknowledgments in documentation

---

## 8. Technical Architecture Summary

### 8.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Astro + React | Static site generation, interactive components |
| **CMS** | Keystatic | Git-backed content editor |
| **Auth** | Supabase Auth | User authentication (GitHub OAuth) |
| **Database** | Supabase PostgreSQL | Metadata cache, safety logs |
| **Storage** | GitHub Repositories | Source of truth for all content |
| **Deployment** | Vercel | Hosting, serverless functions |
| **APIs** | Astro API routes | Custom backend logic |

### 8.2 Data Architecture

```
┌─────────────────────────────────────────────────┐
│              Vercel Deployment                   │
│  ┌──────────────────────────────────────────┐  │
│  │      Astro Application                    │  │
│  │  • SSG pages (public content)            │  │
│  │  • SSR pages (auth-required)             │  │
│  │  • API routes (Git operations)           │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                    ↓                    ↓
         ┌──────────┴──────────┐  ┌─────┴──────────┐
         │  GitHub Repository   │  │    Supabase    │
         │  (Source of Truth)   │  │   (Cache/Auth) │
         │  • Projects          │  │  • Auth        │
         │  • Sub-Projects      │  │  • Roles       │
         │  • Updates           │  │  • Cache       │
         │  • Data              │  │  • Safety Logs │
         └─────────────────────┘  └────────────────┘
```

### 8.3 Key Database Tables

| Table | Purpose | Owner | Reader |
|-------|---------|-------|--------|
| `workspace_settings` | Workspace config | ✅ Full | ❌ None |
| `user_roles` | Role assignments | ✅ Full | 👁️ View own |
| `project_cache` | Project metadata | ✅ Full | 👁️ View public/gated |
| `stream_cache` | Sub-project metadata | ✅ Full | 👁️ View public/gated |
| `user_repos` | GitHub tokens | ✅ Own | ❌ None |
| `reader_acknowledgments` | Safety tracking | 👁️ View all | ✅ Own |
| `reader_suggestions` | Comments system | ✅ Full | ✅ Own |
| `safety_acknowledgments` | (Legacy, may merge) | ✅ Full | ❌ None |

---

## 9. Design Principles

### 9.1 Guiding Values

1. **Autonomy**: Researchers own their data, infrastructure, and decisions
2. **Transparency**: All content changes tracked in Git, publicly auditable
3. **Safety**: Protocols and acknowledgments protect both owners and readers
4. **Collaboration**: Fork/PR workflow enables distributed teamwork
5. **Ethics**: License compliance, proper attribution, no extractivism
6. **Simplicity**: Minimal dependencies, understandable architecture
7. **Performance**: Static generation, edge caching, fast loads

### 9.2 Architectural Decisions

**Why self-hosted?**
- No vendor lock-in
- User owns their data
- Scales horizontally (each user = separate instance)
- Simplifies auth and permissions

**Why Git-first?**
- Industry-standard version control
- Fork/PR workflow familiar to developers
- Full audit trail
- Data portability

**Why Supabase cache?**
- Fast queries without GitHub API rate limits
- RLS policies enforce permissions at database level
- Realtime subscriptions for future features
- PostgreSQL = reliable, well-understood

**Why Keystatic?**
- Git-backed CMS (no database dependency)
- Works with Astro content collections
- Supports local and cloud storage
- Open source, actively maintained

---

## 10. Future Enhancements

### 10.1 Planned Features

**Hierarchical Sub-Projects:**
- Add `parent_subproject_id` to `stream_cache` table
- Support infinite nesting
- Breadcrumb navigation
- Tree view UI

**Commons Safety Registry:**
- Shared acknowledgment tracking across Commons workspaces
- No duplicate acknowledgments when submitting to Arc^
- Centralized safety protocol versioning

**Collaboration Tools:**
- In-app PR review
- Inline comments on content
- Contributor discovery
- Project recommendations

**Data Visualization:**
- Built-in chart generation
- Interactive plots
- Data analysis tools
- Export to CSV/JSON

### 10.2 Technical Debt

- Rename `stream_cache` → `subproject_cache` (requires migration)
- Merge `safety_acknowledgments` → `reader_acknowledgments`
- Add `parent_subproject_id` for hierarchy
- Implement cache invalidation webhooks
- Add automated testing for RLS policies

---

## Conclusion

The Workspace platform is built on principles of **autonomy, transparency, and ethical collaboration**. By combining self-hosted deployments, Git-backed content, and lightweight permissions, it enables researchers to own their work while collaborating freely.

**Core Architecture:**
- **Self-hosted**: Each researcher owns their deployment
- **Git-first**: Content lives in repositories (source of truth)
- **Role-based**: Owner controls workspace, readers access gated content
- **Safety-aware**: Acknowledgment system protects both owners and readers
- **Collaborative**: Fork/PR workflow enables distributed teamwork

**For implementation details, see:**
- [Data Structures](02_DATA_STRUCTURES.md) - Database schemas, file formats
- [Repository Structure](06_REPOSITORY_STRUCTURE.md) - Git repo organization
- [Keystatic Integration](05_Keystatic_Integration.md) - CMS configuration
- [Phase 1 Implementation](../current/01_Phase1_Git_First_MVP.md) - Development roadmap

---

**Document Version:** 1.0
**Last Updated:** November 7, 2025
**Next Review:** After Phase 1A completion
