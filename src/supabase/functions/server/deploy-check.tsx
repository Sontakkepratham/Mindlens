/**
 * Simple deployment check endpoint
 * Returns server status without requiring any external dependencies
 */

import { Hono } from 'npm:hono';

const checkApp = new Hono();

checkApp.get('/status', (c) => {
  return c.json({
    status: 'operational',
    service: 'MindLens Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: {
      supabase: true,
      bigquery: !!Deno.env.get('GOOGLE_CLOUD_CREDENTIALS'),
      vertex_ai: !!Deno.env.get('GOOGLE_CLOUD_CREDENTIALS'),
    },
  });
});

export default checkApp;
