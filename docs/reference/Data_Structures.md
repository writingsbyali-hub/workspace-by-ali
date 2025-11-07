# Data Structures Reference

**Version:** 2.0
**Last Updated:** November 7, 2025
**Purpose:** Complete reference for all data formats, frontmatter schemas, and file structures

**⚠️ MAJOR UPDATE (Nov 7, 2025):**
- "Streams" renamed to "Sub-Projects" throughout
- Added 4 new database tables for owner/reader roles
- Updated directory structure (flat with relationships)
- Updated RLS policies for reader access
- Added permission matrix

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Project Format](#project-format)
3. [Sub-Project Format](#sub-project-format) (formerly "Streams")
4. [Update Format](#update-format)
5. [Access Configuration](#access-configuration)
6. [Notes Format](#notes-format)
7. [Database Schemas](#database-schemas)
8. [Permission Matrix](#permission-matrix)
9. [API Payload Formats](#api-payload-formats)
10. [Validation Rules](#validation-rules)

---

## Directory Structure

### Complete Workspace Repository Layout

**⚠️ IMPORTANT:** Due to Keystatic limitations with nested glob patterns for **creating** new items, the directory structure uses a **flat layout with relationship fields** instead of nested folders.

**Repository Naming Convention:** `workspace-{username}` (e.g., `workspace-ali`, NOT `workspace-by-ali`)

```
workspace-{username}/
│
├── content/                      # All user content (Git-tracked)
│   ├── projects/
│   │   ├── plasma-design/
│   │   │   ├── project.mdoc     # Project metadata (Keystatic format)
│   │   │   └── .access.yml      # Access control (optional)
│   │   └── remote-sensing/
│   │       └── project.mdoc
│   │
│   ├── sub-projects/             # Flat structure (NOT nested)
│   │   ├── pollution-degradation/
│   │   │   ├── sub-project.mdoc # Includes projectId relationship field
│   │   │   └── .access.yml      # Access control (optional)
│   │   ├── kinetics/
│   │   │   └── sub-project.mdoc # Includes projectId relationship field
│   │   └── design-phase/
│   │       └── sub-project.mdoc # Can also include parentSubProjectId for hierarchy
│   │
│   ├── updates/                  # Flat structure (NOT nested)
│   │   ├── 2025-11-05-initial-test/
│   │   │   └── update.mdoc      # Includes projectId and subProjectId fields
│   │   └── 2025-11-06-experiment-2/
│   │       └── update.mdoc
│   │
│   ├── data/                     # Data files (organized by project)
│   │   ├── plasma-design/
│   │   │   └── dataset-1.csv
│   │   └── remote-sensing/
│   │       └── readings.json
│   │
│   └── notes/
│       ├── 2025-11-05-thoughts.md
│       └── ideas.md
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── projects/
│   │   └── updates/
│   └── favicon.ico
│
├── src/                          # Astro app code
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   └── content/
│       └── config.ts             # Astro content collections config
│
├── keystatic.config.ts           # Keystatic CMS configuration
├── astro.config.mjs              # Astro configuration
├── package.json
├── .gitignore
└── README.md                     # Workspace setup instructions
```

**Why Flat Structure?**
- Keystatic nested glob patterns (`content/projects/*/sub-projects/*`) work for **reading** but not **creating**
- Flat structure with relationship fields is the workaround
- Relationship fields: `projectId`, `subProjectId`, `parentSubProjectId`
- UI can still display hierarchy using relationships
- See [Keystatic Integration](../architecture/05_Keystatic_Integration.md) for details

### Key Paths

| Path Pattern | Purpose | Example |
|--------------|---------|---------|
| `content/projects/*/project.mdoc` | Project metadata | `content/projects/plasma-design/project.mdoc` |
| `content/sub-projects/*/sub-project.mdoc` | Sub-project metadata (flat, uses projectId) | `content/sub-projects/pollution-degradation/sub-project.mdoc` |
| `content/updates/*/update.mdoc` | Update entries (flat, uses projectId + subProjectId) | `content/updates/2025-11-05-initial-test/update.mdoc` |
| `content/projects/*/.access.yml` | Project-level gating | `content/projects/plasma-design/.access.yml` |
| `content/sub-projects/*/.access.yml` | Sub-project-level gating | `content/sub-projects/pollution-degradation/.access.yml` |
| `content/notes/*.md` | Personal notes | `content/notes/2025-11-05-thoughts.md` |
| `content/data/{project}/*.{csv,json}` | Data files | `content/data/plasma-design/dataset-1.csv` |

---

## Project Format

### File: `content/projects/<project-slug>/README.md`

#### Frontmatter Schema

```yaml
---
# Required fields
title: "Plasma Design Research"
visibility: "public"  # "public" | "gated" | "private"

# Safety & Access
gated: true
safetyCode: "plasma_safety_v1.3"

# Categorization
stream: "hardware"        # Primary stream
tags:
  - plasma
  - chemistry
  - water-treatment

# Status & Dates
status: "active"          # "draft" | "active" | "archived"
startDate: 2025-01-15
lastUpdated: 2025-11-05

# Optional fields
description: "Short description for list views"
collaborators:
  - "@alice"
  - "@bob"
funding: "ArcUp Commons"
---

# Project Overview

Full markdown content describing the project...

## Goals

- Goal 1
- Goal 2

## Background

...
```

#### Field Specifications

| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `title` | string | ✅ | | Project name |
| `visibility` | enum | ✅ | `public`, `gated`, `private` | Access level |
| `gated` | boolean | ❌ | `true`, `false` | Requires safety acknowledgment |
| `safetyCode` | string | ⚠️ | | Required if `gated: true` |
| `stream` | string | ✅ | | Primary stream (e.g., `plasma`, `biology`) |
| `tags` | array | ❌ | | Keywords for search/filtering |
| `status` | enum | ✅ | `draft`, `active`, `archived` | Project status |
| `startDate` | date | ❌ | YYYY-MM-DD | When project started |
| `lastUpdated` | date | ✅ | YYYY-MM-DD | Last significant update |
| `description` | string | ❌ | | Short description (for list views) |
| `collaborators` | array | ❌ | | GitHub usernames (future use) |
| `funding` | string | ❌ | | Funding source |

#### Example: Public Project

```yaml
---
title: "Open Source Water Filter"
visibility: "public"
gated: false
stream: "hardware"
tags:
  - open-source
  - water
status: "active"
startDate: 2025-01-01
lastUpdated: 2025-11-05
description: "DIY water filtration system using activated carbon"
---

This project documents my experiments with building...
```

#### Example: Gated Project

```yaml
---
title: "High Voltage Plasma Experiments"
visibility: "gated"
gated: true
safetyCode: "plasma_safety_v1.3"
stream: "plasma"
tags:
  - plasma
  - high-voltage
  - experimental
status: "active"
startDate: 2025-03-15
lastUpdated: 2025-11-05
description: "Non-thermal plasma generation for water treatment"
---

⚠️ **Safety Warning:** This project involves high voltage equipment...
```

#### Example: Private Project

```yaml
---
title: "Personal Chemistry Notes"
visibility: "private"
gated: false
stream: "chemistry"
tags:
  - notes
status: "draft"
startDate: 2025-10-01
lastUpdated: 2025-11-05
---

Private notes on chemistry experiments...
```

---

## Sub-Project Format

**Note:** "Sub-Projects" were formerly called "Streams" (renamed Nov 6, 2025 for clarity).

### File: `content/sub-projects/<subproject-slug>/sub-project.mdoc`

**⚠️ IMPORTANT:** Due to Keystatic limitations, sub-projects are stored in a **flat collection** with a `projectId` relationship field (not nested under project folders).

#### Frontmatter Schema

```yaml
---
# Required fields
title: "Pollution Degradation Study"
projectId: "plasma-design"  # Relationship to parent project

# Optional hierarchy (for nested sub-projects)
parentSubProjectId: ""  # Empty for top-level, or slug of parent sub-project

# Safety & Access (optional, inherits from project if not set)
gated: false
safetyCode: ""

# Dates
startDate: 2025-02-01
lastUpdated: 2025-11-05

# Optional
description: "Measuring plasma effectiveness on pollutants"
---

# Sub-Project Overview

Detailed description of this sub-project...
```

#### Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Sub-project name |
| `projectId` | string | ✅ | Parent project slug (relationship field) |
| `parentSubProjectId` | string | ❌ | Parent sub-project slug (for hierarchy) |
| `gated` | boolean | ❌ | Override project gating |
| `safetyCode` | string | ⚠️ | Required if `gated: true` |
| `startDate` | date | ❌ | When sub-project started |
| `lastUpdated` | date | ✅ | Last update |
| `description` | string | ❌ | Short description |

#### Example: Top-Level Sub-Project

```yaml
---
title: "Water Treatment Experiments"
projectId: "plasma-design"
parentSubProjectId: ""
gated: false
startDate: 2025-03-01
lastUpdated: 2025-11-05
description: "Weekly water sample tests with plasma treatment"
---

## Objectives

1. Measure bacterial reduction
2. Test on different water sources
3. Document safety protocols

## Methodology

...
```

#### Example: Nested Sub-Project (Sub-Sub-Project)

```yaml
---
title: "Bench Testing"
projectId: "plasma-design"
parentSubProjectId: "testing-phase"  # Parent sub-project
gated: false
startDate: 2025-04-01
lastUpdated: 2025-11-05
description: "Laboratory bench testing before field deployment"
---

## Setup

Testing in controlled lab environment...
```

---

## Update Format

### File: `content/updates/<slug>/update.mdoc`

**⚠️ IMPORTANT:** Updates are stored in a **flat collection** with `projectId` and `subProjectId` relationship fields (not nested under project/sub-project folders).

#### Naming Convention

Format: `YYYY-MM-DD-<slug>` (folder name)

Examples:
- `2025-11-05-initial-test/update.mdoc`
- `2025-11-06-experiment-2/update.mdoc`
- `2025-11-10-milestone-water-sample/update.mdoc`

#### Frontmatter Schema

```yaml
---
# Required fields
title: "Initial Water Treatment Test"
date: 2025-11-05

# Relationships (flat structure)
projectId: "plasma-design"           # Parent project
subProjectId: "pollution-degradation" # Parent sub-project (optional)

# Categorization
type: "experiment"  # "experiment" | "observation" | "milestone" | "note"
tags:
  - water-treatment
  - plasma

# Optional
duration: "2 hours"
materials:
  - "Plasma generator"
  - "Water sample (tap)"
results: "50% reduction in bacteria"
---

# Update Content

Full markdown content...

## Setup

...

## Results

...

## Observations

...
```

#### Field Specifications

| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `title` | string | ✅ | | Update title |
| `date` | date | ✅ | YYYY-MM-DD | Date of entry |
| `projectId` | string | ✅ | | Parent project slug (relationship) |
| `subProjectId` | string | ❌ | | Parent sub-project slug (relationship) |
| `type` | enum | ✅ | `experiment`, `observation`, `milestone`, `note` | Update type |
| `tags` | array | ❌ | | Keywords |
| `duration` | string | ❌ | | Time spent (freeform) |
| `materials` | array | ❌ | | Materials used |
| `results` | string | ❌ | | Quick summary of results |

#### Example: Experiment Update

```yaml
---
title: "First Plasma Water Test"
date: 2025-11-05
type: "experiment"
tags:
  - plasma
  - water-treatment
  - initial-test
duration: "3 hours"
materials:
  - "Plasma generator (12V)"
  - "Tap water sample (500ml)"
  - "Bacterial test kit"
results: "Visible reduction in cloudiness, bacterial count decreased by 45%"
---

## Setup

Today I ran the first test of the plasma generator on tap water.

Setup:
- Generator voltage: 12V
- Distance from water: 2cm
- Treatment time: 5 minutes

## Observations

- Water became slightly clearer
- No visible bubbles or heating
- Slight ozone smell (expected)

## Results

Bacterial count:
- Before: 1000 CFU/ml
- After: 550 CFU/ml
- **Reduction: 45%**

## Next Steps

- Try longer treatment time (10 minutes)
- Test on different water sources
- Document optimal distance
```

#### Example: Milestone Update

```yaml
---
title: "100th Water Sample Milestone"
date: 2025-11-10
type: "milestone"
tags:
  - milestone
  - celebration
---

🎉 Reached 100 water samples tested!

## Stats

- Total samples: 100
- Average reduction: 52%
- Best result: 89% reduction
- Worst result: 12% reduction

## Reflections

What I've learned...
```

---

## Access Configuration

### File: `.access.yml`

**Location:**
- `content/projects/<project>/.access.yml` (project-level)
- `content/projects/<project>/streams/<stream>/.access.yml` (stream-level)

#### Schema

```yaml
# Access control
gated: true
visibility: "gated"  # Redundant but explicit

# Required safety acknowledgment
required_acknowledgment: "plasma_safety_v1.3"

# Risk classification
risk_level: "high"  # "low" | "medium" | "high"

# Role-based access (future use)
allowed_roles:
  - owner
  - collaborator
  - vetted

# Documentation
safety_docs:
  - url: "/docs/safety/plasma-basics"
    version: "1.3"
    updated: "2025-10-01"
```

#### Field Specifications

| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `gated` | boolean | ✅ | `true`, `false` | Whether content is gated |
| `visibility` | enum | ❌ | `public`, `gated`, `private` | Redundant with frontmatter |
| `required_acknowledgment` | string | ⚠️ | | Safety code required (if gated) |
| `risk_level` | enum | ❌ | `low`, `medium`, `high` | Risk classification |
| `allowed_roles` | array | ❌ | | Future: role-based access |
| `safety_docs` | array | ❌ | | Links to safety documentation |

#### Example: Project-Level Gating

```yaml
# content/projects/plasma-design/.access.yml
gated: true
required_acknowledgment: "plasma_safety_v1.3"
risk_level: "high"
safety_docs:
  - url: "/docs/safety/plasma-basics"
    version: "1.3"
    updated: "2025-10-01"
```

#### Example: Stream-Level Gating

```yaml
# content/projects/plasma-design/streams/high-voltage/.access.yml
gated: true
required_acknowledgment: "high_voltage_safety_v2.0"
risk_level: "high"
safety_docs:
  - url: "/docs/safety/high-voltage"
    version: "2.0"
    updated: "2025-11-01"
```

#### Example: Public (No Gating)

```yaml
# content/projects/open-source-filter/.access.yml
gated: false
risk_level: "low"
```

**Note:** `.access.yml` is optional. If missing, defaults to `gated: false`.

---

## Notes Format

### File: `content/notes/<slug>.md`

#### Frontmatter Schema

```yaml
---
title: "Random Thoughts on Plasma Research"
date: 2025-11-05
tags:
  - brainstorming
  - plasma
related_projects:
  - plasma-design
  - remote-sensing
---

# Notes Content

Freeform notes...
```

#### Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Note title |
| `date` | date | ✅ | Note date |
| `tags` | array | ❌ | Keywords |
| `related_projects` | array | ❌ | Project slugs this note relates to |

---

## Database Schemas

**Note:** These are TypeScript interfaces representing Supabase PostgreSQL tables.

### Core Auth & Workspace Tables

#### `workspace_settings` Table

```typescript
interface WorkspaceSettings {
  id: string;                      // UUID
  owner_id: string;                // UUID (foreign key to auth.users) - UNIQUE
  workspace_name: string | null;   // Display name for workspace
  workspace_description: string | null;
  default_license: string;         // Default: 'CC-BY-NC-SA-4.0'
  allow_readers: boolean;          // Default: true
  allow_suggestions: boolean;      // Default: true
  auto_approve_experts: boolean;   // Default: false
  created_at: string;              // ISO 8601 timestamp
  updated_at: string;              // ISO 8601 timestamp
}
```

**Purpose:** Stores workspace-level configuration (one per deployment).

**RLS Policies:**
- Only owner can view/edit their workspace settings

---

#### `user_roles` Table

```typescript
interface UserRole {
  id: string;                      // UUID
  user_id: string;                 // UUID (foreign key to auth.users)
  workspace_owner_id: string;      // UUID (foreign key to auth.users)
  role: 'owner' | 'reader';        // User role in this workspace
  is_expert: boolean;              // Flag expert readers (default: false)
  created_at: string;              // ISO 8601 timestamp
  // UNIQUE constraint: (user_id, workspace_owner_id)
}
```

**Purpose:** Tracks user roles (owner vs reader) per workspace.

**RLS Policies:**
- Users can view own roles
- Owners can manage all roles in their workspace

---

#### `reader_acknowledgments` Table

```typescript
interface ReaderAcknowledgment {
  id: string;                      // UUID
  user_id: string;                 // UUID (foreign key to auth.users)
  workspace_owner_id: string;      // UUID (foreign key to auth.users)
  acknowledgment_type: 'safety' | 'license' | 'terms';
  acknowledgment_code: string;     // e.g., 'safety-v1.1', 'CC-BY-NC-SA-4.0'
  project_slug: string | null;     // Optional: project-specific acknowledgment
  subproject_slug: string | null;  // Optional: subproject-specific acknowledgment
  acknowledged_at: string;         // ISO 8601 timestamp
  // UNIQUE: (user_id, workspace_owner_id, acknowledgment_type, acknowledgment_code, project_slug, subproject_slug)
}
```

**Purpose:** Tracks safety protocol, license, and terms acknowledgments by readers.

**RLS Policies:**
- Users can view/insert own acknowledgments
- Owners can view all acknowledgments in their workspace

---

#### `reader_suggestions` Table

```typescript
interface ReaderSuggestion {
  id: string;                      // UUID
  user_id: string;                 // UUID (foreign key to auth.users)
  workspace_owner_id: string;      // UUID (foreign key to auth.users)
  project_slug: string;            // Which project this suggestion is for
  subproject_slug: string | null;  // Optional: specific sub-project
  target_path: string | null;      // Path to the content being commented on
  content: string;                 // Suggestion text
  status: 'pending' | 'approved' | 'rejected'; // Default: 'pending'
  is_expert: boolean;              // Flagged if from expert user (default: false)
  created_at: string;              // ISO 8601 timestamp
  reviewed_at: string | null;      // When owner reviewed
  reviewed_by: string | null;      // UUID (foreign key to auth.users)
}
```

**Purpose:** Stores reader comments/suggestions (alternative to Git storage).

**RLS Policies:**
- Users can view own suggestions
- Approved suggestions are public
- Users can insert suggestions
- Owners can manage all suggestions in their workspace

---

### Content Cache Tables

#### `user_repos` Table

```typescript
interface UserRepo {
  id: string;                    // UUID
  user_id: string;               // UUID (foreign key to auth.users)
  repo_url: string;              // Full GitHub URL
  repo_owner: string;            // GitHub username
  repo_name: string;             // Repository name (e.g., 'workspace-ali')
  github_token_encrypted: string; // Encrypted token (AES-256-GCM)
  webhook_id: number | null;     // GitHub webhook ID
  webhook_active: boolean;       // Webhook status
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}
```

**Purpose:** Stores GitHub repository info and encrypted access tokens.

---

#### `project_cache` Table

```typescript
interface ProjectCache {
  id: string;                    // UUID
  user_id: string;               // UUID (foreign key - workspace owner)
  repo_url: string;              // GitHub repo URL
  project_slug: string;          // Unique slug per user
  title: string | null;          // Project title
  visibility: 'public' | 'gated' | 'private';
  gated: boolean;                // Requires safety acknowledgment
  safety_code: string | null;    // Required acknowledgment code
  stream_slug: string | null;    // Primary stream (legacy field, may be removed)
  tags: string[] | null;         // Tags array
  status: 'draft' | 'active' | 'archived';
  start_date: string | null;     // ISO 8601 date
  last_updated: string | null;   // ISO 8601 timestamp
  stream_count: number;          // Number of sub-projects (legacy field name)
  update_count: number;          // Total updates
  synced_at: string;             // Last cache sync time
}
```

**Purpose:** Cached project metadata for fast queries.

**RLS Policies (Updated Nov 6, 2025):**
- Public projects visible to authenticated users
- Gated projects visible to readers who acknowledged safety
- Private projects visible to owner only

---

#### `stream_cache` Table

**⚠️ Note:** Table name not yet updated to `subproject_cache` (requires migration).

```typescript
interface StreamCache {
  id: string;                    // UUID
  project_id: string;            // UUID (foreign key to project_cache)
  stream_slug: string;           // Unique slug per project (rename to subproject_slug pending)
  title: string | null;          // Sub-project title
  gated: boolean;                // Requires safety acknowledgment
  safety_code: string | null;    // Required acknowledgment code
  start_date: string | null;     // ISO 8601 date
  last_updated: string | null;   // ISO 8601 timestamp
  update_count: number;          // Number of updates
  synced_at: string;             // Last cache sync time
  parent_subproject_id: string | null; // FUTURE: For hierarchical sub-projects
}
```

**Purpose:** Cached sub-project metadata.

**RLS Policies (Updated Nov 6, 2025):**
- Inherits project visibility
- Visible to readers with project access (after acknowledgment if gated)

---

#### `safety_acknowledgments` Table

**⚠️ Legacy:** May be merged with `reader_acknowledgments` in future migration.

```typescript
interface SafetyAcknowledgment {
  user_id: string;               // UUID (foreign key to auth.users)
  safety_code: string;           // Safety protocol code
  acknowledged_at: string;       // ISO 8601 timestamp
  // Primary key: (user_id, safety_code)
}
```

**Purpose:** Tracks safety protocol acknowledgments (legacy table).

---

## Permission Matrix

### Content Access by Role

| Content Type | Owner | Reader (Authenticated) | Unauthenticated |
|--------------|-------|------------------------|-----------------|
| **Public Projects** | ✅ Full access | ✅ Read-only | ✅ Read-only |
| **Gated Projects** | ✅ Full access | ✅ Read (after acknowledgment) | ❌ Blocked |
| **Private Projects** | ✅ Full access | ❌ Blocked | ❌ Blocked |
| **Public Sub-Projects** | ✅ Full access | ✅ Read-only | ✅ Read-only |
| **Gated Sub-Projects** | ✅ Full access | ✅ Read (after acknowledgment) | ❌ Blocked |
| **Updates** | ✅ Create/edit/delete | ✅ Read (if parent accessible) | ✅ Read (if parent public) |
| **Notes** | ✅ Full access | ❌ No access | ❌ No access |

### Feature Access by Role

| Feature | Owner | Reader | Unauthenticated |
|---------|-------|--------|-----------------|
| **Keystatic CMS** | ✅ Full access | ❌ No access | ❌ No access |
| **Create/Edit Content** | ✅ Yes | ❌ No | ❌ No |
| **Workspace Settings** | ✅ Full access | ❌ No access | ❌ No access |
| **Fork Repository** | ✅ Yes | ❌ No | ❌ No |
| **Publish (draft → main)** | ✅ Yes | ❌ No | ❌ No |
| **Leave Suggestions** | ✅ Yes | ✅ Yes (if allowed) | ❌ No |
| **View Suggestions** | ✅ All | ✅ Own + approved | ❌ Approved only |
| **Moderate Suggestions** | ✅ Yes | ❌ No | ❌ No |
| **View Safety Logs** | ✅ All acknowledgments | ✅ Own acknowledgments | ❌ No |

### Database Table Access (RLS Policies)

| Table | Owner | Reader | Notes |
|-------|-------|--------|-------|
| `workspace_settings` | ✅ CRUD (own) | ❌ None | Owner manages workspace config |
| `user_roles` | ✅ Read all, Manage all | ✅ Read own | Owner assigns roles |
| `reader_acknowledgments` | ✅ Read all | ✅ CRUD (own) | Readers track own acknowledgments |
| `reader_suggestions` | ✅ CRUD (all) | ✅ CRUD (own) | Readers create, owner moderates |
| `project_cache` | ✅ Full | ✅ Read (visibility-based) | Public/gated/private filtering |
| `stream_cache` | ✅ Full | ✅ Read (inherits project visibility) | Sub-project access |
| `user_repos` | ✅ CRUD (own) | ❌ None | GitHub tokens (owner only) |
| `safety_acknowledgments` | ✅ Read all | ✅ CRUD (own) | Legacy table |

### Acknowledgment Requirements

| Scenario | Required Acknowledgments |
|----------|-------------------------|
| **View Public Project** | None |
| **View Gated Project** | Safety acknowledgment for that project's safety_code |
| **View Gated Sub-Project** | Safety acknowledgment for project OR sub-project safety_code |
| **View Licensed Content** | License acknowledgment (e.g., CC-BY-NC-SA-4.0) |
| **First-time Reader Signup** | Terms of use acknowledgment |
| **Submit Suggestion** | Safety + license acknowledgments (if content is gated/licensed) |

**Acknowledgment Types:**
- `safety`: Hazard protocols (e.g., `safety-v1.2.0`)
- `license`: Content license (e.g., `CC-BY-NC-SA-4.0`)
- `terms`: Terms of use (e.g., `terms-v1.0.0`)

**Versioning:**
- Major version bump (e.g., v1.x → v2.x): Requires re-acknowledgment
- Minor/patch bump: Optional re-acknowledgment (owner decides)

---

## API Payload Formats

### POST `/api/repo/fork` Response

```typescript
interface ForkRepoResponse {
  success: boolean;
  repo: {
    owner: string;
    name: string;
    url: string;
    branches: string[];          // ["main", "draft"]
  };
}
```

### POST `/api/publish` Response (Success)

```typescript
interface PublishResponse {
  success: boolean;
  merge: {
    sha: string;                 // Commit SHA
    merged: boolean;             // true
    message: string;             // Merge commit message
  };
  commit_url: string;            // GitHub commit URL
}
```

### POST `/api/publish` Response (Conflict)

```typescript
interface PublishConflictResponse {
  error: 'merge_conflict';
  message: string;
  conflicting_files: string[];   // Array of file paths
  github_url: string;            // URL to resolve conflicts
}
```

### GET `/api/safety/required/:project_slug` Response

```typescript
interface SafetyRequiredResponse {
  gated: boolean;
  required_acknowledgments: Array<{
    safety_code: string;
    risk_level: 'low' | 'medium' | 'high';
    doc_url: string;
    version: string;
  }>;
  user_status?: {
    authenticated: boolean;
    acknowledged: boolean;
    missing_codes: string[];
  };
}
```

### POST `/api/webhooks/github` Payload (GitHub)

```typescript
interface GitHubWebhookPayload {
  ref: string;                   // "refs/heads/main"
  repository: {
    owner: { login: string };
    name: string;
    html_url: string;
  };
  commits: Array<{
    id: string;
    message: string;
    timestamp: string;
    added: string[];             // File paths
    modified: string[];
    removed: string[];
  }>;
}
```

---

## Validation Rules

### Project Slug

- **Format:** Lowercase alphanumeric + hyphens
- **Regex:** `^[a-z0-9-]+$`
- **Length:** 3-50 characters
- **Examples:**
  - ✅ `plasma-design`
  - ✅ `remote-sensing-v2`
  - ❌ `Plasma Design` (no spaces)
  - ❌ `plasma_design` (no underscores)

### Sub-Project Slug

- Same rules as project slug
- Examples:
  - ✅ `pollution-degradation`
  - ✅ `design-phase`
  - ❌ `Pollution Study` (no spaces)

### Safety Code

- **Format:** Alphanumeric + underscores, ends with version
- **Regex:** `^[a-z0-9_]+_v[0-9]+\.[0-9]+$`
- **Examples:**
  - ✅ `plasma_safety_v1.3`
  - ✅ `high_voltage_safety_v2.0`
  - ❌ `plasma-safety` (no version)
  - ❌ `plasma_safety_1.3` (missing 'v')

### Date Format

- **Format:** ISO 8601 date
- **Regex:** `^\d{4}-\d{2}-\d{2}$`
- **Examples:**
  - ✅ `2025-11-05`
  - ❌ `11/05/2025`
  - ❌ `2025-11-5` (missing leading zero)

### Visibility

- **Options:** `public`, `gated`, `private`
- **Case-sensitive:** Must be lowercase

### Status

- **Options:** `draft`, `active`, `archived`
- **Case-sensitive:** Must be lowercase

### Update Type

- **Options:** `experiment`, `observation`, `milestone`, `note`
- **Case-sensitive:** Must be lowercase

---

## TypeScript Type Definitions

### Frontmatter Types

```typescript
// src/types/content.ts

export interface ProjectFrontmatter {
  title: string;
  visibility: 'public' | 'gated' | 'private';
  gated: boolean;
  safetyCode?: string;
  stream: string;
  tags?: string[];
  status: 'draft' | 'active' | 'archived';
  startDate?: string;
  lastUpdated: string;
  description?: string;
  collaborators?: string[];
  funding?: string;
}

export interface SubProjectFrontmatter {
  title: string;
  projectId: string;           // Relationship to parent project
  parentSubProjectId?: string; // Optional: for hierarchical sub-projects
  gated?: boolean;
  safetyCode?: string;
  startDate?: string;
  lastUpdated: string;
  description?: string;
}

export interface UpdateFrontmatter {
  title: string;
  date: string;
  projectId: string;          // Relationship to parent project
  subProjectId?: string;      // Optional: relationship to parent sub-project
  type: 'experiment' | 'observation' | 'milestone' | 'note';
  tags?: string[];
  duration?: string;
  materials?: string[];
  results?: string;
}

export interface NoteFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  related_projects?: string[];
}
```

### Access Config Type

```typescript
export interface AccessConfig {
  gated: boolean;
  visibility?: 'public' | 'gated' | 'private';
  required_acknowledgment?: string;
  risk_level?: 'low' | 'medium' | 'high';
  allowed_roles?: string[];
  safety_docs?: Array<{
    url: string;
    version: string;
    updated: string;
  }>;
}
```

---

## File Size Limits

| Content Type | Recommended Max | Hard Max | Reason |
|--------------|----------------|----------|--------|
| Markdown files | 500 KB | 1 MB | GitHub rendering limit |
| Images | 1 MB | 5 MB | GitHub file size, performance |
| Data files | N/A | 10 MB | Use external storage for larger |
| Total repo | N/A | 1 GB | GitHub soft limit |

**Note:** For large datasets, use external storage (Supabase Storage, S3, etc.) and link in docs.

---

## Example Complete Repository

See `workspace-template` repo for complete example with all file types and structures.

---

## Changelog

### v2.0 (2025-11-07)
- **MAJOR UPDATE:** Renamed "Streams" → "Sub-Projects" throughout
- Added 4 new database tables: `workspace_settings`, `user_roles`, `reader_acknowledgments`, `reader_suggestions`
- Updated directory structure: flat collections with relationship fields (Keystatic workaround)
- Updated repository naming convention: `workspace-{username}`
- Added comprehensive permission matrix
- Updated RLS policies for owner/reader access model
- Added acknowledgment requirements documentation
- Updated all TypeScript interfaces to reflect new structure

### v1.0 (2025-11-05)
- Initial data structures specification
- Project, stream, update formats defined
- Access configuration schema
- Database schemas
- API payload formats
- Validation rules

---

## Related Documentation

- [08_content_structure_and_branch_workflow.md](../new/08_content_structure_and_branch_workflow.md) - Content structure overview
- [05_Keystatic_Integration.md](../architecture/05_Keystatic_Integration.md) - Keystatic schema configuration
- [06_Supabase_Caching_Strategy.md](../architecture/06_Supabase_Caching_Strategy.md) - Database schemas
- [API_Endpoints.md](./API_Endpoints.md) - API payload formats

---

**Author:** Claude + Ali + Lumen
**Status:** Living Reference Document
**Feedback:** Update as schemas evolve
