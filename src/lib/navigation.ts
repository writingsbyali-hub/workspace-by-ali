/**
 * Navigation configuration for Workspace
 * Centralized navigation structure for public-facing pages
 */

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  external?: boolean;
}

/**
 * Main navigation items (public header)
 * Personal tone for researcher's workspace
 * Note: "Docs" moved to template site - not part of personal workspace nav
 */
export const publicNavigation: NavItem[] = [
  { label: 'Welcome', path: '/' },
  { label: 'My Projects', path: '/projects' },
  { label: 'About Me', path: '/about' },
  { label: 'My Rules', path: '/safety' },
];

/**
 * Footer navigation groups
 */
export const footerNavigation = {
  quickLinks: [
    { label: 'My Projects', path: '/projects' },
    { label: 'About Me', path: '/about' },
    { label: 'My Rules', path: '/safety' },
  ],
  forResearchers: [
    { label: 'Get Your Own Workspace', path: '/start' },
    { label: 'View Template', path: '/template-index' },
    { label: 'Fork on GitHub', path: 'https://github.com/yourusername/workspace', external: true },
  ],
};

/**
 * Workbench navigation items (owner-only sidebar)
 * Feature-based organization for owner dashboard
 */
export const workbenchNavigation: NavItem[] = [
  { label: 'Dashboard', path: '/workbench' },
  { label: 'Content Editor', path: '/keystatic' },
  { label: 'Projects', path: '/workbench/projects/new' },
  { label: 'Updates', path: '/workbench/updates' },
  { label: 'Docs', path: '/workbench/docs' },
  { label: 'Settings', path: '/workbench/settings' },
  { label: 'Profile', path: '/workbench/profile' },
];

/**
 * Social media platforms configuration
 */
export const socialPlatforms = {
  github: {
    label: 'GitHub',
    icon: 'github',
    baseUrl: 'https://github.com/',
  },
  twitter: {
    label: 'Twitter',
    icon: 'twitter',
    baseUrl: 'https://twitter.com/',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: 'linkedin',
    baseUrl: 'https://linkedin.com/in/',
  },
  email: {
    label: 'Email',
    icon: 'email',
    baseUrl: 'mailto:',
  },
};
