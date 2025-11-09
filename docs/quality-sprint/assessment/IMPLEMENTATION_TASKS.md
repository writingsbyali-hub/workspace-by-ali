# Implementation Tasks: Quality Sprint
**Based on:** Comprehensive Codebase Assessment (Nov 9, 2025)
**Total Effort:** 172 hours across 4 phases
**Priority:** Address before Phase 2 feature development

---

## Quick Reference

### This Week (Quick Wins) - 8-10 hours
→ Reduces production risk by 50%

1. Add Sentry error tracking (4h)
2. Create health check endpoint (2h)
3. Remove dev encryption key fallback (1h)
4. Configure Dependabot (30min)
5. Add GitHub Actions CI (1h)
6. Enable branch protection (30min)

### This Month (Production Hardening) - 50 hours
→ Gets to 85% production ready

- Testing infrastructure (40h)
- Code quality tooling (8h)
- Monitoring setup (2h)

### This Quarter (DevOps Excellence) - 72 hours
→ Achieves enterprise-grade maturity

- Database automation (28h)
- Security hardening (20h)
- Performance optimization (24h)

### Before Team Growth (Team Readiness) - 40 hours
→ Prepares for collaboration

- Documentation (16h)
- Workflows (12h)
- Onboarding (12h)

---

## Phase 1: Production Hardening (Week 1-3)

**Goal:** Make the application production-safe
**Total Time:** 50 hours
**Risk Reduction:** 🔴 HIGH → 🟡 MEDIUM (50%)

---

### Week 1: Quick Wins (8-10 hours)

#### Task 1.1: Add Sentry Error Tracking
**Priority:** 🔴 CRITICAL
**Time Estimate:** 4 hours
**Dependencies:** None

**Subtasks:**
- [ ] Sign up for Sentry account (free tier)
- [ ] Create new project for Workspace by Ali
- [ ] Install @sentry/astro package
- [ ] Configure in astro.config.mjs
- [ ] Add SENTRY_DSN to .env
- [ ] Test error capture with deliberate error
- [ ] Add source maps upload to CI
- [ ] Configure alert notifications (email/Slack)
- [ ] Document in architecture docs

**Commands:**
```bash
npm install @sentry/astro
```

**Files to Modify:**
- `astro.config.mjs` - Add Sentry integration
- `.env.example` - Document SENTRY_DSN
- `docs/architecture/03_Authentication_Security.md` - Update monitoring section

**Success Criteria:**
- [ ] Errors appear in Sentry dashboard
- [ ] Stack traces include source maps
- [ ] Team receives alerts for new errors
- [ ] User impact visible (affected users count)

**Estimated Impact:** Immediate visibility into production errors

---

#### Task 1.2: Create Health Check Endpoint
**Priority:** 🔴 CRITICAL
**Time Estimate:** 2 hours
**Dependencies:** None

**Subtasks:**
- [ ] Create `src/pages/api/health.ts`
- [ ] Implement Supabase connectivity check
- [ ] Implement GitHub API connectivity check
- [ ] Add version info from package.json
- [ ] Return 200 for healthy, 503 for unhealthy
- [ ] Add response time metrics
- [ ] Document endpoint in API reference
- [ ] Set up UptimeRobot monitoring

**Implementation:**
```typescript
// src/pages/api/health.ts
import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@/lib/supabaseServerAdmin';

export const GET: APIRoute = async () => {
  const startTime = Date.now();

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
    services: {
      supabase: await checkSupabase(),
      github: await checkGitHub()
    },
    responseTime: 0
  };

  health.responseTime = Date.now() - startTime;

  const allHealthy = Object.values(health.services).every(s => s === 'up');

  return new Response(JSON.stringify(health), {
    status: allHealthy ? 200 : 503,
    headers: { 'Content-Type': 'application/json' }
  });
};

async function checkSupabase(): Promise<'up' | 'down'> {
  try {
    const { error } = await supabaseAdmin
      .from('workspace_settings')
      .select('count')
      .limit(1)
      .single();

    return error ? 'down' : 'up';
  } catch {
    return 'down';
  }
}

async function checkGitHub(): Promise<'up' | 'down'> {
  try {
    const response = await fetch('https://api.github.com/rate_limit');
    return response.ok ? 'up' : 'down';
  } catch {
    return 'down';
  }
}
```

**Files to Create:**
- `src/pages/api/health.ts`

**Files to Modify:**
- `docs/reference/API_ENDPOINTS.md` - Document health check

**Success Criteria:**
- [ ] `/api/health` returns 200 when all services healthy
- [ ] Returns 503 when any service down
- [ ] Response time under 500ms
- [ ] UptimeRobot monitoring configured

---

#### Task 1.3: Remove Dev Encryption Key Fallback
**Priority:** 🔴 CRITICAL (Security Vulnerability)
**Time Estimate:** 1 hour
**Dependencies:** None

**Current Issue:**
```typescript
// src/lib/tokenEncryption.ts (LINE 34)
function getEncryptionKey(): Buffer {
  const keyBase64 = process.env.ENCRYPTION_KEY;

  if (!keyBase64) {
    // 🔴 SECURITY RISK - Remove this fallback
    console.warn('WARNING: Using dev encryption key...');
    return Buffer.from('dev-encryption-key-please-change-in-production-32bytes!', 'utf-8');
  }

  return Buffer.from(keyBase64, 'base64');
}
```

