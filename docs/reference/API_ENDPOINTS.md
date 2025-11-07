# API Endpoints Reference

**Version:** 2.0 (Self-Hosted Owner/Reader Architecture)
**Last Updated:** November 7, 2025
**Base URL:** `https://workspace-by-{username}.vercel.app` (user's self-hosted instance)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Permission Matrix](#permission-matrix)
3. [Workspace Configuration](#workspace-configuration)
4. [GitHub Integration](#github-integration)
5. [Safety & Gating](#safety--gating)
6. [Reader Management](#reader-management)
7. [Acknowledgments & Suggestions](#acknowledgments--suggestions)
8. [Webhooks](#webhooks)
9. [User & Repo Management](#user--repo-management)
10. [Keystatic Helpers](#keystatic-helpers)
11. [Error Codes](#error-codes)
12. [Rate Limiting](#rate-limiting)

---

## Authentication

All authenticated endpoints require a valid Supabase session cookie or Authorization header.

### Auth Header Format

```
Authorization: Bearer <supabase_access_token>
```

Or use session cookies (preferred for web):
```
Cookie: sb-access-token=<token>; sb-refresh-token=<token>
```

---

## Permission Matrix

### Role-Based Access Control

Workspace by Ali uses a self-hosted architecture with two primary roles:

- **Owner** 🔒: The person who deployed the workspace instance
- **Reader** 👁️: Invited users with read-only access (Phase 2)
- **Public** 🌐: Unauthenticated visitors

### Endpoint Permissions

| Endpoint | Owner | Reader | Public | Notes |
|----------|-------|--------|--------|-------|
| **Workspace Configuration** |||||
| `POST /api/workspace/configure` | ✅ | ❌ | ❌ | Owner setup wizard |
| `GET /api/workspace/settings` | ✅ | ❌ | ❌ | Workspace configuration |
| `PUT /api/workspace/settings` | ✅ | ❌ | ❌ | Update settings |
| **GitHub Integration** |||||
| `POST /api/auth/github-connect` | ✅ | ❌ | ❌ | Owner only |
| `POST /api/repo/fork` | ✅ | ❌ | ❌ | Owner only |
| `POST /api/publish` | ✅ | ❌ | ❌ | Owner only |
| `GET /api/repo/status` | ✅ | ❌ | ❌ | Owner only |
| **Safety & Gating** |||||
| `POST /api/safety/acknowledge` | ✅ | ✅ | ❌ | All authenticated users |
| `GET /api/safety/check/:code` | ✅ | ✅ | ❌ | All authenticated users |
| `GET /api/safety/required/:slug` | ✅ | ✅ | ✅ | Public (limited data) |
| **Reader Management** |||||
| `POST /api/reader/signup` | ❌ | N/A | ✅ | Reader self-signup |
| `GET /api/reader/list` | ✅ | ❌ | ❌ | Owner views readers |
| `PUT /api/reader/:id/approve` | ✅ | ❌ | ❌ | Owner approves readers |
| `DELETE /api/reader/:id` | ✅ | ❌ | ❌ | Owner removes readers |
| **Acknowledgments & Suggestions** |||||
| `GET /api/acknowledgments` | ✅ | ✅ | ❌ | User's own acknowledgments |
| `GET /api/acknowledgments/all` | ✅ | ❌ | ❌ | Owner views all |
| `POST /api/suggestions` | ✅ | ✅ | ❌ | Submit feedback/suggestions |
| `GET /api/suggestions` | ✅ | ❌ | ❌ | Owner views suggestions |
| `PUT /api/suggestions/:id/status` | ✅ | ❌ | ❌ | Owner updates status |
| **Webhooks** |||||
| `POST /api/webhooks/github` | N/A | N/A | N/A | GitHub signature only |
| `POST /api/webhooks/github/setup` | ✅ | ❌ | ❌ | Owner only |
| **User & Repo Management** |||||
| `GET /api/user/repo` | ✅ | ❌ | ❌ | Owner only |
| `DELETE /api/user/repo` | ✅ | ❌ | ❌ | Owner only |
| `POST /api/user/repo/connect` | ✅ | ❌ | ❌ | Owner only |
| **Keystatic Helpers** |||||
| `GET /api/keystatic/token` | ✅ | ❌ | ❌ | Owner only (server-side) |
| `GET /api/keystatic/collections` | ✅ | ❌ | ❌ | Owner only |
| `/keystatic/*` (Admin UI) | ✅ | ❌ | ❌ | Owner only |

### Permission Legend

- ✅ **Allowed:** User can access this endpoint
- ❌ **Forbidden:** Returns 403 Forbidden
- 🌐 **Public:** No authentication required
- 🔒 **Owner Only:** Only workspace owner can access
- 👁️ **Reader Access:** Readers can access (Phase 2)
- N/A: Special authentication (e.g., webhook signature)

### Middleware Protection

Owner-only routes are protected by [src/middleware.ts](../../src/middleware.ts):

```typescript
const ownerOnlyRoutes = [
  '/keystatic',
  '/settings',
  '/setup',
  '/api/repo/',
  '/api/publish',
  '/api/workspace/',
  '/api/webhooks/github/setup',
];

// Middleware checks user_roles table for owner status
const { data: role } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .single();

if (ownerOnlyRoutes.some(route => url.pathname.startsWith(route))) {
  if (role?.role !== 'owner') {
    return new Response('Forbidden', { status: 403 });
  }
}
```

---

## Workspace Configuration

### POST `/api/workspace/configure`

**Description:** Configure workspace settings during owner setup wizard.

**Authentication:** Required (Owner only) 🔒

**Request Body:**
```json
{
  "workspace_name": "Ali's Research Workspace",
  "repo_visibility": "public"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "workspace": {
    "workspace_name": "Ali's Research Workspace",
    "repo_visibility": "public",
    "setup_completed": true,
    "updated_at": "2025-11-07T16:00:00Z"
  }
}
```

**Response (403 Forbidden):**
```json
{
  "error": "forbidden",
  "message": "Only the workspace owner can configure settings"
}
```

**Implementation Notes:**
- Updates `workspace_settings` table
- Marks `setup_completed = true`
- Called from [src/pages/setup.astro](../../src/pages/setup.astro) step 4
- Owner-only endpoint (checked by middleware)

**Example:**
```ts
const response = await fetch('/api/workspace/configure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workspace_name: 'My Workspace',
    repo_visibility: 'public',
  }),
  credentials: 'include',
});
```

---

### GET `/api/workspace/settings`

**Description:** Get current workspace settings.

**Authentication:** Required (Owner only) 🔒

**Response (200 OK):**
```json
{
  "success": true,
  "settings": {
    "user_id": "uuid",
    "workspace_name": "Ali's Research Workspace",
    "repo_visibility": "public",
    "setup_completed": true,
    "created_at": "2025-11-01T10:00:00Z",
    "updated_at": "2025-11-07T16:00:00Z"
  }
}
```

**Implementation Notes:**
- Queries `workspace_settings` table
- Used in settings page and dashboard

---

### PUT `/api/workspace/settings`

**Description:** Update workspace settings.

**Authentication:** Required (Owner only) 🔒

**Request Body:**
```json
{
  "workspace_name": "Updated Workspace Name",
  "repo_visibility": "private"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "settings": {
    "workspace_name": "Updated Workspace Name",
    "repo_visibility": "private",
    "updated_at": "2025-11-07T17:00:00Z"
  }
}
```

**Implementation Notes:**
- Updates `workspace_settings` table
- Triggers `updated_at` timestamp update
- Validates repo_visibility is 'public' or 'private'

---

## GitHub Integration

### POST `/api/auth/github-connect`

**Description:** Secondary GitHub OAuth flow to obtain repo access token.

**Authentication:** Required

**Request Body:**
```json
{
  "code": "github_oauth_code",
  "state": "csrf_state_token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "scopes": ["repo", "read:user"],
  "username": "username"
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "unauthorized",
  "message": "Invalid session"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "invalid_code",
  "message": "GitHub OAuth code invalid or expired"
}
```

**Implementation Notes:**
- Exchanges GitHub OAuth code for access token
- Encrypts token and stores in `user_repos` table
- Validates CSRF state parameter
- Checks token has required scopes

**Example:**
```ts
const response = await fetch('/api/auth/github-connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: urlParams.get('code'),
    state: sessionStorage.getItem('github_oauth_state'),
  }),
  credentials: 'include',
});
```

---

### POST `/api/repo/fork`

**Description:** Fork workspace template repository for new user.

**Authentication:** Required

**Query Parameters:**
- `template_repo` (optional): Template repo to fork. Default: `workspace-by-ali/workspace-template`

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "repo": {
    "owner": "username",
    "name": "workspace-by-username",
    "url": "https://github.com/username/workspace-by-username",
    "branches": ["main", "draft"]
  }
}
```

**Response (409 Conflict):**
```json
{
  "error": "repo_exists",
  "message": "User already has a workspace repository",
  "existing_repo": "https://github.com/username/workspace-by-username"
}
```

**Response (403 Forbidden):**
```json
{
  "error": "no_github_token",
  "message": "GitHub connection required. Please connect your GitHub account.",
  "action": "redirect_to_github_connect"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "github_api_error",
  "message": "Failed to create repository from template",
  "github_error": "API rate limit exceeded"
}
```

**Implementation Notes:**
- Uses `repos.createUsingTemplate` GitHub API
- Creates repo with name format: `workspace-by-<username>`
- Ensures both `main` and `draft` branches exist
- Stores repo info in `user_repos` table
- Idempotent: returns existing repo if already created

**Example:**
```ts
const response = await fetch('/api/repo/fork', {
  method: 'POST',
  credentials: 'include',
});

const data = await response.json();
console.log('Repo created:', data.repo.url);
```

---

### POST `/api/publish`

**Description:** Merge `draft` branch into `main` branch (publish changes).

**Authentication:** Required

**Request Body:**
```json
{
  "commit_message": "Publish updates (optional custom message)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "merge": {
    "sha": "abc123...",
    "merged": true,
    "message": "Merged draft into main"
  },
  "commit_url": "https://github.com/username/workspace-by-username/commit/abc123"
}
```

**Response (204 No Content):**
```json
{
  "success": true,
  "message": "No changes to publish",
  "up_to_date": true
}
```

**Response (409 Conflict):**
```json
{
  "error": "merge_conflict",
  "message": "Cannot automatically merge. Please resolve conflicts manually.",
  "conflicting_files": [
    "content/projects/plasma-design/README.md"
  ],
  "github_url": "https://github.com/username/workspace-by-username/compare/main...draft"
}
```

**Response (403 Forbidden):**
```json
{
  "error": "no_repo",
  "message": "User has no workspace repository"
}
```

**Implementation Notes:**
- Uses `repos.merge` GitHub API
- Merges `draft` → `main`
- Default commit message: "Publish updates from draft"
- Handles fast-forward and squash merges
- Triggers webhook → cache update

**Example:**
```ts
const response = await fetch('/api/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    commit_message: 'Publish new plasma experiments',
  }),
  credentials: 'include',
});

if (response.ok) {
  console.log('Published successfully!');
}
```

---

### GET `/api/repo/status`

**Description:** Get current repository status (ahead/behind, conflicts).

**Authentication:** Required

**Response (200 OK):**
```json
{
  "repo": {
    "owner": "username",
    "name": "workspace-by-username",
    "url": "https://github.com/username/workspace-by-username"
  },
  "branches": {
    "main": {
      "sha": "abc123...",
      "commit_message": "Previous publish",
      "commit_date": "2025-11-04T10:00:00Z"
    },
    "draft": {
      "sha": "def456...",
      "commit_message": "Update plasma project",
      "commit_date": "2025-11-05T15:30:00Z"
    }
  },
  "status": {
    "ahead": 3,
    "behind": 0,
    "diverged": false
  },
  "can_fast_forward": true,
  "has_unpublished_changes": true
}
```

**Implementation Notes:**
- Uses `repos.compareCommits` GitHub API
- Compares `main` and `draft` branches
- Helps UI show "X unpublished changes" badge

**Example:**
```ts
const response = await fetch('/api/repo/status', {
  credentials: 'include',
});

const { status } = await response.json();
if (status.has_unpublished_changes) {
  showPublishButton();
}
```

---

## Safety & Gating

### POST `/api/safety/acknowledge`

**Description:** Log user acknowledgment of safety protocol.

**Authentication:** Required

**Request Body:**
```json
{
  "safety_code": "plasma_safety_v1.3",
  "protocol_url": "/docs/safety/plasma-basics"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "acknowledgment": {
    "safety_code": "plasma_safety_v1.3",
    "acknowledged_at": "2025-11-05T16:00:00Z"
  }
}
```

**Response (409 Conflict):**
```json
{
  "success": true,
  "message": "Already acknowledged",
  "acknowledged_at": "2025-11-04T10:00:00Z"
}
```

**Implementation Notes:**
- Inserts row into `safety_acknowledgments` table
- Idempotent: ignores duplicate acknowledgments
- Used by safety gate middleware

**Example:**
```ts
async function acknowledgeSafety(safetyCode) {
  const response = await fetch('/api/safety/acknowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ safety_code: safetyCode }),
    credentials: 'include',
  });

  if (response.ok) {
    window.location.reload(); // Refresh to show gated content
  }
}
```

---

### GET `/api/safety/check/:safety_code`

**Description:** Check if current user has acknowledged a safety protocol.

**Authentication:** Required

**Path Parameters:**
- `safety_code`: The safety protocol code (e.g., `plasma_safety_v1.3`)

**Response (200 OK - Acknowledged):**
```json
{
  "acknowledged": true,
  "safety_code": "plasma_safety_v1.3",
  "acknowledged_at": "2025-11-04T10:00:00Z"
}
```

**Response (200 OK - Not Acknowledged):**
```json
{
  "acknowledged": false,
  "safety_code": "plasma_safety_v1.3"
}
```

**Implementation Notes:**
- Queries `safety_acknowledgments` table
- Used by middleware and client-side checks

**Example:**
```ts
const response = await fetch('/api/safety/check/plasma_safety_v1.3', {
  credentials: 'include',
});

const { acknowledged } = await response.json();

if (!acknowledged) {
  showSafetyModal();
}
```

---

### GET `/api/safety/required/:project_slug`

**Description:** Get required safety acknowledgments for a project/stream.

**Authentication:** Optional (public endpoint)

**Path Parameters:**
- `project_slug`: Project slug (e.g., `plasma-design`)

**Query Parameters:**
- `stream_slug` (optional): Stream slug for nested gating

**Response (200 OK):**
```json
{
  "gated": true,
  "required_acknowledgments": [
    {
      "safety_code": "plasma_safety_v1.3",
      "risk_level": "high",
      "doc_url": "/docs/safety/plasma-basics",
      "version": "1.3"
    }
  ],
  "user_status": {
    "authenticated": true,
    "acknowledged": false,
    "missing_codes": ["plasma_safety_v1.3"]
  }
}
```

**Response (200 OK - Not Gated):**
```json
{
  "gated": false,
  "required_acknowledgments": []
}
```

**Implementation Notes:**
- Parses `.access.yml` from GitHub repo
- Checks user's acknowledgment status if authenticated
- Public endpoint (works without auth, but returns limited info)

---

## Reader Management

**Note:** Reader features are planned for Phase 2. These endpoints are documented for future implementation.

### POST `/api/reader/signup`

**Description:** Reader self-signup for workspace access (public endpoint).

**Authentication:** Optional (creates pending reader account)

**Request Body:**
```json
{
  "email": "reader@example.com",
  "full_name": "Jane Smith",
  "reason": "Interested in your AI safety research"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Signup request submitted. The workspace owner will review your request.",
  "status": "pending"
}
```

**Response (409 Conflict):**
```json
{
  "error": "already_registered",
  "message": "This email is already registered",
  "status": "pending" | "approved" | "rejected"
}
```

**Implementation Notes:**
- Creates row in `user_roles` table with `role = 'reader'`, `status = 'pending'`
- Sends email notification to workspace owner
- Reader cannot access content until owner approves
- **Phase 2 Feature** (not yet implemented)

**Example:**
```ts
const response = await fetch('/api/reader/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'reader@example.com',
    full_name: 'Jane Smith',
    reason: 'Interested in your research',
  }),
});
```

---

### GET `/api/reader/list`

**Description:** Get list of all readers (pending, approved, rejected).

**Authentication:** Required (Owner only) 🔒

**Query Parameters:**
- `status` (optional): Filter by status ('pending' | 'approved' | 'rejected')

**Response (200 OK):**
```json
{
  "success": true,
  "readers": [
    {
      "id": "uuid",
      "email": "reader@example.com",
      "full_name": "Jane Smith",
      "role": "reader",
      "status": "pending",
      "reason": "Interested in your AI safety research",
      "requested_at": "2025-11-07T10:00:00Z",
      "approved_at": null
    },
    {
      "id": "uuid",
      "email": "approved@example.com",
      "full_name": "John Doe",
      "role": "reader",
      "status": "approved",
      "approved_at": "2025-11-06T15:00:00Z",
      "last_active": "2025-11-07T09:00:00Z"
    }
  ],
  "counts": {
    "pending": 5,
    "approved": 12,
    "rejected": 2
  }
}
```

**Implementation Notes:**
- Queries `user_roles` table where `role = 'reader'`
- Owner can see pending requests and manage readers
- **Phase 2 Feature** (not yet implemented)

**Example:**
```ts
// Get only pending readers
const response = await fetch('/api/reader/list?status=pending', {
  credentials: 'include',
});
```

---

### PUT `/api/reader/:id/approve`

**Description:** Approve or reject a reader signup request.

**Authentication:** Required (Owner only) 🔒

**Path Parameters:**
- `id`: Reader user ID (UUID)

**Request Body:**
```json
{
  "action": "approve" | "reject",
  "message": "Welcome to my workspace!" (optional)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "reader": {
    "id": "uuid",
    "email": "reader@example.com",
    "status": "approved",
    "approved_at": "2025-11-07T16:00:00Z"
  },
  "notification_sent": true
}
```

**Implementation Notes:**
- Updates `user_roles` table: `status = 'approved'` or `'rejected'`
- Sends email notification to reader
- Creates Supabase auth account if approved
- **Phase 2 Feature** (not yet implemented)

**Example:**
```ts
const response = await fetch(`/api/reader/${readerId}/approve`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'approve',
    message: 'Welcome! Glad to have you here.',
  }),
  credentials: 'include',
});
```

---

### DELETE `/api/reader/:id`

**Description:** Remove a reader from the workspace.

**Authentication:** Required (Owner only) 🔒

**Path Parameters:**
- `id`: Reader user ID (UUID)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reader removed successfully"
}
```

