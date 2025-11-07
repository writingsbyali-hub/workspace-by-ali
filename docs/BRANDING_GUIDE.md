# Workspace by Ali - Branding Guide

**Last Updated:** November 6, 2025
**Purpose:** Define how the brand name appears across the platform

---

## 🎨 Product Name

**Official Name:** "Workspace by Ali"
**Also acceptable:** "Workspace"

**Your IP:** The name "Workspace by Ali" belongs to you and represents the platform/product.

---

## 📛 Naming Conventions

### Application/Codebase
**Name:** `workspace-by-ali`
**Where:**
- GitHub repository name
- Package.json name
- Deployment URL base
- Documentation references

**Example:**
```
Repository: github.com/workspace-by-ali/workspace-by-ali
NPM Name: workspace-by-ali
Deployment: workspace.xbyali.page
```

---

### Template Repository
**Name:** `workspace-by-ali-template`
**Why:** Shows it's YOUR product's template
**Where:** GitHub only

**Example:**
```
Repository: github.com/writingsbyali-hub/workspace-by-ali-template
Description: "Official template for Workspace by Ali"
```

---

### User Repositories
**Pattern:** `workspace-{username}`
**NOT:** `workspace-by-{username}` ❌

**Why:**
- Shorter, cleaner
- Removes "by" which implies YOUR ownership
- User repos are owned BY users, powered BY you

**Examples:**
```
✅ workspace-alisa      (Ali's personal workspace)
✅ workspace-john       (John's personal workspace)
✅ workspace-sarah      (Sarah's personal workspace)

❌ workspace-by-alisa  (Too long, confusing)
❌ alisa-workspace     (OK alternative, but less clear)
```

---

## 💬 UI Text & Messaging

### App Header/Navigation
```
"Workspace by Ali"  ← Your brand, always visible
```

### Dashboard Title (When Logged In)
```
"Ali's Workspace"           ← User's personal space
"Welcome back, Ali"         ← Personalized greeting
"John's Workspace"          ← When John logs in
```

### Repository Description
```
"Personal workspace powered by Workspace by Ali"
```
This makes clear:
- It's the user's personal workspace
- But powered by YOUR platform

### Footer/About
```
"Built with Workspace by Ali"
"A Workspace by Ali project"
"Powered by Workspace by Ali"
```

---

## 🏷️ Examples in Context

### GitHub Repository
```
Repository Name: workspace-alisa
Description: Personal workspace powered by Workspace by Ali
Topics: workspace, research, science, workspace-by-ali
```

### Dashboard Greeting
```html
<h1>Welcome to Your Workspace, Ali!</h1>
<p>Manage your projects, streams, and updates.</p>

<!-- Footer -->
<p>Powered by <a href="/">Workspace by Ali</a></p>
```

### Email Notifications
```
Subject: Your Workspace is Ready!

Hi Ali,

Your personal workspace has been created!

Repository: https://github.com/alisa/workspace-alisa
Dashboard: https://workspace.xbyali.page/dashboard

Start exploring Workspace by Ali today!
```

### Public Profile
```
Ali's Research Workspace
━━━━━━━━━━━━━━━━━━━━━━
3 Active Projects
12 Streams
45 Updates

Built with Workspace by Ali
```

---

## 🎯 Branding Hierarchy

### Level 1: Platform Brand (Highest)
**"Workspace by Ali"**
- Footer
- Login page
- Marketing materials
- Homepage
- About page

### Level 2: User Identity (Medium)
**"Ali's Workspace"**
- Dashboard header
- User profile
- Navigation breadcrumbs
- Project ownership labels

### Level 3: Technical (Lowest)
**"workspace-alisa"**
- Repository names
- API references
- Technical documentation
- URLs/slugs

---

## 🚫 Don't Do This

### ❌ Wrong: Mix User Name with Brand
```
"Workspace by Ali by John"  ← Confusing!
"John's Workspace by Ali"   ← Awkward
```

### ✅ Right: Keep Separate
```
Platform: "Workspace by Ali"    ← Your brand
User: "John's Workspace"        ← User's space
Powered by: Footer/about        ← Attribution
```

---

## 📝 Copy Template

Use this when writing UI text:

```typescript
const BRANDING = {
  // Platform
  productName: "Workspace by Ali",
  shortName: "Workspace",
  tagline: "Your personal research workspace",

  // User-specific (dynamic)
  userWorkspace: (username: string) => `${username}'s Workspace`,
  greeting: (username: string) => `Welcome back, ${username}!`,

  // Repository (dynamic)
  repoName: (username: string) => `workspace-${username}`,
  repoDescription: "Personal workspace powered by Workspace by Ali",

  // Attribution
  poweredBy: "Powered by Workspace by Ali",
  builtWith: "Built with Workspace by Ali",
};
```

---

## 🎨 Visual Branding

### Logo Placement
```
┌─────────────────────────────────────┐
│ [Logo] Workspace by Ali    [User▼] │  ← Brand in header
├─────────────────────────────────────┤
│                                     │
│  Ali's Workspace                    │  ← User context
│  ─────────────                      │
│                                     │
│  [Projects] [Streams] [Updates]     │
│                                     │
└─────────────────────────────────────┘
```

### Color Association
- **Green theme** = "Workspace by Ali" brand colors
- **User accent colors** = Optional personalization (future)

---

## 🔗 URLs & Routing

### Main Site
```
https://workspace.xbyali.page/          ← Homepage (brand)
https://workspace.xbyali.page/about     ← About "Workspace by Ali"
https://workspace.xbyali.page/login     ← Login to platform
```

### User Dashboard
```
https://workspace.xbyali.page/dashboard              ← Ali's dashboard
https://workspace.xbyali.page/@alisa                 ← Ali's public profile (future)
https://workspace.xbyali.page/@alisa/projects        ← Ali's projects
```

### User Repository
```
https://github.com/alisa/workspace-alisa             ← User's repo
https://github.com/alisa/workspace-alisa/tree/draft  ← Draft branch
```

---

## 📊 Comparison

| Context | Shows | Example |
|---------|-------|---------|
| **Platform** | Your brand | "Workspace by Ali" |
| **User Space** | User's name | "Ali's Workspace" |
| **Repository** | Technical name | `workspace-alisa` |
| **Attribution** | Credit | "Powered by Workspace by Ali" |

---

## ✅ Summary

**Simple rule:**
- **Platform name** = "Workspace by Ali" (your IP)
- **User repos** = `workspace-{username}` (their data)
- **User UI** = "{Username}'s Workspace" (personalized)
- **Footer** = "Powered by Workspace by Ali" (attribution)

**Your brand stays prominent, users get personal spaces!** 🎉

---

## 🎯 Implementation Checklist

- [x] Fork endpoint uses `workspace-{username}` format
- [x] Repo description mentions "Workspace by Ali"
- [ ] Dashboard shows "Ali's Workspace" (update in next session)
- [ ] Footer shows "Powered by Workspace by Ali"
- [ ] Login page shows "Workspace by Ali" branding
- [ ] About page explains the platform
- [ ] Public profiles show user name prominently

---

**This is YOUR platform. Users are guests with their own rooms!** 🏠
