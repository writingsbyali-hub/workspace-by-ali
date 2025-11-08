# 🎨 DASHBOARD IMPLEMENTATION GUIDE
## Complete UI/UX Redesign - From Current to Prototype

---

## 📋 EXECUTIVE SUMMARY

**Objective:** Transform the current dashboard from a basic functional layout into a polished, professional research workspace that matches the prototype design exactly.

**Scope:** Complete redesign of `src/pages/index.astro` and all dashboard components
**Timeline:** ~6-8 hours of focused development
**Priority:** HIGH - Dashboard is the user's home base

---

## 🎯 VISUAL GOALS

### Current State (Problems)
- ❌ Cramped layout with insufficient whitespace
- ❌ Plain stat cards with no visual personality
- ❌ Weak visual hierarchy
- ❌ Inconsistent spacing throughout
- ❌ Generic empty states
- ❌ Stats feel like database outputs, not insights

### Target State (Prototype)
- ✅ Spacious, professional layout
- ✅ Colorful stat cards with semantic icons
- ✅ Strong visual hierarchy guiding the eye
- ✅ Consistent spacing using design system
- ✅ Actionable, friendly empty states
- ✅ Stats feel like meaningful insights

---

## 🏗️ ARCHITECTURE CHANGES

### Files to Modify
```
✏️ MODIFY
src/pages/index.astro                     # Main dashboard page
src/components/layouts/DashboardLayout.astro  # Layout wrapper
src/components/ui/StatCard.tsx            # Complete redesign
src/components/ui/ActivityLog.tsx         # Enhanced empty state
src/components/ui/PublishWidget.tsx       # Refined styling
src/styles/global.css                     # Add new utility classes

🆕 CREATE
src/components/dashboard/StatsGrid.tsx    # New stats container
src/components/dashboard/WelcomeHeader.tsx # Dynamic greeting
src/components/dashboard/QuickActions.tsx  # Right sidebar actions
src/components/dashboard/GettingStarted.tsx # Onboarding card
src/components/dashboard/EmptyActivity.tsx # Better empty state

🗑️ REMOVE LATER (after migration)
- Keystatic-related imports and references
- Any /keystatic route handling
```

---

## 🎨 DESIGN SYSTEM COMPLIANCE

### Color Palette (Strict Usage)
```css
/* Primary Action (Use ONLY for main CTAs) */
--primary-green: #00D084;
--dark-green: #00A368;

/* Stat Card Icons - Semantic Colors */
--stat-projects: #6366F1;      /* Indigo */
--stat-projects-bg: #EEF2FF;   /* Light indigo */

--stat-updates: #F59E0B;       /* Amber */
--stat-updates-bg: #FEF3C7;    /* Light amber */

--stat-streams: #3B82F6;       /* Blue */
--stat-streams-bg: #DBEAFE;    /* Light blue */

--stat-collaborators: #EC4899; /* Pink */
--stat-collaborators-bg: #FCE7F3; /* Light pink */

/* Neutrals */
--bg-primary: #F9FAFB;         /* Page background */
--bg-secondary: #FFFFFF;       /* Card backgrounds */
--border-default: #E5E7EB;     /* Card borders */
--text-primary: #111827;       /* Main text */
--text-secondary: #6B7280;     /* Descriptions */
```

### Typography Scale
```css
/* Headers */
--h1-size: 32px;    --h1-weight: 700;  /* Welcome header */
--h2-size: 24px;    --h2-weight: 600;  /* Section titles */
--h3-size: 20px;    --h3-weight: 600;  /* Card titles */

/* Stat Numbers */
--stat-value: 48px; --stat-weight: 700; /* The big numbers */

/* Body Text */
--body-size: 14px;  --body-weight: 400;
--label-size: 13px; --label-weight: 500;
--small-size: 12px; --small-weight: 400;
```

### Spacing Scale (Use Religiously)
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-lg: 16px;
--space-xl: 20px;
--space-2xl: 24px;
--space-3xl: 32px;
--space-4xl: 48px;

