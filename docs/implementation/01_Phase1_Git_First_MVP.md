# Phase 1: Git-First MVP Implementation Guide

**Version:** 2.0 (Updated for Self-Hosted Architecture)
**Last Updated:** November 7, 2025
**Status:** 🟡 In Progress (Owner Setup Wizard Phase)
**Estimated Duration:** 16-23 hours
**Target Completion:** End of Week 6
**Previous Version:** v1.0 (Nov 5, 2025) - See git history for nested structure approach

---

## Executive Summary

Phase 1 represents the fundamental architectural pivot from Supabase-centric data storage to a **self-hosted, Git-first architecture** using Keystatic CMS. This transformation ensures user data ownership, portability, version control, and true decentralization while maintaining the safety gating and authentication features that define Workspace.

### Core Principles

**1. Self-Hosted Deployment Model**
- Each researcher deploys their own independent workspace instance
- One owner per deployment (full control over their workspace)
- Optional reader accounts for content access (Phase 2)
- No shared infrastructure between users

**2. Git = Source of Truth, Supabase = Auth + Cache + Safety Logs**
- Content lives in user's GitHub repository
- Supabase handles authentication, caching, and safety tracking
- Owner has complete control over their data

**3. Owner/Reader Role System**
- **Owner:** Single user who deployed the workspace (full control, can use Keystatic CMS)
- **Readers:** Optional guest accounts for viewing content (Phase 2+)
- Owner-only routes: Keystatic editor, workspace settings, setup wizard

---

## Architecture Overview

### Before (Supabase-Centric)
```
User → Supabase Auth → Supabase Tables (projects, updates, sub-projects)
                     ↓
                  Astro Pages (render from DB)
```

### After (Self-Hosted Git-First)

**Infrastructure Layer (Self-Hosted):**
```
┌─────────────────────────────────────────────┐
│ Owner's Infrastructure (One per researcher) │
├─────────────────────────────────────────────┤
│ • Vercel Deployment (free tier)            │
│ • Supabase Project (free tier)             │
│ • GitHub OAuth App (personal)              │
│ • GitHub Repo (workspace-{username})       │
└─────────────────────────────────────────────┘
```

**Owner Content Creation Flow:**
```
Owner → Supabase Auth (owner role assigned automatically)
     ↓
     Owner Setup Wizard (4-step flow)
     ↓
     Keystatic CMS (owner-only access)
     ↓
     GitHub Repo (workspace-{username})
     ├─ content/projects/*.mdoc (flat structure)
     ├─ content/sub-projects/*.mdoc (with projectId relationship)
     └─ content/updates/*.mdoc (with projectId + subProjectId)
     ↓
     Publish Button → Draft branch → Main branch
     ↓
     Webhook → Supabase Cache Update
     ↓
     Public Workspace Pages (Astro, render from Git)
```

**Reader Access Flow (Phase 2):**
```
Reader → Lightweight Signup (email + name)
      ↓
      Supabase Auth (reader role)
      ↓
      Public Workspace Pages (read-only)
      ↓
      Safety Acknowledgments (tracked separately from owner)
      ↓
      Optional: Submit Suggestions (stored in reader_suggestions table)
```

---

## Phase 1 Deliverables

### 1. Infrastructure ✅ Must Have
- [x] Workspace template repository with **flat content structure**
- [x] Keystatic installed and configured with **flat collections using relationship fields**
- [x] GitHub OAuth token storage (encrypted in Supabase)
- [x] Fork-on-signup mechanism via GitHub API (template repo generation)
- [x] Draft/main branch workflow setup
- [ ] **Owner setup wizard** (4-step flow: Welcome → GitHub → Supabase → Repository)
- [x] Database tables: `workspace_settings`, `user_roles`, `reader_acknowledgments`, `reader_suggestions`

### 2. Core APIs ✅ Must Have
- [x] `/api/auth/github-connect` - Secondary GitHub OAuth for repo access
- [x] `/api/repo/fork` - Fork template repo for new users
- [x] `/api/publish` - Merge draft → main branches (owner-only)
- [x] `/api/webhooks/github` - Sync content changes to cache
- [ ] `/api/setup/check-owner` - Check if owner already exists for this deployment
- [ ] `/api/setup/complete` - Complete owner setup wizard (creates workspace_settings + user_role)
- Phase 2: `/api/reader/signup` - Reader account creation (lightweight guest accounts)
- Phase 2: `/api/acknowledgments/*` - Reader acknowledgment tracking
- Phase 2: `/api/suggestions/*` - Reader suggestions system

### 3. Supabase Schema Migration ✅ Must Have
- [x] `user_repos` table (link users to their workspace repos, includes webhook_id)
- [x] `project_cache` table (metadata for fast queries)
- [x] `subproject_cache` table (formerly `stream_cache` - flat sub-project metadata with projectId)
- [x] `safety_acknowledgments` table (owner safety tracking - already exists)
- [x] **`workspace_settings`** table (owner_id, workspace_name, repo_url, deployment_url)
- [x] **`user_roles`** table (user_id, role: 'owner' | 'reader', permissions matrix)
- [x] **`reader_acknowledgments`** table (separate from owner safety tracking)
- [x] **`reader_suggestions`** table (reader feedback system - Phase 2)
- [x] RLS policies updated for owner/reader permissions
- [x] Deprecate old `projects`, `updates`, `activities` tables

### 4. Content System ✅ Must Have
- [x] **Flat folder structure with relationship fields:**
  - `content/projects/*/project.mdoc`
  - `content/sub-projects/*/sub-project.mdoc` (with `projectId` relationship)
  - `content/updates/*/update.mdoc` (with `projectId` + `subProjectId` relationships)
