# 06_Supabase Caching Strategy

**Version:** 1.0
**Last Updated:** November 5, 2025
**Status:** 🟡 Design Complete, Implementation Pending

---

## Overview

In the Git-first architecture, **Git repositories are the source of truth** for all content. However, reading directly from GitHub for every request would be slow and quickly hit API rate limits. This document defines how Supabase serves as a **lightweight metadata cache** to enable fast dashboard rendering and content discovery while keeping Git as the authoritative data source.

---

## Principles

### 1. Git is Source of Truth
- All content (projects, streams, updates) stored in Git repos
- Cache can be rebuilt from Git at any time
- Cache never contains content that doesn't exist in Git

### 2. Cache = Metadata Only
- Store titles, slugs, visibility, counts, timestamps
- **Do not** store full markdown content or large blobs
- Keep cache rows small and queryable

### 3. Eventually Consistent
- Cache may lag behind Git by a few seconds (webhook delay)
- This is acceptable for non-critical operations
- Real-time data fetched directly from Git when needed

### 4. Performance Targets
- Dashboard loads: <1 second (from cache)
- Project detail pages: <2 seconds (from Git)
- Webhook sync: <10 seconds (cache updated)

---

## What to Cache vs. What to Fetch from Git

| Data Type | Cache | Fetch from Git | Reason |
|-----------|-------|----------------|--------|
| Project titles | ✅ | | Fast dashboard rendering |
| Project descriptions | ❌ | ✅ | Could be large, rarely shown in lists |
| Project metadata (visibility, gated) | ✅ | | Needed for access control |
| Stream titles | ✅ | | Fast navigation |
| Stream counts | ✅ | | Show "X streams" without reading Git |
| Update titles | ⚠️ Optional | ✅ | Can cache for search, but not required |
| Update content | ❌ | ✅ | Always fetch from Git |
| Full markdown body | ❌ | ✅ | Too large for cache |
| Images | ❌ | ✅ | Served from Git or CDN |
| `.access.yml` | ⚠️ Optional | ✅ | Small, can cache for faster gating checks |

**Rule of Thumb:** Cache what you need for **lists and filters**, fetch from Git for **detail views**.

---

## Cache Schema

### `user_repos` Table

**Purpose:** Link users to their workspace repositories

```sql
create table user_repos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) unique not null,
  repo_url text not null,
  repo_owner text not null,
  repo_name text not null,
  github_token_encrypted text, -- Encrypted using pgsodium
  webhook_id bigint, -- GitHub webhook ID
  webhook_active boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Indexes
create index idx_user_repos_user_id on user_repos(user_id);

-- RLS Policies
alter table user_repos enable row level security;

create policy "Users can read own repo"
  on user_repos for select
  using (auth.uid() = user_id);

create policy "Users can update own repo"
  on user_repos for update
  using (auth.uid() = user_id);
```

**Columns:**
- `id`: Primary key
- `user_id`: Reference to Supabase auth user
- `repo_url`: Full GitHub URL (e.g., `https://github.com/username/workspace-by-username`)
- `repo_owner`: GitHub username
- `repo_name`: Repository name
- `github_token_encrypted`: Encrypted GitHub OAuth token (for API operations)
- `webhook_id`: GitHub webhook ID (for cleanup)
- `webhook_active`: Whether webhook is configured
- `created_at`: When user connected repo
- `updated_at`: Last modified timestamp

---

### `project_cache` Table

**Purpose:** Store project metadata for fast queries

