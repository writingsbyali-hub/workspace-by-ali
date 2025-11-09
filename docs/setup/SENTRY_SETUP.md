# Sentry Error Tracking Setup Guide

**Status:** ✅ Configured (requires installation and account setup)
**Time to Complete:** 15-20 minutes
**Cost:** Free tier available (50k events/month)

---

## What is Sentry?

Sentry is a real-time error tracking platform that helps you:
- **Catch errors in production** before users report them
- **Debug faster** with detailed stack traces and context
- **Monitor performance** with transaction tracing
- **Replay user sessions** to see exactly what happened
- **Track releases** to identify which deploy introduced a bug

**Without Sentry:** You're blind to production errors until users complain
**With Sentry:** You get instant Slack/email alerts with full error details

---

## Installation

### Step 1: Install Sentry Package

```bash
npm install @sentry/astro
```

This installs:
- `@sentry/astro` - Astro integration
- `@sentry/browser` - Client-side error tracking
- `@sentry/node` - Server-side error tracking

**Size Impact:** ~150KB gzipped (lazy-loaded, minimal performance impact)

---

## Account Setup

### Step 2: Create Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Click "Sign Up" (free account)
3. Choose authentication method:
   - GitHub (recommended - easier team management)
   - Email/password

### Step 3: Create Project

1. Click "Create Project"
2. Select platform: **Astro**
3. Set alert frequency: **Real-time** (or every 10 minutes)
4. Name your project: `workspace-by-ali`
5. Click "Create Project"

### Step 4: Get Your DSN

After project creation, you'll see your DSN (Data Source Name):

```
https://abc123def456@o123456.ingest.sentry.io/7890123
```

**Copy this!** You'll need it for environment variables.

---

## Environment Configuration

### Step 5: Add to .env

Add the following to your `.env` file:

```bash
# ========================================
# SENTRY ERROR TRACKING
# ========================================
# Get DSN from: https://sentry.io/settings/projects/workspace-by-ali/keys/
PUBLIC_SENTRY_DSN=https://your-dsn-here@o123456.ingest.sentry.io/7890123

# Optional: For CI/CD source map uploads
# Get token from: https://sentry.io/settings/account/api/auth-tokens/
# SENTRY_AUTH_TOKEN=your-auth-token-here
# SENTRY_ORG=your-org-slug
# SENTRY_PROJECT=workspace-by-ali
```

### Step 6: Add to Vercel Environment Variables

For production deployment:

1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add variable:
   - **Name:** `PUBLIC_SENTRY_DSN`
   - **Value:** Your DSN from Step 4
   - **Environments:** Production, Preview, Development
3. Click "Save"

**Note:** Variables starting with `PUBLIC_` are exposed to the browser (this is safe for DSN)

---

## Verification

### Step 7: Test Error Tracking

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Create a test error in your app:
   ```typescript
   // Add temporarily to any page
   throw new Error('Test error for Sentry');
   ```

3. Trigger the error by visiting the page

4. Check Sentry dashboard (sentry.io):
   - Go to Issues
   - You should see "Test error for Sentry"
   - Click it to see stack trace, user context, breadcrumbs

5. Remove the test error once verified!

### Expected Results

✅ **Success:**
- Error appears in Sentry dashboard within seconds
- Stack trace shows correct file and line number
- Breadcrumbs show user navigation before error
- Environment shows as "development"

❌ **If not working:**
- Check browser console for Sentry initialization logs
- Verify DSN is correct (no extra spaces)
- Ensure `@sentry/astro` is installed
- Check Astro dev server restarted after adding env var

---

## Source Maps (Production)

### Step 8: Upload Source Maps (Optional but Recommended)

Source maps make production stack traces readable by mapping minified code back to original source.

#### Without Source Maps:
```
Error at c.Wa (chunk.abc123.js:1:2345)
  at d.Za (chunk.abc123.js:1:6789)
```

