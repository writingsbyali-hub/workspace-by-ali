# Tasks → Updates Workflow

## Overview

The Tasks collection provides a lightweight way to quickly capture observations, experiments, and to-dos during research. When tasks are completed, they can be automatically converted into full Update entries with rich content.

## Workflow

### 1. **Quick Capture** - Create Tasks
Navigate to `/keystatic` → **Tasks** → Create New

**Use Tasks for:**
- Quick observations during experiments
- Data points to document later
- Experimental procedures to track
- Reminders for follow-up work

**Task Fields:**
- **Title** *(required)* - Brief description
- **Related Project** *(required)* - Links to parent project
- **Related Sub-Project** *(optional)* - Links to sub-project
- **Priority** - 🔴 High / 🟡 Medium / 🟢 Low
- **Status**:
  - 📋 To Do
  - ⏳ In Progress
  - ✅ Completed
  - 🔄 Ready to Convert ← **Mark when ready to publish**
- **Quick Notes** - Multiline observations
- **Tags** - For categorization

### 2. **Mark for Conversion**
When a task is complete and ready to become a formal update:

1. Open the task in Keystatic
2. Change **Status** to `🔄 Ready to Convert`
3. Save the task

### 3. **Run Conversion Script**
Convert all ready tasks to updates:

```bash
npm run convert:tasks
```

**What the script does:**
1. Finds all tasks with status "Ready to Convert"
2. Creates a new Update entry for each task:
   - **Title** - Same as task title
   - **Date** - Today's date
   - **Type** - Milestone (tasks that complete become milestones)
   - **Project/Sub-Project** - Inherited from task
   - **Tags** - Inherited from task
   - **Content** - Generated from task notes
3. Archives the original task to `content/archived-tasks/`

### 4. **Review & Enhance**
After conversion:

1. Navigate to `/keystatic` → **Updates**
2. Find your newly created update (dated today)
3. Enhance the content:
   - Add experiment details
   - Upload images/charts
   - Link to related documentation
   - Expand on observations

## Example Workflow

### Day 1: Quick Capture
```
Title: Observed plasma instability at 500V
Project: Plasma Characterization
Priority: High
Status: In Progress
Notes: Seeing unexpected oscillations. Need to investigate.
```

### Day 3: Mark Complete
```
Status: ✅ Completed → 🔄 Ready to Convert
Notes: (Updated) Oscillations caused by capacitor mismatch.
       Replaced C3 with 100nF. Stable operation achieved.
```

### Day 3: Run Conversion
```bash
$ npm run convert:tasks

🔄 Task to Update Conversion Tool

📋 Step 1: Finding tasks ready for conversion...
✅ Found 1 task(s) ready for conversion:

   📝 Observed plasma instability at 500V

🔄 Step 2: Converting tasks to updates...

   ✅ Created update: 2025-11-09-observed-plasma-instability-at-500v
   📦 Archived task: observed-plasma-instability-at-500v

✨ Conversion complete!
```

### Day 3: Enhance Update
Navigate to Keystatic, find the new update, and add:
- Photos of the oscilloscope trace
- Circuit diagram
- Links to capacitor datasheet
- Next steps for testing

## Benefits

✅ **Quick Capture** - No overhead during active research
✅ **Automatic Organization** - Links maintain project hierarchy
✅ **Rich Content Later** - Convert to full updates when ready
✅ **Audit Trail** - Archived tasks preserved for reference
✅ **Flexible Workflow** - Mark tasks for conversion at any time

## Tips

- Use **High Priority** for critical observations
- Add **Tags** early - they transfer to updates automatically
- Mark tasks as **Ready to Convert** in batches
- Run conversion script weekly or when publishing research
- Review archived tasks for patterns and insights

## Archived Tasks

Archived tasks are stored in `content/archived-tasks/` and can be:
- Reviewed for historical context
- Restored if needed (rename folder back to `content/tasks/`)
- Deleted when no longer needed

## Advanced: Scheduled Conversion

To automatically convert tasks daily, add a GitHub Action:

```yaml
# .github/workflows/convert-tasks.yml
name: Convert Tasks to Updates
on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
jobs:
  convert:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run convert:tasks
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "🔄 Auto-convert tasks to updates"
```

This automatically publishes completed work without manual intervention.
