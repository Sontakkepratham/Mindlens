/**
 * Database migration endpoints for MindLens product launch
 * Creates proper relational tables with RLS policies
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const migrationApp = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

export const MIGRATION_SQL = `
-- ============================================================
-- MindLens Product Launch Schema
-- Run this in Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 1. USER PROFILES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mindlens_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  date_of_birth DATE,
  gender TEXT,
  timezone TEXT DEFAULT 'UTC',
  consent_given BOOLEAN DEFAULT FALSE,
  consent_given_at TIMESTAMPTZ,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mindlens_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON mindlens_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON mindlens_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON mindlens_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ─────────────────────────────────────────────
-- 2. PHQ-9 ASSESSMENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mindlens_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  phq_score INTEGER NOT NULL CHECK (phq_score >= 0 AND phq_score <= 27),
  severity TEXT NOT NULL CHECK (severity IN ('Minimal','Mild','Moderate','Moderately Severe','Severe')),
  responses JSONB NOT NULL,
  emotion_analysis JSONB,
  face_scan_data JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON mindlens_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON mindlens_assessments(created_at DESC);

ALTER TABLE mindlens_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON mindlens_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments"
  ON mindlens_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 3. BIG FIVE PERSONALITY RESULTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mindlens_personality_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  openness NUMERIC(5,2) NOT NULL,
  conscientiousness NUMERIC(5,2) NOT NULL,
  extraversion NUMERIC(5,2) NOT NULL,
  agreeableness NUMERIC(5,2) NOT NULL,
  neuroticism NUMERIC(5,2) NOT NULL,
  dominant_trait TEXT,
  insights JSONB,
  raw_responses JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_personality_user_id ON mindlens_personality_results(user_id);

ALTER TABLE mindlens_personality_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personality results"
  ON mindlens_personality_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personality results"
  ON mindlens_personality_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 4. AI CHAT CONVERSATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mindlens_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_key TEXT UNIQUE NOT NULL,
  title TEXT,
  crisis_detected BOOLEAN DEFAULT FALSE,
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON mindlens_conversations(user_id);

ALTER TABLE mindlens_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON mindlens_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations"
  ON mindlens_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations"
  ON mindlens_conversations FOR UPDATE USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 5. CHAT MESSAGES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mindlens_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES mindlens_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  ai_provider TEXT,
  model_used TEXT,
  has_crisis_indicator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON mindlens_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON mindlens_messages(user_id);

ALTER TABLE mindlens_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON mindlens_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages"
  ON mindlens_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 6. SESSION BOOKINGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mindlens_session_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_key TEXT UNIQUE NOT NULL,
  session_type TEXT NOT NULL,
  counselor_name TEXT,
  selected_date DATE NOT NULL,
  selected_time TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled','completed','no-show')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON mindlens_session_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON mindlens_session_bookings(selected_date);

ALTER TABLE mindlens_session_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON mindlens_session_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookings"
  ON mindlens_session_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 7. AFFECTIVE GO/NO-GO GAME RESULTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mindlens_game_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  score INTEGER,
  accuracy NUMERIC(5,2),
  reaction_time_ms INTEGER,
  false_alarms INTEGER,
  misses INTEGER,
  hits INTEGER,
  result_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_results_user_id ON mindlens_game_results(user_id);

ALTER TABLE mindlens_game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game results"
  ON mindlens_game_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own game results"
  ON mindlens_game_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 8. COUPLE COMPATIBILITY TEST RESULTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mindlens_couple_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_name TEXT,
  compatibility_score NUMERIC(5,2),
  compatibility_level TEXT,
  dimensions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mindlens_couple_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own couple results"
  ON mindlens_couple_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own couple results"
  ON mindlens_couple_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 9. UPDATED_AT TRIGGERS
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mindlens_profiles_updated_at
  BEFORE UPDATE ON mindlens_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mindlens_bookings_updated_at
  BEFORE UPDATE ON mindlens_session_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- 10. AUTO-CREATE PROFILE ON SIGNUP
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.mindlens_profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Done!
SELECT 'MindLens schema created successfully' AS status;
`;

/**
 * GET /migration/sql — return the SQL script
 */
migrationApp.get('/sql', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) return c.json({ error: 'Unauthorized' }, 401);

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

  return c.json({ success: true, sql: MIGRATION_SQL });
});

/**
 * GET /migration/status — check which tables exist
 */
migrationApp.get('/status', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) return c.json({ error: 'Unauthorized' }, 401);

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

  const tables = [
    'mindlens_profiles',
    'mindlens_assessments',
    'mindlens_personality_results',
    'mindlens_conversations',
    'mindlens_messages',
    'mindlens_session_bookings',
    'mindlens_game_results',
    'mindlens_couple_results',
  ];

  const status: Record<string, boolean> = {};

  for (const table of tables) {
    try {
      const { error: tableError } = await supabase.from(table).select('id').limit(1);
      status[table] = !tableError;
    } catch {
      status[table] = false;
    }
  }

  const totalTables = tables.length;
  const createdTables = Object.values(status).filter(Boolean).length;

  return c.json({
    success: true,
    status,
    summary: {
      total: totalTables,
      created: createdTables,
      pending: totalTables - createdTables,
      isReady: createdTables === totalTables,
    },
  });
});

/**
 * GET /migration/stats — aggregate stats across all tables
 */
migrationApp.get('/stats', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) return c.json({ error: 'Unauthorized' }, 401);

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return c.json({ error: 'Unauthorized' }, 401);

  const stats: Record<string, number> = {};

  const tableCounts = [
    { key: 'users', table: 'mindlens_profiles' },
    { key: 'assessments', table: 'mindlens_assessments' },
    { key: 'personality_results', table: 'mindlens_personality_results' },
    { key: 'conversations', table: 'mindlens_conversations' },
    { key: 'messages', table: 'mindlens_messages' },
    { key: 'bookings', table: 'mindlens_session_bookings' },
    { key: 'game_results', table: 'mindlens_game_results' },
  ];

  for (const { key, table } of tableCounts) {
    try {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      stats[key] = count ?? 0;
    } catch {
      stats[key] = -1;
    }
  }

  return c.json({ success: true, stats });
});

export default migrationApp;
