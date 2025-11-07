# Component Library & Design System Reference

**Last Updated:** November 7, 2025
**Version:** 2.0 (Post-DaisyUI Migration)
**Primary Brand Color:** #00D084 (Green)

---

## Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Components](#components)
4. [CSS Class Reference](#css-class-reference)
5. [Usage Guidelines](#usage-guidelines)
6. [Dark Mode](#dark-mode)
7. [Accessibility](#accessibility)

---

## Overview

This design system was extracted from HTML prototypes in the `/design` folder and replaces DaisyUI with a custom component system. It provides consistent styling, improved performance, and complete control over the user experience.

### Design Philosophy

- **Modern & Clean:** Minimalist aesthetic with focus on content
- **Green Brand Identity:** #00D084 primary color representing growth
- **Consistent Patterns:** Reusable components across all pages
- **Smooth Interactions:** Subtle animations and transitions
- **Full Dark Mode:** Complete support with CSS variables

### Key Files

- **Tailwind Config:** [tailwind.config.mjs](../../tailwind.config.mjs)
- **Global CSS:** [src/styles/global.css](../../src/styles/global.css)
- **Components:** [src/components/ui/redesign/](../../src/components/ui/redesign/)
- **Design Prototypes:** [design/](../../design/) folder (HTML reference)

---

## Design Tokens

Design tokens are the foundational design decisions that create a consistent visual language.

### Colors

#### Primary Brand (Green)

```css
--primary: #00D084;          /* Main brand color */
--primary-hover: #00A368;    /* Hover state */
--primary-light: #E6F9F3;    /* Light backgrounds */
--primary-dark: #00875A;     /* Dark variant */
```

**Extended Palette (Tailwind):**
```javascript
primary: {
  50: '#E6F9F3',
  100: '#CCFCE7',
  200: '#99F9CF',
  300: '#66F6B7',
  400: '#33F39F',
  500: '#00D084',  // DEFAULT
  600: '#00A368',
  700: '#00875A',
  800: '#006A4B',
  900: '#004E39',
}
```

#### Gray Scale

```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

#### Semantic Colors

```css
--success: #00D084;  /* Same as primary */
--warning: #F59E0B;  /* Amber/orange */
--error: #DC2626;    /* Red */
--info: #3B82F6;     /* Blue */
```

#### Workspace Colors

```css
/* Personal Workspace (Green) */
--personal-primary: #00D084;

/* Commons Workspace (Blue) - Future feature */
--commons-primary: #3B82F6;
```

#### Accent Colors

```css
--purple: #7C3AED;  /* Connection between workspaces */
--blue: #3B82F6;    /* Trust, collaboration */
```

### Typography

#### Font Families

```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono',
             Consolas, monospace;
```

#### Font Sizes

```javascript
fontSize: {
  'tiny': '11px',   // Labels, badges
  'xs': '12px',     // Small text
  'sm': '13px',     // Metadata
  'base': '14px',   // Body text (default)
  'md': '15px',     // Descriptions
  'lg': '18px',     // Subheadings
  'xl': '20px',     // Section headers
  '2xl': '32px',    // Page headings
}
```

#### Font Weights

```javascript
fontWeight: {
  normal: '400',    // Body text
  medium: '500',    // Navigation, labels
  semibold: '600',  // Headings, buttons
  bold: '700',      // Page titles, emphasis
}
```

### Spacing & Sizing

#### Border Radius

```css
--radius-sm: 6px;      /* Small elements */
--radius-md: 8px;      /* Buttons, inputs */
--radius-lg: 12px;     /* Cards */
--radius-xl: 16px;     /* Large containers */
--radius-full: 9999px; /* Pills, avatars */
```

#### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 20px rgba(0, 0, 0, 0.08);
--shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.08);
--shadow-focus: 0 0 0 3px rgba(0, 208, 132, 0.1);
--shadow-primary: 0 4px 12px rgba(0, 208, 132, 0.3);
```

### Animations

#### Keyframes

```css
@keyframes fade-in {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}

@keyframes lift {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-2px); }
}

@keyframes shimmer {
  0%   { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

#### Usage

```javascript
animation: {
  'fade-in': 'fade-in 0.3s ease-out',
  'slide-in': 'slide-in 0.3s ease-out',
  'lift': 'lift 0.2s ease-out',
  'shimmer': 'shimmer 2s infinite linear',
}
```

---

## Components

### Button Component

**File:** [src/components/ui/redesign/Button.astro](../../src/components/ui/redesign/Button.astro)

#### Props

```typescript
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  href?: string;  // Renders as <a> if provided
  class?: string;
}
```

#### Usage

```astro
---
import Button from '@/components/ui/redesign/Button.astro';
---

<!-- Primary button (default) -->
<Button>Save Changes</Button>

<!-- Secondary button -->
<Button variant="secondary">Cancel</Button>

<!-- Ghost button -->
<Button variant="ghost">Skip</Button>

<!-- Small size -->
<Button size="sm">Small Button</Button>

<!-- Large size -->
<Button size="lg">Large Button</Button>

<!-- Disabled state -->
<Button disabled>Disabled</Button>

<!-- Link button -->
<Button href="/projects">View Projects</Button>

<!-- Custom classes -->
<Button class="w-full">Full Width</Button>
```

#### Variants

- **Primary:** Green background (#00D084), white text, hover lift + shadow
- **Secondary:** White background, gray border, subtle hover
- **Ghost:** Transparent background, gray text, light gray hover

#### Sizes

- **sm:** 8px 16px padding, 13px font
- **md:** 12px 24px padding, 14px font (default)
- **lg:** 14px 28px padding, 15px font

---

### Form Components

#### FormInput

**File:** [src/components/ui/redesign/FormInput.astro](../../src/components/ui/redesign/FormInput.astro)

##### Props

```typescript
interface Props {
  id?: string;
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number';
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;  // Show character counter
  class?: string;
}
```

##### Usage

```astro
---
import FormInput from '@/components/ui/redesign/FormInput.astro';
---

<!-- Basic input -->
<FormInput
  name="title"
  label="Project Title"
  placeholder="Enter project name"
/>

<!-- Required field -->
<FormInput
  name="email"
  label="Email"
  type="email"
  required
/>

<!-- With hint -->
<FormInput
  name="url"
  label="Website URL"
  hint="Optional: Add your project website"
/>

<!-- With error -->
<FormInput
  name="username"
  label="Username"
  error="Username already taken"
/>

<!-- With character counter -->
<FormInput
  name="tagline"
  label="Tagline"
  maxLength={60}
  showCount
/>
```

##### Features

- Auto-generated ID from name if not provided
- Required/optional indicators
- Error state styling with icon
- Hint text with icon
- Character counter with live updates
- Supports all HTML input types

---

#### FormTextarea

**File:** [src/components/ui/redesign/FormTextarea.astro](../../src/components/ui/redesign/FormTextarea.astro)

##### Props

```typescript
interface Props {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  rows?: number;        // Default: 4
  maxLength?: number;
  showCount?: boolean;
  class?: string;
}
```

##### Usage

```astro
---
import FormTextarea from '@/components/ui/redesign/FormTextarea.astro';
---

<!-- Basic textarea -->
<FormTextarea
  name="description"
  label="Description"
  placeholder="Describe your project..."
/>

<!-- With character limit -->
<FormTextarea
  name="summary"
  label="Summary"
  rows={3}
  maxLength={500}
  showCount
/>

<!-- With hint -->
<FormTextarea
  name="notes"
  label="Notes"
  hint="These notes are private and only visible to you"
/>
```

---

#### FormSelect

**File:** [src/components/ui/redesign/FormSelect.astro](../../src/components/ui/redesign/FormSelect.astro)

##### Props

```typescript
interface Props {
  id?: string;
  name: string;
  label?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  options?: Array<{ value: string; label: string }>;
  class?: string;
}
```

##### Usage

```astro
---
import FormSelect from '@/components/ui/redesign/FormSelect.astro';

const categories = [
  { value: 'research', label: 'Research' },
  { value: 'build', label: 'Build' },
  { value: 'experiment', label: 'Experiment' },
];
---

<!-- With options array -->
<FormSelect
  name="category"
  label="Category"
  options={categories}
  value="research"
/>

<!-- With slot (manual options) -->
<FormSelect name="status" label="Status">
  <option value="draft">Draft</option>
  <option value="active">Active</option>
  <option value="archived">Archived</option>
</FormSelect>
```

---

### Card Component

**File:** [src/components/ui/redesign/Card.astro](../../src/components/ui/redesign/Card.astro)

#### Props

```typescript
interface Props {
  class?: string;
  hover?: boolean;  // Enable hover effects (default: true)
}
```

#### Usage

```astro
---
import Card from '@/components/ui/redesign/Card.astro';
---

<!-- Basic card -->
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>

<!-- Card without hover effects -->
<Card hover={false}>
  <p>Static card</p>
</Card>

<!-- Custom classes -->
<Card class="mb-4">
  <p>Card with margin</p>
</Card>
```

#### Features

- White background with border
- Rounded corners (12px)
- Padding (24px)
- Hover effects: lift, border color change, shadow
- Full dark mode support

---

### Timeline Components

**Files:**
- [src/components/ui/redesign/Timeline.astro](../../src/components/ui/redesign/Timeline.astro)
- [src/components/ui/redesign/TimelineItem.astro](../../src/components/ui/redesign/TimelineItem.astro)

#### Timeline Props

```typescript
interface Props {
  class?: string;
}
```

#### TimelineItem Props

```typescript
interface Props {
  type: 'project' | 'update' | 'edit';
  title: string;
  meta?: string;        // Subtitle or context
  timestamp: string;
  description?: string;
  tag?: string;         // Optional badge
  class?: string;
}
```

#### Usage

```astro
---
import Timeline from '@/components/ui/redesign/Timeline.astro';
import TimelineItem from '@/components/ui/redesign/TimelineItem.astro';
---

<Timeline>
  <TimelineItem
    type="project"
    title="Created new project"
    meta="AI Research Initiative"
    timestamp="2 hours ago"
    description="Started a new research project to explore AI safety protocols"
    tag="Research"
  />

  <TimelineItem
    type="update"
    title="Published weekly update"
    meta="Progress Report #5"
    timestamp="1 day ago"
    tag="Update"
  />

  <TimelineItem
    type="edit"
    title="Updated project description"
    timestamp="3 days ago"
  />
</Timeline>
```

#### Types & Styling

- **project:** Blue marker, folder icon
- **update:** Green marker, document icon
- **edit:** Orange marker, pencil icon

---

### MarkdownEditor (React)

**File:** [src/components/ui/redesign/MarkdownEditor.tsx](../../src/components/ui/redesign/MarkdownEditor.tsx)

#### Props

```typescript
interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}
```

#### Usage

```tsx
import MarkdownEditor from '@/components/ui/redesign/MarkdownEditor';

function MyForm() {
  const [content, setContent] = useState('');

  return (
    <MarkdownEditor
      content={content}
      onChange={setContent}
      placeholder="Write your update here..."
      minHeight="400px"
    />
  );
}
```

#### Features

- **Write/Preview Tabs:** Toggle between editing and preview modes
- **Toolbar:** Bold, Italic, Headings, Lists, Links, Images, Code, Quotes
- **Live Preview:** Real-time markdown rendering with GitHub-flavored markdown
- **Stats:** Word count, character count, reading time
- **Keyboard Shortcuts:** Ctrl/Cmd+B (bold), Ctrl/Cmd+I (italic), etc.
- **Dark Mode:** Full support with proper contrast

#### Dependencies

```json
{
  "react-markdown": "^9.0.1",
  "remark-gfm": "^4.0.0"
}
```

---

## CSS Class Reference

### Layout Classes

```css
.container-layout    /* Main flex container (min-height: 100vh) */
.main-content        /* Page content area (flex: 1, padding) */
.sidebar             /* Left navigation (260px wide) */
.sidebar-section     /* Sidebar section wrapper */
.sidebar-nav         /* Navigation list container */
.sidebar-footer      /* Bottom section of sidebar */
```

### Navigation Classes

```css
.logo                /* Sidebar logo/branding */
.nav-item            /* Navigation link */
.nav-item.active     /* Active page (green background) */
.sidebar-label       /* Section label (uppercase, small) */
```

### Page Header Classes

```css
.page-header         /* Header container (flex, justify-between) */
.header-content      /* Header text wrapper */
```

### Button Classes

```css
.btn                 /* Base button styles */
.btn-primary         /* Green button (default) */
.btn-secondary       /* White button with border */
.btn-ghost           /* Transparent button */
.btn-sm              /* Small button */
.btn-lg              /* Large button */
.action-btn          /* Icon button (32x32px) */
```

### Card Classes

```css
.stat-card           /* Statistic display card */
.stat-label          /* Stat label text */
.stat-value          /* Large stat number */
.stat-description    /* Stat description text */

.project-card        /* Project grid item */
.project-title       /* Project name */
.project-description /* Project description */
.project-tag         /* Category badge */
.project-meta        /* Footer metadata */

.content-section     /* Generic content card */
.section-header      /* Section header wrapper */
.section-title       /* Section heading */
```

### Form Classes

```css
.form-control        /* Form field wrapper */
.form-label          /* Input label */
.form-label-optional /* "(optional)" text */
.form-input          /* Text input */
.form-textarea       /* Multi-line input */
.form-select         /* Dropdown select */
.form-hint           /* Helper text with icon */
.error-message       /* Error text with icon */
.char-count          /* Character counter */
```

### Search & Filter Classes

```css
.controls            /* Search/filter container */
.search-box          /* Search input wrapper */
.search-input        /* Search text input */
.search-icon         /* Search icon */
.filter-btn          /* Filter dropdown button */
```

### Timeline Classes

```css
.timeline            /* Timeline container (managed by component) */
.timeline-item       /* Individual timeline entry (managed by component) */
```

### Utility Classes

```css
.onboarding-card     /* Onboarding/tips card */
.onboarding-title    /* Tips card heading */
.user-profile        /* User profile section */
.user-avatar         /* User avatar circle */
```

---

## Usage Guidelines

### When to Use Each Component

#### Buttons

- **Primary:** Main actions (Save, Create, Publish)
- **Secondary:** Alternative actions (Cancel, Back, Download)
- **Ghost:** Tertiary actions (Skip, Learn More, Dismiss)

#### Form Components

- **FormInput:** Single-line text, email, URLs, numbers
- **FormTextarea:** Multi-line text (descriptions, notes)
- **FormSelect:** Limited choice from predefined options

#### Cards

- **Card:** Generic container for grouped content
- **StatCard:** Dashboard statistics (use CSS classes)
- **ProjectCard:** Project listings (use CSS classes)

#### Timeline

- Use for activity logs, update histories, and chronological displays
- Choose appropriate type (project/update/edit) for color coding

### Form Validation Patterns

```astro
---
import FormInput from '@/components/ui/redesign/FormInput.astro';

const errors = {
  email: form.email ? '' : 'Email is required',
  title: form.title?.length < 3 ? 'Title must be at least 3 characters' : '',
};
---

<FormInput
  name="email"
  label="Email"
  type="email"
  required
  error={errors.email}
  value={form.email}
/>
```

### Loading States

```astro
<Button disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

### Error Handling

```astro
{error && (
  <div class="error-message">
    <span>{error}</span>
  </div>
)}
```

---

## Dark Mode

### Implementation

Dark mode uses CSS variables that automatically switch based on the `data-theme` attribute:

```html
<html data-theme="workspace-dark">
```

### Color Variables

All colors use CSS variables that adapt to dark mode:

```css
/* Light Mode */
--bg: #ffffff;
--text-primary: #111827;

/* Dark Mode (data-theme="workspace-dark") */
--bg: #0a0a0a;
--text-primary: #ffffff;
```

### System Preference Fallback

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Dark mode variables */
  }
}
```

### Testing Dark Mode

1. Add `data-theme="workspace-dark"` to `<html>` tag
2. Toggle in browser DevTools
3. Test all components for contrast and readability

---

## Accessibility

### Best Practices

#### Focus States

All interactive elements have visible focus states:

```css
.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