- [x] **Terminology:** "sub-projects" (not "streams" - updated Nov 7, 2025)
- [x] Frontmatter schema for projects, sub-projects, updates (using Keystatic fields)
- [x] `.access.yml` parser and gating logic (owner safety tracking)
- [x] Keystatic UI integration (owner-only access)
- ⚠️ **Limitation:** Keystatic nested glob patterns (`*/*/`) don't work for content creation (documented workaround: flat structure)

### 5. Safety & Gating ✅ Must Have
- [x] Safety modal component (simple acknowledgment + link)
- [x] Middleware to check `.access.yml` before rendering
- [x] `/api/safety/acknowledge` endpoint (owner safety tracking)
- [x] Gating at project and sub-project levels
- Phase 2: Reader acknowledgment system (tracked separately in `reader_acknowledgments` table)

### 6. User Experience ✅ Must Have
- [ ] **Owner setup wizard** (4-step flow) - **TOP PRIORITY**
  - Step 1: Welcome (explain self-hosted model)
  - Step 2: Connect GitHub (OAuth, fork template repo)
  - Step 3: Connect Supabase (provide project URL & anon key)
  - Step 4: Complete (create workspace_settings, assign owner role)
- [x] Publish button with draft/main status indicator (owner-only)
- [ ] Keystatic editor embedded in workspace UI (owner-only)
- [ ] Content preview (draft vs published view)
- [ ] Basic dashboard showing cached project list
- Phase 2: Reader signup flow (lightweight email + name form)

### 7. Testing & Validation ✅ Must Have
- [ ] **Owner setup wizard flow** (4 steps, database updates, role assignment)
- [ ] **Owner role detection** (middleware checks, owner-only routes protected)
- [ ] Create test user → complete setup wizard → verify owner role assigned
- [ ] Edit project in Keystatic (flat structure) → verify Git commit to draft branch
- [ ] Test publish (draft → main merge, owner-only permission)
- [ ] Verify webhook updates cache (flat structure paths)
- [ ] Test safety gating with `.access.yml` (owner acknowledgments tracked)
- Phase 2: Reader signup flow testing

---

## Technical Requirements

### Self-Hosted Infrastructure (Owner Requirements)

**Each owner must have:**
- **Vercel Account** (free tier sufficient for MVP)
  - Deploy workspace application
  - Environment variables configured
- **Supabase Account** (free tier sufficient)
  - Create new project for their workspace
  - Configure auth providers (GitHub OAuth)
  - Run migrations for owner/reader tables
- **GitHub Account**
  - Create OAuth App for workspace
  - Fork workspace template repository
  - Configure webhook (optional for MVP, can use manual sync)
- **Domain** (optional for MVP, can use Vercel subdomain)

### Dependencies

#### New Packages to Install
```json
{
  "@keystatic/core": "^0.5.0",
  "@keystatic/astro": "^5.0.0",
  "octokit": "^3.1.0",
  "yaml": "^2.3.0",
  "gray-matter": "^4.0.3"
}
```

#### GitHub Requirements
- Personal Access Token (PAT) or GitHub App for template operations
- OAuth App configured with `repo` and `read:user` scopes
- Webhook endpoint registered (for production, optional for MVP)
- Template repository: `workspace-template` (public, forkable)

#### Supabase Requirements
- Edge Functions enabled (for webhook processing)
- Secrets configured: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- RLS policies for cache tables + owner/reader permissions
- Database tables: `workspace_settings`, `user_roles`, `reader_acknowledgments`, `reader_suggestions`

---

## Implementation Roadmap

### Phase 1.1: Setup & Infrastructure (4-6 hours)

#### Task 1.1.1: Create Workspace Template Repo
**Estimated Time:** 1 hour
**Prerequisites:** None

**Steps:**
1. Create new repo: `workspace-template` (standard naming for template repos)
2. Initialize with basic Astro structure
3. Add `content/` directory structure (**FLAT with relationship fields**):
   ```
   content/
     projects/
       example-project/
         project.mdoc          # Keystatic document with fields
         .access.yml           # Safety gating config
     sub-projects/
       example-subproject/
         sub-project.mdoc      # Has projectId relationship field
     updates/
       2025-11-07-first-update/
         update.mdoc           # Has projectId + subProjectId relationship fields
     notes/
       welcome.md
   ```
4. Create `main` and `draft` branches
5. Add `.gitignore` with appropriate exclusions
6. Create `README.md` with setup instructions (explain self-hosted model)

**Acceptance Criteria:**
- Template repo is public and forkable
- Uses **flat structure** (not nested `*/*/` patterns - Keystatic limitation)
- Both `main` and `draft` branches exist
- Example content renders correctly in Astro
- README explains self-hosted setup process

**Note:** Repo naming changed from `workspace-by-{username}` to standard `workspace-template` for template repos. Forked repos use `workspace-{username}` naming.

**Reference:** [08_content_structure_and_branch_workflow.md](../new/08_content_structure_and_branch_workflow.md)

---

#### Task 1.1.2: Install and Configure Keystatic
**Estimated Time:** 2 hours
**Prerequisites:** 1.1.1

**⚠️ CRITICAL: Keystatic Nested Pattern Limitation**
- Nested glob patterns like `content/projects/*/streams/*` **DO NOT WORK** for content creation
- Workaround: Use **flat collections** with relationship fields
- See [05_Keystatic_Integration.md v2.0](../architecture/05_Keystatic_Integration.md) for full details

**Steps:**
1. Install dependencies:
   ```bash
   npm install @keystatic/core @keystatic/astro
   ```

