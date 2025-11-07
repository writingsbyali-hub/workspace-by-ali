# Next Session Quick-Start Prompts

**Last Updated:** November 6, 2025
**Purpose:** Copy-paste these prompts to quickly resume work in next session

---

## 🚀 Priority Tasks (Copy-Paste These)

### Task 1: Test GitHub OAuth Flow (~30 min)

```
I need to test the GitHub OAuth flow we built last session.

Context:
- We created /api/auth/github-connect and /api/auth/github-callback endpoints
- GitHub OAuth app credentials are configured in .env
- Need to verify the complete flow works

Steps needed:
1. Start dev server
2. Test visiting /api/auth/github-connect
3. Verify GitHub authorization screen appears
4. Check callback stores encrypted token in user_repos table
5. Verify token can be decrypted

Files to check:
- src/pages/api/auth/github-connect.ts
- src/pages/api/auth/github-callback.ts
- src/lib/tokenEncryption.ts

If errors occur, help debug and fix them.
```

---

### Task 2: Test Repository Forking (~30 min)

```
Test the repository forking endpoint we created.

Context:
- Built /api/repo/fork endpoint last session
- Should create workspace-by-{username} repo from template
- Template is at: https://github.com/writingsbyali-hub/workspace-by-ali-template

Test steps:
1. Ensure user has GitHub token stored (from Task 1)
2. Call POST /api/repo/fork
3. Verify new repo created on GitHub with correct name
4. Check that main and draft branches exist
5. Verify user_repos table updated with repo info

Create a test script or curl command to make this easy to test.

If fork fails, help debug issues with:
- Token decryption
- Octokit API calls
- GitHub permissions
```

---

### Task 3: Fix Keystatic Nested Collections (~1-2 hours)

```
Fix the Keystatic nested collection creation issue.

Problem:
- Cannot create streams or updates via Keystatic UI
- Error: ENOENT: no such file or directory, mkdir 'content/projects/*/streams/*'
- Glob patterns (*) work for reading but not creating

Research needed:
1. Check Keystatic docs for nested collection best practices
2. Options to explore:
   - Use relationship fields instead of path-based nesting
   - Create custom forms for nested content
   - Simplify to flat structure temporarily
3. Test solution with actual content creation

Files to modify:
- keystatic.config.ts

Goal: Make it possible to create streams and updates through Keystatic UI.

Reference: docs/architecture/05_Keystatic_Integration.md
```

---

### Task 4: Create Onboarding Flow UI (~1-2 hours)

```
Build an onboarding flow for new users.

Flow:
1. User logs in → Check if GitHub connected
   - If no: Show "Connect GitHub" button → /api/auth/github-connect
2. After GitHub connected → Check if template forked
   - If no: Show "Create Workspace" button → POST /api/repo/fork
3. After fork → Show success with link to new repo
4. Redirect to Keystatic editor

Create:
- src/pages/onboarding.astro (new file)
- Check GitHub connection status via GET /api/repo/fork
- Display appropriate step based on status
- Use existing UI components from src/components/ui/

Make it user-friendly with:
- Clear step indicators (Step 1 of 2, etc.)
- Loading states during API calls
- Success/error messages
- Links to GitHub repo after creation
```

---

### Task 5: Build Publish API (~1 hour)

```
Create an API endpoint to publish draft changes to main branch.

Endpoint: /api/publish
Method: POST

Flow:
1. Get user's GitHub token from user_repos
2. Decrypt token
3. Use Octokit to merge draft → main
4. Handle merge conflicts gracefully
5. Return success/error response

Handle these cases:
- Fast-forward merge (no conflicts)
- Merge conflicts → return conflict info
- No changes to publish → inform user

Files to create:
- src/pages/api/publish.ts

Reference implementation pattern from:
- src/pages/api/repo/fork.ts (similar Octokit usage)

Also create a simple UI button component:
- src/components/ui/PublishButton.tsx
- Shows draft/published status
- Calls /api/publish on click
- Displays success/error messages
```

---

### Task 6: Create Cache Sync Webhook (~2 hours)

