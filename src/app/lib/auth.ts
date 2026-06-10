/**
 * Authentication utilities for MindLens
 * Uses Supabase Auth for user management
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from './supabase-client';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b`;

interface AuthResponse {
  success: boolean;
  userId?: string;
  accessToken?: string;
  error?: string;
}

/**
 * Sign up a new user
 */
export async function signUpUser(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Sign up failed',
      };
    }

    return {
      success: true,
      userId: data.userId,
      accessToken: data.accessToken,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message || 'Network error during sign up',
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signInUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Sign in failed',
      };
    }

    return {
      success: true,
      userId: data.userId,
      accessToken: data.accessToken,
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message || 'Network error during sign in',
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<{ success: boolean }> {
  try {
    // Clear local session data
    localStorage.removeItem('mindlens_user_id');
    localStorage.removeItem('mindlens_access_token');
    localStorage.removeItem('mindlens_user_email');

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false };
  }
}

/**
 * Sign in with Google OAuth
 * Note: Requires Google OAuth to be configured in Supabase dashboard
 * See: https://supabase.com/docs/guides/auth/social-login/auth-google
 */
export async function signInWithGoogle(): Promise<AuthResponse & { email?: string }> {
  try {
    // Get the current URL for redirect
    const redirectUrl = window.location.origin;

    // Sign in with Google OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      
      if (error.message.includes('provider') || error.message.includes('not enabled')) {
        return {
          success: false,
          error: 'Google OAuth is not enabled. To enable: 1) Go to Supabase Dashboard → Authentication → Providers → Google, 2) Enable Google, 3) Add your Google OAuth credentials',
        };
      }

      return {
        success: false,
        error: error.message || 'Google sign in failed',
      };
    }

    // OAuth flow started - user will be redirected to Google
    // When they return, we'll handle the session
    return {
      success: true,
      userId: 'oauth-in-progress',
      accessToken: 'oauth-in-progress',
    };

  } catch (error: any) {
    console.error('Google sign in error:', error);
    return {
      success: false,
      error: 'Google OAuth is not yet configured. Please use email/password sign-in, or configure Google OAuth in your Supabase dashboard.',
    };
  }
}

/**
 * Handle OAuth callback after redirect
 * Call this on app initialization to check for OAuth session
 */
export async function handleOAuthCallback(): Promise<AuthResponse & { email?: string } | null> {
  try {
    // Check for OAuth session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('OAuth callback error:', error);
      return null;
    }

    if (session) {
      // User successfully signed in with OAuth
      return {
        success: true,
        userId: session.user.id,
        accessToken: session.access_token,
        email: session.user.email,
      };
    }

    return null;
  } catch (error: any) {
    console.error('OAuth callback handling error:', error);
    return null;
  }
}

/**
 * Check if user has an active session
 */
export function checkSession(): {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  accessToken?: string;
} {
  const userId = localStorage.getItem('mindlens_user_id');
  const email = localStorage.getItem('mindlens_user_email');
  const accessToken = localStorage.getItem('mindlens_access_token');

  return {
    isAuthenticated: !!userId,
    userId: userId || undefined,
    email: email || undefined,
    accessToken: accessToken || undefined,
  };
}

/**
 * Store user session locally
 */
export function storeSession(userId: string, accessToken: string, email: string): void {
  localStorage.setItem('mindlens_user_id', userId);
  localStorage.setItem('mindlens_access_token', accessToken);
  localStorage.setItem('mindlens_user_email', email);
}