2. Create `keystatic.config.ts` in project root (**FLAT structure with relationships**):
   ```ts
   import { config, collection, fields } from '@keystatic/core';

   export default config({
     storage: {
       kind: 'github',
       repo: {
         owner: process.env.GITHUB_REPO_OWNER,
         name: process.env.GITHUB_REPO_NAME,
       },
       branchPrefix: 'draft',
     },
     collections: {
       projects: collection({
         label: 'Projects',
         path: 'content/projects/*/',  // ✅ FLAT - works for creation
         slugField: 'title',
         schema: {
           title: fields.text({ label: 'Project Title' }),
           visibility: fields.select({
             label: 'Visibility',
             options: [
               { label: 'Public', value: 'public' },
               { label: 'Gated', value: 'gated' },
               { label: 'Private', value: 'private' },
             ],
             defaultValue: 'public',
           }),
           gated: fields.checkbox({ label: 'Requires Safety Acknowledgment' }),
           body: fields.document({
             label: 'Description',
             formatting: true,
             links: true,
           }),
         },
       }),
       subProjects: collection({  // ✅ RENAMED from "streams"
         label: 'Sub-Projects',
         path: 'content/sub-projects/*/',  // ✅ FLAT - works for creation
         slugField: 'title',
         schema: {
           title: fields.text({ label: 'Sub-Project Title' }),
           projectId: fields.relationship({  // ✅ RELATIONSHIP field
             label: 'Parent Project',
             collection: 'projects',
             validation: { isRequired: true },
           }),
           gated: fields.checkbox({ label: 'Requires Safety Acknowledgment' }),
           body: fields.document({ label: 'Sub-Project Overview' }),
         },
       }),
       updates: collection({
         label: 'Updates',
         path: 'content/updates/*/',  // ✅ FLAT - works for creation
         format: { contentField: 'content' },
         schema: {
           date: fields.date({ label: 'Date' }),
           title: fields.text({ label: 'Title' }),
           projectId: fields.relationship({  // ✅ RELATIONSHIP field
             label: 'Project',
             collection: 'projects',
             validation: { isRequired: true },
           }),
           subProjectId: fields.relationship({  // ✅ OPTIONAL relationship
             label: 'Sub-Project (optional)',
             collection: 'subProjects',
             validation: { isRequired: false },
           }),
           content: fields.document({ label: 'Content' }),
         },
       }),
     },
   });
   ```

3. Add Keystatic to Astro config (`astro.config.mjs`):
   ```js
   import { defineConfig } from 'astro/config';
   import keystatic from '@keystatic/astro';

   export default defineConfig({
     integrations: [keystatic()],
   });
   ```

4. Create Keystatic admin route: `src/pages/keystatic/[...params].astro` (owner-only access)

**Acceptance Criteria:**
- Keystatic admin UI accessible at `/keystatic` (owner-only)
- Can create/edit projects, sub-projects, updates using **flat structure**
- Relationship fields work correctly (dropdowns show parent options)
- Changes commit to `draft` branch
- **No nested patterns** - all collections use flat paths

**Owner-Only Access:**
- Keystatic editor should only be accessible to the owner role
- Add middleware check: `if (user.role !== 'owner') redirect('/unauthorized')`

**Reference:** [05_Keystatic_Integration.md](../architecture/05_Keystatic_Integration.md) (to be created)

---

#### Task 1.1.3: GitHub OAuth Token Storage
**Estimated Time:** 1-2 hours
**Prerequisites:** Supabase auth working

**Steps:**
1. Create Supabase table:
   ```sql
   create table user_repos (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) unique not null,
     repo_url text not null,
     repo_owner text not null,
     repo_name text not null,
     github_token_encrypted text,
     created_at timestamp default now(),
     updated_at timestamp default now()
   );

   alter table user_repos enable row level security;

   create policy "Users can read own repo"
     on user_repos for select
     using (auth.uid() = user_id);

   create policy "Users can update own repo"
     on user_repos for update
     using (auth.uid() = user_id);
   ```

2. Create `/api/auth/github-connect.ts` endpoint
3. Implement token encryption using Supabase Vault or environment secret
4. Store token after successful OAuth flow

**Acceptance Criteria:**
- User can connect GitHub account
- Token stored encrypted in Supabase
- Token never exposed to client
- Session-based token retrieval for server operations

**Security Notes:**
- Use Supabase's `pgsodium` for encryption
- Tokens should have minimal scopes (`repo`, `read:user`)
- Implement token refresh logic if using GitHub Apps

---

#### Task 1.1.4: Fork-on-Signup + Owner Setup Wizard
**Estimated Time:** 3-4 hours (expanded to include setup wizard)
**Prerequisites:** 1.1.1, 1.1.3

**Integration with Owner Setup Wizard:**
- Fork creation is now part of the **4-step owner setup wizard**
- Check if owner already exists before allowing setup
- Only allow ONE owner per deployment

**Steps:**

1. Create `/api/setup/check-owner.ts`:
   ```ts
   export async function GET({ request }) {
     const { data: settings } = await supabase
       .from('workspace_settings')
       .select('owner_id')
       .single();

     return { hasOwner: !!settings };
   }
   ```

2. Create `/api/repo/fork.ts` (integrated into setup wizard):
   ```ts
   import { Octokit } from 'octokit';

   export async function POST({ request }) {
     const session = await getSession(request);

     // Check if owner already exists
     const { data: existingOwner } = await supabase
       .from('workspace_settings')
       .select('owner_id')
       .single();

     if (existingOwner) {
       return { error: 'Owner already exists for this deployment' };
     }

     const userToken = await getGitHubToken(session.user.id);
     const octokit = new Octokit({ auth: userToken });

     // Generate repo from template
     const { data: repo } = await octokit.repos.createUsingTemplate({
       template_owner: 'workspace-by-ali',  // Or from env
       template_repo: 'workspace-template',
       owner: session.user.user_metadata.user_name,
       name: `workspace-${session.user.user_metadata.user_name}`,  // ✅ Updated naming
       private: false,
       description: 'My personal research workspace',
     });

     // Store repo info in user_repos
     await supabase.from('user_repos').insert({
       user_id: session.user.id,
       repo_url: repo.html_url,
       repo_owner: repo.owner.login,
       repo_name: repo.name,
     });

     return { success: true, repo: repo.html_url };
   }
   ```