**Subtasks:**
- [ ] Remove fallback return statement
- [ ] Throw error instead if ENCRYPTION_KEY missing
- [ ] Add key length validation (must be 32 bytes)
- [ ] Update error message with setup instructions
- [ ] Test in development (should fail without key)
- [ ] Verify production has key set
- [ ] Document in security architecture

**Fixed Implementation:**
```typescript
function getEncryptionKey(): Buffer {
  const keyBase64 = process.env.ENCRYPTION_KEY;

  if (!keyBase64) {
    throw new Error(
      'ENCRYPTION_KEY environment variable is required. ' +
      'Generate one with: node -e "console.log(crypto.randomBytes(32).toString(\'base64\'))"'
    );
  }

  const key = Buffer.from(keyBase64, 'base64');

  if (key.length !== 32) {
    throw new Error(
      `ENCRYPTION_KEY must be 32 bytes (256 bits). ` +
      `Current length: ${key.length} bytes. ` +
      `Generate a new one with: node -e "console.log(crypto.randomBytes(32).toString(\'base64\'))"`
    );
  }

  return key;
}
```

**Files to Modify:**
- `src/lib/tokenEncryption.ts:34-40` - Remove fallback, add validation

**Success Criteria:**
- [ ] App throws error on startup if ENCRYPTION_KEY missing
- [ ] Error message includes generation command
- [ ] Key length validated (32 bytes)
- [ ] No weak default key in codebase
- [ ] Production deployment verified with strong key

---

#### Task 1.4: Configure Dependabot
**Priority:** 🟡 HIGH
**Time Estimate:** 30 minutes
**Dependencies:** None

**Subtasks:**
- [ ] Create `.github/dependabot.yml`
- [ ] Configure npm ecosystem
- [ ] Set weekly update schedule
- [ ] Group updates by type
- [ ] Enable security updates
- [ ] Configure PR auto-merge for patches
- [ ] Test by manually triggering update

**Implementation:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  # npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    groups:
      # Group dev dependencies
      dev-dependencies:
        patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
          - "vitest*"
          - "playwright*"
      # Group production dependencies
      production-dependencies:
        patterns:
          - "astro"
          - "react"
          - "@supabase/*"
          - "octokit"
    labels:
      - "dependencies"
      - "automated"
    commit-message:
      prefix: "chore"
      include: "scope"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    labels:
      - "dependencies"
      - "github-actions"
```

**Files to Create:**
- `.github/dependabot.yml`

**Success Criteria:**
- [ ] Dependabot PRs appear weekly
- [ ] Security updates created immediately
- [ ] Dependencies grouped logically
- [ ] PRs labeled correctly

---

#### Task 1.5: Add GitHub Actions CI
**Priority:** 🔴 CRITICAL
**Time Estimate:** 1 hour
**Dependencies:** None (will expand with testing in Phase 2)

**Subtasks:**
- [ ] Create `.github/workflows/ci.yml`
- [ ] Add type checking step
- [ ] Add build verification step
- [ ] Configure Node.js caching
- [ ] Test workflow on feature branch
- [ ] Add status badge to README
- [ ] Configure branch protection to require CI

**Implementation:**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run build:check

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        if: success()
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  notify:
    name: Notify on Failure
    runs-on: ubuntu-latest
    needs: quality-checks
    if: failure()

    steps:
      - name: Send notification
        run: |
          echo "CI failed for ${{ github.ref }} by ${{ github.actor }}"
          # Add Slack/Discord webhook here
```

**Files to Create:**
- `.github/workflows/ci.yml`

**Files to Modify:**
- `README.md` - Add CI status badge

**Success Criteria:**
- [ ] CI runs on every push
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Failures visible in PR status checks

---

#### Task 1.6: Enable Branch Protection
**Priority:** 🟡 HIGH
**Time Estimate:** 30 minutes
**Dependencies:** Task 1.5 (CI workflow)

**Subtasks:**
- [ ] Go to GitHub repository settings
- [ ] Navigate to Branches → Add rule
- [ ] Protect `main` branch
- [ ] Require status checks (CI workflow)
- [ ] Require pull request reviews (when team grows)
- [ ] Require conversation resolution
- [ ] Restrict force pushes
- [ ] Document branch strategy in CONTRIBUTING.md

**Configuration:**
```
Branch name pattern: main

Required status checks:
☑ Require status checks to pass before merging
  - quality-checks

Pull request requirements:
☑ Require a pull request before merging
  - Require approvals: 1 (enable when team grows)
  - Dismiss stale reviews: true
  - Require review from Code Owners: false (add later)

Additional rules:
☑ Require conversation resolution before merging
☑ Do not allow bypassing the above settings
☐ Allow force pushes (disabled)
☐ Allow deletions (disabled)
```

**Success Criteria:**
- [ ] Cannot push directly to main
- [ ] CI must pass before merge
- [ ] Force push prevented
- [ ] Branch protection visible in settings

---

### Week 2-3: Testing Infrastructure (40 hours)

#### Task 1.7: Set Up Vitest (Unit/Integration Tests)
**Priority:** 🔴 CRITICAL
**Time Estimate:** 4 hours
**Dependencies:** None

**Subtasks:**
- [ ] Install Vitest and dependencies
- [ ] Create `vitest.config.ts`
- [ ] Add test scripts to package.json
- [ ] Configure coverage with c8
- [ ] Create `src/__tests__/` directory structure
- [ ] Write sample test to verify setup
- [ ] Configure VS Code for Vitest
- [ ] Add coverage badge to README

