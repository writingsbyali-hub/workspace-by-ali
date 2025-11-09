/**
 * Database Types
 *
 * TypeScript types for Supabase database tables
 * These will be auto-generated once you run: npx supabase gen types typescript
 * For now, we define them manually based on our schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // =========================================================================
      // LEGACY TABLES (Deprecated - Git-first architecture)
      // =========================================================================
      // These tables are deprecated in favor of Git-first content storage
      // Content now lives in Git, cached in project_cache/subproject_cache
      // DO NOT use these tables for new features - they will be removed in Phase 2

      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          bio: string | null
          avatar_url: string | null
          role: 'user' | 'reviewer' | 'admin'
          created_at: string
          last_signin: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'reviewer' | 'admin'
          created_at?: string
          last_signin?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'reviewer' | 'admin'
          created_at?: string
          last_signin?: string | null
        }
      }
      /**
       * @deprecated Legacy Supabase-centric content table
       * Use Git-first approach instead: content lives in GitHub, cached in project_cache
       * Will be removed in Phase 2
       */
      projects: {
        Row: {
          id: string
          owner: string
          name: string
          description: string | null
          category: string | null
          visibility: 'public' | 'private'
          created_at: string
        }
        Insert: {
          id?: string
          owner: string
          name: string
          description?: string | null
          category?: string | null
          visibility?: 'public' | 'private'
          created_at?: string
        }
        Update: {
          id?: string
          owner?: string
          name?: string
          description?: string | null
          category?: string | null
          visibility?: 'public' | 'private'
          created_at?: string
        }
      }
      /**
       * @deprecated Legacy Supabase-centric content table
       * Use Git-first approach instead: content lives in GitHub, cached in subproject_cache
       * Will be removed in Phase 2
       */
      subprojects: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          schema_url: string | null
          safety_version: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          schema_url?: string | null
          safety_version?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          schema_url?: string | null
          safety_version?: string | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          project_id: string
          subproject_id: string | null
          user_id: string
          title: string
          description: string | null
          data_url: string | null
          artifact_url: string | null
          safety_version: string | null
          status: 'draft' | 'pending' | 'verified' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          subproject_id?: string | null
          user_id: string
          title: string
          description?: string | null
          data_url?: string | null
          artifact_url?: string | null
          safety_version?: string | null
          status?: 'draft' | 'pending' | 'verified' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          subproject_id?: string | null
          user_id?: string
          title?: string
          description?: string | null
          data_url?: string | null
          artifact_url?: string | null
          safety_version?: string | null
          status?: 'draft' | 'pending' | 'verified' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      safety_logs: {
        Row: {
          id: string
          user_id: string
          subproject_id: string | null
          protocol_version: string | null
          signed_at: string
          acknowledgment: boolean
        }
        Insert: {
          id?: string
          user_id: string
          subproject_id?: string | null
          protocol_version?: string | null
          signed_at?: string
          acknowledgment?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          subproject_id?: string | null
          protocol_version?: string | null
          signed_at?: string
          acknowledgment?: boolean
        }
      }
      visualizations: {
        Row: {
          id: string
          submission_id: string
          chart_type: string | null
          format: string | null
          url: string | null
          checksum: string | null
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          chart_type?: string | null
          format?: string | null
          url?: string | null
          checksum?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          chart_type?: string | null
          format?: string | null
          url?: string | null
          checksum?: string | null
          created_at?: string
        }
      }
      // =========================================================================
      // GIT-FIRST CACHE TABLES
      // =========================================================================
      // Cache tables for fast dashboard queries
      // Source of truth is Git, these are synced via GitHub webhooks

      project_cache: {
        Row: {
          id: string
          user_id: string
          repo_url: string
          project_slug: string
          title: string | null
          description: string | null
          visibility: 'public' | 'gated' | 'private'
          safety_code: string | null
          stream: string | null
          tags: string[] | null
          status: 'draft' | 'active' | 'archived'
          stream_count: number
          last_updated: string | null
          synced_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          repo_url: string
          project_slug: string
          title?: string | null
          description?: string | null
          visibility?: 'public' | 'gated' | 'private'
          gated?: boolean
          safety_code?: string | null
          stream?: string | null
          tags?: string[] | null
          status?: 'draft' | 'active' | 'archived'
          stream_count?: number
          last_updated?: string | null
          synced_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          repo_url?: string
          project_slug?: string
          title?: string | null
          description?: string | null
          visibility?: 'public' | 'gated' | 'private'
          gated?: boolean
          safety_code?: string | null
          stream?: string | null
          tags?: string[] | null
          status?: 'draft' | 'active' | 'archived'
          stream_count?: number
          last_updated?: string | null
          synced_at?: string
          created_at?: string
        }
      }
      subproject_cache: {
        Row: {
          id: string
          project_id: string
          subproject_slug: string
          title: string | null
          description: string | null
          update_count: number
          last_updated: string | null
          synced_at: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          subproject_slug: string
          title?: string | null
          description?: string | null
          gated?: boolean
          update_count?: number
          last_updated?: string | null
          synced_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          subproject_slug?: string
          title?: string | null
          description?: string | null
          gated?: boolean
          update_count?: number
          last_updated?: string | null
          synced_at?: string
          created_at?: string
        }
      }
      // =========================================================================
      // WORKSPACE & USER TABLES
      // =========================================================================

      workspace_settings: {
        Row: {
          id: string
          owner_id: string
          workspace_name: string
          repo_visibility: 'public' | 'private'
          reader_signup_enabled: boolean
          readers_can_suggest: boolean
          setup_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          workspace_name: string
          repo_visibility?: 'public' | 'private'
          reader_signup_enabled?: boolean
          readers_can_suggest?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          workspace_name?: string
          repo_visibility?: 'public' | 'private'
          reader_signup_enabled?: boolean
          readers_can_suggest?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          workspace_owner_id: string
          role: 'owner' | 'reader'
          is_expert: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_owner_id: string
          role?: 'owner' | 'reader'
          is_expert?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_owner_id?: string
          role?: 'owner' | 'reader'
          is_expert?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reader_acknowledgments: {
        Row: {
          id: string
          user_id: string
          workspace_owner_id: string
          acknowledgment_type: 'safety' | 'license' | 'terms'
          acknowledgment_code: string
          project_slug: string | null
          subproject_slug: string | null
          acknowledged_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_owner_id: string
          acknowledgment_type: 'safety' | 'license' | 'terms'
          acknowledgment_code: string
          project_slug?: string | null
          subproject_slug?: string | null
          acknowledged_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_owner_id?: string
          acknowledgment_type?: 'safety' | 'license' | 'terms'
          acknowledgment_code?: string
          project_slug?: string | null
          subproject_slug?: string | null
          acknowledged_at?: string
        }
      }
      reader_suggestions: {
        Row: {
          id: string
          reader_id: string
          subproject_id: string
          suggestion_text: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          reader_id: string
          subproject_id: string
          suggestion_text: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          reader_id?: string
          subproject_id?: string
          suggestion_text?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      user_repos: {
        Row: {
          id: string
          user_id: string
          repo_url: string
          repo_owner: string
          repo_name: string
          github_token_encrypted: string | null
          default_branch: string
          is_template_forked: boolean
          webhook_id: string | null
          webhook_secret: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          repo_url: string
          repo_owner: string
          repo_name: string
          github_token_encrypted?: string | null
          default_branch?: string
          is_template_forked?: boolean
          webhook_id?: string | null
          webhook_secret?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          repo_url?: string
          repo_owner?: string
          repo_name?: string
          github_token_encrypted?: string | null
          default_branch?: string
          is_template_forked?: boolean
          webhook_id?: string | null
          webhook_secret?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
