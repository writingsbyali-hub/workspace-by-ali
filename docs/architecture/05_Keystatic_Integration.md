# 05_Keystatic Integration Architecture

**Version:** 2.0
**Last Updated:** November 7, 2025
**Status:** 🟢 Implemented with Flat Structure Workaround

**⚠️ CRITICAL UPDATE (Nov 7, 2025):**
- "Streams" renamed to "Sub-Projects" throughout
- **MAJOR LIMITATION DISCOVERED:** Nested glob patterns work for READING but NOT for CREATING new items
- **WORKAROUND IMPLEMENTED:** Flat collection structure with relationship fields (`projectId`, `subProjectId`)
- Owner-only access (readers cannot access Keystatic)
- See "Nested Pattern Limitation" section below for details

---

## Overview

Keystatic serves as the Git-backed CMS for Workspace, enabling **owners** to edit projects, sub-projects, and updates through a visual interface while maintaining Git as the source of truth. This document details the technical integration, configuration, and workflows for Keystatic within the Git-first architecture.

**Access:** Keystatic is **OWNER-ONLY**. Readers cannot access `/keystatic` and must use the public workspace interface.

---

## Why Keystatic?

### Advantages Over Alternatives

| Feature | Keystatic | DecapCMS | Contentful | Sanity |
|---------|-----------|----------|------------|--------|
| **Git-first** | ✅ Native | ✅ Yes | ❌ API-based | ❌ API-based |
| **Nested Collections** | ✅ Excellent | ⚠️ Limited | ✅ Yes | ✅ Yes |
| **Local Editing** | ✅ Built-in | ❌ No | ❌ No | ❌ No |
| **Astro Integration** | ✅ Official | ⚠️ Manual | ⚠️ Manual | ⚠️ Manual |
| **Type Safety** | ✅ TypeScript | ❌ Config-based | ✅ GraphQL | ✅ GROQ |
| **Open Source** | ✅ MIT | ✅ MIT | ❌ Proprietary | ❌ Proprietary |
| **Branch Workflow** | ✅ Built-in | ⚠️ Basic | ❌ N/A | ❌ N/A |
| **Active Development** | ✅ 2024+ | ⚠️ Declining | ✅ Active | ✅ Active |

**Decision:** Keystatic best aligns with Git-first philosophy, provides excellent developer experience, and has native Astro support.

---

## ⚠️ Nested Pattern Limitation & Flat Structure Workaround

### The Problem

Keystatic supports nested glob patterns like:
```typescript
path: 'content/projects/*/sub-projects/*/'
```

**However,** this pattern has a **critical limitation**:
- ✅ **Works for READING** existing items (Keystatic can display them)
- ❌ **Fails for CREATING** new items (Keystatic cannot determine parent path)

**What Happens:** When you try to create a new sub-project with a nested pattern, Keystatic doesn't know which project folder to put it in, so the create UI fails or behaves unexpectedly.

### The Workaround: Flat Collections with Relationships

**Solution:** Use **flat directory structure** with **relationship fields** to link items.

**Before (Broken for Creation):**
```
content/
└── projects/
    └── plasma-design/
        └── sub-projects/           # Nested
            └── pollution-study/
                └── sub-project.mdoc
```

**After (Works for Creation):**
```
content/
├── projects/
│   └── plasma-design/
│       └── project.mdoc
│
└── sub-projects/                   # Flat collection
    └── pollution-study/
        └── sub-project.mdoc        # Contains projectId: "plasma-design"
```

**How It Works:**
1. Sub-projects are stored in a **flat collection** (`content/sub-projects/`)
2. Each sub-project has a **`projectId` field** that links to its parent project
3. UI can filter/display sub-projects by `projectId`
4. Hierarchy is maintained via relationships, not folder structure

### Configuration Examples