**Commands:**
```bash
npm install -D vitest @vitest/ui c8
npm install -D @testing-library/react @testing-library/user-event
npm install -D @testing-library/jest-dom
npm install -D happy-dom # or jsdom
```

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.config.*',
        '**/types.ts'
      ],
      all: true,
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

**Package.json scripts:**
```json
{
  "test": "vitest",
  "test:unit": "vitest run",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

**Files to Create:**
- `vitest.config.ts`
- `src/__tests__/setup.ts`
- `src/__tests__/utils/tokenEncryption.test.ts` (sample test)

**Files to Modify:**
- `package.json` - Add scripts and dependencies
- `.github/workflows/ci.yml` - Add test step
- `README.md` - Add coverage badge

**Success Criteria:**
- [ ] `npm test` runs successfully
- [ ] Coverage report generated
- [ ] Sample test passes
- [ ] CI runs tests automatically

---

#### Task 1.8: Write Critical Utility Tests
**Priority:** 🔴 CRITICAL
**Time Estimate:** 10 hours
**Dependencies:** Task 1.7

**Target Files:**
1. `src/lib/tokenEncryption.ts` (2 hours)
2. `src/lib/apiUtils.ts` (2 hours)
3. `src/lib/github.ts` (3 hours)
4. `src/lib/preferences/` (2 hours)
5. `src/middleware.ts` (1 hour)

**Example Test - Token Encryption:**
```typescript
// src/__tests__/utils/tokenEncryption.test.ts
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { encryptToken, decryptToken } from '@/lib/tokenEncryption';

describe('tokenEncryption', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.ENCRYPTION_KEY;
    // Set valid 32-byte key
    process.env.ENCRYPTION_KEY = Buffer.from(crypto.randomBytes(32)).toString('base64');
  });

  afterEach(() => {
    process.env.ENCRYPTION_KEY = originalEnv;
  });

  test('encrypts and decrypts tokens correctly', () => {
    const token = 'github_pat_test_token_value';
    const encrypted = encryptToken(token);
    const decrypted = decryptToken(encrypted);

    expect(decrypted).toBe(token);
  });

  test('generates unique ciphertexts for same plaintext', () => {
    const token = 'test_token';
    const encrypted1 = encryptToken(token);
    const encrypted2 = encryptToken(token);

    expect(encrypted1).not.toBe(encrypted2);
    expect(decryptToken(encrypted1)).toBe(token);
    expect(decryptToken(encrypted2)).toBe(token);
  });

  test('throws error if ENCRYPTION_KEY missing', () => {
    delete process.env.ENCRYPTION_KEY;

    expect(() => encryptToken('test')).toThrow('ENCRYPTION_KEY environment variable is required');
  });

  test('throws error if ENCRYPTION_KEY wrong length', () => {
    process.env.ENCRYPTION_KEY = Buffer.from('too-short').toString('base64');

    expect(() => encryptToken('test')).toThrow('must be 32 bytes');
  });

  test('detects tampered ciphertext', () => {
    const token = 'test';
    const encrypted = encryptToken(token);
    const [iv, ciphertext, authTag] = encrypted.split(':');

    // Tamper with ciphertext
    const tampered = `${iv}:${ciphertext}00:${authTag}`;

    expect(() => decryptToken(tampered)).toThrow();
  });
});
```

**Subtasks:**
- [ ] Write tokenEncryption tests (encryption, decryption, validation)
- [ ] Write apiUtils tests (apiSuccess, apiError, rate limiter)
- [ ] Write github.ts helper tests (content parsing, error handling)
- [ ] Write preferences tests (schema validation, defaults)
- [ ] Write middleware tests (route protection, role checks)
- [ ] Achieve 80%+ coverage on utility modules

**Success Criteria:**
- [ ] All utility functions have tests
- [ ] Edge cases covered (errors, validation)
- [ ] Coverage above 80% for tested modules
- [ ] CI fails if tests fail

---

#### Task 1.9: Write API Endpoint Tests
**Priority:** 🔴 CRITICAL
**Time Estimate:** 20 hours (16 endpoints × 1.25h each)
**Dependencies:** Task 1.7

**Endpoints to Test:**

**Authentication (5 endpoints - 6 hours):**
- [ ] POST `/api/auth/signin` - OAuth and magic link flows
- [ ] GET `/api/auth/callback` - OAuth callback handling
- [ ] POST `/api/auth/signout` - Session termination
- [ ] GET `/api/auth/github-connect` - Secondary OAuth initiation
- [ ] GET `/api/auth/github-callback` - GitHub token exchange

**Content Management (3 endpoints - 4 hours):**
- [ ] POST `/api/editor/save` - Markdown save to GitHub
- [ ] POST `/api/publish` - Publish content updates
- [ ] GET `/api/keystatic/token` - Keystatic integration

**Workspace (5 endpoints - 6 hours):**
- [ ] POST `/api/workspace/configure` - Workspace settings
- [ ] POST `/api/repo/fork` - Template repo forking
- [ ] GET `/api/user/profile` - User profile fetch
- [ ] POST `/api/safety/acknowledge` - Safety protocol
- [ ] POST `/api/webhooks/github` - Webhook handler

**Projects (3 endpoints - 4 hours - DEPRECATED but test):**
- [ ] GET `/api/projects` - List projects
- [ ] GET `/api/projects/[id]` - Single project
- [ ] GET `/api/projects/[id]/subprojects` - Subprojects

**Example Test - Safety Acknowledge:**
```typescript
// src/__tests__/api/safety/acknowledge.test.ts
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/pages/api/safety/acknowledge';

