/**
 * Markdown Editor Utilities
 * Helper functions for text formatting and markdown insertion
 */

export type MarkdownFormat =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'ul'
  | 'ol'
  | 'todo'
  | 'quote'
  | 'hr';

export type InsertType = 'link' | 'image' | 'codeblock' | 'table';

export interface TextSelection {
  start: number;
  end: number;
}

export interface FormatResult {
  newContent: string;
  newSelection: TextSelection;
}

/**
 * Insert markdown formatting at cursor position or around selected text
 */
export function insertMarkdown(
  content: string,
  selection: TextSelection,
  format: MarkdownFormat
): FormatResult {
  const { start, end } = selection;
  const selectedText = content.substring(start, end);
  const beforeText = content.substring(0, start);
  const afterText = content.substring(end);

  // Check if we're at the start of a line
  const lineStart = beforeText.lastIndexOf('\n') + 1;
  const currentLine = beforeText.substring(lineStart);
  const isLineStart = currentLine.trim() === '';

  let replacement = '';
  let newStart = start;
  let newEnd = end;

  switch (format) {
    case 'bold':
      replacement = `**${selectedText || 'bold text'}**`;
      newStart = start + 2;
      newEnd = newStart + (selectedText ? selectedText.length : 9);
      break;

    case 'italic':
      replacement = `*${selectedText || 'italic text'}*`;
      newStart = start + 1;
      newEnd = newStart + (selectedText ? selectedText.length : 11);
      break;

    case 'strikethrough':
      replacement = `~~${selectedText || 'strikethrough text'}~~`;
      newStart = start + 2;
      newEnd = newStart + (selectedText ? selectedText.length : 18);
      break;

    case 'code':
      replacement = `\`${selectedText || 'code'}\``;
      newStart = start + 1;
      newEnd = newStart + (selectedText ? selectedText.length : 4);
      break;

    case 'h1':
      if (isLineStart) {
        replacement = `# ${selectedText || 'Heading 1'}`;
      } else {
        replacement = `\n# ${selectedText || 'Heading 1'}\n`;
      }
      newStart = start + (isLineStart ? 2 : 3);
      newEnd = newStart + (selectedText ? selectedText.length : 9);
      break;

    case 'h2':
      if (isLineStart) {
        replacement = `## ${selectedText || 'Heading 2'}`;
      } else {
        replacement = `\n## ${selectedText || 'Heading 2'}\n`;
      }
      newStart = start + (isLineStart ? 3 : 4);
      newEnd = newStart + (selectedText ? selectedText.length : 9);
      break;

    case 'h3':
      if (isLineStart) {
        replacement = `### ${selectedText || 'Heading 3'}`;
      } else {
        replacement = `\n### ${selectedText || 'Heading 3'}\n`;
      }
      newStart = start + (isLineStart ? 4 : 5);
      newEnd = newStart + (selectedText ? selectedText.length : 9);
      break;

    case 'ul':
      if (isLineStart) {
        replacement = `- ${selectedText || 'List item'}`;
      } else {
        replacement = `\n- ${selectedText || 'List item'}`;
      }
      newStart = start + (isLineStart ? 2 : 3);
      newEnd = newStart + (selectedText ? selectedText.length : 9);
      break;

    case 'ol':
      if (isLineStart) {
        replacement = `1. ${selectedText || 'List item'}`;
      } else {
        replacement = `\n1. ${selectedText || 'List item'}`;
      }
      newStart = start + (isLineStart ? 3 : 4);
      newEnd = newStart + (selectedText ? selectedText.length : 9);
      break;

    case 'todo':
      if (isLineStart) {
        replacement = `- [ ] ${selectedText || 'Task'}`;
      } else {
        replacement = `\n- [ ] ${selectedText || 'Task'}`;
      }
      newStart = start + (isLineStart ? 6 : 7);
      newEnd = newStart + (selectedText ? selectedText.length : 4);
      break;

    case 'quote':
      if (isLineStart) {
        replacement = `> ${selectedText || 'Quote'}`;
      } else {
        replacement = `\n> ${selectedText || 'Quote'}`;
      }
      newStart = start + (isLineStart ? 2 : 3);
      newEnd = newStart + (selectedText ? selectedText.length : 5);
      break;

    case 'hr':
      if (isLineStart) {
        replacement = '---\n';
      } else {
        replacement = '\n---\n';
      }
      newStart = start + replacement.length;
      newEnd = newStart;
      break;
  }

  const newContent = beforeText + replacement + afterText;

  return {
    newContent,
    newSelection: { start: newStart, end: newEnd },
  };
}

