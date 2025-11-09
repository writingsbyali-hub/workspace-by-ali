/**
 * Default gating requirements for different types of gated content
 * These can be customized per project/subproject in the future
 */

export interface GatingRequirement {
  key: string;
  title: string;
  description: string;
  category: 'safety' | 'licensing' | 'ethics' | 'community';
}

/**
 * Standard safety requirements for gated content
 */
export const DEFAULT_SAFETY_REQUIREMENTS: GatingRequirement[] = [
  {
    key: 'understand-risks',
    title: 'I understand the potential risks',
    description: 'This content may contain sensitive information, technical details, or methodologies that require careful consideration and appropriate handling.',
    category: 'safety'
  },
  {
    key: 'appropriate-use',
    title: 'I will use this information appropriately',
    description: 'I commit to using any information, data, or methods responsibly and in accordance with applicable laws, regulations, and ethical guidelines.',
    category: 'ethics'
  },
  {
    key: 'no-malicious-intent',
    title: 'I have no malicious intent',
    description: 'I affirm that I am accessing this content for legitimate purposes such as research, education, or defensive security, and not for malicious activities.',
    category: 'ethics'
  },
  {
    key: 'licensing-acknowledgment',
    title: 'I acknowledge the licensing terms',
    description: 'I understand that this content may be subject to specific licensing restrictions and I agree to comply with those terms.',
    category: 'licensing'
  }
];

/**
 * Get requirements for a specific content type
 * In the future, this could be enhanced to fetch custom requirements from Keystatic
 */
export function getRequirementsForContent(
  contentType: 'project' | 'subproject' | 'update',
  contentSlug: string
): GatingRequirement[] {
  // For now, return default requirements
  // In the future, could fetch custom requirements from content frontmatter or separate config
  return DEFAULT_SAFETY_REQUIREMENTS;
}
