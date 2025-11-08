# Testing Guide: Nov 6 Refactoring

**Purpose:** Step-by-step guide for testing the November 6, 2025 architecture refactoring
**Created:** November 7, 2025
**Status:** Active testing guide
**Estimated Time:** 60-90 minutes

---

## 📋 Overview

This guide helps you test the self-hosted owner/reader architecture implemented on November 6, 2025. The refactoring includes:

1. **Database Changes:** 4 new tables, updated RLS policies, helper functions, triggers
2. **Middleware Changes:** Role detection, owner-only route protection, setup flow
3. **Environment Changes:** Self-hosted configuration template

**Critical:** This refactoring has NOT been tested yet. Follow this guide carefully and document all results.

---

## 🎯 Success Criteria

By the end of this testing session, you should have:

- [ ] ✅ Migration executed successfully in Supabase
- [ ] ✅ 4 new tables exist with correct schemas
- [ ] ✅ RLS policies active and correct
- [ ] ✅ Helper functions working
- [ ] ✅ Triggers installed and firing
- [ ] ✅ Dev server starts without errors
- [ ] ✅ Middleware detects owner role correctly
- [ ] ✅ Owner-only routes protected
- [ ] ✅ Reader routes accessible (if applicable)
- [ ] ✅ All issues documented

---

## Part 1: Pre-Migration Checklist

### 1.1 Backup Current State

**Why:** Safety net in case migration fails or breaks something

**Steps:**
1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor**
4. Note current table count:
   ```sql
   SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'public';
   ```
5. Export schema (optional but recommended):
   - Go to **Settings** → **Database**
   - Connection string is available if you need to pg_dump

**Current State (Before Migration):**
- [ ] Current table count: ____
- [ ] Schema exported: Yes / No
- [ ] Screenshot taken: Yes / No

---

### 1.2 Review Migration File

**Location:** `supabase/migrations/20241106000000_self_hosted_owner_reader.sql`

**What it will do:**
- Create 4 new tables
- Update RLS policies on existing tables
- Create 5 helper functions
- Create 2 triggers
- Auto-assign first user as owner

**Read through the migration file to understand what changes will be made.**

- [ ] Migration file reviewed
- [ ] Understand what tables will be created
- [ ] Understand policy changes

---

## Part 2: Run Database Migration

### 2.1 Execute Migration

**Steps:**

1. **Open Supabase SQL Editor**
   - Navigate to: SQL Editor in your Supabase dashboard
   - Click "New Query"

2. **Copy Migration SQL**
   - Open: `supabase/migrations/20241106000000_self_hosted_owner_reader.sql`
   - Copy the ENTIRE file contents

3. **Paste and Run**
   - Paste into SQL Editor
   - Click "Run" or press Ctrl+Enter
   - **Watch for errors in the output panel**

4. **Check for Completion**
   - Look for success messages
   - Note any errors or warnings

**Execution Notes:**
```
Date/Time: _______________
Duration: _______________
Errors: Yes / No
```

**If errors occur:**
- Copy the full error message
- Check "Common Errors" section below
- Do NOT proceed until resolved

---

### 2.2 Verify Tables Created

**Run this query to check new tables exist:**

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'workspace_settings',
  'user_roles',
  'reader_acknowledgments',
  'reader_suggestions'
)
ORDER BY table_name;
```

**Expected Result:** 4 rows returned

**Actual Result:**
- [ ] workspace_settings: Exists / Missing
- [ ] user_roles: Exists / Missing
- [ ] reader_acknowledgments: Exists / Missing
- [ ] reader_suggestions: Exists / Missing

---

### 2.3 Verify Table Schemas

**Check workspace_settings:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'workspace_settings'
ORDER BY ordinal_position;
```

**Expected columns:**
- id (uuid)
- owner_id (uuid)
- workspace_name (text)
- workspace_description (text)
- default_license (text)
- allow_readers (boolean)
- allow_reader_suggestions (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)

**Verification:**
- [ ] All columns present
- [ ] Data types correct

---

**Check user_roles:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_roles'
ORDER BY ordinal_position;
```

**Expected columns:**
- id (uuid)
- user_id (uuid)
- workspace_owner_id (uuid)
- role (text) - check constraint: 'owner' or 'reader'
- is_expert (boolean)
- created_at (timestamptz)

**Verification:**
- [ ] All columns present
- [ ] Data types correct

---

**Check reader_acknowledgments:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'reader_acknowledgments'
ORDER BY ordinal_position;
```