/* Component-Specific */
--card-padding: 28px;
--section-gap: 24px;
--grid-gap: 20px;
```

### Border Radius
```css
--radius-sm: 8px;   /* Buttons, inputs */
--radius-md: 10px;  /* Stat icons */
--radius-lg: 12px;  /* Cards */
--radius-full: 50%; /* Icons, avatars */
```

---

## 📐 LAYOUT STRUCTURE

### Grid System
```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar 260px] [Main Content ~60%] [Right Sidebar 320px]│
│                                                           │
│    Nav          ┌─ Welcome Header (48px margin-bottom) ─┐│
│    Items        │                                        ││
│                 │  Stats Grid (4 columns)               ││
│    Project      │  ┌────┐ ┌────┐ ┌────┐ ┌────┐        ││
│    Switcher     │  │ 1  │ │ 0  │ │ 0  │ │ 0  │        ││
│                 │  └────┘ └────┘ └────┘ └────┘        ││
│    Settings     │                                        ││
│                 │  Recent Updates Section                ││
│    Theme        │  ┌────────────────────────────────┐  ││
│    Toggle       │  │ Empty state with CTA           │  ││
│                 │  └────────────────────────────────┘  ││
│                 └────────────────────────────────────────┘│
│                                                   Quick    │
│                                                   Actions  │
│                                                   Sidebar  │
└─────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
```css
/* Desktop: 3-column layout (keep as is) */
@media (min-width: 1280px) {
  /* Sidebar + Main + Right Sidebar */
}

/* Tablet: 2-column layout */
@media (max-width: 1279px) {
  /* Sidebar + Main (Right sidebar moves to bottom) */
}

/* Mobile: Single column */
@media (max-width: 768px) {
  /* Stack everything vertically */
  /* Sidebar becomes hamburger menu */
}
```

---

## 🧩 COMPONENT SPECIFICATIONS

### 1. WelcomeHeader Component
**File:** `src/components/dashboard/WelcomeHeader.tsx`

**Props:**
```typescript
interface WelcomeHeaderProps {
  userName: string;
  subtitle?: string;
}
```

**Design Specs:**
```css
/* Container */
margin-bottom: 48px;

/* Greeting Text */
font-size: 32px;
font-weight: 700;
color: var(--text-primary);
margin-bottom: 8px;

/* Subtitle */
font-size: 15px;
color: var(--text-secondary);
```

**Functionality:**
- Dynamic greeting based on time of day
  - 5am-11am: "Good morning"
  - 12pm-4pm: "Good afternoon"  
  - 5pm-8pm: "Good evening"
  - 9pm-4am: "Welcome back"
- Include wave emoji 👋
- Default subtitle: "Here's what's happening with your workspace today."

**Code Template:**
```tsx
export function WelcomeHeader({ userName, subtitle }: WelcomeHeaderProps) {
  const greeting = getTimeBasedGreeting(); // Utility function
  
  return (
    <div className="welcome-header">
      <h1>{greeting}, {userName}! 👋</h1>
      <p className="subtitle">{subtitle || "Here's what's happening with your workspace today."}</p>
    </div>
  );
}
```

---

### 2. StatCard Component (Complete Redesign)
**File:** `src/components/ui/StatCard.tsx`

**Props:**
```typescript
interface StatCardProps {
  type: 'projects' | 'updates' | 'streams' | 'collaborators';
  value: number;
  label: string;
  description: string;
  changePercentage?: number;
  changeDirection?: 'up' | 'down';
  changeLabel?: string;
}
```