/**
 * Insert a link with optional placeholder text
 */
export function insertLink(
  content: string,
  selection: TextSelection,
  url?: string
): FormatResult {
  const { start, end } = selection;
  const selectedText = content.substring(start, end);
  const linkText = selectedText || 'link text';
  const linkUrl = url || 'https://';

  const replacement = `[${linkText}](${linkUrl})`;
  const newContent =
    content.substring(0, start) + replacement + content.substring(end);

  // Select the URL part for easy editing
  const urlStart = start + linkText.length + 3;
  const urlEnd = urlStart + linkUrl.length;

  return {
    newContent,
    newSelection: { start: urlStart, end: urlEnd },
  };
}

/**
 * Insert an image with optional placeholder
 */
export function insertImage(
  content: string,
  selection: TextSelection,
  url?: string
): FormatResult {
  const { start, end } = selection;
  const selectedText = content.substring(start, end);
  const altText = selectedText || 'image alt text';
  const imageUrl = url || 'https://';

  const replacement = `![${altText}](${imageUrl})`;
  const newContent =
    content.substring(0, start) + replacement + content.substring(end);

  // Select the URL part for easy editing
  const urlStart = start + altText.length + 4;
  const urlEnd = urlStart + imageUrl.length;

  return {
    newContent,
    newSelection: { start: urlStart, end: urlEnd },
  };
}

/**
 * Insert a code block with optional language
 */
export function insertCodeBlock(
  content: string,
  selection: TextSelection,
  language?: string
): FormatResult {
  const { start } = selection;
  const beforeText = content.substring(0, start);
  const afterText = content.substring(selection.end);

  const lineStart = beforeText.lastIndexOf('\n') + 1;
  const currentLine = beforeText.substring(lineStart);
  const isLineStart = currentLine.trim() === '';

  const lang = language || 'javascript';
  const code = '// Your code here';

  const replacement = isLineStart
    ? `\`\`\`${lang}\n${code}\n\`\`\`\n`
    : `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;

  const newContent = beforeText + replacement + afterText;

  // Select the code content
  const codeStart = start + (isLineStart ? 0 : 1) + lang.length + 4;
  const codeEnd = codeStart + code.length;

  return {
    newContent,
    newSelection: { start: codeStart, end: codeEnd },
  };
}

/**
 * Insert a markdown table
 */
export function insertTable(
  content: string,
  selection: TextSelection,
  rows: number = 3,
  cols: number = 3
): FormatResult {
  const { start } = selection;
  const beforeText = content.substring(0, start);
  const afterText = content.substring(selection.end);

  const lineStart = beforeText.lastIndexOf('\n') + 1;
  const currentLine = beforeText.substring(lineStart);
  const isLineStart = currentLine.trim() === '';

  // Build table header
  const header = `| ${Array(cols).fill('Header').join(' | ')} |`;
  const separator = `| ${Array(cols).fill('---').join(' | ')} |`;

  // Build table rows
  const rowsArray = Array(rows - 1)
    .fill(null)
    .map(() => `| ${Array(cols).fill('Cell').join(' | ')} |`);

  const table = [header, separator, ...rowsArray].join('\n');
  const replacement = isLineStart ? `${table}\n` : `\n${table}\n`;

  const newContent = beforeText + replacement + afterText;
  const newStart = start + replacement.length;

  return {
    newContent,
    newSelection: { start: newStart, end: newStart },
  };
}

/**
 * Check if text has specific formatting at selection
 */
export function hasFormat(
  content: string,
  selection: TextSelection,
  format: MarkdownFormat
): boolean {
  const { start, end } = selection;
  const selectedText = content.substring(start, end);
  const beforeChar = content.charAt(start - 1);
  const beforeChar2 = content.substring(start - 2, start);
  const afterChar = content.charAt(end);
  const afterChar2 = content.substring(end, end + 2);

  switch (format) {
    case 'bold':
      return beforeChar2 === '**' && afterChar2 === '**';
    case 'italic':
      return beforeChar === '*' && afterChar === '*' && beforeChar2 !== '**';
    case 'code':
      return beforeChar === '`' && afterChar === '`';
    case 'strikethrough':
      return beforeChar2 === '~~' && afterChar2 === '~~';
    default:
      return false;
  }
}
