/**
 * Health Check Endpoint
 *
 * Provides application health status for monitoring systems (UptimeRobot, etc.)
 * Checks connectivity to critical services: Supabase, GitHub API
 *
 * Returns:
 * - 200 OK: All services healthy
 * - 503 Service Unavailable: One or more services down
 *
 * Response format:
 * {
 *   status: 'healthy' | 'unhealthy',
 *   timestamp: ISO 8601 string,
 *   version: package.json version,
 *   uptime: process uptime in seconds,
 *   services: {
 *     supabase: 'up' | 'down',
 *     github: 'up' | 'down'
 *   },
 *   responseTime: milliseconds
 * }
 *
 * Usage:
 * - Configure UptimeRobot to monitor: https://yourdomain.com/api/health
 * - Expect 200 response for healthy, 503 for unhealthy
 * - Alert on consecutive failures (recommended: 3 failures over 5 minutes)
 *
 * Implementation Notes:
 * - Uses service role for Supabase (bypasses RLS for health check)
 * - GitHub API check uses unauthenticated endpoint (rate limit status)
 * - Response time measured from request start to response ready
 * - All checks run in parallel for minimal latency
 */

import type { APIRoute } from 'astro';
import { createSupabaseServerAdmin } from '@/lib/supabaseServerAdmin';

/**
 * Health check data structure
 */
interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    supabase: 'up' | 'down';
    github: 'up' | 'down';
  };
  responseTime: number;
}

/**
 * Check Supabase database connectivity
 *
 * Strategy: Execute a simple SELECT query on workspace_settings table
 * Uses service role to bypass RLS (health check should work regardless of auth)
 *
 * @returns 'up' if database is accessible, 'down' otherwise
 */
async function checkSupabase(): Promise<'up' | 'down'> {
  try {
    const supabaseAdmin = createSupabaseServerAdmin();
    // Simple query to verify database connectivity
    // Using count() to minimize data transfer
    const { error } = await supabaseAdmin
      .from('workspace_settings')
      .select('owner_id', { count: 'exact', head: true })
      .limit(1);

    // If no error, database is accessible
    return error ? 'down' : 'up';
  } catch (error) {
    console.error('[Health Check] Supabase check failed:', error);
    return 'down';
  }
}

/**
 * Check GitHub API connectivity
 *
 * Strategy: Hit the /rate_limit endpoint (unauthenticated, always available)
 * This verifies GitHub API is reachable without consuming authenticated rate limit
 *
 * @returns 'up' if GitHub API is accessible, 'down' otherwise
 */
async function checkGitHub(): Promise<'up' | 'down'> {
  try {
    // Use rate_limit endpoint - always available, no auth required
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'User-Agent': 'Workspace-by-Ali-HealthCheck'
      },
      // Timeout after 5 seconds to prevent hanging
      signal: AbortSignal.timeout(5000)
    });

    return response.ok ? 'up' : 'down';
  } catch (error) {
    console.error('[Health Check] GitHub API check failed:', error);
    return 'down';
  }
}

/**
 * GET /api/health
 *
 * Main health check endpoint handler
 */
export const GET: APIRoute = async () => {
  const startTime = Date.now();

  try {
    // Run all service checks in parallel for speed
    const [supabaseStatus, githubStatus] = await Promise.all([
      checkSupabase(),
      checkGitHub()
    ]);

    // Build health status response
    const health: HealthStatus = {
      status: (supabaseStatus === 'up' && githubStatus === 'up') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      uptime: process.uptime(),
      services: {
        supabase: supabaseStatus,
        github: githubStatus
      },
      responseTime: Date.now() - startTime
    };

    // Return 200 if all healthy, 503 if any service down
    const statusCode = health.status === 'healthy' ? 200 : 503;

    // Log unhealthy status for debugging
    if (health.status === 'unhealthy') {
      console.warn('[Health Check] System unhealthy:', {
        supabase: supabaseStatus,
        github: githubStatus
      });
    }

    return new Response(JSON.stringify(health, null, 2), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        // Prevent caching - health status should be real-time
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    // Catastrophic failure - return 503 with minimal info
    console.error('[Health Check] Fatal error:', error);

    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      responseTime: Date.now() - startTime
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
};