**Design Specs:**
```css
/* Card Container */
background: var(--bg-secondary);
border: 1px solid var(--border-default);
border-radius: 12px;
padding: 28px;
transition: all 0.2s ease;

/* Hover Effect */
&:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

/* Icon Container */
width: 48px;
height: 48px;
border-radius: 10px;
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 16px;

/* Value (The Big Number) */
font-size: 48px;
font-weight: 700;
line-height: 1;
margin-bottom: 8px;

/* Label */
font-size: 14px;
font-weight: 600;
color: var(--text-primary);
margin-bottom: 4px;

/* Description */
font-size: 13px;
color: var(--text-secondary);

/* Change Indicator */
display: inline-flex;
align-items: center;
gap: 4px;
font-size: 13px;
font-weight: 600;
color: var(--success);
margin-top: 8px;
```

**Icon Colors by Type:**
```typescript
const iconConfig = {
  projects: {
    icon: 'FolderIcon',
    color: '#6366F1',
    bgColor: '#EEF2FF'
  },
  updates: {
    icon: 'DocumentIcon',
    color: '#F59E0B',
    bgColor: '#FEF3C7'
  },
  streams: {
    icon: 'HomeIcon',
    color: '#3B82F6',
    bgColor: '#DBEAFE'
  },
  collaborators: {
    icon: 'UsersIcon',
    color: '#EC4899',
    bgColor: '#FCE7F3'
  }
};
```

**Code Template:**
```tsx
export function StatCard({ type, value, label, description, changePercentage }: StatCardProps) {
  const config = iconConfig[type];
  const Icon = icons[config.icon];
  
  return (
    <div className="stat-card">
      <div 
        className="stat-icon"
        style={{ 
          backgroundColor: config.bgColor,
          color: config.color 
        }}
      >
        <Icon size={24} />
      </div>
      
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-description">{description}</div>
      
      {changePercentage && (
        <div className="stat-change">
          <ArrowUpIcon size={14} />
          {changePercentage}% {changeLabel || 'from last month'}
        </div>
      )}
    </div>
  );
}
```

---

### 3. StatsGrid Component
**File:** `src/components/dashboard/StatsGrid.tsx`

**Props:**
```typescript
interface StatsGridProps {
  stats: {
    projects: number;
    updates: number;
    streams: number;
    collaborators: number;
  };
}
```

**Design Specs:**
```css
/* Grid Container */
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 20px;
margin-bottom: 32px;

/* Responsive */
@media (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 640px) {
  grid-template-columns: 1fr;
}
```

**Code Template:**
```tsx
export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="stats-grid">
      <StatCard
        type="projects"
        value={stats.projects}
        label="Projects"
        description="Active research projects"
        changePercentage={12}
        changeLabel="from last month"
      />
      <StatCard
        type="updates"
        value={stats.updates}
        label="Updates"
        description="Published this month"
        changePercentage={20}
      />
      <StatCard
        type="streams"
        value={stats.streams}
        label="Streams"
        description="Active streams"
      />
      <StatCard
        type="collaborators"
        value={stats.collaborators}
        label="Collaborators"
        description="Team members"
      />
    </div>
  );
}
```

---

### 4. EmptyActivity Component
**File:** `src/components/dashboard/EmptyActivity.tsx`

**Design Specs:**
```css
/* Container */
text-align: center;
padding: 48px 24px;

/* Icon Circle */
width: 64px;
height: 64px;
margin: 0 auto 16px;
background: var(--bg-hover);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
color: var(--text-tertiary);

/* Title */
font-size: 16px;
font-weight: 600;
color: var(--text-primary);
margin-bottom: 8px;

/* Description */
font-size: 14px;
color: var(--text-secondary);
margin-bottom: 20px;

/* CTA Button */
width: auto;
margin: 0 auto;
```

**Code Template:**
```tsx
export function EmptyActivity() {
  return (
    <div className="empty-activity">
      <div className="empty-icon">
        <DocumentIcon size={32} />
      </div>
      <h3 className="empty-title">No recent activity</h3>
      <p className="empty-description">
        Create your first update to start tracking your research progress
      </p>
      <button className="btn btn-primary">
        <PlusIcon size={16} />
        Create Update
      </button>
    </div>
  );
}
```

**Note:** When there IS activity, use the ActivityLog component to display Git commits:

