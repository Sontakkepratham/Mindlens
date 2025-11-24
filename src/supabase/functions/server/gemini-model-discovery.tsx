/**
 * Gemini Model Discovery
 * Discovers available Gemini models for the current API key
 */

/**
 * Discover available Gemini models
 */
export async function discoverAvailableModels(apiKey: string): Promise<{
  success: boolean;
  models: string[];
  error?: string;
}> {
  try {
    console.log('🔍 Discovering available Gemini models...');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Failed to discover models:', errorData);
      return {
        success: false,
        models: [],
        error: errorData.error?.message || 'Failed to discover models',
      };
    }

    const data = await response.json();
    console.log('📦 Raw models response:', JSON.stringify(data, null, 2));
    
    // Extract model names that support generateContent
    const availableModels = (data.models || [])
      .filter((model: any) => 
        model.supportedGenerationMethods?.includes('generateContent')
      )
      .map((model: any) => model.name);

    console.log('✅ Available models:', availableModels);

    return {
      success: true,
      models: availableModels,
    };
  } catch (error) {
    console.error('❌ Error discovering models:', error);
    return {
      success: false,
      models: [],
      error: error.message,
    };
  }
}

/**
 * Get prioritized models to try
 * Returns models in order of preference (fastest first)
 */
export function getPrioritizedModels(availableModels: string[]): string[] {
  // Preferred models in order of speed/performance
  const preferredOrder = [
    'models/gemini-1.5-flash-latest',
    'models/gemini-1.5-flash-8b-latest',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-flash-8b',
    'models/gemini-1.5-pro-latest',
    'models/gemini-1.5-pro',
    'models/gemini-2.0-flash-exp',
    'models/gemini-exp-1206',
    'models/gemini-pro',
  ];

  // Return available models in preferred order
  const prioritized: string[] = [];
  
  for (const preferred of preferredOrder) {
    if (availableModels.includes(preferred)) {
      prioritized.push(preferred);
    }
  }

  // Add any remaining available models not in preferred list
  for (const model of availableModels) {
    if (!prioritized.includes(model)) {
      prioritized.push(model);
    }
  }

  return prioritized;
}