**Sub-Projects Collection (Flat):**
```typescript
subProjects: collection({
  label: 'Sub-Projects',
  path: 'content/sub-projects/*/',  // FLAT (no wildcard before this)
  slugField: 'title',

  schema: {
    title: fields.text({ label: 'Title', validation: { isRequired: true } }),

    // Relationship to parent project
    projectId: fields.relationship({
      label: 'Parent Project',
      collection: 'projects',
      validation: { isRequired: true },
    }),

    // Optional: for hierarchical sub-projects
    parentSubProjectId: fields.relationship({
      label: 'Parent Sub-Project (if nested)',
      collection: 'subProjects',
    }),

    // ... other fields
  },
})
```

**Updates Collection (Flat):**
```typescript
updates: collection({
  label: 'Updates',
  path: 'content/updates/*/',  // FLAT (no wildcards before this)

  schema: {
    title: fields.text({ label: 'Title' }),

    // Relationships to project and sub-project
    projectId: fields.relationship({
      label: 'Project',
      collection: 'projects',
      validation: { isRequired: true },
    }),

    subProjectId: fields.relationship({
      label: 'Sub-Project (optional)',
      collection: 'subProjects',
    }),

    // ... other fields
  },
})
```

### Benefits of This Approach

✅ **Creation Works:** Users can create new sub-projects and updates easily
✅ **Hierarchy Maintained:** Relationships preserve logical structure
✅ **Queries Simple:** Easy to filter by project (e.g., `WHERE projectId = 'plasma-design'`)
✅ **Flexible:** Can have nested sub-projects with `parentSubProjectId`
✅ **Astro Compatible:** Works seamlessly with Astro content collections

### Trade-offs

⚠️ **Folder Structure Doesn't Reflect Hierarchy:** Folders are flat, hierarchy is logical only
⚠️ **Relationship Fields Required:** Must manually link items (though Keystatic provides UI for this)
✅ **Acceptable Trade-off:** Enables creation while maintaining all functionality

### Migration Notes

**If you already have nested content:**
1. Read existing nested items (Keystatic can read them fine)
2. Create new items in flat structure with relationship fields
3. Optionally: Move old nested files to flat structure
4. Update Keystatic config to use flat paths

**No data loss:** Existing nested files can remain; Keystatic reads them successfully.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
│                                                             │
│  ┌──────────────────┐              ┌──────────────────┐   │
│  │  Workspace UI    │              │  Keystatic UI    │   │
│  │  (Read Content)  │              │  (Edit Content)  │   │
│  └────────┬─────────┘              └────────┬─────────┘   │
│           │                                  │             │
└───────────┼──────────────────────────────────┼─────────────┘
            │                                  │
            ↓                                  ↓
┌───────────────────────┐          ┌───────────────────────┐
│   GitHub API (read)   │          │   GitHub API (write)  │
│   Branch: main        │          │   Branch: draft       │
└───────────┬───────────┘          └───────────┬───────────┘
            │                                  │
            └──────────────┬───────────────────┘
                           ↓
                ┌────────────────────┐
                │   GitHub Repo      │
                │   (User-owned)     │
                │                    │
                │  • main (public)   │
                │  • draft (staging) │
                └────────────────────┘
```

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install @keystatic/core @keystatic/astro
```

**Package Versions:**
- `@keystatic/core`: ^0.5.0
- `@keystatic/astro`: ^5.0.0

### 2. Astro Integration

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astro/react'; // Keystatic requires React

export default defineConfig({
  integrations: [
    react(),
    keystatic(),
  ],
  output: 'hybrid', // or 'server' - needed for Keystatic admin
});
```

**Important:** Keystatic requires React for its admin UI, even though the rest of the site can use any framework.

### 3. Create Admin Route

Create `src/pages/keystatic/[...params].astro`:

```astro
---
export const prerender = false; // Must be server-rendered
---

<html>
  <head>
    <title>Keystatic Admin</title>
  </head>
  <body>
    <div id="keystatic-admin"></div>
    <script>
      import { makeAdmin } from '@keystatic/astro/admin';
      makeAdmin(document.getElementById('keystatic-admin'));
    </script>
  </body>
