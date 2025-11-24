import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface InstructionsScreenProps {
  onBegin: () => void;
  onBack: () => void;
}

export function InstructionsScreen({ onBegin, onBack }: InstructionsScreenProps) {
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
          <h1 className="text-slate-900">Instructions</h1>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-slate-900">How to Play</h2>
          <p className="text-slate-600">Follow these simple steps</p>
        </div>

        {/* Main Rules */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="p-5 space-y-5">
            {/* Rule 1: TAP for target */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-slate-900">TAP for Target Emotion</h3>
              </div>
              <p className="text-slate-600 text-sm pl-13">
                When you see the target emotion, tap the emotion card or the button as quickly as possible.
              </p>
              
              {/* Visual Example - GO */}
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center shadow-sm">
                    <span className="text-3xl">😊</span>
                  </div>
                  <p className="text-green-700 font-medium text-sm">Target: Happy</p>
                  <div className="flex items-center justify-center gap-2 text-green-600 text-xs">
                    <span>→</span>
                    <span className="font-medium">TAP THE CARD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            {/* Rule 2: DO NOT TAP */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-slate-900">Do NOT Tap Other Emotions</h3>
              </div>
              <p className="text-slate-600 text-sm pl-13">
                When you see any other emotion, resist tapping. Stay still and focused.
              </p>
              
              {/* Visual Example - NO-GO */}
              <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="text-2xl">😢</span>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="text-2xl">😠</span>
                    </div>
                  </div>
                  <p className="text-red-700 font-medium text-sm">Not the target</p>
                  <div className="flex items-center justify-center gap-2 text-red-600 text-xs">
                    <span>→</span>
                    <span className="font-medium">DO NOT TAP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 3-Step Process */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="p-5 space-y-4">
            <h3 className="text-slate-900 text-center">Test Flow</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">1</span>
                </div>
                <p className="text-slate-600 text-sm">An emotion will appear on screen</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">2</span>
                </div>
                <p className="text-slate-600 text-sm">Decide if it matches your target</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">3</span>
                </div>
                <p className="text-slate-600 text-sm">Tap (GO) or don't tap (NO-GO)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Tips */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="text-blue-900 font-medium text-sm mb-2">💡 Tips for Best Results</h4>
          <ul className="space-y-1 text-blue-800 text-sm">
            <li>• Focus on reacting quickly but accurately</li>
            <li>• Find a quiet environment</li>
            <li>• Complete all trials without interruption</li>
          </ul>
        </div>

        {/* Begin Button */}
        <Button
          onClick={onBegin}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
        >
          Begin Test
        </Button>
      </div>
    </div>
  );
}