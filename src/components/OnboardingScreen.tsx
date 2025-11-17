import { Button } from './ui/button';
import { Card } from './ui/card';
import { Brain, FileText, Camera, Sparkles } from 'lucide-react';

interface OnboardingScreenProps {
  onStart: () => void;
  onStartPersonalityTest?: () => void;
}

export function OnboardingScreen({ onStart, onStartPersonalityTest }: OnboardingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="mb-8">
        <div className="mb-3">
          <h1 className="text-cyan-600 mb-2">MindLens</h1>
        </div>
        <p className="text-slate-600 max-w-xs mx-auto">
          AI-powered mental health screening combining questionnaires and facial emotion analysis.
        </p>
      </div>

      <div className="w-full max-w-xs mb-8 space-y-3">
        <Card className="bg-white border-slate-200 p-4">
          <div className="flex items-start gap-3 text-left">
            <FileText className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-slate-900 text-sm mb-1">PHQ-9 Questionnaire</h3>
              <p className="text-xs text-slate-600">Clinical depression screening</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-4">
          <div className="flex items-start gap-3 text-left">
            <Camera className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-slate-900 text-sm mb-1">Facial Emotion Analysis</h3>
              <p className="text-xs text-slate-600">AI-powered expression detection</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-4">
          <div className="flex items-start gap-3 text-left">
            <Brain className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-slate-900 text-sm mb-1">ML-Powered Insights</h3>
              <p className="text-xs text-slate-600">Comprehensive risk assessment</p>
            </div>
          </div>
        </Card>

        {onStartPersonalityTest && (
          <Card className="bg-white border-slate-200 p-4">
            <div className="flex items-start gap-3 text-left">
              <Sparkles className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-slate-900 text-sm mb-1">Personality Test</h3>
                <p className="text-xs text-slate-600">Discover your personality traits</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Button 
        onClick={onStart}
        className="w-full max-w-xs bg-cyan-600 hover:bg-cyan-700 text-white mb-4"
      >
        Start Assessment
      </Button>

      {onStartPersonalityTest && (
        <div className="w-full max-w-xs">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-50 text-slate-500">OR</span>
            </div>
          </div>
          
          <button
            onClick={onStartPersonalityTest}
            className="w-full mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-600 group-hover:animate-pulse" />
              <span className="text-slate-900">Want to know your personality?</span>
            </div>
            <p className="text-sm text-purple-700">Take a free test</p>
          </button>
        </div>
      )}
    </div>
  );
}