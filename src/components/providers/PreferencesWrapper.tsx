/**
 * Client-side wrapper for PreferencesProvider
 * Receives user repo info from server-side Astro component
 */

import { PreferencesProvider } from './PreferencesProvider';
import type { ReactNode } from 'react';

interface PreferencesWrapperProps {
  children: ReactNode;
  repoInfo?: {
    token: string;
    owner: string;
    repo: string;
    branch?: string;
  } | null;
}

export function PreferencesWrapper({ children, repoInfo }: PreferencesWrapperProps) {
  // If no repo info, children will use localStorage fallback
  if (!repoInfo) {
    return <>{children}</>;
  }

  return (
    <PreferencesProvider
      token={repoInfo.token}
      owner={repoInfo.owner}
      repo={repoInfo.repo}
      branch={repoInfo.branch || 'main'}
    >
      {children}
    </PreferencesProvider>
  );
}