```sql
create table project_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  repo_url text not null,
  project_slug text not null,
  title text,
  visibility text check (visibility in ('public', 'gated', 'private')),
  gated boolean default false,
  safety_code text, -- Required acknowledgment code
  stream_slug text, -- Primary stream (e.g., 'plasma', 'biology')
  tags text[], -- Array of tags
  status text check (status in ('draft', 'active', 'archived')),
  start_date date,
  last_updated timestamp,
  stream_count int default 0,
  update_count int default 0, -- Total updates across all streams
  synced_at timestamp default now(),

  unique(user_id, project_slug)
);

-- Indexes
create index idx_project_cache_user on project_cache(user_id);
create index idx_project_cache_visibility on project_cache(visibility);
create index idx_project_cache_stream on project_cache(stream_slug);
create index idx_project_cache_tags on project_cache using gin(tags);
create index idx_project_cache_last_updated on project_cache(last_updated desc);

-- RLS Policies
alter table project_cache enable row level security;

-- Public projects visible to all
create policy "Public projects are visible to all"
  on project_cache for select
  using (visibility = 'public');

-- Users can see own projects (any visibility)
create policy "Users can see own projects"
  on project_cache for select
  using (auth.uid() = user_id);

-- Users can insert/update own projects
create policy "Users can modify own projects"
  on project_cache for all
  using (auth.uid() = user_id);
```

**Key Fields:**
- `project_slug`: Derived from directory name (e.g., `plasma-design`)
- `visibility`: Access level (public, gated, private)
- `gated`: Quick boolean check for gating
- `safety_code`: Which safety protocol required (e.g., `plasma_safety_v1.3`)
- `stream_count`: How many streams under this project
- `update_count`: Total updates (for "X updates" badge)
- `synced_at`: When cache was last updated (for staleness detection)

---

### `stream_cache` Table

**Purpose:** Store stream metadata for nested navigation

```sql
create table stream_cache (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references project_cache(id) on delete cascade,
  stream_slug text not null,
  title text,
  gated boolean default false,
  safety_code text,
  start_date date,
  last_updated timestamp,
  update_count int default 0,
  synced_at timestamp default now(),

  unique(project_id, stream_slug)
);

-- Indexes
create index idx_stream_cache_project on stream_cache(project_id);
create index idx_stream_cache_last_updated on stream_cache(last_updated desc);

-- RLS Policies
alter table stream_cache enable row level security;

-- Streams inherit project visibility
create policy "Streams inherit project visibility"
  on stream_cache for select
  using (
    exists (
      select 1 from project_cache
      where project_cache.id = stream_cache.project_id
      and (
        project_cache.user_id = auth.uid()
        or project_cache.visibility = 'public'
      )
    )
  );

-- Users can modify streams under own projects
create policy "Users can modify own streams"
  on stream_cache for all
  using (
    exists (
      select 1 from project_cache
      where project_cache.id = stream_cache.project_id
      and project_cache.user_id = auth.uid()
    )
  );
```

**Key Fields:**
- `project_id`: Foreign key to parent project
- `stream_slug`: Derived from directory name (e.g., `pollution-degradation`)
- `gated`: Stream-level gating (inherits from project if not set)
- `update_count`: Number of updates in this stream

---

### Optional: `update_cache` Table

**Purpose:** Cache update titles for search/filtering (Phase 2+)

```sql
-- Optional: Can defer to Phase 2
create table update_cache (
  id uuid primary key default gen_random_uuid(),
  stream_id uuid references stream_cache(id) on delete cascade,
  update_slug text not null,
  title text,
  date date not null,
  type text check (type in ('experiment', 'observation', 'milestone', 'note')),
  tags text[],
  synced_at timestamp default now(),

  unique(stream_id, update_slug)
);

create index idx_update_cache_stream on update_cache(stream_id);
create index idx_update_cache_date on update_cache(date desc);
create index idx_update_cache_tags on update_cache using gin(tags);
```

**Note:** For MVP, we may skip caching updates and fetch directly from Git. Only cache if search/filter performance becomes an issue.

---

## Cache Population Strategy

### Initial Sync (On Repo Connect)

When user connects/forks a repository:

1. **POST `/api/repo/fork`** creates repo and stores in `user_repos`
2. **Immediate initial sync:**
   - Read `content/projects/*/README.md` files
   - Parse frontmatter
   - Insert rows into `project_cache`
   - Read `content/projects/*/streams/*/README.md` files
   - Insert rows into `stream_cache`

