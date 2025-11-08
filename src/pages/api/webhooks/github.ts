/**
 * GitHub Webhook Handler
 *
 * Receives push events from GitHub and updates cache tables
 * Critical for keeping project_cache and subproject_cache in sync with Git
 *
 * Security: Verifies webhook signatures using HMAC SHA-256
 */

import type { APIRoute } from 'astro';
import { createHmac } from 'crypto';
import { createSupabaseServerAdmin } from '../../../lib/supabaseServerAdmin';
import matter from 'gray-matter';

const WEBHOOK_SECRET = import.meta.env.GITHUB_WEBHOOK_SECRET;

/**
 * Verify GitHub webhook signature
 * https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.error('[Webhook] GITHUB_WEBHOOK_SECRET not configured');
    return false;
  }

  const hmac = createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return digest === signature;
}

/**
 * Extract project metadata from markdown frontmatter
 */
function parseProjectMetadata(content: string) {
  const { data } = matter(content);
  return {
    title: data.title || '',
    description: data.description || '',
    visibility: data.visibility || 'public',
    gated: data.gated || false,
    safety_code: data.safetyCode || null,
    stream: data.category || null,
    tags: data.tags || [],
    status: data.status || 'draft',
    last_updated: data.lastUpdated || new Date().toISOString(),
  };
}

/**
 * Extract subproject metadata from markdown frontmatter
 */
function parseSubprojectMetadata(content: string) {
  const { data } = matter(content);
  return {
    title: data.title || '',
    description: data.description || '',
    gated: data.gated || false,
    project_slug: data.projectSlug || null,
    last_updated: data.lastUpdated || new Date().toISOString(),
  };
}

/**
 * Update project_cache from Git content
 */
async function updateProjectCache(
  supabase: ReturnType<typeof createSupabaseServerAdmin>,
  userId: string,
  repoUrl: string,
  projectSlug: string,
  content: string
) {
  const metadata = parseProjectMetadata(content);

  // Upsert into project_cache
  const { error } = await supabase
    .from('project_cache')
    .upsert({
      user_id: userId,
      repo_url: repoUrl,
      project_slug: projectSlug,
      ...metadata,
      synced_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,project_slug',
    });

  if (error) {
    console.error('[Webhook] Error updating project_cache:', error);
    throw error;
  }

  console.log(`[Webhook] Updated project_cache for ${projectSlug}`);
}

/**
 * Update subproject_cache from Git content
 */
async function updateSubprojectCache(
  supabase: ReturnType<typeof createSupabaseServerAdmin>,
  projectId: string,
  subprojectSlug: string,
  content: string
) {
  const metadata = parseSubprojectMetadata(content);

  // Upsert into subproject_cache
  const { error } = await supabase
    .from('subproject_cache')
    .upsert({
      project_id: projectId,
      subproject_slug: subprojectSlug,
      ...metadata,
      synced_at: new Date().toISOString(),
    }, {
      onConflict: 'project_id,subproject_slug',
    });

  if (error) {
    console.error('[Webhook] Error updating subproject_cache:', error);
    throw error;
  }

  console.log(`[Webhook] Updated subproject_cache for ${subprojectSlug}`);
}

/**
 * Delete project from cache
 */
async function deleteProjectCache(
  supabase: ReturnType<typeof createSupabaseServerAdmin>,
  userId: string,
  projectSlug: string
) {
  const { error } = await supabase
    .from('project_cache')
    .delete()
    .eq('user_id', userId)
    .eq('project_slug', projectSlug);

  if (error) {
    console.error('[Webhook] Error deleting project_cache:', error);
    throw error;
  }

  console.log(`[Webhook] Deleted project_cache for ${projectSlug}`);
}

/**
 * Delete subproject from cache
 */
async function deleteSubprojectCache(
  supabase: ReturnType<typeof createSupabaseServerAdmin>,
  projectId: string,
  subprojectSlug: string
) {
  const { error } = await supabase
    .from('subproject_cache')
    .delete()
    .eq('project_id', projectId)
    .eq('subproject_slug', subprojectSlug);

  if (error) {
    console.error('[Webhook] Error deleting subproject_cache:', error);
    throw error;
  }

  console.log(`[Webhook] Deleted subproject_cache for ${subprojectSlug}`);
}