#### Form Labels

Always provide labels for form inputs:

```astro
<FormInput
  name="email"
  label="Email Address"  <!-- Required for screen readers -->
  required
/>
```

#### Color Contrast

- All text meets WCAG AA standards (4.5:1 ratio)
- Primary button white text on #00D084 green: 3.5:1 (passes for large text)
- Error text (#DC2626): 4.6:1 on white background

#### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<button>` for actions, `<a>` for navigation
- Use `required` and `aria-invalid` attributes

#### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space activates buttons
- Escape closes modals/dropdowns

### Testing Checklist

- [ ] All images have alt text
- [ ] Forms have labels
- [ ] Focus visible on all interactive elements
- [ ] Color not the only indicator
- [ ] Keyboard navigation works
- [ ] Screen reader friendly

---

## Migration from DaisyUI

### Component Mapping

| DaisyUI | New Component |
|---------|---------------|
| `btn btn-primary` | `<Button variant="primary">` |
| `btn btn-secondary` | `<Button variant="secondary">` |
| `btn btn-ghost` | `<Button variant="ghost">` |
| `input` | `<FormInput>` |
| `textarea` | `<FormTextarea>` |
| `select` | `<FormSelect>` |
| `card` | `<Card>` or `.content-section` |
| `stat` | `.stat-card` |
| `drawer` | `.sidebar` (custom implementation) |

### Breaking Changes

1. **DaisyUI Removed:** Uninstalled from package.json
2. **Button Syntax:** Use component props instead of CSS classes
3. **Form Inputs:** Use dedicated components with validation
4. **Color Scheme:** Primary changed from #22c55e to #00D084
5. **Dark Mode:** Use `data-theme` instead of DaisyUI themes

---

## Quick Reference

### Most Common Patterns

#### Page Layout

```astro
---
import DashboardLayout from '@/components/layouts/DashboardLayout.astro';
import Button from '@/components/ui/redesign/Button.astro';
---

<DashboardLayout>
  <div class="page-header">
    <div class="header-content">
      <h1>Page Title</h1>
      <p>Page description</p>
    </div>
    <Button href="/new">Create New</Button>
  </div>

  <!-- Page content -->
</DashboardLayout>
```

#### Form

```astro
---
import FormInput from '@/components/ui/redesign/FormInput.astro';
import FormTextarea from '@/components/ui/redesign/FormTextarea.astro';
import FormSelect from '@/components/ui/redesign/FormSelect.astro';
import Button from '@/components/ui/redesign/Button.astro';
---

<form class="content-section">
  <FormInput
    name="title"
    label="Title"
    required
  />

  <FormTextarea
    name="description"
    label="Description"
    rows={4}
  />

  <FormSelect
    name="category"
    label="Category"
    options={categories}
  />

  <div class="flex gap-3">
    <Button type="submit">Save</Button>
    <Button variant="secondary" href="/cancel">Cancel</Button>
  </div>
</form>
```

#### Stats Grid

```astro
<div class="stats-row">
  <div class="stat-card">
    <div class="stat-label">Total Projects</div>
    <div class="stat-value">12</div>
  </div>

  <div class="stat-card">
    <div class="stat-label">Active</div>
    <div class="stat-value">8</div>
  </div>
</div>
```

---

## Additional Resources

- **Design Prototypes:** [design/](../../design/) - HTML reference implementations
- **Tailwind Docs:** https://tailwindcss.com/docs
- **CSS Variables:** [src/styles/global.css](../../src/styles/global.css) lines 22-79
- **Component Source:** [src/components/ui/redesign/](../../src/components/ui/redesign/)

---

**Questions?** Check the design prototypes in `/design` folder or reference this document when creating new UI components.
