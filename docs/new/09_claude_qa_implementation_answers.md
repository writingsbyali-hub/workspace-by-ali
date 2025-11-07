# 09\_Claude QA – Implementation Answers (MVP Git‑First Build)

**Context:** This doc answers Claude’s latest implementation questions (merge endpoint, Commons structure, Keystatic usage, caching, etc.) based on Ali’s preferences and the Git‑first + Keystatic architecture.

---

## 1. Commons Structure (Repo vs Folder)

**Decision:** **Commons = separate repos (and/or org), not a folder inside personal workspaces.**

Model:

- **Personal Workspace repos** (per user):

  - `ali/workspace-by-ali`
  - `userX/workspace-by-`ali
  - Contain the full `content/projects/.../streams/...` hierarchy for that user.

- **Commons repos** (per project/stream, under ARC^ or any dedicated org/group etc):

  - `arcup-commons/plasma-design`
  - `arcup-commons/chemistry-pollution-degradation`

**Flow:**

- Users **work in their own workspace repo**.
  - They can have their own projects (public or private) or they can Join a Stream (join another org's project, get access and work with them - what is merged or PR to the Commons repo depends on the arrangment, it could be data - its usually not updates/log/notes etc)
- When they are ready to contribute to a Commons project, they:
  - Fork / or create PR from their repo to the relevant Commons repo.
- arc^/Commons maintainers review and merge.

So we’re effectively using **Option 3** from Claude’s list:

> Commons = Separate repo users contribute to.

There is **no ****************************************************************************************************************commons/**************************************************************************************************************** folder** inside personal workspaces — that would blur ownership and responsibilities.

- THE COMMONS BELONGS ON THE ORGS GIT REPO

---

## 2. /api/publish → How Merge Happens

**Decision:** For personal workspaces (single‑owner by default), use **direct GitHub API merge** for MVP.

**Branch model recap:**

- `draft` = Keystatic writes here (user edits).
- `main`  = published site content.

**Publish flow:**

1. User clicks **Publish** in the Workspace UI.
2. UI calls our backend route `/api/publish`.
3. `/api/publish` (server‑side) uses Octokit with the **user’s token** to run:

```ts
await octokit.repos.merge({
  owner: '<user>',
  repo: 'workspace-by-<user>',
  base: 'main',  // target
  head: 'draft', // source
});
```

**Why Option 1 (direct merge):**

- Simple and understandable.
- Works well for **single‑owner repos**.
- We can add PR‑based review later for multi‑maintainer Commons repos.

**Future:**

- Commons repos can use **PR + review** (Option 3) and/or **GitHub Actions** if we need automated checks.

---

## 3. Keystatic UI vs Astro Forms – When Each Is Used

**Decision:** MVP keeps **both** Keystatic and Astro forms.

### Keystatic

- **Usage:**
  - Full editing of:
    - Project `README.md`
    - Stream `README.md`
    - Updates in `updates/`
    - Longer notes and docs.
- **Audience:** Users who want a **richer editor** and are willing to learn the CMS UI.

### Astro Forms (existing / future custom forms)

- **Usage:**
  - Quick actions such as:
    - "Create new project" (minimal fields).
    - "Add quick update" (simple textarea).
  - These forms commit to the same repo/branch via GitHub API.
- **Audience:** Users who just want **simple forms** and don’t care about the full CMS experience.

### Roadmap

- **Phase 1 (MVP):** Keystatic + forms coexist.
  - little hyperlink to 'open' form -> shows keystatic. &#x20;

  - If Keystatic proves comfortable, we can gradually move more editing into Keystatic and let forms become specialized “shortcuts” or onboarding helpers.



---

## 4. Keystatic + Nested Collections on Vercel

**Plan:**

- We assume Keystatic **can handle nested collections** with `path: 'content/projects/*/streams/*'` etc. (this matches their documented pattern).
- The general consensus is that **Keystatic is designed to handle nested glob paths effectively**, even on Vercel, provided the structure adheres to standard file system practices.
  ### 1. Glob Path Verification (Success Likely)
  Keystatic uses a robust pattern matching system. Your path, `'content/projects/*/streams/*'`, is a **standard and supported glob pattern**.
  - **Keystatic Documentation:** Keystatic officially supports collections defined by glob paths, which makes your desired structure the intended use case for deeply related content.
  - **Vercel Compatibility:** Since Keystatic primarily interacts with content via Git (or local file system), and the build step simply reads these files, Vercel's deployment environment doesn't typically interfere with how Keystatic *discovers* the files during the build process. The content structure should be fine.
  ### 2. Performance and UX Implications (Monitor Closely)
  This remains the **most critical area to monitor** for large projects.
  - **Performance:** The main risk isn't Keystatic's ability to read the files, but the **loading time and memory usage** of the content editor when dealing with *thousands* of deeply nested items. If a `projects` collection contains hundreds of projects, each with dozens of `streams`, the overall collection list can become large.
  - **UX (Author Experience):** While Keystatic's UI is generally good, having a massive list of content items where the distinction between `project-a/stream-1` and `project-z/stream-1` is only visible in the breadcrumbs might become visually confusing for content editors if they aren't using search/filtering.
  ---
  ## 💡 Recommendation: Proceed with the Nested Plan
  Based on the findings, you should **proceed with your initial plan** (the nested structure) as it is the most intuitive for authors.
  ### Key Focus Areas During Implementation:
  | **Action**               | **Why It's Important**                                                                                                                                                                                                                    |
  | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **Test the Scale**       | After setting up a few projects, duplicate them to simulate a **medium-to-large content tree** (e.g., 50 projects, 10 streams each). Verify that Keystatic's list views load quickly and are responsive on a deployed Vercel environment. |
  | **Review Editor UX**     | Ensure your content team finds the **navigation intuitive**. The nested paths will appear clearly in the Keystatic item list and breadcrumbs (e.g., `projects > project-A > streams > stream-1`).                                         |
  | **Add Filtering/Search** | If the list becomes unwieldy, confirm that Keystatic's **built-in search and filtering** within the collection works fast and effectively to find specific nested items.                                                                  |
  ---
  Your original plan's structure—**assume nested works, then verify performance**—is the perfect path forward.

If there are limitations, fallback options:

- Use flatter paths but keep the same conceptual model (e.g., encoded slugs).
- Or define separate collections per level and join via metadata.

But **design target** remains the nested structure defined in `08_Content_Structure_and_Branch_Workflow`.

---

## 5. Git LFS and Large Files

**Decision:** **No Git LFS required for MVP.**

For Phase 1:

- Enforce a **max file size** for uploads in Workspace/Keystatic (e.g. 5–10 MB per file).
- Recommend that larger datasets be stored externally:
  - Supabase Storage,
  - S3/Backblaze,
  - or a separate data repo using LFS.

We can:

- Add `datasets/` with **links** to external storage instead of large binaries.

**Phase 2+:** We can introduce **Git LFS** as an advanced option, but it requires user CLI setup and might be confusing for non‑technical users.

---

## 6. Safety Modal UX (MVP)

**Decision:** Start with **Option A: Simple modal with acknowledgment + link to safety docs.**

### MVP Flow

1. User clicks gated project/stream.
2. Astro detects `gated: true` and checks Supabase for `safety_code` acknowledgment.
3. If missing, show a modal with:

Example content:

> ⚠️ This content involves potentially hazardous work.\
> You must read and understand the safety documentation before continuing.

- [View Safety Protocol] (link to canonical safety doc)
- Checkbox: `□ I have read and understood the safety protocols`
- Button: **Agree & Continue**

4. On confirm, call `/api/safety/acknowledge`:
   - Writes `(user_id, safety_code)` to `safety_acknowledgments`.

### Later Enhancements (non‑MVP):

- Required scroll to end of doc.
- Multi‑question quiz.
- Versioned change log highlighting what changed since last version.

For MVP, **no quiz** — just explicit acknowledgment plus logged record.

---

## 7. Supabase Metadata Cache Schema (Projects & Streams)

**Decision:** Yes, use a **lightweight metadata cache** in Supabase, inspired by Claude’s suggestion.

### Purpose

- Fast dashboard rendering.
- Filtering/search by visibility, stream, tags.
- Commons discovery and indexing.

### Proposed Schema (can be refined during implementation)

```sql
create table project_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  repo_url text not null,
  project_slug text not null,
  title text,
  visibility text check (visibility in ('public', 'gated', 'private')),
  gated boolean default false,
  last_updated timestamp,
  stream_count int default 0,
  synced_at timestamp default now()
);

create index idx_project_cache_user on project_cache(user_id);
create index idx_project_cache_visibility on project_cache(visibility);

create table stream_cache (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references project_cache(id) on delete cascade,
  stream_slug text not null,
  title text,
  gated boolean default false,
  update_count int default 0,
  last_updated timestamp,
  synced_at timestamp default now()
);

create index idx_stream_cache_project on stream_cache(project_id);
```

**Source of truth remains Git** — this cache is only for speed and UX.

Updates:

- A GitHub webhook on `push` → Supabase Edge Function parses changed files → updates cache rows.

---

## 8. Fork‑on‑Signup Flow (Template and Branches)

**Decision:** Use a **dedicated template repo**, *not* Ali’s live workspace repo.

### Template Repo

- Name: e.g. `workspace-template` (under Ali or a dedicated org, e.g. `workspace-by-ali/workspace-template`).
- Contains:
  - `content/` structure (projects/, notes/, streams placeholder if needed).
  - `keystatic.config.ts` basic setup.
  - `main` and `draft` branches **pre‑created**.
  - Minimal README with instructions.

### Signup Flow

1. User logs in via Supabase GitHub OAuth.
2. Backend checks Supabase: does user already have a workspace repo URL stored?
3. If not:
   - Use GitHub API to **create a new repo** from the template ("Generate from template" if supported, or fork+rename):
     - Name: `workspace-by-<username>`.
     - Default branches: `main` and `draft`.
   - Store (user\_id, repo\_url) in Supabase.
4. Redirect user to their own workspace (e.g., `workspace-by-<username>.vercel.app` or a multi‑tenant route).

This avoids cluttering Ali’s personal repo forks and makes the template clearly reusable and public.

---

## 9. Performance & Caching Strategy (Nested Collections)

**Concerns:** Keystatic will need to read multiple files for:

- Project list view.
- Streams list per project.
- Updates list per stream.

**Strategy:**

- **Public site pages**: Ideally built statically with Astro.

  - They can pull from Git at build time (or from Supabase cache).
  - No runtime GitHub API calls for anonymous visitors.

- **Dashboard / authenticated views**:

  - For list views, query **Supabase cache** only (no GitHub call).
  - Click into a specific item → fetch the content file from GitHub.

Rough target:

- 1 GitHub call per detailed view (project/stream/update) **only when necessary**.
- Lists and dashboards → 0 GitHub calls at request time (Supabase only).

This keeps us well within rate limits, even with nested structures.

---

## 10. Streams Relationship – Clarification

**Final model:**

- **Commons** → conceptual level & repo level (ArcUp and its Commons repos).
- **Project** → a full research project inside a workspace or Commons.
- **Stream** → a *sub‑project / work package inside a Project*.

So we are **not** using “streams” as cross‑project tags (in the Git structure). Instead:

```bash
content/projects/<project-slug>/streams/<stream-slug>/...
```

Cross‑project relationships ("this stream relates to that other project") can be expressed later via metadata fields, but structurally **streams live under projects**.

---

## 11. Summary of Key Choices (for Claude)

- **Commons:** separate repos under an org (e.g. `arcup-commons/...`), not folders inside personal workspaces.
- **Publishing:** `/api/publish` uses direct GitHub merge (draft → main) for personal workspaces.
- **Editing:** Keystatic for full edits; Astro forms for quick/simple actions; both commit to `draft`.
- **Nested content:** Projects/streams/updates organized in nested folders; Keystatic collections map onto these paths.
- **Large files:** No Git LFS in MVP; use file size limits and external storage when needed.
- **Safety gating:** Simple modal with link to docs + explicit acknowledgment, logged in Supabase.
- **Metadata cache:** `project_cache` + `stream_cache` tables in Supabase, populated from GitHub webhooks.
- **Signup:** Use a dedicated `workspace-template` repo; generate per‑user `workspace-by-<username>` repos with main+draft branches.
- **Performance:** Public pages static; dashboards backed by Supabase cache; GitHub API used mainly for detail views and writes.

---

**Author:** Lumen × Ali\
**Version:** 1.0\
**Date:** 2025-11-05