3. Create `/api/setup/complete.ts`:
   ```ts
   export async function POST({ request }) {
     const { workspaceName, repoUrl, deploymentUrl } = await request.json();
     const session = await getSession(request);

     // Create workspace_settings
     await supabase.from('workspace_settings').insert({
       owner_id: session.user.id,
       workspace_name: workspaceName,
       repo_url: repoUrl,
       deployment_url: deploymentUrl,
     });

     // Assign owner role
     await supabase.from('user_roles').insert({
       user_id: session.user.id,
       role: 'owner',
     });

     return { success: true };
   }
   ```

4. Create owner setup wizard flow (4 steps):
   - Step 1: Welcome & explain self-hosted model
   - Step 2: Connect GitHub (OAuth, fork template)
   - Step 3: Configure Supabase (provide project URL & anon key)
   - Step 4: Complete (create settings, assign owner role)

**Acceptance Criteria:**
- New user goes through 4-step setup wizard
- Only ONE owner can be created per deployment
- Repo has correct name format: `workspace-<username>` (updated from `workspace-by-<username>`)
- Both `main` and `draft` branches exist in fork
- `workspace_settings` created with owner_id
- `user_roles` entry created with role='owner'
- Owner role detected correctly in middleware

**Reference:** [09_claude_qa_implementation_answers.md](../new/09_claude_qa_implementation_answers.md) - Section 8

---

### Phase 1.2: Supabase Schema Migration (2-3 hours)

#### Task 1.2.1: Create Cache Tables + Owner/Reader Tables
**Estimated Time:** 2 hours (expanded to include owner/reader tables)
**Prerequisites:** None

**Note:** This migration was completed on Nov 6, 2025. Reference: `supabase/migrations/20241106000000_add_owner_reader_tables.sql`

**Steps:**
1. Run migration for cache tables + **4 new owner/reader tables**:
   ```sql
   -- Project metadata cache
   create table project_cache (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id),
     repo_url text not null,
     project_slug text not null,
     title text,
     visibility text check (visibility in ('public', 'gated', 'private')),
     gated boolean default false,
     last_updated timestamp,
     subproject_count int default 0,  -- ✅ UPDATED from stream_count
     synced_at timestamp default now(),
     unique(user_id, project_slug)
   );

   create index idx_project_cache_user on project_cache(user_id);
   create index idx_project_cache_visibility on project_cache(visibility);

   -- Sub-project metadata cache (formerly stream_cache)
   create table subproject_cache (  -- ✅ RENAMED from stream_cache
     id uuid primary key default gen_random_uuid(),
     project_id uuid references project_cache(id) on delete cascade,
     subproject_slug text not null,  -- ✅ RENAMED from stream_slug
     title text,
     gated boolean default false,
     update_count int default 0,
     last_updated timestamp,
     synced_at timestamp default now(),
     unique(project_id, subproject_slug)
   );

   create index idx_subproject_cache_project on subproject_cache(project_id);

   -- ✅ NEW: Workspace settings (owner configuration)
   create table workspace_settings (
     id uuid primary key default gen_random_uuid(),
     owner_id uuid references auth.users(id) unique not null,
     workspace_name text not null,
     repo_url text not null,
     deployment_url text,
     created_at timestamp default now(),
     updated_at timestamp default now()
   );

   create index idx_workspace_settings_owner on workspace_settings(owner_id);

   -- ✅ NEW: User roles (owner vs reader)
   create table user_roles (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) unique not null,
     role text check (role in ('owner', 'reader')) not null,
     created_at timestamp default now()
   );

   create index idx_user_roles_user on user_roles(user_id);

   -- ✅ NEW: Reader acknowledgments (separate from owner safety tracking)
   create table reader_acknowledgments (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) not null,
     safety_code text not null,
     acknowledged boolean default true,
     acknowledged_at timestamp default now(),
     unique(user_id, safety_code)
   );

   create index idx_reader_ack_user on reader_acknowledgments(user_id);

   -- ✅ NEW: Reader suggestions (Phase 2 feature)
   create table reader_suggestions (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) not null,
     project_slug text not null,
     suggestion text not null,
     status text check (status in ('pending', 'reviewed', 'accepted', 'rejected')) default 'pending',
     created_at timestamp default now()
   );

   create index idx_reader_suggestions_user on reader_suggestions(user_id);
   create index idx_reader_suggestions_status on reader_suggestions(status);
   ```

2. Enable RLS with **owner/reader permissions**:
   ```sql
   alter table project_cache enable row level security;
   alter table subproject_cache enable row level security;
   alter table workspace_settings enable row level security;
   alter table user_roles enable row level security;
   alter table reader_acknowledgments enable row level security;
   alter table reader_suggestions enable row level security;

   -- Public projects visible to all
   create policy "Public projects are visible to all"
     on project_cache for select
     using (visibility = 'public');

   -- Owner can see/edit all projects
   create policy "Owner can see all projects"
     on project_cache for select
     using (
       exists (
         select 1 from user_roles
         where user_roles.user_id = auth.uid()
         and user_roles.role = 'owner'
       )
     );

   -- Sub-projects inherit project visibility
   create policy "Sub-projects inherit project visibility"
     on subproject_cache for select
     using (
       exists (
         select 1 from project_cache
         where project_cache.id = subproject_cache.project_id
         and (
           exists (select 1 from user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'owner')
           or project_cache.visibility = 'public'
         )
       )
     );

   -- Owner-only access to workspace_settings
   create policy "Owner can read workspace settings"
     on workspace_settings for select
     using (auth.uid() = owner_id);

   create policy "Owner can update workspace settings"
     on workspace_settings for update
     using (auth.uid() = owner_id);

   -- Users can read own role
   create policy "Users can read own role"
     on user_roles for select
     using (auth.uid() = user_id);

   -- Readers can read/write own acknowledgments
   create policy "Readers can manage own acknowledgments"
     on reader_acknowledgments for all
     using (auth.uid() = user_id);

   -- Readers can create suggestions
   create policy "Readers can create suggestions"
     on reader_suggestions for insert
     with check (
       auth.uid() = user_id
       and exists (select 1 from user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'reader')
     );

   -- Owner can read all suggestions
   create policy "Owner can read suggestions"
     on reader_suggestions for select
     using (
       exists (select 1 from user_roles where user_roles.user_id = auth.uid() and user_roles.role = 'owner')
     );
   ```

