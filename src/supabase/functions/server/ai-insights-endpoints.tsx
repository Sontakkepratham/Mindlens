/**
 * AI-Powered Assessment Insights
 * Uses Google Gemini to generate detailed, personalized insights from user assessments
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import * as encryption from './encryption-service.tsx';
import { getGeminiApiKey, isDemoMode } from './admin-endpoints.tsx';
import { discoverAvailableModels, getPrioritizedModels } from './gemini-model-discovery.tsx';

const aiInsightsApp = new Hono();

// Initialize Supabase client with SERVICE_ROLE_KEY for server-side auth verification
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Cache the working model and available models
let cachedWorkingModel: string | null = null;
let cachedAvailableModels: string[] | null = null;

/**
 * Generate AI-powered insights for a specific assessment
 * POST /ai-insights/assessment/:sessionId
 */
aiInsightsApp.post('/assessment/:sessionId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user?.id) {
      return c.json({ 
        error: 'Authentication failed. Please sign in again.',
        details: authError?.message 
      }, 401);
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

    // Check for GEMINI_API_KEY
    const geminiApiKey = await getGeminiApiKey();
    const isDemo = await isDemoMode();
    
    console.log('🔍 API Configuration:', {
      hasApiKey: !!geminiApiKey,
      isDemo,
      willUseDemo: isDemo
    });
    
    if (!geminiApiKey && !isDemo) {
      return c.json({ 
        error: 'Gemini API key not configured. AI insights require GEMINI_API_KEY environment variable, or enable CHAT_DEMO_MODE for testing.' 
      }, 500);
    }

    // Demo mode for testing without Gemini API - CHECK THIS FIRST
    if (isDemo) {
      console.log('🎭 Running in DEMO MODE - generating simulated AI insights');
      
      const demoInsights = {
        summary: "Based on your PHQ-9 assessment, you're showing signs of " + 
                 (assessmentData.score >= 15 ? "moderately severe depression" : 
                  assessmentData.score >= 10 ? "moderate depression" : 
                  assessmentData.score >= 5 ? "mild depression" : "minimal symptoms") + 
                 ". Your responses indicate some challenges with mood and daily functioning.",
        
        keyFindings: [
          "Your score suggests that professional support could be beneficial",
          "Several symptoms are affecting your daily life and well-being",
          "Early intervention can make a significant difference in recovery"
        ],
        
        recommendations: [
          "Consider scheduling an appointment with a mental health professional",
          "Practice self-care activities like regular exercise and adequate sleep",
          "Stay connected with supportive friends and family members",
          "Use the MindLens resources and support groups for additional guidance"
        ],
        
        positiveAspects: [
          "Taking this assessment shows self-awareness and willingness to seek help",
          "Recognizing these feelings is an important first step",
          "You're being proactive about your mental health"
        ],
        
        urgency: assessmentData.score >= 15 ? 'high' : 
                assessmentData.score >= 10 ? 'moderate' : 'low',
        
        demoMode: true
      };
      
      // Save the insights
      await kv.set(`assessment:${sessionId}:insights`, {
        ...demoInsights,
        generatedAt: new Date().toISOString(),
        modelUsed: 'demo-mode',
      });
      
      return c.json({
        success: true,
        insights: demoInsights,
        message: '[Demo Mode] AI insights generated using simulated responses'
      });
    }

    // Build the insight generation prompt
    const phqQuestions = [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself - or that you are a failure',
      'Trouble concentrating',
      'Moving or speaking slowly, or being fidgety/restless',
      'Thoughts of being better off dead or hurting yourself',
    ];

    const responseLabels = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];
    
    const answersText = assessmentData.responses
      .map((score: number, idx: number) => `Q${idx + 1}: "${phqQuestions[idx]}" → ${responseLabels[score]} (${score} points)`)
      .join('\n');

    const prompt = `You are a clinical mental health analyst. Analyze this PHQ-9 depression screening assessment and provide detailed, compassionate, professional insights.

ASSESSMENT DATA:
PHQ-9 Total Score: ${assessmentData.phqScore}/27
Severity Level: ${assessmentData.phqScore >= 20 ? 'Severe' : assessmentData.phqScore >= 15 ? 'Moderately Severe' : assessmentData.phqScore >= 10 ? 'Moderate' : assessmentData.phqScore >= 5 ? 'Mild' : 'Minimal'}
Date: ${new Date(assessmentData.timestamp).toLocaleDateString()}
${assessmentData.emotionAnalysis ? `Detected Emotion: ${assessmentData.emotionAnalysis.primary_emotion} (${(assessmentData.emotionAnalysis.confidence * 100).toFixed(1)}% confidence)` : ''}

RESPONSES:
${answersText}

Please provide a comprehensive analysis with:

1. **Overall Summary** (2-3 sentences): Brief overview of the mental health status
2. **Key Concerns** (bullet points): Specific areas that need attention based on the responses
3. **Positive Indicators** (if any): Strengths and resilient factors shown
4. **Pattern Analysis**: What the combination of responses reveals about the user's mental state
5. **Recommendations** (3-5 actionable items): Specific, practical next steps
6. **Professional Guidance**: When and why to seek professional help
7. **Self-Care Strategies**: Evidence-based coping techniques relevant to their specific symptoms

Important:
- Be compassionate and non-judgmental
- Use clear, accessible language (not overly clinical)
- Focus on actionable insights
- If score is ≥15 or Question 9 score is ≥2, strongly emphasize seeking immediate professional help
- Acknowledge the courage it takes to complete this assessment

Format your response in clear sections with headers.`;

    console.log('🤖 Generating AI insights for assessment:', sessionId);

    // Discover available models if not cached
    if (!cachedAvailableModels) {
      const discovery = await discoverAvailableModels(geminiApiKey);
      if (discovery.success && discovery.models.length > 0) {
        cachedAvailableModels = discovery.models;
        console.log('✅ Discovered models:', cachedAvailableModels);
      } else {
        console.error('❌ Failed to discover models, using defaults');
        cachedAvailableModels = [
          'models/gemini-1.5-flash-latest',
          'models/gemini-1.5-flash',
          'models/gemini-pro',
        ];
      }
    }

    // Use cached model if available, otherwise use discovered models
    const modelsToTry = cachedWorkingModel 
      ? [cachedWorkingModel]
      : getPrioritizedModels(cachedAvailableModels);

    if (modelsToTry.length === 0) {
      return c.json({
        error: 'No Gemini models available. Please get an API key from https://aistudio.google.com/app/apikey',
      }, 503);
    }

    let geminiResponse = null;
    let successfulModel = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature: 0.5, // Lower temperature for more focused, clinical analysis
                maxOutputTokens: 2048, // Longer for detailed insights
                topP: 0.9,
                topK: 40,
              },
            }),
          }
        );

        if (geminiResponse.ok) {
          successfulModel = modelName;
          if (!cachedWorkingModel) {
            cachedWorkingModel = modelName;
            console.log(`✅ Cached working model: ${modelName}`);
          }
          console.log(`✅ Successfully using model: ${modelName}`);
          break;
        } else {
          const errorData = await geminiResponse.json().catch(() => ({}));
          console.log(`❌ Model ${modelName} failed:`, errorData.error?.message);
          
          if (geminiResponse.status !== 404) {
            break;
          }
        }
      } catch (error) {
        console.error(`❌ Error trying model ${modelName}:`, error);
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      return c.json({ 
        error: 'Failed to generate AI insights. Please try again.' 
      }, 500);
    }

    const geminiData = await geminiResponse.json();
    const insights = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!insights) {
      return c.json({ 
        error: 'Unable to generate insights. Please try again.' 
      }, 500);
    }

    console.log('✅ AI insights generated successfully');

    // Save insights to assessment record
    assessmentData.aiInsights = {
      content: insights,
      generatedAt: new Date().toISOString(),
      model: successfulModel,
    };

    // Re-encrypt if original was encrypted
    if (assessment.encrypted) {
      const encryptedData = await encryption.encrypt(assessmentData);
      await kv.set(`assessment:${sessionId}`, {
        ...assessment,
        encryptedData,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      await kv.set(`assessment:${sessionId}`, assessmentData);
    }

    return c.json({
      success: true,
      insights,
      metadata: {
        sessionId,
        phqScore: assessmentData.phqScore,
        severity: assessmentData.phqScore >= 20 ? 'Severe' : 
                  assessmentData.phqScore >= 15 ? 'Moderately Severe' : 
                  assessmentData.phqScore >= 10 ? 'Moderate' : 
                  assessmentData.phqScore >= 5 ? 'Mild' : 'Minimal',
        generatedAt: new Date().toISOString(),
        model: successfulModel,
      },
    });
  } catch (error) {
    console.error('AI insights error:', error);
    return c.json({ error: `Failed to generate insights: ${error.message}` }, 500);
  }
});

