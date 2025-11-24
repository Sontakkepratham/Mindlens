import { ArrowLeft, Heart, User, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface MindLensDiscoveryProps {
  onBack: () => void;
  onStartPersonalityTest: () => void;
  onStartCoupleTest: () => void;
  completedTests?: string[];
}

export function MindLensDiscovery({
  onBack,
  onStartPersonalityTest,
  onStartCoupleTest,
  completedTests = []
}: MindLensDiscoveryProps) {
  const hasCompletedPersonality = completedTests.includes('personality');
  const hasCompletedCouple = completedTests.includes('couple');

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/30 via-white to-primary/10">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-slate-900">MindLens Discovery</h1>
            <p className="text-sm text-slate-600">Explore yourself and your relationships</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-slate-900">Discover Your Inner World</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Unlock deep insights about yourself and your relationships through scientifically-validated assessments.
          </p>
        </div>

        {/* Test Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Personality Test Card */}
          <Card className="hover:shadow-xl transition-shadow border-2 border-slate-200 hover:border-primary/50">
            <div className="p-8 space-y-6">
              {/* Icon & Badge */}
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                {hasCompletedPersonality && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Completed ✓
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-slate-900">Know Your Personality</h3>
                <p className="text-slate-600 text-sm">
                  Discover your unique personality profile using the Big Five model. Understand your strengths, 
                  preferences, and how you interact with the world.
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>50 scientifically validated questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>5 personality trait analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Career & relationship insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>~10 minutes to complete</span>
                </li>
              </ul>

              {/* CTA Button */}
              <Button
                onClick={onStartPersonalityTest}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {hasCompletedPersonality ? 'Retake Test' : 'Start Test'}
              </Button>
            </div>
          </Card>

          {/* Couple Compatibility Card */}
          <Card className="hover:shadow-xl transition-shadow border-2 border-slate-200 hover:border-primary/50">
            <div className="p-8 space-y-6">
              {/* Icon & Badge */}
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                {hasCompletedCouple && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Completed ✓
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="text-slate-900">Know Your Partner</h3>
                <p className="text-slate-600 text-sm">
                  Assess your relationship compatibility and discover areas of strength and growth. 
                  Perfect for couples wanting to deepen their connection.
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  <span>Comprehensive compatibility analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  <span>Communication & conflict styles</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  <span>Love languages & values alignment</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  <span>~15 minutes to complete</span>
                </li>
              </ul>

              {/* CTA Button */}
              <Button
                onClick={onStartCoupleTest}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                {hasCompletedCouple ? 'Retake Test' : 'Start Test'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="bg-primary/5 border-primary/20">
          <div className="p-6 text-center space-y-2">
            <p className="text-slate-700">
              <span className="font-medium">💡 Pro Tip:</span> Complete both tests for a holistic understanding 
              of yourself and your relationships.
            </p>
            <p className="text-sm text-slate-600">
              All results are private, encrypted, and stored securely.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
