/**
 * Markdown Parser Utilities
 * Functions for parsing markdown and calculating stats
 */

import { marked } from 'marked';
import hljs from 'highlight.js';

/**
 * Document statistics interface
 */
export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  readingTime: number; // in minutes
  paragraphs: number;
  sentences: number;
}

/**
 * Configure marked with custom options
 */
export function configureMarked() {
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (err) {
          console.error('Highlight.js error:', err);
        }
      }
      return code;
    },
  });
}

/**
 * Parse markdown to HTML
 */
export function parseMarkdown(markdown: string): string {
  try {
    return marked.parse(markdown) as string;
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return '<p>Error parsing markdown</p>';
  }
}

/**
 * Calculate document statistics
 */
export function calculateStats(content: string): DocumentStats {
  // Words count (split by whitespace, filter empty)
  const wordsArray = content
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0 && /\w/.test(w));
  const words = wordsArray.length;

  // Characters
  const characters = content.length;
  const charactersNoSpaces = content.replace(/\s/g, '').length;

  // Reading time (200 words per minute average)
  const readingTime = Math.ceil(words / 200) || 1;

  // Paragraphs (blocks separated by blank lines)
  const paragraphs = content
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  // Sentences (rough approximation)
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    .length;

  return {
    words,
    characters,
    charactersNoSpaces,
    readingTime,
    paragraphs,
    sentences,
  };
}

/**
 * Format stats for display
 */
export function formatStats(stats: DocumentStats): string {
  const { words, characters, readingTime } = stats;
  return `${words} words · ${characters} characters · ${readingTime} min read`;
}

/**
 * Extract title from markdown content (first H1 or first line)
 */
export function extractTitle(content: string): string {
  // Try to find first H1
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Fallback to first non-empty line
  const firstLine = content.split('\n').find((line) => line.trim().length > 0);
  if (firstLine) {
    return firstLine.trim().substring(0, 100);
  }

  return 'Untitled Document';
}

/**
 * Generate table of contents from markdown
 */
export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export function generateToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    toc.push({ level, text, id });
  }

  return toc;
}

/**
 * Remove markdown formatting for plain text extraction
 */
export function stripMarkdown(content: string): string {
  return content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove italic
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove headings
    .replace(/^#{1,6}\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Validate markdown syntax (basic check)
 */
export function validateMarkdown(content: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for unmatched code blocks
  const codeBlockCount = (content.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    errors.push('Unmatched code block delimiters (```)');
  }

  // Check for unmatched brackets in links/images
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push('Unmatched square brackets');
  }

  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push('Unmatched parentheses');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Initialize marked configuration
configureMarked();
