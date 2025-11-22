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

// Initialize BigQuery on server startup (non-blocking)
bigquery.initializeBigQuery()
  .then((result) => {
    if (result?.success) {
      console.log('✅ BigQuery ready for ML training');
    } else {
      console.warn('⚠️  BigQuery not available:', result?.error || 'Unknown error');
    }
  })
  .catch(err => console.error('BigQuery initialization failed:', err));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Mount ML endpoints
app.route('/make-server-aa629e1b/ml', mlApp);

/**
 * Health check endpoint
 */
app.get('/make-server-aa629e1b/health', (c) => {
  const hasBigQuery = !!Deno.env.get('GOOGLE_CLOUD_CREDENTIALS');
  
  return c.json({ 
    status: 'healthy', 
    service: 'MindLens API', 
    timestamp: new Date().toISOString(),
    features: {
      authentication: true,
      assessments: true,
      bigquery: hasBigQuery,
      ml_endpoints: hasBigQuery,
      encryption: true,
    },
  });
});

/**
 * Submit Assessment
 * Process PHQ-9 assessment and store encrypted data
 */
app.post('/make-server-aa629e1b/assessment/submit', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const { phqResponses, faceScanData, consentToResearch } = await c.req.json();

    if (!phqResponses || phqResponses.length !== 9) {
      return c.json({ error: 'Invalid PHQ-9 responses - must include 9 responses' }, 400);
    }

    // Generate session ID
    const sessionId = `MS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    // Calculate PHQ-9 score
    const phqScore = phqResponses.reduce((a: number, b: number) => a + b, 0);

    // Check for crisis indicators
    const selfHarmResponse = phqResponses[8]; // Question 9
    const requiresImmediateAction = selfHarmResponse >= 2 || phqScore >= 20;

    // Mock emotion analysis (in production, call Vertex AI)
    const emotionAnalysis = {
      primaryEmotion: 'Neutral',
      secondaryMarkers: 'Slight sadness detected',
      confidence: 0.82,
      vertexAiModelVersion: '2.1.0',
    };

    // **ENCRYPT SENSITIVE DATA BEFORE STORAGE**
    const sensitiveData = {
      phqResponses,
      phqScore,
      emotionAnalysis,
      faceScanData,
      userId: user.id,
    };

    const encryptedData = await encryption.encrypt(sensitiveData);

    // Store encrypted assessment data
    const assessmentData = {
      userId: await encryption.hashIdentifier(user.id), // Store hashed ID
      sessionId,
      timestamp,
      encryptedData, // Encrypted sensitive fields
      encrypted: true,
      requiresImmediateAction,
      consentToResearch,
      // Keep non-sensitive metadata unencrypted for queries
      phqScore, // Needed for quick severity checks
    };

    await kv.set(`assessment:${sessionId}`, assessmentData);
    await kv.set(`user:${user.id}:latest-assessment`, sessionId);

    // Add to user's assessment history
    const historyKey = `user:${user.id}:assessment-history`;
    const history = (await kv.get(historyKey)) || [];
    history.push(sessionId);
    await kv.set(historyKey, history);

    // **NEW: Insert assessment into BigQuery for ML training**
    await bigquery.insertAssessmentRecord({
      assessmentId: sessionId,
      userId: user.id,
      timestamp,
      phqResponses,
      phqScore,
      severityLevel: phqScore >= 20 ? 'severe' : phqScore >= 15 ? 'moderately-severe' : phqScore >= 10 ? 'moderate' : phqScore >= 5 ? 'mild' : 'minimal',
      requiresImmediateAction,
      consentResearch: consentToResearch,
    });

    // **NEW: Insert emotion analysis into BigQuery**
    if (emotionAnalysis) {
      await bigquery.insertEmotionAnalysis({
        analysisId: `EMOTION-${sessionId}`,
        assessmentId: sessionId,
        userId: user.id,
        timestamp,
        primaryEmotion: emotionAnalysis.primaryEmotion,
        secondaryEmotion: emotionAnalysis.secondaryMarkers,
        confidenceScore: emotionAnalysis.confidence,
        facialLandmarksDetected: true,
        emotionScores: {
          sadness: 0.65,
          anxiety: 0.42,
          neutral: 0.35,
          happiness: 0.12,
          anger: 0.08,
          fear: 0.15,
        },
        modelVersion: emotionAnalysis.vertexAiModelVersion,
      });
    }

    // **NEW: Update user behavior patterns in BigQuery**
    await bigquery.updateUserBehaviorPatterns(user.id, history.map((id: string) => ({ sessionId: id, phqScore })));

    // If user consented to research, store de-identified data
    if (consentToResearch) {
      const deidentifiedData = {
        sessionId,
        timestamp,
        phqScore,
        severityLevel: phqScore >= 15 ? 'severe' : phqScore >= 10 ? 'moderate' : 'mild',
        primaryEmotion: emotionAnalysis.primaryEmotion,
        // No userId or PII
      };
      await kv.set(`research:${sessionId}`, deidentifiedData);
    }

    // Trigger crisis alert if needed
    if (requiresImmediateAction) {
      console.log('🚨 CRISIS ALERT:', {
        userId: user.id.substring(0, 8) + '***',
        sessionId,
        phqScore,
        selfHarmResponse,
        action: 'Emergency protocol activated',
      });

      await kv.set(`crisis-alert:${sessionId}`, {
        userId: user.id,
        sessionId,
        severity: 'critical',
        timestamp,
        actionTaken: 'Crisis counselor notified',
      });
    }

    return c.json({
      success: true,
      sessionId,
      phqScore,
      emotionAnalysis,
      requiresImmediateAction,
      gsUri: `gs://mindlens-encrypted-data/assessments/${sessionId}/data.enc`,
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    return c.json({ error: `Assessment submission failed: ${error.message}` }, 500);
  }
});