**Acceptance Criteria:**
- All 7 tables created successfully (2 cache + 4 owner/reader + user_repos)
- RLS policies work correctly with owner/reader distinction
- Indexes improve query performance
- Foreign key constraints prevent orphaned data
- Owner role has full access, readers have limited access

**Reference:** [06_Supabase_Caching_Strategy.md](../architecture/06_Supabase_Caching_Strategy.md) (to be created)

---

#### Task 1.2.2: Deprecate Old Tables
**Estimated Time:** 30 minutes
**Prerequisites:** 1.2.1

**Steps:**
1. Export any important data from old tables (if needed)
2. Rename old tables with `_deprecated` suffix:
   ```sql
   alter table projects rename to projects_deprecated;
   alter table updates rename to updates_deprecated;
   alter table activities rename to activities_deprecated;
   ```

3. Update documentation to reflect deprecated status
4. Schedule deletion for 30 days later (after migration validated)

**Acceptance Criteria:**
- Old tables renamed, not dropped
- Data preserved for rollback if needed
- No application code references old tables

---

#### Task 1.2.3: Create GitHub Webhook Handler
**Estimated Time:** 1-2 hours
**Prerequisites:** 1.2.1

**Steps:**
1. Create Supabase Edge Function: `supabase/functions/github-webhook/index.ts` (**flat structure aware**):
   ```ts
   import { serve } from 'std/http/server.ts';
   import { createClient } from '@supabase/supabase-js';

   serve(async (req) => {
     const payload = await req.json();
     const event = req.headers.get('x-github-event');

     if (event === 'push') {
       const supabase = createClient(/* ... */);

       // Parse changed files
       const changedFiles = payload.commits.flatMap(c => [
         ...c.added,
         ...c.modified,
       ]);

       // Update cache for projects/sub-projects (FLAT structure)
       for (const file of changedFiles) {
         if (file.startsWith('content/projects/')) {
           await updateProjectCache(supabase, payload.repository, file);
         } else if (file.startsWith('content/sub-projects/')) {  // ✅ UPDATED
           await updateSubProjectCache(supabase, payload.repository, file);
         } else if (file.startsWith('content/updates/')) {
           await updateUpdateCache(supabase, payload.repository, file);
         }
       }
     }

     return new Response('OK', { status: 200 });
   });
   ```

2. Deploy edge function:
   ```bash
   supabase functions deploy github-webhook
   ```

3. Add webhook to template repo (and instruct users to add to their forks)

**Acceptance Criteria:**
- Webhook receives push events
- Cache updates automatically on content changes (flat structure paths)
- Handles errors gracefully
- Logs webhook activity for debugging
- Correctly parses `content/sub-projects/*` paths (not nested `*/streams/*`)

**Reference:** [09_claude_qa_implementation_answers.md](../new/09_claude_qa_implementation_answers.md) - Section 7

---

### Phase 1.3: Safety & Gating System (3-4 hours)

#### Task 1.3.1: Create `.access.yml` Parser
**Estimated Time:** 1 hour
**Prerequisites:** None

**Steps:**
1. Create utility: `src/utils/parseAccessConfig.ts`
   ```ts
   import yaml from 'yaml';

   interface AccessConfig {
     gated: boolean;
     required_acknowledgment?: string;
     risk_level?: 'low' | 'medium' | 'high';
     allowed_roles?: string[];
   }

   export async function parseAccessConfig(
     repoUrl: string,
     path: string
   ): Promise<AccessConfig | null> {
     try {
       const response = await fetch(
         `${repoUrl}/raw/main/${path}/.access.yml`
       );

       if (!response.ok) return null;

       const content = await response.text();
       return yaml.parse(content) as AccessConfig;
     } catch {
       return null;
     }
   }
   ```

2. Create helper to check access:
   ```ts
   export async function checkAccess(
     userId: string,
     accessConfig: AccessConfig
   ): Promise<boolean> {
     if (!accessConfig.gated) return true;

     const { data } = await supabase
       .from('safety_acknowledgments')
       .select('*')
       .eq('user_id', userId)
       .eq('safety_code', accessConfig.required_acknowledgment)
       .single();

     return !!data;
   }
   ```

**Acceptance Criteria:**
- Parser correctly reads `.access.yml` from GitHub
- Handles missing files gracefully
- Validates YAML structure
- Helper correctly checks acknowledgment status

**Reference:** [08_content_structure_and_branch_workflow.md](../new/08_content_structure_and_branch_workflow.md) - Section 3

---

#### Task 1.3.2: Safety Modal Component
**Estimated Time:** 1-2 hours
**Prerequisites:** None

**Steps:**
1. Create `src/components/SafetyModal.tsx`:
   ```tsx
   import { useState } from 'react';

   export function SafetyModal({ safetyCode, onAcknowledge }) {
     const [agreed, setAgreed] = useState(false);

     return (
       <div className="modal">
         <h2>⚠️ Safety Acknowledgment Required</h2>
         <p>
           This content involves potentially hazardous work.
           You must read and understand the safety documentation
           before continuing.
         </p>
         <a href={`/docs/safety/${safetyCode}`} target="_blank">
           View Safety Protocol
         </a>
         <label>
           <input
             type="checkbox"
             checked={agreed}
             onChange={(e) => setAgreed(e.target.checked)}
           />
           I have read and understood the safety protocols
         </label>
         <button
           disabled={!agreed}
           onClick={onAcknowledge}
         >
           Agree & Continue
         </button>
       </div>
     );
   }
   ```

