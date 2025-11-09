/**
 * Helper to get decrypted user repository information
 * Used for initializing GitHub-backed preferences
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { decryptToken } from './tokenEncryption';

export interface UserRepoInfo {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

/**
 * Fetch and decrypt user's GitHub repository information
 * Returns null if user hasn't set up their repository yet
 */
export async function getUserRepoInfo(
  supabase: SupabaseClient,
  userId: string
): Promise<UserRepoInfo | null> {
  try {
    const { data: userRepo, error } = await supabase
      .from('user_repos')
      .select('github_token_encrypted, repo_owner, repo_name, default_branch')
      .eq('user_id', userId)
      .single();

    if (error || !userRepo) {
      console.log('[getUserRepoInfo] No repo configured for user');
      return null;
    }

    // Decrypt the GitHub token
    const decryptedToken = decryptToken(userRepo.github_token_encrypted);

    return {
      token: decryptedToken,
      owner: userRepo.repo_owner,
      repo: userRepo.repo_name,
      branch: userRepo.default_branch || 'main',
    };
  } catch (error) {
    console.error('[getUserRepoInfo] Failed to get repo info:', error);
    return null;
  }
}