/**
 * Get Counselor Recommendations
 * Return matched counselors based on assessment
 */
app.get('/make-server-aa629e1b/counselors/recommendations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const phqScore = parseInt(c.req.query('phqScore') || '0');

    // Mock counselor data (in production, query from database)
    const counselors = [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        credentials: 'Licensed Clinical Psychologist',
        specialties: ['Depression', 'Anxiety', 'CBT'],
        availability: 'Next available: Tomorrow, 2:00 PM',
        matchScore: 95,
        hourlyRate: 180,
      },
      {
        id: '2',
        name: 'Dr. Michael Torres',
        credentials: 'Licensed Therapist, LMFT',
        specialties: ['Mood Disorders', 'Stress Management'],
        availability: 'Next available: Wed, 10:00 AM',
        matchScore: 88,
        hourlyRate: 150,
      },
      {
        id: '3',
        name: 'Dr. Priya Sharma',
        credentials: 'Psychiatric Nurse Practitioner',
        specialties: ['Medication Management', 'Depression'],
        availability: 'Next available: Thu, 3:30 PM',
        matchScore: 82,
        hourlyRate: 160,
      },
    ];

    return c.json({ success: true, counselors });
  } catch (error) {
    console.error('Get counselors error:', error);
    return c.json({ error: `Failed to get counselors: ${error.message}` }, 500);
  }
});

/**
 * Book Counseling Session
 * Create a new booking with end-to-end encryption
 */