/**
 * Process push event and update cache
 */
async function processPushEvent(payload: any) {
  const supabase = createSupabaseServerAdmin();

  // Extract repo info
  const repoFullName = payload.repository.full_name;
  const repoUrl = payload.repository.html_url;

  // Find user by repo
  const { data: userRepo, error: findError } = await supabase
    .from('user_repos')
    .select('user_id, id')
    .eq('repo_owner', payload.repository.owner.login)
    .eq('repo_name', payload.repository.name)
    .single();

  if (findError || !userRepo) {
    console.error('[Webhook] Repo not found in user_repos:', repoFullName);
    return { error: 'Repo not found' };
  }

  const userId = userRepo.user_id;

  // Process each commit
  for (const commit of payload.commits) {
    // Process added and modified files
    const files = [...(commit.added || []), ...(commit.modified || [])];

    for (const file of files) {
      // Check if file is a project
      const projectMatch = file.match(/^content\/projects\/([^\/]+)\/index\.md$/);
      if (projectMatch) {
        const projectSlug = projectMatch[1];

        // Fetch file content from GitHub
        const octokit = await import('octokit').then(m => new m.Octokit());
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          path: file,
        });

        if ('content' in fileData && typeof fileData.content === 'string') {
          const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
          await updateProjectCache(supabase, userId, repoUrl, projectSlug, content);
        }
        continue;
      }

      // Check if file is a subproject
      const subprojectMatch = file.match(/^content\/subprojects\/([^\/]+)\/index\.md$/);
      if (subprojectMatch) {
        const subprojectSlug = subprojectMatch[1];

        // Fetch file content
        const octokit = await import('octokit').then(m => new m.Octokit());
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          path: file,
        });

        if ('content' in fileData && typeof fileData.content === 'string') {
          const content = Buffer.from(fileData.content, 'base64').toString('utf-8');

          // Get metadata to find project_id
          const metadata = parseSubprojectMetadata(content);

          if (metadata.project_slug) {
            // Find project_id from project_cache
            const { data: project } = await supabase
              .from('project_cache')
              .select('id')
              .eq('user_id', userId)
              .eq('project_slug', metadata.project_slug)
              .single();

            if (project) {
              await updateSubprojectCache(supabase, project.id, subprojectSlug, content);
            }
          }
        }
        continue;
      }
    }

    // Process removed files
    for (const file of commit.removed || []) {
      // Check if removed file is a project
      const projectMatch = file.match(/^content\/projects\/([^\/]+)\/index\.md$/);
      if (projectMatch) {
        const projectSlug = projectMatch[1];
        await deleteProjectCache(supabase, userId, projectSlug);
        continue;
      }

      // Check if removed file is a subproject
      const subprojectMatch = file.match(/^content\/subprojects\/([^\/]+)\/index\.md$/);
      if (subprojectMatch) {
        const subprojectSlug = subprojectMatch[1];

        // Find all projects for this user to check which one contains this subproject
        const { data: projects } = await supabase
          .from('project_cache')
          .select('id')
          .eq('user_id', userId);

        if (projects) {
          for (const project of projects) {
            const { data: subproject } = await supabase
              .from('subproject_cache')
              .select('id')
              .eq('project_id', project.id)
              .eq('subproject_slug', subprojectSlug)
              .single();

            if (subproject) {
              await deleteSubprojectCache(supabase, project.id, subprojectSlug);
              break;
            }
          }
        }
        continue;
      }
    }
  }

  return { success: true };
}

/**
 * POST endpoint for GitHub webhooks
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify signature
    if (!verifySignature(body, signature)) {
      console.error('[Webhook] Invalid signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse payload
    const payload = JSON.parse(body);
    const event = request.headers.get('x-github-event');

    console.log(`[Webhook] Received ${event} event from ${payload.repository?.full_name}`);

    // Only process push events
    if (event !== 'push') {
      return new Response(JSON.stringify({ message: 'Event type not supported' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process push event
    const result = await processPushEvent(payload);

    if (result.error) {
      return new Response(JSON.stringify(result), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Webhook processed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
