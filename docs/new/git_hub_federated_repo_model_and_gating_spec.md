# 04_GitHub Federated Repo Model and Gating Spec (v1)

## Overview
This document defines the **Git-first architecture** for the Workspace ecosystem, integrating **GitHub repos as the canonical data layer** and **Supabase** as the authentication and safety-verification layer. It ensures user data ownership, transparency, and decentralization while supporting public access, gated safety protocols, and Commons collaboration.

---

## 1. Architectural Philosophy

- **GitHub = Data Storage**  
  All content (projects, streams, updates, docs) lives in Git repos owned by users.

- **Supabase = Safety + Authentication**  
  Supabase stores only identity, safety acknowledgments, and permissions — *not* research data.

- **Workspace UI = Interaction Layer**  
  Astro + DecapCMS frontend that reads/writes content to GitHub, authenticates via Supabase, and displays gated content dynamically.

- **Decentralization Principle**  
  Users own their repos, host independently (Vercel, GitHub Pages, Netlify), and optionally contribute to Commons repos via fork/PR workflows.

---

## 2. Repository Structure

Each user has one **personal workspace repo**, forked from `workspace-by-ali`:

```
workspace-by-<username>/
│
├── content/
│   ├── projects/
│   │   ├── arcup-plasma/
│   │   │   ├── project.json
│   │   │   ├── .access.yml
│   │   │   ├── updates/
│   │   │   │   ├── 2025-11-05-initial-test.md
│   │   │   │   └── ...
│   │   │   ├── docs/
│   │   │   └── data/
│   │   └── remote-sensing/
│   │       └── ...
│   ├── streams/
│   │   └── plasma.yml
│   └── notes/
│       └── ...
│
├── public/
├── src/
├── astro.config.mjs
└── decap.config.yml
```

### Key Directories
- **projects/** → User-created projects with metadata, updates, and docs.
- **streams/** → Thematic collections of projects (e.g., plasma, biology).
- **notes/** → General personal notes, reflections, or links.
- **public/** → Assets and images.

---

## 3. Access and Safety Gating

### 3.1 Section-Level Gating
Each project folder includes `.access.yml` that defines gating logic:

```yaml
gated: true
visibility: public
safety_protocol: plasma
risk_level: high
allowed_roles:
  - owner
  - collaborator
  - vetted
```

### 3.2 UI Behavior
- If `gated: false` → Publicly visible.
- If `gated: true` → Workspace checks Supabase for user safety acknowledgment.
- If not acknowledged → trigger onboarding modal.
- Supabase logs acknowledgment with timestamp + protocol version.

### 3.3 Supabase Schema (Simplified)
```sql
create table safety_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  protocol text,
  version text,
  acknowledged boolean default false,
  acknowledged_at timestamp default now()
);
```

### 3.4 Private Repos
- Private repos remain fully owned by users.
- Workspace UI connects via GitHub API + user token.
- Data never leaves user’s GitHub account.

---

## 4. Public vs Gated vs Private Repos

| Type | Access | Example | Enforcement |
|------|---------|----------|-------------|
| **Public Repo** | Anyone can read | `/projects/arcup-plasma/` | GitHub public + `.access.yml: gated=false` |
| **Gated Repo/Section** | Requires auth + onboarding | `/projects/plasma-methods/` | `.access.yml: gated=true` + Supabase check |
| **Private Repo** | Owner/collaborators only | `/private/journal/` | GitHub private repo access only |

---

## 5. DecapCMS Integration

Each workspace includes DecapCMS configured with GitHub backend.

**decap.config.yml:**
```yaml
backend:
  name: github
  repo: username/workspace-by-username
  branch: main
  open_authoring: true

collections:
  - name: projects
    label: Projects
    folder: content/projects
    create: true
    fields:
      - {label: "Project Name", name: "title", widget: "string"}
      - {label: "Category", name: "category", widget: "select", options: [biology, plasma, remote-sensing]}
      - {label: "Visibility", name: "visibility", widget: "select", options: [public, private, gated]}
      - {label: "Description", name: "body", widget: "markdown"}
```

Decap commits Markdown + JSON directly to GitHub. No Supabase data storage.

---

## 6. Commons Integration

- Commons workspaces (e.g. ArcUp) exist as separate GitHub org repos (`arcup/commons-plasma`).
- Personal workspace users can **join Commons**:
  1. View `terms.yml` and `safety.yml` of target Commons repo.
  2. Agree to terms → Supabase logs acknowledgment.
  3. Fork the repo or link as submodule.
  4. Contribute updates → submit via PR.
- Commons repos vet contributions manually before merging.

---

## 7. Data Format Standards

### Markdown Content
```md
---
id: arcup-plasma-initial
date: 2025-11-05
visibility: public
gated: true
tags: ["experiment", "plasma"]
project: arcup-plasma
---
Ran first plasma water test with modified setup...
```

### JSON Metadata
```json
{
  "id": "arcup-plasma",
  "title": "ArcUp Plasma Research",
  "stream": "hardware",
  "visibility": "public",
  "gated": true,
  "safety_version": "1.2"
}
```

### YAML Safety Config
```yaml
gated: true
requirements:
  - read_safety_doc: true
  - acknowledge_risks: true
  - complete_quiz: false
docs:
  - url: /docs/safety/plasma-basics.md
    version: 1.2
```

---

## 8. Authentication & Token Flow

1. **User logs in** via Supabase (GitHub OAuth).
2. Supabase stores identity + session.
3. Workspace requests temporary GitHub token.
4. UI interacts directly with GitHub API to read/write Markdown files.
5. If `.access.yml` requires onboarding → Supabase verifies gate.

Security principle: *Supabase = auth oracle, GitHub = data store, Workspace = interface.*

---

## 9. Public Collaboration Flow

| Step | Action | System | Result |
|------|---------|---------|---------|
| 1 | User browses Commons project | Workspace UI | Public view of project summary |
| 2 | User clicks “Join Project” | Supabase + GitHub | Prompts terms + safety gate |
| 3 | User accepts | Supabase | Logs acknowledgment |
| 4 | System forks Commons repo | GitHub API | Creates user’s copy |
| 5 | User works locally | GitHub + Decap | Updates content via CMS or form |
| 6 | User submits work | GitHub PR | Commons team reviews + merges |

---

## 10. Public UI Behavior Summary

| Section | Default Visibility | Auth Required | Notes |
|----------|--------------------|----------------|--------|
| Home | Public | No | Intro + About Workspace |
| Projects | Public | No | Lists all user projects |
| Gated Projects | Partial | Yes | Prompts safety onboarding |
| Safety Portal | Public | Yes (for logging) | Lists safety protocols |
| Commons | Public | Optional | Links to shared org repos |

---

## 11. Future Extensions

- **Partial repo encryption** for sensitive data.
- **Commons federation layer** (index of all public repos).
- **Collaborator-level permissions** inside gated projects.
- **Offline editing support** via local Decap/CLI.
- **GitHub Actions validation** for safety/version checks.

---

## 12. Notes for Claude

- Verify latest **DecapCMS GitHub backend setup** with open authoring enabled.
- Review **Foam/Dendron repo patterns** for wiki-link compatibility.
- Confirm **Jekyll/Hugo** frontmatter compatibility with our `content/` folder.
- Research **GitHub fine-grained tokens** for safe API usage from Supabase Edge Functions.

---

**Author:** Lumen × Ali  
**Version:** 1.0  
**Date:** 2025-11-05