// Mock Supabase
vi.mock('@/lib/supabaseServer', () => ({
  createSupabaseServer: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'test-user-id' } },
        error: null
      }))
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ error: null }))
    }))
  }))
}));

describe('POST /api/safety/acknowledge', () => {
  test('returns 401 if not authenticated', async () => {
    // Mock unauthenticated user
    vi.mocked(createSupabaseServer).mockReturnValue({
      auth: {
        getUser: vi.fn(() => ({ data: { user: null }, error: new Error('Not authenticated') }))
      }
    });

    const request = new Request('http://localhost/api/safety/acknowledge', {
      method: 'POST',
      body: JSON.stringify({ workspaceOwner: 'test-owner' })
    });

    const response = await POST({ request, cookies: {} as any });
    expect(response.status).toBe(401);
  });

  test('returns 400 if workspaceOwner missing', async () => {
    const request = new Request('http://localhost/api/safety/acknowledge', {
      method: 'POST',
      body: JSON.stringify({})
    });

    const response = await POST({ request, cookies: {} as any });
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toContain('workspaceOwner');
  });

  test('creates acknowledgment record', async () => {
    const insertMock = vi.fn(() => ({ error: null }));

    vi.mocked(createSupabaseServer).mockReturnValue({
      auth: { getUser: vi.fn(() => ({ data: { user: { id: 'reader-id' } }, error: null })) },
      from: vi.fn(() => ({ insert: insertMock }))
    });

    const request = new Request('http://localhost/api/safety/acknowledge', {
      method: 'POST',
      body: JSON.stringify({ workspaceOwner: 'owner-id' })
    });

    const response = await POST({ request, cookies: {} as any });
    expect(response.status).toBe(200);
    expect(insertMock).toHaveBeenCalledWith({
      reader_id: 'reader-id',
      workspace_owner_id: 'owner-id',
      protocol_version: expect.any(String)
    });
  });
});
```

**Testing Strategy:**
1. Happy path (200 responses)
2. Validation errors (400 responses)
3. Authentication failures (401 responses)
4. Authorization failures (403 responses)
5. Rate limiting (429 responses)
6. Server errors (500 responses)

**Success Criteria:**
- [ ] All 16 endpoints have test coverage
- [ ] Each endpoint tests 4+ scenarios
- [ ] Mocks used for external dependencies
- [ ] Tests run in under 30 seconds

---

#### Task 1.10: Set Up Playwright (E2E Tests)
**Priority:** 🔴 CRITICAL
**Time Estimate:** 4 hours
**Dependencies:** None

**Subtasks:**
- [ ] Install Playwright
- [ ] Initialize Playwright config
- [ ] Configure test browsers
- [ ] Set up test fixtures (auth, database)
- [ ] Create page object models
- [ ] Write sample E2E test
- [ ] Add to CI pipeline
- [ ] Configure screenshots/videos on failure

**Commands:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Configuration:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],

  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
```

**Files to Create:**
- `playwright.config.ts`
- `tests/e2e/fixtures/auth.ts` (authentication helpers)
- `tests/e2e/pages/` (page object models)

**Files to Modify:**
- `package.json` - Add Playwright scripts
- `.github/workflows/ci.yml` - Add E2E test job

**Success Criteria:**
- [ ] Playwright runs successfully
- [ ] Sample test passes
- [ ] Screenshots captured on failure
- [ ] CI runs E2E tests

---

#### Task 1.11: Write Critical E2E Tests
**Priority:** 🔴 CRITICAL
**Time Estimate:** 12 hours
**Dependencies:** Task 1.10

**Critical User Flows:**

**1. Owner Authentication & Setup (3 hours)**
```typescript
// tests/e2e/owner-auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Owner Authentication', () => {
  test('can sign in with GitHub OAuth', async ({ page }) => {
    await page.goto('/login');

    // Click GitHub sign in
    await page.click('button:has-text("Sign in with GitHub")');

    // OAuth flow (mock or use test account)
    await expect(page).toHaveURL(/github\.com\/login/);

    // After OAuth callback
    await expect(page).toHaveURL('/workbench');
    await expect(page.locator('h1')).toContainText('Workbench');
  });

  test('can connect GitHub repository', async ({ page }) => {
    // Assumes authenticated owner
    await page.goto('/workbench/setup');

    await page.click('button:has-text("Connect GitHub")');

    // GitHub OAuth for repo access
    await expect(page).toHaveURL(/github\.com\/login\/oauth/);

    // After connection
    await expect(page.locator('[data-testid="repo-connected"]')).toBeVisible();
  });

  test('can create workspace', async ({ page }) => {
    await page.goto('/workbench/setup');

    await page.fill('input[name="workspace_name"]', 'Test Workspace');
    await page.fill('input[name="workspace_url"]', 'test-workspace');
    await page.click('button:has-text("Create Workspace")');

    await expect(page).toHaveURL('/workbench');
    await expect(page.locator('[data-testid="workspace-name"]')).toHaveText('Test Workspace');
  });
});
```

