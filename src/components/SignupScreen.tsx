import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Alert } from './ui/alert';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signUpUser } from '../lib/auth';

interface SignupScreenProps {
  onSignupSuccess: (userId: string, email: string) => void;
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
          onSignupSuccess(result.userId!, email);
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
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
          <h2 className="text-slate-900">Create Your MindLens Account</h2>
        </div>
        <p className="text-slate-600">Start your mental health journey today</p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
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
          <Alert className="border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-red-900 mb-1">Sign Up Failed</h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </Alert>
        )}

        {/* Privacy Notice */}
        <Card className="border-cyan-200 bg-cyan-50">
          <div className="p-5">
            <h3 className="text-cyan-900 mb-2">🔒 Your Privacy Matters</h3>
            <ul className="space-y-1 text-cyan-800 text-sm">
              <li>• AES-256 end-to-end encryption</li>
              <li>• HIPAA-compliant data storage</li>
              <li>• No sharing without explicit consent</li>
              <li>• Anonymous data for research only</li>
            </ul>
          </div>
        </Card>

        {/* Sign Up Form */}
        <Card className="border-slate-200 bg-white">
          <form onSubmit={handleSignup} className="p-5 space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-900">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
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
                  disabled={loading || success}
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
              <Label htmlFor="confirmPassword" className="text-slate-900">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
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
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                disabled={loading || success}
              />
              <label htmlFor="terms" className="text-sm text-slate-700 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-cyan-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#" className="text-cyan-600 hover:underline">
                  Terms of Service
                </a>
                , and consent to encrypted storage of my mental health data for clinical purposes.
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
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
        <Card className="border-slate-200 bg-white">
          <div className="p-5 text-center">
            <p className="text-slate-600 mb-3">Already have an account?</p>
            <Button
              onClick={onSwitchToSignin}
              variant="outline"
              className="w-full border-slate-300"
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