```tsx
// src/components/ui/ActivityLog.tsx updates
interface ActivityItem {
  type: 'commit';
  sha: string;
  message: string;
  author: string;
  timestamp: string;
  url: string;
}

export function ActivityLog({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="activity-log">
      {activities.map((activity) => (
        <div key={activity.sha} className="activity-item">
          <div className="activity-icon">
            <GitCommitIcon size={18} />
          </div>
          <div className="activity-content">
            <div className="activity-title">{activity.message}</div>
            <div className="activity-desc">by {activity.author}</div>
            <div className="activity-time">
              {formatRelativeTime(activity.timestamp)}
            </div>
          </div>
          <a href={activity.url} target="_blank" className="activity-link">
            View commit →
          </a>
        </div>
      ))}
    </div>
  );
}
```

---

### 5. QuickActions Component
**File:** `src/components/dashboard/QuickActions.tsx`

**Design Specs:**
```css
/* Container */
background: var(--bg-secondary);
border-radius: 12px;
padding: 24px;
border: 1px solid var(--border-default);
margin-bottom: 20px;

/* Title */
font-size: 16px;
font-weight: 600;
margin-bottom: 16px;

/* Button Stack */
display: flex;
flex-direction: column;
gap: 12px;

/* Primary Button (New Project) */
background: var(--primary-green);
color: white;
width: 100%;
padding: 12px 20px;
border-radius: 8px;
font-weight: 600;
font-size: 14px;

/* Secondary Button (New Update) */
background: white;
color: var(--text-primary);
border: 1.5px solid var(--border-default);
width: 100%;

/* Ghost Button (View Projects) */
background: transparent;
color: var(--text-secondary);
width: 100%;
```

**Code Template:**
```tsx
export function QuickActions() {
  return (
    <div className="quick-actions">
      <h3 className="action-title">Quick Actions</h3>
      <div className="action-buttons">
        <button className="btn btn-primary btn-full">
          <PlusIcon size={16} />
          New Project
        </button>
        <button className="btn btn-secondary btn-full">
          <EditIcon size={16} />
          New Update
        </button>
        <button className="btn btn-ghost btn-full">
          <FolderIcon size={16} />
          View Projects
        </button>
      </div>
    </div>
  );
}
```

---

### 6. PublishStatus Component (Refined)
**File:** `src/components/ui/PublishWidget.tsx`

**Design Specs:**
```css
/* Container */
background: var(--bg-secondary);
border-radius: 12px;
padding: 24px;
border: 1px solid var(--border-default);
margin-bottom: 20px;

/* Title */
font-size: 16px;
font-weight: 600;
margin-bottom: 12px;

/* Status Card */
display: flex;
align-items: center;
gap: 12px;
padding: 16px;
background: var(--success-bg);
border-radius: 8px;

/* Status Icon */
width: 20px;
height: 20px;
color: var(--success);

/* Status Text */
font-size: 14px;
color: var(--text-primary);
font-weight: 500;
```

**Code Template:**
```tsx
export function PublishWidget({ unpublishedChanges }: { unpublishedChanges: number }) {
  return (
    <div className="publish-widget">
      <h3 className="widget-title">Publish Status</h3>
      <div className="status-card">
        <CheckCircleIcon size={20} />
        <span className="status-text">
          {unpublishedChanges === 0 
            ? "All changes published" 
            : `${unpublishedChanges} unpublished changes`}
        </span>
      </div>
      {unpublishedChanges > 0 && (
        <button className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
          Publish Now
        </button>
      )}
    </div>
  );
}
```

---

### 7. GettingStarted Component
**File:** `src/components/dashboard/GettingStarted.tsx`