2. Add API endpoint: `/api/safety/acknowledge.ts`
   ```ts
   export async function POST({ request }) {
     const { safetyCode } = await request.json();
     const session = await getSession(request);

     await supabase.from('safety_acknowledgments').insert({
       user_id: session.user.id,
       safety_code: safetyCode,
       acknowledged: true,
     });

     return { success: true };
   }
   ```

**Acceptance Criteria:**
- Modal displays when gated content accessed
- Link to safety docs works
- Checkbox must be checked to proceed
- Acknowledgment logged in Supabase
- User can access content after acknowledging

**Reference:** [09_claude_qa_implementation_answers.md](../new/09_claude_qa_implementation_answers.md) - Section 6

---

#### Task 1.3.3: Gating Middleware
**Estimated Time:** 1 hour
**Prerequisites:** 1.3.1, 1.3.2

**Steps:**
1. Update `src/middleware.ts` (with owner/reader role checks):
   ```ts
   export async function onRequest({ locals, request, redirect }) {
     const path = new URL(request.url).pathname;

     // Owner-only route protection
     if (path.startsWith('/keystatic') || path.startsWith('/setup') || path.startsWith('/settings')) {
       const userRole = await getUserRole(locals.session?.user.id);
       if (userRole !== 'owner') {
         return redirect('/unauthorized');
       }
     }

     // Check if route is gated (for content)
     if (path.startsWith('/projects/') || path.startsWith('/sub-projects/') || path.startsWith('/updates/')) {
       const accessConfig = await parseAccessConfig(
         locals.userRepo,
         path
       );

       if (accessConfig?.gated) {
         const hasAccess = await checkAccess(
           locals.session?.user.id,
           accessConfig
         );

         if (!hasAccess) {
           return redirect('/safety-gate?return=' + path);
         }
       }
     }

     return undefined;
   }
   ```

2. Create `/safety-gate` page that shows modal

**Acceptance Criteria:**
- Middleware runs on all project/sub-project routes (updated terminology)
- Owner-only routes protected (Keystatic, setup, settings)
- Redirects to gate if access denied
- Preserves return URL for redirect after acknowledgment
- Doesn't block public content

**Reference:** [07_Safety_Protocol_System.md](../architecture/07_Safety_Protocol_System.md) (to be created)

---

### Phase 1.4: Publish API (2 hours)

#### Task 1.4.1: Create Publish Endpoint
**Estimated Time:** 2 hours
**Prerequisites:** 1.1.3

**Steps:**
1. Create `/api/publish.ts`:
   ```ts
   import { Octokit } from 'octokit';

   export async function POST({ request }) {
     const session = await getSession(request);
     const { repo_owner, repo_name } = await getUserRepo(session.user.id);
     const token = await getGitHubToken(session.user.id);

     const octokit = new Octokit({ auth: token });

     try {
       // Merge draft into main
       const { data } = await octokit.repos.merge({
         owner: repo_owner,
         repo: repo_name,
         base: 'main',
         head: 'draft',
         commit_message: 'Publish updates from draft',
       });

       return { success: true, merge: data };
     } catch (error) {
       if (error.status === 409) {
         // Merge conflict
         return {
           success: false,
           error: 'merge_conflict',
           message: 'Please resolve conflicts manually'
         };
       }
       throw error;
     }
   }
   ```

2. Add publish button to dashboard UI

**Acceptance Criteria:**
- Endpoint merges draft → main successfully
- Handles merge conflicts gracefully
- Returns clear error messages
- Updates cache after successful merge

**Reference:** [09_claude_qa_implementation_answers.md](../new/09_claude_qa_implementation_answers.md) - Section 2

---

### Phase 1.5: UI Updates (3-4 hours)

#### Task 1.5.1: Embed Keystatic Editor
**Estimated Time:** 1 hour
**Prerequisites:** 1.1.2

**Steps:**
1. Create dashboard page with Keystatic iframe:
   ```astro
   ---
   // src/pages/dashboard.astro
   import Layout from '../layouts/Layout.astro';
   ---
   <Layout>
     <div class="dashboard">
       <h1>Content Editor</h1>
       <iframe
         src="/keystatic"
         style="width: 100%; height: calc(100vh - 200px);"
       />
     </div>
   </Layout>
   ```

2. Style integration to match brand

**Acceptance Criteria:**
- Keystatic editor accessible from dashboard
- Styling consistent with workspace brand
- Navigation between editor and preview works

---

#### Task 1.5.2: Publish Button & Status
**Estimated Time:** 1 hour
**Prerequisites:** 1.4.1

**Steps:**
1. Create publish component:
   ```tsx
   export function PublishButton() {
     const [status, setStatus] = useState<'draft' | 'publishing' | 'published'>('draft');

     async function handlePublish() {
       setStatus('publishing');
       const res = await fetch('/api/publish', { method: 'POST' });
       if (res.ok) {
         setStatus('published');
         setTimeout(() => setStatus('draft'), 3000);
       }
     }

     return (
       <button onClick={handlePublish} disabled={status === 'publishing'}>
         {status === 'draft' && '📤 Publish Changes'}
         {status === 'publishing' && '⏳ Publishing...'}
         {status === 'published' && '✅ Published!'}
       </button>
     );
   }
   ```

2. Add draft/published badge to content items

**Acceptance Criteria:**
- Publish button visible on dashboard
- Shows loading state during merge
- Displays success/error feedback
- Badge shows draft vs published status

---

#### Task 1.5.3: Dashboard with Cached Projects
**Estimated Time:** 1-2 hours
**Prerequisites:** 1.2.1