**Response (404 Not Found):**
```json
{
  "error": "not_found",
  "message": "Reader not found"
}
```

**Implementation Notes:**
- Deletes row from `user_roles` table
- Revokes reader's authentication
- Deletes related `reader_acknowledgments` and `reader_suggestions`
- **Phase 2 Feature** (not yet implemented)

---

## Acknowledgments & Suggestions

### GET `/api/acknowledgments`

**Description:** Get current user's safety acknowledgments.

**Authentication:** Required (Owner and Reader)

**Response (200 OK):**
```json
{
  "success": true,
  "acknowledgments": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "safety_code": "plasma_safety_v1.3",
      "protocol_url": "/docs/safety/plasma-basics",
      "acknowledged_at": "2025-11-05T10:00:00Z"
    },
    {
      "id": "uuid",
      "user_id": "uuid",
      "safety_code": "bio_safety_v2.0",
      "protocol_url": "/docs/safety/biosafety",
      "acknowledged_at": "2025-11-03T14:30:00Z"
    }
  ]
}
```

**Implementation Notes:**
- Queries `reader_acknowledgments` table for current user
- Both owners and readers can view their own acknowledgments
- Used in user profile and safety history

---

### GET `/api/acknowledgments/all`

**Description:** Get all acknowledgments across all users (owner dashboard).