**Expected columns:**
- id (uuid)
- user_id (uuid)
- workspace_owner_id (uuid)
- acknowledgment_type (text)
- acknowledgment_code (text)
- project_slug (text, nullable)
- subproject_slug (text, nullable)
- acknowledged_at (timestamptz)

**Verification:**
- [ ] All columns present
- [ ] Data types correct

---

**Check reader_suggestions:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'reader_suggestions'
ORDER BY ordinal_position;
```

**Expected columns:**
- id (uuid)
- user_id (uuid)
- workspace_owner_id (uuid)
- project_slug (text, nullable)
- subproject_slug (text, nullable)
- content (text)
- status (text) - check constraint: 'pending', 'approved', 'rejected'
- is_expert (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)

**Verification:**
- [ ] All columns present
- [ ] Data types correct

---

### 2.4 Verify RLS Policies

**Check RLS is enabled on new tables:**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'workspace_settings',
  'user_roles',
  'reader_acknowledgments',
  'reader_suggestions'
);
```

**Expected:** All 4 tables should have `rowsecurity = true`

**Verification:**
- [ ] workspace_settings: RLS enabled
- [ ] user_roles: RLS enabled
- [ ] reader_acknowledgments: RLS enabled
- [ ] reader_suggestions: RLS enabled

---

**Check policies exist:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN (
  'workspace_settings',
  'user_roles',
  'reader_acknowledgments',
  'reader_suggestions'
)
ORDER BY tablename, policyname;
```

**Expected policies per table:**

**workspace_settings:**
- "Owners can view own workspace settings" (SELECT)
- "Owners can update own workspace settings" (UPDATE)

**user_roles:**
- "Users can view own roles" (SELECT)
- "Workspace owners can view all roles in workspace" (SELECT)
- "Workspace owners can manage roles" (INSERT, UPDATE, DELETE)

**reader_acknowledgments:**
- "Users can view own acknowledgments" (SELECT)
- "Users can create own acknowledgments" (INSERT)
- "Workspace owners can view all acknowledgments" (SELECT)

**reader_suggestions:**
- "Users can view own suggestions" (SELECT)
- "Approved suggestions are public" (SELECT)
- "Users can create suggestions" (INSERT)
- "Workspace owners can manage suggestions" (SELECT, UPDATE)

**Verification:**
- [ ] All expected policies present
- [ ] Policy commands correct (SELECT, INSERT, UPDATE, DELETE)

---

### 2.5 Verify Helper Functions

**Check functions exist:**
```sql
SELECT routine_name, routine_type, data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'is_workspace_owner',
  'has_acknowledged_safety',
  'has_acknowledged_license',
  'auto_assign_owner',
  'update_workspace_settings_updated_at'
)
ORDER BY routine_name;
```

**Expected:** 5 functions

**Verification:**
- [ ] is_workspace_owner: Exists
- [ ] has_acknowledged_safety: Exists
- [ ] has_acknowledged_license: Exists
- [ ] auto_assign_owner: Exists
- [ ] update_workspace_settings_updated_at: Exists

---

**Test is_workspace_owner function:**
```sql
-- This should return false if you're not logged in, or check for your user
SELECT is_workspace_owner(auth.uid());
```

**Expected:** Returns boolean (false if no owner assigned yet)

**Verification:**
- [ ] Function executes without error
- [ ] Returns boolean value

---

### 2.6 Verify Triggers

**Check triggers exist:**
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN (
  'trigger_auto_assign_owner',
  'update_workspace_settings_updated_at'
)
ORDER BY trigger_name;
```

**Expected triggers:**
- trigger_auto_assign_owner (AFTER INSERT on auth.users)
- update_workspace_settings_updated_at (BEFORE UPDATE on workspace_settings)

**Verification:**
- [ ] trigger_auto_assign_owner: Exists
- [ ] update_workspace_settings_updated_at: Exists

---

## Part 3: Test Middleware

### 3.1 Start Development Server

**Steps:**

1. **Open Terminal** in project root directory

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **Watch for errors:**
   - Compilation errors
   - TypeScript errors
   - Middleware errors
   - Module import errors