**Steps:**
1. Create dashboard page:
   ```astro
   ---
   const { data: projects } = await supabase
     .from('project_cache')
     .select('*')
     .eq('user_id', session.user.id);
   ---
   <div class="dashboard">
     <h1>My Projects</h1>
     <div class="project-grid">
       {projects.map(p => (
         <ProjectCard
           title={p.title}
           visibility={p.visibility}
           streamCount={p.stream_count}
           lastUpdated={p.last_updated}
           href={`/projects/${p.project_slug}`}
         />
       ))}
     </div>
   </div>
   ```

**Acceptance Criteria:**
- Dashboard loads quickly (from cache, not Git)
- Shows all user projects
- Links to project detail pages work
- Displays project metadata correctly

---

### Phase 1.6: Testing & Validation (2-3 hours)

#### Task 1.6.1: End-to-End User Flow Test
**Estimated Time:** 1 hour
**Prerequisites:** All previous tasks

**Test Cases:**
1. New user signup → repo fork → onboarding complete
2. User creates project in Keystatic → commit to draft
3. User publishes → draft merged to main
4. Webhook fires → cache updated
5. Project appears on dashboard
6. User accesses gated content → safety modal → acknowledge → access granted

**Acceptance Criteria:**
- All test cases pass
- No console errors
- Performance acceptable (<3s page loads)

---

#### Task 1.6.2: Performance Validation
**Estimated Time:** 1 hour
**Prerequisites:** 1.6.1

**Metrics to Test:**
- Dashboard load time (target: <1s)
- Project detail load time (target: <2s)
- Keystatic editor responsiveness
- Publish operation time (target: <5s)
- Webhook processing time (target: <10s)

**Acceptance Criteria:**
- All metrics meet targets
- No GitHub API rate limit issues
- Supabase queries optimized with indexes

---

#### Task 1.6.3: Documentation Update
**Estimated Time:** 1 hour
**Prerequisites:** All implementation complete

**Documents to Update:**
1. README.md - Add Git-first architecture overview
2. docs/README.md - Update navigation
3. Create user guide for Keystatic
4. Create developer setup guide
5. Update MASTER_TASKLIST.md progress

**Acceptance Criteria:**
- All docs accurately reflect new architecture
- Setup guide tested by another developer
- User guide explains key workflows

---

## Success Metrics

### Technical Metrics
- [ ] Template repo exists and is public
- [ ] Keystatic configured with **3 flat collections** (projects, sub-projects, updates) using **relationship fields**
- [ ] **Owner setup wizard** completes successfully (4 steps, <2 minutes)
- [ ] **Owner role** automatically assigned on first deployment
- [ ] **workspace_settings** created with correct owner_id
- [ ] New users get forked repo within 30 seconds
- [ ] Publish operation completes without errors (owner-only)
- [ ] Webhook updates cache within 10 seconds (flat structure paths)
- [ ] Safety gating works at project and sub-project levels
- [ ] No GitHub token exposure to client

### Owner/Reader Role Metrics
- [ ] **Owner role detected** correctly in middleware
- [ ] **Owner-only routes protected** (Keystatic, settings, setup)
- [ ] Only ONE owner can be created per deployment
- [ ] Reader accounts can be created (Phase 2)
- [ ] RLS policies enforce owner/reader permissions

### User Experience Metrics
- [ ] **Owner setup wizard** is clear and completes in <2 minutes
- [ ] Owner can create projects/sub-projects without CLI knowledge (using Keystatic)
- [ ] Owner can publish content with one button click
- [ ] Dashboard loads in <1 second
- [ ] Safety modal is clear and actionable
- [ ] Keystatic editor is intuitive (owner-only access)

### Quality Metrics
- [ ] Zero Supabase data storage for content (only auth/cache/safety/settings)
- [ ] Git remains source of truth
- [ ] RLS policies prevent unauthorized access (owner/reader distinction)
- [ ] All API endpoints have error handling
- [ ] Edge cases documented
- [ ] **Flat structure** documented with Keystatic limitation warning

---

## Dependencies & Prerequisites

### Self-Hosted Infrastructure (Per Owner)
**Each owner deploying their own workspace needs:**

#### Owner Requirements
- **GitHub Account**
  - OAuth app configured (for Keystatic integration)
  - Fork of workspace-template repository
  - Webhook configured (optional for MVP, can use manual sync)
- **Supabase Account** (free tier sufficient)
  - New project created for their workspace
  - Auth providers configured (GitHub OAuth)
  - Migrations run (owner/reader tables)
  - Edge Functions enabled
- **Vercel Account** (free tier sufficient)
  - Deploy workspace application
  - Environment variables configured
  - Domain configured (optional, can use `.vercel.app` subdomain)

#### Shared Template Repository
- `workspace-template` repo created and public (maintained by Ali)
- Template includes all necessary files
- Both `main` and `draft` branches
- Branch protection rules on `main` (optional)

### Development Environment
- Node.js 18+
- Git configured
- Supabase CLI installed
- GitHub CLI (optional but helpful)

**Note:** This is a **self-hosted model** - each researcher runs their own deployment, not a shared multi-tenant platform.

---

## Migration Path from Current State

### Current State Assessment (Nov 7, 2025)
- Supabase auth ✅ working
- **Nov 6 database migration ✅ completed**
  - `workspace_settings`, `user_roles`, `reader_acknowledgments`, `reader_suggestions` tables created
  - RLS policies implemented for owner/reader permissions
  - All triggers and indexes working
- **Terminology updated ✅** (streams → sub-projects, Nov 7)
  - Database: `subproject_cache` table created
  - Code: All references updated (21+ files)
  - Content: `content/subprojects/` folder renamed
- Old Supabase tables contain test data only
- No production content to migrate
- UI exists but references old data structure

### What's Left to Implement

#### Phase 1A (Current - Owner Setup Wizard)
1. **Owner setup wizard** (4-step flow)
   - Welcome page (explain self-hosted model)
   - GitHub connection (OAuth, fork template)
   - Supabase configuration (project URL, anon key)
   - Complete setup (create workspace_settings, assign owner role)