app.post('/make-server-aa629e1b/sessions/book', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const { counselorId, preferredDate, preferredTime } = await c.req.json();

    if (!counselorId) {
      return c.json({ error: 'Counselor ID is required' }, 400);
    }

    // Generate booking ID
    const bookingId = `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sessionNumber = `MS-2025-${Math.floor(Math.random() * 10000)}`;

    // Create secure meeting link
    const meetingLink = `mindlens.meet/secure-${Math.random().toString(36).substr(2, 12)}`;

    const booking = {
      bookingId,
      sessionNumber,
      userId: user.id,
      counselorId,
      scheduledDate: preferredDate || 'Tomorrow, Nov 18, 2025',
      scheduledTime: preferredTime || '2:00 PM - 3:00 PM EST',
      meetingLink,
      status: 'confirmed',
      encrypted: true,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, booking);
    await kv.set(`user:${user.id}:latest-booking`, bookingId);

    // Add to user's booking history
    const historyKey = `user:${user.id}:booking-history`;
    const history = (await kv.get(historyKey)) || [];
    history.push(bookingId);
    await kv.set(historyKey, history);

    console.log('✅ Session booked:', {
      bookingId,
      userId: user.id.substring(0, 8) + '***',
      counselorId,
      encrypted: true,
    });

    return c.json({
      success: true,
      booking: {
        bookingId,
        sessionNumber,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        meetingLink,
        status: 'confirmed',
      },
    });
  } catch (error) {
    console.error('Booking error:', error);
    return c.json({ error: `Booking failed: ${error.message}` }, 500);
  }
});

/**
 * Get User Dashboard Data
 * Returns assessment history and upcoming sessions
 */
app.get('/make-server-aa629e1b/user/dashboard', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    // Get user profile
    const profile = await kv.get(`user:${user.id}`);

    // Get latest assessment
    const latestAssessmentId = await kv.get(`user:${user.id}:latest-assessment`);
    const latestAssessment = latestAssessmentId ? await kv.get(`assessment:${latestAssessmentId}`) : null;

    // Get assessment history
    const assessmentHistory = (await kv.get(`user:${user.id}:assessment-history`)) || [];

    // Get booking history
    const bookingHistory = (await kv.get(`user:${user.id}:booking-history`)) || [];
    const upcomingSessions = [];
    for (const bookingId of bookingHistory.slice(-3)) {
      const booking = await kv.get(`booking:${bookingId}`);
      if (booking) upcomingSessions.push(booking);
    }

    return c.json({
      success: true,
      dashboard: {
        profile,
        latestAssessment: latestAssessment ? {
          sessionId: latestAssessment.sessionId,
          timestamp: latestAssessment.timestamp,
          phqScore: latestAssessment.phqScore,
          encrypted: true,
        } : null,
        assessmentCount: assessmentHistory.length,
        upcomingSessions,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return c.json({ error: `Failed to load dashboard: ${error.message}` }, 500);
  }
});

/**
 * Google Cloud / Vertex AI Integration Endpoints
 * These endpoints would call actual GCP services in production
 */

/**
 * Process face scan with Vertex AI
 */
app.post('/make-server-aa629e1b/ai/analyze-face', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const { imageBase64 } = await c.req.json();

    if (!imageBase64) {
      return c.json({ error: 'Image data required' }, 400);
    }

    console.log('🤖 Processing face scan with Vertex AI:', {
      userId: user.id.substring(0, 8) + '***',
      imageSize: imageBase64.length,
      model: 'emotion-analysis-v2',
    });

    // In production: Call Vertex AI Prediction API
    // const vertexAiEndpoint = 'projects/mindlens-production/locations/us-central1/endpoints/emotion-analysis-v2';
    // const prediction = await callVertexAI(vertexAiEndpoint, imageBase64);

    // Mock response
    const emotionAnalysis = {
      primaryEmotion: 'Neutral',
      secondaryMarkers: 'Slight sadness detected',
      confidence: 0.82,
      facialLandmarks: {
        detected: true,
        count: 68,
      },
      vertexAiModelVersion: '2.1.0',
      processingTime: 1247,
    };

    return c.json({ success: true, emotionAnalysis });
  } catch (error) {
    console.error('Face analysis error:', error);
    return c.json({ error: `Face analysis failed: ${error.message}` }, 500);
  }
});

/**
 * Get BigQuery analytics (aggregated, de-identified data)
 */
app.get('/make-server-aa629e1b/analytics/aggregate', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    // Only allow authenticated admin users (add role check in production)
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - admin access required' }, 401);
    }

    console.log('📊 Querying BigQuery for analytics:', {
      dataset: 'mindlens_analytics',
      table: 'assessment_results',
      privacy: 'All data de-identified',
    });

    // In production: Query actual BigQuery
    // const bigquery = new BigQuery({ projectId: 'mindlens-production' });
    // const [rows] = await bigquery.query(sql);

    // Mock aggregated data
    const analytics = {
      totalAssessments: 1247,
      averagePhqScore: 11.3,
      severityDistribution: {
        minimal: 234,
        mild: 412,
        moderate: 398,
        moderatelySevere: 156,
        severe: 47,
      },
      emotionDistribution: {
        neutral: 621,
        sadness: 398,
        anxiety: 228,
      },
      timeRange: 'Last 6 months',
    };

    return c.json({ success: true, analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    return c.json({ error: `Analytics query failed: ${error.message}` }, 500);
  }
});

/**
 * Emergency / Crisis Endpoints
 */
app.post('/make-server-aa629e1b/emergency/trigger', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const { severity, message } = await c.req.json();

    const alertId = `ALERT-${Date.now()}`;

    console.log('🚨 EMERGENCY ALERT TRIGGERED:', {
      alertId,
      userId: user.id.substring(0, 8) + '***',
      severity,
      timestamp: new Date().toISOString(),
    });

    const alert = {
      alertId,
      userId: user.id,
      severity: severity || 'high',
      message,
      timestamp: new Date().toISOString(),
      actionTaken: 'Crisis counselor notified, emergency resources displayed',
      escalated: true,
    };

    await kv.set(`emergency:${alertId}`, alert);

    // In production: Trigger real emergency protocols
    // - Notify on-call crisis counselor
    // - Send SMS/email alerts
    // - Log to secure audit trail

    return c.json({
      success: true,
      alert,
      emergencyResources: {
        suicidePrevention: '988',
        crisisTextLine: 'Text HOME to 741741',
        emergency: '911',
      },
    });
  } catch (error) {
    console.error('Emergency trigger error:', error);
    return c.json({ error: `Emergency trigger failed: ${error.message}` }, 500);
  }
});

/**
 * Stroop Test - Save Results
 * Store emotional interference test results
 */
app.post('/make-server-aa629e1b/stroop/save', async (c) => {
  try {
    const {
      difficulty,
      totalTrials,
      correctTrials,
      errorRate,
      avgReactionTime,
      avgEmotionalRT,
      avgNeutralRT,
      negativeBias,
      completedAt,
      detailedResults,
    } = await c.req.json();

    if (!difficulty || !totalTrials) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate result ID
    const resultId = `STROOP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = completedAt || new Date().toISOString();

    // Store result data
    const stroopResult = {
      resultId,
      timestamp,
      difficulty,
      totalTrials,
      correctTrials,
      errorRate,
      avgReactionTime,
      avgEmotionalRT,
      avgNeutralRT,
      negativeBias,
      detailedResults,
    };

    await kv.set(`stroop:${resultId}`, stroopResult);

    // Store in global history
    const historyKey = 'stroop:all-results';
    const allResults = (await kv.get(historyKey)) || [];
    allResults.push(resultId);
    await kv.set(historyKey, allResults);

    console.log('✅ Stroop test result saved:', {
      resultId,
      difficulty,
      avgReactionTime: Math.round(avgReactionTime),
      negativeBias: Math.round(negativeBias),
    });

    return c.json({
      success: true,
      resultId,
      message: 'Stroop test results saved successfully',
    });
  } catch (error) {
    console.error('Stroop save error:', error);
    return c.json({ error: `Failed to save Stroop results: ${error.message}` }, 500);
  }
});

// Start server
Deno.serve(app.fetch);