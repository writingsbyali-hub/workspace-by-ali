# Workspace Brand & Design System (v1.0)

**Created:** 2025-11-03
**Authors:** Ali · Claude (brand-guardian)
**Purpose:** Establish cohesive visual identity and design guidelines for the Workspace ecosystem

---

## 1. Brand Foundation

### Brand Purpose
Workspace exists to bridge individual experimentation with verified collective knowledge — enabling researchers to work openly, safely, and collaboratively while maintaining rigor and recognition.

### Brand Vision
A thriving ecosystem where researchers cultivate personal gardens of exploration that naturally grow into verified forests of shared knowledge.

### Brand Values
- **Transparency** - Open by design, traceable by default
- **Safety First** - Ethical boundaries protect researchers and communities
- **Recognition** - Every contribution, no matter how small, is visible and attributed
- **Autonomy + Rigor** - Personal freedom balanced with collective standards
- **Gratitude** - We stand on the shoulders of open source giants

### Brand Personality
- **Thoughtful** - Deliberate choices, not rushed products
- **Nurturing** - Supportive of growth, exploration, and learning
- **Trustworthy** - Rigorous verification, ethical commitments
- **Accessible** - Not intimidating, welcoming to all researchers
- **Elegant** - Simple interfaces hiding complex systems

---

## 2. Visual Identity

### Core Metaphor System
The brand draws from nature's growth cycles:

| Concept | Visual Theme | Color Association |
|---------|--------------|-------------------|
| **Personal Workspace** | Garden, seedlings, cultivation | Warm greens, earth tones |
| **Commons Workspace** | Forest, mature trees, ecosystem | Deep greens, blues |
| **Submission Flow** | Growth, transformation | Gradient (green → blue) |
| **Safety Protocols** | Protection, boundaries | Amber, red (traffic light system) |
| **Data/Science** | Precision, clarity | Blues, purples (tech) |

---

## 3. Color System

### Primary Palette

```css
/* Personal Workspace - Cultivation & Growth */
--personal-primary: #00D084;    /* Bright Green - Growth, vitality */
--personal-accent: #84cc16;     /* Lime-500 - Fresh, energetic */
--personal-surface: #f0fdf4;    /* Green-50 - Light, organic */

/* Commons Workspace - Verified Knowledge */
--commons-primary: #3b82f6;     /* Blue-500 - Trust, depth */
--commons-accent: #06b6d4;      /* Cyan-500 - Clarity, flow */
--commons-surface: #eff6ff;     /* Blue-50 - Open, clear */

/* Shared System Colors */
--workspace-purple: #8b5cf6;    /* Violet-500 - Connection between worlds */
--workspace-neutral: #64748b;   /* Slate-500 - Professional foundation */
```

### Functional Colors

```css
/* Semantic States */
--success: #10b981;    /* Green-500 - Actions succeeded */
--warning: #f59e0b;    /* Amber-500 - Attention needed */
--error: #ef4444;      /* Red-500 - Critical issues */
--info: #3b82f6;       /* Blue-500 - Helpful information */

/* Safety Protocol States */
--safety-current: #00D084;   /* Green - Up to date 🟢 */
--safety-pending: #f59e0b;   /* Amber - Review needed 🟡 */
--safety-required: #ef4444;  /* Red - Action required 🔴 */
```

### Neutral Scale (Light Theme)

```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

### Dark Theme Palette

```css
/* Dark Mode Overrides */
--dark-bg: #0a0a0a;
--dark-surface-1: #0f0f0f;
--dark-surface-2: #131313;
--dark-surface-3: #161616;
--dark-border: #202020;
--dark-text-primary: #ffffff;
--dark-text-secondary: #e0e0e0;
--dark-text-muted: #888888;
```

### Color Usage Guidelines

**Personal Workspace Dominance**
- Use green as primary CTA color
- Accent with lime for secondary actions
- Backgrounds should feel warm and inviting

**Commons Workspace Dominance**
- Use blue as primary CTA color
- Accent with cyan for data/verification states
- Backgrounds should feel trustworthy and clear

**Safety Protocol Colors**
- ONLY use traffic light colors for safety badges
- Never use red/amber for non-safety contexts in safety flows
- Always pair colors with icons for accessibility

---

## 4. Typography System

### Font Families

```css
/* Primary Font - System Stack (Performance & Accessibility) */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

