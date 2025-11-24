import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { X } from 'lucide-react';
import { EmotionType, Trial, TrialResult, TestResults } from './AffectiveGoNoGo';

interface GameplayScreenProps {
  targetEmotion: EmotionType;
  onComplete: (results: TestResults) => void;
  onExit: () => void;
}

const TOTAL_TRIALS = 40;
const TRIAL_DURATION = 1500; // ms - how long each emotion is shown
const INTER_TRIAL_DELAY = 500; // ms - delay between trials

// Emotion data with emojis
const emotionData: Record<EmotionType, { emoji: string; label: string }> = {
  happy: { emoji: '😊', label: 'Happy' },
  sad: { emoji: '😢', label: 'Sad' },
  angry: { emoji: '😠', label: 'Angry' },
  neutral: { emoji: '😐', label: 'Neutral' },
  fearful: { emoji: '😨', label: 'Fearful' }
};

export function GameplayScreen({ targetEmotion, onComplete, onExit }: GameplayScreenProps) {
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [results, setResults] = useState<TrialResult[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [userTapped, setUserTapped] = useState(false);
  
  const trialStartTime = useRef<number>(0);
  const trialTimeout = useRef<NodeJS.Timeout | null>(null);

  // Generate trials on mount
  useEffect(() => {
    const generatedTrials = generateTrials(targetEmotion, TOTAL_TRIALS);
    setTrials(generatedTrials);
  }, [targetEmotion]);

  // Start trial when trials are loaded
  useEffect(() => {
    if (trials.length > 0 && currentTrialIndex < trials.length) {
      startTrial();
    }
  }, [trials, currentTrialIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (trialTimeout.current) {
        clearTimeout(trialTimeout.current);
      }
    };
  }, []);

  const startTrial = () => {
    setUserTapped(false);
    setFeedback(null);
    setShowTransition(false);
    trialStartTime.current = Date.now();

    // Auto-advance after trial duration
    trialTimeout.current = setTimeout(() => {
      handleTrialEnd(false);
    }, TRIAL_DURATION);
  };

  const handleTap = () => {
    if (userTapped || showTransition) return; // Prevent double taps
    
    const reactionTime = Date.now() - trialStartTime.current;
    setUserTapped(true);
    
    if (trialTimeout.current) {
      clearTimeout(trialTimeout.current);
    }

    handleTrialEnd(true, reactionTime);
  };

  const handleTrialEnd = (tapped: boolean, reactionTime?: number) => {
    const currentTrial = trials[currentTrialIndex];
    const isCorrect = currentTrial.isTarget === tapped;

    // Show feedback
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    // Record result
    const result: TrialResult = {
      trialId: currentTrial.id,
      emotion: currentTrial.emotion,
      isTarget: currentTrial.isTarget,
      userTapped: tapped,
      reactionTime: reactionTime,
      isCorrect,
      timestamp: Date.now()
    };

    setResults(prev => [...prev, result]);

    // Show transition and move to next trial
    setTimeout(() => {
      setShowTransition(true);
      
      setTimeout(() => {
        if (currentTrialIndex + 1 >= trials.length) {
          // Test complete
          completeTest([...results, result]);
        } else {
          setCurrentTrialIndex(prev => prev + 1);
        }
      }, INTER_TRIAL_DELAY);
    }, 300); // Brief feedback display
  };

  const completeTest = (finalResults: TrialResult[]) => {
    const testResults = calculateResults(finalResults);
    onComplete(testResults);
  };

  const handleExitConfirm = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      onExit();
    }
  };

  if (trials.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Preparing test...</p>
        </div>
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-400 text-sm">Next...</div>
      </div>
    );
  }

  const currentTrial = trials[currentTrialIndex];
  
  // Safety check: if currentTrial is undefined, show loading
  if (!currentTrial) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading trial...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentTrialIndex + 1) / TOTAL_TRIALS) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Progress */}
      <div className="sticky top-0 bg-white z-10 border-b border-slate-200">
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Header Content */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Trial <span className="font-semibold text-slate-900">{currentTrialIndex + 1}</span> / {TOTAL_TRIALS}
          </div>
          <button
            onClick={handleExitConfirm}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Emotion Card */}
        <div className="w-full max-w-sm space-y-6">
          {/* Target Reminder (subtle) */}
          <div className="text-center text-sm text-slate-500">
            Target: <span className="font-medium text-slate-700">{emotionData[targetEmotion].label}</span> {emotionData[targetEmotion].emoji}
          </div>

          {/* Emotion Display - NOW TAPPABLE */}
          <button
            onClick={handleTap}
            disabled={userTapped || showTransition}
            className="w-full transition-all duration-200 active:scale-95 disabled:active:scale-100"
          >
            <Card 
              className={`border-4 transition-all duration-200 ${
                feedback === 'correct' 
                  ? 'border-green-400 bg-green-50 shadow-lg shadow-green-200' 
                  : feedback === 'incorrect'
                  ? 'border-red-400 bg-red-50 shadow-lg shadow-red-200'
                  : 'border-slate-200 bg-white shadow-xl hover:shadow-2xl hover:border-primary/50'
              } ${userTapped ? 'opacity-50' : ''}`}
            >
              <div className="p-12 text-center">
                <div className="text-8xl mb-4 animate-in fade-in zoom-in duration-200">
                  {emotionData[currentTrial.emotion].emoji}
                </div>
                <p className="text-slate-600 text-sm">
                  {emotionData[currentTrial.emotion].label}
                </p>
              </div>
            </Card>
          </button>

          {/* Instruction Reminder */}
          <div className="text-center">
            <p className="text-sm text-primary font-medium">
              {currentTrial.isTarget 
                ? '👆 TAP the card if this is your target' 
                : '🚫 Do NOT tap for other emotions'}
            </p>
          </div>
        </div>
      </div>

      {/* Tap Button - Alternative way to tap */}
      <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-8 px-6">
        <Button
          onClick={handleTap}
          disabled={userTapped || showTransition}
          className="w-full h-16 text-lg bg-primary hover:bg-primary/90 active:scale-95 text-white shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
        >
          {userTapped ? 'Tapped ✓' : 'TAP'}
        </Button>
        
        <p className="text-center text-xs text-slate-400 mt-3">
          Tap the card or button for GO trials
        </p>
      </div>
    </div>
  );
}