**Implementation:**
```ts
// src/lib/sync.ts
export async function initialCacheSync(userId: string, repoInfo: RepoInfo) {
  const octokit = new Octokit({ auth: repoInfo.token });

  // Get all project README files
  const { data: tree } = await octokit.git.getTree({
    owner: repoInfo.owner,
    repo: repoInfo.name,
    tree_sha: 'main', // Sync from published branch
    recursive: true,
  });

  const projectFiles = tree.tree.filter(
    f => f.path?.match(/^content\/projects\/[^\/]+\/README\.md$/)
  );

  for (const file of projectFiles) {
    const content = await fetchFileContent(octokit, repoInfo, file.path);
    const { data: frontmatter } = matter(content);

    await supabase.from('project_cache').upsert({
      user_id: userId,
      repo_url: repoInfo.url,
      project_slug: extractSlug(file.path, 'project'),
      title: frontmatter.title,
      visibility: frontmatter.visibility,
      gated: frontmatter.gated,
      // ... other fields
    });
  }

  // Repeat for streams
  // ...
}
```

---

### Incremental Sync (Via Webhooks)

When user pushes to GitHub:

1. **GitHub webhook fires** → POST `/api/webhooks/github`
2. **Parse webhook payload:**
   - Identify changed files (added, modified, removed)
   - Filter for content files only
3. **Update cache incrementally:**
   - For modified project READMEs → update `project_cache` row
   - For new projects → insert `project_cache` row
   - For deleted projects → delete from cache
   - Same for streams

**Implementation:**
```ts
// Supabase Edge Function: supabase/functions/github-webhook/index.ts
import { serve } from 'std/http/server.ts';
import { Octokit } from 'octokit';

serve(async (req) => {
  const payload = await req.json();
  const event = req.headers.get('x-github-event');

  // Verify webhook signature
  if (!verifySignature(req, payload)) {
    return new Response('Invalid signature', { status: 401 });
  }

  if (event !== 'push') {
    return new Response('OK', { status: 200 });
  }

  // Only sync from main branch (published content)
  if (payload.ref !== 'refs/heads/main') {
    return new Response('Ignoring non-main push', { status: 200 });
  }

  const changedFiles = payload.commits.flatMap(c => [
    ...c.added.map(f => ({ path: f, action: 'added' })),
    ...c.modified.map(f => ({ path: f, action: 'modified' })),
    ...c.removed.map(f => ({ path: f, action: 'removed' })),
  ]);

  for (const { path, action } of changedFiles) {
    if (path.match(/^content\/projects\/([^\/]+)\/README\.md$/)) {
      await syncProject(payload.repository, path, action);
    }
    if (path.match(/^content\/projects\/([^\/]+)\/streams\/([^\/]+)\/README\.md$/)) {
      await syncStream(payload.repository, path, action);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

async function syncProject(repo, filePath, action) {
  if (action === 'removed') {
    // Delete from cache
    await supabase.from('project_cache').delete().match({
      repo_url: repo.html_url,
      project_slug: extractSlug(filePath, 'project'),
    });
    return;
  }

  // Fetch file content from GitHub
  const octokit = new Octokit();
  const content = await fetchFileContent(octokit, repo, filePath);
  const { data: frontmatter } = matter(content);

  // Upsert to cache
  await supabase.from('project_cache').upsert({
    // Find user_id from repo_url
    user_id: await getUserIdFromRepo(repo.html_url),
    repo_url: repo.html_url,
    project_slug: extractSlug(filePath, 'project'),
    title: frontmatter.title,
    visibility: frontmatter.visibility,
    gated: frontmatter.gated,
    // ... other fields
    synced_at: new Date().toISOString(),
  });
}
```

**Webhook Processing Time:** Target <10 seconds from push to cache update.

---

## Cache Invalidation

### When to Invalidate

1. **User publishes (draft → main merge):** Webhook fires, cache updated
2. **Direct Git commit (advanced users):** Webhook fires, cache updated
3. **Manual force refresh:** User clicks "Refresh" button → re-sync entire repo

