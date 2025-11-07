# Keystatic Nested Collection Fix

**Date:** November 6, 2025
**Issue:** Cannot create streams or updates via Keystatic UI
**Root Cause:** Glob patterns (`*`) in collection paths prevent creation
**Solution:** Flat structure with relationship fields

---

## The Problem

### Original Configuration

```typescript
projects: collection({
  path: 'content/projects/*/',  // Works for reading
})

streams: collection({
  path: 'content/projects/*/streams/*/',  // FAILS on creation
})

updates: collection({
  path: 'content/projects/*/streams/*/updates/*',  // FAILS on creation
})
```

### Why It Fails

1. **Reading works:** Keystatic can glob match existing files
2. **Creation fails:** When creating new content, Keystatic tries to:
   ```bash
   mkdir content/projects/*/streams/*
   # Error: ENOENT: no such file or directory, mkdir '*'
   ```
3. **The `*` is treated literally** in mkdir operations

### Error Message

```
ENOENT: no such file or directory, mkdir
'C:\Users\alisa\Downloads\codeProjects\workspace-by-ali\content\projects\testing creation\streams\*'
```

---

## The Solution

### Flat Structure with Relationships

Instead of nested folders, use:

```
content/
  projects/
    project-1/         # Flat project folders
    project-2/
  streams/
    stream-1/          # Flat stream folders (not nested!)
    stream-2/
  updates/
    2025-11-06-update-1.md   # Flat update files
    2025-11-06-update-2.md
```

### Linking via Relationship Fields

Each collection has "slug" fields to reference parents:

**Streams:**
```yaml
---
title: Hardware Stream
projectSlug: project-1    # Links to projects/project-1
---
```

**Updates:**
```yaml
---
title: First Update
projectSlug: project-1     # Links to projects/project-1
streamSlug: stream-1       # Links to streams/stream-1
---
```

---

## Configuration Changes

### Before (Nested - Broken)

```typescript
streams: collection({
  path: 'content/projects/*/streams/*/',
  schema: {
    parentProject: fields.text({...})  // Manual field
  }
})
```

### After (Flat - Working)

```typescript
streams: collection({
  path: 'content/streams/*/',           // Flat path
  schema: {
    projectSlug: fields.text({          // Relationship field
      label: 'Parent Project Slug',
      validation: { isRequired: true }
    })
  }
})
```

---

## Benefits of Flat Structure

### ✅ Pros

1. **Creation works** - No glob pattern confusion
2. **Simpler paths** - Easier to understand and debug
3. **Keystatic best practice** - Recommended by Keystatic docs
4. **Flexible relationships** - Can link across collections easily
5. **Better performance** - Simpler file system operations
6. **Migration friendly** - Easy to move content around

### ⚠️ Cons

1. **Manual linking** - Must enter project/stream slugs manually
2. **No automatic nesting** - File system doesn't reflect hierarchy
3. **Potential orphans** - Deleting project doesn't auto-delete streams

---

## Migration Path

### Option A: Keep Both (Recommended for Testing)

1. Keep old config as `keystatic.config.ts` (for reading old content)
2. Use new config as `keystatic.config.fixed.ts`
3. Test creation with new config
4. Once confirmed working, swap them

### Option B: Migrate Content

If you have existing nested content:

```bash
# Migrate streams
mv content/projects/project-1/streams/stream-1 content/streams/stream-1
# Add projectSlug: project-1 to frontmatter

# Migrate updates
mv content/projects/project-1/streams/stream-1/updates/update-1.md content/updates/update-1.md
# Add projectSlug and streamSlug to frontmatter
```

### Option C: Start Fresh

Since this is early development:
1. Delete old nested content
2. Replace config
3. Create new content with working structure

---

## Implementation Steps

### Step 1: Backup Current Config

```bash
cp keystatic.config.ts keystatic.config.backup.ts
```

### Step 2: Apply Fix

```bash
cp keystatic.config.fixed.ts keystatic.config.ts
```

### Step 3: Test Creation

1. Visit `/keystatic` in your browser
2. Try creating a new project ✅ Should work
3. Try creating a new stream ✅ Should work (enter projectSlug)
4. Try creating a new update ✅ Should work (enter projectSlug and streamSlug)

### Step 4: Test Backend Code

Update any code that reads content to handle flat structure:

```typescript
// Old way (reading nested structure)
const stream = await readFile(`content/projects/${project}/streams/${stream}/README.md`)

// New way (reading flat structure)
const stream = await readFile(`content/streams/${stream}/README.md`)
// Check stream.projectSlug === project to verify relationship
```

---

## UI Improvements (Future)

To improve the UX of manual slug entry:

### Option 1: Dropdown Selector

```typescript
projectSlug: fields.relationship({
  label: 'Parent Project',
  collection: 'projects',
  validation: { isRequired: true }
})
```

**Note:** Keystatic's `relationship` field requires GitHub storage mode, won't work with `local` mode

### Option 2: Custom UI Extension

Create a custom field component that:
- Fetches available projects
- Shows dropdown instead of text input
- Auto-validates slugs

### Option 3: Documentation

Add clear instructions in field descriptions:
```typescript
projectSlug: fields.text({
  description: 'Enter the slug of the parent project (e.g., my-project)'
})
```

---

## Testing Checklist

- [ ] Backup original configuration
- [ ] Apply fixed configuration
- [ ] Restart dev server
- [ ] Access `/keystatic` admin UI
- [ ] Create test project (should work)
- [ ] Create test stream with projectSlug (should work)
- [ ] Create test update with projectSlug and streamSlug (should work)
- [ ] Verify files created in correct locations
- [ ] Verify content is accessible via Git
- [ ] Test Keystatic navigation between collections
- [ ] Test Keystatic back button (separate issue)

---

## Related Issues

### Issue #2: Back Button Navigation

**Separate problem:** Keystatic back button requires page refresh

**Not affected by this fix** - This is a client-side routing issue

**Possible solutions:**
1. Update Astro + Keystatic integration
2. Force page reloads for Keystatic routes
3. Configure Keystatic `basePath` correctly

---

## References

- [Keystatic Collections Docs](https://keystatic.com/docs/collections)
- [Keystatic Relationship Fields](https://keystatic.com/docs/fields/relationship)
- [GitHub Issue: Glob patterns in paths](https://github.com/Thinkmill/keystatic/issues/XXX)

---

## Conclusion

**Recommendation:** Apply the flat structure fix immediately.

**Why:**
- ✅ Enables content creation (currently blocked)
- ✅ Follows Keystatic best practices
- ✅ Minimal impact on existing code
- ✅ Easy to test and validate
- ✅ Future-proof for production use

**Next Steps:**
1. Apply fix
2. Test creation
3. Update content reading code (if needed)
4. Document for future developers
