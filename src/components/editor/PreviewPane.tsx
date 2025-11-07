/**
 * PreviewPane Component
 * Renders markdown content with syntax highlighting
 */

import React, { useMemo, forwardRef } from 'react';
import { parseMarkdown } from '../../lib/markdown';

export interface PreviewPaneProps {
  markdown: string;
  className?: string;
}

export const PreviewPane = forwardRef<HTMLDivElement, PreviewPaneProps>(
  ({ markdown, className = '' }, ref) => {
    // Memoize parsed HTML to avoid re-parsing on every render
    const htmlContent = useMemo(() => {
      return parseMarkdown(markdown);
    }, [markdown]);

    return (
      <div ref={ref} className={`preview-pane ${className}`}>
        <div
          className="preview-content prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }
);

PreviewPane.displayName = 'PreviewPane';
