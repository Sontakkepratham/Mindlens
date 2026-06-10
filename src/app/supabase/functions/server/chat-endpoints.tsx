import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import { discoverAvailableModels, getPrioritizedModels } from './gemini-model-discovery.tsx';
import { getGeminiApiKey, isDemoMode } from './admin-endpoints.tsx';

const chatApp = new Hono();

// Initialize Supabase client with SERVICE_ROLE_KEY for server-side auth verification
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Cache the working model and available models to avoid discovery on every request
let cachedWorkingModel: string | null = null;
let cachedAvailableModels: string[] | null = null;

/**
 * Send a message to the AI chatbot
 * Uses Google Gemini API for mental health support conversations
 */
chatApp.post('/send', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    console.log('🔐 Verifying user authentication...', {
      hasToken: !!accessToken,
      tokenLength: accessToken?.length,
      tokenPrefix: accessToken?.substring(0, 20) + '...',
    });

    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError) {
      console.error('❌ Authentication error:', {
        message: authError.message,
        status: authError.status,
        name: authError.name,
        code: authError.code,
        fullError: JSON.stringify(authError),
      });
      
      // Return a more helpful error message
      let errorMessage = 'Authentication failed. Please sign in again.';
      let errorCode = 401;
      
      if (authError.message?.includes('JWT') || authError.message?.includes('expired')) {
        errorMessage = 'Your session has expired. Please sign out and sign in again.';
      } else if (authError.message?.includes('invalid')) {
        errorMessage = 'Invalid authentication token. Please sign out and sign in again.';
      }
      
      return c.json({ 
        code: errorCode,
        message: errorMessage,
        details: authError.message,
        hint: 'Try signing out and signing in again to refresh your session.'
      }, errorCode);
    }

    if (!user?.id) {
      console.error('❌ No user returned from authentication');
      return c.json({ error: 'Invalid token - no user found' }, 401);
    }

    console.log('✅ User authenticated:', user.id.substring(0, 8) + '***');

    const { message, conversationId } = await c.req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return c.json({ error: 'Message is required and must be a non-empty string' }, 400);
    }

    // Get or create conversation ID
    const convId = conversationId || `CHAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get conversation history
    const historyKey = `chat:${user.id}:${convId}:history`;
    const history = (await kv.get(historyKey)) || [];

    // ============================================
    // FETCH USER CONTEXT FOR PERSONALIZED SUPPORT
    // ============================================
    
    // Get user's mental health assessment history
    const assessmentHistory = await kv.get(`user:${user.id}:assessment-history`) || [];
    let latestAssessment = null;
    let assessmentContext = '';
    
    if (assessmentHistory.length > 0) {
      const latestSessionId = assessmentHistory[assessmentHistory.length - 1];
      latestAssessment = await kv.get(`assessment:${latestSessionId}`);
      
      if (latestAssessment) {
        const phqScore = latestAssessment.phqScore || latestAssessment.score || 0;
        const severity = phqScore >= 20 ? 'Severe' : 
                        phqScore >= 15 ? 'Moderately Severe' : 
                        phqScore >= 10 ? 'Moderate' : 
                        phqScore >= 5 ? 'Mild' : 'Minimal';
        
        assessmentContext = `\n\n**User's Mental Health Context:**
