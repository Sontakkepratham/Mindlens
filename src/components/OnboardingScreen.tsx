import { Button } from './ui/button';
import { Card } from './ui/card';
import { Brain, FileText, Camera } from 'lucide-react';

interface OnboardingScreenProps {
  onStart: () => void;
}

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
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
      </div>

      <Button 
        onClick={onStart}
        className="w-full max-w-xs bg-cyan-600 hover:bg-cyan-700 text-white"
      >
        Start Assessment
      </Button>
    </div>
  );
}