```
Build webhook endpoint to sync GitHub changes to Supabase cache.

Context:
- When user commits to GitHub, webhook fires
- Need to parse changes and update project_cache/stream_cache tables

Create:
- src/pages/api/cache/sync.ts

Webhook should:
1. Verify webhook signature (GitHub secret)
2. Parse payload for changed files
3. For each changed file in content/:
   - If project README.md → update project_cache
   - If stream README.md → update stream_cache
   - If file deleted → remove from cache
4. Parse frontmatter from files
5. Update database tables

Files changed detection:
- payload.commits[].added
- payload.commits[].modified
- payload.commits[].removed

Use gray-matter package to parse frontmatter.

Reference:
- docs/architecture/06_Supabase_Caching_Strategy.md
- Webhook payload example in docs/architecture/05_Keystatic_Integration.md

Test with manual webhook payload first before setting up real webhook.
```

---

## 🎯 After Completing These Tasks

Once all above tasks are done, we'll have:
- ✅ Working GitHub OAuth flow
- ✅ Repository forking mechanism
- ✅ Keystatic content creation working
- ✅ Onboarding flow for new users
- ✅ Publish workflow (draft → main)
- ✅ Automatic cache sync

**Next Phase:** Safety gating system and polish

---

## 📋 Environment Setup Reminder

Before starting, ensure these are configured in .env:

```bash
# GitHub OAuth (REQUIRED)
PUBLIC_GITHUB_CLIENT_ID=Ov23...
GITHUB_CLIENT_SECRET=...

# Token Encryption (REQUIRED)
# Generate with: openssl rand -base64 32
GITHUB_TOKEN_ENCRYPTION_KEY=...

# Supabase (should already be set)
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```

If missing, refer to .env.example for full list.

---

## 🐛 Known Issues to Be Aware Of

1. **Keystatic nested collections** - Main blocker for content creation
2. **Keystatic back button** - Navigation requires refresh
3. **GitHub OAuth not tested yet** - May have bugs in callback flow
4. **Token encryption key** - Must be set before testing

All documented in: docs/MASTER_TASKLIST.md (Known Issues section)

---

## 📚 Key Files Reference

**API Endpoints:**
- `src/pages/api/auth/github-connect.ts` - GitHub OAuth
- `src/pages/api/auth/github-callback.ts` - OAuth callback
- `src/pages/api/repo/fork.ts` - Fork template

**Utilities:**
- `src/lib/tokenEncryption.ts` - Token encryption/decryption
- `src/lib/supabaseServer.ts` - Supabase client
- `src/lib/apiUtils.ts` - API helpers

**Config:**
- `keystatic.config.ts` - Keystatic collections
- `.env.example` - Environment variables template

**Database:**
- `supabase-migration-git-first.sql` - Migration (already run)

**Docs:**
- `docs/SESSION_HANDOFF_Nov_6_2025_Git_APIs.md` - Last session notes
- `docs/architecture/05_Keystatic_Integration.md` - Keystatic guide
- `docs/implementation/01_Phase1_Git_First_MVP.md` - Full roadmap

---

## 💡 Pro Tips for Next Session

1. **Start with testing** - Verify OAuth and fork work before building new features
2. **One task at a time** - Complete and test each before moving to next
3. **Check database** - Use Supabase dashboard to verify data is being stored
4. **Git commits** - Commit after each completed task
5. **Update session handoff** - Document any issues or decisions made

---

## 🚨 Emergency Fixes (If Something Breaks)

### If GitHub OAuth fails:
```
Check these in order:
1. Is GITHUB_CLIENT_ID in .env?
2. Is GITHUB_CLIENT_SECRET in .env?
3. Are callback URLs correct in GitHub OAuth app settings?
4. Check browser console for errors
5. Check server logs for API errors
```

### If token encryption fails:
```
1. Is GITHUB_TOKEN_ENCRYPTION_KEY set in .env?
2. Run: openssl rand -base64 32 to generate new key
3. Test with: import { validateEncryption } from './src/lib/tokenEncryption'
```

### If Keystatic won't load:
```
1. Check if React integration is working
2. Verify keystatic() in astro.config.mjs
3. Try clearing browser cache
4. Check for TypeScript errors in keystatic.config.ts
```

---

**Ready to start? Copy the task prompts above and let's build!** 🚀
