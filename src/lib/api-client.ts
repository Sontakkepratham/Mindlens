/**
 * API Client for MindLens Backend
 * Handles all communication with Supabase edge functions and Google Cloud services
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from './supabase-client';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b`;

/**
 * Get current access token from Supabase session
 */
async function getAccessToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requiresAuth) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Auth API
 */
export const authAPI = {
  async signUp(email: string, password: string, name: string) {
    const result = await apiRequest<{ success: boolean; userId: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }, false);
    
    // Sign in immediately after signup
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(`Sign in after signup failed: ${error.message}`);
    
    return { ...result, session: data.session };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(`Sign in failed: ${error.message}`);
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Sign out failed: ${error.message}`);
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};

/**
 * Assessment API
 */
export const assessmentAPI = {
  async submitAssessment(
    phqResponses: number[],
    faceScanData: string | null,
    consentToResearch: boolean
  ) {
    return apiRequest<{
      success: boolean;
      sessionId: string;
      phqScore: number;
      emotionAnalysis: any;
      requiresImmediateAction: boolean;
      gsUri: string;
    }>('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ phqResponses, faceScanData, consentToResearch }),
    });
  },
};

/**
 * Counselor API
 */
export const counselorAPI = {
  async getRecommendations(phqScore: number) {
    return apiRequest<{
      success: boolean;
      counselors: any[];
    }>(`/counselors/recommendations?phqScore=${phqScore}`, {
      method: 'GET',
    });
  },
};

/**
 * Session Booking API
 */
export const sessionAPI = {
  async bookSession(counselorId: string, preferredDate?: string, preferredTime?: string) {
    return apiRequest<{
      success: boolean;
      booking: {
        bookingId: string;
        sessionNumber: string;
        scheduledDate: string;
        scheduledTime: string;
        meetingLink: string;
        status: string;
      };
    }>('/sessions/book', {
      method: 'POST',
      body: JSON.stringify({ counselorId, preferredDate, preferredTime }),
    });
  },
};

/**
 * User Dashboard API
 */
export const userAPI = {
  async getDashboard() {
    return apiRequest<{
      success: boolean;
      dashboard: {
        profile: any;
        latestAssessment: any;
        assessmentCount: number;
        upcomingSessions: any[];
      };
    }>('/user/dashboard', {
      method: 'GET',
    });
  },
};

/**
 * AI / Vertex AI API
 */
export const aiAPI = {
  async analyzeFace(imageBase64: string) {
    return apiRequest<{
      success: boolean;
      emotionAnalysis: {
        primaryEmotion: string;
        secondaryMarkers: string;
        confidence: number;
        facialLandmarks: any;
        vertexAiModelVersion: string;
        processingTime: number;
      };
    }>('/ai/analyze-face', {
      method: 'POST',
      body: JSON.stringify({ imageBase64 }),
    });
  },
};

/**
 * Analytics API (BigQuery)
 */
export const analyticsAPI = {
  async getAggregateData() {
    return apiRequest<{
      success: boolean;
      analytics: {
        totalAssessments: number;
        averagePhqScore: number;
        severityDistribution: Record<string, number>;
        emotionDistribution: Record<string, number>;
        timeRange: string;
      };
    }>('/analytics/aggregate', {
      method: 'GET',
    });
  },
};

/**
 * Emergency API
 */
export const emergencyAPI = {
  async triggerEmergency(severity: string, message: string) {
    return apiRequest<{
      success: boolean;
      alert: any;
      emergencyResources: {
        suicidePrevention: string;
        crisisTextLine: string;
        emergency: string;
      };
    }>('/emergency/trigger', {
      method: 'POST',
      body: JSON.stringify({ severity, message }),
    });
  },
};

/**
 * Health Check
 */
export async function checkAPIHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}