**2. Reader Gating Flow (4 hours)**
```typescript
// tests/e2e/reader-gating.spec.ts
test.describe('Safety Protocol Gating', () => {
  test('unauthenticated user sees public content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="project-list"]')).toBeVisible();
  });

  test('shows safety modal for gated content', async ({ page }) => {
    // Visit gated project (requires safety acknowledgment)
    await page.goto('/gated-project');

    await expect(page.locator('[data-testid="safety-modal"]')).toBeVisible();
    await expect(page.locator('text=/safety protocol/i')).toBeVisible();
  });

  test('can acknowledge and view gated content', async ({ page }) => {
    await page.goto('/gated-project');

    // Acknowledge safety protocol
    await page.click('input[type="checkbox"][name="acknowledge"]');
    await page.click('button:has-text("I Acknowledge")');

    // Modal closes, content visible
    await expect(page.locator('[data-testid="safety-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="project-content"]')).toBeVisible();
  });

  test('remembers acknowledgment for future visits', async ({ page, context }) => {
    // First visit - acknowledge
    await page.goto('/gated-project');
    await page.click('input[type="checkbox"]');
    await page.click('button:has-text("I Acknowledge")');

    // Reload page
    await page.reload();

    // No modal, content visible immediately
    await expect(page.locator('[data-testid="safety-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="project-content"]')).toBeVisible();
  });
});
```

**3. Content Publishing Flow (5 hours)**
```typescript
// tests/e2e/content-publishing.spec.ts
test.describe('Content Publishing', () => {
  test.use({ storageState: 'tests/e2e/.auth/owner.json' }); // Authenticated owner

  test('can create new project', async ({ page }) => {
    await page.goto('/workbench/projects/new');

    await page.fill('input[name="title"]', 'Test Project');
    await page.fill('textarea[name="description"]', 'Test description');
    await page.selectOption('select[name="visibility"]', 'public');

    await page.click('button:has-text("Create Project")');

    await expect(page).toHaveURL(/\/workbench\/editor\//);
  });

  test('can edit project content in markdown editor', async ({ page }) => {
    await page.goto('/workbench/editor/test-project');

    // Markdown editor should be visible
    await expect(page.locator('[data-testid="markdown-editor"]')).toBeVisible();

    // Type content
    await page.locator('textarea').fill('# Test Content\n\nThis is a test.');

    // Preview updates
    await expect(page.locator('[data-testid="preview"]')).toContainText('Test Content');
  });

  test('can save to GitHub and publish', async ({ page }) => {
    await page.goto('/workbench/editor/test-project');

    await page.locator('textarea').fill('# Updated Content');
    await page.click('button:has-text("Save")');

    // Wait for save confirmation
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible();

    // Publish
    await page.click('button:has-text("Publish")');

    // Verify published to public site
    await page.goto('/test-project');
    await expect(page.locator('h1')).toHaveText('Updated Content');
  });
});
```

**Subtasks:**
- [ ] Write owner authentication tests (3 tests)
- [ ] Write reader gating flow tests (4 tests)
- [ ] Write content publishing tests (3 tests)
- [ ] Create authentication fixtures
- [ ] Set up database seeding for tests
- [ ] Add visual regression testing (optional)

**Success Criteria:**
- [ ] All critical user flows tested
- [ ] Tests pass consistently (no flakiness)
- [ ] Run time under 5 minutes
- [ ] CI runs E2E tests on PR

---

### Week 2-3: Code Quality & Monitoring (10 hours)

#### Task 1.12: Add ESLint Configuration
**Priority:** 🟡 HIGH
**Time Estimate:** 2 hours
**Dependencies:** None

**Subtasks:**
- [ ] Install ESLint and plugins
- [ ] Create `.eslintrc.json`
- [ ] Configure for TypeScript + Astro + React
- [ ] Add lint script to package.json
- [ ] Fix existing linting errors (or add to ignore temporarily)
- [ ] Add to CI pipeline
- [ ] Configure VS Code ESLint extension

