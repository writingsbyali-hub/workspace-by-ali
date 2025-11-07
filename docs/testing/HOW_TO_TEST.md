# How to Test Git APIs

**Created:** November 6, 2025
**Status:** Ready for testing
**Server:** Running on http://127.0.0.1:4323

---

## Quick Start

### 1. Access the Test Dashboard

Visit: **http://127.0.0.1:4323/test-git-apis**

This is an interactive testing dashboard with buttons for each API test.

---

## Testing Steps

### Step 1: Log In ✅

If not already logged in:
1. Click "Go to Login" on the test page
2. Log in with your credentials (GitHub OAuth via Supabase)
3. Return to `/test-git-apis`

---

### Step 2: Connect GitHub Account 🔐

**What it does:** Connects your GitHub account for repository operations

1. Click **"Connect GitHub Account"** button
2. You'll be redirected to GitHub's authorization page
3. GitHub will ask for permissions:
   - `repo` - Full control of private repositories
   - `read:user` - Read user profile data
4. Click "Authorize" on GitHub
5. You'll be redirected back to the test page

**Expected Result:**
- Success message appears
- Test log shows "GitHub OAuth completed successfully"

**To Verify:**
- Check Supabase `user_repos` table:
  ```sql
  SELECT user_id, repo_owner, github_token_encrypted, created_at
  FROM user_repos
  WHERE user_id = '<your-user-id>';
  ```
- Token should be encrypted (looks like: `abc123:def456:ghi789`)

---

### Step 3: Check Fork Status 🔍

**What it does:** Checks if your workspace repository exists

1. Click **"Check Fork Status"** button
2. View results in the card

**Expected Result:**
```json
{
  "success": true,
  "forked": false,  // True if already forked
  "github_connected": true,
  "repo_url": null,  // Or your repo URL if forked
  "repo_name": null,
  "repo_owner": "your-github-username"
}
```

---

### Step 4: Create Workspace Fork 🍴

**What it does:** Forks the template repository to your GitHub account

⚠️ **WARNING:** This creates a real repository! Only do this once.

1. Click **"Create Fork (Irreversible)"** button
2. Confirm the action
3. Wait 10-30 seconds (GitHub API can be slow)

**Expected Result:**
```json
{
  "success": true,
  "repo_url": "https://github.com/your-username/workspace-your-username",
  "repo_name": "workspace-your-username",
  "repo_owner": "your-username",
  "message": "Successfully forked workspace template"
}
```

**To Verify:**
1. Click "View on GitHub" link in the result
2. Check that repo exists with both `main` and `draft` branches
3. Verify content from template is present

**
**
```sql
SELECT * FROM user_repos WHERE user_id = '<your-user-id>';
```
- `is_template_forked` should be `TRUE`
- `repo_url` should contain your repo URL

---

### Step 5: Check Publish Status 📊

**What it does:** Compares draft and main branches

1. Click **"Check Publish Status"** button
2. View branch comparison

**Expected Result (no changes):**
```json
{
  "success": true,
  "has_repo": true,
  "forked": true,
  "has_unpublished_changes": false,
  "commits_ahead": 0,
  "commits_behind": 0,
  "compare_url": "https://github.com/user/repo/compare/main...draft"
}
```

---

### Step 6: Make a Test Commit 📝

**To test publishing, we need changes on the draft branch:**

```bash
# Clone your forked repo
git clone https://github.com/<your-username>/workspace-<your-username>
cd workspace-<your-username>

# Switch to draft branch
git checkout draft

# Make a test change
mkdir -p content/projects/test-project
echo "# Test Project" > content/projects/test-project/README.md

# Commit and push
git add .
git commit -m "test: add test project for publish testing"
git push origin draft
```

**Verify on GitHub:**
- Visit your repo on GitHub
- Switch to `draft` branch
- You should see the new commit
- `main` branch should NOT have this commit yet

---

### Step 7: Check Publish Status (Again) 📊

**Now there should be unpublished changes:**

1. Click **"Check Publish Status"** button again
2. View results

**Expected Result:**
```json
{
  "success": true,
  "has_repo": true,
  "forked": true,
  "has_unpublished_changes": true,
  "commits_ahead": 1,  // One commit ahead
  "commits_behind": 0,
  "compare_url": "https://github.com/user/repo/compare/main...draft"
}
```

Click "View Diff on GitHub" to see the changes.

---

### Step 8: Publish Changes 🚀

**What it does:** Merges draft → main branch

1. Click **"Publish Draft to Main"** button
2. Confirm the action
3. Wait for merge to complete

**Expected Result:**
```json
{
  "success": true,
  "message": "Successfully published draft to main",
  "commit_sha": "abc123...",
  "merge_commit": {
    "sha": "def456...",
    "message": "Publish draft changes to main"
  }
}
```

**To Verify:**
1. Visit your repo on GitHub
2. Switch to `main` branch
3. Your test commit should now be in `main`
4. Check commit history - you should see the merge commit

---

### Step 9: Test Publish Again (No Changes) 🔄

**What it does:** Verify it handles "already up to date" case

1. Click **"Publish Draft to Main"** button again
2. Since there are no new changes, it should detect this

**Expected Result:**
```json
{
  "success": true,
  "message": "Already up to date - no changes to publish"
}
```

---

## Test Results Documentation

### All tests pass? ✅

Update `docs/testing/git-api-test-results.md` with:
1. Mark each test as PASS or FAIL
2. Add screenshots if any issues
3. Note any errors or unexpected behavior
4. Record timestamps

### Found issues? 🐛

Document in test results:
1. **Issue description**
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **Error messages / logs**
5. **Proposed fix**

---

## Common Issues

### Issue: "Authentication required"
**Solution:** Make sure you're logged in. Visit `/login` first.

### Issue: "GitHub token not found"
**Solution:** Complete Step 2 (Connect GitHub Account) first.

### Issue: "Template repository not found"
**Solution:** Verify template repo exists at:
`https://github.com/writingsbyali-hub/workspace-by-ali-template`

### Issue: "Rate limit exceeded"
**Solution:** Wait 60 seconds between fork attempts.

### Issue: "Merge conflict detected"
**Solution:** This is expected if you made conflicting changes. Resolve manually on GitHub.

---

## Advanced: Testing Merge Conflicts

Want to test conflict handling?

```bash
# Create conflicting commits
git checkout main
echo "Main content" > test.txt
git add . && git commit -m "main change"
git push origin main

git checkout draft
echo "Draft content" > test.txt
git add . && git commit -m "draft change"
git push origin draft

# Now try to publish - should detect conflict
```

---

## Monitoring

### Watch Test Log
The test dashboard includes a live log at the bottom showing all API calls and responses in real-time.

### Check Database
```sql
-- Check GitHub connection
SELECT * FROM user_repos;

-- Check if project cache is populated (after creating projects)
SELECT * FROM project_cache;

-- Check stream cache
SELECT * FROM stream_cache;
```

### Check GitHub
- Visit your forked repo
- Check branches: main, draft
- Check commits
- Check Actions (if any)

---

## Next Steps After Testing

Once all tests pass:
- ✅ Mark tasks complete in MASTER_TASKLIST
- ✅ Update test results document
- ✅ Move on to building onboarding UI
- ✅ Fix Keystatic nested collections

---

## Questions?

If you encounter any issues:
1. Check the test log on the dashboard
2. Check browser console (F12)
3. Check server logs (terminal where `npm run dev` is running)
4. Document in test results
5. Ask Claude to help debug!
