/**
 * Authentication utilities for MindLens
 * Uses Supabase Auth for user management
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';

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
    const response = await fetch(`${API_URL}/auth/google-signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Google sign in failed. Please ensure Google OAuth is configured in Supabase dashboard.',
      };
    }

    // If we received an OAuth URL, open it in a popup or redirect
    if (data.oauthUrl) {
      // For now, show an informative message
      // In a production app, you would redirect the user or open a popup
      return {
        success: false,
        error: 'Google OAuth requires additional configuration. Please use email/password sign-in for now. To enable Google OAuth, configure it in your Supabase dashboard: https://supabase.com/docs/guides/auth/social-login/auth-google',
      };
    }

    return {
      success: true,
      userId: data.userId,
      accessToken: data.accessToken,
      email: data.email,
    };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    return {
      success: false,
      error: 'Google OAuth is not yet configured. Please use email/password sign-in.',
    };
  }
}

/**
 * Check if user has an active session
 */
export function checkSession(): {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
} {
  const userId = localStorage.getItem('mindlens_user_id');
  const email = localStorage.getItem('mindlens_user_email');

  return {
    isAuthenticated: !!userId,
    userId: userId || undefined,
    email: email || undefined,
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