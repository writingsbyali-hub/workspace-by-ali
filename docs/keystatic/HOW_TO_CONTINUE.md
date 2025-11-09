# How to Continue Keystatic Enhancement in New Sessions

**Purpose:** Quick guide for starting new sessions and continuing where we left off

---

## 📋 Quick Start Prompt Template

Copy and paste this at the start of a new session:

```
Hi! I'm continuing work on Keystatic CMS enhancements for workspace-by-ali.

Please read the session handover document:
docs/keystatic/SESSION_HANDOVER.md

Current status: Phase 1 complete, ready for [Phase 2/Phase 3/Phase 4]

Task: [Describe what you want to work on]
```

---

## 📁 Essential Files to Reference

### Always Include (Session Context):
1. **[docs/keystatic/SESSION_HANDOVER.md](./SESSION_HANDOVER.md)** ⭐ **START HERE**
   - Complete session context
   - Progress tracking
   - What's done, what's pending
   - Known issues and fixes

### For Implementation Work:
2. **[docs/keystatic/IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)**
   - Detailed task breakdown for all 4 phases
   - Time estimates
   - Testing checklists

3. **[keystatic.config.ts](../../keystatic.config.ts)**
   - Current Keystatic configuration
   - What we're modifying

### For Understanding Context:
4. **[docs/keystatic/PHASE_1_CHANGES.md](./PHASE_1_CHANGES.md)**
   - What was completed in Phase 1
   - Breaking changes
   - Testing instructions

5. **[docs/keystatic/research/UX_RESEARCH_REPORT.md](./research/UX_RESEARCH_REPORT.md)**
   - Why we're making these changes
   - Pain points identified
   - User journey analysis

---

## 🎯 Example Prompts for Different Scenarios

### Scenario 1: Continue to Phase 2 (UX Polish)

```
Hi! I'm continuing Keystatic CMS enhancements.

Please read: docs/keystatic/SESSION_HANDOVER.md

Phase 1 is complete (relationship dropdowns, consolidated fields).
Now I want to start Phase 2: UX Polish (13 hours estimated)

Tasks:
- Implement field groups with accordions
- Add contextual help & tooltips
- Enhanced empty states

Let's start with field group accordions. Plan mode please.
```

---

### Scenario 2: Just Testing Phase 1

```
Hi! I need to test the Keystatic Phase 1 changes.

Please read: docs/keystatic/PHASE_1_CHANGES.md (testing section)

I've run the dev server and navigated to /keystatic.
I want to verify:
1. Relationship dropdowns work
2. Visibility fields are correct
3. Validation works

Guide me through testing step by step.
```

---

### Scenario 3: Fix an Issue

```
Hi! I found an issue with the Keystatic changes.

Please read: docs/keystatic/SESSION_HANDOVER.md

Issue: [Describe the problem]

Error message: [Paste error if any]

What's the fix?
```

---

### Scenario 4: Deploy to Production

```
Hi! Phase 1 testing is complete, ready to deploy.

Please read: docs/keystatic/SESSION_HANDOVER.md

I want to:
1. Commit Phase 1 changes
2. Deploy to Vercel
3. Test in production

Guide me through the deployment process.
```

---

### Scenario 5: Skip to Specific Task

```
Hi! I want to implement [specific feature] from the plan.

Please read:
- docs/keystatic/SESSION_HANDOVER.md
- docs/keystatic/IMPLEMENTATION_PLAN.md (find the task)

Task: [e.g., "Phase 3, Task 3.1: Tree View for Projects Collection"]

Let's implement this specific feature. Plan mode please.
```

---

## 📊 Progress Tracking

### Check Current Status

Look at **[SESSION_HANDOVER.md](./SESSION_HANDOVER.md)** → "Current Progress" section

### Update After Completing Work

Tell Claude:
```
Update docs/keystatic/SESSION_HANDOVER.md:
- Mark [task name] as complete
- Update "Ready for Testing" or "Pending" sections
```

---

## 🔍 Finding Specific Information

### "What were the UX issues again?"
→ Read: `docs/keystatic/research/UX_RESEARCH_REPORT.md` (Section 1: Key Findings)

