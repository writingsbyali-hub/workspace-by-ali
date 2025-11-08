# Workspace Documentation

**Last Updated:** November 8, 2025
**Status:** Documentation reorganized, self-hosted architecture, Git-first implementation

This directory contains all planning, architecture, and implementation documentation for the Workspace project.

**🏗️ SELF-HOSTED ARCHITECTURE:** This workspace is designed to be self-hosted with one owner per deployment. See [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) for details.

---

## 🚀 Quick Start

**Need to get started fast?**

1. **[Getting Started Guide](./getting-started/ENVIRONMENT_VARIABLES.md)** - Environment setup
2. **[MASTER TASKLIST](./MASTER_TASKLIST.md)** - Current tasks & priorities
3. **[Latest Session](./sessions/2025-11-08/)** - Today's work

**New to the project?**

1. [Master Roadmap](./planning/00_Master_Roadmap.md) - Big picture vision
2. [Language Glossary](./architecture/01_Workspace_Language_and_Structure_Glossary.md) - Terminology
3. [Phase 1 Git-First MVP](./implementation/01_Phase1_Git_First_MVP.md) - Implementation plan

---

## 📂 Directory Structure

```
docs/
│
├── README.md                           ← You are here
├── MASTER_TASKLIST.md                  ⭐ Active task tracker & sprint planning
├── REPOSITORY_STRUCTURE.md             Self-hosted deployment model
├── ARCHITECTURE_COMPARISON.md          Main app vs template vs user repos
├── BRAND_QUICK_START.md                Design system quick reference
├── BRANDING_GUIDE.md                   Product naming conventions
├── KNOWN_ISSUES_Nov_6_2025.md          Current blockers & bugs
│
├── getting-started/                    🆕 First-time setup guides
│   └── ENVIRONMENT_VARIABLES.md        Complete .env reference
│
├── architecture/                       System design & architecture
│   ├── 01_Workspace_Language_and_Structure_Glossary.md
│   ├── 01_CORE_CONCEPTS.md             Git-first architecture
│   ├── 02_Supabase_Vercel_Integration.md  (needs update for self-hosted)
│   ├── 03_Authentication_Security.md
│   ├── 04_Brand_Design_System.md
│   ├── 05_Keystatic_Integration.md     Git-backed CMS setup
│   ├── 06_Supabase_Caching_Strategy.md Metadata cache
│   ├── 07_Safety_Protocol_System.md    Safety gating
│   └── 08_Content_Structure_and_Workflow.md  🆕 Git branch workflow
│
├── reference/                          Technical specifications
│   ├── API_ENDPOINTS.md                Complete API spec
│   ├── Data_Structures.md              Schemas & frontmatter
│   ├── COMPONENT_LIBRARY.md            Custom component system
│   └── GitHub_Federated_Model.md       🆕 GitHub architecture spec
│
├── implementation/                     How-to guides
│   └── 01_Phase1_Git_First_MVP.md      Phase 1 roadmap (40+ tasks)
│
├── planning/                           Phase roadmaps
│   ├── 00_Master_Roadmap.md
│   ├── Phase_1_Personal_Workspace_MVP.md  (needs update)
│   ├── Phase_2_Commons_Workspace_Core.md
│   ├── Phase_3_Data_Visualization.md
│   ├── Phase_4_Integration_and_Polish.md
│   ├── Phase_5_Federation_and_Discovery.md
│   └── Nov_5_Planning_Notes.md         🆕 Historical planning
│
├── sessions/                           🆕 Time-based session docs
│   ├── README.md                       Session organization guide
│   ├── 2025-11-08/                     📍 Current session
│   ├── 2025-11-07/                     Yesterday's work
│   │   ├── SESSION_HANDOFF_Nov7_2025.md
│   │   ├── SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md
│   │   ├── CURRENT_STATE.md
│   │   ├── REFACTORING_TRACKER.md
│   │   ├── TESTING_GUIDE_Nov6.md
│   │   └── TESTING_RESULTS_Nov7_2025.md
│   └── 2025-11-05/                     Earlier sessions
│       ├── 09_claude_qa_implementation_answers.md
│       └── 06_claude_qa_followup_notes_keystatic_and_git_first_mvp.md
│
├── testing/                            Testing guides & results
│   ├── HOW_TO_TEST.md
│   └── git-api-test-results.md
│
├── sprints/                            Sprint history
│   └── SPRINT_HISTORY.md
│
└── archive/                            Historical documents
    ├── README.md                       Archive guide
    ├── deprecated/                     🆕 Obsolete due to architecture changes
    │   ├── daisyui/                    DaisyUI docs (removed Nov 7)
    │   │   ├── README.md
    │   │   ├── DAISYUI_GUIDELINES.md
    │   │   └── FINAL_POLISH_CLEAN_DIVIDERS.md
    │   └── dashboard-old/              Old dashboard docs (multi-tenant)
    │       ├── README.md
    │       ├── DASHBOARD_IMPLEMENTATION_GUIDE.md
    │       ├── DASHBOARD_V2_COMPREHENSIVE_ROADMAP.md
    │       ├── SIDEBAR_TOOL_PANEL_*.md
    │       └── MARKDOWN_EDITOR_IMPLEMENTATION_GUIDE.md
    └── SESSION_HANDOFF_*.md            Old session handoffs (pre-Nov 6)
```

