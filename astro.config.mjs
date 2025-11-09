import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';
import sentry from '@sentry/astro';

// Sentry Configuration
// Docs: https://docs.sentry.io/platforms/javascript/guides/astro/
//
// Purpose: Capture and track errors in production for debugging
// - Automatically captures unhandled errors and promise rejections
// - Tracks performance with trace sampling
// - Records user sessions for error replay
// - Sends source maps for readable stack traces
//
// Environment Variables Required:
// - PUBLIC_SENTRY_DSN: Your Sentry project DSN (get from sentry.io)
// - SENTRY_AUTH_TOKEN: For uploading source maps (CI/CD only)
//
// Installation:
// npm install @sentry/astro
//
// Setup:
// 1. Sign up at https://sentry.io
// 2. Create new Astro project
// 3. Copy DSN to .env as PUBLIC_SENTRY_DSN
// 4. Deploy and watch errors appear in Sentry dashboard

// https://astro.build/config
export default defineConfig({
  site: 'https://workspace.xbyali.page',
  output: 'server',
  adapter: vercel(),
  vite: {
    // Prevent Yjs duplication that causes Keystatic errors
    // This ensures Vite only bundles one copy of critical dependencies
    optimizeDeps: {
      include: ['yjs'],
    },
    ssr: {
      noExternal: ['@keystatic/core', '@keystatic/astro'],
    },
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    }),
    keystatic(),
    // Sentry Error Tracking
    // Only enabled if DSN is configured (allows dev without Sentry)
    ...(import.meta.env.PUBLIC_SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN
      ? [
          sentry({
            // Sentry Data Source Name (unique project identifier)
            dsn: import.meta.env.PUBLIC_SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN,

            // Environment (helps filter errors by deployment)
            environment: process.env.NODE_ENV || 'development',

            // Release tracking (for correlating errors with deploys)
            // Uses git commit SHA if available (Vercel provides this)
            release: process.env.VERCEL_GIT_COMMIT_SHA,

            // Performance Monitoring
            // Sample 100% of transactions (adjust to 0.1 for high traffic)
            // Traces show slow API calls, database queries, etc.
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,

            // Session Replay
            // Records user sessions when errors occur
            // PRIVACY: Automatically masks sensitive data (passwords, credit cards)
            replaysSessionSampleRate: 0.1, // 10% of normal sessions
            replaysOnErrorSampleRate: 1.0, // 100% of error sessions

            // Source Maps Upload
            // Enables readable stack traces in Sentry dashboard
            // Requires SENTRY_AUTH_TOKEN in CI/CD
            sourceMapsUploadOptions: {
              enabled: process.env.CI === 'true',
              org: process.env.SENTRY_ORG,
              project: process.env.SENTRY_PROJECT,
              authToken: process.env.SENTRY_AUTH_TOKEN,
            },
          }),
        ]
      : []),
  ],
});