**Commands:**
```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-astro eslint-plugin-jsx-a11y
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

**Configuration:**
```json
// .eslintrc.json
{
  "root": true,
  "env": {
    "node": true,
    "es2022": true,
    "browser": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:astro/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["@typescript-eslint", "react", "jsx-a11y"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  },
  "overrides": [
    {
      "files": ["*.astro"],
      "parser": "astro-eslint-parser",
      "parserOptions": {
        "parser": "@typescript-eslint/parser",
        "extraFileExtensions": [".astro"]
      }
    }
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

**Files to Create:**
- `.eslintrc.json`
- `.eslintignore`

**Files to Modify:**
- `package.json` - Add `"lint": "eslint . --ext .ts,.tsx,.astro"`
- `.github/workflows/ci.yml` - Add lint step
- `.vscode/settings.json` - Enable ESLint

**Success Criteria:**
- [ ] `npm run lint` executes successfully
- [ ] Major errors fixed or documented
- [ ] CI fails on linting errors
- [ ] VS Code shows linting errors inline

---

#### Task 1.13: Add Prettier Configuration
**Priority:** 🟡 HIGH
**Time Estimate:** 1 hour
**Dependencies:** None

**Subtasks:**
- [ ] Install Prettier and plugins
- [ ] Create `.prettierrc`
- [ ] Create `.prettierignore`
- [ ] Add format scripts to package.json
- [ ] Run on entire codebase
- [ ] Integrate with ESLint (eslint-config-prettier)
- [ ] Configure VS Code Prettier extension

**Commands:**
```bash
npm install -D prettier prettier-plugin-astro
npm install -D eslint-config-prettier
```

**Configuration:**
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

**`.prettierignore`:**
```
dist/
node_modules/
.astro/
coverage/
*.min.js
package-lock.json
```

**Files to Create:**
- `.prettierrc`
- `.prettierignore`

**Files to Modify:**
- `package.json` - Update format script
- `.eslintrc.json` - Extend eslint-config-prettier
- `.vscode/settings.json` - Set Prettier as default formatter

**Success Criteria:**
- [ ] `npm run format` formats all files
- [ ] Code style consistent across codebase
- [ ] No conflicts with ESLint
- [ ] VS Code formats on save

---

#### Task 1.14: Add Pre-commit Hooks (Husky + lint-staged)
**Priority:** 🟡 HIGH
**Time Estimate:** 2 hours
**Dependencies:** Tasks 1.12, 1.13

**Subtasks:**
- [ ] Install husky and lint-staged
- [ ] Initialize husky
- [ ] Create pre-commit hook
- [ ] Configure lint-staged
- [ ] Test on sample commit
- [ ] Document in CONTRIBUTING.md

**Commands:**
```bash
npm install -D husky lint-staged
npx husky install
npm pkg set scripts.prepare="husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

**Configuration:**
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,astro}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

**Files to Create:**
- `.husky/pre-commit`

**Files to Modify:**
- `package.json` - Add lint-staged config and prepare script

**Success Criteria:**
- [ ] Pre-commit hook runs on git commit
- [ ] Only staged files are linted/formatted
- [ ] Commits blocked if linting fails
- [ ] Team members can bypass if needed (--no-verify)

---

#### Task 1.15: Replace In-Memory Rate Limiter
**Priority:** 🟡 HIGH (Production scalability)
**Time Estimate:** 8 hours
**Dependencies:** None (but requires Vercel KV setup)

**Current Issue:**
```typescript
// src/lib/apiUtils.ts
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  // ⚠️ In-memory storage won't work across Vercel instances
}
```

**Subtasks:**
- [ ] Sign up for Vercel KV (or Upstash Redis)
- [ ] Install @vercel/kv package
- [ ] Update RateLimiter class to use KV
- [ ] Add KV_REST_API_URL and KV_REST_API_TOKEN to env
- [ ] Test rate limiting across multiple instances
- [ ] Add rate limit headers (X-RateLimit-*)
- [ ] Document in architecture docs
- [ ] Update API error responses

**Implementation:**
```typescript
// src/lib/rateLimit.ts
import { kv } from '@vercel/kv';

export class RateLimiter {
  async isAllowed(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;

    // Increment request count
    const count = await kv.incr(windowKey);

    // Set expiry on first request in window
    if (count === 1) {
      await kv.pexpire(windowKey, windowMs);
    }

    const allowed = count <= limit;
    const remaining = Math.max(0, limit - count);
    const resetAt = Math.ceil((now + windowMs) / 1000);

    return { allowed, remaining, resetAt };
  }
}

export const rateLimiter = new RateLimiter();
```

**Usage in API routes:**
```typescript
// Example: src/pages/api/auth/signin.ts
import { rateLimiter } from '@/lib/rateLimit';

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  // Rate limit by IP
  const { allowed, remaining, resetAt } = await rateLimiter.isAllowed(
    `ip:${clientAddress}`,
    10, // 10 requests
    60 * 1000 // per minute
  );

  if (!allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetAt.toString(),
          'Retry-After': ((resetAt * 1000 - Date.now()) / 1000).toFixed(0)
        }
      }
    );
  }

  // Continue with request...
};
```

**Files to Create:**
- `src/lib/rateLimit.ts` (new distributed implementation)

**Files to Modify:**
- `src/lib/apiUtils.ts` - Remove old RateLimiter class
- All API endpoints - Update to use new rate limiter
- `.env.example` - Document KV variables
- `docs/architecture/` - Update rate limiting docs

**Success Criteria:**
- [ ] Rate limiting works across Vercel instances
- [ ] Rate limit headers returned
- [ ] Performance acceptable (< 50ms overhead)
- [ ] Tests verify rate limiting behavior

---

#### Task 1.16: Add Structured Logging
**Priority:** 🟡 HIGH
**Time Estimate:** 4 hours
**Dependencies:** None

**Current Issue:**
- 158 console.log statements across 42 files
- No structured logging
- Hard to debug production issues

**Subtasks:**
- [ ] Install Pino logger
- [ ] Create logger utility module
- [ ] Replace console.log with logger calls
- [ ] Add log levels (info, warn, error, debug)
- [ ] Configure log formatting for dev/prod
- [ ] Add request context (user ID, request ID)
- [ ] Integrate with Sentry (breadcrumbs)
- [ ] Document logging standards

**Commands:**
```bash
npm install pino pino-pretty
```

**Implementation:**
```typescript
// src/lib/logger.ts
import pino from 'pino';

const isDev = import.meta.env.DEV;

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname'
        }
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    }
  }
});

// Utility to create child logger with context
export function createLogger(context: Record<string, any>) {
  return logger.child(context);
}
```

**Usage Examples:**
```typescript
// Before:
console.log('User signed in:', userId);
console.error('Failed to fetch from GitHub:', error);

// After:
import { logger } from '@/lib/logger';

logger.info({ userId, method: 'github' }, 'User signed in');
logger.error({ error, endpoint: '/api/projects' }, 'Failed to fetch from GitHub');

