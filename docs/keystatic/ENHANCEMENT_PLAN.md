# Keystatic CMS Enhancement Plan
**Date:** November 9, 2025
**Status:** Planning - Major Architecture Improvements Needed

---

## Overview

This document outlines major enhancements needed to make Keystatic CMS a powerful, user-friendly content management system for non-developers.

## Current Limitations

1. **No Global Settings** - Users can't manage tags, categories, or site config without editing code
2. **Limited Gating Granularity** - Sub-projects inherit from parents (can't have public project with gated sub-project)
3. **Flat Directory Structure** - No visual hierarchy in Keystatic or public view
4. **Fixed Content Structure** - Can't add custom folders/files/docs to projects
5. **Emojis in UI** - ✅ FIXED (Nov 9, 2025)

---

## Priority 1: Granular Access Control

### Problem
Currently, gating is inherited:
- Project is public → All sub-projects are public
- Can't have: Public project with gated sub-project

### Solution: Add Visibility to ALL Content Types

**Schema Changes:**

```typescript
// Projects - ALREADY HAS
visibility: fields.select({
  label: 'Who can access this project?',
  options: [
    { label: 'Public - Anyone can view', value: 'public' },
    { label: 'Gated - Requires safety acknowledgment', value: 'gated' },
    { label: 'Private - Only you can view', value: 'private' },
  ],
  defaultValue: 'public',
}),
safetyCode: fields.text({ label: 'Safety Code (Required only if Gated)' }),

// Sub-Projects - ADD VISIBILITY
visibility: fields.select({
  label: 'Who can access this sub-project?',
  options: [
    { label: 'Inherit from Parent Project', value: 'inherit' },  // NEW
    { label: 'Public - Anyone can view', value: 'public' },
    { label: 'Gated - Requires safety acknowledgment', value: 'gated' },
    { label: 'Private - Only you can view', value: 'private' },
  ],
  defaultValue: 'inherit',  // Default to parent's setting
}),
safetyCode: fields.text({ label: 'Safety Code (if Gated)' }),

// Updates - ADD VISIBILITY
visibility: fields.select({
  label: 'Who can access this update?',
  options: [
    { label: 'Inherit from Parent', value: 'inherit' },
    { label: 'Public', value: 'public' },
    { label: 'Gated', value: 'gated' },
    { label: 'Private', value: 'private' },
  ],
  defaultValue: 'inherit',
}),
safetyCode: fields.text({ label: 'Safety Code (if Gated)' }),

// Documentation - ADD VISIBILITY
visibility: fields.select({
  label: 'Who can access this documentation?',
  options: [
    { label: 'Public', value: 'public' },
    { label: 'Gated', value: 'gated' },
    { label: 'Private', value: 'private' },
  ],
  defaultValue: 'public',
}),
safetyCode: fields.text({ label: 'Safety Code (if Gated)' }),
```

**Access Control Logic:**

```typescript
function getEffectiveVisibility(item: Content, parent?: Content) {
  if (item.visibility === 'inherit' && parent) {
    return parent.visibility;
  }
  return item.visibility || 'public';
}

function requiresGating(item: Content, parent?: Content) {
  const visibility = getEffectiveVisibility(item, parent);
  return visibility === 'gated' && (item.safetyCode || parent?.safetyCode);
}
```

**Effort:** 4 hours
**Files to modify:**
- `keystatic.config.ts` - Add visibility to all collections
- Content files - Add visibility field to existing items
- `src/pages/projects/[id].astro` - Check effective visibility
- `src/pages/updates/[id].astro` - Check effective visibility
- `src/middleware.ts` - Update access control logic

---

## Priority 2: Global Settings (Keystatic Singletons)

### Problem
Non-developers can't manage:
- Available tags (hardcoded in each item)
- Available categories (hardcoded in config)
- Site settings (workspace name, description, etc.)

### Solution: Add Keystatic Singletons

**New Singletons:**

```typescript
// keystatic.config.ts

export default config({
  storage: { kind: 'github', repo: { ... } },

  singletons: {
    // Global Site Settings
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'content/settings/site',
      schema: {
        workspaceName: fields.text({
          label: 'Workspace Name',
          description: 'The name of your research workspace',
          validation: { isRequired: true },
        }),
        workspaceDescription: fields.text({
          label: 'Workspace Description',
          multiline: true,
        }),
        researcherName: fields.text({
          label: 'Researcher Name',
          validation: { isRequired: true },
        }),
        contactEmail: fields.text({
          label: 'Contact Email',
          validation: { isRequired: false },
        }),
        socialLinks: fields.object({
          github: fields.text({ label: 'GitHub URL' }),
          twitter: fields.text({ label: 'Twitter/X URL' }),
          linkedin: fields.text({ label: 'LinkedIn URL' }),
        }, { label: 'Social Links' }),
      },
    }),

    // Global Tags
    globalTags: singleton({
      label: 'Manage Tags',
      path: 'content/settings/tags',
      schema: {
        tags: fields.array(
          fields.object({
            value: fields.text({
              label: 'Tag Value',
              description: 'Lowercase, no spaces (e.g., "plasma-physics")',
              validation: {
                isRequired: true,
                pattern: /^[a-z0-9-]+$/,
              },
            }),
            label: fields.text({
              label: 'Display Label',
              description: 'Human-readable label (e.g., "Plasma Physics")',
              validation: { isRequired: true },
            }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
          }, { label: 'Tag' }),
          {
            label: 'Available Tags',
            description: 'Tags that can be applied to projects, sub-projects, and updates',
            itemLabel: (props) => props.fields.label.value || props.fields.value.value,
          }
        ),
      },
    }),

    // Global Categories
    globalCategories: singleton({
      label: 'Manage Categories',
      path: 'content/settings/categories',
      schema: {
        categories: fields.array(
          fields.object({
            value: fields.text({
              label: 'Category Value',
              description: 'Lowercase, no spaces (e.g., "plasma")',
              validation: {
                isRequired: true,
                pattern: /^[a-z0-9-]+$/,
              },
            }),
            label: fields.text({
              label: 'Display Label',
              description: 'Human-readable label (e.g., "Plasma Physics")',
              validation: { isRequired: true },
            }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            color: fields.text({
              label: 'Badge Color',
              description: 'Hex color for category badge (e.g., "#3B82F6")',
            }),
          }, { label: 'Category' }),
          {
            label: 'Available Categories',
            description: 'Categories for organizing projects',
            itemLabel: (props) => props.fields.label.value || props.fields.value.value,
          }
        ),
      },
    }),
  },

  collections: {
    // ... existing collections
  },
});
```

**Dynamic Tag/Category Fields:**

After implementing singletons, update collection schemas to use dynamic options:

```typescript
// Instead of hardcoded options, read from singletons
import { reader } from './lib/keystatic';

// In collection schema:
tags: fields.multiselect({
  label: 'Tags',
  options: async () => {
    const globalTags = await reader.singletons.globalTags.read();
    return globalTags?.tags.map(tag => ({
      label: tag.label,
      value: tag.value,
    })) || [];
  },
}),

category: fields.select({
  label: 'Category',
  options: async () => {
    const categories = await reader.singletons.globalCategories.read();
    return categories?.categories.map(cat => ({
      label: cat.label,
      value: cat.value,
    })) || [];
  },
}),
```

**Effort:** 8 hours
**Files to create:**
- `content/settings/site/index.yaml`
- `content/settings/tags/index.yaml`
- `content/settings/categories/index.yaml`

**Files to modify:**
- `keystatic.config.ts` - Add singletons and dynamic options
- `src/lib/keystatic.ts` - Export reader for accessing singletons
- All pages - Read from singletons instead of hardcoded values

---

## Priority 3: Hierarchical Directory View

### Problem
- Keystatic shows flat list of collections
- Public view doesn't show folder structure
- Users can't visualize project hierarchy

### Solution: Custom UI Components

**Keystatic Side:**

Create custom navigation injection (if possible with Keystatic):

```javascript
// public/keystatic-navigation.js
// Inject custom tree view into Keystatic sidebar

function createTreeView() {
  const projects = getProjects();
  const subProjects = getSubProjects();
  const updates = getUpdates();

  const tree = projects.map(project => ({
    id: project.slug,
    label: project.title,
    type: 'project',
    children: [
      ...subProjects
        .filter(sp => sp.parentProject === project.slug)
        .map(sp => ({
          id: sp.slug,
          label: sp.title,
          type: 'subproject',
          children: updates
            .filter(u => u.subProject === sp.slug)
            .map(u => ({ id: u.slug, label: u.title, type: 'update' })),
        })),
      ...updates
        .filter(u => u.project === project.slug && !u.subProject)
        .map(u => ({ id: u.slug, label: u.title, type: 'update' })),
    ],
  }));

  // Render tree view
}
```

**Public View:**

```astro
---
// src/components/workspace/ProjectTree.astro
import { reader } from '../../lib/keystatic';

const projects = await reader.collections.projects.all();
const subProjects = await reader.collections.subProjects.all();
const updates = await reader.collections.updates.all();

// Build tree structure
const tree = projects.map(project => {
  const projectSubProjects = subProjects.filter(sp =>
    sp.entry.parentProject === project.slug
  );

  return {
    ...project,
    subProjects: projectSubProjects.map(sp => ({
      ...sp,
      updates: updates.filter(u =>
        u.entry.subProject === sp.slug
      ),
    })),
    directUpdates: updates.filter(u =>
      u.entry.project === project.slug && !u.entry.subProject
    ),
  };
});
---

<div class="project-tree">
  {tree.map(project => (
    <div class="project-node">
      <div class="project-header">
        <a href={`/projects/${project.slug}`}>
          <span class="folder-icon">📁</span>
          {project.entry.title}
        </a>
      </div>

      {project.subProjects.length > 0 && (
        <div class="subprojects">
          {project.subProjects.map(sp => (
            <div class="subproject-node">
              <a href={`/projects/${project.slug}/subprojects/${sp.slug}`}>
                <span class="folder-icon">📂</span>
                {sp.entry.title}
              </a>

              {sp.updates.length > 0 && (
                <div class="updates">
                  {sp.updates.map(update => (
                    <a href={`/updates/${update.slug}`}>
                      <span class="file-icon">📄</span>
                      {update.entry.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {project.directUpdates.length > 0 && (
        <div class="updates">
          {project.directUpdates.map(update => (
            <a href={`/updates/${update.slug}`}>
              <span class="file-icon">📄</span>
              {update.entry.title}
            </a>
          ))}
        </div>
      )}
    </div>
  ))}
</div>

<style>
  .project-tree {
    font-family: monospace;
  }

  .project-node {
    margin-bottom: 1rem;
  }

  .subprojects,
  .updates {
    margin-left: 2rem;
    border-left: 2px solid #e5e7eb;
    padding-left: 1rem;
  }

  .folder-icon,
  .file-icon {
    margin-right: 0.5rem;
  }
</style>
```

**Effort:** 12 hours
**Files to create:**
- `src/components/workspace/ProjectTree.astro` - Tree view component
- `public/keystatic-navigation.js` - Custom Keystatic nav (if possible)

**Files to modify:**
- `src/pages/workbench/index.astro` - Add tree view
- `src/pages/index.astro` - Add tree view to public home

---

## Priority 4: Flexible Content Structure

### Problem
- Projects have fixed structure
- Can't add custom folders, files, or documents
- Each component can't have individual gating

### Solution: Nested Collections or Document Structure

**Option A: Nested Markdown Files (Simpler)**

Allow projects to have a `content` folder with arbitrary markdown files:

```
content/projects/my-project/
  index.yaml          # Project metadata
  body.mdoc           # Project overview
  content/            # NEW: Additional content
    design-docs/
      architecture.md
      api-spec.md
    data/
      results.csv
    protocols/
      safety.md
```

Each markdown file can have frontmatter for gating:

```markdown
---
title: Architecture Design
visibility: gated
safetyCode: design_docs_v1
---

# Architecture Design Document
...
```

**Option B: Dynamic Collections (More Complex)**

Create a generic "Content Items" collection:

```typescript
contentItems: collection({
  label: 'Content Items',
  path: 'content/items/*/',
  schema: {
    title: fields.text({ label: 'Title', validation: { isRequired: true } }),

    contentType: fields.select({
      label: 'Content Type',
      options: [
        { label: 'Document', value: 'document' },
        { label: 'Data File', value: 'data' },
        { label: 'Image Gallery', value: 'gallery' },
        { label: 'Protocol', value: 'protocol' },
        { label: 'Custom', value: 'custom' },
      ],
    }),

    parentProject: fields.relationship({
      label: 'Parent Project',
      collection: 'projects',
    }),

    parentSubProject: fields.relationship({
      label: 'Parent Sub-Project (Optional)',
      collection: 'subProjects',
    }),

    visibility: fields.select({
      label: 'Who can access?',
      options: [
        { label: 'Inherit from Parent', value: 'inherit' },
        { label: 'Public', value: 'public' },
        { label: 'Gated', value: 'gated' },
        { label: 'Private', value: 'private' },
      ],
      defaultValue: 'inherit',
    }),

    safetyCode: fields.text({ label: 'Safety Code (if Gated)' }),

    body: fields.document({
      label: 'Content',
      formatting: true,
      links: true,
      images: true,
    }),
  },
}),
```

**Effort:** 16 hours (Option A) / 24 hours (Option B)
**Recommendation:** Start with Option A (simpler, more flexible)

---

## Implementation Roadmap

### Phase 1: ✅ COMPLETE
- Relationship dropdowns
- Consolidated visibility fields
- Schema validation fixes

### Phase 2: Quick Wins (2-3 hours)
1. ✅ Remove emojis
2. Add granular gating to all collections (4h)

### Phase 3: Global Settings (8 hours)
1. Create singletons for site settings, tags, categories
2. Update collections to use dynamic options
3. Create UI pages for managing settings

### Phase 4: Directory View (12 hours)
1. Create tree view component for public view
2. Add hierarchical navigation to workbench
3. Visual indicators for gating status

### Phase 5: Flexible Content (16-24 hours)
1. Enable custom folders/files in projects
2. Per-file gating controls
3. File type handlers (markdown, images, data)

---

## Total Effort Estimate

- Phase 2: 4 hours
- Phase 3: 8 hours
- Phase 4: 12 hours
- Phase 5: 16 hours

**Total:** 40 hours (5 days at 8h/day)

---

## Next Steps

1. **Immediate:** Commit emoji removal
2. **Next:** Add granular gating (Priority 1)
3. **Then:** Global settings singletons (Priority 2)
4. **After:** Directory views (Priority 3)
5. **Finally:** Flexible content structure (Priority 4)

---

**Document Status:** Draft
**Last Updated:** November 9, 2025
**Author:** Claude Code