2. **Owner role detection** in middleware
3. **Owner-only route protection** (Keystatic, settings, setup)

#### Phase 1B (Keystatic + Flat Structure)
4. Update Keystatic config to **flat collections** with relationship fields
5. Update content structure to flat folders
6. Test content creation with relationship fields

#### Phase 2+ (Reader Features)
7. Reader signup flow (lightweight guest accounts)
8. Reader acknowledgment tracking
9. Reader suggestions system

### Migration Steps for Remaining Work
1. ✅ **Database migration completed** (Nov 6)
2. ✅ **Terminology updated** (Nov 7)
3. ⏳ **Implement owner setup wizard** (Phase 1A - in progress)
4. ⏳ Update Keystatic config to flat structure (Phase 1B)
5. ⏳ Update middleware with owner role checks
6. ⏳ Test end-to-end owner flow
7. Phase 2: Implement reader features

---

## Risk Mitigation

### Risk: Keystatic Nested Pattern Limitation ✅ RESOLVED
**Likelihood:** High → **Resolved (Nov 7, 2025)**
**Impact:** Critical
**Resolution:**
- ✅ Discovered nested glob patterns (`*/*/`) don't work for content creation in Keystatic
- ✅ Adopted **flat structure with relationship fields** as workaround
- ✅ Documented in [05_Keystatic_Integration.md v2.0](../architecture/05_Keystatic_Integration.md)
- ✅ All collections updated to flat paths with relationship fields
- **Performance benefit:** Flat structure is actually FASTER than nested structure

### Risk: Owner Setup Wizard UX
**Likelihood:** Medium
**Impact:** High
**Mitigation:**
- Clear step-by-step wizard (4 steps with progress indicator)
- Validation at each step (prevent incomplete setup)
- Helpful error messages (e.g., "Supabase project URL must start with https://")
- Test with non-technical users
- Provide video walkthrough (future)

### Risk: GitHub API Rate Limits
**Likelihood:** Medium
**Impact:** Medium
**Mitigation:**
- Cache aggressively in Supabase
- Minimize direct GitHub API calls from client
- Use webhook for cache sync (vs polling)
- Consider GitHub App for higher limits

### Risk: Merge Conflicts in Draft → Main
**Likelihood:** Low (single user per repo)
**Impact:** Medium
**Mitigation:**
- Clear error messages
- Link to GitHub conflict resolution UI
- Consider auto-merge only if fast-forward possible
- Document conflict resolution process

### Risk: Token Security
**Likelihood:** Low
**Impact:** Critical
**Mitigation:**
- Encrypt tokens in Supabase
- Use minimal OAuth scopes
- Implement token rotation
- Never expose tokens client-side
- Use Supabase RLS for token access

---

## Next Steps After Phase 1

### Phase 2: Reader Features (Weeks 7-8) - **PRIORITIZED**
1. **Reader signup implementation**
   - Lightweight guest accounts (email + name)
   - Reader role assignment
   - Read-only access to public workspace content
2. **Reader acknowledgment tracking**
   - Separate from owner safety tracking
   - Stored in `reader_acknowledgments` table
3. **Reader suggestion system**
   - Submit feedback/suggestions to owner
   - Stored in `reader_suggestions` table
   - Owner can review/respond (dashboard)
4. **Then:** Commons integration
   - Commons discovery/registry
   - Fork + contribute workflow

### Phase 3: Advanced Features (Weeks 9-12)
- Multi-collaborator permissions (beyond owner/reader)
- Advanced safety protocols (quizzes, versioning)
- Data visualization integrations
- Export/backup tools
- Commons maintainer dashboard

### Phase 4: Polish & Launch (Weeks 13-16)
- Performance optimization
- Mobile responsive design
- Comprehensive user testing
- Public beta launch

**Note:** Reader features prioritized over Commons because they provide immediate value to individual workspace owners and establish the permission model needed for Commons.

---

## Questions & Clarifications

### Resolved (Original - Nov 5, 2025)
- ✅ Commons structure (separate repos, not folders)
- ✅ Merge strategy (direct GitHub API merge)
- ✅ Keystatic vs forms (both coexist)
- ✅ No Git LFS needed for MVP
- ✅ Simple safety modal (no quiz)
- ✅ Cache schema defined
- ✅ Fork-on-signup flow confirmed

### Resolved (Architecture Refactoring - Nov 6-7, 2025)
- ✅ **Self-hosted deployment model** confirmed (Nov 6)
  - Each researcher deploys their own independent workspace
  - One owner per deployment
  - No shared multi-tenant infrastructure
- ✅ **Owner/reader role system** confirmed (Nov 6)
  - Owner: Single user who deployed the workspace (full control)
  - Reader: Lightweight guest accounts for content access (Phase 2)
  - RLS policies enforce permissions
- ✅ **Flat content structure with relationship fields** confirmed (Nov 7)
  - Keystatic nested glob patterns (`*/*/`) don't work for content creation
  - Workaround: Flat collections with relationship fields
  - Documented in 05_Keystatic_Integration.md v2.0
- ✅ **Terminology change** confirmed (Nov 7)
  - "streams" → "sub-projects" throughout codebase
  - Database table: `subproject_cache`
  - Content folder: `content/sub-projects/`
- ✅ **Repository naming** standardized (Nov 7)
  - Template repo: `workspace-template`
  - Forked repos: `workspace-{username}` (not `workspace-by-{username}`)

### Open Questions
_None - all major architectural decisions resolved_

---

## Appendix: Command Reference

### Useful Commands
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Deploy Supabase function
supabase functions deploy github-webhook

# Test webhook locally
supabase functions serve github-webhook

# Run database migrations
supabase db push

# Create new Supabase migration
supabase migration new <name>

# Test GitHub API (using gh CLI)
gh api repos/workspace-by-ali/workspace-template
```

---

**Author:** Claude + Ali + Lumen
**Status:** Living Document
**Feedback:** Please update as implementation progresses
