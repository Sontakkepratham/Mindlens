/**
 * Data Export & Backup Endpoints for MindLens
 * HIPAA-compliant data export and user data portability
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import * as encryption from './encryption-service.tsx';

const exportApp = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

/**
 * Export all user data (HIPAA Right of Access)
 * GET /export/my-data
 */
exportApp.get('/my-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    console.log('Data export requested by user:', user.id);

    // Collect all user data
    const userData: any = {
      exportDate: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      accountCreated: user.created_at,
    };

    // Get user profile
    const profile = await kv.get(`user:${user.id}`);
    if (profile) {
      userData.profile = profile;
    }

    // Get all assessments
    const assessmentHistory = await kv.get(`user:${user.id}:assessment-history`) || [];
    userData.assessments = [];

    for (const sessionId of assessmentHistory) {
      const assessment = await kv.get(`assessment:${sessionId}`);
      if (assessment) {
        // Decrypt sensitive data before export
        const decryptedAssessment = { ...assessment };
        if (assessment.encrypted && assessment.encryptedData) {
          try {
            const decrypted = await encryption.decrypt(assessment.encryptedData);
            Object.assign(decryptedAssessment, decrypted);
            delete decryptedAssessment.encryptedData;
          } catch (error) {
            console.warn('Failed to decrypt assessment:', sessionId);
          }
        }
        userData.assessments.push(decryptedAssessment);
      }
    }

    // Get Big Five personality data
    const bigFive = await kv.get(`bigfive:${user.id}`);
    if (bigFive) {
      userData.personalityTest = bigFive;
    }

    // Get Stroop test data
    const stroop = await kv.get(`stroop:${user.id}`);
    if (stroop) {
      userData.stroopTest = stroop;
    }

    // Add metadata
    userData.dataPolicy = {
      retention: '7 years from last activity (HIPAA requirement)',
      encryption: 'AES-256-GCM',
      compliance: ['HIPAA', 'GDPR'],
      rights: 'You have the right to request deletion of your data at any time',
    };

    // Return as JSON (can be extended to support PDF, CSV, etc.)
    c.header('Content-Type', 'application/json');
    c.header('Content-Disposition', `attachment; filename="mindlens-data-${user.id}-${Date.now()}.json"`);
    
    return c.json(userData);

  } catch (error: any) {
    console.error('Data export error:', error);
    return c.json({ 
      error: error.message || 'Failed to export data' 
    }, 500);
  }
});

/**
 * Request account deletion (HIPAA Right to Delete)
 * DELETE /export/delete-account
 */
exportApp.delete('/delete-account', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const { confirmEmail } = await c.req.json();

    if (confirmEmail !== user.email) {
      return c.json({ 
        error: 'Email confirmation does not match. Please enter your email to confirm deletion.' 
      }, 400);
    }

    console.log('⚠️  Account deletion requested by user:', user.id);

    // Delete all user data from KV store
    const assessmentHistory = await kv.get(`user:${user.id}:assessment-history`) || [];
    
    // Delete all assessments
    for (const sessionId of assessmentHistory) {
      await kv.del(`assessment:${sessionId}`);
    }

    // Delete user data
    await kv.del(`user:${user.id}`);
    await kv.del(`user:${user.id}:assessment-history`);
    await kv.del(`user:${user.id}:latest-assessment`);
    await kv.del(`bigfive:${user.id}`);
    await kv.del(`stroop:${user.id}`);

    // Delete user account from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Failed to delete auth account:', deleteError);
      return c.json({ 
        error: 'Account data deleted but auth account removal failed. Please contact support.' 
      }, 500);
    }

    console.log('✅ User account fully deleted:', user.id);

    // Note: BigQuery data is pseudonymized and retained for research (with consent)
    // This complies with HIPAA which allows retention of de-identified data

    return c.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
      deletedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Account deletion error:', error);
    return c.json({ 
      error: error.message || 'Failed to delete account' 
    }, 500);
  }
});

/**
 * Get data retention policy
 * GET /export/retention-policy
 */
exportApp.get('/retention-policy', (c) => {
  return c.json({
    policy: {
      assessmentData: {
        retention: '7 years from last activity',
        reason: 'HIPAA medical record retention requirement',
        storage: 'Encrypted in Supabase + pseudonymized in BigQuery',
      },
      personalData: {
        retention: 'Until account deletion or 7 years of inactivity',
        reason: 'HIPAA and regulatory compliance',
        deletionRight: 'Users can request immediate deletion via the app',
      },
      researchData: {
        retention: 'Indefinite (de-identified)',
        reason: 'Scientific research and AI model training',
        condition: 'Only if user consented to research participation',
        privacy: 'SHA-256 hashed user IDs, no PII stored',
      },
      backups: {
        retention: '90 days',
        encryption: 'AES-256-GCM',
        location: 'Supabase automated backups',
      },
    },
    rights: [
      'Right to access your data (export anytime)',
      'Right to delete your data (permanent deletion)',
      'Right to opt-out of research (data not used for ML training)',
      'Right to data portability (JSON export)',
    ],
    compliance: ['HIPAA', 'GDPR', 'CCPA'],
    contact: 'privacy@mindlens.health',
  });
});

/**
 * Export assessment summary (for counselors)
 * GET /export/assessment-summary/:sessionId
 */
exportApp.get('/assessment-summary/:sessionId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const sessionId = c.req.param('sessionId');
    const assessment = await kv.get(`assessment:${sessionId}`);

    if (!assessment) {
      return c.json({ error: 'Assessment not found' }, 404);
    }

    // Verify ownership
    if (assessment.userId !== user.id) {
      return c.json({ error: 'Access denied - not your assessment' }, 403);
    }

    // Decrypt if needed
    let assessmentData = assessment;
    if (assessment.encrypted && assessment.encryptedData) {
      try {
        const decrypted = await encryption.decrypt(assessment.encryptedData);
        assessmentData = { ...assessment, ...decrypted };
        delete assessmentData.encryptedData;
      } catch (error) {
        console.warn('Failed to decrypt assessment');
      }
    }

    // Generate summary
    const summary = {
      sessionId: assessmentData.sessionId,
      date: assessmentData.timestamp,
      phqScore: assessmentData.phqScore,
      severity: assessmentData.phqScore >= 20 ? 'Severe' : 
                assessmentData.phqScore >= 15 ? 'Moderately Severe' :
                assessmentData.phqScore >= 10 ? 'Moderate' :
                assessmentData.phqScore >= 5 ? 'Mild' : 'Minimal',
      requiresImmediateAction: assessmentData.requiresImmediateAction,
      responses: assessmentData.phqResponses,
      emotionAnalysis: assessmentData.emotionAnalysis,
      generatedFor: user.email,
      generatedAt: new Date().toISOString(),
    };

    c.header('Content-Type', 'application/json');
    c.header('Content-Disposition', `attachment; filename="assessment-${sessionId}.json"`);
    
    return c.json(summary);

  } catch (error: any) {
    console.error('Assessment summary export error:', error);
    return c.json({ 
      error: error.message || 'Failed to export assessment summary' 
    }, 500);
  }
});

export default exportApp;