**Design Specs:**
```css
/* Container */
background: linear-gradient(135deg, #00D084 0%, #00A368 100%);
border-radius: 12px;
padding: 24px;
color: white;

/* Title */
font-size: 18px;
font-weight: 700;
margin-bottom: 8px;

/* Description */
font-size: 14px;
opacity: 0.95;
line-height: 1.5;
margin-bottom: 20px;

/* Button */
background: white;
color: var(--dark-green);
padding: 10px 20px;
border-radius: 8px;
font-weight: 600;
display: inline-flex;
align-items: center;
gap: 8px;

&:hover {
  background: var(--bg-primary);
}
```

**Code Template:**
```tsx
export function GettingStarted() {
  return (
    <div className="getting-started-card">
      <h3 className="card-title">Getting Started</h3>
      <p className="card-description">
        Create your first project to start organizing your research and updates.
      </p>
      <button className="btn-white">
        Learn More
        <ArrowRightIcon size={14} />
      </button>
    </div>
  );
}
```

---

## 🔄 DATA FLOW & GITHUB INTEGRATION

### Architecture Overview

**Your Current Setup (Keep This!):**
```
User Authentication
      ↓
Supabase GitHub OAuth (Primary)
      ↓
GitHub Token Stored in Session
      ↓
Secondary GitHub OAuth (Repo Access)
      ↓
Token grants: fork, commit, push permissions
      ↓
All API calls use this OAuth token
```

**Key Points:**
- ✅ GitHub OAuth already configured in Supabase
- ✅ User connects GitHub during owner setup wizard
- ✅ OAuth token has repository read/write access
- ✅ Token stored in user session (`session.provider_token`)
- ✅ No manual token configuration needed

### Remove Keystatic Dependencies

**Current (Keystatic):**
```typescript
// ❌ OLD - Remove this
import { createReader } from '@keystatic/core/reader';

const reader = createReader(process.cwd(), config);
const projects = await reader.collections.projects.all();
```

**New (Direct GitHub):**
```typescript
// ✅ NEW - Use this
import { listFiles, readFromGitHub, getRepoCollaborators, getRecentCommits } from '@/lib/github';

// All functions use OAuth token from authenticated user's session
// Token is retrieved from Supabase: user.github_token

// List all projects
const projectFiles = await listFiles('content/projects');

// Read individual project
const projectData = await readFromGitHub('content/projects/project-1.md');

// Get repository collaborators
const collaborators = await getRepoCollaborators(); // GET /repos/{owner}/{repo}/collaborators

// Get recent commits for activity timeline
const commits = await getRecentCommits(10); // GET /repos/{owner}/{repo}/commits?per_page=10
```

### GitHub API Token Source

**Authentication Flow:**
1. User authenticates via Supabase GitHub OAuth (already configured)
2. OAuth token stored in user session
3. All GitHub API calls use this authenticated token
4. Token has permissions: read/write repository access

**Implementation in `/lib/github.ts`:**
```typescript
import { Octokit } from '@octokit/rest';
import { supabase } from '@/lib/supabase';

// Get authenticated Octokit instance using user's OAuth token
async function getOctokit() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.provider_token) {
    throw new Error('No GitHub token found. User must connect GitHub account.');
  }
  
  return new Octokit({
    auth: session.provider_token // OAuth token from GitHub login
  });
}

// Example: Get repo collaborators
export async function getRepoCollaborators() {
  const octokit = await getOctokit();
  const owner = 'user-github-username'; // From user session
  const repo = 'user-repo-name'; // From workspace config
  
  const { data } = await octokit.repos.listCollaborators({
    owner,
    repo
  });
  
  return data;
}

// Example: Get recent commits
export async function getRecentCommits(limit = 10) {
  const octokit = await getOctokit();
  const owner = 'user-github-username';
  const repo = 'user-repo-name';
  
  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    per_page: limit
  });
  
  return data.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author.name,
    timestamp: commit.commit.author.date,
    url: commit.html_url
  }));
}
```

### Dashboard Data Fetching

**File:** `src/pages/index.astro`