**Authentication:** Required (Owner only) 🔒

**Response (200 OK):**
```json
{
  "success": true,
  "acknowledgments": [
    {
      "user_id": "uuid",
      "user_email": "reader@example.com",
      "user_name": "Jane Smith",
      "safety_code": "plasma_safety_v1.3",
      "acknowledged_at": "2025-11-05T10:00:00Z"
    }
  ],
  "summary": {
    "total_users": 15,
    "total_acknowledgments": 42,
    "by_protocol": {
      "plasma_safety_v1.3": 12,
      "bio_safety_v2.0": 8
    }
  }
}
```

**Implementation Notes:**
- Owner can see all reader acknowledgments
- Used for safety compliance monitoring
- Helps owner understand which readers have access to gated content

---

### POST `/api/suggestions`

**Description:** Submit a suggestion or feedback (readers and owner).

**Authentication:** Required (Owner and Reader)

**Request Body:**
```json
{
  "title": "Add dark mode toggle",
  "description": "It would be great to have a dark mode option for better readability at night.",
  "category": "feature" | "bug" | "improvement" | "question",
  "related_project": "plasma-design" (optional)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "suggestion": {
    "id": "uuid",
    "title": "Add dark mode toggle",
    "description": "...",
    "category": "feature",
    "status": "pending",
    "submitted_by": "uuid",
    "submitted_at": "2025-11-07T16:00:00Z"
  }
}
```

