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
import aiInsightsApp from './ai-insights-endpoints.tsx';
import adminApp from './admin-endpoints.tsx';

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

// Mount AI insights endpoints (assessment analysis)
app.route('/make-server-aa629e1b/ai-insights', aiInsightsApp);

// Mount admin endpoints (secret settings)
app.route('/make-server-aa629e1b/admin', adminApp);

// Mount ML endpoints
app.route('/make-server-aa629e1b/ml', mlApp);

// Referral endpoint
app.post('/make-server-aa629e1b/referral', async (c) => {
  try {
    const referralData = await c.req.json();
    
    // Validate required fields
    if (!referralData.referrerName || !referralData.referredName || !referralData.referredEmail || !referralData.reason) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate unique referral ID
    const referralId = `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store referral in KV store
    const referralRecord = {
      id: referralId,
      ...referralData,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, contacted, completed, declined
    };

    await kv.set(`referral:${referralId}`, referralRecord);
    
    // Also store in a list for easy retrieval
    const allReferrals = await kv.get('referral:list') || [];
    allReferrals.push(referralId);
    await kv.set('referral:list', allReferrals);

    console.log('✅ Referral submitted:', {
      id: referralId,
      referrer: referralData.referrerName,
      referred: referralData.referredName,
      urgency: referralData.urgency,
    });

    return c.json({ 
      success: true, 
      referralId,
      message: 'Referral submitted successfully. Our team will reach out within 24-48 hours.' 
    });
  } catch (error: any) {
    console.error('❌ Referral submission error:', error);
    return c.json({ error: error.message || 'Failed to submit referral' }, 500);
  }
});

// Get all referrals (admin endpoint)
app.get('/make-server-aa629e1b/referrals', async (c) => {
  try {
    const referralList = await kv.get('referral:list') || [];
    const referrals = [];

    for (const refId of referralList) {
      const referral = await kv.get(`referral:${refId}`);
      if (referral) {
        referrals.push(referral);
      }
    }

    // Sort by createdAt (newest first)
    referrals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, referrals });
  } catch (error: any) {
    console.error('❌ Failed to fetch referrals:', error);
    return c.json({ error: error.message || 'Failed to fetch referrals' }, 500);
  }
});

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
      '/make-server-aa629e1b/ai-insights',
      '/make-server-aa629e1b/ml',
      '/make-server-aa629e1b/referral',
      '/make-server-aa629e1b/referrals',
    ],
  });
});

// Start the server
console.log('🚀 Starting MindLens API Server...');
Deno.serve(app.fetch);