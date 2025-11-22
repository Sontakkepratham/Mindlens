import React from 'react';
import { StroopWelcome } from './StroopWelcome';
import { StroopInstructions } from './StroopInstructions';
import { StroopCalibration } from './StroopCalibration';
import { StroopGame } from './StroopGame';
import { StroopResults } from './StroopResults';
import { StroopInsights } from './StroopInsights';

interface TrialResult {
  word: string;
  color: string;
  selectedColor: string;
  isCorrect: boolean;
  reactionTime: number;
  isEmotional: boolean;
}

type StroopScreen = 'welcome' | 'instructions' | 'calibration' | 'game' | 'results' | 'insights';

interface StroopTestProps {
  onBack?: () => void;
}

export function StroopTest({ onBack }: StroopTestProps) {
  const [currentScreen, setCurrentScreen] = React.useState<StroopScreen>('welcome');
  const [difficulty, setDifficulty] = React.useState<'easy' | 'standard' | 'advanced'>('standard');
  const [results, setResults] = React.useState<TrialResult[]>([]);

  const handleStart = (selectedDifficulty: 'easy' | 'standard' | 'advanced') => {
    setDifficulty(selectedDifficulty);
    setCurrentScreen('instructions');
  };

  const handleBegin = () => {
    setCurrentScreen('calibration');
  };

  const handleCalibrationComplete = () => {
    setCurrentScreen('game');
  };

  const handleGameComplete = (gameResults: TrialResult[]) => {
    setResults(gameResults);
    setCurrentScreen('results');
  };

  const handleSaveResult = async () => {
    // Calculate key metrics
    const correctTrials = results.filter(r => r.isCorrect).length;
    const totalTrials = results.length;
    const avgReactionTime = results.reduce((sum, r) => sum + r.reactionTime, 0) / totalTrials;
    const errorRate = ((totalTrials - correctTrials) / totalTrials * 100);
    
    const emotionalTrials = results.filter(r => r.isEmotional && r.isCorrect);
    const avgEmotionalRT = emotionalTrials.length > 0
      ? emotionalTrials.reduce((sum, r) => sum + r.reactionTime, 0) / emotionalTrials.length
      : 0;
    
    const neutralTrials = results.filter(r => !r.isEmotional && r.isCorrect);
    const avgNeutralRT = neutralTrials.length > 0
      ? neutralTrials.reduce((sum, r) => sum + r.reactionTime, 0) / neutralTrials.length
      : 0;
    
    const negativeBias = avgEmotionalRT - avgNeutralRT;

    try {
      // Get the project info for API calls
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      // Save to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/stroop/save`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            difficulty,
            totalTrials,
            correctTrials,
            errorRate,
            avgReactionTime,
            avgEmotionalRT,
            avgNeutralRT,
            negativeBias,
            completedAt: new Date().toISOString(),
            detailedResults: results
          })
        }
      );

      if (response.ok) {
        console.log('Stroop test results saved successfully');
        alert('Results saved successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to save results:', errorText);
        alert('Failed to save results. Please try again.');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results. Please try again.');
    }
  };

  const handleViewInsights = () => {
    setCurrentScreen('insights');
  };

  const handleContinue = () => {
    if (onBack) {
      onBack();
    } else {
      // Reset to welcome screen
      setCurrentScreen('welcome');
      setResults([]);
    }
  };

  return (
    <>
      {currentScreen === 'welcome' && <StroopWelcome onStart={handleStart} />}
      {currentScreen === 'instructions' && <StroopInstructions onBegin={handleBegin} />}
      {currentScreen === 'calibration' && <StroopCalibration onComplete={handleCalibrationComplete} />}
      {currentScreen === 'game' && <StroopGame difficulty={difficulty} onComplete={handleGameComplete} />}
      {currentScreen === 'results' && (
        <StroopResults
          results={results}
          onSaveResult={handleSaveResult}
          onViewInsights={handleViewInsights}
        />
      )}
      {currentScreen === 'insights' && <StroopInsights results={results} onContinue={handleContinue} />}
    </>
  );
}