**Implementation Notes:**
- Inserts into `reader_suggestions` table
- Readers can provide feedback on workspace content
- Owner receives notification
- **Phase 2 Feature** (not yet implemented)

---

### GET `/api/suggestions`

**Description:** Get all suggestions (owner view) or user's own suggestions (reader view).

**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status ('pending' | 'in_progress' | 'completed' | 'rejected')
- `category` (optional): Filter by category

**Response (200 OK - Owner):**
```json
{
  "success": true,
  "suggestions": [
    {
      "id": "uuid",
      "title": "Add dark mode toggle",
      "description": "...",
      "category": "feature",
      "status": "pending",
      "submitted_by": "uuid",
      "submitter_name": "Jane Smith",
      "submitter_email": "reader@example.com",
      "submitted_at": "2025-11-07T16:00:00Z",
      "response": null
    }
  ],
  "counts": {
    "pending": 12,
    "in_progress": 3,
    "completed": 25,
    "rejected": 5
  }
}
```

**Response (200 OK - Reader):**
```json
{
  "success": true,
  "suggestions": [
    {
      "id": "uuid",
      "title": "Add dark mode toggle",
      "category": "feature",
      "status": "pending",
      "submitted_at": "2025-11-07T16:00:00Z",
      "response": null
    }
  ]
}
```

