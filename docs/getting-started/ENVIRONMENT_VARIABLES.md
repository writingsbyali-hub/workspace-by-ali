# Environment Variables Reference

**Last Updated:** November 8, 2025

Complete reference for all environment variables used in Workspace by Ali. Copy [.env.example](../../.env.example) to `.env` and configure for your deployment.

---

## Quick Setup

```bash
# 1. Copy the template
cp .env.example .env

# 2. Fill in required values
#    - Supabase credentials
#    - GitHub OAuth app credentials
#    - Generated encryption keys

# 3. Test locally
npm run dev
```

**⚠️ CRITICAL:** Never commit `.env` to version control!

---

## Required Variables

### Supabase Configuration

| Variable | Example | Description |
|----------|---------|-------------|
| `PUBLIC_SUPABASE_URL` | `https://abc123.supabase.co` | Your Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anonymous (public) API key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase service role key (server-side only) |

**Where to find:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Settings → API
4. Copy URL and keys

**Security notes:**
- `PUBLIC_*` variables are safe to expose to the client
- `SUPABASE_SERVICE_ROLE_KEY` has full database access - **keep secret!**
- Never share service role key in client-side code

---

### GitHub OAuth

| Variable | Example | Description |
|----------|---------|-------------|
| `PUBLIC_GITHUB_CLIENT_ID` | `Iv1.a1b2c3d4e5f6g7h8` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | `1a2b3c4d5e6f...` | GitHub OAuth app secret (server-side only) |

**Setup instructions:**
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Configure:
   - **Application name:** `[Your Workspace Name]`
   - **Homepage URL:** `http://localhost:4321` (dev) or `https://your-workspace.vercel.app` (prod)
   - **Authorization callback URL:** `[Homepage URL]/api/auth/github-callback`
4. Copy Client ID and generate Client Secret

**Security notes:**
- Client ID is public (used in client-side redirects)
- Client Secret must remain server-side only

---

### Keystatic CMS (Content Repository)

| Variable | Example | Description |
|----------|---------|-------------|
| `PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER` | `alice` | Your GitHub username |
| `PUBLIC_KEYSTATIC_GITHUB_REPO_NAME` | `workspace-alice` | Your forked workspace content repo name |

**⚠️ CRITICAL**: These variables are **REQUIRED** for Keystatic to work. Without them, Keystatic will fail to load with a configuration error.

**How to find:**
1. Complete setup wizard at `/setup` (forks template automatically)
2. Check your GitHub repos for the new fork
3. Repo URL format: `github.com/[OWNER]/[NAME]`
4. Set `OWNER` and `NAME` accordingly

**Example:**
- GitHub username: `alice`
- Forked repo: `workspace-alice`
- Set: `PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=alice`
- Set: `PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=workspace-alice`

**Why these are needed:**
- Keystatic is configured in **GitHub mode** (not local or cloud mode)
- GitHub mode commits directly to your GitHub repository (free, self-hosted)
- These variables tell Keystatic which repo to commit to
- Content is persisted to Git (not lost on page refresh like local mode)

**Quick setup guide:** See [KEYSTATIC_SETUP.md](../../KEYSTATIC_SETUP.md) for step-by-step instructions.

**Troubleshooting:**

**Error: "repo owner/name is not set"**
- You forgot to add these variables to `.env.local`
- Add them and restart dev server: `npm run dev`

**Error: "Keystatic is set to storage: { kind: 'cloud' } but cloud.project isn't set"**
- This means `keystatic.config.ts` is misconfigured
- Should be using `github` mode, not `cloud` mode
- Cloud mode requires paid Keystatic Cloud subscription
- Verify `storage.kind` is set to `'github'` in [keystatic.config.ts](../../keystatic.config.ts:54)

**Error: "Authentication failed" in Keystatic**
- Keystatic uses the GitHub token endpoint at `/api/keystatic/token`
- Make sure you completed GitHub OAuth in `/setup`
- Check that token is properly encrypted in database

**Production deployment:**
- Add these same variables to Vercel dashboard (Project Settings → Environment Variables)
- Do NOT commit `.env.local` to Git
- Each deployment (dev, staging, prod) should point to the same content repo

---

### Encryption Keys (Generate Securely!)

| Variable | Purpose | How to Generate |
|----------|---------|-----------------|
| `GITHUB_TOKEN_ENCRYPTION_KEY` | Encrypts GitHub access tokens in database | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `GITHUB_WEBHOOK_SECRET` | Verifies GitHub webhook signatures | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_SECRET` | Signs JWT tokens (future feature) | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

**⚠️ CRITICAL WARNINGS:**
- **Never change `GITHUB_TOKEN_ENCRYPTION_KEY` after deployment!** Changing it will make all stored tokens unrecoverable.
- Keep these secrets... secret! Never commit to Git or share publicly.
- Use different values for dev and production environments.

---

## Site Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PUBLIC_SITE_URL` | `http://localhost:4321` | Your workspace's public URL |
| `WORKSPACE_NAME` | `My Research Workspace` | Workspace name (shown in UI) |
| `WORKSPACE_DESCRIPTION` | `A self-hosted workspace...` | Brief description |
| `NODE_ENV` | `development` | `development` or `production` |

**Deployment update:**
When deploying to Vercel, update:
- `PUBLIC_SITE_URL=https://your-workspace.vercel.app`
- `NODE_ENV=production`

---

## Optional Configuration

### Template Repository

| Variable | Default | Description |
|----------|---------|-------------|
| `TEMPLATE_REPO_OWNER` | `workspace-by-ali` | Owner of template repo |
| `TEMPLATE_REPO_NAME` | `workspace-template` | Name of template repo |

