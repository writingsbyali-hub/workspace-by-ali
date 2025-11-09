import { config, collection, fields } from '@keystatic/core';
import { ProjectBreadcrumbs } from './src/components/keystatic/ProjectBreadcrumbs.jsx';

/**
 * FIXED Keystatic Configuration
 *
 * Changes from original:
 * - Flat structure instead of nested glob patterns
 * - Relationship fields to link projects → sub-projects → updates
 * - This allows creation to work properly
 *
 * Structure:
 * - content/projects/[project-slug]/
 * - content/subprojects/[subproject-slug]/
 * - content/updates/[update-slug].md
 */

export default config({
  /**
   * CRITICAL: Git-First Architecture - GitHub Storage Mode
   *
   * This workspace uses GitHub as the source of truth for all content.
   * Keystatic commits directly to the owner's GitHub repository.
   *
   * Storage Mode: GITHUB
   * - Commits directly to owner's GitHub repo (self-hosted model)
   * - Uses /api/keystatic/token endpoint to get GitHub access token
   * - Token endpoint returns owner's encrypted GitHub token from database
   * - Repo configured via environment variables (set once per deployment)
   * - Triggers GitHub webhooks on save → auto-updates cache tables
   * - Works in both development AND production
   *
   * Self-Hosted Model:
   * - ONE owner per deployment (person who deployed the workspace)
   * - Owner sets their repo in environment variables:
   *   - PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER (GitHub username)
   *   - PUBLIC_KEYSTATIC_GITHUB_REPO_NAME (repo name, e.g., "workspace-alice")
   * - These are set once during deployment setup
   * - Readers cannot access Keystatic (middleware protection)
   *
   * Why GitHub Mode (Not Cloud)?
   * - Cloud mode requires Keystatic Cloud subscription
   * - GitHub mode is free and self-hosted
   * - Direct commits to your own GitHub repo
   * - Full control over content and history
   *
   * Token Endpoint: /api/keystatic/token
   * Returns: { token: string }
   *
   * FIXED (Nov 8, 2025):
   * - Was using local mode in dev (content lost!)
   * - Was using cloud mode (requires paid subscription!)
   * - Now uses github mode with env vars (self-hosted, free)
   */
  storage: {
    kind: 'github' as const,
    repo: {
      owner: import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER || '',
      name: import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME || '',
    },
  },

  collections: {
    // Projects Collection (Top Level)
    projects: collection({
      label: 'Projects',
      path: 'content/projects/*/',  // Flat: content/projects/my-project/
      slugField: 'title',
      columns: ['title', 'category', 'status', 'visibility', 'lastUpdated'],

      schema: {
        title: fields.text({
          label: 'Project Title',
          description: 'This will be used to create the project URL (e.g., "Plasma Experiments" → plasma-experiments)',
          validation: { isRequired: true },
        }),

        visibility: fields.select({
          label: 'Who can access this project?',
          options: [
            { label: '🌐 Public - Anyone can view', value: 'public' },
            { label: '🔒 Gated - Requires safety acknowledgment', value: 'gated' },
            { label: '🚫 Private - Only you can view', value: 'private' },
          ],
          defaultValue: 'public',
        }),

        safetyCode: fields.text({
          label: 'Safety Code (Required only if Gated)',
          description: '⚠️ ONLY fill this if visibility is "Gated"\n\nEnter a unique code like "plasma_safety_v1.3"\n\nReaders must enter this exact code to access gated content.\n\nValid format: lowercase letters, numbers, and underscores only.',
          // Validation removed to prevent errors on existing content without this field
          // Pattern can be enforced in frontend or during save
        }),

        category: fields.select({
          label: 'Category',
          options: [
            { label: '🔧 Hardware', value: 'hardware' },
            { label: '🧬 Biology', value: 'biology' },
            { label: '⚡ Plasma', value: 'plasma' },
            { label: '📊 Data Science', value: 'data-science' },
            { label: '📋 Other', value: 'other' },
          ],
          defaultValue: 'other',
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
            { label: '📝 Draft', value: 'draft' },
            { label: '🟢 Active', value: 'active' },
            { label: '📦 Archived', value: 'archived' },
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

        // NOTE: Conditional category-specific fields removed due to Keystatic limitations
        // Conditional fields cannot cross-reference other schema fields
        // Can be re-added in Phase 2/3 with proper self-contained discriminant
        // See: docs/keystatic/SESSION_HANDOVER.md - Issue with Conditional Fields
      },
    }),

    // Sub-Projects Collection (Flat with Project Reference)
    subProjects: collection({
      label: 'Sub-Projects',
      path: 'content/subprojects/*/',  // Flat: content/subprojects/my-subproject/
      slugField: 'title',
      columns: ['title', 'parentProject', 'lastUpdated'],

      schema: {
        title: fields.text({
          label: 'Sub-Project Title',
          description: 'This will be used to create the sub-project URL',
          validation: { isRequired: true },
        }),

        // Relationship field to link to project
        parentProject: fields.relationship({
          label: 'Parent Project',
          collection: 'projects',
          validation: { isRequired: true },
        }),

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
          images: {
            directory: 'public/images/subprojects',
            publicPath: '/images/subprojects/',
          },
        }),

        startDate: fields.date({ label: 'Start Date' }),

        lastUpdated: fields.date({
          label: 'Last Updated',
          defaultValue: { kind: 'today' },
        }),
      },
    }),

    // Updates Collection (Flat with Sub-Project Reference)
    updates: collection({
      label: 'Updates',
      path: 'content/updates/*/',  // Flat folders: content/updates/2025-11-06-update/
      slugField: 'title',
      columns: ['title', 'type', 'project', 'subProject', 'date'],

      schema: {
        title: fields.text({
          label: 'Update Title',
          description: 'This will be used to create the update URL',
          validation: { isRequired: true },
        }),

        // Relationship fields
        project: fields.relationship({
          label: 'Project',
          collection: 'projects',
        }),

        subProject: fields.relationship({
          label: 'Sub-Project',
          collection: 'subProjects',
        }),

        date: fields.date({
          label: 'Date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),

        type: fields.select({
          label: 'Update Type',
          options: [
            { label: '🔬 Experiment', value: 'experiment' },
            { label: '👁️ Observation', value: 'observation' },
            { label: '🎯 Milestone', value: 'milestone' },
            { label: '📝 Note', value: 'note' },
          ],
          defaultValue: 'note',
        }),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: (props) => props.value }
        ),

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
    }),

    // Tasks Collection (Quick capture, converts to Updates)
    tasks: collection({
      label: 'Tasks',
      path: 'content/tasks/*/',
      slugField: 'title',
      columns: ['title', 'project', 'priority', 'status', 'createdDate'],

      schema: {
        title: fields.text({
          label: 'Task Title',
          description: 'Brief description of the task',
          validation: { isRequired: true },
        }),

        // Link to parent project
        project: fields.relationship({
          label: 'Related Project',
          collection: 'projects',
          validation: { isRequired: true },
        }),

        // Optional sub-project link
        subProject: fields.relationship({
          label: 'Related Sub-Project (Optional)',
          collection: 'subProjects',
        }),

        priority: fields.select({
          label: 'Priority',
          options: [
            { label: '🔴 High', value: 'high' },
            { label: '🟡 Medium', value: 'medium' },
            { label: '🟢 Low', value: 'low' },
          ],
          defaultValue: 'medium',
        }),

        status: fields.select({
          label: 'Status',
          options: [
            { label: '📋 To Do', value: 'todo' },
            { label: '⏳ In Progress', value: 'in-progress' },
            { label: '✅ Completed', value: 'completed' },
            { label: '🔄 Ready to Convert', value: 'ready-to-convert' },
          ],
          defaultValue: 'todo',
        }),

        notes: fields.text({
          label: 'Quick Notes',
          multiline: true,
          description: 'Quick observations or data points',
        }),

        createdDate: fields.date({
          label: 'Created Date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),
      },
    }),

    // Docs Collection (Standalone Documentation)
    docs: collection({
      label: 'Documentation',
      path: 'content/docs/*/',  // Flat: content/docs/protocol-guide/
      slugField: 'title',
      columns: ['title', 'category', 'visibility', 'author', 'lastUpdated'],

      schema: {
        title: fields.text({
          label: 'Document Title',
          description: 'This will be used to create the document URL',
          validation: { isRequired: true },
        }),

        category: fields.select({
          label: 'Category',
          options: [
            { label: '📋 Protocol', value: 'protocol' },
            { label: '🔬 Methods', value: 'methods' },
            { label: '📚 Literature Review', value: 'literature' },
            { label: '📖 Guide', value: 'guide' },
            { label: '📑 Reference', value: 'reference' },
            { label: '📄 Other', value: 'other' },
          ],
          defaultValue: 'guide',
        }),

        visibility: fields.select({
          label: 'Who can access this document?',
          options: [
            { label: '🌐 Public - Anyone can view', value: 'public' },
            { label: '🔒 Gated - Requires safety acknowledgment', value: 'gated' },
            { label: '🚫 Private - Only you can view', value: 'private' },
          ],
          defaultValue: 'public',
        }),

        safetyCode: fields.text({
          label: 'Safety Code (Required only if Gated)',
          description: '⚠️ ONLY fill this if visibility is "Gated"\n\nEnter a unique code like "plasma_safety_v1.3"\n\nReaders must enter this exact code to access gated content.\n\nValid format: lowercase letters, numbers, and underscores only.',
          // Validation removed to prevent errors on existing content without this field
          // Pattern can be enforced in frontend or during save
        }),

        // Optional: Link to parent project
        relatedProject: fields.relationship({
          label: 'Related Project (Optional)',
          collection: 'projects',
        }),

        description: fields.text({
          label: 'Short Description',
          multiline: true,
          validation: { isRequired: true },
        }),

        // YouTube video embed
        videoUrl: fields.text({
          label: 'YouTube Video URL (Optional)',
          description: 'Full YouTube URL (e.g., https://www.youtube.com/watch?v=...)',
        }),

        body: fields.document({
          label: 'Content',
          formatting: {
            inlineMarks: {
              bold: true,
              italic: true,
              code: true,
              strikethrough: true,
              underline: true,
            },
            listTypes: {
              ordered: true,
              unordered: true,
            },
            headingLevels: [2, 3, 4, 5],
            blockTypes: {
              blockquote: true,
              code: true,
            },
          },
          links: true,
          images: {
            directory: 'public/images/docs',
            publicPath: '/images/docs/',
          },
        }),

        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),

        author: fields.text({
          label: 'Author',
          description: 'Who wrote this document?',
        }),

        publishDate: fields.date({
          label: 'Publish Date',
          defaultValue: { kind: 'today' },
        }),

        lastUpdated: fields.date({
          label: 'Last Updated',
          defaultValue: { kind: 'today' },
        }),
      },
    }),
  },

  ui: {
    brand: {
      name: 'Workspace',
      mark: ProjectBreadcrumbs,
    },
    navigation: {
      'Project Hub': ['projects', 'subProjects'],
      'Research Activity': ['tasks', 'updates'],
      'Documentation': ['docs'],
    },
  },
});