</html>
```

**Access:** Admin UI will be available at `/keystatic`

---

## Configuration

### Main Config File: `keystatic.config.ts`

```ts
import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: process.env.PUBLIC_GITHUB_REPO_OWNER || '',
      name: process.env.PUBLIC_GITHUB_REPO_NAME || '',
    },
  },

  // Branch configuration
  // Keystatic will commit all changes to 'draft' branch
  branchPrefix: 'draft',

  collections: {
    // See detailed schemas below
  },

  singletons: {
    // For site-wide settings (future)
  },
});
```

### Environment Variables

```env
# User's GitHub repo (dynamically set per user)
PUBLIC_GITHUB_REPO_OWNER=username
PUBLIC_GITHUB_REPO_NAME=workspace-by-username

# GitHub OAuth token (server-side only)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

**Security Note:** Token must NEVER be exposed to client. Use server-side API routes for GitHub operations.

---

## Collection Schemas

### Projects Collection

```ts
projects: collection({
  label: 'Projects',
  path: 'content/projects/*/',
  slugField: 'title',

  schema: {
    title: fields.text({
      label: 'Project Title',
      validation: { isRequired: true },
    }),

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

    safetyCode: fields.conditional(
      fields.checkbox({ label: 'gated' }), // condition field
      {
        true: fields.text({
          label: 'Safety Code',
          description: 'e.g., plasma_safety_v1.3',
        }),
        false: fields.empty(),
      }
    ),

    stream: fields.text({
      label: 'Primary Stream',
      description: 'e.g., hardware, biology, plasma',
    }),

    tags: fields.array(
      fields.text({ label: 'Tag' }),
      {
        label: 'Tags',
        itemLabel: (props) => props.value,
      }
    ),

    description: fields.text({
      label: 'Short Description',
      multiline: true,
    }),

    body: fields.document({
      label: 'Project Overview',
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          code: true,
          strikethrough: true,
        },
        listTypes: {
          ordered: true,
          unordered: true,
        },
        headingLevels: [2, 3, 4],
        blockTypes: {
          blockquote: true,
          code: true,
        },
      },
      links: true,
      images: {
        directory: 'public/images/projects',
        publicPath: '/images/projects/',
      },
    }),

    status: fields.select({
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
    }),

    startDate: fields.date({
      label: 'Start Date',
    }),

    lastUpdated: fields.date({
      label: 'Last Updated',
      defaultValue: { kind: 'today' },
    }),
  },

  // Entry template (optional)
  template: {
    title: 'New Project',
    visibility: 'public',
    status: 'draft',
  },
})
```

**Storage Format:** `content/projects/my-project-slug/README.md` with YAML frontmatter

---

### Sub-Projects Collection (Flat Structure)

**⚠️ Note:** Uses **flat structure** with relationship fields (see "Nested Pattern Limitation" section above).

```ts
subProjects: collection({
  label: 'Sub-Projects',
  path: 'content/sub-projects/*/',  // FLAT collection (no nested wildcards)
  slugField: 'title',
  format: { contentField: 'body' },

  schema: {
    title: fields.text({
      label: 'Sub-Project Title',
      validation: { isRequired: true },
    }),

    // Relationship to parent project (REQUIRED)
    projectId: fields.relationship({
      label: 'Parent Project',
      collection: 'projects',
      validation: { isRequired: true },
    }),

    // Optional: for hierarchical sub-projects (sub-sub-projects)
    parentSubProjectId: fields.relationship({
      label: 'Parent Sub-Project',
      collection: 'subProjects',
      description: 'Optional: link to parent sub-project for hierarchy',
    }),

    gated: fields.checkbox({
      label: 'Requires Safety Acknowledgment',
      defaultValue: false,
    }),

    safetyCode: fields.conditional(
      fields.checkbox({ label: 'gated' }),
      {
        true: fields.text({
          label: 'Safety Code',
          description: 'e.g., safety-v1.2.0',
        }),
        false: fields.empty(),
      }
    ),

    description: fields.text({
      label: 'Description',
      multiline: true,
    }),

    body: fields.document({
      label: 'Sub-Project Overview',
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          code: true,
        },
        listTypes: {
          ordered: true,
          unordered: true,
        },
        headingLevels: [2, 3, 4],
      },
      links: true,
    }),

    startDate: fields.date({ label: 'Start Date' }),
    lastUpdated: fields.date({
      label: 'Last Updated',
      defaultValue: { kind: 'today' },
    }),
  },
})
```

