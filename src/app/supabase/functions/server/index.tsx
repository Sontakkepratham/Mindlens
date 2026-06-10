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
import migrationApp from './migration-endpoints.tsx';

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

// Mount migration endpoints (product launch schema)
app.route('/make-server-aa629e1b/migration', migrationApp);

// Mount ML endpoints
app.route('/make-server-aa629e1b/ml', mlApp);

// Session booking endpoint
app.post('/make-server-aa629e1b/session-booking', async (c) => {
  try {
    const bookingData = await c.req.json();
    
    // Validate required fields
    if (!bookingData.sessionType || !bookingData.selectedDate || !bookingData.selectedTime || !bookingData.name || !bookingData.email || !bookingData.phone) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate unique booking ID
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store booking in KV store
    const bookingRecord = {
      id: bookingId,
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: 'confirmed', // confirmed, cancelled, completed, no-show
    };

    await kv.set(`session-booking:${bookingId}`, bookingRecord);
    
    // Also store in a list for easy retrieval
    const allBookings = await kv.get('session-booking:list') || [];
    allBookings.push(bookingId);
    await kv.set('session-booking:list', allBookings);

    console.log('✅ Session booked:', {
      id: bookingId,
      type: bookingData.sessionType,
      date: bookingData.selectedDate,
      time: bookingData.selectedTime,
      name: bookingData.name,
    });

    return c.json({ 
      success: true, 
      bookingId,
      message: 'Session booked successfully!' 
    });
  } catch (error: any) {
    console.error('❌ Session booking error:', error);
    return c.json({ error: error.message || 'Failed to book session' }, 500);
  }
});

// Get all session bookings (admin endpoint)
app.get('/make-server-aa629e1b/session-bookings', async (c) => {
  try {
    const bookingList = await kv.get('session-booking:list') || [];
    const bookings = [];

    for (const bookingId of bookingList) {
      const booking = await kv.get(`session-booking:${bookingId}`);
      if (booking) {
        bookings.push(booking);
      }
    }

    // Sort by date (newest first)
    bookings.sort((a, b) => new Date(b.selectedDate).getTime() - new Date(a.selectedDate).getTime());

    return c.json({ success: true, bookings });
  } catch (error: any) {
    console.error('❌ Failed to fetch bookings:', error);
    return c.json({ error: error.message || 'Failed to fetch bookings' }, 500);
  }
});

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
      '/make-server-aa629e1b/session-booking',
      '/make-server-aa629e1b/session-bookings',
    ],
  });
});

// Start the server
console.log('🚀 Starting MindLens API Server...');
Deno.serve(app.fetch);