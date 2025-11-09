/**
 * Access Control Utilities
 *
 * Handles granular gating for projects, sub-projects, updates, and documentation
 * Supports inheritance of visibility settings from parents
 */

export type Visibility = 'public' | 'gated' | 'private' | 'inherit';

export interface ContentItem {
  visibility?: Visibility;
  safetyCode?: string;
}

export interface ProjectContent extends ContentItem {
  slug: string;
  title: string;
}

export interface SubProjectContent extends ContentItem {
  slug: string;
  title: string;
  parentProject: string;
}

export interface UpdateContent extends ContentItem {
  slug: string;
  title: string;
  project?: string;
  subProject?: string;
}

/**
 * Get the effective visibility of a content item, resolving "inherit" values
 *
 * @param item - The content item to check
 * @param parent - The parent content item (if any)
 * @returns The effective visibility level
 *
 * @example
 * // Sub-project with inherit
 * const subProject = { visibility: 'inherit' };
 * const project = { visibility: 'gated' };
 * getEffectiveVisibility(subProject, project); // Returns 'gated'
 *
 * @example
 * // Sub-project with explicit visibility (overrides parent)
 * const subProject = { visibility: 'public' };
 * const project = { visibility: 'gated' };
 * getEffectiveVisibility(subProject, project); // Returns 'public'
 */
export function getEffectiveVisibility(
  item: ContentItem,
  parent?: ContentItem
): Exclude<Visibility, 'inherit'> {
  // If item has explicit visibility (not inherit), use it
  if (item.visibility && item.visibility !== 'inherit') {
    return item.visibility;
  }

  // If item is set to inherit and has a parent, use parent's visibility
  if (item.visibility === 'inherit' && parent) {
    // Recursively resolve parent's visibility in case parent also inherits
    return getEffectiveVisibility(parent);
  }

  // Default to public if no visibility set or no parent to inherit from
  return 'public';
}

/**
 * Check if content requires a safety code for access
 *
 * @param item - The content item to check
 * @param parent - The parent content item (if any)
 * @returns Object with requiresGating boolean and the safety code to use
 *
 * @example
 * const subProject = { visibility: 'gated', safetyCode: 'sub_safety_v1' };
 * requiresSafetyCode(subProject); // { requiresGating: true, safetyCode: 'sub_safety_v1' }
 *
 * @example
 * const subProject = { visibility: 'inherit' };
 * const project = { visibility: 'gated', safetyCode: 'project_safety_v1' };
 * requiresSafetyCode(subProject, project); // { requiresGating: true, safetyCode: 'project_safety_v1' }
 */
export function requiresSafetyCode(
  item: ContentItem,
  parent?: ContentItem
): { requiresGating: boolean; safetyCode: string | null } {
  const effectiveVisibility = getEffectiveVisibility(item, parent);

  if (effectiveVisibility !== 'gated') {
    return { requiresGating: false, safetyCode: null };
  }

  // If item has own safety code, use it
  if (item.safetyCode) {
    return { requiresGating: true, safetyCode: item.safetyCode };
  }

  // If inheriting gating, use parent's safety code
  if (item.visibility === 'inherit' && parent?.safetyCode) {
    return { requiresGating: true, safetyCode: parent.safetyCode };
  }

  // Gated but no safety code (shouldn't happen, but handle gracefully)
  console.warn('[Access Control] Content is gated but has no safety code:', item);
  return { requiresGating: true, safetyCode: null };
}

/**
 * Check if user can access content based on visibility level
 *
 * @param effectiveVisibility - The resolved visibility level
 * @param user - The current user (if authenticated)
 * @param isOwner - Whether the current user is the workspace owner
 * @returns Whether the user can access the content
 */
export function canAccess(
  effectiveVisibility: Exclude<Visibility, 'inherit'>,
  user: any | null,
  isOwner: boolean
): boolean {
  // Owner can always access everything
  if (isOwner) {
    return true;
  }

  switch (effectiveVisibility) {
    case 'public':
      // Everyone can access public content
      return true;

    case 'gated':
      // Gated content requires authentication
      // Actual safety code verification happens in separate modal
      return !!user;

    case 'private':
      // Private content only accessible to owner
      return false;

    default:
      return false;
  }
}

/**
 * Get visibility badge info for UI display
 *
 * @param visibility - The visibility level
 * @returns Object with label and color class for badge
 */
export function getVisibilityBadge(visibility: Exclude<Visibility, 'inherit'>) {
  switch (visibility) {
    case 'public':
      return { label: 'Public', colorClass: 'bg-green-100 text-green-800' };
    case 'gated':
      return { label: 'Gated', colorClass: 'bg-yellow-100 text-yellow-800' };
    case 'private':
      return { label: 'Private', colorClass: 'bg-red-100 text-red-800' };
    default:
      return { label: 'Public', colorClass: 'bg-gray-100 text-gray-800' };
  }
}