**Storage Format:** `content/sub-projects/pollution-study/sub-project.mdoc`

**Resulting File Content:**
```yaml
---
title: Pollution Degradation Study
projectId: plasma-design
parentSubProjectId: ""
gated: false
startDate: 2025-02-01
lastUpdated: 2025-11-07
---

This sub-project investigates plasma effectiveness on pollutants...
```

**Displaying in UI:**
```typescript
// Filter sub-projects by project
const subProjects = await getCollection('subProjects', ({ data }) => {
  return data.projectId === 'plasma-design';
});
```

---

### Updates Collection (Flat Structure)

**⚠️ Note:** Uses **flat structure** with relationship fields (see "Nested Pattern Limitation" section above).

```ts
updates: collection({
  label: 'Updates',
  path: 'content/updates/*/',  // FLAT collection (no nested wildcards)
  format: { contentField: 'content' },
  slugField: 'title',

  schema: {
    title: fields.text({
      label: 'Update Title',
      validation: { isRequired: true },
    }),

    date: fields.date({
      label: 'Date',
      defaultValue: { kind: 'today' },
      validation: { isRequired: true },
    }),

    // Relationships to project and sub-project
    projectId: fields.relationship({
      label: 'Project',
      collection: 'projects',
      validation: { isRequired: true },
    }),

    subProjectId: fields.relationship({
      label: 'Sub-Project',
      collection: 'subProjects',
      description: 'Optional: link to specific sub-project',
    }),

    type: fields.select({
      label: 'Update Type',
      options: [
        { label: 'Experiment', value: 'experiment' },
        { label: 'Observation', value: 'observation' },
        { label: 'Milestone', value: 'milestone' },
        { label: 'Note', value: 'note' },
      ],
      defaultValue: 'note',
    }),

    tags: fields.array(
      fields.text({ label: 'Tag' }),
      { label: 'Tags', itemLabel: (props) => props.value }
    ),

    duration: fields.text({
      label: 'Duration',
      description: 'e.g., "2 hours", "30 minutes"',
    }),

    materials: fields.array(
      fields.text({ label: 'Material' }),
      { label: 'Materials Used', itemLabel: (props) => props.value }
    ),

    results: fields.text({
      label: 'Results Summary',
      multiline: true,
    }),

    content: fields.document({
      label: 'Content',
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          code: true,
          strikethrough: true,
        },
        listTypes: {
          ordered: true,
          unordered: true,
        },
        headingLevels: [2, 3, 4],
        blockTypes: {
          blockquote: true,
          code: true,
        },
      },
      links: true,
      images: {
        directory: 'public/images/updates',
        publicPath: '/images/updates/',
      },
    }),
  },

  template: {
    title: 'Update {{date}}',
    type: 'note',
  },
})
```

**Storage Format:** `content/updates/2025-11-05-initial-test/update.mdoc`

**Resulting File Content:**
```yaml
---
title: Initial Water Treatment Test
date: 2025-11-05
projectId: plasma-design
subProjectId: pollution-degradation
type: experiment
tags:
  - water-treatment
  - plasma
duration: "3 hours"
results: "Visible reduction in cloudiness, bacterial count decreased by 45%"
---

## Setup

Today I ran the first test of the plasma generator on tap water...

## Results

Bacterial count:
- Before: 1000 CFU/ml
- After: 550 CFU/ml
- **Reduction: 45%**
```

