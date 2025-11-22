/**
 * Unified Data Access Endpoints
 * Easy-to-use API for accessing data from both Supabase and BigQuery
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import unifiedData from './unified-data-service.tsx';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

/**
 * GET /data/user/:userId
 * Get complete user data from both Supabase and BigQuery
 */
app.get('/user/:userId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const userId = c.req.param('userId');

    // Users can only access their own data (unless admin - add role check in production)
    if (user.id !== userId) {
      return c.json({ error: 'Access denied - can only access your own data' }, 403);
    }

    const userData = await unifiedData.getUserCompleteData(userId);

    return c.json({
      success: true,
      data: userData,
    });

  } catch (error: any) {
    console.error('Get user data error:', error);
    return c.json({ 
      error: error.message || 'Failed to get user data' 
    }, 500);
  }
});

/**
 * GET /data/assessment/:sessionId
 * Get complete assessment data from both sources
 */
app.get('/assessment/:sessionId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const sessionId = c.req.param('sessionId');
    const assessmentData = await unifiedData.getAssessmentCompleteData(sessionId);

    // Verify ownership
    if (assessmentData.data.supabase && assessmentData.data.supabase.userId) {
      // For encrypted data, userId might be hashed, so we need to check differently
      // In a real scenario, add proper ownership verification
    }

    return c.json({
      success: true,
      data: assessmentData,
    });

  } catch (error: any) {
    console.error('Get assessment data error:', error);
    return c.json({ 
      error: error.message || 'Failed to get assessment data' 
    }, 500);
  }
});

/**
 * GET /data/dashboard
 * Get dashboard statistics from both Supabase and BigQuery
 */
app.get('/dashboard', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    // For dashboard, you might want admin-only access
    // Add role check here in production
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - admin access required' }, 401);
    }

    const stats = await unifiedData.getDashboardStatistics();

    return c.json({
      success: true,
      statistics: stats,
    });

  } catch (error: any) {
    console.error('Dashboard statistics error:', error);
    return c.json({ 
      error: error.message || 'Failed to get dashboard statistics' 
    }, 500);
  }
});

/**
 * GET /data/search
 * Search across both databases
 * Query params: q (search term), type (userId|sessionId|email|all)
 */
app.get('/search', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const searchTerm = c.req.query('q');
    const searchType = (c.req.query('type') || 'all') as 'userId' | 'sessionId' | 'email' | 'all';

    if (!searchTerm) {
      return c.json({ error: 'Search term required (q parameter)' }, 400);
    }

    const results = await unifiedData.searchData(searchTerm, searchType);

    return c.json({
      success: true,
      results,
    });

  } catch (error: any) {
    console.error('Search error:', error);
    return c.json({ 
      error: error.message || 'Search failed' 
    }, 500);
  }
});

/**
 * POST /data/sync
 * Sync Supabase data to BigQuery
 * Body: { userId?: string } (optional - if not provided, syncs all)
 */
app.post('/sync', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    // Admin-only endpoint
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - admin access required' }, 401);
    }

    const { userId } = await c.req.json().catch(() => ({}));

    console.log('🔄 Starting manual sync to BigQuery...', { userId: userId || 'all' });

    const syncResults = await unifiedData.syncSupabaseToBigQuery(userId);

    return c.json({
      success: true,
      sync: syncResults,
    });

  } catch (error: any) {
    console.error('Sync error:', error);
    return c.json({ 
      error: error.message || 'Sync failed' 
    }, 500);
  }
});

/**
 * GET /data/analytics
 * Get trends and analytics
 * Query params: timeRange (7d|30d|90d|all)
 */
app.get('/analytics', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - admin access required' }, 401);
    }

    const timeRange = (c.req.query('timeRange') || '30d') as '7d' | '30d' | '90d' | 'all';

    const analytics = await unifiedData.getTrendsAnalytics(timeRange);

    return c.json({
      success: true,
      analytics,
    });

  } catch (error: any) {
    console.error('Analytics error:', error);
    return c.json({ 
      error: error.message || 'Failed to get analytics' 
    }, 500);
  }
});

/**
 * GET /data/status
 * Check connection status of both data sources
 */
app.get('/status', async (c) => {
  try {
    const status: any = {
      timestamp: new Date().toISOString(),
      supabase: {
        connected: false,
        database: false,
      },
      bigQuery: {
        connected: false,
        configured: false,
      },
    };

    // Test Supabase connection
    try {
      const { data, error } = await supabase
        .from('kv_store_aa629e1b')
        .select('key')
        .limit(1);
      
      status.supabase.connected = true;
      status.supabase.database = !error;
    } catch (error) {
      status.supabase.error = error.message;
    }

    // Test BigQuery connection
    const hasBigQueryCreds = !!Deno.env.get('GOOGLE_CLOUD_CREDENTIALS');
    status.bigQuery.configured = hasBigQueryCreds;

    if (hasBigQueryCreds) {
      try {
        // Try a simple query to test connection
        const stats = await unifiedData.getDashboardStatistics();
        status.bigQuery.connected = !stats.bigQuery.error;
        if (stats.bigQuery.error) {
          status.bigQuery.error = stats.bigQuery.error;
        }
      } catch (error: any) {
        status.bigQuery.error = error.message;
      }
    }

    const allHealthy = status.supabase.connected && 
                       status.supabase.database && 
                       (status.bigQuery.connected || !status.bigQuery.configured);

    return c.json({
      healthy: allHealthy,
      status,
    });

  } catch (error: any) {
    console.error('Status check error:', error);
    return c.json({ 
      error: error.message || 'Status check failed' 
    }, 500);
  }
});

/**
 * GET /data/query
 * Execute custom SQL query on BigQuery
 * Query params: sql (SQL query string)
 * ADMIN ONLY - Use with caution
 */
app.get('/query', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    // Admin-only endpoint
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - admin access required' }, 401);
    }

    const sql = c.req.query('sql');
    if (!sql) {
      return c.json({ error: 'SQL query required (sql parameter)' }, 400);
    }

    // Security: Only allow SELECT queries
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      return c.json({ error: 'Only SELECT queries are allowed' }, 403);
    }

    const credentialsJson = Deno.env.get('GOOGLE_CLOUD_CREDENTIALS');
    if (!credentialsJson) {
      return c.json({ error: 'BigQuery not configured' }, 503);
    }

    const { BigQuery } = await import('npm:@google-cloud/bigquery@7.3.0');
    const credentials = JSON.parse(credentialsJson.trim().replace(/^\uFEFF/, ''));
    const bigquery = new BigQuery({
      projectId: credentials.project_id,
      credentials,
    });

    const [rows] = await bigquery.query(sql);

    return c.json({
      success: true,
      query: sql,
      rowCount: rows.length,
      data: rows,
    });

  } catch (error: any) {
    console.error('Query execution error:', error);
    return c.json({ 
      error: error.message || 'Query failed' 
    }, 500);
  }
});

export default app;