**Implementation Notes:**
- Owners see all suggestions with submitter info
- Readers only see their own suggestions
- Queries `reader_suggestions` table with appropriate filters

---

### PUT `/api/suggestions/:id/status`

**Description:** Update suggestion status and add response (owner only).

**Authentication:** Required (Owner only) 🔒

**Path Parameters:**
- `id`: Suggestion ID (UUID)

**Request Body:**
```json
{
  "status": "in_progress" | "completed" | "rejected",
  "response": "Thanks for the suggestion! I'm working on this now."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "suggestion": {
    "id": "uuid",
    "status": "in_progress",
    "response": "Thanks for the suggestion! I'm working on this now.",
    "updated_at": "2025-11-07T17:00:00Z"
  },
  "notification_sent": true
}
```

**Implementation Notes:**
- Updates `reader_suggestions` table
- Sends email notification to suggestion submitter
- Owner can communicate progress to readers
- **Phase 2 Feature** (not yet implemented)

---

## Webhooks

### POST `/api/webhooks/github`

**Description:** GitHub webhook receiver for repo push events.

**Authentication:** GitHub webhook signature (HMAC)

**Headers:**
```
X-GitHub-Event: push
X-Hub-Signature-256: sha256=<hmac>
X-GitHub-Delivery: <uuid>
```

