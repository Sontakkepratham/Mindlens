/**
 * Singleton Supabase client for MindLens
 * Prevents multiple GoTrueClient instances warning
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get the singleton Supabase client instance
 * Creates the client only once and reuses it
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          // Use same storage key to avoid multiple instances
          storageKey: 'mindlens-auth',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      }
    );
  }

  return supabaseInstance;
}

/**
 * Export the singleton instance
 */
export const supabase = getSupabaseClient();