---

## 🎯 Finding What You Need

### I want to...

**Get started with development:**
→ [ENVIRONMENT_VARIABLES.md](./getting-started/ENVIRONMENT_VARIABLES.md)
→ [MASTER_TASKLIST.md](./MASTER_TASKLIST.md)

**Understand the architecture:**
→ [01_CORE_CONCEPTS.md](./architecture/01_CORE_CONCEPTS.md)
→ [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md)
→ [05_Keystatic_Integration.md](./architecture/05_Keystatic_Integration.md)

**Build a feature:**
→ [01_Phase1_Git_First_MVP.md](./implementation/01_Phase1_Git_First_MVP.md)
→ [API_ENDPOINTS.md](./reference/API_ENDPOINTS.md)
→ [Data_Structures.md](./reference/Data_Structures.md)

**Style components:**
→ [BRAND_QUICK_START.md](./BRAND_QUICK_START.md)
→ [COMPONENT_LIBRARY.md](./reference/COMPONENT_LIBRARY.md)
→ [04_Brand_Design_System.md](./architecture/04_Brand_Design_System.md)

**Understand terminology:**
→ [01_Workspace_Language_and_Structure_Glossary.md](./architecture/01_Workspace_Language_and_Structure_Glossary.md)
→ [BRANDING_GUIDE.md](./BRANDING_GUIDE.md)

**See what changed recently:**
→ [sessions/2025-11-08/](./sessions/2025-11-08/) - Current session
→ [sessions/2025-11-07/](./sessions/2025-11-07/) - Yesterday's work
→ [SPRINT_HISTORY.md](./sprints/SPRINT_HISTORY.md)

---

## 📖 Essential Reading

### For Developers

| Document | Purpose | Read If... |
|----------|---------|------------|
| [MASTER_TASKLIST.md](./MASTER_TASKLIST.md) | Current priorities | You're starting work today |
| [01_CORE_CONCEPTS.md](./architecture/01_CORE_CONCEPTS.md) | Git-first architecture | You need to understand the system |
| [API_ENDPOINTS.md](./reference/API_ENDPOINTS.md) | API specification | You're building API routes |
| [05_Keystatic_Integration.md](./architecture/05_Keystatic_Integration.md) | CMS configuration | You're working with content |
| [ENVIRONMENT_VARIABLES.md](./getting-started/ENVIRONMENT_VARIABLES.md) | Environment setup | You're deploying or configuring |

### For Designers

| Document | Purpose | Read If... |
|----------|---------|------------|
| [BRAND_QUICK_START.md](./BRAND_QUICK_START.md) | Quick design reference | You need component examples fast |
| [04_Brand_Design_System.md](./architecture/04_Brand_Design_System.md) | Complete design system | You need full brand guidelines |
| [COMPONENT_LIBRARY.md](./reference/COMPONENT_LIBRARY.md) | Component reference | You're implementing UI |

### For Product/Planning

| Document | Purpose | Read If... |
|----------|---------|------------|
| [00_Master_Roadmap.md](./planning/00_Master_Roadmap.md) | Product vision | You need the big picture |
| [01_Phase1_Git_First_MVP.md](./implementation/01_Phase1_Git_First_MVP.md) | Phase 1 plan | You're planning current work |
| [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) | Deployment model | You're explaining the architecture |

---

## 🏗️ Architecture Overview

**What changed on November 6, 2025:**

| Old Architecture | New Architecture |
|------------------|------------------|
| Multi-tenant (one deployment, many users) | Self-hosted (each user deploys own workspace) |
| Database-centric content storage | Git-first (GitHub = source of truth) |
| DaisyUI component library | Custom CSS design system |
| "Dashboard" terminology | "Workbench" terminology |

**Key concepts:**
- **One owner per deployment** - You deploy your own workspace
- **Git-first** - Content lives in GitHub, not database
- **Supabase for cache** - Performance layer, not source of truth
- **Readers are guests** - They can view, not own

See [ARCHITECTURE_COMPARISON.md](./ARCHITECTURE_COMPARISON.md) for details.

---

## 🗓️ Recent Changes

