/**
 * Supabase Server Admin Client
 *
 * Uses the service role key to bypass RLS policies
 * ONLY use this for administrative operations like webhook processing
 * NEVER expose this client to the browser or use it for user-facing operations
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for admin client');
}

/**
 * Create Supabase admin client with service role
 * WARNING: Bypasses Row Level Security - use with caution
 */
export function createSupabaseServerAdmin() {
  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
