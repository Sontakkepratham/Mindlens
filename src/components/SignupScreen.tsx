import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Alert } from './ui/alert';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signUpUser, signInWithGoogle, handleOAuthCallback, storeSession } from '../lib/auth';
import mindlensLogo from 'figma:asset/cd1d8896983c70c4f2f82063f4b34137a63890b4.png';

interface SignupScreenProps {
  onSignupSuccess: (userId: string, email: string, accessToken: string) => void;
  onSwitchToSignin: () => void;
}

export function SignupScreen({ onSignupSuccess, onSwitchToSignin }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Check for OAuth callback on mount
  useEffect(() => {
    const checkOAuthSession = async () => {
      const oauthResult = await handleOAuthCallback();
      if (oauthResult && oauthResult.success && oauthResult.userId && oauthResult.email && oauthResult.accessToken) {
        // Store session
        storeSession(oauthResult.userId, oauthResult.accessToken, oauthResult.email);
        // Trigger success callback
        onSignupSuccess(oauthResult.userId, oauthResult.email, oauthResult.accessToken);
      }
    };
    
    checkOAuthSession();
  }, [onSignupSuccess]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the Privacy Policy and Terms of Service');
      return;
    }

    setLoading(true);

    try {
      const result = await signUpUser(email, password, name);
      
      if (result.success && result.userId) {
        setSuccess(true);
        // Automatically sign them in after successful signup
        setTimeout(() => {
          onSignupSuccess(result.userId!, email, result.accessToken!);
        }, 1500);
      } else {
        setError(result.error || 'Sign up failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
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
          <p className="text-muted-foreground">Start your mental health journey today</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Success Alert */}
        {success && (
          <Alert className="border-green-500/20 bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-green-900 mb-1">Account Created!</h3>
                <p className="text-green-800 text-sm">
                  Welcome to MindLens. Redirecting you to the app...
                </p>
              </div>
            </div>
          </Alert>
        )}

        {/* Error Alert */}
        {error && !success && (
          <Alert className="border-destructive/20 bg-destructive/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h3 className="text-destructive mb-1">Sign Up Failed</h3>
                <p className="text-destructive text-sm">{error}</p>
              </div>
            </div>
          </Alert>
        )}

        {/* Privacy Notice */}
        <Card className="border-primary/20 bg-accent/30">
          <div className="p-5">
            <h3 className="text-primary mb-2">🔒 Your Privacy Matters</h3>
            <ul className="space-y-1 text-accent-foreground text-sm">
              <li>• AES-256 end-to-end encryption</li>
              <li>• HIPAA-compliant data storage</li>
              <li>• No sharing without explicit consent</li>
              <li>• Anonymous data for research only</li>
            </ul>
          </div>
        </Card>

        {/* Sign Up Form */}
        <Card className="border-border bg-card shadow-sm">
          <form onSubmit={handleSignup} className="p-5 space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-card-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || success}
                />
              </div>
            </div>

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
                  disabled={loading || success}
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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || success}
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-card-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading || success}
                  minLength={6}
                />
              </div>
            </div>

            {/* Terms & Privacy */}
            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                disabled={loading || success}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>
                , and consent to encrypted storage of my mental health data for clinical purposes.
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Account created!
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Card>

        {/* Switch to Sign In */}
        <Card className="border-border bg-card shadow-sm">
          <div className="p-5 text-center">
            <p className="text-muted-foreground mb-3">Already have an account?</p>
            <Button
              onClick={onSwitchToSignin}
              variant="outline"
              className="w-full border-border hover:bg-accent"
              disabled={loading || success}
            >
              Sign In Instead
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}