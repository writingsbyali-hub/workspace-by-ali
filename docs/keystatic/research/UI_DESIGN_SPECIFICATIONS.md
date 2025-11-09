# Keystatic CMS UI Design Specifications
**Project:** workspace-by-ali
**Date:** November 9, 2025
**Designer:** UI Designer Agent
**Design System:** Tailwind CSS + workspace-by-ali global.css

---

## Executive Summary

This specification outlines comprehensive UI/UX improvements for the Keystatic CMS interface. The goal is to transform the current flat, four-tab structure into a hierarchical, intuitive, and beautiful content management system that aligns with the workspace-by-ali design system (green primary #00D084, clean typography, modern components).

**Current Pain Points:**
1. No visual hierarchy - all collections appear equal
2. Manual relationship management with text fields
3. Poor content discovery - can't see project structure at a glance
4. Long forms with no progressive disclosure
5. No contextual actions - can't create sub-project from project view

**Design Philosophy:**
- Maintain Keystatic's core architecture
- Use CSS injection and custom components where possible
- Leverage existing design system from [global.css](../../../src/styles/global.css)
- Prioritize rapid implementation

---

## 1. Visual Hierarchy Improvements

### 1.1 Collection Hierarchy Visualization

**Current State:**
```
Projects | Sub-Projects | Updates | Documentation
```
All tabs appear equal - no parent-child indication.

**Proposed Design:**

#### Primary Navigation (Left Sidebar)

```
CONTENT
├─ 📁 Projects (12)
│  └─ View hierarchy
├─ 📄 Updates (45)
├─ 📚 Documentation (8)

SYSTEM
├─ ⚙️ Settings
└─ 👤 Profile
```

**Visual Specs:**
- Sidebar width: `260px`
- Background: `#FFFFFF` (light mode)
- Border-right: `1px solid #E5E7EB`
- Font: System font stack from Tailwind
- Active state: `background: #E6F9F3`, `color: #00875A`
- Hover: `background: #F3F4F6`

---

#### Tree View Component

When clicking "Projects", show tree structure instead of flat list:

```
┌─────────────────────────────────────────────────┐
│ Projects                          [+ New Project]│
├─────────────────────────────────────────────────┤
│                                                   │
│ 🌱 Plasma Experiments              [Draft] [⋯]   │
│   ├─ 🔬 Cold Plasma Testing (3 updates)          │
│   ├─ 🔬 Electrode Design (1 update)              │
│   └─ [+ New Sub-Project]                         │
│                                                   │
│ 🧬 Biology Research               [Active] [⋯]   │
│   ├─ 🔬 Cell Culture Protocols (5 updates)       │
│   ├─ 🔬 Microscopy Analysis (2 updates)  🔒      │
│   └─ [+ New Sub-Project]                         │
│                                                   │
│ 💾 Data Science Tools           [Archived] [⋯]   │
│   └─ (No sub-projects yet)                       │
└─────────────────────────────────────────────────┘
```

**Component Specifications:**

**Project Row:**
```css
.project-row {
  min-height: 64px;
  padding: 16px 20px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.project-row:hover {
  border-color: #00D084;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

**Category Icon:**
```css
.category-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  padding: 4px;
}

