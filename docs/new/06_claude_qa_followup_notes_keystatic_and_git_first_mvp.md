# 06_Claude QA Follow-up Notes — Keystatic, Caching, and Git-First MVP

## 1. CMS Decision — Keystatic Adoption

Ali prefers **Keystatic** over DecapCMS.

### Why Keystatic fits better
- **Modern, actively maintained**, built by Thinkmill.
- Supports **complex nested structures**, relations, and modular fields (projects/streams/updates fit naturally).
- **Local-first philosophy** — can save edits locally before publishing (reduces conflict risk).
- **Works beautifully with Astro**, Next.js, and static site setups.
- **Visual and developer-friendly**: markdown + JSON hybrid UI.
- Can run fully **Git-backed**, no external database.
- Can optionally sync with CMS UI or via command line for contributors.

### How it integrates
- Each workspace includes a Keystatic config in root (`keystatic.config.ts`).
- When user edits content:
  - They can save drafts locally.
  - Publishing commits and pushes directly to their GitHub repo.
- This flow supports offline edits → publish pushes = safer, cleaner Git history.

**Example config outline:**
```ts
import { config, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'username/workspace-by-username',
  },
  collections: {
    projects: collection({
      label: 'Projects',
      path: 'content/projects/*',
      schema: {
        title: { type: 'text' },
        status: { type: 'select', options: ['draft', 'published'] },
        visibility: { type: 'select', options: ['public', 'gated', 'private'] },
        stream: { type: 'text' },
        body: { type: 'markdown' },
      }
    }),
  }
});
```

### Final stance
✅ Keystatic will replace DecapCMS for the MVP.  
✅ Astro forms remain available for light interactions.  
✅ Architecture remains CMS-agnostic.

---

## 2. Supabase as Lightweight Metadata Cache

We’ll use **Supabase only for read caching and safety logging**, not data storage.

### Cache contents
- Project titles, IDs, and basic metadata (visibility, stream, status, tags).
- Used for rendering fast dashboards or Commons index.
- Git remains the **source of truth**.

### Flow
1. User edits → Keystatic commit to GitHub.
2. GitHub webhook triggers Supabase Edge Function.
3. Supabase updates cache (title, last updated, etc.).
4. Workspace UI queries Supabase for list view → fetches full data from Git if needed.

**Outcome:** Fast load, minimal Git API calls, full data still Git-native.

---

## 3. Status in Frontmatter & Commit Logic

- `status:` field lives in Markdown/JSON frontmatter.
- Users can toggle between `draft` and `published`.
- **Save = local** (Keystatic local cache).  
  **Publish = commit & push** (to GitHub).

### Why this works
- Local saves avoid constant Git traffic.
- Conflicts reduced because edits are reconciled only when pushed.
- Keeps intentional history: every commit = meaningful publish.

---

## 4. Git-First Now (Migration Skipped)

Ali confirmed: Supabase has only test data; migration unnecessary.

**Decision:** Go directly to **Git-first MVP**.  
- Supabase limited to: authentication, safety logs, metadata cache.
- All project/stream/update data now lives in GitHub repos.
- No dual-write or legacy migration required.

---

## 5. Workflows & CLI Integration

- Default: Push commits directly to GitHub.
- Optional: Enable GitHub Actions or CLI workflows for advanced users.

Examples:
- Auto-lint markdown or validate frontmatter on commit.
- Generate visual previews of experiments or diagrams.

**User choice:**
- Beginner → uses Keystatic UI (pushes directly).
- Advanced → enables workflows or uses command line (`git push`, `gh workflow run`).

---

## 6. Authentication Flow Simplified

Ali agrees to use **Supabase for auth + safety**, and a **secondary GitHub connect** for token-scoped access.

### Flow:
1. User logs in via Supabase GitHub OAuth (for identity).
2. UI checks if token is accessible.
   - If not → prompts user to **“Connect GitHub”**.
3. Secondary GitHub OAuth (minimal scopes):
   - `repo` (read/write), `read:user`.
4. Token stored encrypted in Supabase or backend edge function.
5. Session-limited; never exposed client-side.

**Result:**
- Safe separation of auth and repo access.
- Flexible for both personal and Commons repos.

---

## 7. New Markdown for Claude — Follow-Up Topics

To discuss next:
1. **Keystatic Implementation Details** — confirm its GitHub backend flow with Vercel.
2. **Local Draft Storage** — confirm if Keystatic supports IndexedDB caching.
3. **Token Storage** — verify Supabase’s ability to securely store provider tokens.
4. **Commons Index Design** — how to structure registry or metadata table.
5. **Phase 1 Deliverables** — define what “Git-first MVP” includes exactly (Keystatic setup, repo template, auth, caching, etc.).

---

**Author:** Lumen × Ali  
**Version:** 1.0  
**Date:** 2025-11-05