### Handling Stale Cache

**Problem:** What if webhook fails or is delayed?

**Solution: Staleness detection**

```ts
// Check if cache is stale
const STALE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

const { data: project } = await supabase
  .from('project_cache')
  .select('synced_at')
  .eq('project_slug', slug)
  .single();

const isStale = Date.now() - new Date(project.synced_at).getTime() > STALE_THRESHOLD;

if (isStale) {
  // Fetch from Git and update cache
  await syncProjectFromGit(project);
}
```

**UI Indicator:**
```tsx
{isStale && (
  <span title="Data may be out of sync">⚠️ Syncing...</span>
)}
```

---

## Query Patterns

### Dashboard: List User's Projects

```ts
const { data: projects } = await supabase
  .from('project_cache')
  .select('*')
  .eq('user_id', session.user.id)
  .order('last_updated', { ascending: false });
```

**Performance:** <100ms (indexed query)

---

### Discover Page: List Public Projects

```ts
const { data: projects } = await supabase
  .from('project_cache')
  .select('*')
  .eq('visibility', 'public')
  .order('last_updated', { ascending: false })
  .limit(50);
```

**Performance:** <200ms (indexed query)

---

### Filter by Stream

```ts
const { data: projects } = await supabase
  .from('project_cache')
  .select('*')
  .eq('stream_slug', 'plasma')
  .eq('visibility', 'public')
  .order('last_updated', { ascending: false });
```

**Performance:** <150ms (indexed query)

---

### Search by Tags

```ts
const { data: projects } = await supabase
  .from('project_cache')
  .select('*')
  .contains('tags', ['experiment', 'water-treatment'])
  .eq('visibility', 'public');
```

**Performance:** <200ms (GIN index on tags array)

---

### Project Detail: Get Streams

```ts
const { data: streams } = await supabase
  .from('stream_cache')
  .select('*')
  .eq('project_id', projectId)
  .order('last_updated', { ascending: false });
```

**Performance:** <100ms (indexed query)

---

### Counts for Dashboard Stats

```ts
const { count: projectCount } = await supabase
  .from('project_cache')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', session.user.id);

const { data: totalUpdates } = await supabase
  .from('project_cache')
  .select('update_count')
  .eq('user_id', session.user.id);

const totalUpdateCount = totalUpdates.reduce((sum, p) => sum + p.update_count, 0);
```

**Performance:** <200ms (count queries optimized with indexes)

---

## Performance Optimization

### 1. Indexes

Already defined in schema above. Key indexes:
- `user_id` (most queries filter by user)
- `visibility` (for public discovery)
- `stream_slug` (for filtering by stream)
- `tags` (GIN index for array queries)
- `last_updated` (for sorting)

### 2. RLS Policies

Row-Level Security policies ensure:
- Users only see own + public projects
- No unauthorized access to private projects
- Efficient policy evaluation with indexes

### 3. Pagination

For large result sets:

```ts
const pageSize = 20;
const page = 2;

const { data: projects } = await supabase
  .from('project_cache')
  .select('*')
  .eq('visibility', 'public')
  .order('last_updated', { ascending: false })
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

### 4. Partial Selects

Only fetch needed columns:

```ts
// For list view, don't need all fields
const { data: projects } = await supabase
  .from('project_cache')
  .select('id, title, project_slug, visibility, last_updated, stream_count')
  .eq('user_id', session.user.id);
```

---

## Cache vs. Git Decision Tree

```
Is this a list/dashboard view?
├─ YES → Use cache
└─ NO → Is this a detail page?
    ├─ YES → Fetch from Git
    └─ NO → Is this for search/filter?
        ├─ YES → Use cache
        └─ NO → Is data critical (security)?
            ├─ YES → Fetch from Git (fresh)
            └─ NO → Use cache if available
