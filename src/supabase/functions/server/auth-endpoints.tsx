/**
 * Authentication endpoints for MindLens
 * Handles user signup, signin, and session management
 */

import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const authApp = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

/**
 * Sign up a new user
 * POST /auth/signup
 */
authApp.post('/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    console.log('Creating new user account:', email);

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name: name || email.split('@')[0],
        created_at: new Date().toISOString(),
      },
      // Automatically confirm email since email server not configured
      email_confirm: true,
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle specific errors
      if (error.message.includes('already registered')) {
        return c.json({ 
          error: 'This email is already registered. Please sign in instead.' 
        }, 409);
      }
      
      return c.json({ 
        error: error.message || 'Failed to create account' 
      }, 400);
    }

    if (!data.user) {
      return c.json({ error: 'User creation failed' }, 500);
    }

    console.log('✅ User created successfully:', data.user.id);

    // Generate session for the new user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
    });

    // Return user info
    return c.json({
      success: true,
      userId: data.user.id,
      email: data.user.email,
      accessToken: sessionData?.properties?.access_token || 'auto-signin',
      message: 'Account created successfully',
    });

  } catch (error: any) {
    console.error('Signup endpoint error:', error);
    return c.json({ 
      error: error.message || 'Server error during signup' 
    }, 500);
  }
});

/**
 * Sign in an existing user
 * POST /auth/signin
 */
authApp.post('/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    console.log('User signin attempt:', email);

    // Create a client-side Supabase instance for signin
    const clientSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data, error } = await clientSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Signin error:', error);
      
      // Handle specific errors
      if (error.message.includes('Invalid login credentials')) {
        return c.json({ 
          error: 'Invalid email or password. Please try again.' 
        }, 401);
      }
      
      return c.json({ 
        error: error.message || 'Sign in failed' 
      }, 400);
    }

    if (!data.user || !data.session) {
      return c.json({ error: 'Sign in failed - no session created' }, 500);
    }

    console.log('✅ User signed in successfully:', data.user.id);

    return c.json({
      success: true,
      userId: data.user.id,
      email: data.user.email,
      accessToken: data.session.access_token,
      message: 'Signed in successfully',
    });

  } catch (error: any) {
    console.error('Signin endpoint error:', error);
    return c.json({ 
      error: error.message || 'Server error during signin' 
    }, 500);
  }
});

/**
 * Sign out
 * POST /auth/signout
 */
authApp.post('/signout', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (accessToken && accessToken !== 'auto-signin') {
      const clientSupabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      );

      await clientSupabase.auth.signOut();
    }

    return c.json({
      success: true,
      message: 'Signed out successfully',
    });

  } catch (error: any) {
    console.error('Signout endpoint error:', error);
    return c.json({ 
      success: true, // Still return success since local signout works
      message: 'Signed out locally',
    });
  }
});

/**
 * Get current user info
 * GET /auth/me
 */
authApp.get('/me', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (!accessToken || accessToken === 'auto-signin') {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    return c.json({
      success: true,
      userId: user.id,
      email: user.email,
      name: user.user_metadata?.name,
      createdAt: user.created_at,
    });

  } catch (error: any) {
    console.error('Get user endpoint error:', error);
    return c.json({ 
      error: error.message || 'Failed to get user info' 
    }, 500);
  }
});

export default authApp;
