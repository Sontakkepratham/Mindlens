import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert } from './ui/alert';
import { ArrowLeft, Send, Users, Heart, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ReferralScreenProps {
  onBack: () => void;
  userEmail: string;
}

type UrgencyLevel = 'low' | 'medium' | 'high' | 'crisis';
type RelationshipType = 'family' | 'friend' | 'colleague' | 'other';

export function ReferralScreen({ onBack, userEmail }: ReferralScreenProps) {
  const [formData, setFormData] = useState({
    referrerName: '',
    referredName: '',
    referredEmail: '',
    referredPhone: '',
    relationship: 'friend' as RelationshipType,
    urgency: 'medium' as UrgencyLevel,
    reason: '',
    additionalNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const referralData = {
        ...formData,
        referrerEmail: userEmail,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/referral`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(referralData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit referral');
      }

      setSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          referrerName: '',
          referredName: '',
          referredEmail: '',
          referredPhone: '',
          relationship: 'friend',
          urgency: 'medium',
          reason: '',
          additionalNotes: '',
        });
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Referral submission error:', err);
      setError(err.message || 'Failed to submit referral. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const urgencyConfig: Record<UrgencyLevel, { color: string; label: string; description: string }> = {
    low: {
      color: 'bg-green-500',
      label: 'Low',
      description: 'General support needed',
    },
    medium: {
      color: 'bg-yellow-500',
      label: 'Medium',
      description: 'Notable concerns',
    },
    high: {
      color: 'bg-orange-500',
      label: 'High',
      description: 'Urgent attention needed',
    },
    crisis: {
      color: 'bg-red-500',
      label: 'Crisis',
      description: 'Immediate intervention required',
    },
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-green-900 text-2xl font-semibold mb-3">
                Referral Submitted Successfully!
              </h2>
              <p className="text-green-700 mb-6">
                Thank you for caring. Our team will reach out to your referral within 24-48 hours.
              </p>
              
              <Button
                onClick={onBack}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Return to Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Refer Someone</span>
            </div>

            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-foreground text-3xl font-bold mb-4">
            Help Someone You Care About
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            If you know someone who could benefit from professional therapy or counseling, 
            refer them to us. Our team will reach out with compassionate support.
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 bg-primary/5">
            <div className="p-4 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="text-foreground font-medium mb-1">Confidential</h3>
              <p className="text-muted-foreground text-sm">
                All referrals are kept private and secure
              </p>
            </div>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <div className="p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-foreground font-medium mb-1">Fast Response</h3>
              <p className="text-muted-foreground text-sm">
                We'll reach out within 24-48 hours
              </p>
            </div>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <div className="p-4 text-center">
              <div className="text-3xl mb-2">💙</div>
              <h3 className="text-foreground font-medium mb-1">Professional Care</h3>
              <p className="text-muted-foreground text-sm">
                Licensed therapists and counselors
              </p>
            </div>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-destructive/20 bg-destructive/10 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h3 className="text-destructive mb-1">Submission Failed</h3>
                <p className="text-destructive text-sm">{error}</p>
              </div>
            </div>
          </Alert>
        )}

        {/* Referral Form */}
        <Card className="border-border bg-card shadow-lg">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-1 mb-6">
              <h2 className="text-foreground text-xl font-semibold">Referral Information</h2>
              <p className="text-muted-foreground text-sm">
                Please provide details about the person you'd like to refer
              </p>
            </div>

            {/* Your Name */}
            <div className="space-y-2">
              <Label htmlFor="referrerName" className="text-foreground">
                Your Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="referrerName"
                placeholder="John Doe"
                value={formData.referrerName}
                onChange={(e) => setFormData({ ...formData, referrerName: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            {/* Referred Person's Name */}
            <div className="space-y-2">
              <Label htmlFor="referredName" className="text-foreground">
                Person's Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="referredName"
                placeholder="Jane Smith"
                value={formData.referredName}
                onChange={(e) => setFormData({ ...formData, referredName: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referredEmail" className="text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="referredEmail"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.referredEmail}
                  onChange={(e) => setFormData({ ...formData, referredEmail: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referredPhone" className="text-foreground">
                  Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Input
                  id="referredPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.referredPhone}
                  onChange={(e) => setFormData({ ...formData, referredPhone: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Your Relationship <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['family', 'friend', 'colleague', 'other'] as RelationshipType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, relationship: type })}
                    disabled={loading}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-sm font-medium capitalize
                      ${formData.relationship === type
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Urgency Level <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['low', 'medium', 'high', 'crisis'] as UrgencyLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: level })}
                    disabled={loading}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-sm
                      ${formData.urgency === level
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${urgencyConfig[level].color}`} />
                      <span className="font-medium text-foreground">{urgencyConfig[level].label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{urgencyConfig[level].description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Reason for Referral */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-foreground">
                Reason for Referral <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="reason"
                placeholder="Please describe why you think this person could benefit from therapy or counseling..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
                disabled={loading}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="additionalNotes" className="text-foreground">
                Additional Notes <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <textarea
                id="additionalNotes"
                placeholder="Any additional information that might help our team..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Crisis Warning */}
            {formData.urgency === 'crisis' && (
              <Alert className="border-red-200 bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="text-red-900 font-medium mb-1">Crisis Support</h3>
                    <p className="text-red-800 text-sm mb-2">
                      If this is a life-threatening emergency, please call 911 or the National Suicide Prevention Lifeline at 988 immediately.
                    </p>
                    <p className="text-red-700 text-xs">
                      Our team will prioritize this referral, but emergency services can provide immediate help.
                    </p>
                  </div>
                </div>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting Referral...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Referral
                  </>
                )}
              </Button>
            </div>

            <p className="text-muted-foreground text-xs text-center">
              By submitting this referral, you confirm that you have permission to share this person's contact information. 
              All referrals are treated with the utmost confidentiality and care.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
