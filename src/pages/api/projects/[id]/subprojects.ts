import type { APIRoute } from 'astro';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../../../keystatic.config';

export const GET: APIRoute = async ({ params }) => {
  const projectSlug = params.id;

  if (!projectSlug) {
    return new Response(JSON.stringify({ error: 'Project ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Initialize Keystatic reader
    const reader = createReader(process.cwd(), keystaticConfig);

    // Fetch all sub-projects from Git
    const subProjectSlugs = await reader.collections.subProjects.list();

    // Filter sub-projects that belong to this project
    const subProjectsPromises = subProjectSlugs.map(async (slug) => {
      const subProject = await reader.collections.subProjects.read(slug);

      if (!subProject) return null;
      if (subProject.projectSlug !== projectSlug) return null;

      // Count updates for this sub-project
      const updateSlugs = await reader.collections.updates.list();
      const updates = await Promise.all(
        updateSlugs.map(async (updateSlug) => {
          const update = await reader.collections.updates.read(updateSlug);
          return update?.subProjectSlug === slug ? update : null;
        })
      );
      const updateCount = updates.filter(u => u !== null).length;

      return {
        slug,
        title: subProject.title,
        description: subProject.description,
        status: subProject.status || 'active',
        updateCount,
      };
    });

    const subProjects = (await Promise.all(subProjectsPromises)).filter(sp => sp !== null);

    // Sort by most recent first (if we had dates)
    // For now, just return alphabetically
    subProjects.sort((a, b) => a!.title.localeCompare(b!.title));

    return new Response(JSON.stringify(subProjects), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sub-projects:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch sub-projects' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