**Server Start:**
```
Date/Time: _______________
Port: _______________
Errors: Yes / No
```

**If errors occur:**
- Copy full error message
- Check error type (TypeScript, runtime, etc.)
- See "Common Errors" section

**Success indicators:**
- [ ] Server starts without errors
- [ ] No TypeScript compilation errors
- [ ] Middleware file loads successfully
- [ ] Can access http://localhost:4321 (or your port)

---

### 3.2 Test Authentication

**Steps:**

1. **Navigate to login page:**
   - Open: http://localhost:4321/login

2. **Sign in with GitHub:**
   - Use your existing account
   - Complete OAuth flow

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for middleware logs
   - Look for error messages

**Login Test:**
```
Login successful: Yes / No
Redirected to dashboard: Yes / No
Console errors: Yes / No
```

**Verification:**
- [ ] Login completes successfully
- [ ] No console errors
- [ ] Redirected to appropriate page

---

### 3.3 Test Owner Role Detection

**What to check:**
- Middleware should detect you as owner (first user)
- Your role should be assigned automatically via trigger

**Verification steps:**

1. **Check database for role assignment:**
   ```sql
   SELECT * FROM user_roles
   WHERE user_id = auth.uid();
   ```

   **Expected:** One row with role = 'owner'

2. **Check middleware locals in browser:**
   - Open DevTools → Network tab
   - Make a request to any protected page
   - Check response headers or inspect page source for role indicators

3. **Check console for middleware logs:**
   - Look for any log messages from middleware
   - Check for role detection messages (if logging enabled)

**Role Detection:**
```
Role assigned in database: Yes / No
Role: owner / reader / null
Middleware detected role: Yes / No
```

**Verification:**
- [ ] user_roles table has entry
- [ ] Role is 'owner'
- [ ] No middleware errors
- [ ] Can access dashboard

---

### 3.4 Test Owner-Only Routes

**Test accessing owner-only routes:**

1. **/settings** (Should work - owner only)
   - Navigate to: http://localhost:4321/settings
   - Expected: Page loads successfully
   - Actual: _______________

2. **/keystatic** (Should work - owner only)
   - Navigate to: http://localhost:4321/keystatic
   - Expected: Keystatic admin loads
   - Actual: _______________

3. **API routes** (Should work - owner only)
   - Test: http://localhost:4321/api/repo/fork (GET)
   - Expected: JSON response (status or error)
   - Actual: _______________

**Owner Route Access:**
- [ ] /settings: Accessible
- [ ] /keystatic: Accessible
- [ ] /api/repo/fork: Returns response (not 403)
- [ ] /api/publish: Returns response (not 403)

**If any route returns 403 Forbidden:**
- Check middleware logic in [src/middleware.ts](../../src/middleware.ts)
- Verify role detection is working
- Check RLS policies in database

---

### 3.5 Test Reader Routes (Future)

**Note:** Reader signup flow not built yet, so this test may not apply.

**If you want to test reader restrictions:**

1. **Manually create reader role:**
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO user_roles (user_id, workspace_owner_id, role)
   VALUES (
     'test-reader-uuid',  -- Replace with test user UUID
     auth.uid(),          -- Current owner's UUID
     'reader'
   );
   ```

2. **Sign in as test reader** (if you have test account)

3. **Try to access owner-only routes:**
   - /settings → Should get 403 Forbidden
   - /keystatic → Should get 403 Forbidden

**Reader Restrictions:**
- [ ] Reader cannot access /settings
- [ ] Reader cannot access /keystatic
- [ ] Reader can access /projects (public)

---

## Part 4: Common Errors & Solutions

### Error: "relation 'workspace_settings' already exists"

**Cause:** Migration was run before, or table exists from previous attempt

**Solution:**
```sql
-- Drop tables and try again
DROP TABLE IF EXISTS reader_suggestions CASCADE;
DROP TABLE IF EXISTS reader_acknowledgments CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS workspace_settings CASCADE;