/**
 * Generate comprehensive insights across all assessments (trend analysis)
 * POST /ai-insights/trend-analysis
 */
aiInsightsApp.post('/trend-analysis', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user?.id) {
      return c.json({ 
        error: 'Authentication failed. Please sign in again.',
      }, 401);
    }

    // Get all assessments
    const assessmentHistory = await kv.get(`user:${user.id}:assessment-history`) || [];
    
    if (assessmentHistory.length === 0) {
      return c.json({ 
        error: 'No assessments found. Please complete at least one assessment first.' 
      }, 404);
    }

    // Fetch all assessment details
    const assessments = [];
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
        assessments.push(decryptedAssessment);
      }
    }

    // Sort by date
    assessments.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Check for GEMINI_API_KEY
    const geminiApiKey = await getGeminiApiKey();
    
    if (!geminiApiKey) {
      return c.json({ 
        error: 'Gemini API key not configured.' 
      }, 500);
    }

    // Build trend analysis prompt
    const assessmentsSummary = assessments.map((a, idx) => 
      `Assessment ${idx + 1} (${new Date(a.timestamp).toLocaleDateString()}): PHQ-9 Score = ${a.phqScore}/27 (${a.phqScore >= 15 ? 'Severe/Moderately Severe' : a.phqScore >= 10 ? 'Moderate' : a.phqScore >= 5 ? 'Mild' : 'Minimal'})`
    ).join('\n');

    const scores = assessments.map(a => a.phqScore);
    const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    const trend = scores[scores.length - 1] > scores[0] ? 'worsening' : 
                  scores[scores.length - 1] < scores[0] ? 'improving' : 'stable';

    const prompt = `You are a clinical mental health analyst. Analyze this longitudinal data from ${assessments.length} PHQ-9 depression assessments and provide detailed trend analysis.

ASSESSMENT HISTORY:
${assessmentsSummary}

STATISTICS:
- Total Assessments: ${assessments.length}
- Average Score: ${avgScore}/27
- Trend: ${trend}
- First Score: ${scores[0]}/27
- Latest Score: ${scores[scores.length - 1]}/27
- Score Change: ${scores[scores.length - 1] - scores[0]} points

Please provide:

1. **Trend Overview** (2-3 sentences): Overall trajectory of mental health
2. **Progress Analysis**: What the trend reveals about treatment/intervention effectiveness
3. **Score Fluctuations**: Analysis of variations between assessments
4. **Red Flags** (if any): Concerning patterns that need immediate attention
5. **Positive Developments** (if any): Signs of improvement and resilience
6. **Long-term Recommendations**: Next steps based on the overall pattern
7. **Intervention Evaluation**: How well current strategies appear to be working

Be specific, reference actual scores and dates, and provide actionable guidance.`;

    console.log('🤖 Generating trend analysis for user:', user.id.substring(0, 8) + '***');

    const modelsToTry = cachedWorkingModel 
      ? [cachedWorkingModel]
      : getPrioritizedModels(cachedAvailableModels);

    if (modelsToTry.length === 0) {
      return c.json({
        error: 'No Gemini models available. Please get an API key from https://aistudio.google.com/app/apikey',
      }, 503);
    }

    let geminiResponse = null;
    let successfulModel = null;

    for (const modelName of modelsToTry) {
      try {
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 2048,
                topP: 0.9,
                topK: 40,
              },
            }),
          }
        );

        if (geminiResponse.ok) {
          successfulModel = modelName;
          if (!cachedWorkingModel) cachedWorkingModel = modelName;
          break;
        }
      } catch (error) {
        console.error(`❌ Error with model ${modelName}:`, error);
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      return c.json({ error: 'Failed to generate trend analysis.' }, 500);
    }

    const geminiData = await geminiResponse.json();
    const insights = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!insights) {
      return c.json({ error: 'Unable to generate trend analysis.' }, 500);
    }

    console.log('✅ Trend analysis generated successfully');

    // Save to user's profile
    const trendAnalysis = {
      content: insights,
      generatedAt: new Date().toISOString(),
      assessmentCount: assessments.length,
      scoreRange: { min: Math.min(...scores), max: Math.max(...scores) },
      trend,
      model: successfulModel,
    };

    await kv.set(`user:${user.id}:trend-analysis`, trendAnalysis);

    return c.json({
      success: true,
      insights,
      metadata: {
        assessmentCount: assessments.length,
        averageScore: avgScore,
        trend,
        scoreRange: { min: Math.min(...scores), max: Math.max(...scores) },
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Trend analysis error:', error);
    return c.json({ error: `Failed to generate trend analysis: ${error.message}` }, 500);
  }
});

/**
 * Get cached AI insights for an assessment
 * GET /ai-insights/assessment/:sessionId
 */
aiInsightsApp.get('/assessment/:sessionId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionId = c.req.param('sessionId');
    const assessment = await kv.get(`assessment:${sessionId}`);

    if (!assessment || assessment.userId !== user.id) {
      return c.json({ error: 'Assessment not found' }, 404);
    }

    // Decrypt if needed
    let assessmentData = assessment;
    if (assessment.encrypted && assessment.encryptedData) {
      try {
        const decrypted = await encryption.decrypt(assessment.encryptedData);
        assessmentData = { ...assessment, ...decrypted };
      } catch (error) {
        console.warn('Failed to decrypt assessment');
      }
    }

    if (!assessmentData.aiInsights) {
      return c.json({ 
        success: false,
        message: 'No insights generated yet. Use POST to generate.' 
      }, 404);
    }

    return c.json({
      success: true,
      insights: assessmentData.aiInsights.content,
      metadata: {
        sessionId,
        generatedAt: assessmentData.aiInsights.generatedAt,
        model: assessmentData.aiInsights.model,
      },
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default aiInsightsApp;