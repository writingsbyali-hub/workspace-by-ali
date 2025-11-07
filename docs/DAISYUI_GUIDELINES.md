# DaisyUI Usage Guidelines

## Overview

This project uses **DaisyUI 5.4.2** as a component structure library alongside **Tailwind CSS 3.4.18** for styling. DaisyUI themes are **disabled** to maintain full control over our custom design system.

## Philosophy

**DaisyUI = Structure | Tailwind = Style**

- ✅ Use DaisyUI for **structural component classes** (layout, behavior, accessibility)
- ✅ Use Tailwind utilities and **CSS variables** for all colors and styling
- ❌ Don't rely on DaisyUI's theme system (it's disabled)
- ❌ Don't use DaisyUI's color classes (`btn-primary`, `btn-secondary`, etc.)

## Configuration

```javascript
// tailwind.config.mjs
daisyui: {
  themes: false,  // Disabled - we use custom CSS variables
  logs: false,
}
```

## Color System

All colors reference CSS variables from `src/styles/global.css`:

### Brand Colors

```css
--personal-primary: #22c55e;  /* Personal Workspace (Green) 🌱 */
--commons-primary: #3b82f6;   /* Commons Workspace (Blue) 🌳 */
--connection: #8b5cf6;        /* Bridge between worlds (Purple) */
```

### Usage in Components

**✅ Correct:**
```html
<button class="btn bg-personal-primary hover:bg-personal-primary-hover text-white">
  Save
</button>
```

**❌ Incorrect:**
```html
<button class="btn btn-primary">Save</button>  <!-- Don't use DaisyUI color classes -->
<button class="btn bg-[#22c55e]">Save</button> <!-- Don't hardcode colors -->
```

## Component Patterns

### Buttons

**DaisyUI provides:** `btn`, `btn-sm`, `btn-md`, `btn-lg`, `btn-block`, `btn-ghost`, `btn-outline`, `btn-link`

**We add:** Custom colors via Tailwind utilities

```html
<!-- Primary action -->
<button class="btn bg-personal-primary hover:bg-personal-primary-hover text-white border-0">
  Create Project
</button>

<!-- Secondary action -->
<button class="btn bg-commons-primary hover:bg-commons-primary-hover text-white border-0">
  Join Commons
</button>

<!-- Ghost button -->
<button class="btn btn-ghost">
  Cancel
</button>

<!-- Outline button -->
<button class="btn btn-outline">
  Learn More
</button>
```

**Best Practice:** Use the `<Button>` component from `src/components/ui/Button.tsx`:

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary">Create Project</Button>
<Button variant="secondary">Join Commons</Button>
<Button variant="ghost">Cancel</Button>
```

### Cards

**DaisyUI provides:** `card`, `card-body`, `card-title`, `card-actions`

**We style:** Background, borders, shadows via Tailwind

```html
<div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
  <div class="card-body">
    <h2 class="card-title text-lg">Card Title</h2>
    <p>Card content goes here.</p>
    <div class="card-actions justify-end">
      <button class="btn btn-sm bg-personal-primary hover:bg-personal-primary-hover text-white">
        Action
      </button>
    </div>
  </div>
</div>
```

### Drawer (Sidebar Navigation)

**DaisyUI provides:** `drawer`, `drawer-side`, `drawer-content`, `drawer-toggle`

**Layout structure only** - All styling is custom:

```html
<div class="drawer lg:drawer-open">
  <input id="drawer" type="checkbox" class="drawer-toggle" />

  <div class="drawer-content">
    <!-- Main content -->
  </div>

  <div class="drawer-side">
    <label for="drawer" class="drawer-overlay"></label>
    <aside class="menu p-4 w-80 min-h-full bg-base-200">
      <!-- Sidebar content with custom styling -->
    </aside>
  </div>
</div>
```

### Menu Navigation

**DaisyUI provides:** `menu`, `menu-title`

**We customize:** Active states, colors, spacing

```html
<ul class="menu gap-2">
  <li>
    <a href="/" class="flex items-center gap-3 active:bg-personal-primary active:text-white">
      <svg>...</svg>
      Dashboard
    </a>
  </li>
</ul>
```

**Active state pattern:**
```javascript
const isActive = (path) => Astro.url.pathname === path;

<a class={`flex items-center gap-3 ${isActive('/') ? 'bg-personal-primary text-white' : ''}`}>
```

### Stats

**DaisyUI provides:** `stats`, `stat`, `stat-title`, `stat-value`, `stat-desc`

```html
<div class="stats shadow">
  <div class="stat">
    <div class="stat-title">Total Projects</div>
    <div class="stat-value">12</div>
    <div class="stat-desc">↗︎ 20% this month</div>
  </div>
</div>
```

Use the `<StatCard>` component for consistency:
```tsx
<StatCard
  title="Projects"
  value={12}
  description="Active research projects"
  trend={{ value: 20, isPositive: true }}
/>
```

### Badges

**DaisyUI provides:** `badge`, `badge-sm`, `badge-md`, `badge-lg`

```html
<span class="badge bg-personal-primary text-white">New</span>
<span class="badge badge-outline">Draft</span>
<span class="badge bg-commons-primary text-white">Published</span>
```

### Dropdowns

**DaisyUI provides:** `dropdown`, `dropdown-content`

```html
<div class="dropdown dropdown-end">
  <label tabindex="0" class="btn btn-ghost">
    Menu
  </label>
  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
```

### Modals

**DaisyUI provides:** `modal`, `modal-box`, `modal-action`

```html
<dialog class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Modal Title</h3>
    <p class="py-4">Modal content</p>
    <div class="modal-action">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn bg-personal-primary hover:bg-personal-primary-hover text-white">
        Confirm
      </button>
    </div>
  </div>
</dialog>
```

**Best Practice:** Use `<ConfirmDialog>` component from `src/components/ui/ConfirmDialog.tsx`

### Form Elements

**DaisyUI provides:** `input`, `textarea`, `select`, `checkbox`, `radio`, `toggle`

```html
<!-- Input -->
<input type="text" class="input input-bordered w-full" placeholder="Enter text" />

<!-- Textarea -->
<textarea class="textarea textarea-bordered w-full" placeholder="Description"></textarea>

<!-- Select -->
<select class="select select-bordered w-full">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Checkbox -->
<input type="checkbox" class="checkbox" />

<!-- Toggle -->
<input type="checkbox" class="toggle" />
```

### Loading States

**DaisyUI provides:** `loading`, `loading-spinner`, `loading-dots`, `loading-ring`

```html
<span class="loading loading-spinner"></span>
<span class="loading loading-dots"></span>
<span class="loading loading-ring loading-lg"></span>
```

Use within Button component:
```tsx
<Button isLoading loadingText="Saving...">Save Changes</Button>
```

### Dividers

**DaisyUI provides:** `divider`

```html
<div class="divider">OR</div>
<div class="divider divider-horizontal"></div>
```

## Spacing System

Use the 4px base spacing unit from CSS variables:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
```

**Tailwind equivalents:**
- `gap-1` = 4px
- `gap-2` = 8px
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-6` = 24px
- `p-4` = 16px padding
- `mb-8` = 32px margin-bottom

## Responsive Design

Use Tailwind breakpoints with DaisyUI components:

```html
<div class="stats stats-vertical lg:stats-horizontal">
  <!-- Stacks on mobile, horizontal on desktop -->
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- 1 column on mobile, 3 on desktop -->
</div>
```

## Accessibility

DaisyUI provides good accessibility defaults. Enhance with:

```html
<!-- Proper labeling -->
<label for="email" class="label">
  <span class="label-text">Email</span>
</label>
<input id="email" type="email" class="input input-bordered" />

<!-- ARIA attributes -->
<button aria-label="Close menu" class="btn btn-ghost">
  <svg>...</svg>
</button>

<!-- Focus states -->
<a class="btn focus-visible:ring-2 focus-visible:ring-commons-primary">
  Link
</a>
```

## Common Patterns

### Action Card with Button

```html
<div class="card bg-base-100 shadow">
  <div class="card-body">
    <h2 class="card-title">Quick Actions</h2>
    <div class="flex flex-col gap-2">
      <a href="/projects/new" class="btn btn-sm bg-personal-primary hover:bg-personal-primary-hover text-white border-0">
        <svg>...</svg>
        New Project
      </a>
      <a href="/updates/new" class="btn btn-sm bg-personal-primary hover:bg-personal-primary-hover text-white border-0">
        <svg>...</svg>
        New Update
      </a>
    </div>
  </div>
</div>
```

### Page Header with Action

```html
<div class="flex items-center justify-between mb-8">
  <div>
    <h1 class="text-3xl font-bold text-base-content mb-2">Projects</h1>
    <p class="text-base-content/60">Manage your research projects</p>
  </div>
  <a href="/projects/new" class="btn bg-personal-primary hover:bg-personal-primary-hover text-white border-0">
    <svg>...</svg>
    New Project
  </a>
</div>
```

### Empty State

```html
<div class="card bg-base-100 shadow">
  <div class="card-body items-center text-center py-12">
    <svg class="w-16 h-16 text-base-content/40 mb-4">...</svg>
    <h3 class="text-xl font-semibold mb-2">No projects yet</h3>
    <p class="text-base-content/60 mb-6">
      Get started by creating your first project.
    </p>
    <a href="/projects/new" class="btn bg-personal-primary hover:bg-personal-primary-hover text-white">
      Create Project
    </a>
  </div>
</div>
```

## Component Library Reference

### Use These DaisyUI Components

| Component | Use Case | Custom Styling |
|-----------|----------|----------------|
| `btn` | Buttons | Add bg-personal-primary, bg-commons-primary |
| `card` | Content containers | Add shadows, hover effects |
| `drawer` | Sidebar navigation | Custom menu styling |
| `menu` | Navigation lists | Custom active states |
| `stats` | Dashboard metrics | Use StatCard component |
| `badge` | Status indicators | Custom colors |
| `dropdown` | Menus, selectors | Custom dropdown-content styling |
| `modal` | Dialogs | Use ConfirmDialog component |
| `input` | Form fields | Standard usage |
| `loading` | Loading states | Use in Button component |
| `divider` | Section separators | Standard usage |

### Avoid These DaisyUI Features

- ❌ **Theme classes** (`btn-primary`, `btn-accent`, etc.) - Use custom colors
- ❌ **Theme switching** - We handle this with CSS variables
- ❌ **Pre-defined color palettes** - Use our brand colors

## Migration Checklist

When updating existing code:

- [ ] Replace `btn-primary` with `btn bg-personal-primary hover:bg-personal-primary-hover text-white border-0`
- [ ] Replace `btn-secondary` with `btn bg-commons-primary hover:bg-commons-primary-hover text-white border-0`
- [ ] Replace hardcoded colors `bg-[#22c55e]` with `bg-personal-primary`
- [ ] Use `<Button>` component instead of raw `btn` classes where possible
- [ ] Ensure all interactive elements have proper focus states
- [ ] Test with keyboard navigation

## Resources

- [DaisyUI Documentation](https://daisyui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Brand Design System](../architecture/04_Brand_Design_System.md)
- [Component Examples](../components/ui/)

## Questions?

If you're unsure whether to use a DaisyUI class or write custom Tailwind:

1. **Structure/Layout/Behavior** → Use DaisyUI
2. **Colors/Spacing/Visual** → Use Tailwind + CSS variables
3. **Complex components** → Create in `src/components/ui/` using both

---

Last updated: 2025-01-07
