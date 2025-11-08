-- Migration: Add Webhook Support
-- Description: Adds webhook_id to track GitHub webhook registration
-- Date: November 8, 2025

-- Add webhook_id column to user_repos table
ALTER TABLE user_repos
ADD COLUMN IF NOT EXISTS webhook_id TEXT,
ADD COLUMN IF NOT EXISTS webhook_secret TEXT;

-- Add index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_user_repos_webhook ON user_repos(webhook_id);

-- Add comment explaining the columns
COMMENT ON COLUMN user_repos.webhook_id IS 'GitHub webhook ID for automatic cache updates on push events';
COMMENT ON COLUMN user_repos.webhook_secret IS 'Secret token for webhook signature verification (encrypted)';
