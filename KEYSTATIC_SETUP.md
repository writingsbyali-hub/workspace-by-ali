# Keystatic Setup Guide

## Quick Start (5 minutes)

Keystatic is configured but needs your GitHub repo information to work properly.

### Step 1: Find Your GitHub Repo Info

After completing the setup wizard at `/setup`, you'll have a forked GitHub repo. Find it:

1. Go to your GitHub profile: `https://github.com/YOUR_USERNAME`
2. Look for a repo named something like `workspace-YOUR_USERNAME`
3. Note the repo owner (your GitHub username) and repo name

Example:
- URL: `https://github.com/alice/workspace-alice`
- Owner: `alice`
- Repo name: `workspace-alice`

### Step 2: Add to Environment Variables

Add these to your `.env.local` file (create it if it doesn't exist):

```bash
# Keystatic GitHub Configuration
PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=your_github_username
PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=your_workspace_repo_name

# Example:
# PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=alice
# PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=workspace-alice
```

### Step 3: Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

### Step 4: Test Keystatic

1. Navigate to `http://localhost:4321/keystatic`
2. You should see the Keystatic CMS interface
3. Try creating a test project
4. Check your GitHub repo - you should see a new commit!

## How It Works

```
┌─────────────┐
│  Keystatic  │  (Content editor at /keystatic)
│     CMS     │
└──────┬──────┘
       │ Uses /api/keystatic/token for GitHub access
       │
       ▼
┌─────────────┐
│   GitHub    │  (Your workspace repo - source of truth)
│     Repo    │  Stores: content/projects/, content/updates/, etc.
└──────┬──────┘
       │ Webhook fires on push
       │
       ▼
┌─────────────┐
│  Supabase   │  (Cache tables for performance)
│    Cache    │  Tables: project_cache, subproject_cache
└─────────────┘
```

## Troubleshooting

### Error: "repo owner/name is not set"

**Solution:** Add the environment variables above to `.env.local`

### Error: "Authentication failed"

**Solution:** Make sure you've completed the GitHub OAuth connection in `/setup`

### Changes not showing in Keystatic

**Solution:**
1. Check your GitHub repo - does the file exist?
2. Clear browser cache
3. Check webhook deliveries in GitHub repo Settings → Webhooks

### Commits going to wrong repo

**Solution:** Double-check your `PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER` and `PUBLIC_KEYSTATIC_GITHUB_REPO_NAME` match your actual GitHub repo

## Production Deployment (Vercel)

When deploying to Vercel:

1. Go to Vercel Project Settings → Environment Variables
2. Add the same variables:
   - `PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER`
   - `PUBLIC_KEYSTATIC_GITHUB_REPO_NAME`
3. Redeploy

## Architecture Notes

**Why GitHub mode (not Cloud)?**
- Keystatic Cloud mode requires a paid subscription
- GitHub mode is free and self-hosted
- You have full control over your content
- Content lives in YOUR GitHub repo (portable!)

**Why environment variables?**
- Self-hosted model = one owner per deployment
- Owner's repo is configured once during setup
- Readers cannot access Keystatic (middleware-protected)
- Simple, secure, and works in dev + production

## Next Steps

1. ✅ Set up environment variables (above)
2. ✅ Test Keystatic at `/keystatic`
3. ✅ Create a test project
4. ✅ Verify commit appears in GitHub
5. ✅ Verify webhook fires (check GitHub repo Settings → Webhooks → Recent Deliveries)
6. ✅ Verify dashboard updates (cache should show new project)

**Ready to create content!** 🎉