**Request Body (example):**
```json
{
  "ref": "refs/heads/draft",
  "repository": {
    "owner": { "login": "username" },
    "name": "workspace-by-username",
    "html_url": "https://github.com/username/workspace-by-username"
  },
  "commits": [
    {
      "id": "abc123...",
      "message": "Update plasma project",
      "timestamp": "2025-11-05T15:30:00Z",
      "added": ["content/projects/new-project/README.md"],
      "modified": ["content/projects/plasma-design/README.md"],
      "removed": []
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "processed": {
    "projects_updated": 2,
    "streams_updated": 1,
    "cache_synced": true
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "invalid_signature",
  "message": "Webhook signature verification failed"
}
```

**Implementation Notes:**
- Verifies HMAC signature using webhook secret
- Only processes `push` events to `draft` branch
- Updates `project_cache` and `stream_cache` tables
- Parses frontmatter from changed files
- Ignores non-content file changes

**Webhook Setup:**
```bash
# In user's repo settings → Webhooks
Payload URL: https://workspace-by-ali.vercel.app/api/webhooks/github
Content type: application/json
Secret: <webhook_secret_from_env>
Events: Just the push event
```

---

### POST `/api/webhooks/github/setup`

**Description:** Automatically setup webhook on user's repository.

**Authentication:** Required

**Request Body:**
```json
{
  "events": ["push"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "webhook": {
    "id": 123456,
    "url": "https://workspace-by-ali.vercel.app/api/webhooks/github",
    "events": ["push"],
    "active": true
  }
}
```

