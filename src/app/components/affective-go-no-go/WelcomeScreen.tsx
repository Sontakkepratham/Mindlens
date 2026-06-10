import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, Brain, Heart, Smile } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export function WelcomeScreen({ onStart, onBack }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-slate-200">
        <div className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-primary">MindLens Lab</h1>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto space-y-6">
        {/* Hero Illustration */}
        <div className="relative h-48 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-3xl blur-2xl" />
          <div className="relative flex items-center justify-center gap-6">
            {/* Abstract emotional faces */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-lg">
              <Smile className="w-8 h-8 text-green-600" />
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-xl">
              <Brain className="w-10 h-10 text-blue-600" />
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-3">
          <h2 className="text-slate-900">Affective Go/No-Go Test</h2>
          <p className="text-slate-600 leading-relaxed">
            Measure your emotional response and attention patterns through a brief cognitive task.
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm">⏱</span>
              </div>
              <div>
                <h3 className="text-slate-900 text-sm mb-1">Duration</h3>
                <p className="text-slate-600 text-sm">Approximately 3-5 minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm">🎯</span>
              </div>
              <div>
                <h3 className="text-slate-900 text-sm mb-1">What It Measures</h3>
                <p className="text-slate-600 text-sm">
                  Emotional attentional bias, impulse control, and response patterns
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h3 className="text-slate-900 text-sm mb-1">Scientifically Validated</h3>
                <p className="text-slate-600 text-sm">
                  Based on established psychological research methods
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* How It Works Link */}
        <button
          className="w-full text-center text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4 transition-colors"
          onClick={() => {
            // Could open a modal with detailed explanation
            alert('This test shows you emotional faces on cards. When you see your target emotion, TAP THE CARD or the button at the bottom. Do NOT tap for other emotions. Your reaction time and accuracy help assess emotional attention patterns.');
          }}
        >
          How it works
        </button>

        {/* Start Button */}
        <Button
          onClick={onStart}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
        >
          Start Test
        </Button>

        {/* Privacy Note */}
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Your responses are confidential and encrypted. This test is for self-assessment purposes only and does not constitute medical diagnosis.
        </p>
      </div>
    </div>
  );
}