#### With Source Maps:
```
Error at UserProfile.handleSubmit (UserProfile.tsx:42:15)
  at FormButton.onClick (FormButton.tsx:28:5)
```

#### Setup:

1. Create Sentry auth token:
   - Go to https://sentry.io/settings/account/api/auth-tokens/
   - Click "Create New Token"
   - Name: `Workspace CI/CD`
   - Scopes: `project:releases`, `project:write`
   - Click "Create Token"
   - **Copy token immediately** (you won't see it again)

2. Add to GitHub Secrets:
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SENTRY_AUTH_TOKEN`
   - Value: Token from step 1
   - Click "Add secret"

3. Add to Vercel:
   - Go to Vercel → Settings → Environment Variables
   - Add:
     - `SENTRY_AUTH_TOKEN` (secret from step 1)
     - `SENTRY_ORG` (your Sentry org slug, e.g., `ali-workspace`)
     - `SENTRY_PROJECT` (e.g., `workspace-by-ali`)

4. Deploy! Source maps will upload automatically.

---

## Alert Configuration

### Step 9: Set Up Alerts (Recommended)

Get notified when errors occur:

1. Go to Sentry project → Alerts → Create Alert
2. Choose trigger: **Issues**
3. Conditions:
   - A new issue is created
   - OR an issue changes state from resolved to unresolved
4. Filters:
   - Environment: Production (ignore dev/preview errors)
5. Actions:
   - **Email:** Your email address
   - **Slack:** (Optional) Connect Slack workspace
6. Name: `Production Errors - Immediate`
7. Save

**Recommended Alerts:**
- **Immediate:** New issues in production
- **Daily Digest:** Summary of all issues
- **Spike Alert:** Error rate increases 100% in 1 hour

---

## Usage in Code

### Automatic Error Capture

Sentry automatically captures:
- ✅ Unhandled errors (thrown errors not in try/catch)
- ✅ Unhandled promise rejections
- ✅ Console.error() calls (configurable)
- ✅ Network errors (fetch failures)

**No code changes needed!** Just install and configure.

### Manual Error Capture

Capture errors explicitly with context:

```typescript
import * as Sentry from '@sentry/astro';

try {
  await dangerousOperation();
} catch (error) {
  // Capture with additional context
  Sentry.captureException(error, {
    level: 'error',
    tags: {
      section: 'authentication',
      action: 'github-oauth'
    },
    user: {
      id: user.id,
      username: user.name
    },
    extra: {
      attemptNumber: 3,
      provider: 'github'
    }
  });

  // Show user-friendly error
  throw new Error('Authentication failed. Please try again.');
}
```

### Add Breadcrumbs

Track user actions leading up to errors:

```typescript
import * as Sentry from '@sentry/astro';

// Track user navigation
Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'User viewed project detail page',
  level: 'info',
  data: {
    projectId: 'my-project',
    referrer: '/workbench'
  }
});

// Track API calls
Sentry.addBreadcrumb({
  category: 'api',
  message: 'Fetched project from GitHub',
  level: 'info',
  data: {
    url: 'https://api.github.com/repos/user/repo',
    status: 200,
    duration: 245
  }
});
```

### Set User Context

Associate errors with specific users:

```typescript
import * as Sentry from '@sentry/astro';

// After user signs in
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
  // Custom fields
  role: 'owner',
  workspace: 'ali-workspace'
});

// Clear on sign out
Sentry.setUser(null);
```

### Performance Monitoring

Track slow operations:

```typescript
import * as Sentry from '@sentry/astro';

const transaction = Sentry.startTransaction({
  name: 'Publish Content to GitHub',
  op: 'publish'
});

