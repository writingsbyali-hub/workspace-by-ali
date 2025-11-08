# 🚀 DASHBOARD V2 - COMPREHENSIVE IMPLEMENTATION ROADMAP
## Combining Vision + Design + Current Progress

**Date:** November 7, 2025  
**Current Status:** 85% Complete (Basic Dashboard)  
**Next Phase:** Transform into Collaboration Hub  
**Priority:** HIGH

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Vision Alignment](#vision-alignment)
3. [Current State Analysis](#current-state-analysis)
4. [Immediate Fixes (Phase 1)](#phase-1-immediate-visual-refinement)
5. [Collaboration Features (Phase 2)](#phase-2-collaboration-hub-features)
6. [Advanced Features (Phase 3)](#phase-3-advanced-features)
7. [Technical Specifications](#technical-specifications)
8. [Implementation Timeline](#implementation-timeline)

---

## 🎯 EXECUTIVE SUMMARY

### The Vision
Transform the dashboard from a **metrics display** into a **research collaboration hub** that:
- Shows what needs attention (tasks, notifications)
- Facilitates collaboration (who's engaging, what they need)
- Provides quick actions for common workflows
- Scales to one screen (no page scroll, section-based scrolling)
- Supports both owner and visitor perspectives

### Current State
✅ **85% Complete** - Component architecture solid, design system applied  
⚠️ **Needs Refinement** - Visual polish, spacing, typography hierarchy  
🚧 **Missing Core Features** - Tasks, notifications, collaboration indicators

### Approach
**Three-Phase Implementation:**
1. **Phase 1 (2-3 hours):** Polish existing dashboard (spacing, typography, visual hierarchy)
2. **Phase 2 (6-8 hours):** Add collaboration features (tasks, notifications)
3. **Phase 3 (Future):** Advanced features (progress tracking, results integration)

---

## 🎨 VISION ALIGNMENT

### User's Core Requirements

**PRIMARY GOALS:**
1. ✅ **Task-Focused Dashboard** - Show what needs doing, not vanity metrics
2. ✅ **Collaboration Hub** - Enable public contributors to see how they can help
3. ✅ **One-Screen Layout** - Everything visible at 100% zoom, sections scroll internally
4. ✅ **Minimal Distractions** - Clean, functional, no unnecessary hover effects
5. ✅ **Future-Ready** - Space for notifications, task lists, progress indicators

**SECONDARY GOALS:**
6. ✅ Stats are helpful context, but secondary to tasks/collaboration
7. ✅ Fake percentages are annoying - show absolute numbers only
8. ✅ Design should support both owner view and public visitor view

### Design Principles

**From User Feedback:**
- 🎯 **Function > Form** - But both should be excellent
- 🎯 **Collaboration > Metrics** - Dashboard is about action, not reporting
- 🎯 **Clarity > Cleverness** - Straightforward, scannable, actionable
- 🎯 **Minimal > Flashy** - Subtle effects, no distracting animations
- 🎯 **Extensible > Fixed** - Room to grow as features are added

---

## 📊 CURRENT STATE ANALYSIS

### What Claude Code Has Completed (85%)

#### ✅ Component Architecture
```
✅ WelcomeHeader.tsx - Time-based greeting
✅ StatsGrid.tsx - Grid container for stats
✅ StatCard.tsx - Individual stat display (existing)
✅ QuickActions.tsx - Action buttons sidebar
✅ GettingStarted.tsx - Onboarding card
✅ EmptyActivity.tsx - Empty state for updates
✅ DashboardLayout.astro - Main layout (Keystatic removed)
✅ index.astro - Refactored with new components
```

#### ✅ Design System Applied
```
✅ CSS variables used throughout
✅ Spacing scale implemented
✅ Typography hierarchy defined
✅ Button styles (primary, secondary, ghost)
✅ Dark mode support
✅ Responsive breakpoints
```

#### ✅ Keystatic Removal (Dashboard Scope)
```
✅ Removed from DashboardLayout
✅ Removed Editor nav item
✅ Updated Quick Actions routes
✅ No Keystatic imports in dashboard
```

### What Needs Improvement

#### 🔴 Visual Refinement Needed (User + Design Feedback)
1. **Stat Cards** - Numbers need to be bigger (48px), bolder
2. **Header Size** - Welcome header too small (needs 32px)
3. **Spacing** - Cramped throughout (needs 28px card padding, 48px header margin)
4. **Typography Hierarchy** - Too uniform, lacks visual contrast
5. **Empty State** - Could be more engaging (icon + better CTA)
6. **Hover Effects** - Remove green borders (user preference: subtle lift only)
7. **Fake Percentages** - Remove "↗ 12% from last month" (annoying, meaningless)
8. **Section Scrolling** - Implement internal scrolling (not page scroll)

#### 🟡 Missing Collaboration Features (User Vision)
9. **Task List** - HIGH PRIORITY - Show what needs doing
10. **Notifications** - HIGH PRIORITY - Show who's engaging
11. **Contributor View** - Different layout for public visitors
12. **Activity Timeline** - Better display of recent changes
13. **Collaboration Indicators** - Show active contributors

#### 🔵 Future Features (Roadmap)
14. **Project Progress Tracking** - Visual milestones
15. **Results/Findings Widget** - Link to latest outputs
16. **GitHub Integration** - Issues, PRs, commits
17. **Advanced Analytics** - Usage insights
18. **Custom Widgets** - User-configurable dashboard

---

## 🎨 PHASE 1: IMMEDIATE VISUAL REFINEMENT
**Timeline:** 2-3 hours  
**Status:** Ready to implement  
**Priority:** HIGH

### Objective
Polish the existing dashboard to match design system and user preferences without adding new features.

### Tasks

#### 1.1 Typography Refinement ⚡ HIGH IMPACT
**File:** `src/styles/global.css`

**Changes Needed:**
```css
/* Welcome Header - Make it BOLD */
.welcome-header h1 {
  font-size: 32px;           /* Currently ~24px */
  font-weight: 700;          /* Already correct */
  line-height: 1.2;          /* Add for better spacing */
  margin-bottom: 8px;        /* Already correct */
}

.welcome-header .subtitle {
  font-size: 15px;           /* Currently 14px */
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Stat Card Numbers - Make them HUGE */
.stat-value {
  font-size: 48px;           /* Currently smaller */
  font-weight: 700;          /* Make it BOLD */
  line-height: 1;            /* Tight line height */
  color: var(--text-primary);
  margin-bottom: 8px;
}

/* Stat Labels - Increase weight */
.stat-label {
  font-size: 14px;           /* Currently 13px */
  font-weight: 600;          /* Currently 500 */
  color: var(--text-primary);
  margin-bottom: 4px;
}

/* Section Titles - Increase size */
.section-title {
  font-size: 20px;           /* Currently 18px */
  font-weight: 600;
  color: var(--text-primary);
}
```

**Expected Result:** Stronger visual hierarchy, better scannability

---

#### 1.2 Spacing Overhaul ⚡ HIGH IMPACT
**File:** `src/styles/global.css`

**Changes Needed:**
```css
/* Dashboard Main Content */
.dashboard-content {
  padding: 32px;             /* Already correct */
  max-width: 1200px;
}

/* Welcome Header - MORE breathing room */
.welcome-header {
  margin-bottom: 48px;       /* Currently 32px - INCREASE */
}

/* Stats Grid - Proper gaps */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;                 /* Already correct */
  margin-bottom: 32px;       /* Currently 24px - INCREASE */
}

/* Stat Cards - MORE internal padding */
.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 28px;             /* Currently 20px - INCREASE */
  transition: all 0.2s ease;
}

/* Content Section - More padding */
.content-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 28px;             /* Currently 24px */
  border: 1px solid var(--border-default);
  margin-bottom: 24px;
}

/* Section Header - Better spacing */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;       /* Currently 20px - INCREASE */
}
```

**Expected Result:** Dashboard feels more spacious, premium, less cramped

---

#### 1.3 Remove Fake Percentages ⚡ HIGH IMPACT
**Files:** `src/components/ui/StatCard.tsx`, `src/pages/index.astro`

**StatCard.tsx Changes:**
```tsx
// REMOVE the changePercentage prop and display logic
interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  description: string;
  // ❌ REMOVE: changePercentage?: number;
  // ❌ REMOVE: changeDirection?: 'up' | 'down';
  // ❌ REMOVE: changeLabel?: string;
}

export function StatCard({ icon, value, label, description }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-description">{description}</div>
      {/* ❌ REMOVE: Change indicator */}
    </div>
  );
}
```

**index.astro Changes:**
```astro
<!-- Remove changePercentage from all StatCard usages -->
<StatCard
  icon={<FolderIcon />}
  value={stats.projects}
  label="Projects"
  description="Active research projects"
  {/* ❌ REMOVE: changePercentage={12} */}
/>
```

**Expected Result:** No confusing fake percentages, cleaner stat cards

---

#### 1.4 Refined Hover Effects 🎨 POLISH
**File:** `src/styles/global.css`

**Changes Needed:**
```css
/* Stat Card Hover - SUBTLE lift only (no green border) */
.stat-card:hover {
  transform: translateY(-2px);           /* Subtle lift */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08); /* Soft shadow */
  /* ❌ REMOVE: border-color change */
  /* ❌ REMOVE: any green color changes */
}

/* Button Hovers - Keep minimal */
.btn:hover {
  opacity: 0.9;              /* Subtle fade */
  transform: translateY(-1px); /* Very subtle lift */
}

/* Card Hovers - Minimal everywhere */
.content-section:hover {
  /* NO hover effect on content sections */
}

.quick-actions:hover,
.publish-widget:hover,
.getting-started-card:hover {
  /* NO hover effects on sidebar widgets */
}
```

**Expected Result:** Subtle, professional interactions - no distractions

---

#### 1.5 Section-Based Scrolling 🎯 UX CRITICAL
**File:** `src/components/layouts/DashboardLayout.astro`

**Changes Needed:**
```css
/* Main content area - scrolls independently */
.dashboard-main {
  height: calc(100vh - 64px);  /* Full viewport minus header */
  overflow-y: auto;            /* Only this scrolls */
  padding: 32px;
}

/* Right sidebar - scrolls independently */
.sidebar-right {
  height: calc(100vh - 64px);
  overflow-y: auto;            /* Only this scrolls */
  padding: 24px;
}

/* Recent Updates section - internal scroll */
.recent-updates-container {
  max-height: 400px;           /* Fixed height */
  overflow-y: auto;            /* Scroll within section */
  padding-right: 12px;         /* Space for scrollbar */
}

/* Smooth scrolling everywhere */
* {
  scroll-behavior: smooth;
}

/* Custom scrollbar styling (optional) */
.dashboard-main::-webkit-scrollbar,
.sidebar-right::-webkit-scrollbar,
.recent-updates-container::-webkit-scrollbar {
  width: 8px;
}

.dashboard-main::-webkit-scrollbar-track,
.sidebar-right::-webkit-scrollbar-track,
.recent-updates-container::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

.dashboard-main::-webkit-scrollbar-thumb,
.sidebar-right::-webkit-scrollbar-thumb,
.recent-updates-container::-webkit-scrollbar-thumb {
  background: var(--border-emphasis);
  border-radius: 4px;
}
```

**Expected Result:** Everything fits one screen, sections scroll internally

---

#### 1.6 Enhanced Empty State 🎨 POLISH
**File:** `src/components/dashboard/EmptyActivity.tsx`

**Changes Needed:**
```tsx
export function EmptyActivity() {
  return (
    <div className="empty-activity">
      <div className="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        </svg>
      </div>
      <h3 className="empty-title">No recent activity</h3>
      <p className="empty-description">
        Create your first update to start tracking your research progress
      </p>
      <a href="/updates/new" className="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Create Update
      </a>
    </div>
  );
}
```

**CSS Updates:**
```css
.empty-activity {
  text-align: center;
  padding: 64px 24px;        /* Increase from 48px */
}

.empty-icon {
  width: 80px;               /* Increase from 64px */
  height: 80px;
  margin: 0 auto 20px;       /* Increase margin */
  background: var(--bg-hover);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.empty-title {
  font-size: 18px;           /* Increase from 16px */
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;       /* Increase from 8px */
}

.empty-description {
  font-size: 15px;           /* Increase from 14px */
  color: var(--text-secondary);
  margin-bottom: 24px;       /* Increase from 20px */
  line-height: 1.6;
}
```

**Expected Result:** More engaging empty state with better proportions

---

### Phase 1 Testing Checklist

**Visual QA:**
- [ ] Header is 32px and feels prominent
- [ ] Stat numbers are 48px and bold
- [ ] Card padding is 28px (feels spacious)
- [ ] Header has 48px margin-bottom
- [ ] No fake percentages visible
- [ ] Hover effects are subtle (no green borders)
- [ ] Empty state is engaging and well-proportioned

**Functional QA:**
- [ ] Main content scrolls independently
- [ ] Right sidebar scrolls independently
- [ ] Recent Updates section scrolls internally
- [ ] Everything visible at 100% zoom
- [ ] No page-level scrolling
- [ ] Smooth scroll behavior works

**Responsive QA:**
- [ ] Desktop: Everything looks spacious
- [ ] Tablet: Layout adapts gracefully
- [ ] Mobile: Components stack properly

---

## 🚀 PHASE 2: COLLABORATION HUB FEATURES
**Timeline:** 6-8 hours  
**Status:** Specification ready  
**Priority:** HIGH (User's primary vision)

### Objective
Transform dashboard from metrics display to collaboration hub with tasks and notifications.

---

### 2.1 Task List Component 🔥 HIGHEST PRIORITY

**Purpose:** Show what needs doing, enable contributors to help

**File:** `src/components/dashboard/TaskList.tsx`

#### Component Specification

**Props:**
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;       // GitHub username or "Anyone"
  dueDate?: string;          // ISO date string
  projectId?: string;        // Associated project
  githubIssueUrl?: string;   // Link to GitHub issue
  createdAt: string;
  updatedAt: string;
}

interface TaskListProps {
  tasks: Task[];
  maxVisible?: number;       // Default: 5
  showCreateButton?: boolean; // Default: true
  compact?: boolean;         // Default: false
}
```

**Design Specs:**
```css
/* Task List Container */
.task-list {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

/* Task List Header */
.task-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.task-list-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Task Item */
.task-item {
  display: flex;
  align-items: start;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-default);
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: var(--bg-hover);
  border-color: var(--border-emphasis);
}

/* Task Checkbox */
.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-default);
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

.task-checkbox.checked {
  background: var(--success);
  border-color: var(--success);
  /* Checkmark icon */
}

/* Task Content */
.task-content {
  flex: 1;
  min-width: 0; /* Allow text truncation */
}

.task-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.task-title.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 8px;
}

/* Task Priority Badge */
.task-priority {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.task-priority.high {
  background: var(--error-bg);
  color: var(--error);
}

.task-priority.medium {
  background: var(--info-bg);
  color: var(--info);
}

.task-priority.low {
  background: var(--bg-hover);
  color: var(--text-tertiary);
}

/* Task Assignment */
.task-assigned {
  display: flex;
  align-items: center;
  gap: 6px;
}

.task-assignee-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-green);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

/* Empty State */
.task-list-empty {
  text-align: center;
  padding: 32px;
  color: var(--text-secondary);
}
```

**Component Template:**
```tsx
import { useState } from 'react';

export function TaskList({ 
  tasks, 
  maxVisible = 5, 
  showCreateButton = true,
  compact = false 
}: TaskListProps) {
  const [showAll, setShowAll] = useState(false);
  
  const visibleTasks = showAll ? tasks : tasks.slice(0, maxVisible);
  const hasMore = tasks.length > maxVisible;
  
  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2 className="task-list-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          Tasks
          {tasks.length > 0 && (
            <span className="task-count">({tasks.filter(t => t.status !== 'done').length})</span>
          )}
        </h2>
        {showCreateButton && (
          <button className="btn btn-ghost btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Task
          </button>
        )}
      </div>
      
      {tasks.length === 0 ? (
        <div className="task-list-empty">
          <p>No tasks yet. Create your first task to get started!</p>
        </div>
      ) : (
        <>
          <div className="task-items">
            {visibleTasks.map((task) => (
              <TaskItem key={task.id} task={task} compact={compact} />
            ))}
          </div>
          
          {hasMore && !showAll && (
            <button 
              className="btn btn-ghost btn-full"
              onClick={() => setShowAll(true)}
            >
              Show {tasks.length - maxVisible} more tasks
            </button>
          )}
        </>
      )}
    </div>
  );
}

function TaskItem({ task, compact }: { task: Task; compact: boolean }) {
  const [checked, setChecked] = useState(task.status === 'done');
  
  return (
    <div className="task-item">
      <div 
        className={`task-checkbox ${checked ? 'checked' : ''}`}
        onClick={() => setChecked(!checked)}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        )}
      </div>
      
      <div className="task-content">
        <div className={`task-title ${checked ? 'completed' : ''}`}>
          {task.title}
        </div>
        
        {!compact && (
          <div className="task-meta">
            {task.priority && (
              <span className={`task-priority ${task.priority}`}>
                {task.priority}
              </span>
            )}
            
            {task.assignedTo && (
              <span className="task-assigned">
                <div className="task-assignee-avatar">
                  {task.assignedTo.charAt(0).toUpperCase()}
                </div>
                {task.assignedTo}
              </span>
            )}
            
            {task.dueDate && (
              <span className="task-due-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {formatDate(task.dueDate)}
              </span>
            )}
            
            {task.githubIssueUrl && (
              <a href={task.githubIssueUrl} target="_blank" className="task-github-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View Issue
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  return `in ${diffDays} days`;
}
```

#### GitHub Integration

**Data Source:** GitHub Issues API

**Implementation:**
```typescript
// lib/github.ts

export async function getTasks(repoOwner: string, repoName: string): Promise<Task[]> {
  const octokit = await getOctokit();
  
  const { data: issues } = await octokit.issues.listForRepo({
    owner: repoOwner,
    repo: repoName,
    state: 'open',
    labels: 'task', // Filter for issues labeled as "task"
    sort: 'created',
    direction: 'desc'
  });
  
  return issues.map(issue => ({
    id: issue.id.toString(),
    title: issue.title,
    description: issue.body || undefined,
    status: issue.state === 'closed' ? 'done' : 'todo',
    priority: getPriorityFromLabels(issue.labels),
    assignedTo: issue.assignee?.login || 'Anyone',
    dueDate: getMilestone Duedate(issue.milestone),
    githubIssueUrl: issue.html_url,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at
  }));
}

function getPriorityFromLabels(labels: any[]): 'low' | 'medium' | 'high' {
  const labelNames = labels.map(l => l.name.toLowerCase());
  if (labelNames.includes('priority: high')) return 'high';
  if (labelNames.includes('priority: medium')) return 'medium';
  return 'low';
}
```

**Dashboard Integration:**
```astro
---
// src/pages/index.astro

import TaskList from '@/components/dashboard/TaskList';
import { getTasks } from '@/lib/github';

const tasks = await getTasks(userRepo.owner, userRepo.name);
---

<DashboardLayout>
  <div class="dashboard-content">
    <WelcomeHeader userName={user.name} />
    
    {/* Stats Grid - Smaller now */}
    <StatsGrid stats={stats} compact />
    
    {/* Task List - PROMINENT */}
    <TaskList tasks={tasks} maxVisible={5} showCreateButton />
    
    {/* Recent Updates below tasks */}
    <div class="content-section">
      <!-- ... -->
    </div>
  </div>
</DashboardLayout>
```

---

### 2.2 Notifications Component 🔥 HIGH PRIORITY

**Purpose:** Show who's engaging with your work, collaboration requests

**File:** `src/components/dashboard/NotificationList.tsx`

#### Component Specification

**Props:**
```typescript
interface Notification {
  id: string;
  type: 'comment' | 'mention' | 'star' | 'fork' | 'issue' | 'pr' | 'task_assigned';
  title: string;
  description?: string;
  actor: {
    username: string;
    avatarUrl: string;
  };
  targetUrl: string;        // Link to the thing (issue, comment, etc.)
  read: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
  maxVisible?: number;      // Default: 5
  showMarkAllRead?: boolean; // Default: true
}
```

**Design Specs:**
```css
/* Notification List Container */
.notification-list {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

/* Notification Header */
.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-badge {
  background: var(--error);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Notification Item */
.notification-item {
  display: flex;
  align-items: start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background: var(--bg-hover);
}

.notification-item.unread {
  background: var(--green-tint);
  border-left: 3px solid var(--primary-green);
}

/* Avatar */
.notification-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

/* Content */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-message {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-message strong {
  font-weight: 600;
  color: var(--purple-accent);
}

.notification-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 6px;
}

.notification-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* Type Icons */
.notification-type-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--text-secondary);
}

/* Empty State */
.notification-empty {
  text-align: center;
  padding: 24px;
  color: var(--text-secondary);
}
```

**Component Template:**
```tsx
import { useState } from 'react';

export function NotificationList({ 
  notifications, 
  maxVisible = 5,
  showMarkAllRead = true 
}: NotificationListProps) {
  const [items, setItems] = useState(notifications);
  const [showAll, setShowAll] = useState(false);
  
  const unreadCount = items.filter(n => !n.read).length;
  const visibleItems = showAll ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;
  
  const markAllRead = () => {
    setItems(items.map(n => ({ ...n, read: true })));
    // TODO: API call to mark all as read
  };
  
  return (
    <div className="notification-list">
      <div className="notification-header">
        <div className="notification-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          Notifications
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
        {showMarkAllRead && unreadCount > 0 && (
          <button className="btn-text" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="notification-empty">
          <p>No notifications yet. We'll let you know when something happens!</p>
        </div>
      ) : (
        <>
          <div className="notification-items">
            {visibleItems.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                onClick={() => window.location.href = notification.targetUrl}
              />
            ))}
          </div>
          
          {hasMore && !showAll && (
            <button 
              className="btn btn-ghost btn-full btn-sm"
              onClick={() => setShowAll(true)}
            >
              Show {items.length - maxVisible} more
            </button>
          )}
        </>
      )}
    </div>
  );
}

function NotificationItem({ notification, onClick }: { 
  notification: Notification; 
  onClick: () => void;
}) {
  return (
    <div 
      className={`notification-item ${notification.read ? '' : 'unread'}`}
      onClick={onClick}
    >
      <img 
        src={notification.actor.avatarUrl} 
        alt={notification.actor.username}
        className="notification-avatar"
      />
      
      <div className="notification-content">
        <div className="notification-message">
          <strong>@{notification.actor.username}</strong> {notification.title}
        </div>
        
        {notification.description && (
          <div className="notification-description">
            {notification.description}
          </div>
        )}
        
        <div className="notification-time">
          {formatRelativeTime(notification.createdAt)}
        </div>
      </div>
      
      {getTypeIcon(notification.type)}
    </div>
  );
}

function getTypeIcon(type: Notification['type']) {
  const icons = {
    comment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    mention: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8A6 6 0 106 8v6M12 14v2"/></svg>,
    star: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    fork: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 1-1 2-2 2H8c-1 0-2-1-2-2V9M12 12v3"/></svg>,
    issue: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    pr: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7M6 9v12"/></svg>,
    task_assigned: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
  };
  
  return <div className="notification-type-icon">{icons[type]}</div>;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
```

#### GitHub Integration

**Data Source:** GitHub Notifications API + Webhooks

**Implementation:**
```typescript
// lib/github.ts

export async function getNotifications(): Promise<Notification[]> {
  const octokit = await getOctokit();
  
  const { data: githubNotifications } = await octokit.activity.listNotificationsForAuthenticatedUser({
    all: false,
    participating: true
  });
  
  return githubNotifications.map(notif => ({
    id: notif.id,
    type: mapNotificationType(notif.reason),
    title: getNotificationTitle(notif.reason, notif.subject.type),
    description: notif.subject.title,
    actor: {
      username: notif.repository.owner.login,
      avatarUrl: notif.repository.owner.avatar_url
    },
    targetUrl: notif.subject.url,
    read: notif.unread === false,
    createdAt: notif.updated_at
  }));
}

function mapNotificationType(reason: string): Notification['type'] {
  const mapping: Record<string, Notification['type']> = {
    'comment': 'comment',
    'mention': 'mention',
    'subscribed': 'star',
    'assign': 'task_assigned',
    'review_requested': 'pr'
  };
  return mapping[reason] || 'issue';
}
```

**Dashboard Integration:**
```astro
---
// src/pages/index.astro

import NotificationList from '@/components/dashboard/NotificationList';
import { getNotifications } from '@/lib/github';

const notifications = await getNotifications();
---

<DashboardLayout>
  <div slot="sidebar-right">
    {/* Notifications at TOP of right sidebar */}
    <NotificationList 
      notifications={notifications} 
      maxVisible={5}
      showMarkAllRead 
    />
    
    <QuickActions />
    <PublishWidget />
    <GettingStarted />
  </div>
</DashboardLayout>
```

---

### 2.3 Stats Grid - Make It Smaller & Optional

**Changes Needed:**

#### Option A: Compact Stats Bar (Recommended)
```css
/* Make stats much smaller - single row at top */
.stats-bar {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-default);
  margin-bottom: 24px;
}

.stat-item-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.stat-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value-compact {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.stat-label-compact {
  font-size: 12px;
  color: var(--text-secondary);
}
```

#### Option B: Collapsible Stats
```tsx
// Make stats collapsible
export function StatsGrid({ stats, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  return (
    <div className="stats-container">
      <button 
        className="stats-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span>Stats</span>
        <svg className={expanded ? 'rotated' : ''}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      
      {expanded && (
        <div className="stats-grid">
          {/* Current stats grid */}
        </div>
      )}
    </div>
  );
}
```

#### Option C: Remove Stats Entirely
```tsx
// Only show stats on hover/tooltip over sidebar icon
<div className="dashboard-stats-icon" title="View Stats">
  <svg>...</svg>
  <Tooltip>
    <StatsGrid stats={stats} compact />
  </Tooltip>
</div>
```

**Recommendation:** Use Option A (Compact Stats Bar) - keeps them visible but not dominant

---

### 2.4 Public Visitor View (Context-Aware Dashboard)

**Purpose:** Different layout when viewing someone else's workspace

**Implementation:**

```tsx
// src/pages/index.astro

---
const user = Astro.locals.user;
const workspaceOwner = await getWorkspaceOwner(); // From URL or config

const isOwner = user?.id === workspaceOwner.id;
const isVisitor = !isOwner;
---

{isOwner ? (
  <!-- OWNER VIEW -->
  <DashboardLayout>
    <div class="dashboard-content">
      <WelcomeHeader userName={user.name} />
      <StatsBar stats={stats} compact />
      <TaskList tasks={tasks} />
      <RecentUpdates activities={activities} />
    </div>
    
    <div slot="sidebar-right">
      <NotificationList notifications={notifications} />
      <QuickActions />
      <PublishWidget />
    </div>
  </DashboardLayout>
) : (
  <!-- VISITOR VIEW -->
  <DashboardLayout>
    <div class="dashboard-content">
      <div class="workspace-header">
        <img src={workspaceOwner.avatar} class="workspace-avatar" />
        <div>
          <h1>{workspaceOwner.name}'s Research Workspace</h1>
          <p>{workspaceOwner.bio}</p>
        </div>
      </div>
      
      {/* Show stats for credibility */}
      <StatsGrid stats={stats} />
      
      {/* Show public projects */}
      <ProjectList projects={publicProjects} />
      
      {/* Show recent public updates */}
      <RecentUpdates activities={publicActivities} />
      
      {/* Show how to contribute */}
      <ContributeSection tasks={publicTasks} />
    </div>
    
    <div slot="sidebar-right">
      {/* Show collaboration opportunities */}
      <div class="contribute-card">
        <h3>Want to Contribute?</h3>
        <p>Check out the tasks below to see how you can help!</p>
        <button class="btn btn-primary">View Open Tasks</button>
      </div>
      
      <ActivityFeed />
    </div>
  </DashboardLayout>
)}
```

---

### Phase 2 Testing Checklist

**Task List:**
- [ ] Tasks display from GitHub Issues
- [ ] Checkboxes work (mark complete)
- [ ] Priority badges show correctly
- [ ] Assignment avatars display
- [ ] Due dates format correctly
- [ ] "Add Task" button works
- [ ] "Show more" expands list
- [ ] Empty state displays when no tasks
- [ ] GitHub issue links work

**Notifications:**
- [ ] Notifications fetch from GitHub API
- [ ] Unread count displays correctly
- [ ] Badge shows unread count
- [ ] Click navigates to target (issue, PR, etc.)
- [ ] "Mark all read" works
- [ ] Different notification types have correct icons
- [ ] Avatars display correctly
- [ ] Relative time formatting works
- [ ] Empty state shows when no notifications

**Layout:**
- [ ] Tasks are prominent (above other content)
- [ ] Notifications at top of right sidebar
- [ ] Stats are smaller/less prominent
- [ ] Everything still fits one screen
- [ ] Sections scroll independently
- [ ] No fake percentages anywhere

**Context-Aware:**
- [ ] Owner sees owner view
- [ ] Visitors see visitor view
- [ ] Public tasks visible to visitors
- [ ] Contribute section shows for visitors

---

## 🔮 PHASE 3: ADVANCED FEATURES (FUTURE)
**Timeline:** TBD (After Phase 2)  
**Status:** Specification only  
**Priority:** LOW (Nice-to-have)

### 3.1 Project Progress Tracking

**Component:** `ProjectProgress.tsx`

**Purpose:** Visual milestones, stage tracking

**Design Concept:**
```
┌─ Plasma Research Progress ──────────────────────┐
│ ████████████░░░░ 65% Complete                   │
│                                                  │
│ ✅ Literature Review (Completed Oct 15)        │
│ ✅ Experimental Setup (Completed Nov 1)        │
│ 🔄 Data Collection (In Progress - 45%)         │
│    └─ Collaborators: @researcher1, @you        │
│ ☐ Statistical Analysis (Not started)           │
│ ☐ Publication Draft (Not started)              │
└──────────────────────────────────────────────────┘
```

**Integration:** Project-level detail page, summary on dashboard

---

### 3.2 Results/Findings Section

**Location:** Separate page (`/results` or `/findings`)

**Purpose:** Show research outputs, visualizations, API integration results

**Dashboard Widget:**
```
┌─ Latest Findings ───────────────────────────────┐
│ 📊 3 new results since last visit               │
│                                                  │
│ • Kinetics Dataset Analysis Complete           │
│   View → /results/kinetics-2024                 │
│                                                  │
│ • Plasma Temperature Trends Identified          │
│   View → /results/plasma-temp                   │
│                                                  │
│ [View All Results →]                            │
└──────────────────────────────────────────────────┘
```

---

### 3.3 Real-Time Collaboration Indicators

**Feature:** Show who's actively viewing/editing

**Design:**
```
┌─ Active Now ────────────────────────────────────┐
│ 👤 @researcher1 viewing "Week 3 Update"        │
│ 👤 @collaborator2 editing methodology          │
└──────────────────────────────────────────────────┘
```

**Technology:** WebSockets or Server-Sent Events

---

### 3.4 Advanced Analytics Dashboard

**Feature:** Usage insights, collaboration metrics

**Metrics:**
- Most active contributors
- Popular projects
- Engagement trends
- Citation tracking (if applicable)

**Location:** Separate `/analytics` page

---

## 📝 TECHNICAL SPECIFICATIONS

### File Structure After All Phases

```
src/
├── components/
│   ├── dashboard/
│   │   ├── WelcomeHeader.tsx          ✅ Phase 1
│   │   ├── StatsGrid.tsx              ✅ Phase 1 → Refactor Phase 2
│   │   ├── StatsBar.tsx               🆕 Phase 2 (compact version)
│   │   ├── TaskList.tsx               🆕 Phase 2
│   │   ├── NotificationList.tsx       🆕 Phase 2
│   │   ├── QuickActions.tsx           ✅ Phase 1
│   │   ├── GettingStarted.tsx         ✅ Phase 1
│   │   ├── EmptyActivity.tsx          ✅ Phase 1
│   │   ├── ProjectProgress.tsx        🔮 Phase 3
│   │   ├── ResultsWidget.tsx          🔮 Phase 3
│   │   └── ActiveCollaborators.tsx    🔮 Phase 3
│   ├── ui/
│   │   ├── StatCard.tsx               ✅ Existing
│   │   ├── ActivityLog.tsx            ✅ Existing
│   │   └── PublishWidget.tsx          ✅ Existing
│   └── layouts/
│       └── DashboardLayout.astro      ✅ Phase 1
├── pages/
│   ├── index.astro                    ✅ Phase 1 → Refactor Phase 2
│   ├── results/
│   │   └── [id].astro                 🔮 Phase 3
│   └── analytics.astro                🔮 Phase 3
├── lib/
│   ├── github.ts                      ✅ Existing → Extend Phase 2
│   └── notifications.ts               🆕 Phase 2
└── styles/
    └── global.css                     ✅ Phase 1 → Extend Phase 2
```

---

### GitHub API Endpoints Used

**Phase 1 (Current):**
- `GET /repos/{owner}/{repo}/contents/{path}` - File listings
- `GET /repos/{owner}/{repo}/commits` - Recent activity
- `GET /repos/{owner}/{repo}/collaborators` - Collaborator count

**Phase 2 (Collaboration Hub):**
- `GET /repos/{owner}/{repo}/issues` - Tasks (labeled as "task")
- `POST /repos/{owner}/{repo}/issues` - Create task
- `PATCH /repos/{owner}/{repo}/issues/{issue_number}` - Update task
- `GET /notifications` - User notifications
- `PATCH /notifications/threads/{thread_id}` - Mark as read
- `GET /repos/{owner}/{repo}/events` - Repository events
- `GET /users/{username}` - User profile for visitors

**Phase 3 (Future):**
- `GET /repos/{owner}/{repo}/stats/contributors` - Contribution stats
- `GET /search/repositories` - Related repos/projects
- GitHub GraphQL API for complex queries

---

### Performance Considerations

**Caching Strategy:**
```typescript
// Cache GitHub API responses to avoid rate limits
const CACHE_TTL = {
  stats: 300,         // 5 minutes
  tasks: 60,          // 1 minute
  notifications: 30,  // 30 seconds
  commits: 120        // 2 minutes
};
```

**Loading States:**
```tsx
// Show skeletons while loading
{loading ? (
  <TaskListSkeleton />
) : (
  <TaskList tasks={tasks} />
)}
```

**Error Handling:**
```tsx
// Graceful degradation
try {
  const tasks = await getTasks();
} catch (error) {
  console.error('Failed to load tasks:', error);
  // Show empty state with retry option
  return <TaskListError onRetry={refetch} />;
}
```

---

## ⏱️ IMPLEMENTATION TIMELINE

### Phase 1: Visual Refinement
**Estimated Time:** 2-3 hours  
**Can Start:** Immediately  
**Blockers:** None

**Breakdown:**
- Typography updates: 30 min
- Spacing adjustments: 45 min
- Remove fake percentages: 20 min
- Hover effect refinement: 15 min
- Section scrolling: 45 min
- Empty state enhancement: 30 min
- Testing: 30 min

---

### Phase 2: Collaboration Hub
**Estimated Time:** 6-8 hours  
**Can Start:** After Phase 1 complete  
**Blockers:** GitHub API setup must be working

**Breakdown:**
- TaskList component: 2 hours
- NotificationList component: 1.5 hours
- GitHub API integration: 2 hours
- Compact stats refactor: 1 hour
- Context-aware dashboard: 1 hour
- Testing: 1.5 hours

---

### Phase 3: Advanced Features
**Estimated Time:** TBD (Low priority)  
**Can Start:** After user feedback on Phase 2  
**Blockers:** User validation of Phase 2 features

---

## ✅ DEFINITION OF DONE

### Phase 1 Complete When:
- [ ] Header is 32px, prominent
- [ ] Stat numbers are 48px, bold
- [ ] Card padding is 28px throughout
- [ ] No fake percentages anywhere
- [ ] Hover effects are subtle (no green borders)
- [ ] Sections scroll independently
- [ ] Everything fits at 100% zoom
- [ ] Empty states are engaging
- [ ] Passes visual QA (matches design system)
- [ ] Works in light and dark mode
- [ ] Responsive on mobile/tablet/desktop

### Phase 2 Complete When:
- [ ] Tasks display from GitHub Issues
- [ ] Notifications display from GitHub API
- [ ] Task creation works
- [ ] Task completion works
- [ ] Notifications mark as read
- [ ] Notifications navigate to targets
- [ ] Stats are compact/secondary
- [ ] Owner view vs visitor view works
- [ ] Public tasks visible to visitors
- [ ] All interactions are smooth
- [ ] Loading states implemented
- [ ] Error handling graceful
- [ ] Passes functional QA

### Phase 3 Complete When:
- [ ] (TBD - based on specific features implemented)

---

## 🎯 SUCCESS METRICS

### User Experience Goals
- **Task Completion Time:** <5 seconds to find next task
- **Notification Response:** <2 seconds to see who engaged
- **Page Load:** <2 seconds for dashboard
- **Zero Confusion:** Users understand dashboard purpose immediately

### Technical Goals
- **Zero Keystatic Dependencies:** Dashboard fully independent
- **TypeScript Coverage:** 100% of new components
- **Lighthouse Score:** >90
- **Mobile Performance:** 60fps scrolling
- **API Rate Limits:** Stay under GitHub limits (use caching)

---

## 🚨 RISKS & MITIGATION

### Risk 1: GitHub API Rate Limits
**Impact:** Dashboard slow or unavailable  
**Mitigation:**
- Implement aggressive caching
- Use conditional requests (ETags)
- Graceful degradation (show cached data)
- Consider GitHub App vs OAuth (higher limits)

### Risk 2: Complex State Management
**Impact:** Bugs, slow performance  
**Mitigation:**
- Use React Query for data fetching
- Implement proper loading states
- Test thoroughly before shipping
- Start simple, iterate

### Risk 3: Scope Creep
**Impact:** Timeline extends indefinitely  
**Mitigation:**
- Stick to phased approach
- Complete Phase 1 before Phase 2
- Get user feedback between phases
- Future features stay in Phase 3 (backlog)

---

## 📚 REFERENCES

- [Dashboard Implementation Status](./DASHBOARD_IMPLEMENTATION_STATUS.md) - Claude Code's progress
- [Design System](../design_system) - Color palette, typography, spacing
- [Design Prototypes](../design/) - HTML mockups
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [React Best Practices](https://react.dev/learn)

---

## 🎉 CONCLUSION

This roadmap combines:
✅ **User's vision** - Collaboration hub, task-focused, public-friendly  
✅ **Design expertise** - Visual polish, hierarchy, spacing  
✅ **Current progress** - 85% complete foundation  

**Next Steps:**
1. Review this roadmap with user
2. Get approval on approach
3. Start Phase 1 (visual refinement)
4. Share artifacts with Claude Code
5. Test and iterate
6. Move to Phase 2 (collaboration features)

**The dashboard will become a true research collaboration hub!** 🚀

---

**Created:** November 7, 2025  
**Version:** 2.0  
**Status:** Ready for Implementation  
**Maintainers:** Claude (Design Overseer) + Claude Code (Implementation)