/* Monospace - Code, Data, Technical Content */
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono',
             Consolas, 'Courier New', monospace;

/* Optional: Branded Headings (Future Phase) */
/* Consider: Inter, Public Sans, or Work Sans for personality */
```

### Type Scale

```css
/* Display - Hero sections, landing pages */
--text-5xl: 48px;   /* 3rem */
--text-4xl: 36px;   /* 2.25rem */

/* Headings */
--text-3xl: 30px;   /* 1.875rem - H1 */
--text-2xl: 24px;   /* 1.5rem - H2 */
--text-xl: 20px;    /* 1.25rem - H3 */

/* Body & UI */
--text-lg: 18px;    /* 1.125rem - Large body, feature text */
--text-base: 16px;  /* 1rem - Default body text */
--text-sm: 14px;    /* 0.875rem - Small UI text */
--text-xs: 12px;    /* 0.75rem - Labels, captions */
```

### Font Weights

```css
--font-light: 300;    /* Sparingly - hero text only */
--font-regular: 400;  /* Body text default */
--font-medium: 500;   /* UI elements, subtle emphasis */
--font-semibold: 600; /* Headings, important labels */
--font-bold: 700;     /* Strong emphasis, CTAs */
```

### Line Heights

```css
--leading-tight: 1.25;   /* Headings */
--leading-snug: 1.375;   /* UI elements */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form reading */
```

### Typography Usage Guidelines

- **Headings**: Use semibold (600) for H1-H3
- **Body**: Default to 16px with 1.5 line height
- **Code/Data**: Always use monospace font
- **Long-form content**: Use relaxed line height (1.75)
- **Mobile**: Reduce heading sizes by 20-25%

---

## 5. Spacing & Layout

### Spacing Scale (4px base unit)

```css
--space-1: 4px;    /* 0.25rem */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */
--space-20: 80px;  /* 5rem */
```

### Container Widths

```css
--container-sm: 640px;    /* Single column content */
--container-md: 768px;    /* Standard content */
--container-lg: 1024px;   /* Dashboard layouts */
--container-xl: 1280px;   /* Wide dashboards */
--container-max: 1440px;  /* Full-width limit */
```

### Grid System

- **12-column grid** for complex layouts
- **Gap default**: 24px (--space-6)
- **Responsive breakpoints**:
  - Mobile: < 640px (1 column)
  - Tablet: 640-1024px (2 columns)
  - Desktop: > 1024px (3-4 columns)

---

## 6. UI Components

### Border Radius

```css
--radius-sm: 6px;      /* Buttons, inputs, badges */
--radius-md: 12px;     /* Cards, modals */
--radius-lg: 16px;     /* Large cards, images */
--radius-full: 9999px; /* Pills, avatars */
```

### Shadows & Elevation

```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Card elevation */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Modal/popover elevation */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* High elevation (modals) */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Dark mode adjustments */
--shadow-dark: 0 10px 30px rgba(0, 0, 0, 0.5);
```

### Buttons

**Primary CTA**
- Background: Context-specific (green for Personal, blue for Commons)
- Height: 40px (mobile), 44px (desktop)
- Padding: 12px 24px
- Border radius: --radius-sm
- Font weight: 600 (semibold)
- Hover: Darken by 10%
- Active: Scale 0.98

**Secondary**
- Outline style with 2px border
- Background: transparent
- Hover: Light fill (--gray-100)

**Ghost**
- No background, no border
- Hover: Subtle background (--gray-50)

### Cards

```css
.card {
  background: var(--surface, #ffffff);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
```

### Inputs & Forms

```css
.input {
  height: 44px;
  padding: 0 var(--space-4);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  background: var(--surface);
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input:error {
  border-color: var(--error);
}
```

### Badges & Pills

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

/* Safety Badges */
.badge-safety-current {
  background: #dcfce7;
  color: #166534;
}

.badge-safety-pending {
  background: #fef3c7;
  color: #92400e;
}

.badge-safety-required {
  background: #fee2e2;
  color: #991b1b;
}
```

---

## 7. Iconography

### Icon System
- **Source**: [Heroicons](https://heroicons.com/) (MIT License)
- **Style**: Outline for UI, Solid for emphasis
- **Sizes**: 16px (inline), 20px (UI), 24px (feature)
- **Color**: Match text color or use brand colors

### Icon Usage Guidelines

**Personal Workspace Icons**
- 🌱 Seedling - New projects
- ✍️ Pen - Updates, writing
- 📊 Chart - Data, experiments
- 🔬 Microscope - Research, science
- 🌿 Leaf - Growth, progress

**Commons Workspace Icons**
- 🌳 Tree - Verified knowledge
- ✓ Checkmark - Approval, verified
- 👥 People - Collaboration, community
- 📚 Books - Documentation, resources
- 🔒 Lock - Safety, gated content

**System Icons**
- ⚙️ Gear - Settings
- 🔔 Bell - Notifications
- ❓ Question - Help, documentation
- ⚠️ Warning - Alerts, important info
- → Arrow - Navigation, flow

---

## 8. Motion & Animation

### Animation Principles
- **Purposeful**: Only animate to communicate state or guide attention
- **Fast**: 150-300ms for most interactions
- **Smooth**: Use easing functions (ease-out for entrances)
- **Subtle**: Avoid distracting movements

### Common Animations

```css
/* Button hover */
.btn:hover {
  transform: translateY(-1px);
  transition: transform 0.15s ease-out;
}

/* Card hover */
.card:hover {
  box-shadow: var(--shadow-lg);
  transition: box-shadow 0.2s ease-out;
}

/* Modal entrance */
.modal {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 9. Accessibility Standards

### Color Contrast
- **WCAG AA minimum** (4.5:1 for normal text, 3:1 for large)
- Test all color combinations
- Never rely on color alone for meaning
- Pair safety colors with icons/text

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus indicators (3px outline, brand color)
- Logical tab order
- Escape key closes modals/menus

### Screen Readers
- Semantic HTML (nav, main, article, aside)
- ARIA labels on icon buttons
- Alt text on all images
- Form labels associated with inputs
- Error messages announced

### Motion Sensitivity
- Respect `prefers-reduced-motion` media query
- Disable animations for users who prefer it

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Brand Voice & Messaging

### Tone Attributes
- **Welcoming**: "Welcome back!" not "User authenticated"
- **Encouraging**: "Great work!" not "Task completed"
- **Honest**: "This might take a moment" not "Loading..."
- **Clear**: "Sign safety protocol" not "Acknowledge terms"

### Writing Guidelines

**DO:**
- Use active voice
- Write conversationally
- Be specific and actionable
- Celebrate small wins
- Explain "why" when asking for actions

**DON'T:**
- Use jargon without explanation
- Patronize or oversimplify
- Hide complexity dishonestly
- Use dark patterns
- Speak in third person

### Common Phrases

**Welcome Messages**
- "Welcome back, [name]! 👋"
- "Ready to continue your research?"
- "Here's what's happening in your workspace"

**Empty States**
- "No projects yet. Create your first one!"
- "Your dashboard is quiet today. Time to start something new?"
- "Nothing here yet. Let's change that."

**Errors**
- "Something went wrong. Let's try again."
- "We couldn't save your changes. Please check your connection."
- "This action requires safety acknowledgment first."

**Success**
- "Project created! 🌱"
- "Update published successfully"
- "Submission sent to Commons for review"

---

## 11. Implementation Guidelines

### DaisyUI Theme Configuration

Update `tailwind.config.mjs`:

```javascript
daisyui: {
  themes: [
    {
      "workspace-light": {
        "primary": "#3b82f6",      // Commons blue
        "secondary": "#00D084",    // Personal green
        "accent": "#8b5cf6",       // Connection purple
        "neutral": "#64748b",      // Slate
        "base-100": "#ffffff",
        "base-200": "#f9fafb",
        "base-300": "#f3f4f6",
        "info": "#3b82f6",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#ef4444",
      },
      "workspace-dark": {
        "primary": "#3b82f6",
        "secondary": "#00D084",
        "accent": "#8b5cf6",
        "neutral": "#1f2937",
        "base-100": "#0a0a0a",
        "base-200": "#0f0f0f",
        "base-300": "#131313",
        "info": "#3b82f6",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#ef4444",
      }
    }
  ],
}
```

### CSS Custom Properties

Add to `src/styles/global.css`:

```css
:root {
  /* Spacing */
  --space-unit: 4px;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Context colors */
  --personal-primary: #00D084;
  --commons-primary: #3b82f6;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  }
}
```

### Component Guidelines

**Card Component**
```tsx
<div className="card bg-base-100 shadow-md rounded-xl p-6
                border border-base-300 hover:shadow-lg
                transition-shadow duration-200">
  {/* Content */}
</div>
```

**Button Component**
```tsx
// Primary CTA
<button className="btn btn-primary rounded-md h-11 px-6
                   font-semibold shadow-sm hover:-translate-y-0.5
                   transition-transform">
  Create Project
</button>

// Secondary
<button className="btn btn-outline btn-primary rounded-md h-11 px-6">
  Learn More
</button>
```

---

## 12. Brand Application Examples

### Personal Workspace UI
- **Primary color**: Green (#00D084)
- **Hero section**: "Your personal lab bench on the web 🌱"
- **CTA buttons**: Green with rounded corners
- **Cards**: Light green accents on hover
- **Empty states**: Encouraging, growth-focused language

### Commons Workspace UI
- **Primary color**: Blue (#3b82f6)
- **Hero section**: "Verified knowledge for everyone 🌳"
- **CTA buttons**: Blue with rounded corners
- **Cards**: Blue accents for verified content
- **Badges**: Prominent verification indicators

### Safety Protocol Pages
- **Traffic light colors**: Only for safety states
- **Clear hierarchy**: Protocol version, date, requirements
- **CTAs**: Large "I Acknowledge" button (amber/orange)
- **Icons**: Shield, checkmark, warning triangle

---

## 13. Quality Checklist

Before shipping any interface:

**Visual Consistency**
- [ ] Colors match brand palette
- [ ] Typography follows scale
- [ ] Spacing uses 4px base unit
- [ ] Border radius consistent
- [ ] Shadows appropriate for elevation

**Accessibility**
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels on icons
- [ ] Reduced motion respected

**Responsiveness**
- [ ] Works on mobile (320px+)
- [ ] Touch targets 44px minimum
- [ ] Text readable without zoom
- [ ] Images load efficiently
- [ ] Horizontal scroll prevented

**Brand Alignment**
- [ ] Tone matches guidelines
- [ ] Icons from approved set
- [ ] Context-appropriate colors
- [ ] Celebrates user actions
- [ ] Explains complex actions

---

## 14. Brand Evolution

### Phase 1 (Current)
- Establish foundation
- Build core components
- Test with single user (Ali)
- Iterate based on usage

### Phase 2
- Refine based on feedback
- Add custom illustrations
- Develop richer onboarding
- Expand component library

### Phase 3
- Consider custom typeface for headings
- Develop motion language
- Create branded data visualizations
- Build marketing materials

### Future
- Merchandise/swag design
- Conference materials
- Video/multimedia brand
- Community-contributed themes

---

## 15. Credits & Attribution

This brand system stands on the shoulders of:

- **Tailwind CSS** - Utility-first CSS framework (MIT)
- **DaisyUI** - Component library (MIT)
- **Heroicons** - Icon set by Tailwind Labs (MIT)
- **Astro** - Web framework
- **Open source community** - Endless inspiration

---

## Questions & Feedback

This is a living document. As Workspace evolves, so will its brand.

**Feedback welcome:**
- Is anything unclear?
- Are guidelines too restrictive?
- What's missing?
- How can we improve accessibility?

---

**Brand Guardian Principle:**
*"Every pixel reinforces our values. Every interaction builds trust. Every detail matters — but never at the expense of speed or clarity."*

---

**Version:** 1.0
**Last Updated:** 2025-11-03
**Next Review:** After Phase 1 completion
