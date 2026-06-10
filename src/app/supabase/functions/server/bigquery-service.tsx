/**
 * BigQuery Service for MindLens
 * Stores all assessment data for ML training and AI agent learning
 */

import { BigQuery } from 'npm:@google-cloud/bigquery@7.3.0';

// Initialize BigQuery client with service account credentials
function initBigQueryClient(): BigQuery | null {
  const credentialsJson = Deno.env.get('GOOGLE_CLOUD_CREDENTIALS');
  
  if (!credentialsJson) {
    // Silent warning - admin can check server logs if needed
    return null;
  }

  try {
    // Clean the credentials string (remove BOM, trim whitespace)
    const cleanJson = credentialsJson.trim().replace(/^\uFEFF/, '');
    
    // Check if it looks like valid JSON
    if (!cleanJson.startsWith('{')) {
      // Invalid format - return null silently
      return null;
    }
    
    // Try to parse the credentials
    const credentials = JSON.parse(cleanJson);
    
    // Validate required fields
    if (!credentials.project_id || !credentials.private_key || !credentials.client_email) {
      return null;
    }
    
    console.log('✅ BigQuery initialized for project:', credentials.project_id);
    
    return new BigQuery({
      projectId: credentials.project_id,
      credentials: credentials,
    });
  } catch (error) {
    // Parse error - return null silently
    return null;
  }
}

const bigquery = initBigQueryClient();

// BigQuery configuration
const PROJECT_ID = 'mindlens-production'; // Replace with your GCP project ID
const DATASET_ID = 'mindlens_ml_training';

/**
 * Ensure BigQuery dataset and tables exist
 */