try {
  const span1 = transaction.startChild({ op: 'github.save' });
  await saveToGitHub(content);
  span1.finish();

  const span2 = transaction.startChild({ op: 'cache.update' });
  await updateSupabaseCache();
  span2.finish();

  transaction.setStatus('ok');
} catch (error) {
  transaction.setStatus('error');
  throw error;
} finally {
  transaction.finish();
}
```

---

## Privacy & Data Scrubbing

### Automatic Data Scrubbing

Sentry automatically masks:
- ❌ Passwords (any field with "password" in name)
- ❌ Credit cards (via regex patterns)
- ❌ Social Security Numbers
- ❌ API keys (common patterns)

### Custom Data Scrubbing

Add to `astro.config.mjs`:

```javascript
sentry({
  beforeSend(event, hint) {
    // Remove sensitive query params
    if (event.request?.query_string) {
      event.request.query_string = event.request.query_string
        .replace(/token=[^&]+/g, 'token=[REDACTED]')
        .replace(/key=[^&]+/g, 'key=[REDACTED]');
    }

    // Remove specific user data
    if (event.user) {
      delete event.user.ip_address;
    }

    return event;
  }
})
```

---

## Cost & Quotas

### Free Tier (Developer Plan)
- **50,000 errors/month**
- **10,000 performance units/month**
- **500 MB session replays/month**
- **30-day data retention**
- **1 team member**

**Good for:**
- Personal projects
- MVPs
- Low-traffic apps

### Paid Tiers
- **Team ($26/month):**
  - 100k errors/month
  - 100k performance units/month
  - 1 GB replays
  - 90-day retention
  - Unlimited team members

- **Business ($80/month):**
  - 500k errors/month
  - 500k performance units/month
  - 5 GB replays
  - Custom retention

**Monitoring Quota Usage:**
- Sentry dashboard → Settings → Usage & Billing
- Set up alerts at 80% quota

---

## Troubleshooting

### Errors Not Appearing

**Problem:** Deployed app but no errors in Sentry

**Solutions:**
1. Check DSN is set in Vercel environment variables
2. Verify DSN starts with `https://` and ends with `/123456`
3. Check Sentry project is not "paused"
4. Look at browser console - Sentry logs initialization
5. Check environment filters in Sentry (make sure production is included)

### Source Maps Not Working

**Problem:** Stack traces show minified code

**Solutions:**
1. Verify `SENTRY_AUTH_TOKEN` is set in CI/CD
2. Check build logs for "Uploading source maps to Sentry"
3. Ensure `SENTRY_ORG` and `SENTRY_PROJECT` match exactly
4. Auth token needs `project:releases` and `project:write` scopes

### Too Many Errors

**Problem:** Quota exhausted, drowning in noise

**Solutions:**
1. Add `ignoreErrors` to filter known issues:
   ```javascript
   ignoreErrors: [
     'ResizeObserver loop limit exceeded',
     'Non-Error promise rejection captured'
   ]
   ```

2. Add sampling for high-traffic apps:
   ```javascript
   beforeSend(event) {
     // Only send 10% of errors
     if (Math.random() > 0.1) return null;
     return event;
   }
   ```

3. Use `denyUrls` to ignore third-party errors:
   ```javascript
   denyUrls: [
     /extensions\//i,    // Browser extensions
     /^chrome:\/\//i,    // Chrome internal
     /^moz-extension/i   // Firefox extensions
   ]
   ```

---

## Next Steps

1. ✅ Install package: `npm install @sentry/astro`
2. ✅ Create Sentry account
3. ✅ Add DSN to `.env`
4. ✅ Test with deliberate error
5. ✅ Configure alerts (email/Slack)
6. ✅ Upload source maps (optional)
7. ✅ Add to team onboarding docs

---

## Resources

- **Docs:** https://docs.sentry.io/platforms/javascript/guides/astro/
- **Dashboard:** https://sentry.io
- **Status:** https://status.sentry.io
- **Support:** https://sentry.io/support/

---

**Setup Complete!** You now have world-class error tracking. 🎉

*Errors will be captured automatically - no additional code needed.*
