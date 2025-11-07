/**
 * API Endpoint: Save Markdown Document
 * Handles saving markdown content to GitHub
 */

import type { APIRoute } from 'astro';
import { saveMarkdownFile } from '../../../lib/github';
import { createSupabaseServer } from '../../../lib/supabaseServer';
import { decryptToken } from '../../../lib/tokenEncryption';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get user
    const supabase = createSupabaseServer(cookies);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get user's GitHub token
    const { data: userRepo } = await supabase
      .from('user_repos')
      .select('github_token_encrypted')
      .eq('user_id', user.id)
      .single();

    if (!userRepo || !userRepo.github_token_encrypted) {
      return new Response(
        JSON.stringify({ error: 'GitHub not connected' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Decrypt token
    const githubToken = decryptToken(userRepo.github_token_encrypted);

    // Parse request body
    const body = await request.json();
    const { owner, repo, path, content, title, sha, branch = 'main' } = body;

    // Validate required fields
    if (!owner || !repo || !path || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create commit message
    const commitMessage = sha
      ? `Update: ${title || 'document'}`
      : `Create: ${title || 'document'}`;

    // Save file to GitHub
    const result = await saveMarkdownFile(
      githubToken,
      owner,
      repo,
      path,
      content,
      commitMessage,
      sha,
      branch
    );

    return new Response(
      JSON.stringify({
        success: true,
        sha: result.sha,
        commit: result.commit,
        message: 'Document saved successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving document:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to save document',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