/* Color-coded by category */
.category-hardware { background: #3B82F6; } /* Blue */
.category-biology { background: #00D084; } /* Green */
.category-plasma { background: #7C3AED; } /* Purple */
.category-data-science { background: #F59E0B; } /* Amber */
```

**Status Badge:**
```css
.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.status-draft {
  background: #F3F4F6;
  color: #374151;
}

.status-active {
  background: #E6F9F3;
  color: #00875A;
}

.status-active::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00D084;
  animation: pulse 2s infinite;
}

.status-archived {
  background: #E5E7EB;
  color: #6B7280;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

---

### 1.2 Card Layouts vs List Views

**Collection Grid View (Default):**

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 🌱 Project  │  │ 🧬 Project  │  │ 💾 Project  │
│   Title     │  │   Title     │  │   Title     │
│             │  │             │  │             │
│ 3 sub-proj  │  │ 2 sub-proj  │  │ 0 sub-proj  │
│ 12 updates  │  │ 7 updates   │  │ 0 updates   │
└─────────────┘  └─────────────┘  └─────────────┘
```

**Grid Specifications:**
```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.project-card {
  padding: 24px;
  border: 1.5px solid #E5E7EB;
  border-radius: 12px;
  min-height: 220px;
  transition: all 0.2s ease;
}

.project-card:hover {
  border-color: #00D084;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
```

---

### 1.3 Visual Indicators for Gated Content

**Safety Shield Badge:**
```css
.safety-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}
```

**Visibility Icons:**
- Public: 🌐 Globe (green `#00D084`)
- Gated: 🔒 Lock (orange `#F59E0B`)
- Private: 👤 User (red `#DC2626`)

---

## 2. Navigation Redesign

### 2.1 Breadcrumb Navigation

**Component:**
```html
<nav class="breadcrumbs">
  <a href="/keystatic/projects">Projects</a>
  <span class="separator">›</span>
  <a href="/keystatic/projects/plasma-experiments">Plasma Experiments</a>
  <span class="separator">›</span>
  <span class="current">Edit</span>
</nav>
```

**Styles:**
```css
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  font-size: 14px;
}

.breadcrumbs a {
  color: #6B7280;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumbs a:hover {
  color: #00D084;
}

.breadcrumbs .separator {
  color: #D1D5DB;
  user-select: none;
}

.breadcrumbs .current {
  color: #111827;
  font-weight: 600;
}
```

---

### 2.2 Global Search Component

**Keyboard Shortcut:** `Cmd/Ctrl + K`

**UI:**
```
┌─────────────────────────────────────────┐
│ 🔍 Search projects, updates, docs...    │
├─────────────────────────────────────────┤
│ RECENT                                   │
│ 📄 Plasma Testing Update - 2 days ago   │
│ 🌱 New Biology Project - 1 week ago     │
│                                          │
│ SUGGESTED                                │
│ 📚 Safety Protocol v1.3                 │
│ 🌱 Archived Projects (12)               │
└─────────────────────────────────────────┘
```

**Implementation:**
- Fuzzy search across all collections
- Search fields: title, description, tags, content
- Results grouped by collection type
- Real-time filtering (debounced 300ms)

---

## 3. Content Creation Flow

### 3.1 Multi-Step Wizard (Quick Create)

**Step 1: Quick Create Modal**

```
┌─────────────────────────────────────┐
│  Create New Project           [✕]   │
├─────────────────────────────────────┤
│                                      │
│  Project Title *                     │
│  [___________________________]       │
│                                      │
│  Category *                          │
│  [Hardware ▾]                        │
│                                      │
│  Visibility                          │
│  (•) Public ( ) Gated ( ) Private   │
│                                      │
│  [ Quick Create ]  [Advanced →]     │
│                                      │
└─────────────────────────────────────┘
```

**Step 2: Full Editor**
After "Quick Create", redirect to full editor with all fields.

---

### 3.2 Progressive Disclosure

**Accordion Structure:**

```
Basic Information               [Always Visible]
├─ Title
├─ Category
├─ Visibility

Project Details                 [Accordion - Collapsed]
├─ Description
├─ Tags
├─ Start Date

Safety & Access                 [Accordion - Collapsed]
├─ Visibility settings
├─ Safety Code
├─ Safety version

Content                         [Accordion - Expanded]
├─ Body (rich text editor)
```

**Accordion Component:**
```css
.field-group-accordion {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #F9FAFB;
  cursor: pointer;
  transition: background 0.2s;
}

.accordion-header:hover {
  background: #F3F4F6;
}

.accordion-icon {
  transition: transform 0.2s;
}

.accordion-header[aria-expanded="true"] .accordion-icon {
  transform: rotate(90deg);
}

.accordion-content {
  padding: 20px;
  border-top: 1px solid #E5E7EB;
}
```

---

### 3.3 Inline Validation

**Field Validation States:**

**Valid:**
```
Title *
[Plasma Experiments                ] ✓
```

**Error:**
```
Title *
[                                   ] ✕
⚠️ Project title is required
```

**Warning:**
```
Safety Code
[plasma_saftey_v1                  ] ⚠️
💡 Did you mean "plasma_safety_v1"?
```

**CSS:**
```css
.form-field.valid input {
  border-color: #00D084;
}

.form-field.error input {
  border-color: #DC2626;
  animation: shake 0.3s ease;
}

.form-field.warning input {
  border-color: #F59E0B;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.field-message {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 6px;
  font-size: 13px;
}

.field-message.error { color: #DC2626; }
.field-message.warning { color: #F59E0B; }
.field-message.success { color: #00D084; }
```

---

## 4. Relationship Management UI

### 4.1 Dropdown Selector (Replace Manual Entry)

**Current:**
```
Parent Project Slug
[____________________]  ← Manual text entry 😞
```

**Proposed:**
```
Parent Project *
┌──────────────────────────────────────┐
│ 🔍 Search projects...                │
├──────────────────────────────────────┤
│ 🌱 Plasma Experiments (Draft)        │
│ 🧬 Biology Research (Active)         │
│ 💾 Data Science Tools (Archived)     │
└──────────────────────────────────────┘
```

**Implementation:**
```typescript
// Use Keystatic's built-in relationship field!
projectSlug: fields.relationship({
  label: 'Parent Project',
  collection: 'projects',
  validation: { isRequired: true },
}),
```

---

### 4.2 Quick Action Buttons

**Context Menu on Project Card:**

```
┌─────────────────────────┐
│ 🌱 Plasma Experiments   │
│                         │
│ [⋯] ───┐               │
└─────────┼───────────────┘
          │
          └─→ ┌───────────────────────┐
              │ Edit Project          │
              │ + New Sub-Project     │  ← Pre-fills parent!
              │ + New Update          │
              │ ───────────────       │
              │ View on Site          │
              │ Archive               │
              └───────────────────────┘
```

---

## 5. Empty States & Onboarding

### 5.1 Beautiful Empty States

**No Projects Yet:**

```
┌─────────────────────────────────────────────┐
│                                              │
│              📁                              │
│                                              │
│         No Projects Yet                      │
│                                              │
│    Start documenting your research by        │
│    creating your first project.              │
│                                              │
│         [+ Create First Project]             │
│                                              │
└─────────────────────────────────────────────┘
```

**CSS:**
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: #F9FAFB;
  border-radius: 12px;
  border: 2px dashed #E5E7EB;
}

.empty-state-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.3;
}

.empty-state-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.empty-state-description {
  font-size: 15px;
  color: #6B7280;
  max-width: 400px;
  margin-bottom: 28px;
  line-height: 1.6;
}
```

---

### 5.2 Onboarding Tour

**First-Time User Welcome:**

```
┌─────────────────────────────────────┐
│ 👋 Welcome to Your Content Editor!  │
├─────────────────────────────────────┤
│ This is where you manage all your   │
│ projects, updates, and docs.        │
│                                      │
│ [Take a Quick Tour] [Skip]          │
└─────────────────────────────────────┘
```

**Guided Tour Steps:**
1. Collections Sidebar: "Click here to view all projects"
2. Create Button: "Create your first project here"
3. Form Fields: "Required fields marked with *"
4. Relationship Dropdown: "Use dropdown to link items"

---

## 6. Design System Elements

### 6.1 Color Palette

**From [tailwind.config.mjs](../../../tailwind.config.mjs):**

```javascript
// Primary Brand - Green
primary: {
  DEFAULT: '#00D084',
  50: '#E6F9F3',
  600: '#00A368',
  700: '#00875A',
}

// Category Colors
colors: {
  hardware: '#3B82F6',     // Blue
  biology: '#00D084',      // Green
  plasma: '#7C3AED',       // Purple
  dataScience: '#F59E0B',  // Amber
}

// Semantic Colors
success: '#00D084',
warning: '#F59E0B',
error: '#DC2626',
```

---

### 6.2 Typography Hierarchy

**From [global.css](../../../src/styles/global.css):**

```css
h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

h2 {
  font-size: 20px;
  font-weight: 600;
}

p {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}
```

---

### 6.3 Component Library

**Button Components:**
```css
.btn-primary {
  background: #00D084;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #00A368;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 208, 132, 0.3);
}

.btn-secondary {
  background: #FFFFFF;
  border: 1.5px solid #D1D5DB;
  color: #4B5563;
}

.btn-secondary:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
}
```

**Form Input:**
```css
.form-input {
  width: 100%;
  height: 44px;
  padding: 12px 16px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
}

.form-input:focus {
  border-color: #00D084;
  box-shadow: 0 0 0 3px rgba(0, 208, 132, 0.1);
}
```

---

## 7. Implementation Priority

### Phase 1: Quick Wins (Week 1) - 8 hours

1. **CSS Branding Updates** (2h)
   - Update colors to green (#00D084)
   - Add status badge styles
   - Improve empty states

2. **Field Help Tooltips** (3h)
   - Add [ℹ️] icons next to complex fields
   - Create tooltip component

3. **Status Badges** (1h)
   - Color-code Draft/Active/Archived
   - Add pulsing animation

4. **Empty States** (2h)
   - Icons and better copy
   - Clear CTAs

---

### Phase 2: Medium-Term (Week 2-3) - 28 hours

1. **Relationship Dropdowns** (8h)
   - Convert to `fields.relationship()`
   - Add search functionality

2. **Accordion Field Groups** (6h)
   - JavaScript reorganization
   - Collapsible sections

3. **Tree View** (10h)
   - Build hierarchy component
   - Expand/collapse functionality

4. **Quick Actions** (4h)
   - Context menus
   - Pre-filled relationships

---

### Phase 3: Long-Term (Month 2) - 45 hours

1. Global search (12h)
2. Project templates (8h)
3. Onboarding tour (10h)
4. Advanced visualization (15h)

---

## 8. Files to Modify

1. **[keystatic.config.ts](../../../keystatic.config.ts)** - Add custom field components
2. **New:** `public/keystatic-enhancements.js` - Form reorganization
3. **New:** `src/components/keystatic/TreeView.astro` - Hierarchy view
4. **[src/styles/global.css](../../../src/styles/global.css)** - Additional styles

---

## Success Metrics

- ✅ Reduced creation time: 30% faster
- ✅ Fewer errors: 50% reduction in broken relationships
- ✅ Improved discoverability: 2x faster to find content
- ✅ User satisfaction: "Much better" on UX survey

---

**This specification provides a complete roadmap for transforming Keystatic from a basic flat structure into a beautiful, hierarchical, and highly usable CMS aligned with the workspace-by-ali design language.**