**Querying Updates:**
```typescript
// Get all updates for a project
const projectUpdates = await getCollection('updates', ({ data }) => {
  return data.projectId === 'plasma-design';
});

// Get updates for a specific sub-project
const subProjectUpdates = await getCollection('updates', ({ data }) => {
  return data.projectId === 'plasma-design' && data.subProjectId === 'pollution-degradation';
});
```

---

## Authentication & GitHub Token Flow

### Challenge
Keystatic needs a GitHub token to read/write files, but:
- We can't expose tokens to the client
- Each user has their own repo
- Token must be scoped per user

### Solution: Server-Side Token Proxy

#### 1. Store Token in Supabase (Encrypted)

```sql
-- Already defined in user_repos table
create table user_repos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) unique not null,
  repo_url text not null,
  repo_owner text not null,
  repo_name text not null,
  github_token_encrypted text, -- Encrypted with pgsodium
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

#### 2. Create Token Proxy API

```ts
// src/pages/api/keystatic/token.ts
import { createClient } from '@supabase/supabase-js';
import { decrypt } from '../utils/encryption';

export async function GET({ request, locals }) {
  const session = locals.session;
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(/* ... */);

  const { data } = await supabase
    .from('user_repos')
    .select('github_token_encrypted, repo_owner, repo_name')
    .eq('user_id', session.user.id)
    .single();

  if (!data) {
    return new Response('No repo found', { status: 404 });
  }

  const token = await decrypt(data.github_token_encrypted);

  return new Response(JSON.stringify({
    token,
    repo: {
      owner: data.repo_owner,
      name: data.repo_name,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

#### 3. Configure Keystatic to Use Proxy

```ts
// keystatic.config.ts
export default config({
  storage: {
    kind: 'github',
    repo: async () => {
      // Fetch token from our secure API
      const response = await fetch('/api/keystatic/token', {
        credentials: 'include', // Include session cookie
      });

      if (!response.ok) {
        throw new Error('Failed to get GitHub token');
      }

      const { token, repo } = await response.json();

      return {
        owner: repo.owner,
        name: repo.name,
        token,
      };
    },
  },
  // ... rest of config
});
```

**Security:** Token never exposed to client, fetched on-demand per request.

---

## Branch Workflow Integration

### How Keystatic Works with Branches

1. **Editing:** All edits committed to `draft` branch
2. **Auto-save:** Keystatic auto-commits every few minutes
3. **Publishing:** Separate "Publish" button merges `draft → main`

### Configuration

```ts
export default config({
  storage: {
    kind: 'github',
    repo: { /* ... */ },
    branchPrefix: 'draft', // All edits go to draft
  },
});
```

### Commit Messages

Keystatic generates commit messages like:
```
Update content/projects/plasma-design/README.md
```

You can customize this behavior:

```ts
storage: {
  kind: 'github',
  repo: { /* ... */ },
  branchPrefix: 'draft',
  commitMessage: (action) => {
    const { action: actionType, path } = action;
    return `[Keystatic] ${actionType}: ${path}`;
  },
},
```

### Publish Flow

See [01_Phase1_Git_First_MVP.md](../implementation/01_Phase1_Git_First_MVP.md#task-141-create-publish-endpoint) for publish API implementation.

---

## Performance Considerations

### Challenge: Nested Collections at Scale

Keystatic must load all items in a collection to display the list. With deeply nested structures:

```
projects (50 items)
  └─ streams (10 items each = 500 total)
      └─ updates (20 items each = 10,000 total)
```

This could slow down the admin UI.

### Mitigation Strategies

#### 1. Pagination (Built-in)
Keystatic automatically paginates large collections:

```ts
updates: collection({
  path: 'content/projects/*/streams/*/updates/*',
  // Keystatic will paginate automatically if >100 items
})
```

#### 2. Filtering & Search
Enable search to help users find content:

```ts
updates: collection({
  // ...
  filterFields: ['date', 'type'], // Add filters in UI
  searchField: 'title', // Enable search
})
```

#### 3. Limit Nested Depth in UI
For updates, consider using forms instead of Keystatic for creation:

- Keystatic for editing existing updates
- Astro form for quickly creating new updates

#### 4. Lazy Loading
Keystatic loads collections on-demand. Users don't experience slowness unless they navigate to a large collection.

### Performance Benchmarks (Target)

| Collection | Item Count | Load Time | Status |
|------------|-----------|-----------|--------|
| Projects | 50 | <1s | ✅ Expected to pass |
| Streams | 500 | <2s | ⚠️ Monitor |
| Updates | 10,000 | <3s | ⚠️ Monitor, may need pagination |

**Action:** Test with realistic data volume during Phase 1.6.

---

## Frontmatter Schema Mapping

Keystatic stores data as Markdown with YAML frontmatter. Here's how fields map:

### Project Example

**Keystatic Config:**
```ts
{
  title: fields.text({ label: 'Title' }),
  visibility: fields.select({ options: [...] }),
  body: fields.document({ label: 'Body' }),
}
```

**Resulting File:** `content/projects/plasma-design/README.md`
```markdown
---
title: Plasma Design Research
visibility: gated
gated: true
safetyCode: plasma_safety_v1.3
stream: hardware
tags:
  - plasma
  - chemistry
startDate: 2025-01-15
lastUpdated: 2025-11-05
---

This project explores non-thermal plasma for water treatment...
```

**Reading in Astro:**
```astro
---
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
---

{projects.map(p => (
  <h2>{p.data.title}</h2>
  <p>{p.data.description}</p>
  <div set:html={p.body} />
))}
```

---

## Content Collections Integration

### Define Collections for Astro

Create `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    visibility: z.enum(['public', 'gated', 'private']),
    gated: z.boolean().default(false),
    safetyCode: z.string().optional(),
    stream: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    status: z.enum(['draft', 'active', 'archived']),
    startDate: z.date(),
    lastUpdated: z.date(),
  }),
});

const streamsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    parentProject: z.string(),
    gated: z.boolean().default(false),
    description: z.string().optional(),
    startDate: z.date().optional(),
    lastUpdated: z.date(),
  }),
});

const updatesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    type: z.enum(['experiment', 'observation', 'milestone', 'note']),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  projects: projectsCollection,
  streams: streamsCollection,
  updates: updatesCollection,
};
```

**Type Safety:** Astro will generate TypeScript types for all collections.

---

## Rendering Content

### Example: Project Detail Page

```astro
---
// src/pages/projects/[slug].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map(p => ({
    params: { slug: p.slug },
    props: { project: p },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---

<Layout>
  <h1>{project.data.title}</h1>
  <p>Status: {project.data.status}</p>
  <p>Stream: {project.data.stream}</p>

  <div class="content">
    <Content />
  </div>

  <a href={`/keystatic/collection/projects/item/${project.slug}`}>
    Edit in Keystatic
  </a>
</Layout>
```

### Example: List Projects from Cache

```astro
---
// src/pages/dashboard.astro
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(/* ... */);

const { data: projects } = await supabase
  .from('project_cache')
  .select('*')
  .eq('user_id', session.user.id)
  .order('last_updated', { ascending: false });
---

<div class="dashboard">
  {projects.map(p => (
    <ProjectCard
      title={p.title}
      slug={p.project_slug}
      visibility={p.visibility}
      lastUpdated={p.last_updated}
    />
  ))}
</div>
```

**Strategy:** Use cache for lists, Git content for detail views.

---

## Webhooks & Cache Sync

### Flow

1. User edits in Keystatic → commit to `draft` branch
2. GitHub webhook fires: `push` event
3. Supabase Edge Function receives webhook
4. Parse changed files
5. Update `project_cache` and `stream_cache` tables

### Webhook Payload Example

```json
{
  "ref": "refs/heads/draft",
  "repository": {
    "owner": { "login": "username" },
    "name": "workspace-by-username"
  },
  "commits": [
    {
      "added": ["content/projects/new-project/README.md"],
      "modified": ["content/projects/plasma-design/README.md"],
      "removed": []
    }
  ]
}
```

### Edge Function Pseudocode

```ts
// supabase/functions/github-webhook/index.ts

serve(async (req) => {
  const payload = await req.json();

  if (payload.ref !== 'refs/heads/draft') {
    return new Response('Ignoring non-draft push', { status: 200 });
  }

  const changedFiles = payload.commits.flatMap(c => [
    ...c.added,
    ...c.modified,
  ]);

  for (const file of changedFiles) {
    if (file.match(/content\/projects\/(.+)\/README\.md/)) {
      await updateProjectCache(payload.repository, file);
    }
    if (file.match(/content\/projects\/(.+)\/streams\/(.+)\/README\.md/)) {
      await updateStreamCache(payload.repository, file);
    }
  }

  return new Response('OK', { status: 200 });
});

async function updateProjectCache(repo, filePath) {
  // 1. Fetch file content from GitHub
  // 2. Parse frontmatter
  // 3. Upsert to project_cache table
}
```

See [06_Supabase_Caching_Strategy.md](./06_Supabase_Caching_Strategy.md) for complete implementation.

---

## Troubleshooting

### Issue: "Unauthorized" Error in Keystatic

**Cause:** GitHub token missing or expired

**Solution:**
1. Check `/api/keystatic/token` returns valid token
2. Verify token has `repo` scope
3. Check token not expired (refresh if using OAuth)

### Issue: Collections Not Appearing

**Cause:** Path glob not matching files

**Solution:**
1. Verify content structure matches `path` in config
2. Check files have correct frontmatter
3. Run `astro sync` to regenerate types

### Issue: Slow Loading with Many Items

**Cause:** Large collection size

**Solution:**
1. Enable pagination in Keystatic config
2. Use cache for list views (not Keystatic collections)
3. Consider flatter structure if necessary

### Issue: Merge Conflicts When Publishing

**Cause:** Concurrent edits to same file

**Solution:**
1. Single-user repos should rarely conflict
2. If conflict: resolve manually in GitHub
3. Or: reset `draft` to `main` and re-edit

### Issue: Images Not Uploading

**Cause:** GitHub API file size limits (1 MB)

**Solution:**
1. Resize images before upload
2. Or: use external image host (Cloudinary, Supabase Storage)
3. Update Keystatic image config to use external URLs

---

### Issue: Back Button Doesn't Work in Keystatic

**Cause:** Known issue with Keystatic navigation

**Symptoms:**
- Clicking browser back button doesn't navigate back in Keystatic
- Must use Keystatic's internal navigation

**Workaround:**
1. Use Keystatic's built-in breadcrumb navigation
2. Or: Click collection name in sidebar to go back to collection list
3. Avoid using browser back button while in Keystatic admin

**Status:** Known limitation, no fix available yet

---

### Issue: "Nested Collections Not Creating"

**Cause:** This is expected behavior (see "Nested Pattern Limitation" section)

**Solution:**
- Use flat collections with relationship fields
- Update `keystatic.config.ts` to use flat paths
- Add `projectId` and `subProjectId` relationship fields
- See configuration examples in "Sub-Projects Collection" and "Updates Collection" sections above

---

### Issue: "Unauthorized" - Readers Cannot Access Keystatic

**Cause:** Keystatic is owner-only by design

**Solution:**
- Readers should NOT access `/keystatic`
- Only the workspace owner (deployer) can use Keystatic
- Readers use the public workspace interface to view content
- If owner is getting "Unauthorized": Check middleware role detection in `src/middleware.ts`

---

## Customization Options

### Custom UI Theme

```ts
// keystatic.config.ts
export default config({
  ui: {
    brand: {
      name: 'Workspace',
      mark: () => <img src="/logo.svg" alt="Workspace" />,
    },
    navigation: {
      Projects: ['projects', 'streams'],
      Content: ['updates'],
    },
  },
  // ...
});
```

### Custom Field Components

```tsx
// Custom safety code selector
import { component, fields } from '@keystatic/core';

const safetyCodeField = component({
  preview: (props) => <SafetyCodePreview code={props.value} />,
  schema: {
    code: fields.select({
      label: 'Safety Protocol',
      options: [
        { label: 'Plasma v1.3', value: 'plasma_safety_v1.3' },
        { label: 'Chemistry v2.0', value: 'chemistry_safety_v2.0' },
      ],
    }),
  },
  label: 'Safety Code',
});
```

### Conditional Fields

```ts
gated: fields.conditional(
  fields.checkbox({ label: 'Requires Safety' }),
  {
    true: fields.object({
      safetyCode: fields.text({ label: 'Safety Code' }),
      riskLevel: fields.select({
        label: 'Risk Level',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      }),
    }),
    false: fields.empty(),
  }
),
```

---

## Testing Keystatic Integration

### Manual Testing Checklist

- [ ] Admin UI loads at `/keystatic`
- [ ] Can create new project
- [ ] Can edit existing project
- [ ] Changes commit to `draft` branch
- [ ] Images upload successfully
- [ ] Nested streams collection works
- [ ] Updates collection works
- [ ] Search and filtering work
- [ ] Markdown rendering correct
- [ ] Links and images display correctly

### Automated Testing

```ts
// tests/keystatic.test.ts
import { expect, test } from 'vitest';
import { getCollection } from 'astro:content';

test('Projects collection loads', async () => {
  const projects = await getCollection('projects');
  expect(projects.length).toBeGreaterThan(0);
});

test('Project schema validates', async () => {
  const projects = await getCollection('projects');
  const project = projects[0];

  expect(project.data.title).toBeDefined();
  expect(project.data.visibility).toMatch(/public|gated|private/);
});
```

---

## Future Enhancements

### Phase 2+ Features

- **Collaborative editing:** Real-time collaboration using Keystatic's built-in features
- **Version history UI:** Visual diff viewer for Git commits
- **Content scheduling:** Publish at specific times
- **Workflow states:** Draft → Review → Published pipeline
- **Custom previews:** Live preview of Astro pages within Keystatic
- **Offline support:** Edit locally, sync when online

---

## Resources

### Official Documentation
- Keystatic Docs: https://keystatic.com/docs
- Keystatic GitHub: https://github.com/Thinkmill/keystatic
- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/

### Related Workspace Docs
- [01_Phase1_Git_First_MVP.md](../implementation/01_Phase1_Git_First_MVP.md) - Implementation roadmap
- [08_content_structure_and_branch_workflow.md](../new/08_content_structure_and_branch_workflow.md) - Content structure
- [09_claude_qa_implementation_answers.md](../new/09_claude_qa_implementation_answers.md) - Architecture decisions

---

## Summary

Keystatic provides:
- ✅ Visual CMS for Git-backed content
- ⚠️ **Flat collection structure required** (nested patterns don't work for creation)
- ✅ Relationship fields maintain hierarchy (Projects → Sub-Projects → Updates)
- ✅ Branch workflow integration (draft → main)
- ✅ Type-safe schema with Astro Content Collections
- ✅ Image upload and markdown editing
- ✅ Secure token management via server-side proxy
- ✅ **Owner-only access** (readers cannot access Keystatic)

**Key Limitations:**
- ❌ Nested glob patterns fail for creating new items
- ✅ **Workaround:** Flat structure with `projectId`/`subProjectId` relationship fields
- ⚠️ Back button doesn't work (use Keystatic internal navigation)

**Status:** ✅ Implemented with flat structure workaround

---

**Author:** Claude + Ali + Lumen
**Version:** 2.0
**Last Updated:** November 7, 2025
**Changelog:**
- v2.0 (Nov 7, 2025): Added nested pattern limitation warning, flat structure workaround, sub-projects terminology, owner-only access, troubleshooting entries
- v1.0 (Nov 5, 2025): Initial Keystatic integration documentation
