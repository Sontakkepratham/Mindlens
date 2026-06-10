import React from 'react';

interface Trial {
  word: string;
  color: string;
  isEmotional: boolean;
}

interface TrialResult {
  word: string;
  color: string;
  selectedColor: string;
  isCorrect: boolean;
  reactionTime: number;
  isEmotional: boolean;
}

interface StroopGameProps {
  difficulty: 'easy' | 'standard' | 'advanced';
  onComplete: (results: TrialResult[]) => void;
}

const COLORS = {
  red: '#EF4444',
  blue: '#3B82F6',
  yellow: '#EAB308',
  green: '#10B981'
};

const NEUTRAL_WORDS = ['TABLE', 'CHAIR', 'PAPER', 'DESK', 'BOOK', 'PEN', 'CLOCK', 'LAMP'];
const EMOTIONAL_WORDS = ['ANGER', 'FEAR', 'WORRY', 'STRESS', 'PANIC', 'DREAD', 'SHAME', 'GUILT'];

export function StroopGame({ difficulty, onComplete }: StroopGameProps) {
  const [trials, setTrials] = React.useState<Trial[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = React.useState(0);
  const [results, setResults] = React.useState<TrialResult[]>([]);
  const [trialStartTime, setTrialStartTime] = React.useState<number>(Date.now());

  // Generate trials on mount
  React.useEffect(() => {
    const trialCount = difficulty === 'easy' ? 20 : difficulty === 'standard' ? 40 : 60;
    const emotionalRatio = difficulty === 'easy' ? 0 : difficulty === 'standard' ? 0.5 : 0.7;
    
    const generatedTrials: Trial[] = [];
    const colorKeys = Object.keys(COLORS);
    
    for (let i = 0; i < trialCount; i++) {
      const isEmotional = Math.random() < emotionalRatio;
      const wordList = isEmotional ? EMOTIONAL_WORDS : NEUTRAL_WORDS;
      const word = wordList[Math.floor(Math.random() * wordList.length)];
      const color = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      
      generatedTrials.push({ word, color, isEmotional });
    }
    
    setTrials(generatedTrials);
    setTrialStartTime(Date.now());
  }, [difficulty]);

  const handleColorSelect = (selectedColor: string) => {
    const reactionTime = Date.now() - trialStartTime;
    const currentTrial = trials[currentTrialIndex];
    
    const result: TrialResult = {
      word: currentTrial.word,
      color: currentTrial.color,
      selectedColor,
      isCorrect: selectedColor === currentTrial.color,
      reactionTime,
      isEmotional: currentTrial.isEmotional
    };
    
    const newResults = [...results, result];
    setResults(newResults);
    
    if (currentTrialIndex + 1 >= trials.length) {
      onComplete(newResults);
    } else {
      setCurrentTrialIndex(currentTrialIndex + 1);
      setTrialStartTime(Date.now());
    }
  };

  if (trials.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  const currentTrial = trials[currentTrialIndex];
  const progress = ((currentTrialIndex + 1) / trials.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="h-2 bg-slate-100">
          <div
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Trial Counter */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <p className="text-center text-slate-600">
          Trial {currentTrialIndex + 1} of {trials.length}
        </p>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Word Display */}
        <div className="mb-16">
          <div
            className="text-7xl tracking-wide"
            style={{ color: COLORS[currentTrial.color as keyof typeof COLORS] }}
          >
            {currentTrial.word}
          </div>
        </div>

        {/* Color Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {Object.entries(COLORS).map(([colorName, colorValue]) => (
            <button
              key={colorName}
              onClick={() => handleColorSelect(colorName)}
              className="h-28 rounded-2xl border-4 border-slate-200 hover:border-slate-300 transition-all shadow-sm active:scale-95"
              style={{ backgroundColor: colorValue }}
              aria-label={`Select ${colorName}`}
            />
          ))}
        </div>

        {/* Color Labels */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-3">
          {Object.keys(COLORS).map((colorName) => (
            <div key={colorName} className="text-center text-slate-600 capitalize">
              {colorName}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Instruction */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <p className="text-center text-slate-600 text-sm">
          Tap the color of the word (not what it says)
        </p>
      </div>
    </div>
  );
}