**When to customize:**
- You've created your own workspace template with custom structure
- You want to use a different starting point for new workspaces

**Default template:** [workspace-by-ali/workspace-template](https://github.com/workspace-by-ali/workspace-template)

---

### Reader Accounts (Phase 2)

| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOW_READERS` | `true` | Enable/disable guest accounts |
| `ALLOW_SUGGESTIONS` | `true` | Allow readers to suggest edits |
| `AUTO_APPROVE_EXPERTS` | `false` | Auto-approve expert suggestions |

**What are readers?**
Readers are guest accounts who can:
- View your public content
- Access gated content after safety acknowledgment
- Suggest edits (if enabled)

**Cannot:**
- Edit content directly
- Access owner tools (Keystatic, settings)
- Fork or deploy their own workspace from yours

---

### Safety Protocols

| Variable | Default | Description |
|----------|---------|-------------|
| `SAFETY_PROTOCOL_VERSION` | `v1.0` | Safety protocol version number |
| `COMMONS_SAFETY_REGISTRY_URL` | _(empty)_ | Commons safety registry (Arc^) |
| `COMMONS_SAFETY_REGISTRY_KEY` | _(empty)_ | Registry API key |

**When to update version:**
- You've changed your safety documentation
- You've added new safety categories
- Readers must re-acknowledge when version changes

**Commons safety registry:**
- Only needed if contributing to Arc^ Commons or similar
- Prevents duplicate acknowledgments across workspaces
- Leave empty for standalone workspace

---

### Licensing

| Variable | Default | Description |
|----------|---------|-------------|
| `DEFAULT_LICENSE` | `CC-BY-NC-SA-4.0` | Default Creative Commons license |

**Available licenses:**
- `CC-BY-4.0` - Attribution
- `CC-BY-SA-4.0` - Attribution-ShareAlike
- `CC-BY-NC-4.0` - Attribution-NonCommercial
- `CC-BY-NC-SA-4.0` - Attribution-NonCommercial-ShareAlike
- `CC-BY-ND-4.0` - Attribution-NoDerivatives
- `CC0-1.0` - Public Domain Dedication

Learn more: [Creative Commons Licenses](https://creativecommons.org/licenses/)

---

## Future Variables (Not Yet Implemented)

### Email Configuration

```bash
# SMTP for magic links, notifications (currently handled by Supabase)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASS=
# SMTP_FROM=
```

### Analytics

```bash
# Privacy-respecting analytics
# PLAUSIBLE_DOMAIN=
# UMAMI_WEBSITE_ID=
```

---

## Deployment Checklist

### Local Development

- [ ] Copy `.env.example` to `.env`
- [ ] Create Supabase project and add credentials
- [ ] Run Supabase migrations in SQL Editor
- [ ] Create GitHub OAuth app (callback: `http://localhost:4321/api/auth/github-callback`)
- [ ] Generate encryption keys
- [ ] Test: `npm run dev`

### Production Deployment (Vercel)

- [ ] Create Vercel project
- [ ] Add **all** environment variables in Vercel dashboard (Project Settings → Environment Variables)
- [ ] Set `NODE_ENV=production`
- [ ] Set `PUBLIC_SITE_URL=https://your-workspace.vercel.app`
- [ ] Update GitHub OAuth callback URL to `https://your-workspace.vercel.app/api/auth/github-callback`
- [ ] Deploy: `vercel --prod`
- [ ] Complete setup wizard at `https://your-workspace.vercel.app/setup`

---

## Security Best Practices

### Do's ✅

- ✅ Use different encryption keys for dev and production
- ✅ Rotate secrets regularly (except `GITHUB_TOKEN_ENCRYPTION_KEY`!)
- ✅ Keep `.env` in `.gitignore`
- ✅ Use environment-specific values (dev vs prod)
- ✅ Generate long, random secrets (32+ bytes)
- ✅ Store production secrets in Vercel dashboard only

### Don'ts ❌

- ❌ Never commit `.env` to Git
- ❌ Never change `GITHUB_TOKEN_ENCRYPTION_KEY` after deployment
- ❌ Don't reuse secrets across different projects
- ❌ Don't share secrets in screenshots, Slack, etc.
- ❌ Don't use predictable values like `secret123`
- ❌ Don't hardcode secrets in source code

---

## Troubleshooting

### "Supabase client initialized with invalid URL"
- Check `PUBLIC_SUPABASE_URL` format: `https://[project-id].supabase.co`
- No trailing slashes

### "GitHub OAuth redirect mismatch"
- Verify callback URL in GitHub OAuth app matches exactly
- Dev: `http://localhost:4321/api/auth/github-callback`
- Prod: `https://your-workspace.vercel.app/api/auth/github-callback`

### "Failed to decrypt GitHub token"
- `GITHUB_TOKEN_ENCRYPTION_KEY` was changed or is incorrect
- If key is lost, users must re-authenticate via GitHub

### "Webhook signature verification failed"
- `GITHUB_WEBHOOK_SECRET` doesn't match what's configured in GitHub repo webhook settings
- Go to GitHub repo → Settings → Webhooks → Edit webhook → Update secret

---

## Related Documentation

- [.env.example](../../.env.example) - Template with inline comments
- [Repository Structure](../REPOSITORY_STRUCTURE.md) - Self-hosted deployment model
- [Supabase Caching Strategy](../architecture/06_Supabase_Caching_Strategy.md) - Why we need certain variables
- [Authentication & Security](../architecture/03_Authentication_Security.md) - How OAuth works

---

**Need help?** Check the [main README](../../README.md) or open an issue.
