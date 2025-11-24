import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Simple encryption for API keys (base64 + salt for basic protection)
// Note: In production, use proper encryption libraries
const encryptKey = (key: string): string => {
  const salt = 'mindlens-secure-salt-2024';
  const combined = salt + key + salt;
  return btoa(combined);
};

const decryptKey = (encrypted: string): string => {
  const salt = 'mindlens-secure-salt-2024';
  try {
    const combined = atob(encrypted);
    return combined.slice(salt.length, -salt.length);
  } catch {
    return '';
  }
};

// Get current settings status
app.get('/settings', async (c) => {
  try {
    // Check KV store first, then environment variables
    const kvDemoMode = await kv.get('chat_demo_mode');
    const kvGeminiKey = await kv.get('gemini_api_key_encrypted');
    
    const envDemoMode = Deno.env.get('CHAT_DEMO_MODE') === 'true';
    const envGeminiKey = Deno.env.get('GEMINI_API_KEY');
    
    // KV store takes priority
    const demoMode = kvDemoMode !== null ? kvDemoMode === 'true' : envDemoMode;
    const hasGeminiKey = kvGeminiKey !== null ? !!kvGeminiKey : !!envGeminiKey;
    
    let mode = 'Unknown';
    if (demoMode) {
      mode = 'Demo Mode (Simulated)';
    } else if (hasGeminiKey) {
      mode = 'Gemini API (Live)';
    } else {
      mode = 'No API Configured';
    }
    
    console.log('📊 Current Settings Status:', {
      demoMode,
      hasGeminiKey,
      mode,
      source: kvDemoMode !== null ? 'KV Store' : 'Environment',
    });

    return c.json({
      success: true,
      demoMode,
      hasGeminiKey,
      mode,
      usingKvStore: kvDemoMode !== null || kvGeminiKey !== null,
    });
  } catch (error: any) {
    console.error('❌ Failed to get settings:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update settings (stores in KV for dynamic updates)
app.post('/settings', async (c) => {
  try {
    const body = await c.req.json();
    const { geminiApiKey, demoMode } = body;

    console.log('📝 Updating settings:', {
      updateApiKey: !!geminiApiKey,
      demoMode,
    });

    const updates: string[] = [];

    // Update API key in KV store (encrypted)
    if (geminiApiKey) {
      // Validate API key format
      if (!geminiApiKey.startsWith('AIza')) {
        return c.json({ 
          error: 'Invalid API key format. Gemini API keys should start with "AIza"' 
        }, 400);
      }
      
      const encrypted = encryptKey(geminiApiKey);
      await kv.set('gemini_api_key_encrypted', encrypted);
      updates.push('✅ Gemini API Key saved');
    }

    // Update demo mode in KV store
    if (demoMode !== undefined) {
      await kv.set('chat_demo_mode', demoMode.toString());
      updates.push(`✅ Demo Mode ${demoMode ? 'enabled' : 'disabled'}`);
    }

    console.log('✅ Settings updated successfully:', updates);

    return c.json({
      success: true,
      message: 'Settings updated successfully! Changes will take effect immediately.',
      updates,
    });
  } catch (error: any) {
    console.error('❌ Failed to update settings:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Test API key
app.post('/test-api-key', async (c) => {
  try {
    const body = await c.req.json();
    const { apiKey } = body;

    if (!apiKey) {
      return c.json({ error: 'API key is required' }, 400);
    }

    // Validate format
    if (!apiKey.startsWith('AIza')) {
      return c.json({ 
        error: 'Invalid API key format. Gemini API keys should start with "AIza"' 
      }, 400);
    }

    console.log('🧪 Testing Gemini API key...');

    // Test the API key with a simple request
    const testResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Hello, this is a test. Reply with OK.' }]
          }]
        }),
      }
    );

    if (!testResponse.ok) {
      const errorData = await testResponse.json();
      console.error('❌ API key test failed:', errorData);
      
      if (testResponse.status === 400) {
        throw new Error('API key is invalid or not properly configured');
      } else if (testResponse.status === 429) {
        throw new Error('API quota exceeded. Check your billing settings at https://aistudio.google.com/billing');
      } else {
        throw new Error(errorData.error?.message || 'API key test failed');
      }
    }

    const data = await testResponse.json();
    
    // Check if we got a valid response
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('API key works but returned no response. This may be a temporary issue.');
    }

    console.log('✅ API key test successful!');

    return c.json({
      success: true,
      message: '✅ API key is valid and working!',
      model: 'gemini-1.5-flash',
      testResponse: data.candidates[0]?.content?.parts[0]?.text || 'OK',
    });
  } catch (error: any) {
    console.error('❌ API key test failed:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Helper function to get Gemini API key (checks KV store first, then env)
export const getGeminiApiKey = async (): Promise<string | null> => {
  // Check KV store first
  const kvKey = await kv.get('gemini_api_key_encrypted');
  if (kvKey) {
    return decryptKey(kvKey);
  }
  
  // Fallback to environment variable
  return Deno.env.get('GEMINI_API_KEY') || null;
};

// Helper function to check if demo mode is enabled (checks KV store first, then env)
export const isDemoMode = async (): Promise<boolean> => {
  // Check KV store first
  const kvMode = await kv.get('chat_demo_mode');
  if (kvMode !== null) {
    return kvMode === 'true';
  }
  
  // Fallback to environment variable
  return Deno.env.get('CHAT_DEMO_MODE') === 'true';
};

export default app;