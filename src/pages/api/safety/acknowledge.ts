import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../lib/types/database';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Create Supabase client with cookies
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: cookies.get('sb-access-token')?.value || '',
        },
      },
    });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      content_slug,
      content_type,
      acknowledged_requirements
    } = body;

    // Validate input
    if (!content_slug || !content_type || !acknowledged_requirements || !Array.isArray(acknowledged_requirements)) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: content_slug, content_type, acknowledged_requirements'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!['project', 'subproject', 'update'].includes(content_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid content_type. Must be project, subproject, or update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (acknowledged_requirements.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No requirements acknowledged' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get workspace owner ID from workspace_settings
    const { data: workspaceSettings, error: settingsError } = await supabase
      .from('workspace_settings')
      .select('owner_id')
      .single();

    if (settingsError || !workspaceSettings?.owner_id) {
      console.error('Failed to get workspace owner:', settingsError);
      return new Response(
        JSON.stringify({ error: 'Failed to identify workspace owner' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const workspace_owner_id = workspaceSettings.owner_id;

    // Determine which slug field to use based on content type
    const project_slug = content_type === 'project' ? content_slug : null;
    const subproject_slug = content_type === 'subproject' ? content_slug : null;

    // For updates, we need to look up the parent project/subproject
    // For now, we'll use project_slug for updates (can be enhanced later)
    if (content_type === 'update') {
      // TODO: Look up parent project/subproject from the update
      // For now, treating updates as project-level acknowledgments
    }

    // Create acknowledgment records for each requirement
    const acknowledgments = acknowledged_requirements.map(req_key => ({
      user_id: user.id,
      workspace_owner_id,
      acknowledgment_type: 'safety' as const, // Type for safety gating
      acknowledgment_code: req_key, // Use the requirement key as the code
      project_slug,
      subproject_slug,
    }));

    // Use upsert to handle the case where user has already acknowledged
    // The unique constraint will prevent duplicates
    const { data, error: insertError } = await supabase
      .from('reader_acknowledgments')
      .upsert(acknowledgments, {
        onConflict: 'user_id,workspace_owner_id,acknowledgment_type,acknowledgment_code,project_slug,subproject_slug',
        ignoreDuplicates: true,
      })
      .select();

    if (insertError) {
      console.error('Failed to insert acknowledgments:', insertError);
      return new Response(
        JSON.stringify({
          error: 'Failed to record acknowledgments',
          details: insertError.message
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        acknowledged_at: new Date().toISOString(),
        count: acknowledged_requirements.length,
        message: 'Acknowledgments recorded successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error in acknowledge endpoint:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
