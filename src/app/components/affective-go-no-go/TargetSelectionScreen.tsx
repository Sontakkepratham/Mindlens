import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft } from 'lucide-react';
import { EmotionType } from './AffectiveGoNoGo';

interface TargetSelectionScreenProps {
  onTargetSelected: (emotion: EmotionType) => void;
  onBack: () => void;
}

interface EmotionOption {
  type: EmotionType;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

const emotionOptions: EmotionOption[] = [
  {
    type: 'happy',
    emoji: '😊',
    label: 'Happy',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200 hover:border-green-300',
    description: 'Positive, joyful expressions'
  },
  {
    type: 'sad',
    emoji: '😢',
    label: 'Sad',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200 hover:border-blue-300',
    description: 'Sorrowful, downcast expressions'
  },
  {
    type: 'angry',
    emoji: '😠',
    label: 'Angry',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200 hover:border-red-300',
    description: 'Frustrated, irritated expressions'
  }
];

export function TargetSelectionScreen({ onTargetSelected, onBack }: TargetSelectionScreenProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);

  const handleSelect = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };

  const handleBegin = () => {
    if (selectedEmotion) {
      onTargetSelected(selectedEmotion);
    }
  };

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
          <h1 className="text-slate-900">Select Target Emotion</h1>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto space-y-6">
        {/* Instructions */}
        <div className="text-center space-y-2">
          <h2 className="text-slate-900">Choose Your Target</h2>
          <p className="text-slate-600">
            You'll tap when you see this emotion, and resist tapping for others
          </p>
        </div>

        {/* Emotion Options */}
        <div className="space-y-3">
          {emotionOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleSelect(option.type)}
              className={`w-full transition-all ${
                selectedEmotion === option.type
                  ? 'scale-[1.02]'
                  : 'scale-100'
              }`}
            >
              <Card 
                className={`border-2 ${option.bgColor} ${
                  selectedEmotion === option.type
                    ? 'ring-4 ring-primary/20 shadow-lg'
                    : 'shadow-sm'
                } transition-all`}
              >
                <div className="p-5 flex items-center gap-4">
                  {/* Emoji */}
                  <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm ${
                    selectedEmotion === option.type ? 'scale-110' : 'scale-100'
                  } transition-transform`}>
                    <span className="text-4xl">{option.emoji}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <h3 className={`${option.color} mb-1`}>{option.label}</h3>
                    <p className="text-slate-600 text-sm">{option.description}</p>
                  </div>

                  {/* Selection Indicator */}
                  {selectedEmotion === option.type && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </Card>
            </button>
          ))}
        </div>

        {/* Selected Target Preview */}
        {selectedEmotion && (
          <Card className="border-primary/30 bg-primary/5 shadow-sm">
            <div className="p-5 text-center space-y-2">
              <p className="text-slate-600 text-sm">Your target emotion:</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl">
                  {emotionOptions.find(e => e.type === selectedEmotion)?.emoji}
                </span>
                <div className="text-left">
                  <h3 className="text-primary text-xl">
                    {emotionOptions.find(e => e.type === selectedEmotion)?.label}
                  </h3>
                  <p className="text-slate-600 text-sm">Tap when you see this</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Begin Button */}
        <Button
          onClick={handleBegin}
          disabled={!selectedEmotion}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedEmotion ? 'Begin' : 'Select an emotion to continue'}
        </Button>

        {/* Info */}
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          The test will show 40 emotional faces. Stay focused and respond as quickly as you can.
        </p>
      </div>
    </div>
  );
}
