# Brand Design System - Quick Start Guide

**Last Updated:** November 8, 2025
**Version:** 2.0 (Custom Design System)

**Read this first!** Quick reference for implementing Workspace brand consistently.

Full documentation: [04_Brand_Design_System.md](./architecture/04_Brand_Design_System.md)
Component library: [COMPONENT_LIBRARY.md](./reference/COMPONENT_LIBRARY.md)

---

## TL;DR - Key Concepts

- **Personal Workspace = Green** 🌱 (#00D084 - Growth, cultivation)
- **Commons Workspace = Blue** 🌳 (Trust, verified knowledge - Phase 2)
- **Safety States = Traffic lights** 🟢🟡🔴
- **4px spacing grid** - Always use multiples of 4
- **System fonts** - No custom web fonts (performance)
- **Custom components** - Using Astro components, not DaisyUI

---

## Quick Color Reference

### When to Use Green vs Blue

```astro
---
import Button from '@/components/ui/redesign/Button.astro';
---

<!-- Personal Workspace context (user's lab bench) -->
<Button variant="primary">  {/* Green #00D084 */}
  Create Personal Update
</Button>

<!-- Commons Workspace context (verified forest) - Phase 2 -->
<Button variant="secondary">  {/* Blue - Future */}
  Submit to Commons
</Button>

<!-- Subtle/Ghost action -->
<Button variant="ghost">
  View Details
</Button>
```

### Safety Protocol Colors

**ONLY use for safety badges, never for general UI:**

```html
<!-- Up to date 🟢 -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Safety Current
</span>

<!-- Needs review 🟡 -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
  Review Required
</span>

<!-- Action required 🔴 -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  Acknowledge Required
</span>
```

---

## Component Examples

### Cards

```html
<!-- Content section card -->
<div class="content-section">
  <h2 class="text-2xl font-semibold mb-2">Card Title</h2>
  <p class="text-gray-600 dark:text-gray-400">Card description text</p>
</div>

<!-- Stat card -->
<div class="stat-card">
  <div class="stat-value">42</div>
  <div class="stat-label">Projects</div>
</div>
```

### Buttons

```astro
---
import Button from '@/components/ui/redesign/Button.astro';
---

<!-- Primary CTA (Green) -->
<Button variant="primary" href="/create">
  Create Project
</Button>

<!-- Secondary -->
<Button variant="secondary">
  View Details
</Button>

<!-- Ghost/Subtle -->
<Button variant="ghost">
  Cancel
</Button>

<!-- With icon -->
<Button variant="primary">
  <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
  </svg>
  New Project
</Button>
```

### Forms

```astro
---
import FormInput from '@/components/ui/redesign/FormInput.astro';
import FormTextarea from '@/components/ui/redesign/FormTextarea.astro';
---

<FormInput
  name="title"
  label="Project Title"
  placeholder="Enter project name..."
  required
/>

<FormTextarea
  name="description"
  label="Description"
  rows="4"
  placeholder="Describe your project..."
/>
```

### Badges

```html
<!-- Status badges -->
<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800">
  Active
</span>
<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
  Published
</span>
<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
  Pending
</span>
<span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
  Draft
</span>

<!-- Pill style (fully rounded) -->
<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-gray-300">
  Tag Label
</span>
```

---

## Layout Patterns

### Dashboard Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="content-section">Card 1</div>
  <div class="content-section">Card 2</div>
  <div class="content-section">Card 3</div>
</div>
```

### Hero Section

```astro
---
import Button from '@/components/ui/redesign/Button.astro';
---

<section class="container mx-auto py-16 text-center">
  <h1 class="text-5xl font-bold mb-4 text-primary-600">
    Your Personal Lab Bench 🌱
  </h1>
  <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
    Cultivate ideas, grow knowledge, share discoveries
  </p>
  <Button variant="primary" size="lg" href="/start">
    Get Started
  </Button>
</section>
```

### Two-Column Layout

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Main content (2 columns) -->
  <div class="lg:col-span-2">
    <div class="content-section">Main Content</div>
  </div>

  <!-- Sidebar (1 column) -->
  <div class="lg:col-span-1">
    <div class="content-section">Sidebar</div>
  </div>
</div>
```

---

## Using CSS Custom Properties

All brand tokens are available as CSS variables:

```css
.my-custom-component {
  /* Spacing */
  padding: var(--space-6);
  gap: var(--space-4);

  /* Colors */
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);

  /* Radius */
  border-radius: var(--radius-md);

  /* Shadows */
  box-shadow: var(--shadow-md);
}

/* Context-aware colors */
.personal-page {
  --primary-color: var(--personal-primary); /* Green */
}

.commons-page {
  --primary-color: var(--commons-primary); /* Blue */
}
```

---

## Accessibility Checklist

Before shipping any UI, verify:

- [ ] **Color contrast**: Text has 4.5:1 ratio minimum (use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
- [ ] **Keyboard navigation**: All interactive elements reachable with Tab
- [ ] **Focus indicators**: Visible outline on :focus-visible
- [ ] **Alt text**: All images have descriptive alt attributes
- [ ] **ARIA labels**: Icon-only buttons have aria-label
- [ ] **Touch targets**: Buttons minimum 44x44px on mobile
- [ ] **Motion**: Respects prefers-reduced-motion
- [ ] **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)

---

## Spacing Quick Reference

Always use multiples of 4px:

```tsx
// Tailwind spacing classes mapped to 4px grid
p-1   = 4px   (--space-1)
p-2   = 8px   (--space-2)
p-3   = 12px  (--space-3)
p-4   = 16px  (--space-4)
p-6   = 24px  (--space-6)
p-8   = 32px  (--space-8)
p-12  = 48px  (--space-12)
p-16  = 64px  (--space-16)

gap-4 = 16px gap between grid items
gap-6 = 24px gap (recommended for cards)
```

---

## Typography Quick Reference

```tsx
// Display (hero sections only)
<h1 className="text-5xl font-bold">Display Heading</h1>

// Page headings
<h1 className="text-3xl font-semibold">H1 Heading</h1>
<h2 className="text-2xl font-semibold">H2 Heading</h2>
<h3 className="text-xl font-semibold">H3 Heading</h3>

// Body text
<p className="text-base">Default body text (16px)</p>
<p className="text-lg">Large body text (18px)</p>
<p className="text-sm">Small UI text (14px)</p>
<p className="text-xs">Captions, labels (12px)</p>

// Code/data
<code className="font-mono text-sm">const code = true</code>
```

---

## Common Patterns

### Empty State

```astro
---
import Button from '@/components/ui/redesign/Button.astro';
---

<div class="content-section text-center py-12">
  <div class="text-6xl mb-4">🌱</div>
  <h3 class="text-xl font-semibold mb-2">No projects yet</h3>
  <p class="text-gray-600 dark:text-gray-400 mb-6">
    Create your first project to get started
  </p>
  <Button variant="primary" href="/create">
    Create Project
  </Button>
</div>
```

### Loading State

```html
<div class="flex items-center justify-center p-12">
  <div class="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
  <span class="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
</div>
```

### Error State

```html
<div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
  <svg class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span class="text-red-800 dark:text-red-200">Something went wrong. Please try again.</span>
</div>
```

### Success Toast

```html
<div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
  <svg class="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span class="text-green-800 dark:text-green-200">Project created successfully! 🌱</span>
</div>
```

---

## Icons

Use [Heroicons](https://heroicons.com/) for all icons:

```tsx
// Outline style (default for UI)
<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 4v16m8-8H4" />
</svg>

// Solid style (emphasis)
<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
  <path d="M..." />
</svg>

// Size reference
w-4 h-4 = 16px (inline with text)
w-5 h-5 = 20px (UI elements)
w-6 h-6 = 24px (feature icons)
```

---

## Dark Mode

Dark mode is handled through Tailwind's `dark:` classes and CSS variables.

**Theme switching** is based on the `data-theme` attribute on the `<html>` tag:

```html
<html data-theme="light">  <!-- Light theme -->
<html data-theme="dark">   <!-- Dark theme -->
```

**In your components**, use Tailwind's dark mode classes:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content that adapts to theme
</div>
```

**Using CSS variables** (defined in `global.css`):

```css
.my-component {
  background: var(--surface-1);     /* Adapts to theme */
  color: var(--text-primary);       /* Adapts to theme */
  border: 1px solid var(--border);  /* Adapts to theme */
}
```

---

## Voice & Tone Examples

### Welcome Messages
- ✅ "Welcome back, Ali! 👋"
- ✅ "Ready to continue your research?"
- ❌ "User authenticated successfully"

### Empty States
- ✅ "No projects yet. Create your first one!"
- ✅ "Your dashboard is quiet today"
- ❌ "No data available"

### Errors
- ✅ "Something went wrong. Let's try again."
- ✅ "We couldn't save your changes. Check your connection."
- ❌ "Error: Save failed"

### Success
- ✅ "Project created! 🌱"
- ✅ "Update published successfully"
- ❌ "Operation completed"

---

## Testing Checklist

Before considering a feature "done":

1. **Visual consistency**
   - [ ] Uses brand colors correctly
   - [ ] Spacing follows 4px grid
   - [ ] Typography uses scale

2. **Responsiveness**
   - [ ] Works on mobile (320px+)
   - [ ] Works on tablet (768px)
   - [ ] Works on desktop (1024px+)

3. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] Screen reader friendly
   - [ ] Color contrast passes

4. **Performance**
   - [ ] No layout shift (CLS)
   - [ ] Fast interactions (<100ms)
   - [ ] Optimized images

---

## Getting Help

**Brand questions?**
- Read full system: [04_Brand_Design_System.md](./architecture/04_Brand_Design_System.md)
- Check glossary: [01_Workspace_Language_and_Structure_Glossary.md](./architecture/01_Workspace_Language_and_Structure_Glossary.md)

**Component reference?**
- [Component Library](./reference/COMPONENT_LIBRARY.md) - All custom components with examples

**Tailwind utilities?**
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

**Icons?**
- [Heroicons](https://heroicons.com/) - Free, open-source icon set

**Design files?**
- [design/ folder](../design/) - HTML prototypes and design references

---

**Remember:** Brand consistency builds trust. When in doubt, check the full design system document or ask!

Happy building! 🌱→🌳