### "What's the design for the tree view?"
→ Read: `docs/keystatic/research/UI_DESIGN_SPECIFICATIONS.md` (Section 1.1)

### "How long will Phase 2 take?"
→ Read: `docs/keystatic/IMPLEMENTATION_PLAN.md` (Phase 2 section)

### "What did we change in Phase 1?"
→ Read: `docs/keystatic/PHASE_1_CHANGES.md` (Summary section)

### "How do I test the changes?"
→ Read: `docs/keystatic/PHASE_1_CHANGES.md` (Testing Checklist section)

---

## 🚦 Session Flow Recommendation

### 1. Start Session
```
Read: docs/keystatic/SESSION_HANDOVER.md
Status: What's complete, what's next
```

### 2. Plan Work
```
Read: docs/keystatic/IMPLEMENTATION_PLAN.md
Choose: Which phase/task to work on
```

### 3. Implement
```
Modify: keystatic.config.ts or create new files
Test: Run dev server, verify changes
```

### 4. Document
```
Update: SESSION_HANDOVER.md with progress
Create: New PHASE_X_CHANGES.md if needed
```

### 5. End Session
```
Commit: git commit with clear message
Update: Progress in SESSION_HANDOVER.md
```

---

## 📝 What to Include in Your Prompt

### Minimum (Quick Tasks):
- "Read: docs/keystatic/SESSION_HANDOVER.md"
- What you want to do

### Recommended (Implementation):
- Session handover file
- Implementation plan file
- Current task description
- Whether you want plan mode first

### Maximum (Complex Tasks):
- Session handover
- Implementation plan
- Relevant research docs
- Current issue/error details
- What you've already tried

---

## 🎓 Tips for Efficient Sessions

### ✅ DO:
- Start with SESSION_HANDOVER.md for context
- Use plan mode for new phases
- Reference specific phase/task numbers
- Update documentation after completing work
- Test before moving to next phase

### ❌ DON'T:
- Start without reading SESSION_HANDOVER.md
- Jump phases without testing previous work
- Forget to update progress tracking
- Skip the testing checklists

---

## 🔗 Quick Links

**Documentation Map:**
```
docs/keystatic/
├── HOW_TO_CONTINUE.md ← YOU ARE HERE
├── SESSION_HANDOVER.md ← START HERE EVERY SESSION ⭐
├── IMPLEMENTATION_PLAN.md ← Full roadmap
├── PHASE_1_CHANGES.md ← What's done
├── CURRENT_STATE_ANALYSIS.md ← Technical deep-dive
└── research/
    ├── UX_RESEARCH_REPORT.md ← Why we're doing this
    └── UI_DESIGN_SPECIFICATIONS.md ← Design specs
```

**Main Files:**
- `keystatic.config.ts` - What we're modifying
- `astro.config.mjs` - Astro setup (mostly done)
- `src/styles/global.css` - Design system

---

## 📅 Phase Roadmap Quick Reference

**✅ Phase 1: Critical Fixes (COMPLETE - 7 hours)**
- Relationship dropdowns
- Consolidated visibility fields
- Helpful descriptions

**⏳ Phase 2: UX Polish (PENDING - 13 hours)**
- Field group accordions
- Contextual help & tooltips
- Enhanced empty states

**⏳ Phase 3: Visual Hierarchy (PENDING - 22 hours)**
- Tree view for projects
- Quick action buttons
- Status badges & icons

**⏳ Phase 4: Advanced Features (OPTIONAL - 45 hours)**
- Global search (Cmd+K)
- Project templates
- Onboarding tour
- Content migration tool

---

## 💡 Example: Perfect Session Start

```
Hi! Continuing Keystatic CMS enhancements for workspace-by-ali.

Context files:
1. docs/keystatic/SESSION_HANDOVER.md (main context)
2. docs/keystatic/IMPLEMENTATION_PLAN.md (roadmap)

Status: Phase 1 complete and tested locally

Next: Phase 2, Task 2.1 - Implement field groups with accordions

Approach:
- Create public/keystatic-enhancements.js
- Group fields into collapsible sections
- Test in /keystatic

Please start with plan mode to review the implementation approach.
```

---

**Created:** November 9, 2025
**Purpose:** Session continuity and efficient handover
**Audience:** Future Claude sessions (and you!)