**Response (409 Conflict):**
```json
{
  "success": true,
  "message": "Webhook already exists",
  "webhook": { /* existing webhook */ }
}
```

**Implementation Notes:**
- Uses `repos.createWebhook` GitHub API
- Automatically called after repo fork
- Sets webhook secret from environment variable
- Idempotent: skips if webhook already exists

---

## User & Repo Management

### GET `/api/user/repo`

**Description:** Get current user's workspace repository info.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "repo": {
    "id": "uuid",
    "owner": "username",
    "name": "workspace-by-username",
    "url": "https://github.com/username/workspace-by-username",
    "created_at": "2025-11-01T10:00:00Z",
    "has_webhook": true
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "no_repo",
  "message": "User has no workspace repository",
  "action": "create_repo"
}
```

**Implementation Notes:**
- Queries `user_repos` table
- Used for onboarding flow (redirect to fork if no repo)

---

### DELETE `/api/user/repo`

**Description:** Disconnect workspace repository (does not delete GitHub repo).

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Workspace repository disconnected"
}
```

**Implementation Notes:**
- Deletes row from `user_repos` table
- Does NOT delete actual GitHub repository
- User can reconnect by forking again
- Use case: switch to different repo

---

### POST `/api/user/repo/connect`

**Description:** Connect an existing GitHub repository as workspace.

**Authentication:** Required

**Request Body:**
```json
{
  "repo_owner": "username",
  "repo_name": "my-custom-workspace"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "repo": {
    "owner": "username",
    "name": "my-custom-workspace",
    "url": "https://github.com/username/my-custom-workspace"
  },
  "validation": {
    "has_content_structure": true,
    "has_main_branch": true,
    "has_draft_branch": true,
    "has_keystatic_config": true
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "invalid_structure",
  "message": "Repository does not have required workspace structure",
  "missing": ["content/ directory", "draft branch"]
}
```

**Implementation Notes:**
- Allows users to connect existing repo instead of forking
- Validates repo has required structure
- Useful for migration or advanced users

---

## Keystatic Helpers

### GET `/api/keystatic/token`

**Description:** Get GitHub token for Keystatic (server-side only).

**Authentication:** Required

**Response (200 OK):**
```json
{
  "token": "ghp_xxxxxxxxxxxxx",
  "repo": {
    "owner": "username",
    "name": "workspace-by-username"
  },
  "scopes": ["repo", "read:user"]
}
```

**Response (403 Forbidden):**
```json
{
  "error": "no_token",
  "message": "GitHub connection required"
}
```

**Security Notes:**
- **NEVER call from client JavaScript**
- Only used by Keystatic server-side operations
- Token decrypted on-demand from Supabase
- Short-lived response (not cached)

---

### GET `/api/keystatic/collections`