-- Then run migration again
```

---

### Error: "function is_workspace_owner already exists"

**Cause:** Functions created in previous migration attempt

**Solution:**
```sql
-- Drop functions and try again
DROP FUNCTION IF EXISTS is_workspace_owner(uuid) CASCADE;
DROP FUNCTION IF EXISTS has_acknowledged_safety(uuid, uuid, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS has_acknowledged_license(uuid, uuid, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS auto_assign_owner() CASCADE;
DROP FUNCTION IF EXISTS update_workspace_settings_updated_at() CASCADE;

-- Then run migration again
```

---

### Error: "trigger already exists"

**Cause:** Triggers created in previous migration attempt

**Solution:**
```sql
-- Drop triggers
DROP TRIGGER IF EXISTS trigger_auto_assign_owner ON auth.users;
DROP TRIGGER IF EXISTS update_workspace_settings_updated_at ON workspace_settings;

-- Then run migration again
```

---

### Error: "Middleware: Cannot read property 'role' of undefined"

**Cause:** Middleware trying to access role before database query completes

**Solution:**
- Check [src/middleware.ts](../../src/middleware.ts) lines 54-77
- Ensure database query has try/catch
- Check that user_roles query is not failing silently

---

### Error: "Dev server won't start - TypeScript errors"

**Cause:** Type definitions in [src/env.d.ts](../../src/env.d.ts) don't match middleware

**Solution:**
- Verify Locals interface has:
  - userRole: 'owner' | 'reader' | null
  - workspaceOwnerId: string | null
  - allowReaders: boolean
  - isExpert?: boolean

---

### Error: "403 Forbidden on owner-only routes"

**Cause:** Middleware not detecting owner role correctly

**Debug steps:**
1. Check user_roles table: `SELECT * FROM user_roles WHERE user_id = auth.uid();`
2. Check workspace_settings table: `SELECT * FROM workspace_settings;`
3. Add console.log in middleware to see locals values
4. Verify RLS policies not blocking queries

---

### Error: "Auto-assign owner trigger not firing"

**Cause:** Trigger may not be on correct table or event

**Solution:**
1. Check trigger exists:
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE trigger_name = 'trigger_auto_assign_owner';
   ```

2. Manually assign owner if needed:
   ```sql
   INSERT INTO user_roles (user_id, workspace_owner_id, role)
   VALUES (auth.uid(), auth.uid(), 'owner');

   INSERT INTO workspace_settings (owner_id, workspace_name)
   VALUES (auth.uid(), 'My Workspace');
   ```

---

## Part 5: Rollback Procedure

**If migration causes breaking issues:**

### 5.1 Rollback Database Changes

**Drop new tables:**
```sql
BEGIN;

DROP TRIGGER IF EXISTS trigger_auto_assign_owner ON auth.users;
DROP TRIGGER IF EXISTS update_workspace_settings_updated_at ON workspace_settings;

DROP FUNCTION IF EXISTS update_workspace_settings_updated_at() CASCADE;
DROP FUNCTION IF EXISTS auto_assign_owner() CASCADE;
DROP FUNCTION IF EXISTS has_acknowledged_license(uuid, uuid, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS has_acknowledged_safety(uuid, uuid, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS is_workspace_owner(uuid) CASCADE;

DROP TABLE IF EXISTS reader_suggestions CASCADE;
DROP TABLE IF EXISTS reader_acknowledgments CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS workspace_settings CASCADE;

COMMIT;
```

**Note:** This does NOT rollback RLS policy changes on existing tables. If needed:
```sql
-- Restore old project_cache policies
-- Restore old stream_cache policies
-- (Check backup or migration file for original policies)
```

---

### 5.2 Revert Middleware Changes

**Option 1: Git revert**
```bash
git checkout HEAD~1 -- src/middleware.ts
git checkout HEAD~1 -- src/env.d.ts
```

**Option 2: Manual restore**
- Copy backup of middleware.ts (if you made one)
- Remove role detection logic
- Remove owner-only route protection
- Restore simple auth check

---

## Part 6: Results Documentation

### 6.1 Migration Results

**Date:** _______________
**Duration:** _______________
**Executed by:** _______________

**Tables Created:**
- [ ] workspace_settings: ✅ / ❌
- [ ] user_roles: ✅ / ❌
- [ ] reader_acknowledgments: ✅ / ❌
- [ ] reader_suggestions: ✅ / ❌

**RLS Policies:**
- [ ] All policies created: ✅ / ❌
- [ ] RLS enabled on all tables: ✅ / ❌

**Functions:**
- [ ] All 5 functions created: ✅ / ❌
- [ ] Functions execute without error: ✅ / ❌

**Triggers:**
- [ ] All 2 triggers created: ✅ / ❌
- [ ] Triggers firing correctly: ✅ / ❌

**Overall Migration Status:** ✅ Success / ⚠️ Partial / ❌ Failed

---

### 6.2 Middleware Testing Results

**Date:** _______________
**Duration:** _______________

**Dev Server:**
- [ ] Starts without errors: ✅ / ❌
- [ ] No TypeScript errors: ✅ / ❌
- [ ] Middleware loads successfully: ✅ / ❌

**Authentication:**
- [ ] Login works: ✅ / ❌
- [ ] OAuth flow completes: ✅ / ❌
- [ ] Redirects correctly: ✅ / ❌

**Role Detection:**
- [ ] Owner role assigned: ✅ / ❌
- [ ] Middleware detects role: ✅ / ❌
- [ ] No role detection errors: ✅ / ❌

**Route Protection:**
- [ ] /settings accessible (owner): ✅ / ❌
- [ ] /keystatic accessible (owner): ✅ / ❌
- [ ] API routes accessible (owner): ✅ / ❌
- [ ] Reader restrictions work: ✅ / ❌ / N/A

**Overall Middleware Status:** ✅ Success / ⚠️ Partial / ❌ Failed

---

### 6.3 Issues Found

**Issue #1:**
- **Description:** _______________
- **Severity:** Critical / High / Medium / Low
- **Location:** _______________
- **Error Message:** _______________
- **Resolution:** _______________
- **Status:** ✅ Fixed / ⏳ In Progress / ❌ Unresolved

**Issue #2:**
- **Description:** _______________
- **Severity:** Critical / High / Medium / Low
- **Location:** _______________
- **Error Message:** _______________
- **Resolution:** _______________
- **Status:** ✅ Fixed / ⏳ In Progress / ❌ Unresolved

**Issue #3:**
- **Description:** _______________
- **Severity:** Critical / High / Medium / Low
- **Location:** _______________
- **Error Message:** _______________
- **Resolution:** _______________
- **Status:** ✅ Fixed / ⏳ In Progress / ❌ Unresolved

---

### 6.4 Summary & Next Steps

**Overall Testing Status:** ✅ Success / ⚠️ Partial / ❌ Failed

**Key Findings:**
- _______________
- _______________
- _______________

**Critical Issues:**
- _______________
- _______________

**Recommendations:**
- _______________
- _______________

**Ready to Proceed:** Yes / No

**Next Steps:**
1. _______________
2. _______________
3. _______________

---

## Part 7: Quick Reference

### Quick Verification Queries

**Check all new tables exist:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('workspace_settings', 'user_roles', 'reader_acknowledgments', 'reader_suggestions');
```

**Check your role:**
```sql
SELECT * FROM user_roles WHERE user_id = auth.uid();
```

**Check workspace settings:**
```sql
SELECT * FROM workspace_settings WHERE owner_id = auth.uid();
```

**Check if you're owner:**
```sql
SELECT is_workspace_owner(auth.uid());
```

**Count policies:**
```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE tablename IN ('workspace_settings', 'user_roles', 'reader_acknowledgments', 'reader_suggestions')
GROUP BY tablename;
```

---

## Appendix A: Migration File Location

**Full path:** `supabase/migrations/20241106000000_self_hosted_owner_reader.sql`

**Size:** ~370 lines
**Created:** November 6, 2025
**Purpose:** Add owner/reader architecture to self-hosted model

---

## Appendix B: Files Modified

**Database:**
- New migration file created

**Middleware:**
- [src/middleware.ts](../../src/middleware.ts) - Role detection, owner-only routes
- [src/env.d.ts](../../src/env.d.ts) - Updated Locals interface

**Configuration:**
- [.env.example](../../.env.example) - Self-hosted configuration template

**Documentation:**
- [docs/current/SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md](./SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md)
- [docs/current/QUICK_START_Nov6_2025.md](./QUICK_START_Nov6_2025.md)
- [docs/current/CURRENT_STATE.md](./CURRENT_STATE.md)
- [docs/MASTER_TASKLIST.md](../MASTER_TASKLIST.md)

---

**Last Updated:** November 7, 2025
**Version:** 1.0
**Status:** Active testing guide