```typescript
---
import { listFiles } from '@/lib/github';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ActivityLog from '@/components/ui/ActivityLog';
import QuickActions from '@/components/dashboard/QuickActions';
import PublishWidget from '@/components/ui/PublishWidget';
import GettingStarted from '@/components/dashboard/GettingStarted';
import DashboardLayout from '@/components/layouts/DashboardLayout.astro';

// Fetch data from GitHub
const projectFiles = await listFiles('content/projects');
const updateFiles = await listFiles('content/updates');
const streamFiles = await listFiles('content/streams');

// Fetch GitHub repo collaborators
const collaborators = await getRepoCollaborators(); // GitHub API: GET /repos/{owner}/{repo}/collaborators

// Calculate stats
const stats = {
  projects: projectFiles.length,
  updates: updateFiles.filter(f => {
    // Filter for this month
    const date = new Date(f.sha);
    return date.getMonth() === new Date().getMonth();
  }).length,
  streams: streamFiles.length,
  collaborators: collaborators.length // GitHub repo collaborators count
};

// Fetch recent activity from Git commits
const recentCommits = await getRecentCommits(); // GitHub API: GET /repos/{owner}/{repo}/commits
const activities = recentCommits.map(commit => ({
  type: 'commit',
  message: commit.message,
  author: commit.author.name,
  timestamp: commit.timestamp,
  sha: commit.sha
}));

// Get user info
const user = Astro.locals.user;
---

<DashboardLayout>
  <div class="dashboard-content">
    <WelcomeHeader 
      userName={user.name} 
      subtitle="Here's what's happening with your workspace today."
    />
    
    <StatsGrid stats={stats} />
    
    <div class="content-section">
      <div class="section-header">
        <ClockIcon size={20} />
        <h2 class="section-title">Recent Updates</h2>
      </div>
      {activities.length > 0 ? (
        <ActivityLog activities={activities} />
      ) : (
        <EmptyActivity />
      )}
    </div>
  </div>
  
  <div slot="sidebar-right">
    <QuickActions />
    <PublishWidget unpublishedChanges={0} />
    <GettingStarted />
  </div>
</DashboardLayout>
```

---

## 🎨 STYLING UPDATES

### New Utility Classes
**File:** `src/styles/global.css`

