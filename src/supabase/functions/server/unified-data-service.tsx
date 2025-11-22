/**
 * Unified Data Access Service
 * Combines Supabase KV Store and BigQuery data in a single interface
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';
import { BigQuery } from 'npm:@google-cloud/bigquery@7.3.0';
import * as kv from './kv_store.tsx';
import * as encryption from './encryption-service.tsx';

// Initialize clients
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize BigQuery
function initBigQuery(): BigQuery | null {
  const credentialsJson = Deno.env.get('GOOGLE_CLOUD_CREDENTIALS');
  if (!credentialsJson) return null;

  try {
    const cleanJson = credentialsJson.trim().replace(/^\uFEFF/, '');
    if (!cleanJson.startsWith('{')) return null;
    
    const credentials = JSON.parse(cleanJson);
    if (!credentials.project_id || !credentials.private_key || !credentials.client_email) {
      return null;
    }

    return new BigQuery({
      projectId: credentials.project_id,
      credentials: credentials,
    });
  } catch (error) {
    return null;
  }
}

const bigquery = initBigQuery();
const DATASET_ID = 'mindlens_ml_training';

/**
 * Unified User Data
 * Combines operational data from Supabase and analytics from BigQuery
 */
export async function getUserCompleteData(userId: string) {
  try {
    const result: any = {
      userId,
      timestamp: new Date().toISOString(),
      sources: {
        supabase: true,
        bigquery: !!bigquery,
      },
      data: {},
    };

    // 1. Get user profile from Supabase
    const profile = await kv.get(`user:${userId}`);
    if (profile) {
      result.data.profile = profile;
    }

    // 2. Get all assessments from Supabase
    const assessmentHistory = await kv.get(`user:${userId}:assessment-history`) || [];
    result.data.assessments = {
      count: assessmentHistory.length,
      sessions: [],
    };

    for (const sessionId of assessmentHistory) {
      const assessment = await kv.get(`assessment:${sessionId}`);
      if (assessment) {
        // Decrypt if needed
        let decryptedAssessment = { ...assessment };
        if (assessment.encrypted && assessment.encryptedData) {
          try {
            const decrypted = await encryption.decrypt(assessment.encryptedData);
            Object.assign(decryptedAssessment, decrypted);
            delete decryptedAssessment.encryptedData;
          } catch (error) {
            console.warn('Failed to decrypt assessment:', sessionId);
          }
        }
        result.data.assessments.sessions.push(decryptedAssessment);
      }
    }

    // 3. Get Big Five personality test
    const bigFive = await kv.get(`bigfive:${userId}`);
    if (bigFive) {
      result.data.personalityTest = bigFive;
    }

    // 4. Get Stroop test results
    const stroop = await kv.get(`stroop:${userId}`);
    if (stroop) {
      result.data.stroopTest = stroop;
    }

    // 5. Get bookings
    const bookingHistory = await kv.get(`user:${userId}:booking-history`) || [];
    result.data.bookings = [];
    for (const bookingId of bookingHistory) {
      const booking = await kv.get(`booking:${bookingId}`);
      if (booking) result.data.bookings.push(booking);
    }

    // 6. Get BigQuery analytics (if available)
    if (bigquery) {
      try {
        const userHash = await encryption.hashIdentifier(userId);
        
        // Get assessment analytics
        const assessmentQuery = `
          SELECT 
            assessment_id,
            timestamp,
            phq9_score,
            severity_level,
            requires_immediate_action
          FROM \`${DATASET_ID}.assessment_records\`
          WHERE user_hash = @userHash
          ORDER BY timestamp DESC
        `;

        const [assessmentRows] = await bigquery.query({
          query: assessmentQuery,
          params: { userHash },
        });

        result.data.bigQueryAnalytics = {
          assessments: assessmentRows,
          totalAssessments: assessmentRows.length,
          averageScore: assessmentRows.length > 0 
            ? assessmentRows.reduce((sum: number, row: any) => sum + row.phq9_score, 0) / assessmentRows.length
            : 0,
        };

        // Get emotion analysis
        const emotionQuery = `
          SELECT 
            analysis_id,
            primary_emotion,
            secondary_emotion,
            confidence_score,
            timestamp
          FROM \`${DATASET_ID}.emotion_analysis\`
          WHERE user_hash = @userHash
          ORDER BY timestamp DESC
        `;

        const [emotionRows] = await bigquery.query({
          query: emotionQuery,
          params: { userHash },
        });

        result.data.bigQueryAnalytics.emotionAnalysis = emotionRows;

      } catch (error: any) {
        console.error('BigQuery query error:', error.message);
        result.data.bigQueryAnalytics = { error: error.message };
      }
    }

    return result;

  } catch (error: any) {
    console.error('Error getting complete user data:', error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
}

/**
 * Unified Assessment Data
 * Get single assessment from both Supabase and BigQuery
 */
export async function getAssessmentCompleteData(sessionId: string) {
  try {
    const result: any = {
      sessionId,
      timestamp: new Date().toISOString(),
      data: {},
    };

    // 1. Get from Supabase
    const assessment = await kv.get(`assessment:${sessionId}`);
    if (assessment) {
      let decryptedAssessment = { ...assessment };
      if (assessment.encrypted && assessment.encryptedData) {
        try {
          const decrypted = await encryption.decrypt(assessment.encryptedData);
          Object.assign(decryptedAssessment, decrypted);
          delete decryptedAssessment.encryptedData;
        } catch (error) {
          console.warn('Failed to decrypt assessment');
        }
      }
      result.data.supabase = decryptedAssessment;
    }

    // 2. Get from BigQuery
    if (bigquery) {
      try {
        const query = `
          SELECT * FROM \`${DATASET_ID}.assessment_records\`
          WHERE assessment_id = @sessionId
          LIMIT 1
        `;

        const [rows] = await bigquery.query({
          query,
          params: { sessionId },
        });

        if (rows.length > 0) {
          result.data.bigQuery = rows[0];
        }

        // Get associated emotion analysis
        const emotionQuery = `
          SELECT * FROM \`${DATASET_ID}.emotion_analysis\`
          WHERE assessment_id = @sessionId
          LIMIT 1
        `;

        const [emotionRows] = await bigquery.query({
          query: emotionQuery,
          params: { sessionId },
        });

        if (emotionRows.length > 0) {
          result.data.bigQueryEmotion = emotionRows[0];
        }

      } catch (error: any) {
        console.error('BigQuery query error:', error.message);
      }
    }

    return result;

  } catch (error: any) {
    throw new Error(`Failed to get assessment data: ${error.message}`);
  }
}

/**
 * Get Dashboard Statistics
 * Combines data from both sources for admin dashboard
 */
export async function getDashboardStatistics() {
  try {
    const stats: any = {
      timestamp: new Date().toISOString(),
      supabase: {},
      bigQuery: {},
    };

    // 1. Supabase Statistics
    const allKeys = await supabase
      .from('kv_store_aa629e1b')
      .select('key');

    if (allKeys.data) {
      const keys = allKeys.data.map(row => row.key);
      
      stats.supabase = {
        totalRecords: keys.length,
        users: keys.filter(k => k.startsWith('user:') && !k.includes(':assessment-history') && !k.includes(':latest')).length,
        assessments: keys.filter(k => k.startsWith('assessment:')).length,
        bigFiveTests: keys.filter(k => k.startsWith('bigfive:')).length,
        stroopTests: keys.filter(k => k.startsWith('stroop:')).length,
        bookings: keys.filter(k => k.startsWith('booking:')).length,
        crisisAlerts: keys.filter(k => k.startsWith('crisis-alert:')).length,
      };
    }

    // 2. BigQuery Statistics
    if (bigquery) {
      try {
        // Total assessments
        const [assessmentCount] = await bigquery.query(
          `SELECT COUNT(*) as count FROM \`${DATASET_ID}.assessment_records\``
        );
        stats.bigQuery.totalAssessments = assessmentCount[0]?.count || 0;

        // Average PHQ-9 score
        const [avgScore] = await bigquery.query(
          `SELECT AVG(phq9_score) as avg_score FROM \`${DATASET_ID}.assessment_records\``
        );
        stats.bigQuery.averagePhqScore = Math.round((avgScore[0]?.avg_score || 0) * 10) / 10;

        // Severity distribution
        const [severityDist] = await bigquery.query(`
          SELECT 
            severity_level,
            COUNT(*) as count
          FROM \`${DATASET_ID}.assessment_records\`
          GROUP BY severity_level
        `);
        stats.bigQuery.severityDistribution = severityDist;

        // Crisis cases
        const [crisisCases] = await bigquery.query(`
          SELECT COUNT(*) as count 
          FROM \`${DATASET_ID}.assessment_records\`
          WHERE requires_immediate_action = true
        `);
        stats.bigQuery.crisisCases = crisisCases[0]?.count || 0;

        // Emotion distribution
        const [emotionDist] = await bigquery.query(`
          SELECT 
            primary_emotion,
            COUNT(*) as count
          FROM \`${DATASET_ID}.emotion_analysis\`
          GROUP BY primary_emotion
          ORDER BY count DESC
        `);
        stats.bigQuery.emotionDistribution = emotionDist;

        // Time series (last 30 days)
        const [timeSeries] = await bigquery.query(`
          SELECT 
            DATE(timestamp) as date,
            COUNT(*) as assessment_count,
            AVG(phq9_score) as avg_score
          FROM \`${DATASET_ID}.assessment_records\`
          WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
          GROUP BY date
          ORDER BY date DESC
        `);
        stats.bigQuery.last30Days = timeSeries;

      } catch (error: any) {
        console.error('BigQuery statistics error:', error.message);
        stats.bigQuery.error = error.message;
      }
    } else {
      stats.bigQuery.error = 'BigQuery not configured';
    }

    return stats;

  } catch (error: any) {
    throw new Error(`Failed to get dashboard statistics: ${error.message}`);
  }
}

/**
 * Search across both databases
 */
export async function searchData(searchTerm: string, searchType: 'userId' | 'sessionId' | 'email' | 'all' = 'all') {
  try {
    const results: any = {
      searchTerm,
      searchType,
      timestamp: new Date().toISOString(),
      supabase: [],
      bigQuery: [],
    };

    // 1. Search Supabase
    if (searchType === 'userId' || searchType === 'all') {
      const userData = await kv.get(`user:${searchTerm}`);
      if (userData) {
        results.supabase.push({ type: 'user', key: `user:${searchTerm}`, data: userData });
      }
    }

    if (searchType === 'sessionId' || searchType === 'all') {
      const assessment = await kv.get(`assessment:${searchTerm}`);
      if (assessment) {
        results.supabase.push({ type: 'assessment', key: `assessment:${searchTerm}`, data: assessment });
      }
    }

    // 2. Search BigQuery
    if (bigquery && (searchType === 'sessionId' || searchType === 'all')) {
      try {
        const query = `
          SELECT * FROM \`${DATASET_ID}.assessment_records\`
          WHERE assessment_id = @searchTerm
        `;

        const [rows] = await bigquery.query({
          query,
          params: { searchTerm },
        });

        results.bigQuery = rows;

      } catch (error: any) {
        console.error('BigQuery search error:', error.message);
      }
    }

    return results;

  } catch (error: any) {
    throw new Error(`Search failed: ${error.message}`);
  }
}

/**
 * Sync Supabase data to BigQuery
 * Useful for backfilling or manual sync
 */
export async function syncSupabaseToBigQuery(userId?: string) {
  if (!bigquery) {
    throw new Error('BigQuery not configured');
  }

  try {
    const syncResults = {
      timestamp: new Date().toISOString(),
      assessmentsSynced: 0,
      emotionsSynced: 0,
      errors: [],
    };

    // Get assessments to sync
    let assessmentKeys: string[];
    
    if (userId) {
      const history = await kv.get(`user:${userId}:assessment-history`) || [];
      assessmentKeys = history.map((id: string) => `assessment:${id}`);
    } else {
      // Get all assessment keys
      const allData = await supabase
        .from('kv_store_aa629e1b')
        .select('key')
        .like('key', 'assessment:%');
      
      assessmentKeys = allData.data?.map(row => row.key) || [];
    }

    console.log(`Syncing ${assessmentKeys.length} assessments to BigQuery...`);

    // Sync each assessment
    for (const key of assessmentKeys) {
      try {
        const assessment = await kv.get(key);
        if (!assessment) continue;

        // Decrypt if needed
        let decrypted = assessment;
        if (assessment.encrypted && assessment.encryptedData) {
          const decryptedData = await encryption.decrypt(assessment.encryptedData);
          decrypted = { ...assessment, ...decryptedData };
        }

        // Prepare BigQuery row
        const userHash = await encryption.hashIdentifier(decrypted.userId);
        
        const row = {
          assessment_id: assessment.sessionId,
          user_hash: userHash,
          timestamp: assessment.timestamp,
          phq9_q1: decrypted.phqResponses?.[0] || 0,
          phq9_q2: decrypted.phqResponses?.[1] || 0,
          phq9_q3: decrypted.phqResponses?.[2] || 0,
          phq9_q4: decrypted.phqResponses?.[3] || 0,
          phq9_q5: decrypted.phqResponses?.[4] || 0,
          phq9_q6: decrypted.phqResponses?.[5] || 0,
          phq9_q7: decrypted.phqResponses?.[6] || 0,
          phq9_q8: decrypted.phqResponses?.[7] || 0,
          phq9_q9: decrypted.phqResponses?.[8] || 0,
          phq9_score: assessment.phqScore || decrypted.phqScore,
          severity_level: assessment.phqScore >= 20 ? 'severe' : 
                         assessment.phqScore >= 15 ? 'moderately-severe' :
                         assessment.phqScore >= 10 ? 'moderate' :
                         assessment.phqScore >= 5 ? 'mild' : 'minimal',
          requires_immediate_action: assessment.requiresImmediateAction,
          consent_research: assessment.consentToResearch,
        };

        // Insert to BigQuery (using streaming insert)
        await bigquery
          .dataset(DATASET_ID)
          .table('assessment_records')
          .insert([row]);

        syncResults.assessmentsSynced++;

      } catch (error: any) {
        syncResults.errors.push({
          key,
          error: error.message,
        });
      }
    }

    console.log(`✅ Sync complete: ${syncResults.assessmentsSynced} assessments synced`);
    return syncResults;

  } catch (error: any) {
    throw new Error(`Sync failed: ${error.message}`);
  }
}

/**
 * Get trends and analytics across both sources
 */
export async function getTrendsAnalytics(timeRange: '7d' | '30d' | '90d' | 'all' = '30d') {
  if (!bigquery) {
    throw new Error('BigQuery not configured - analytics not available');
  }

  try {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;

    const analytics: any = {
      timeRange,
      timestamp: new Date().toISOString(),
    };

    // 1. Assessment trends over time
    const [trendData] = await bigquery.query(`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as total_assessments,
        AVG(phq9_score) as avg_score,
        COUNT(CASE WHEN requires_immediate_action = true THEN 1 END) as crisis_count
      FROM \`${DATASET_ID}.assessment_records\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
      GROUP BY date
      ORDER BY date ASC
    `);
    analytics.assessmentTrends = trendData;

    // 2. Severity trends
    const [severityTrends] = await bigquery.query(`
      SELECT 
        DATE(timestamp) as date,
        severity_level,
        COUNT(*) as count
      FROM \`${DATASET_ID}.assessment_records\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
      GROUP BY date, severity_level
      ORDER BY date ASC
    `);
    analytics.severityTrends = severityTrends;

    // 3. Emotion trends
    const [emotionTrends] = await bigquery.query(`
      SELECT 
        DATE(timestamp) as date,
        primary_emotion,
        COUNT(*) as count,
        AVG(confidence_score) as avg_confidence
      FROM \`${DATASET_ID}.emotion_analysis\`
      WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
      GROUP BY date, primary_emotion
      ORDER BY date ASC
    `);
    analytics.emotionTrends = emotionTrends;

    // 4. User engagement from Supabase
    const allAssessments = await supabase
      .from('kv_store_aa629e1b')
      .select('value')
      .like('key', 'assessment:%');

    if (allAssessments.data) {
      const recentAssessments = allAssessments.data.filter(row => {
        const timestamp = new Date(row.value.timestamp);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return timestamp >= cutoff;
      });

      analytics.engagement = {
        totalAssessments: recentAssessments.length,
        uniqueUsers: new Set(recentAssessments.map(a => a.value.userId)).size,
        avgAssessmentsPerUser: recentAssessments.length / Math.max(1, new Set(recentAssessments.map(a => a.value.userId)).size),
      };
    }

    return analytics;

  } catch (error: any) {
    throw new Error(`Failed to get analytics: ${error.message}`);
  }
}

export default {
  getUserCompleteData,
  getAssessmentCompleteData,
  getDashboardStatistics,
  searchData,
  syncSupabaseToBigQuery,
  getTrendsAnalytics,
};