- Latest PHQ-9 Score: ${phqScore}/27 (${severity} depression symptoms)
- Assessment Date: ${new Date(latestAssessment.timestamp).toLocaleDateString()}
- Total Assessments Completed: ${assessmentHistory.length}`;

        // Add specific symptom areas if available
        if (latestAssessment.responses && Array.isArray(latestAssessment.responses)) {
          const highScoreSymptoms = [];
          const symptoms = [
            'interest/pleasure', 'feeling down/depressed', 'sleep issues', 
            'low energy', 'appetite changes', 'poor self-image', 
            'concentration problems', 'psychomotor changes', 'self-harm thoughts'
          ];
          
          latestAssessment.responses.forEach((score, idx) => {
            if (score >= 2 && symptoms[idx]) {
              highScoreSymptoms.push(symptoms[idx]);
            }
          });
          
          if (highScoreSymptoms.length > 0) {
            assessmentContext += `\n- Key Symptom Areas: ${highScoreSymptoms.join(', ')}`;
          }
        }
        
        // Add emotion analysis if available
        if (latestAssessment.emotionAnalysis) {
          assessmentContext += `\n- Detected Emotion: ${latestAssessment.emotionAnalysis.primary_emotion} (${(latestAssessment.emotionAnalysis.confidence * 100).toFixed(0)}% confidence)`;
        }
      }
    }
    
    // Get user's Big Five personality profile
    let personalityContext = '';
    const personalityResult = await kv.get(`user:${user.id}:personality-test-result`);
    
    if (personalityResult && personalityResult.scores) {
      personalityContext = `\n\n**User's Personality Profile (Big Five):**`;
      const traits = {
        openness: 'Openness',
        conscientiousness: 'Conscientiousness',
        extraversion: 'Extraversion',
        agreeableness: 'Agreeableness',
        neuroticism: 'Neuroticism'
      };
      
      for (const [key, label] of Object.entries(traits)) {
        if (personalityResult.scores[key]) {
          const score = personalityResult.scores[key];
          const level = score >= 70 ? 'High' : score >= 30 ? 'Moderate' : 'Low';
          personalityContext += `\n- ${label}: ${level} (${score}/100)`;
        }
      }
    }
    
    // Get user profile for personalization
    const userProfile = await kv.get(`user:${user.id}:profile`) || {};
    const userName = userProfile.name || 'there';

    // Build comprehensive system prompt with clinical guidelines
    const systemPrompt = `You are MindLens AI, a clinical-grade mental health support companion designed to provide evidence-based, compassionate, and personalized psychological support.

**Your Role & Capabilities:**
- You are a highly empathetic AI trained in cognitive-behavioral therapy (CBT), dialectical behavior therapy (DBT), and person-centered counseling approaches
- You provide immediate emotional support, coping strategies, and therapeutic guidance
- You help users understand their emotions, challenge negative thoughts, and develop healthier coping mechanisms
- You track progress over time and provide personalized interventions based on assessment data

**Clinical Guidelines:**
1. **Safety First**: If you detect suicidal ideation, self-harm, or immediate danger:
   - Provide the 988 Suicide & Crisis Lifeline immediately
   - Strongly encourage professional help (therapist, psychiatrist, emergency services)
   - Stay supportive and non-judgmental while emphasizing urgency

2. **Evidence-Based Techniques**: Use proven therapeutic approaches:
   - Cognitive Restructuring: Help identify and challenge negative thought patterns
   - Behavioral Activation: Suggest concrete activities to improve mood
   - Mindfulness & Grounding: Teach techniques for emotional regulation
   - Problem-Solving: Break down overwhelming situations into manageable steps
   - Validation: Acknowledge and normalize their feelings

3. **Personalization**: Use the user's assessment data and personality profile to:
   - Tailor coping strategies to their specific symptoms and traits
   - Reference their progress and celebrate improvements
   - Address specific symptom areas (sleep, appetite, concentration, etc.)
   - Adapt communication style to their personality (e.g., more structured for high conscientiousness)

4. **Therapeutic Boundaries**:
   - You are a support tool, NOT a replacement for professional therapy
   - Encourage professional help for moderate to severe symptoms
   - Don't diagnose conditions - instead say "based on what you're sharing, it sounds like..."
   - Be transparent about your limitations as an AI

5. **Response Style**:
   - Be warm, empathetic, and non-judgmental
   - Use active listening (reflect feelings, validate experiences)
   - Ask open-ended questions to encourage exploration
   - Keep responses conversational (3-5 sentences) but substantive
   - Offer specific, actionable advice when appropriate
   - Use the user's name (${userName}) to build rapport

6. **Crisis Keywords**: Watch for mentions of suicide, self-harm, hopelessness, "better off dead", "end it all", etc.

${assessmentContext}${personalityContext}

**Current Conversation Context:**
- User Name: ${userName}
- Conversation Messages: ${history.length}
- You have access to their full assessment history and can reference previous sessions

Remember: You're here to support, validate, and empower. Be a compassionate guide on their mental health journey.`;

    // Check for GEMINI_API_KEY
    const geminiApiKey = await getGeminiApiKey();
    const isDemo = await isDemoMode();
    
    console.log('🔍 API Configuration:', {
      hasApiKey: !!geminiApiKey,
      apiKeyLength: geminiApiKey?.length,
      apiKeyPrefix: geminiApiKey?.substring(0, 10) + '...',
      isDemo,
      willUseDemo: isDemo,
      willUseRealAI: !isDemo && !!geminiApiKey
    });
    
    if (!geminiApiKey && !isDemo) {
      console.error('❌ GEMINI_API_KEY environment variable not set');
      return c.json({ 
        error: 'Gemini API key not configured. Please set the GEMINI_API_KEY environment variable or enable CHAT_DEMO_MODE.' 
      }, 500);
    }

    // Demo mode for testing without Gemini API - CHECK THIS FIRST
    if (isDemo) {
      console.log('🎭 Running in DEMO MODE - generating simulated response');
      
      const demoResponses = [
        "Thank you for sharing that with me. I'm here to listen and support you. How long have you been feeling this way?",
        "I hear you, and your feelings are completely valid. It takes courage to open up about what you're going through. What do you think would help you feel a bit better right now?",
        "That sounds really challenging. Remember, it's okay to not be okay sometimes. Would you like to talk more about what's been on your mind?",
        "I appreciate you trusting me with this. You're taking an important step by talking about your feelings. How can I best support you today?",
        "It's completely normal to feel overwhelmed sometimes. You're showing great strength by reaching out. What's been the most difficult part for you?",
      ];
      
      const aiResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      // Save to conversation history (same as real mode)
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse + '\n\n[Demo Mode - Using simulated responses]',
        timestamp: new Date().toISOString(),
      };

      history.push(userMessage, assistantMessage);
      await kv.set(historyKey, history);

      await kv.set(`chat:${user.id}:${convId}:metadata`, {
        conversationId: convId,
        userId: user.id,
        startedAt: history[0]?.timestamp || new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messageCount: history.length,
        hasCrisisIndicator: false,
        demoMode: true,
      });

      const conversationsKey = `chat:${user.id}:conversations`;
      const conversations = (await kv.get(conversationsKey)) || [];
      if (!conversations.includes(convId)) {
        conversations.push(convId);
        await kv.set(conversationsKey, conversations);
      }

      return c.json({
        success: true,
        conversationId: convId,
        response: aiResponse + '\n\n💡 [Demo Mode Active - Add Gemini API key to use real AI]',
        hasCrisisIndicator: false,
        timestamp: new Date().toISOString(),
        demoMode: true,
      });
    }

    // Build conversation history for Gemini
    const conversationHistory = history.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    console.log('✅ Gemini API key found:', {
      keyPrefix: geminiApiKey.substring(0, 10) + '...',
      keyLength: geminiApiKey.length
    });

    // Call Gemini API
    console.log('🤖 Sending message to Google Gemini:', {
      userId: user.id.substring(0, 8) + '***',
      conversationId: convId,
      messageLength: message.length,
      historyLength: history.length,
    });

    // Prepend system prompt to the first message in the conversation
    const fullMessage = conversationHistory.length === 0 
      ? `${systemPrompt}\n\nUser: ${message}`
      : message;

    // Discover available models if not cached (first request only)
    if (!cachedAvailableModels) {
      console.log('🔍 Discovering available Gemini models...');
      const discovery = await discoverAvailableModels(geminiApiKey);
      if (discovery.success && discovery.models.length > 0) {
        cachedAvailableModels = discovery.models;
        console.log('✅ Discovered available models:', cachedAvailableModels);
      } else {
        console.error('❌ Failed to discover models:', discovery.error);
        // If discovery fails, return helpful error
        return c.json({
          error: `⚠️ Unable to Access Gemini Models\n\nYour API key doesn't have access to any Gemini models.\n\n🔧 How to Fix:\n1. Go to: https://aistudio.google.com/app/apikey\n2. Create a NEW API key (starts with "AIza...")\n3. Copy the key\n4. Update GEMINI_API_KEY in your environment\n\n💡 Alternative: Set CHAT_DEMO_MODE=true to test without API\n\nTechnical details: ${discovery.error || 'No models available'}`,
        }, 404);
      }
    }

    // Use cached model if available, otherwise use discovered models
    const modelsToTry = cachedWorkingModel 
      ? [cachedWorkingModel] // Try cached model first
      : getPrioritizedModels(cachedAvailableModels);

    if (modelsToTry.length === 0) {
      return c.json({
        error: `⚠️ No Available Models\n\nNo Gemini models are available for your API key.\n\n🔧 Solution:\n1. Get a FREE API key from Google AI Studio\n2. Go to: https://aistudio.google.com/app/apikey\n3. Create a new API key (starts with "AIza...")\n4. Update GEMINI_API_KEY environment variable\n\n💡 Or enable Demo Mode: Set CHAT_DEMO_MODE=true`,
      }, 503);
    }

    let geminiResponse = null;
    let lastError = null;
    let successfulModel = null;

    // Try models in order (cached first if available)
    for (const modelName of modelsToTry) {
      try {
        console.log(`🔄 Trying model: ${modelName}${modelName === cachedWorkingModel ? ' (cached)' : ''}`);
        
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                ...conversationHistory,
                {
                  role: 'user',
                  parts: [{ text: fullMessage }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 512, // Reduced from 2048 to 512 for faster responses
                topP: 0.95,
                topK: 40,
              },
            }),
          }
        );

        if (geminiResponse.ok) {
          successfulModel = modelName;
          // Cache this working model for future requests
          if (!cachedWorkingModel) {
            cachedWorkingModel = modelName;
            console.log(`✅ Cached working model: ${modelName}`);
          }
          console.log(`✅ Successfully using model: ${modelName}`);
          break;
        } else {
          const errorData = await geminiResponse.json().catch(() => ({}));
          lastError = errorData;
          console.log(`❌ Model ${modelName} failed:`, errorData.error?.message);
          
          // If it's not a "not found" error, break and report it
          if (geminiResponse.status !== 404) {
            break;
          }
        }
      } catch (error) {
        console.error(`❌ Error trying model ${modelName}:`, error);
        lastError = { error: { message: error.message } };
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      const errorData = lastError || {};
      
      // Check for quota/billing errors FIRST - check both response status and error code
      const isQuotaError = (
        geminiResponse?.status === 429 || 
        errorData.error?.code === 429 || 
        errorData.error?.status === 'RESOURCE_EXHAUSTED' ||
        errorData.error?.message?.includes('quota') ||
        errorData.error?.message?.includes('exceeded') ||
        errorData.error?.message?.includes('RESOURCE_EXHAUSTED')
      );
      
      console.log('🔍 Error analysis:', {
        hasResponse: !!geminiResponse,
        status: geminiResponse?.status,
        errorCode: errorData.error?.code,
        errorStatus: errorData.error?.status,
        isQuotaError,
        messagePreview: errorData.error?.message?.substring(0, 100)
      });
      
      if (isQuotaError && !errorData.error?.message?.includes('not found')) {
        console.log('✅ Quota exceeded - activating automatic demo mode fallback');
        console.log('📊 Quota error details:', {
          status: geminiResponse?.status,
          errorCode: errorData.error?.code,
          errorStatus: errorData.error?.status,
          message: errorData.error?.message?.substring(0, 200)
        });
        
        // Fall back to demo mode
        const demoResponses = [
          "Thank you for sharing that with me. I'm here to listen and support you. How long have you been feeling this way?",
          "I hear you, and your feelings are completely valid. It takes courage to open up about what you're going through. What do you think would help you feel a bit better right now?",
          "That sounds really challenging. Remember, it's okay to not be okay sometimes. Would you like to talk more about what's been on your mind?",
          "I appreciate you trusting me with this. You're taking an important step by talking about your feelings. How can I best support you today?",
          "It's completely normal to feel overwhelmed sometimes. You're showing great strength by reaching out. What's been the most difficult part for you?",
        ];
        
        const aiResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
        
        // Save to conversation history
        const userMessage = {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        };

        const assistantMessage = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };

        history.push(userMessage, assistantMessage);
        await kv.set(historyKey, history);

        await kv.set(`chat:${user.id}:${convId}:metadata`, {
          conversationId: convId,
          userId: user.id,
          startedAt: history[0]?.timestamp || new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
          messageCount: history.length,
          hasCrisisIndicator: false,
          demoMode: true,
          quotaExceeded: true,
        });

        const conversationsKey = `chat:${user.id}:conversations`;
        const conversations = (await kv.get(conversationsKey)) || [];
        if (!conversations.includes(convId)) {
          conversations.push(convId);
          await kv.set(conversationsKey, conversations);
        }

        console.log('✅ Demo mode response generated successfully - quota fallback active');
        
        return c.json({
          success: true,
          conversationId: convId,
          response: aiResponse,
          hasCrisisIndicator: false,
          timestamp: new Date().toISOString(),
          demoMode: true,
          quotaExceeded: true,
        });
      }
      
      // Log error only if NOT handling with quota fallback
      console.error('❌ Gemini API error after trying all models:', errorData);
      
      // Check for API key errors
      if (geminiResponse?.status === 400 && errorData.error?.message?.includes('API_KEY_INVALID')) {
        return c.json({ 
          error: `⚠️ Invalid API Key\n\nYour Gemini API key is invalid. Please:\n\n1. Go to https://aistudio.google.com/app/apikey\n2. Create a new API key\n3. Copy the key (starts with "AIza...")\n4. Update the GEMINI_API_KEY environment variable\n\nOr use CHAT_DEMO_MODE=true for testing without an API key.` 
        }, 400);
      }
      
      // Check if all models failed with "not found" - this takes priority over quota errors
      if (errorData.error?.message?.includes('not found') || errorData.error?.message?.includes('is not found')) {
        return c.json({ 
          error: `⚠️ API Key Error\n\nYour Gemini API key doesn't have access to any models. This could mean:\n\n1. The API key is from Google Cloud Console instead of AI Studio\n   → Get a key from: https://aistudio.google.com/app/apikey\n\n2. Gemini API is not available in your region\n   → Check: https://ai.google.dev/available_regions\n\n3. The API key is invalid or expired\n   → Create a new key at: https://aistudio.google.com/app/apikey\n\n4. Use Demo Mode for testing:\n   → Set CHAT_DEMO_MODE=true\n\nTechnical error: ${errorData.error?.message}` 
        }, 404);
      }
      
      return c.json({ 
        error: `Gemini API error: ${errorData.error?.message || 'Unknown error'}` 
      }, geminiResponse?.status || 500);
    }

    const geminiData = await geminiResponse.json();
    
    console.log('📦 Full Gemini API Response:', JSON.stringify(geminiData, null, 2));
    console.log('📦 Gemini response structure:', {
      hasCandidates: !!geminiData.candidates,
      candidatesLength: geminiData.candidates?.length,
      firstCandidate: geminiData.candidates?.[0],
      hasContent: !!geminiData.candidates?.[0]?.content,
      hasParts: !!geminiData.candidates?.[0]?.content?.parts,
      partsLength: geminiData.candidates?.[0]?.content?.parts?.length,
      firstPart: geminiData.candidates?.[0]?.content?.parts?.[0],
      promptFeedback: geminiData.promptFeedback,
      finishReason: geminiData.candidates?.[0]?.finishReason,
      safetyRatings: geminiData.candidates?.[0]?.safetyRatings,
    });
    
    // Extract response from Gemini's structure
    let aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    let debugInfo = null;
    
    // Check for alternative response structures (e.g., gemini-2.5-pro thinking mode)
    if (!aiResponse && geminiData.candidates?.[0]?.content) {
      const content = geminiData.candidates[0].content;
      
      // Try alternative fields
      if (content.text) {
        aiResponse = content.text;
      } else if (content.message) {
        aiResponse = content.message;
      }
      
      console.log('⚠️ No parts array found, checking alternative fields:', {
        hasText: !!content.text,
        hasMessage: !!content.message,
        contentKeys: Object.keys(content),
        finishReason: geminiData.candidates[0].finishReason,
      });
    }
    
    // If no text was generated, check why
    if (!aiResponse) {
      const finishReason = geminiData.candidates?.[0]?.finishReason;
      const safetyRatings = geminiData.candidates?.[0]?.safetyRatings;
      const promptFeedback = geminiData.promptFeedback;
      
      console.log('⚠️ No text generated. Diagnosis:', {
        finishReason,
        safetyRatings,
        promptFeedback,
        hasCandidates: !!geminiData.candidates,
        candidatesLength: geminiData.candidates?.length,
      });
      
      // Provide specific error messages based on the reason
      if (finishReason === 'SAFETY') {
        aiResponse = 'I apologize, but I cannot generate a response to that message due to content safety guidelines. Please try rephrasing your message, and I\'ll do my best to help you.';
        debugInfo = { reason: 'SAFETY_FILTER', safetyRatings };
      } else if (finishReason === 'RECITATION') {
        aiResponse = 'I apologize, but I cannot complete that response. Please try asking in a different way.';
        debugInfo = { reason: 'RECITATION' };
      } else if (promptFeedback?.blockReason) {
        aiResponse = `I apologize, but your message was blocked due to: ${promptFeedback.blockReason}. Please try rephrasing your message.`;
        debugInfo = { reason: 'PROMPT_BLOCKED', promptFeedback };
      } else if (!geminiData.candidates || geminiData.candidates.length === 0) {
        aiResponse = 'I apologize, but I was unable to generate a response. The API returned no candidates. This might be a temporary issue - please try again.';
        debugInfo = { reason: 'NO_CANDIDATES', fullResponse: geminiData };
      } else {
        aiResponse = 'I apologize, but I was unable to generate a response. Please try again.';
        debugInfo = { reason: 'UNKNOWN', finishReason, fullResponse: geminiData };
      }
    }

    console.log('✅ Gemini response received:', {
      responseLength: aiResponse?.length || 0,
      candidatesCount: geminiData.candidates?.length,
      responsePreview: aiResponse?.substring(0, 100) + '...',
      hasDebugInfo: !!debugInfo,
    });

    // Check for crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'self-harm', 'hurt myself'];
    const messageText = message.toLowerCase();
    const hasCrisisIndicator = crisisKeywords.some(keyword => messageText.includes(keyword));

    if (hasCrisisIndicator) {
      console.log('🚨 CRISIS INDICATOR DETECTED in chat:', {
        userId: user.id.substring(0, 8) + '***',
        conversationId: convId,
        timestamp: new Date().toISOString(),
      });

      // Log crisis alert
      const alertId = `CHAT-CRISIS-${Date.now()}`;
      await kv.set(`crisis-alert:${alertId}`, {
        userId: user.id,
        conversationId: convId,
        severity: 'critical',
        source: 'ai-chat',
        timestamp: new Date().toISOString(),
        actionTaken: 'Emergency resources provided in chat response',
      });
    }

    // Save to conversation history
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const assistantMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    history.push(userMessage, assistantMessage);
    await kv.set(historyKey, history);

    // Update conversation metadata
    await kv.set(`chat:${user.id}:${convId}:metadata`, {
      conversationId: convId,
      userId: user.id,
      startedAt: history[0]?.timestamp || new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      messageCount: history.length,
      hasCrisisIndicator,
      aiProvider: 'gemini',
    });

    // Add to user's conversation list
    const conversationsKey = `chat:${user.id}:conversations`;
    const conversations = (await kv.get(conversationsKey)) || [];
    if (!conversations.includes(convId)) {
      conversations.push(convId);
      await kv.set(conversationsKey, conversations);
    }

    return c.json({
      success: true,
      conversationId: convId,
      response: aiResponse,
      hasCrisisIndicator,
      timestamp: new Date().toISOString(),
      aiProvider: 'gemini',
      debugInfo: debugInfo || undefined, // Include debug info if available
      modelUsed: successfulModel || undefined, // Include which model was used
    });
  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: `Chat failed: ${error.message}` }, 500);
  }
});

