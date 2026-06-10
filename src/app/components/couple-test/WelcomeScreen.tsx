import { ArrowLeft, Heart, Users, TrendingUp, MessageCircle, Shield, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface WelcomeScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export function WelcomeScreen({ onStart, onBack }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h1 className="text-slate-900">Couple Compatibility Test</h1>
              <p className="text-sm text-slate-600">Know Your Partner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-4">
            <Heart className="w-12 h-12 text-pink-600" />
          </div>
          <h2 className="text-slate-900">Discover Your Relationship Dynamics</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Gain deep insights into your relationship compatibility, communication patterns, and areas 
            of strength and growth. This scientifically-designed assessment helps couples understand 
            each other better.
          </p>
        </div>

        {/* What You'll Discover */}
        <Card className="border-2 border-pink-200">
          <div className="p-8 space-y-6">
            <h3 className="text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              What You'll Discover
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-sm font-medium">Communication Style</h4>
                  <p className="text-sm text-slate-600">How effectively you express and listen to each other</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-sm font-medium">Conflict Resolution</h4>
                  <p className="text-sm text-slate-600">Your patterns in handling disagreements</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-sm font-medium">Emotional Intimacy</h4>
                  <p className="text-sm text-slate-600">Depth of your emotional connection and vulnerability</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-sm font-medium">Shared Values</h4>
                  <p className="text-sm text-slate-600">Alignment on life goals, priorities, and beliefs</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-sm font-medium">Trust & Security</h4>
                  <p className="text-sm text-slate-600">Level of safety and reliability in your bond</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-sm font-medium">Physical Affection</h4>
                  <p className="text-sm text-slate-600">Satisfaction with intimacy and affection</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="bg-slate-50 border-slate-200">
          <div className="p-8 space-y-4">
            <h3 className="text-slate-900">How It Works</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                  1
                </div>
                <div>
                  <p className="text-slate-900 font-medium">Enter Your Information</p>
                  <p className="text-sm text-slate-600">Provide basic details about you and your partner</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                  2
                </div>
                <div>
                  <p className="text-slate-900 font-medium">Answer Questions Honestly</p>
                  <p className="text-sm text-slate-600">Complete 30 questions about your relationship (~15 minutes)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                  3
                </div>
                <div>
                  <p className="text-slate-900 font-medium">Get Detailed Insights</p>
                  <p className="text-sm text-slate-600">Receive your compatibility score and personalized recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Notes */}
        <Card className="bg-pink-50 border-pink-200">
          <div className="p-6 space-y-3">
            <h4 className="text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-pink-600" />
              Privacy & Confidentiality
            </h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <span className="text-pink-600">•</span>
                <span>Your responses are completely private and encrypted</span>
              </li>
              <li className="flex gap-2">
                <span className="text-pink-600">•</span>
                <span>Results are for your personal insight and growth</span>
              </li>
              <li className="flex gap-2">
                <span className="text-pink-600">•</span>
                <span>No relationship is perfect - use this as a tool for improvement</span>
              </li>
              <li className="flex gap-2">
                <span className="text-pink-600">•</span>
                <span>Consider sharing and discussing results with your partner</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* CTA */}
        <div className="flex gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={onStart}
            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
          >
            Begin Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
