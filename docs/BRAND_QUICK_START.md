# Brand Design System - Quick Start Guide

**Read this first!** Quick reference for implementing Workspace brand consistently.

Full documentation: [04_Brand_Design_System.md](./architecture/04_Brand_Design_System.md)

---

## TL;DR - Key Concepts

- **Personal Workspace = Green** 🌱 (Growth, cultivation)
- **Commons Workspace = Blue** 🌳 (Trust, verified knowledge)
- **Safety States = Traffic lights** 🟢🟡🔴
- **4px spacing grid** - Always use multiples of 4
- **System fonts** - No custom web fonts (performance)

---

## Quick Color Reference

### When to Use Green vs Blue

```tsx
// Personal Workspace context (user's lab bench)
<button className="btn btn-secondary">  {/* Green */}
  Create Personal Update
</button>

// Commons Workspace context (verified forest)
<button className="btn btn-primary">  {/* Blue */}
  Submit to Commons
</button>

// Bridge/Connection between worlds
<button className="btn btn-accent">  {/* Purple */}
  Sync to Commons
</button>
```

### Safety Protocol Colors

**ONLY use for safety badges, never for general UI:**

```tsx
// Up to date 🟢
<span className="badge bg-safety-current text-white">
  Safety Current
</span>

// Needs review 🟡
<span className="badge bg-safety-pending text-white">
  Review Required
</span>

// Action required 🔴
<span className="badge bg-safety-required text-white">
  Acknowledge Required
</span>
```

---

## Component Examples

### Cards

```tsx
<div className="card bg-base-100 shadow-md rounded-xl p-6
                border border-base-300 hover:shadow-lg
                transition-smooth">
  <h2 className="text-2xl font-semibold mb-2">Card Title</h2>
  <p className="text-base-content/70">Card description text</p>
</div>
```

### Buttons

```tsx
// Primary CTA (Blue - Commons)
<button className="btn btn-primary rounded-md h-11 px-6 font-semibold">
  Primary Action
</button>

// Secondary CTA (Green - Personal)
<button className="btn btn-secondary rounded-md h-11 px-6 font-semibold">
  Secondary Action
</button>

// Ghost/Subtle
<button className="btn btn-ghost rounded-md h-11 px-6">
  Subtle Action
</button>
```

### Forms

```tsx
<input
  type="text"
  className="input input-bordered w-full h-11
             rounded-md border-2 focus:border-primary
             transition-colors"
  placeholder="Enter text..."
/>

<textarea
  className="textarea textarea-bordered w-full
             rounded-md border-2 focus:border-primary
             transition-colors"
  rows={4}
/>
```

### Badges

```tsx
// Status badges
<span className="badge badge-primary">Active</span>
<span className="badge badge-success">Published</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Draft</span>

// Pill style (fully rounded)
<span className="badge badge-outline rounded-full">
  Tag Label
</span>
```

---

## Layout Patterns

### Dashboard Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card">Card 1</div>
  <div className="card">Card 2</div>
  <div className="card">Card 3</div>
</div>
```

### Hero Section

```tsx
<section className="container mx-auto py-16 text-center">
  <h1 className="text-5xl font-bold mb-4 text-primary">
    Your Personal Lab Bench 🌱
  </h1>
  <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
    Cultivate ideas, grow knowledge, share discoveries
  </p>
  <button className="btn btn-primary btn-lg">
    Get Started
  </button>
</section>
```

### Two-Column Layout

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main content (2 columns) */}
  <div className="lg:col-span-2">
    <div className="card">Main Content</div>
  </div>

  {/* Sidebar (1 column) */}
  <div className="lg:col-span-1">
    <div className="card">Sidebar</div>
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

```tsx
<div className="card bg-base-100 text-center py-12">
  <div className="text-6xl mb-4">🌱</div>
  <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
  <p className="text-base-content/70 mb-6">
    Create your first project to get started
  </p>
  <button className="btn btn-primary">
    Create Project
  </button>
</div>
```

### Loading State

```tsx
<div className="flex items-center justify-center p-12">
  <span className="loading loading-spinner loading-lg text-primary"></span>
  <span className="ml-3 text-base-content/70">Loading...</span>
</div>
```

### Error State

```tsx
<div className="alert alert-error rounded-md">
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Something went wrong. Please try again.</span>
</div>
```

### Success Toast

```tsx
<div className="alert alert-success rounded-md">
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Project created successfully! 🌱</span>
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

Both light and dark themes are configured in `tailwind.config.mjs`.

**DaisyUI automatically handles theme switching** based on system preference or manual selection.

To manually set theme:

```html
<html data-theme="workspace-light">  <!-- Light theme -->
<html data-theme="workspace-dark">   <!-- Dark theme -->
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

**DaisyUI components?**
- [DaisyUI Docs](https://daisyui.com/components/)

**Tailwind utilities?**
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

**Icons?**
- [Heroicons](https://heroicons.com/)

---

**Remember:** Brand consistency builds trust. When in doubt, check the full design system document or ask!

Happy building! 🌱→🌳