### November 8, 2025 - Documentation Reorganization
- ✅ Created `getting-started/` folder with environment variable reference
- ✅ Created `sessions/` folder for time-based documentation
- ✅ Created `archive/deprecated/` for obsolete content
- ✅ Archived 10 obsolete files (~8,800 lines) from DaisyUI and multi-tenant era
- ✅ Reorganized orphaned files from `new/` folder
- ✅ Updated BRAND_QUICK_START.md to use custom components
- ✅ Removed `current/` and `new/` folders

### November 7, 2025 - Design System Overhaul
- Removed DaisyUI, implemented custom CSS design system
- Updated COMPONENT_LIBRARY.md with new patterns
- Completed browser testing and webhook implementation

### November 6, 2025 - Architecture Pivot
- Pivoted from multi-tenant to self-hosted
- Refactored database schema (owner/reader roles)
- Updated middleware for role detection

See [sessions/](./sessions/) for detailed session notes.

---

## 🧭 Navigation by Topic

### Git & GitHub
- [05_Keystatic_Integration.md](./architecture/05_Keystatic_Integration.md) - CMS setup
- [08_Content_Structure_and_Workflow.md](./architecture/08_Content_Structure_and_Workflow.md) - Branch workflow
- [GitHub_Federated_Model.md](./reference/GitHub_Federated_Model.md) - Federated repo spec
- [REPOSITORY_STRUCTURE.md](./REPOSITORY_STRUCTURE.md) - Deployment model

### Database & Caching
- [06_Supabase_Caching_Strategy.md](./architecture/06_Supabase_Caching_Strategy.md) - Cache architecture
- [02_Supabase_Vercel_Integration.md](./architecture/02_Supabase_Vercel_Integration.md) - Integration setup
- [Data_Structures.md](./reference/Data_Structures.md) - Database schemas

### Security & Safety
- [03_Authentication_Security.md](./architecture/03_Authentication_Security.md) - Auth implementation
- [07_Safety_Protocol_System.md](./architecture/07_Safety_Protocol_System.md) - Safety gating
- [ENVIRONMENT_VARIABLES.md](./getting-started/ENVIRONMENT_VARIABLES.md) - Secrets management

### Design & UI
- [BRAND_QUICK_START.md](./BRAND_QUICK_START.md) - Quick reference
- [04_Brand_Design_System.md](./architecture/04_Brand_Design_System.md) - Complete system
- [COMPONENT_LIBRARY.md](./reference/COMPONENT_LIBRARY.md) - Component reference

---

## 📝 Documentation Standards

### Adding New Documents

**Where to put files:**
- Architecture decisions → `architecture/`
- API/data specs → `reference/`
- Setup guides → `getting-started/`
- Implementation plans → `implementation/`
- Session notes → `sessions/YYYY-MM-DD/`
- Future planning → `planning/`

**Naming conventions:**
- Use descriptive names: `Feature_Name.md` not `doc3.md`
- Architecture files use numbers: `08_New_Topic.md`
- Session files use dates: `SESSION_HANDOFF_Nov8_2025.md`
- Reference files use underscores: `GitHub_Federated_Model.md`

**Format requirements:**
- Include "Last Updated" date at top
- Use clear heading hierarchy (# → ## → ###)
- Add table of contents for 200+ line docs
- Link to related documents
- Include code examples where relevant

### Archiving Old Documents

**When to archive:**
- Feature was removed (e.g., DaisyUI)
- Architecture pivoted (e.g., multi-tenant → self-hosted)
- Documentation superseded by newer version
- Session notes older than 2 weeks

**How to archive:**
- Move to `archive/deprecated/[category]/`
- Create README.md explaining why archived
- Update references in other docs
- Keep for historical context

---

## 🔗 External Resources

### Technology Documentation
- [Astro 5 Docs](https://docs.astro.build)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Keystatic Docs](https://keystatic.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev/)

### Related Projects
- [workspace-template](https://github.com/workspace-by-ali/workspace-template) - Content template repo
- [Astro Dashboard](https://github.com/alexwhitmore/astro-dashboard) - UI inspiration

---

## 💡 Philosophy

These documents embody the Workspace principles:

- **Transparency** - All planning is open and documented
- **Iteration** - Plans evolve based on learning
- **Recognition** - Credit all contributors and influences
- **Ethics** - Build with care for users and community
- **Self-hosting** - Users own their data and deployment

---

## ❓ Questions?

If something in the docs is unclear:

1. Check the [Glossary](./architecture/01_Workspace_Language_and_Structure_Glossary.md) for terminology
2. Review the [Master Roadmap](./planning/00_Master_Roadmap.md) for context
3. Check recent [sessions/](./sessions/) for latest decisions
4. Open an issue in the repo
5. Ask in project discussions

---

**Last Updated:** November 8, 2025
**Status:** Documentation reorganized, ~55% through Phase 1A
**Next Review:** After workbench reorganization completion