// With context:
const reqLogger = createLogger({ requestId, userId });
reqLogger.info('Processing request');
reqLogger.error({ error }, 'Request failed');
```

**Files to Create:**
- `src/lib/logger.ts`

**Files to Modify:**
- 42 files with console.log statements (replace incrementally)
- `.env.example` - Document LOG_LEVEL

**Success Criteria:**
- [ ] Logging utility created
- [ ] 50%+ of console.log replaced in first pass
- [ ] Logs include structured context
- [ ] Production logs in JSON format

---

## Phase 2: Testing Infrastructure (Week 4-5)

**Goal:** Achieve 70%+ test coverage
**Total Time:** 50 hours
**Risk Reduction:** 🟡 MEDIUM → 🟢 LOW (40%)

*Detailed breakdown provided in Phase 1 tasks 1.7-1.11*

**Summary:**
- [ ] Vitest setup (4h) - Task 1.7
- [ ] Utility tests (10h) - Task 1.8
- [ ] API endpoint tests (20h) - Task 1.9
- [ ] Playwright setup (4h) - Task 1.10
- [ ] E2E critical flows (12h) - Task 1.11

**Deliverables:**
- 70%+ code coverage
- All 16 API endpoints tested
- 10+ critical user flows covered by E2E tests
- CI fails on test failures

---

## Phase 3: DevOps Excellence (Week 6-10)

**Goal:** Enterprise-grade operations
**Total Time:** 72 hours
**Impact:** Production-ready infrastructure

---

### 3.1 Database Automation (12 hours)

#### Task 3.1: Automate Database Migrations
**Time Estimate:** 8 hours

**Subtasks:**
- [ ] Install Supabase CLI
- [ ] Create migration automation workflow
- [ ] Add migration testing
- [ ] Document rollback procedures
- [ ] Create staging database
- [ ] Implement migration dry-run
- [ ] Add migration status endpoint

**Files to Create:**
- `.github/workflows/migrations.yml`
- `scripts/migrate.sh`
- `scripts/rollback.sh`

**Success Criteria:**
- [ ] Migrations run automatically on merge
- [ ] Staging tested before production
- [ ] Rollback procedure documented and tested

---

#### Task 3.2: Database Backup Automation
**Time Estimate:** 4 hours

**Subtasks:**
- [ ] Set up Supabase backup schedule
- [ ] Create backup verification script
- [ ] Test restore procedure
- [ ] Document backup retention policy
- [ ] Add backup monitoring

**Success Criteria:**
- [ ] Daily automated backups
- [ ] Restore tested monthly
- [ ] Backup monitoring alerts configured

---

### 3.2 Security Hardening (20 hours)

#### Task 3.3: Add Input Sanitization
**Time Estimate:** 8 hours

**Subtasks:**
- [ ] Install DOMPurify for markdown
- [ ] Add HTML sanitization to all user inputs
- [ ] Implement XSS prevention
- [ ] Add CSRF token validation
- [ ] Create sanitization utilities
- [ ] Test with malicious inputs

**Files to Modify:**
- `src/components/editor/MarkdownEditor.tsx`
- `src/lib/sanitize.ts` (create)
- All forms and input handling

**Success Criteria:**
- [ ] All user input sanitized
- [ ] XSS attacks blocked
- [ ] Tests verify sanitization

---

#### Task 3.4: Security Scanning (Snyk)
**Time Estimate:** 4 hours

**Subtasks:**
- [ ] Sign up for Snyk
- [ ] Install Snyk CLI
- [ ] Add Snyk to CI pipeline
- [ ] Fix critical vulnerabilities
- [ ] Set up automated PR creation
- [ ] Configure security policies

**Success Criteria:**
- [ ] No critical vulnerabilities
- [ ] Weekly security scans
- [ ] Automated dependency updates

---

#### Task 3.5: Add Security Headers
**Time Estimate:** 4 hours

**Subtasks:**
- [ ] Implement Content Security Policy
- [ ] Add HSTS headers
- [ ] Configure X-Frame-Options
- [ ] Add X-Content-Type-Options
- [ ] Test with security scanners

**Implementation:**
```typescript
// src/middleware.ts
export function onRequest({ response }: MiddlewareContext) {
  response.headers.set('Content-Security-Policy', "default-src 'self'; ...");
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}
```

**Success Criteria:**
- [ ] A+ rating on securityheaders.com
- [ ] All security headers present
- [ ] No functionality broken

---

#### Task 3.6: Implement API Versioning
**Time Estimate:** 4 hours

**Subtasks:**
- [ ] Create `/api/v1/` directory structure
- [ ] Move endpoints to versioned routes
- [ ] Add version routing logic
- [ ] Update API documentation
- [ ] Deprecate old routes with headers

**Success Criteria:**
- [ ] All endpoints at `/api/v1/*`
- [ ] Version routing works
- [ ] Documentation updated

---

### 3.3 Performance & Observability (24 hours)

#### Task 3.7: GitHub API Rate Limit Handling
**Time Estimate:** 6 hours

**Subtasks:**
- [ ] Add rate limit tracking
- [ ] Implement exponential backoff
- [ ] Cache GitHub API responses
- [ ] Add rate limit monitoring
- [ ] Create fallback strategies

**Files to Modify:**
- `src/lib/github.ts`
- Create `src/lib/githubCache.ts`

**Success Criteria:**
- [ ] Rate limits tracked
- [ ] Automatic retries on 429
- [ ] Caching reduces API calls by 50%+

---

#### Task 3.8: Performance Monitoring
**Time Estimate:** 4 hours

**Subtasks:**
- [ ] Install Vercel Analytics
- [ ] Add Web Vitals tracking
- [ ] Set performance budgets
- [ ] Create performance dashboard
- [ ] Configure alerts

**Success Criteria:**
- [ ] Core Web Vitals monitored
- [ ] Performance budgets enforced in CI
- [ ] Alerts for degradation

---

#### Task 3.9: Add API Documentation (OpenAPI)
**Time Estimate:** 12 hours

**Subtasks:**
- [ ] Install Swagger/OpenAPI tools
- [ ] Document all 16 endpoints
- [ ] Add request/response schemas
- [ ] Generate TypeScript client
- [ ] Host Swagger UI
- [ ] Create API changelog

**Success Criteria:**
- [ ] All endpoints documented
- [ ] Swagger UI accessible
- [ ] TypeScript client generated

---

#### Task 3.10: Containerization (Docker)
**Time Estimate:** 12 hours

**Subtasks:**
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Optimize image size
- [ ] Add .dockerignore
- [ ] Create self-hosting guide
- [ ] Test local deployment

**Success Criteria:**
- [ ] Docker image builds successfully
- [ ] Image size under 500MB
- [ ] Self-hosting guide complete
- [ ] Docker Compose works locally

---

## Phase 4: Team Readiness (Week 11-12)

**Goal:** Prepare for team collaboration
**Total Time:** 40 hours

---

### 4.1 Documentation (16 hours)

#### Task 4.1: Create CONTRIBUTING.md
**Time Estimate:** 4 hours

**Sections:**
- Code style guide
- Branch naming conventions
- Pull request process
- Review checklist
- Definition of Done
- How to run tests

---

#### Task 4.2: Developer Onboarding Guide
**Time Estimate:** 6 hours

**Sections:**
- Local environment setup
- Running the dev server
- Database setup
- Running tests
- Common troubleshooting
- Architecture overview

---

#### Task 4.3: API & Architecture Documentation
**Time Estimate:** 6 hours

**Updates:**
- Finalize architecture diagrams
- Document all design decisions
- Create API changelog
- Update component library
- Add troubleshooting guides

---

### 4.2 Workflows (12 hours)

#### Task 4.4: Implement Full PR Workflow
**Time Estimate:** 4 hours

**Subtasks:**
- [ ] Create PR template
- [ ] Configure code owners
- [ ] Set up review requirements
- [ ] Create PR checklist
- [ ] Add auto-labeling

---

#### Task 4.5: Create Runbooks
**Time Estimate:** 8 hours

**Runbooks to Create:**
- Deployment procedures
- Rollback procedures
- Incident response
- Database operations
- Security incident response
- Performance debugging

---

### 4.3 Access & Permissions (12 hours)

#### Task 4.6: Move to GitHub Organization
**Time Estimate:** 4 hours

**Subtasks:**
- [ ] Create GitHub organization
- [ ] Transfer repository
- [ ] Set up teams
- [ ] Configure access levels
- [ ] Update webhook URLs

---

#### Task 4.7: Team Access Setup
**Time Estimate:** 4 hours

**Subtasks:**
- [ ] Vercel team account
- [ ] Supabase team access
- [ ] Sentry team access
- [ ] Environment variables access
- [ ] Documentation access

---

#### Task 4.8: Onboarding Checklist
**Time Estimate:** 4 hours

**Create checklist for new developers:**
- [ ] GitHub access granted
- [ ] Environment setup completed
- [ ] Local development working
- [ ] First PR submitted
- [ ] Documentation reviewed
- [ ] Team sync scheduled

---

## Summary: Implementation Roadmap

### Timeline Overview

**Week 1:** Quick Wins (8-10 hours)
- Sentry, health checks, CI, Dependabot, branch protection
- **Impact:** 50% risk reduction

**Weeks 2-3:** Testing Infrastructure (40-50 hours)
- Vitest, Playwright, critical test coverage
- **Impact:** Regression prevention, refactoring confidence

**Weeks 3-4:** Code Quality (10 hours)
- ESLint, Prettier, pre-commit hooks, structured logging
- **Impact:** Code consistency, maintainability

**Weeks 6-10:** DevOps Excellence (72 hours)
- Database automation, security hardening, monitoring
- **Impact:** Production-grade infrastructure

**Weeks 11-12:** Team Readiness (40 hours)
- Documentation, workflows, access setup
- **Impact:** Ready for team collaboration

**Total:** 172 hours over 12 weeks

---

## Metrics & Success Criteria

### Overall Goals

**Production Readiness:**
- [ ] 70%+ test coverage
- [ ] Zero critical security vulnerabilities
- [ ] < 1% error rate in production
- [ ] 99.9% uptime

**Code Quality:**
- [ ] ESLint passing on all files
- [ ] Prettier formatting consistent
- [ ] Pre-commit hooks enforced
- [ ] TypeScript strict mode (already done ✅)

**DevOps Maturity:**
- [ ] CI/CD Level 4 of 5
- [ ] Automated testing in pipeline
- [ ] Monitoring and alerting operational
- [ ] Deployment rollback tested

**Team Readiness:**
- [ ] CONTRIBUTING.md complete
- [ ] Developer onboarding < 1 hour
- [ ] PR workflow enforced
- [ ] Multi-person access configured

---

## Next Steps

1. **Review this document** with stakeholders
2. **Decide on approach:**
   - Option A: Full Quality Sprint (12 weeks)
   - Option B: Phased approach (Quick Wins → Testing → DevOps → Team)
   - Option C: Hybrid (Quick Wins + finish Phase 1B → full sprint)
3. **Start with Week 1 Quick Wins** (highest ROI)
4. **Track progress** in MASTER_TASKLIST.md
5. **Update this document** as tasks complete

---

**Document Status:** Ready for Implementation
**Last Updated:** November 9, 2025
**Next Review:** After Week 1 Quick Wins completion
