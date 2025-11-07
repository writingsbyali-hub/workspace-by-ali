# 08_Content Structure and Branch Workflow — Git-First Keystatic Architecture

## 1. Conceptual Hierarchy

The Workspace architecture mirrors real-world research structures:

| Level | Name | Description | Example |
|-------|------|--------------|----------|
| 1️⃣ | **Commons** | The overarching organization or program (public hub) | ArcUp Commons |
| 2️⃣ | **Project** | A specific research effort under the Commons | Plasma Design |
| 3️⃣ | **Stream** | A sub-project or work package within a Project | Pollution Degradation |
| 4️⃣ | **Update / Docs / Data** | The actual research content, notes, or outputs | Daily logs, protocols, datasets |

### Relationships
- **Commons** contains many **Projects**.
- **Projects** contain one or more **Streams**.
- **Streams** contain **Updates**, **Docs**, and **Data** folders.
- Gating (safety access) can occur at any level.

---

## 2. Recommended Folder Structure (Option A — Nested Model)

```bash
content/
  projects/
    plasma-design/
      README.md              # project overview + frontmatter
      .access.yml            # gating for project-level safety
      streams/
        pollution-degradation/
          README.md          # stream overview + metadata
          .access.yml        # stream-specific gating
          updates/
            2025-11-05.md
            2025-11-06.md
          docs/
            protocol.md
          data/
            dataset-1.csv
        kinetics/
          README.md
          updates/
          data/
  notes/
    2025-11-05-thoughts.md
```

### Notes:
- **Frontmatter in README.md** replaces `project.json` for metadata.
- `.access.yml` defines gating and required safety acknowledgments.
- Large files (datasets, binaries) handled via **Git LFS** or **GitHub releases**.
- Each folder (project or stream) is an independent unit of access and can be rendered independently.

---

## 3. Gating Logic

Each `.access.yml` defines access rules:
```yaml
# Example: content/projects/plasma-design/streams/pollution-degradation/.access.yml
gated: true
required_acknowledgment: plasma_safety_v1.3
risk_level: medium
```

### How gating works:
1. Astro reads `.access.yml` before rendering content.
2. If `gated: true`, UI checks Supabase → has user acknowledged safety `plasma_safety_v1.3`?
3. If not, modal prompts safety agreement.
4. On completion → Supabase logs acknowledgment, content is unlocked.

**This ensures that gating can exist at multiple levels (project or stream).**

---

## 4. Branch Workflow (Draft → Main)

### Philosophy
- `main` = **Published**, publicly visible state.
- `draft` = **Work-in-progress**, editable by contributors.

### How it works
1. Keystatic commits all edits to the `draft` branch:
```ts
storage: {
  kind: 'github',
  repo: 'user/workspace-by-ali',
  branch: 'draft',
}
```
2. When user clicks **Publish**, Workspace merges `draft → main`.

### Merge flow options
- **Automatic merge via GitHub API:** workspace calls `/api/publish` → merges branches.
- **Manual review:** draft changes form PR → human approval → merge.

### Benefits
✅ Prevents user from breaking main site.  
✅ Clear separation between editing and publishing.  
✅ Compatible with Keystatic’s GitHub backend and Octokit merge APIs.  
✅ Enables safe local copies or forks.

---

## 5. Keystatic Configuration Outline

Keystatic supports nested collections for this structure.

```ts
collections: {
  projects: collection({
    label: 'Projects',
    path: 'content/projects/*',
    schema: {
      title: fields.text({ label: 'Project Title' }),
      gated: fields.checkbox({ label: 'Gated' }),
      body: fields.markdown({ label: 'Description' }),
    },
  }),
  streams: collection({
    label: 'Streams',
    path: 'content/projects/*/streams/*',
    schema: {
      title: fields.text({ label: 'Stream Title' }),
      gated: fields.checkbox({ label: 'Gated' }),
      parentProject: fields.text({ label: 'Parent Project' }),
      body: fields.markdown({ label: 'Stream Overview' }),
    },
  }),
  updates: collection({
    label: 'Updates',
    path: 'content/projects/*/streams/*/updates/*',
    schema: {
      date: fields.date({ label: 'Date' }),
      body: fields.markdown({ label: 'Log Entry' }),
    },
  }),
}
```

This configuration:
- Enables multi-level editing directly in Keystatic UI.
- Keeps path-based hierarchy clean.
- Allows frontmatter metadata and gating fields to remain editable.

---

## 6. Supabase Roles

Supabase remains responsible for:
- **Auth:** GitHub OAuth login.
- **Safety tracking:** storing acknowledgment logs.
- **Cache:** project and stream metadata for fast queries.

### Safety logging schema:
```sql
create table safety_acknowledgments (
  user_id uuid references auth.users(id),
  safety_code text,
  acknowledged_at timestamp default now(),
  primary key (user_id, safety_code)
);
```

---

## 7. Branch Protection and Roles

- Only authorized users can push to `main`.
- Contributors push to `draft` via Keystatic.
- Optional GitHub Actions workflow auto-merges verified changes.

**Local copies:**
- If a user clones their workspace locally, they only have access to content directories — not core UI or system files. This prevents breaking the app.

---

## 8. Next Steps for Claude

1. Confirm Keystatic supports nested collections on Vercel.
2. Implement `draft → main` merge API endpoint.
3. Prototype `.access.yml` gating logic in Astro routes.
4. Implement Supabase schema for safety acknowledgment.
5. Validate that Astro can dynamically render nested streams.
6. Update `README` to reflect new hierarchy and contributor flow.

---

**Author:** Lumen × Ali  
**Version:** 1.0  
**Date:** 2025-11-05