import { useState, useEffect } from 'react';
import { EPISODES, EmotionType, SceneBranch } from './EpisodeData';
import { EpisodeHub } from './EpisodeHub';
import { EpisodePlayer } from './EpisodePlayer';
import { GameResults } from './EmotionJourneyQuest';

interface EmotionJourneyQuestProps {
  onBack: () => void;
  onComplete: (results: GameResults) => void;
}

interface PlayerProgress {
  completedEpisodes: number[];
  emotionalJourney: Array<{
    episodeId: number;
    emotion: EmotionType;
    branchId: string;
    timestamp: string;
  }>;
  badges: string[];
  characterEvolution: number; // 0-100 scale
}

type GameScreen = 'hub' | 'playing';

export function EmotionJourneyQuestNew({ onBack, onComplete }: EmotionJourneyQuestProps) {
  const [screen, setScreen] = useState<GameScreen>('hub');
  const [currentEpisodeId, setCurrentEpisodeId] = useState<number | null>(null);
  const [progress, setProgress] = useState<PlayerProgress>({
    completedEpisodes: [],
    emotionalJourney: [],
    badges: [],
    characterEvolution: 0,
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindlens-emotion-journey-progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('mindlens-emotion-journey-progress', JSON.stringify(progress));
  }, [progress]);

  const handleSelectEpisode = (episodeId: number) => {
    setCurrentEpisodeId(episodeId);
    setScreen('playing');
  };

  const handleEpisodeComplete = (emotion: EmotionType, branch: SceneBranch) => {
    if (!currentEpisodeId) return;

    // Update progress
    const newProgress = { ...progress };

    // Mark episode as completed (if not already)
    if (!newProgress.completedEpisodes.includes(currentEpisodeId)) {
      newProgress.completedEpisodes.push(currentEpisodeId);
    }

    // Add to emotional journey
    newProgress.emotionalJourney.push({
      episodeId: currentEpisodeId,
      emotion,
      branchId: branch.id,
      timestamp: new Date().toISOString(),
    });

    // Add badge if earned
    if (branch.rewardBadge && !newProgress.badges.includes(branch.rewardBadge)) {
      newProgress.badges.push(branch.rewardBadge);
    }

    // Increase character evolution
    newProgress.characterEvolution = Math.min(100, newProgress.characterEvolution + 10);

    setProgress(newProgress);
    
    // Return to hub
    setScreen('hub');
    setCurrentEpisodeId(null);
  };

  const handleBackFromPlayer = () => {
    setScreen('hub');
    setCurrentEpisodeId(null);
  };

  const getCharacterMood = (): 'supportive' | 'energetic' | 'calm' | 'serious' | 'gentle' => {
    // Determine character mood based on recent emotional journey
    const recentEmotions = progress.emotionalJourney.slice(-3);
    
    if (recentEmotions.length === 0) return 'supportive';

    const emotionCounts: Record<string, number> = {};
    recentEmotions.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
    });

    const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    switch (dominant) {
      case 'sad':
      case 'overwhelmed':
        return 'gentle';
      case 'angry':
        return 'calm';
      case 'anxious':
        return 'supportive';
      case 'happy':
        return 'energetic';
      default:
        return 'supportive';
    }
  };

  const currentEpisode = EPISODES.find(ep => ep.id === currentEpisodeId);

  return (
    <>
      {screen === 'hub' && (
        <EpisodeHub
          episodes={EPISODES}
          completedEpisodes={progress.completedEpisodes}
          onSelectEpisode={handleSelectEpisode}
          onBack={() => {
            // Calculate final results before exiting
            const results: GameResults = {
              totalScore: progress.characterEvolution,
              emotionalAccuracy: calculateEmotionalAccuracy(progress),
              empathyScore: calculateEmpathyScore(progress),
              conflictResolutionStyle: determineConflictStyle(progress),
              empathyConsistency: 85,
              reactionBias: 'Balanced',
              levels: [],
              badges: progress.badges,
              completedAt: new Date().toISOString(),
            };
            onComplete(results);
          }}
        />
      )}

      {screen === 'playing' && currentEpisode && (
        <EpisodePlayer
          episode={currentEpisode}
          characterMood={getCharacterMood()}
          onComplete={handleEpisodeComplete}
          onBack={handleBackFromPlayer}
        />
      )}
    </>
  );
}

// Helper functions
function calculateEmotionalAccuracy(progress: PlayerProgress): number {
  // Based on variety of emotions explored
  const uniqueEmotions = new Set(progress.emotionalJourney.map(e => e.emotion));
  return Math.min(100, (uniqueEmotions.size / 7) * 100);
}

function calculateEmpathyScore(progress: PlayerProgress): number {
  // Based on number of episodes completed and badges earned
  return Math.min(100, (progress.completedEpisodes.length * 10) + (progress.badges.length * 5));
}

function determineConflictStyle(progress: PlayerProgress): string {
  const recentEmotions = progress.emotionalJourney.slice(-5);
  
  const angryCount = recentEmotions.filter(e => e.emotion === 'angry').length;
  const sadCount = recentEmotions.filter(e => e.emotion === 'sad').length;
  const anxiousCount = recentEmotions.filter(e => e.emotion === 'anxious').length;
  
  if (angryCount >= 3) return 'Direct & Assertive';
  if (sadCount >= 3) return 'Reflective & Thoughtful';
  if (anxiousCount >= 3) return 'Cautious & Considerate';
  return 'Balanced & Adaptive';
}