// Helper: Generate balanced trial sequence
function generateTrials(targetEmotion: EmotionType, totalTrials: number): Trial[] {
  const trials: Trial[] = [];
  const allEmotions: EmotionType[] = ['happy', 'sad', 'angry', 'neutral', 'fearful'];
  const nonTargetEmotions = allEmotions.filter(e => e !== targetEmotion);
  
  // 40% GO trials, 60% NO-GO trials (typical for Go/No-Go)
  const goTrials = Math.floor(totalTrials * 0.4);
  const noGoTrials = totalTrials - goTrials;

  // Create GO trials
  for (let i = 0; i < goTrials; i++) {
    trials.push({
      id: i,
      emotion: targetEmotion,
      isTarget: true,
      label: emotionData[targetEmotion].label
    });
  }

  // Create NO-GO trials
  for (let i = 0; i < noGoTrials; i++) {
    const randomEmotion = nonTargetEmotions[Math.floor(Math.random() * nonTargetEmotions.length)];
    trials.push({
      id: goTrials + i,
      emotion: randomEmotion,
      isTarget: false,
      label: emotionData[randomEmotion].label
    });
  }

  // Shuffle trials
  return shuffleArray(trials);
}

// Helper: Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper: Calculate test results
function calculateResults(results: TrialResult[]): TestResults {
  const goTrials = results.filter(r => r.isTarget);
  const noGoTrials = results.filter(r => !r.isTarget);
  
  const correctGo = goTrials.filter(r => r.isCorrect).length;
  const correctNoGo = noGoTrials.filter(r => r.isCorrect).length;
  const falseAlarms = noGoTrials.filter(r => r.userTapped).length;
  const missedGo = goTrials.filter(r => !r.userTapped).length;

  const reactionTimes = results
    .filter(r => r.userTapped && r.reactionTime)
    .map(r => r.reactionTime!);

  const avgReactionTime = reactionTimes.length > 0
    ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
    : 0;

  const fastestReaction = reactionTimes.length > 0
    ? Math.min(...reactionTimes)
    : 0;

  const slowestReaction = reactionTimes.length > 0
    ? Math.max(...reactionTimes)
    : 0;

  // Positive emotions: happy
  // Negative emotions: sad, angry, fearful
  const positiveTrials = results.filter(r => r.emotion === 'happy' && r.userTapped && r.reactionTime);
  const negativeTrials = results.filter(r => ['sad', 'angry', 'fearful'].includes(r.emotion) && r.userTapped && r.reactionTime);

  const positiveReactionAvg = positiveTrials.length > 0
    ? positiveTrials.reduce((sum, r) => sum + r.reactionTime!, 0) / positiveTrials.length
    : 0;

  const negativeReactionAvg = negativeTrials.length > 0
    ? negativeTrials.reduce((sum, r) => sum + r.reactionTime!, 0) / negativeTrials.length
    : 0;

  // Emotional bias score: negative if faster to positive, positive if faster to negative
  const emotionalBiasScore = positiveReactionAvg && negativeReactionAvg
    ? ((positiveReactionAvg - negativeReactionAvg) / positiveReactionAvg) * 100
    : 0;

  return {
    trials: results,
    totalTrials: results.length,
    goTrials: goTrials.length,
    noGoTrials: noGoTrials.length,
    goAccuracy: (correctGo / goTrials.length) * 100,
    noGoAccuracy: (correctNoGo / noGoTrials.length) * 100,
    falseAlarms,
    missedGo,
    avgReactionTime,
    fastestReaction,
    slowestReaction,
    positiveReactionAvg,
    negativeReactionAvg,
    emotionalBiasScore,
    completedAt: new Date().toISOString()
  };
}