**Description:** Get available Keystatic collections for current user.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "collections": [
    {
      "name": "projects",
      "label": "Projects",
      "path": "content/projects/*",
      "count": 12
    },
    {
      "name": "streams",
      "label": "Streams",
      "path": "content/projects/*/streams/*",
      "count": 45
    },
    {
      "name": "updates",
      "label": "Updates",
      "path": "content/projects/*/streams/*/updates/*",
      "count": 230
    }
  ]
}
```

**Implementation Notes:**
- Returns collection metadata
- Counts fetched from cache (not Git)
- Used for dashboard stats

---

## Error Codes

### Standard Error Response Format

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": { /* optional additional context */ }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `unauthorized` | 401 | Missing or invalid authentication |
| `forbidden` | 403 | Authenticated but lacks permission |
| `not_found` | 404 | Resource does not exist |
| `repo_exists` | 409 | Repository already exists |
| `merge_conflict` | 409 | Cannot auto-merge branches |
| `invalid_code` | 400 | Invalid OAuth code |
| `invalid_signature` | 400 | Webhook signature mismatch |
| `github_api_error` | 500 | GitHub API returned error |
| `rate_limit` | 429 | Too many requests |
| `internal_error` | 500 | Unexpected server error |

---

## Rate Limiting

### Per-User Limits

| Endpoint | Limit | Window | Exceeded Response |
|----------|-------|--------|-------------------|
| `/api/publish` | 10 requests | 1 minute | 429 Too Many Requests |
| `/api/repo/fork` | 1 request | 1 hour | 429 Too Many Requests |
| `/api/safety/*` | 100 requests | 1 minute | 429 Too Many Requests |
| `/api/webhooks/*` | N/A | N/A | Signed only |

**Rate Limit Response:**
```json
{
  "error": "rate_limit",
  "message": "Too many requests. Please try again later.",
  "retry_after": 45,
  "limit": 10,
  "window": "1 minute"
}
```

**Headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699200000
Retry-After: 45
```

---

## GitHub API Rate Limits

### Considerations

GitHub enforces rate limits:
- **Authenticated requests:** 5,000/hour
- **Webhook deliveries:** Not counted toward limit

### Mitigation Strategies

1. **Cache aggressively** - Use Supabase cache for reads
2. **Batch operations** - Group multiple changes into single commit
3. **Webhook sync** - Use webhooks instead of polling
4. **Conditional requests** - Use ETags when possible

### Checking GitHub Rate Limit

```ts
const octokit = new Octokit({ auth: token });
const { data } = await octokit.rateLimit.get();

console.log(`Remaining: ${data.rate.remaining}/${data.rate.limit}`);
console.log(`Resets at: ${new Date(data.rate.reset * 1000)}`);
```

---

## Example: Complete User Flow

### 1. User Signup

```ts
// User logs in with Supabase GitHub OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
});
```

### 2. Connect GitHub (Secondary OAuth)

```ts
// Redirect to GitHub OAuth with repo scope
window.location.href = '/api/auth/github-connect';

// After redirect back:
const code = new URLSearchParams(window.location.search).get('code');
await fetch('/api/auth/github-connect', {
  method: 'POST',
  body: JSON.stringify({ code }),
});
```

### 3. Fork Workspace Template

```ts
const { repo } = await fetch('/api/repo/fork', {
  method: 'POST',
}).then(r => r.json());

console.log('Workspace created:', repo.url);
```

### 4. Setup Webhook

```ts
await fetch('/api/webhooks/github/setup', {
  method: 'POST',
});
```

### 5. Edit Content in Keystatic

```ts
// User navigates to /keystatic
// Edits projects, saves → commits to draft branch
```

### 6. Publish Changes

```ts
await fetch('/api/publish', {
  method: 'POST',
});

// Webhook fires → cache updated
```

### 7. Access Gated Content

```ts
// Check if gated
const { gated, user_status } = await fetch(
  '/api/safety/required/plasma-design'
).then(r => r.json());

if (gated && !user_status.acknowledged) {
  // Show safety modal
  showSafetyModal();
}

// After user agrees:
await fetch('/api/safety/acknowledge', {
  method: 'POST',
  body: JSON.stringify({
    safety_code: 'plasma_safety_v1.3',
  }),
});

// Refresh page → content now accessible
window.location.reload();
```

---

## Testing Endpoints

### Using cURL

```bash
# Get repo status
curl -X GET https://workspace-by-ali.vercel.app/api/repo/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"

# Publish changes
curl -X POST https://workspace-by-ali.vercel.app/api/publish \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"commit_message": "Test publish"}'

# Check safety acknowledgment
curl https://workspace-by-ali.vercel.app/api/safety/check/plasma_safety_v1.3 \
  -H "Authorization: Bearer <token>"
```

### Using Postman

Import this collection:
```json
{
  "info": { "name": "Workspace API" },
  "item": [
    {
      "name": "Fork Repo",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/repo/fork"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://workspace-by-ali.vercel.app"
    }
  ]
}
```

---

## Changelog

### v1.0 (2025-11-05)
- Initial API specification
- GitHub integration endpoints
- Safety & gating endpoints
- Webhook support
- Keystatic helpers

---

## Related Documentation

- [01_Phase1_Git_First_MVP.md](../implementation/01_Phase1_Git_First_MVP.md) - Implementation guide
- [05_Keystatic_Integration.md](../architecture/05_Keystatic_Integration.md) - Keystatic setup
- [06_Supabase_Caching_Strategy.md](../architecture/06_Supabase_Caching_Strategy.md) - Caching details
- [07_Safety_Protocol_System.md](../architecture/07_Safety_Protocol_System.md) - Safety system

---

**Author:** Claude + Ali + Lumen
**Status:** Living Document - Update as APIs evolve
**Feedback:** Report issues or suggest improvements via GitHub Issues
