#!/usr/bin/env node

/**
 * Task to Update Conversion Script
 *
 * Converts tasks marked as "ready-to-convert" into full Update entries
 *
 * Usage:
 *   npm run convert:tasks
 *   node scripts/convert-tasks-to-updates.mjs
 */

import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config.ts';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔄 Task to Update Conversion Tool\n');

// Initialize Keystatic reader
const reader = createReader(rootDir, keystaticConfig);

async function convertTasksToUpdates() {
  try {
    // Step 1: Find all tasks marked as "ready-to-convert"
    console.log('📋 Step 1: Finding tasks ready for conversion...');
    const taskSlugs = await reader.collections.tasks.list();

    const readyTasks = [];
    for (const slug of taskSlugs) {
      const task = await reader.collections.tasks.read(slug);
      if (task && task.status === 'ready-to-convert') {
        readyTasks.push({ slug, task });
      }
    }

    if (readyTasks.length === 0) {
      console.log('✅ No tasks ready for conversion. Mark tasks as "Ready to Convert" first.');
      return;
    }

    console.log(`✅ Found ${readyTasks.length} task(s) ready for conversion:\n`);
    readyTasks.forEach(({ slug, task }) => {
      console.log(`   📝 ${task.title} (${slug})`);
    });

    // Step 2: Convert each task to an update
    console.log('\n🔄 Step 2: Converting tasks to updates...\n');

    for (const { slug: taskSlug, task } of readyTasks) {
      try {
        // Create update entry data
        const updateData = {
          title: task.title,
          project: task.project,
          subProject: task.subProject || null,
          date: new Date().toISOString().split('T')[0], // Today's date
          type: 'milestone', // Tasks that complete become milestones
          tags: task.tags || [],
          content: createUpdateContent(task),
        };

        // Create update directory
        const updateSlug = `${updateData.date}-${taskSlug}`;
        const updateDir = path.join(rootDir, 'content', 'updates', updateSlug);

        await fs.mkdir(updateDir, { recursive: true });

        // Write update metadata (index.yaml)
        const yamlContent = Object.entries(updateData)
          .filter(([key]) => key !== 'content')
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              if (value.length === 0) return `${key}: []`;
              return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
            }
            if (value === null) return `${key}: null`;
            return `${key}: ${value}`;
          })
          .join('\n');

        await fs.writeFile(
          path.join(updateDir, 'index.yaml'),
          yamlContent,
          'utf-8'
        );

        // Write update content (content.mdoc)
        await fs.writeFile(
          path.join(updateDir, 'content.mdoc'),
          updateData.content,
          'utf-8'
        );

        console.log(`   ✅ Created update: ${updateSlug}`);

        // Step 3: Archive or delete the original task
        const taskDir = path.join(rootDir, 'content', 'tasks', taskSlug);
        const archivedTasksDir = path.join(rootDir, 'content', 'archived-tasks');

        await fs.mkdir(archivedTasksDir, { recursive: true });
        await fs.rename(taskDir, path.join(archivedTasksDir, taskSlug));

        console.log(`   📦 Archived task: ${taskSlug}\n`);

      } catch (error) {
        console.error(`   ❌ Error converting task "${taskSlug}":`, error.message);
      }
    }

    console.log('\n✨ Conversion complete!');
    console.log(`   📊 Converted: ${readyTasks.length} task(s)`);
    console.log(`   📁 Updates created in: content/updates/`);
    console.log(`   📦 Original tasks archived in: content/archived-tasks/\n`);

  } catch (error) {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  }
}

/**
 * Create rich content for the update based on task data
 */
function createUpdateContent(task) {
  const content = [];

  content.push('# Task Completion Summary\n');

  if (task.notes) {
    content.push('## Notes\n');
    content.push(task.notes);
    content.push('\n');
  }

  content.push('## Details\n');
  content.push(`- **Priority**: ${task.priority}`);
  content.push(`- **Created**: ${task.createdDate}`);
  content.push(`- **Completed**: ${new Date().toISOString().split('T')[0]}`);

  if (task.tags && task.tags.length > 0) {
    content.push(`- **Tags**: ${task.tags.join(', ')}`);
  }

  content.push('\n---\n');
  content.push('*This update was automatically generated from a completed task.*');

  return content.join('\n');
}

// Run the conversion
convertTasksToUpdates();
