import { useState, useEffect, useRef } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { InstructionsScreen } from './InstructionsScreen';
import { TargetSelectionScreen } from './TargetSelectionScreen';
import { GameplayScreen } from './GameplayScreen';
import { ResultsScreen } from './ResultsScreen';
import { InsightsScreen } from './InsightsScreen';

export type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral' | 'fearful';

export interface Trial {
  id: number;
  emotion: EmotionType;
  isTarget: boolean;
  imageUrl?: string;
  label: string;
}

export interface TrialResult {
  trialId: number;
  emotion: EmotionType;
  isTarget: boolean;
  userTapped: boolean;
  reactionTime?: number; // milliseconds
  isCorrect: boolean;
  timestamp: number;
}

export interface TestResults {
  trials: TrialResult[];
  totalTrials: number;
  goTrials: number;
  noGoTrials: number;
  goAccuracy: number; // percentage
  noGoAccuracy: number; // percentage
  falseAlarms: number;
  missedGo: number;
  avgReactionTime: number;
  fastestReaction: number;
  slowestReaction: number;
  positiveReactionAvg: number;
  negativeReactionAvg: number;
  emotionalBiasScore: number;
  completedAt: string;
}

type Screen = 
  | 'welcome'
  | 'instructions'
  | 'target-selection'
  | 'gameplay'
  | 'results'
  | 'insights';

interface AffectiveGoNoGoProps {
  onBack: () => void;
  onComplete?: (results: TestResults) => void;
}

export function AffectiveGoNoGo({ onBack, onComplete }: AffectiveGoNoGoProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [targetEmotion, setTargetEmotion] = useState<EmotionType>('happy');
  const [results, setResults] = useState<TestResults | null>(null);

  const handleStart = () => {
    setCurrentScreen('instructions');
  };

  const handleInstructionsComplete = () => {
    setCurrentScreen('target-selection');
  };

  const handleTargetSelected = (emotion: EmotionType) => {
    setTargetEmotion(emotion);
    setCurrentScreen('gameplay');
  };

  const handleGameComplete = (gameResults: TestResults) => {
    setResults(gameResults);
    setCurrentScreen('results');
    
    // Save results to backend
    saveResults(gameResults);
    
    if (onComplete) {
      onComplete(gameResults);
    }
  };

  const handleViewInsights = () => {
    setCurrentScreen('insights');
  };

  const handleRetry = () => {
    setResults(null);
    setCurrentScreen('target-selection');
  };

  const saveResults = async (results: TestResults) => {
    try {
      // Save to KV store for historical tracking
      const userId = localStorage.getItem('mindlens_user_id');
      if (!userId) return;

      // Implementation will be added later
      console.log('Saving Affective Go/No-Go results:', results);
    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'welcome' && (
        <WelcomeScreen 
          onStart={handleStart}
          onBack={onBack}
        />
      )}

      {currentScreen === 'instructions' && (
        <InstructionsScreen
          onBegin={handleInstructionsComplete}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'target-selection' && (
        <TargetSelectionScreen
          onTargetSelected={handleTargetSelected}
          onBack={() => setCurrentScreen('instructions')}
        />
      )}

      {currentScreen === 'gameplay' && (
        <GameplayScreen
          targetEmotion={targetEmotion}
          onComplete={handleGameComplete}
          onExit={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'results' && results && (
        <ResultsScreen
          results={results}
          onViewInsights={handleViewInsights}
          onRetry={handleRetry}
          onBack={onBack}
        />
      )}

      {currentScreen === 'insights' && results && (
        <InsightsScreen
          results={results}
          onBack={() => setCurrentScreen('results')}
          onReturnHome={onBack}
        />
      )}
    </div>
  );
}
