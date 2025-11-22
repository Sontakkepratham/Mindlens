import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import * as bigquery from './bigquery-service.tsx';
import * as encryption from './encryption-service.tsx';
import mlApp from './ml-endpoints.tsx';
import checkApp from './deploy-check.tsx';
import authApp from './auth-endpoints.tsx';
import exportApp from './data-export-endpoints.tsx';
import unifiedDataApp from './unified-data-endpoints.tsx';
import chatApp from './chat-endpoints.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Mount status check endpoint (no dependencies)
app.route('/make-server-aa629e1b/check', checkApp);

// Mount auth endpoints
app.route('/make-server-aa629e1b/auth', authApp);

// Mount data export endpoints
app.route('/make-server-aa629e1b/export', exportApp);

// Mount unified data endpoints (Supabase + BigQuery)
app.route('/make-server-aa629e1b/data', unifiedDataApp);

// Mount chat endpoints (AI chatbot)
app.route('/make-server-aa629e1b/chat', chatApp);

// Mount ML endpoints
app.route('/make-server-aa629e1b/ml', mlApp);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'MindLens API Server',
  });
});

// Root endpoint
app.get('/', (c) => {
  return c.json({ 
    message: 'MindLens API Server',
    version: '1.0.0',
    endpoints: [
      '/make-server-aa629e1b/check',
      '/make-server-aa629e1b/auth',
      '/make-server-aa629e1b/export',
      '/make-server-aa629e1b/data',
      '/make-server-aa629e1b/chat',
      '/make-server-aa629e1b/ml',
    ],
  });
});

// Start the server
console.log('🚀 Starting MindLens API Server...');
Deno.serve(app.fetch);