```

### Examples

| Use Case | Data Source | Reason |
|----------|-------------|--------|
| Dashboard project list | Cache | Fast, updated via webhook |
| Project README content | Git | Full content not cached |
| "5 projects in plasma stream" badge | Cache | Count query |
| Safety gating check | Git (`.access.yml`) | Security-critical |
| Search projects by tag | Cache | Fast filtering |
| Render update markdown | Git | Content not cached |

---

## Monitoring & Debugging

### Cache Health Metrics

Track these metrics:

1. **Sync latency:** Time from webhook to cache update
2. **Cache hit rate:** % of queries served from cache (target: >95%)
3. **Stale entries:** Number of entries older than 5 minutes
4. **Failed syncs:** Webhook processing errors

### Debugging Tools

```sql
-- Find stale cache entries
select
  project_slug,
  title,
  synced_at,
  extract(epoch from (now() - synced_at)) as seconds_old
from project_cache
where synced_at < now() - interval '5 minutes'
order by synced_at desc;

-- Count projects per user
select
  u.email,
  count(p.id) as project_count
from auth.users u
left join project_cache p on p.user_id = u.id
group by u.id, u.email
order by project_count desc;

-- Check webhook sync status
select
  repo_url,
  webhook_active,
  updated_at
from user_repos
where webhook_active = false;
```

---

## Security Considerations

### 1. RLS Policies

Supabase RLS ensures:
- Users can't read other users' private projects
- Cache queries automatically filtered by auth context
- No need for manual permission checks in application code

### 2. Token Encryption

GitHub tokens stored encrypted:

```sql
-- Using pgsodium (Supabase built-in)
insert into user_repos (user_id, github_token_encrypted)
values (
  auth.uid(),
  pgsodium.crypto_secretbox_noncegen(token_plaintext, key_id)
);

-- Decrypt only when needed
select
  pgsodium.crypto_secretbox_open(github_token_encrypted, key_id)
from user_repos
where user_id = auth.uid();
```

### 3. Cache Poisoning Prevention

- Only webhook with valid signature can update cache
- Users cannot directly modify cache (only via Git → webhook)
- Malicious frontmatter can't bypass RLS policies

---

## Migration & Rollback

### Migrate from Supabase-Centric to Git-First

For existing users with data in old tables:

```sql
-- Export old data
copy (
  select * from projects_deprecated
) to '/tmp/projects_export.csv' csv header;

-- Users manually migrate by:
-- 1. Creating content files in Git
-- 2. Pushing to repo
-- 3. Webhook populates cache
```

**Note:** Ali confirmed no production data exists, so migration not needed for MVP.

### Rollback Plan

If Git-first approach fails:

1. Old tables still exist (`projects_deprecated`)
2. Can re-enable old tables and revert code
3. Cache tables independent, can be dropped without data loss

---

## Future Enhancements

### Phase 2+

- **Full-text search:** Integrate with Supabase Vector or Algolia for content search
- **Update cache:** Cache update titles for faster search
- **Analytics cache:** Store view counts, activity trends
- **Commons index:** Federated cache of all public Commons projects

---

## Summary

| Aspect | Decision |
|--------|----------|
| **Purpose** | Fast queries, avoid GitHub API limits |
| **Data Cached** | Metadata only (titles, slugs, visibility, counts) |
| **Source of Truth** | Git repositories |
| **Sync Method** | GitHub webhooks (push events) |
| **Staleness** | Eventually consistent (<10s delay) |
| **Performance Target** | Dashboard <1s, project detail <2s |
| **Security** | RLS policies, encrypted tokens |

**Status:** Ready for Phase 1 implementation

---

## Related Documentation

- [01_Phase1_Git_First_MVP.md](../implementation/01_Phase1_Git_First_MVP.md) - Implementation tasks
- [05_Keystatic_Integration.md](./05_Keystatic_Integration.md) - Content editing
- [API_Endpoints.md](../reference/API_Endpoints.md) - Webhook endpoints
- [09_claude_qa_implementation_answers.md](../new/09_claude_qa_implementation_answers.md) - Architecture decisions

---

**Author:** Claude + Ali + Lumen
**Version:** 1.0
**Last Updated:** November 5, 2025