```css
/* Dashboard-specific utilities */
.dashboard-content {
  padding: 32px;
  max-width: 1200px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 28px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.stat-value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-description {
  font-size: 13px;
  color: var(--text-secondary);
}

.stat-change {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--success);
  margin-top: 8px;
}

.content-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 28px;
  border: 1px solid var(--border-default);
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-activity {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: var(--bg-hover);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.welcome-header {
  margin-bottom: 48px;
}

.welcome-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.welcome-header .subtitle {
  font-size: 15px;
  color: var(--text-secondary);
}

.quick-actions,
.publish-widget {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-default);
  margin-bottom: 20px;
}

.action-title,
.widget-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--success-bg);
  border-radius: 8px;
}

.status-text {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.getting-started-card {
  background: linear-gradient(135deg, #00D084 0%, #00A368 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
}

.getting-started-card .card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.getting-started-card .card-description {
  font-size: 14px;
  opacity: 0.95;
  line-height: 1.5;
  margin-bottom: 20px;
}

.btn-white {
  background: white;
  color: var(--dark-green);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-white:hover {
  background: var(--bg-primary);
}

/* Dark Mode Overrides */
[data-theme="dark"] .stat-card {
  background: var(--bg-secondary);
  border-color: var(--border-default);
}

[data-theme="dark"] .content-section {
  background: var(--bg-secondary);
  border-color: var(--border-default);
}

[data-theme="dark"] .empty-icon {
  background: var(--bg-hover);
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-content {
    padding: 20px;
  }
  
  .welcome-header h1 {
    font-size: 24px;
  }
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Setup & Cleanup (30 min)
- [ ] Remove all Keystatic imports from `src/pages/index.astro`
- [ ] Create `/lib/github.ts` with API functions (uses OAuth token from user session)
- [ ] Verify GitHub OAuth integration is working (should already be configured)
- [ ] Test basic GitHub API connectivity with authenticated user's token

### Phase 2: New Components (2 hours)
- [ ] Create `WelcomeHeader.tsx` with time-based greeting
- [ ] Create `StatsGrid.tsx` container component
- [ ] Redesign `StatCard.tsx` with colored icons
- [ ] Create `EmptyActivity.tsx` with better design
- [ ] Create `QuickActions.tsx` sidebar component
- [ ] Create `GettingStarted.tsx` onboarding card
- [ ] Update `PublishWidget.tsx` styling

### Phase 3: Layout Updates (1 hour)
- [ ] Update `DashboardLayout.astro` to support right sidebar slot
- [ ] Add new CSS utilities to `global.css`
- [ ] Ensure responsive breakpoints work correctly
- [ ] Test dark mode theme switching

### Phase 4: Data Integration (2 hours)
- [ ] Replace Keystatic data fetching with GitHub API calls
- [ ] Implement stats calculation from GitHub data
- [ ] Add activity tracking (from commits/file changes)
- [ ] Wire up Quick Actions buttons to real routes
- [ ] Implement "Create Update" and "New Project" flows

### Phase 5: Polish & Testing (1.5 hours)
- [ ] Test all hover states and transitions
- [ ] Verify color accuracy against design system
- [ ] Test responsive behavior on mobile/tablet
- [ ] Test both light and dark themes
- [ ] Verify all buttons navigate correctly
- [ ] Add loading states for async operations
- [ ] Add error boundaries for data fetching failures

### Phase 6: Refinement (1 hour)
- [ ] Verify spacing matches prototype exactly
- [ ] Check typography sizes and weights
- [ ] Ensure stat icons are properly colored
- [ ] Test empty states
- [ ] Verify percentage changes display correctly
- [ ] Final visual QA pass

---

## 🚨 CRITICAL REQUIREMENTS

### Must Have
1. ✅ **Remove ALL Keystatic dependencies** - No imports, no routes, no references
2. ✅ **Match prototype design EXACTLY** - Colors, spacing, typography must be pixel-perfect
3. ✅ **Use design system strictly** - No arbitrary values, use CSS variables
4. ✅ **GitHub integration only** - All data from GitHub API, no CMS
5. ✅ **Responsive on all devices** - Mobile-first approach
6. ✅ **Dark mode support** - Both themes must work perfectly

### Nice to Have (Future Iterations)
- Real-time collaboration status
- GitHub issue integration for tasks
- Advanced analytics dashboard
- Custom dashboard widgets
- Drag-and-drop dashboard customization

---

## 🔍 TESTING SCENARIOS

### Visual Regression Tests
1. **Empty State:** Dashboard with zero projects
2. **With Data:** Dashboard with 10+ projects and recent activity
3. **Mobile View:** All components stacked vertically
4. **Dark Mode:** All colors and contrasts correct
5. **Loading States:** Show skeletons while fetching data
6. **Error States:** Graceful handling of GitHub API failures

### Functional Tests
1. Click "New Project" → Navigate to project creation
2. Click "New Update" → Navigate to update creation
3. Click "View Projects" → Navigate to projects list
4. Theme toggle → Persist preference
5. Project switcher → Load correct project context
6. Stat cards hover → Show lift effect
7. Empty state CTA → Navigate to creation flow

---

## 📝 IMPLEMENTATION NOTES

### Important Decisions

**Why Remove Keystatic?**
- Adds unnecessary complexity for simple markdown + Git workflow
- Generic UI doesn't match research-focused design
- Direct GitHub integration is simpler and more transparent
- Reduces dependencies and potential breaking changes

**Why This Layout?**
- Three-column layout maximizes information density
- Left sidebar for navigation (always visible)
- Main content for primary information
- Right sidebar for contextual actions
- Proven pattern for dashboard UIs

**Why These Colors?**
- Green primary represents growth, research, and progress
- Semantic colors for stats aid quick scanning
- Neutral grays keep focus on content
- High contrast ensures accessibility

### Common Pitfalls to Avoid
❌ Don't use arbitrary pixel values - always use CSS variables  
❌ Don't mix Keystatic and GitHub data sources  
❌ Don't skip hover states on interactive elements  
❌ Don't forget dark mode color overrides  
❌ Don't ignore responsive breakpoints  
❌ Don't hardcode colors - use design tokens  

### Performance Considerations
- Lazy load activity data if list is long
- Cache GitHub API responses (respect rate limits)
- Use React.memo() for stat cards
- Debounce real-time updates
- Optimize icon imports (tree-shaking)

---

## 🎯 ACCEPTANCE CRITERIA

### Visual Quality
- [ ] Dashboard looks identical to prototype
- [ ] Spacing matches design system (use browser DevTools to verify)
- [ ] Colors match exactly (use color picker to verify)
- [ ] Typography sizes and weights are correct
- [ ] Icons are semantically colored
- [ ] Hover states are smooth and consistent
- [ ] Dark mode colors are properly inverted
- [ ] Empty states are friendly and actionable

### Technical Quality
- [ ] No Keystatic dependencies remain
- [ ] All data fetched from GitHub API
- [ ] TypeScript strict mode passes
- [ ] No console errors or warnings
- [ ] Responsive on all screen sizes
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader friendly
- [ ] Loading states present
- [ ] Error states handled gracefully

### Functional Quality
- [ ] All buttons navigate correctly
- [ ] Stats display real data from GitHub
- [ ] Activity log shows recent changes
- [ ] Theme toggle works
- [ ] Project switcher functions
- [ ] Quick actions work as expected

---

## 🚀 DEPLOYMENT CHECKLIST

Before merging to main:
- [ ] Run `npm run build` successfully
- [ ] Test in production-like environment
- [ ] Verify GitHub OAuth is working (user can connect GitHub account)
- [ ] Verify GitHub API rate limits are handled
- [ ] Check all environment variables are set (Supabase URL, Supabase key)
- [ ] Ensure `.env.example` is updated
- [ ] Update documentation with new architecture
- [ ] Remove old Keystatic routes from routing config
- [ ] Clean up unused Keystatic components
- [ ] Update package.json (remove Keystatic deps)

---

## 📚 REFERENCE FILES

**Design Prototypes (in repo):**
- `design/dashboard-redesign.html` - Primary reference
- `design/custom-dashboard.html` - Alternative design

**Design System:**
- `/mnt/project/design_system` - Color palette, typography, spacing

**Current Implementation:**
- `src/pages/index.astro` - Main dashboard page
- `src/components/layouts/DashboardLayout.astro` - Layout wrapper
- `src/components/ui/StatCard.tsx` - Current stat cards (needs redesign)

**API Integration:**
- `/lib/github.ts` - GitHub API wrapper (to be created)
- Example GitHub integration doc from previous session

---

## 💡 NEXT STEPS AFTER DASHBOARD

1. **Markdown Editor** - Custom editor with live preview
2. **Project Creation** - Multi-step wizard
3. **Project Detail View** - Individual project page
4. **Updates List** - Timeline of all updates
5. **Settings Page** - User preferences and GitHub config

---

## 🎨 FINAL THOUGHTS

This dashboard is the **heart of Workspace**. It's the first thing users see, and it sets the tone for the entire application. 

**Design Principles:**
- **Clarity** over cleverness
- **Breathing room** over density
- **Actionable insights** over raw data
- **Personality** over sterility

**User Experience Goals:**
- User should feel **in control** and **informed**
- Should understand **at a glance** what's happening
- Should know **exactly what to do next**
- Should feel **confident** and **capable**

Make it beautiful. Make it functional. Make it feel like a tool that **respects researchers' intelligence** and **supports their workflow**.

---

**Last Updated:** November 7, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation  
**Priority:** HIGH ⚡️
