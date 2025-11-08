-- Migration: Rename stream_slug to subproject_slug
-- Description: Final step in streams → sub-projects terminology migration
-- Date: November 8, 2025
-- Reference: MASTER_TASKLIST.md - Database Consistency Migration

-- ============================================================================
-- 1. RENAME COLUMN IN SUBPROJECT_CACHE
-- ============================================================================

-- Rename stream_slug column to subproject_slug
ALTER TABLE subproject_cache
RENAME COLUMN stream_slug TO subproject_slug;

-- ============================================================================
-- 2. UPDATE UNIQUE CONSTRAINT
-- ============================================================================

-- Drop old unique constraint
ALTER TABLE subproject_cache
DROP CONSTRAINT IF EXISTS stream_cache_project_id_stream_slug_key;

ALTER TABLE subproject_cache
DROP CONSTRAINT IF EXISTS subproject_cache_project_id_stream_slug_key;

-- Add new unique constraint with correct column name
ALTER TABLE subproject_cache
ADD CONSTRAINT subproject_cache_project_id_subproject_slug_key
UNIQUE (project_id, subproject_slug);

-- ============================================================================
-- 3. VERIFICATION QUERIES
-- ============================================================================

-- Verify column was renamed
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'subproject_cache'
-- ORDER BY ordinal_position;

-- Verify unique constraint exists
-- SELECT constraint_name, constraint_type
-- FROM information_schema.table_constraints
-- WHERE table_name = 'subproject_cache';

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- This migration completes the terminology change from "streams" to "sub-projects"
-- by renaming the final remaining column reference.
--
-- All functionality remains the same, only naming consistency is improved.
--
-- ============================================================================