export async function initializeBigQuery() {
  if (!bigquery) {
    console.warn('⚠️  BigQuery not initialized - skipping table setup');
    return { success: false, error: 'BigQuery credentials not configured' };
  }

  try {
    // Create dataset if it doesn't exist
    const dataset = bigquery.dataset(DATASET_ID);
    const [datasetExists] = await dataset.exists();
    
    if (!datasetExists) {
      console.log('Creating BigQuery dataset:', DATASET_ID);
      await bigquery.createDataset(DATASET_ID, {
        location: 'US',
        description: 'MindLens ML training data - encrypted and pseudonymized',
      });
    }

    // Create tables
    await createAssessmentTable();
    await createEmotionAnalysisTable();
    await createUserBehaviorTable();
    await createSessionOutcomesTable();

    console.log('✅ BigQuery initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('BigQuery initialization error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create assessment_records table
 */
async function createAssessmentTable() {
  if (!bigquery) return;

  const schema = [
    { name: 'assessment_id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'user_hash', type: 'STRING', mode: 'REQUIRED' }, // SHA-256 hash of user_id
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
    { name: 'phq9_q1', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_q2', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_q3', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_q4', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_q5', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_q6', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_q7', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_q8', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_q9', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'phq9_total_score', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'severity_level', type: 'STRING', mode: 'REQUIRED' },
    { name: 'requires_immediate_action', type: 'BOOLEAN', mode: 'REQUIRED' },
    { name: 'age_range', type: 'STRING', mode: 'NULLABLE' },
    { name: 'gender', type: 'STRING', mode: 'NULLABLE' },
    { name: 'timezone', type: 'STRING', mode: 'NULLABLE' },
    { name: 'consent_research', type: 'BOOLEAN', mode: 'REQUIRED' },
  ];

  await createTableIfNotExists('assessment_records', schema, {
    timePartitioning: {
      type: 'DAY',
      field: 'timestamp',
    },
    clustering: {
      fields: ['severity_level', 'user_hash'],
    },
  });
}

/**
 * Create emotion_analysis table
 */
async function createEmotionAnalysisTable() {
  if (!bigquery) return;

  const schema = [
    { name: 'analysis_id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'assessment_id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'user_hash', type: 'STRING', mode: 'REQUIRED' },
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
    { name: 'primary_emotion', type: 'STRING', mode: 'REQUIRED' },
    { name: 'secondary_emotion', type: 'STRING', mode: 'NULLABLE' },
    { name: 'confidence_score', type: 'FLOAT', mode: 'REQUIRED' },
    { name: 'facial_landmarks_detected', type: 'BOOLEAN', mode: 'REQUIRED' },
    { name: 'sadness_score', type: 'FLOAT', mode: 'NULLABLE' },
    { name: 'anxiety_score', type: 'FLOAT', mode: 'NULLABLE' },
    { name: 'neutral_score', type: 'FLOAT', mode: 'NULLABLE' },
    { name: 'happiness_score', type: 'FLOAT', mode: 'NULLABLE' },
    { name: 'anger_score', type: 'FLOAT', mode: 'NULLABLE' },
    { name: 'fear_score', type: 'FLOAT', mode: 'NULLABLE' },
    { name: 'vertex_ai_model_version', type: 'STRING', mode: 'REQUIRED' },
  ];

  await createTableIfNotExists('emotion_analysis', schema, {
    timePartitioning: {
      type: 'DAY',
      field: 'timestamp',
    },
  });
}

/**
 * Create user_behavior_patterns table
 */
async function createUserBehaviorTable() {
  if (!bigquery) return;

  const schema = [
    { name: 'behavior_id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'user_hash', type: 'STRING', mode: 'REQUIRED' },
    { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
    { name: 'assessment_count', type: 'INTEGER', mode: 'REQUIRED' },
    { name: 'days_between_assessments', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'score_trend', type: 'STRING', mode: 'NULLABLE' }, // improving, declining, stable
    { name: 'engagement_level', type: 'STRING', mode: 'NULLABLE' }, // high, medium, low
    { name: 'session_count', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'last_session_days_ago', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'crisis_alerts_count', type: 'INTEGER', mode: 'NULLABLE' },
  ];

  await createTableIfNotExists('user_behavior_patterns', schema, {
    timePartitioning: {
      type: 'DAY',
      field: 'timestamp',
    },
  });
}

/**
 * Create session_outcomes table
 */
async function createSessionOutcomesTable() {
  if (!bigquery) return;

  const schema = [
    { name: 'session_id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'user_hash', type: 'STRING', mode: 'REQUIRED' },
    { name: 'counselor_hash', type: 'STRING', mode: 'REQUIRED' },
    { name: 'session_date', type: 'TIMESTAMP', mode: 'REQUIRED' },
    { name: 'pre_session_phq9', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'post_session_phq9', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'score_improvement', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'session_duration_minutes', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'user_satisfaction_rating', type: 'INTEGER', mode: 'NULLABLE' },
    { name: 'follow_up_scheduled', type: 'BOOLEAN', mode: 'NULLABLE' },
  ];

  await createTableIfNotExists('session_outcomes', schema, {
    timePartitioning: {
      type: 'DAY',
      field: 'session_date',
    },
  });
}

/**
 * Helper function to create table if it doesn't exist
 */
async function createTableIfNotExists(tableName: string, schema: any[], options: any = {}) {
  if (!bigquery) return;

  try {
    const table = bigquery.dataset(DATASET_ID).table(tableName);
    const [exists] = await table.exists();

    if (!exists) {
      console.log(`Creating BigQuery table: ${tableName}`);
      await bigquery.dataset(DATASET_ID).createTable(tableName, {
        schema: schema,
        ...options,
      });
      console.log(`✅ Table ${tableName} created`);
    }
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
  }
}

/**
 * Insert assessment record into BigQuery
 */
export async function insertAssessmentRecord(data: {
  assessmentId: string;
  userId: string;
  timestamp: string;
  phqResponses: number[];
  phqScore: number;
  severityLevel: string;
  requiresImmediateAction: boolean;
  ageRange?: string;
  gender?: string;
  timezone?: string;
  consentResearch: boolean;
}) {
  if (!bigquery) {
    console.warn('BigQuery not available - skipping assessment insert');
    return { success: false, error: 'BigQuery not initialized' };
  }

  try {
    // Hash user ID for pseudonymization
    const userHash = await hashUserId(data.userId);

    const row = {
      assessment_id: data.assessmentId,
      user_hash: userHash,
      timestamp: data.timestamp,
      phq9_q1: data.phqResponses[0],
      phq9_q2: data.phqResponses[1],
      phq9_q3: data.phqResponses[2],
      phq9_q4: data.phqResponses[3],
      phq9_q5: data.phqResponses[4],
      phq9_q6: data.phqResponses[5],
      phq9_q7: data.phqResponses[6],
      phq9_q8: data.phqResponses[7],
      phq9_q9: data.phqResponses[8],
      phq9_total_score: data.phqScore,
      severity_level: data.severityLevel,
      requires_immediate_action: data.requiresImmediateAction,
      age_range: data.ageRange || null,
      gender: data.gender || null,
      timezone: data.timezone || null,
      consent_research: data.consentResearch,
    };

    await bigquery.dataset(DATASET_ID).table('assessment_records').insert([row]);

    console.log('✅ Assessment record inserted to BigQuery:', data.assessmentId);
    return { success: true };
  } catch (error) {
    console.error('BigQuery insert error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Insert emotion analysis into BigQuery
 */
export async function insertEmotionAnalysis(data: {
  analysisId: string;
  assessmentId: string;
  userId: string;
  timestamp: string;
  primaryEmotion: string;
  secondaryEmotion?: string;
  confidenceScore: number;
  facialLandmarksDetected: boolean;
  emotionScores?: {
    sadness?: number;
    anxiety?: number;
    neutral?: number;
    happiness?: number;
    anger?: number;
    fear?: number;
  };
  modelVersion: string;
}) {
  if (!bigquery) {
    console.warn('BigQuery not available - skipping emotion insert');
    return { success: false };
  }

  try {
    const userHash = await hashUserId(data.userId);

    const row = {
      analysis_id: data.analysisId,
      assessment_id: data.assessmentId,
      user_hash: userHash,
      timestamp: data.timestamp,
      primary_emotion: data.primaryEmotion,
      secondary_emotion: data.secondaryEmotion || null,
      confidence_score: data.confidenceScore,
      facial_landmarks_detected: data.facialLandmarksDetected,
      sadness_score: data.emotionScores?.sadness || null,
      anxiety_score: data.emotionScores?.anxiety || null,
      neutral_score: data.emotionScores?.neutral || null,
      happiness_score: data.emotionScores?.happiness || null,
      anger_score: data.emotionScores?.anger || null,
      fear_score: data.emotionScores?.fear || null,
      vertex_ai_model_version: data.modelVersion,
    };

    await bigquery.dataset(DATASET_ID).table('emotion_analysis').insert([row]);

    console.log('✅ Emotion analysis inserted to BigQuery');
    return { success: true };
  } catch (error) {
    console.error('BigQuery emotion insert error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user behavior patterns
 */
export async function updateUserBehaviorPatterns(userId: string, assessmentHistory: any[]) {
  if (!bigquery || !assessmentHistory.length) return { success: false };

  try {
    const userHash = await hashUserId(userId);

    // Calculate behavior metrics
    const assessmentCount = assessmentHistory.length;
    const scores = assessmentHistory.map((a: any) => a.phqScore);
    
    let scoreTrend = 'stable';
    if (scores.length >= 2) {
      const recent = scores.slice(-3);
      const older = scores.slice(-6, -3);
      const recentAvg = recent.reduce((a: number, b: number) => a + b, 0) / recent.length;
      const olderAvg = older.length ? older.reduce((a: number, b: number) => a + b, 0) / older.length : recentAvg;
      
      if (recentAvg < olderAvg - 2) scoreTrend = 'improving';
      else if (recentAvg > olderAvg + 2) scoreTrend = 'declining';
    }

    const row = {
      behavior_id: `BEH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_hash: userHash,
      timestamp: new Date().toISOString(),
      assessment_count: assessmentCount,
      days_between_assessments: null, // Calculate from timestamps
      score_trend: scoreTrend,
      engagement_level: assessmentCount >= 5 ? 'high' : assessmentCount >= 2 ? 'medium' : 'low',
      session_count: null, // Would come from session data
      last_session_days_ago: null,
      crisis_alerts_count: assessmentHistory.filter((a: any) => a.requiresImmediateAction).length,
    };

    await bigquery.dataset(DATASET_ID).table('user_behavior_patterns').insert([row]);

    console.log('✅ User behavior pattern updated');
    return { success: true };
  } catch (error) {
    console.error('BigQuery behavior update error:', error);
    return { success: false };
  }
}

/**
 * Insert session outcome
 */
export async function insertSessionOutcome(data: {
  sessionId: string;
  userId: string;
  counselorId: string;
  sessionDate: string;
  preSessionPhq9?: number;
  postSessionPhq9?: number;
  sessionDuration?: number;
  satisfactionRating?: number;
  followUpScheduled?: boolean;
}) {
  if (!bigquery) return { success: false };

  try {
    const userHash = await hashUserId(data.userId);
    const counselorHash = await hashUserId(data.counselorId);

    const row = {
      session_id: data.sessionId,
      user_hash: userHash,
      counselor_hash: counselorHash,
      session_date: data.sessionDate,
      pre_session_phq9: data.preSessionPhq9 || null,
      post_session_phq9: data.postSessionPhq9 || null,
      score_improvement: (data.preSessionPhq9 && data.postSessionPhq9) 
        ? data.preSessionPhq9 - data.postSessionPhq9 
        : null,
      session_duration_minutes: data.sessionDuration || null,
      user_satisfaction_rating: data.satisfactionRating || null,
      follow_up_scheduled: data.followUpScheduled || null,
    };

    await bigquery.dataset(DATASET_ID).table('session_outcomes').insert([row]);

    console.log('✅ Session outcome inserted to BigQuery');
    return { success: true };
  } catch (error) {
    console.error('BigQuery session outcome error:', error);
    return { success: false };
  }
}

/**
 * Hash user ID for pseudonymization (HIPAA requirement)
 */
async function hashUserId(userId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(userId + 'MINDLENS_SALT_2025'); // Add salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Query for ML training data
 */
export async function getMLTrainingData(options: {
  startDate?: string;
  endDate?: string;
  minSampleSize?: number;
}) {
  if (!bigquery) {
    return { success: false, error: 'BigQuery not initialized' };
  }

  try {
    const query = `
      SELECT 
        a.user_hash,
        a.timestamp,
        a.phq9_q1, a.phq9_q2, a.phq9_q3, a.phq9_q4, a.phq9_q5,
        a.phq9_q6, a.phq9_q7, a.phq9_q8, a.phq9_q9,
        a.phq9_total_score,
        a.severity_level,
        a.requires_immediate_action,
        e.primary_emotion,
        e.confidence_score,
        e.sadness_score,
        e.anxiety_score,
        e.neutral_score,
        b.score_trend,
        b.engagement_level,
        b.crisis_alerts_count
      FROM \`${PROJECT_ID}.${DATASET_ID}.assessment_records\` a
      LEFT JOIN \`${PROJECT_ID}.${DATASET_ID}.emotion_analysis\` e
        ON a.assessment_id = e.assessment_id
      LEFT JOIN \`${PROJECT_ID}.${DATASET_ID}.user_behavior_patterns\` b
        ON a.user_hash = b.user_hash
      WHERE a.consent_research = TRUE
        ${options.startDate ? `AND a.timestamp >= TIMESTAMP('${options.startDate}')` : ''}
        ${options.endDate ? `AND a.timestamp <= TIMESTAMP('${options.endDate}')` : ''}
      ORDER BY a.timestamp DESC
      LIMIT ${options.minSampleSize || 10000}
    `;

    const [rows] = await bigquery.query({ query });

    console.log(`✅ Retrieved ${rows.length} records for ML training`);
    return { success: true, data: rows, count: rows.length };
  } catch (error) {
    console.error('BigQuery ML query error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Export data for AI agent training
 */
export async function exportForAIAgentTraining() {
  if (!bigquery) return { success: false };

  try {
    // Export to Cloud Storage for AI training
    const destinationUri = `gs://mindlens-ml-training/exports/training-data-${Date.now()}.jsonl`;

    const query = `
      EXPORT DATA OPTIONS(
        uri='${destinationUri}',
        format='NEWLINE_DELIMITED_JSON',
        overwrite=true
      ) AS
      SELECT 
        a.*,
        e.primary_emotion,
        e.confidence_score,
        e.sadness_score,
        e.anxiety_score,
        b.score_trend
      FROM \`${PROJECT_ID}.${DATASET_ID}.assessment_records\` a
      LEFT JOIN \`${PROJECT_ID}.${DATASET_ID}.emotion_analysis\` e ON a.assessment_id = e.assessment_id
      LEFT JOIN \`${PROJECT_ID}.${DATASET_ID}.user_behavior_patterns\` b ON a.user_hash = b.user_hash
      WHERE a.consent_research = TRUE
    `;

    await bigquery.query({ query });

    console.log('✅ Data exported for AI training:', destinationUri);
    return { success: true, exportUri: destinationUri };
  } catch (error) {
    console.error('BigQuery export error:', error);
    return { success: false, error: error.message };
  }
}