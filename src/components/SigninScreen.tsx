import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert } from './ui/alert';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { signInUser } from '../lib/auth';

interface SigninScreenProps {
  onSigninSuccess: (userId: string, email: string) => void;
  onSwitchToSignup: () => void;
}

export function SigninScreen({ onSigninSuccess, onSwitchToSignup }: SigninScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signInUser(email, password);
      
      if (result.success && result.userId) {
        onSigninSuccess(result.userId, email);
      } else {
        setError(result.error || 'Sign in failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
          <h2 className="text-slate-900">Sign In to MindLens</h2>
        </div>
        <p className="text-slate-600">Welcome back to your mental health journey</p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Info Card */}
        <Card className="border-cyan-200 bg-cyan-50">
          <div className="p-5">
            <h3 className="text-cyan-900 mb-2">Secure & Private</h3>
            <p className="text-cyan-800 text-sm">
              Your mental health data is encrypted end-to-end with AES-256 encryption. 
              We take your privacy seriously.
            </p>
          </div>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-red-900 mb-1">Sign In Failed</h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </Alert>
        )}

        {/* Sign In Form */}
        <Card className="border-slate-200 bg-white">
          <form onSubmit={handleSignin} className="p-5 space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
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
              <Label htmlFor="password" className="text-slate-900">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
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
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
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

        {/* Switch to Signup */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5 text-center">
            <p className="text-slate-600 mb-3">Don't have an account?</p>
            <Button
              onClick={onSwitchToSignup}
              variant="outline"
              className="w-full border-slate-300"
              disabled={loading}
            >
              Create New Account
            </Button>
          </div>
        </Card>

        {/* Features */}
        <div className="pt-4">
          <h3 className="text-slate-900 mb-3">What's Included:</h3>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-cyan-600 text-xs">✓</span>
              </div>
              <span>PHQ-9 mental health assessments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-cyan-600 text-xs">✓</span>
              </div>
              <span>AI-powered emotion analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-cyan-600 text-xs">✓</span>
              </div>
              <span>Personalized counselor recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-cyan-600 text-xs">✓</span>
              </div>
              <span>Secure, encrypted data storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