/**
 * Get conversation history
 */
chatApp.get('/history/:conversationId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const conversationId = c.req.param('conversationId');
    if (!conversationId) {
      return c.json({ error: 'Conversation ID is required' }, 400);
    }

    // Get conversation history
    const historyKey = `chat:${user.id}:${conversationId}:history`;
    const history = (await kv.get(historyKey)) || [];

    // Get metadata
    const metadata = await kv.get(`chat:${user.id}:${conversationId}:metadata`);

    return c.json({
      success: true,
      conversationId,
      history,
      metadata,
    });
  } catch (error) {
    console.error('Get history error:', error);
    return c.json({ error: `Failed to get history: ${error.message}` }, 500);
  }
});

/**
 * Get all conversations for a user
 */
chatApp.get('/conversations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const conversationsKey = `chat:${user.id}:conversations`;
    const conversationIds = (await kv.get(conversationsKey)) || [];

    // Get metadata for each conversation
    const conversations = [];
    for (const convId of conversationIds) {
      const metadata = await kv.get(`chat:${user.id}:${convId}:metadata`);
      if (metadata) {
        conversations.push(metadata);
      }
    }

    // Sort by last message time
    conversations.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return c.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return c.json({ error: `Failed to get conversations: ${error.message}` }, 500);
  }
});

/**
 * Delete a conversation
 */
chatApp.delete('/conversation/:conversationId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized - valid access token required' }, 401);
    }

    const conversationId = c.req.param('conversationId');
    if (!conversationId) {
      return c.json({ error: 'Conversation ID is required' }, 400);
    }

    // Delete conversation data
    await kv.del(`chat:${user.id}:${conversationId}:history`);
    await kv.del(`chat:${user.id}:${conversationId}:metadata`);

    // Remove from user's conversation list
    const conversationsKey = `chat:${user.id}:conversations`;
    const conversations = (await kv.get(conversationsKey)) || [];
    const updatedConversations = conversations.filter((id: string) => id !== conversationId);
    await kv.set(conversationsKey, updatedConversations);

    return c.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return c.json({ error: `Failed to delete conversation: ${error.message}` }, 500);
  }
});

export default chatApp;