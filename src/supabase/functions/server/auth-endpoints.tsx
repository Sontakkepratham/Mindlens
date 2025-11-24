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

    // Use client Supabase for signup (more reliable for password auth)
    const clientSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Create user with Supabase Auth
    const { data, error } = await clientSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
          created_at: new Date().toISOString(),
        },
        // Email confirmation will be handled by Supabase settings
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle specific errors
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
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

    // Check if we got a session (auto-confirmed) or need email confirmation
    if (data.session) {
      // User is auto-confirmed and signed in
      return c.json({
        success: true,
        userId: data.user.id,
        email: data.user.email,
        accessToken: data.session.access_token,
        message: 'Account created successfully',
      });
    } else {
      // User needs email confirmation (but in dev mode, should be auto-confirmed)
      // Sign them in anyway for the prototype
      console.log('⚠️  No session returned, attempting signin...');
      
      const { data: signInData, error: signInError } = await clientSupabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.session) {
        console.error('Auto-signin after signup failed:', signInError);
        return c.json({
          success: true,
          userId: data.user.id,
          email: data.user.email,
          accessToken: 'pending',
          message: 'Account created. Please sign in to continue.',
        });
      }

      return c.json({
        success: true,
        userId: signInData.user.id,
        email: signInData.user.email,
        accessToken: signInData.session.access_token,
        message: 'Account created successfully',
      });
    }

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
          error: 'Invalid email or password. Please check your credentials and try again, or create a new account if you haven\'t signed up yet.' 
        }, 401);
      }
      
      if (error.message.includes('Email not confirmed')) {
        return c.json({ 
          error: 'Please confirm your email address before signing in.' 
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
 * Sign in with Google OAuth
 * POST /auth/google-signin
 * 
 * NOTE: Requires Google OAuth to be configured in Supabase dashboard
 * See: https://supabase.com/docs/guides/auth/social-login/auth-google
 */
authApp.post('/google-signin', async (c) => {
  try {
    console.log('Google OAuth signin attempt');

    // Create a client-side Supabase instance for OAuth
    const clientSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Initiate Google OAuth sign in
    const { data, error } = await clientSupabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/callback`,
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      
      // Check if Google provider is not enabled
      if (error.message.includes('provider') || error.message.includes('not enabled')) {
        return c.json({ 
          error: 'Google OAuth is not enabled. Please configure Google OAuth in your Supabase dashboard. Visit: https://supabase.com/docs/guides/auth/social-login/auth-google' 
        }, 400);
      }
      
      return c.json({ 
        error: error.message || 'Google sign in failed' 
      }, 400);
    }

    // OAuth returns a URL for the user to authenticate
    // For server-side, we need to handle this differently
    // Return the OAuth URL for the frontend to redirect
    return c.json({
      success: true,
      oauthUrl: data.url,
      message: 'Redirect to Google OAuth',
    });

  } catch (error: any) {
    console.error('Google signin endpoint error:', error);
    return c.json({ 
      error: error.message || 'Server error during Google signin. Please ensure Google OAuth is configured in Supabase dashboard.' 
    }, 500);
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