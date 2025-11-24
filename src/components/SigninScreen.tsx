import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert } from './ui/alert';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { signInUser, signInWithGoogle, handleOAuthCallback, storeSession } from '../lib/auth';
import mindlensLogo from 'figma:asset/cd1d8896983c70c4f2f82063f4b34137a63890b4.png';

interface SigninScreenProps {
  onSigninSuccess: (userId: string, email: string, accessToken: string) => void;
  onSwitchToSignup: () => void;
}

export function SigninScreen({ onSigninSuccess, onSwitchToSignup }: SigninScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for OAuth callback on mount
  useEffect(() => {
    const checkOAuthSession = async () => {
      const oauthResult = await handleOAuthCallback();
      if (oauthResult && oauthResult.success && oauthResult.userId && oauthResult.email && oauthResult.accessToken) {
        // Store session
        storeSession(oauthResult.userId, oauthResult.accessToken, oauthResult.email);
        // Trigger success callback
        onSigninSuccess(oauthResult.userId, oauthResult.email, oauthResult.accessToken);
      }
    };
    
    checkOAuthSession();
  }, [onSigninSuccess]);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const result = await signInUser(email, password);
      
      console.log('📥 Sign in result:', {
        success: result.success,
        hasUserId: !!result.userId,
        hasAccessToken: !!result.accessToken,
        accessTokenLength: result.accessToken?.length,
        accessTokenStart: result.accessToken?.substring(0, 30) + '...',
        error: result.error,
      });
      
      if (result.success && result.userId && result.accessToken) {
        // Store the session before navigating
        storeSession(result.userId, result.accessToken, email);
        onSigninSuccess(result.userId, email, result.accessToken);
      } else {
        // Provide a more helpful error message
        const errorMsg = result.error || 'Sign in failed. Please try again.';
        
        // If it's an invalid credentials error, suggest signing up
        if (errorMsg.includes('Invalid') || errorMsg.includes('credentials') || errorMsg.includes('password')) {
          setError('Invalid email or password. Don\'t have an account yet? Click "Create New Account" below to sign up.');
        } else {
          setError(errorMsg);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      
      // For OAuth, the user will be redirected to Google
      // When they return, the useEffect will handle the session
      if (!result.success) {
        setError(result.error || 'Google sign in failed. Please try again.');
        setLoading(false);
      }
      // If success, user is being redirected - keep loading state
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with Logo */}
      <div className="sticky top-0 bg-card z-10 px-6 py-6 border-b border-border shadow-sm">
        <div className="flex flex-col items-center text-center">
          <img 
            src={mindlensLogo} 
            alt="MindLens Logo" 
            className="w-32 h-32 mb-2"
          />
          <p className="text-muted-foreground">Welcome back to your mental health journey</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Info Card */}
        <Card className="border-primary/20 bg-accent/30">
          <div className="p-5">
            <h3 className="text-primary mb-2">Secure & Private</h3>
            <p className="text-accent-foreground text-sm">
              Your mental health data is encrypted end-to-end with AES-256 encryption. 
              We take your privacy seriously.
            </p>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="border-destructive/20 bg-destructive/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h3 className="text-destructive mb-1">Sign In Failed</h3>
                <p className="text-destructive text-sm">{error}</p>
              </div>
            </div>
          </Alert>
        )}

        {/* Sign In Form */}
        <Card className="border-border bg-card shadow-sm">
          <form onSubmit={handleSignin} className="p-5 space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-card-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Google Sign In */}
        <Card className="border-border bg-card shadow-sm">
          <div className="p-5 text-center">
            <p className="text-muted-foreground mb-3">Or sign in with Google</p>
            <Button
              onClick={handleGoogleSignin}
              variant="outline"
              className="w-full border-border hover:bg-accent"
              disabled={loading}
            >
              Sign In with Google
            </Button>
          </div>
        </Card>

        {/* Switch to Signup */}
        <Card className="border-border bg-card shadow-sm">
          <div className="p-5 text-center">
            <p className="text-muted-foreground mb-3">Don't have an account?</p>
            <Button
              onClick={onSwitchToSignup}
              variant="outline"
              className="w-full border-border hover:bg-accent"
              disabled={loading}
            >
              Create New Account
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="pt-4">
          <h3 className="text-foreground mb-3">What's Included:</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xs">✓</span>
              </div>
              <span>PHQ-9 mental health assessments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xs">✓</span>
              </div>
              <span>AI-powered emotion analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xs">✓</span>
              </div>
              <span>Personalized counselor recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xs">✓</span>
              </div>
              <span>Secure, encrypted data storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}