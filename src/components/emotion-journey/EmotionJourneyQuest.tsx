import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { DifficultySelectionScreen } from './DifficultySelectionScreen';
import { EpisodeStyleGame } from './EpisodeStyleGame';
import { FinalResultsScreen } from './FinalResultsScreen';

export type DifficultyMode = 'kids' | 'teen' | 'senior';
export type EmotionType = 'happy' | 'sad' | 'angry' | 'confused' | 'worried' | 'neutral';
export type ReactionType = 'talk' | 'avoid' | 'confront' | 'seek-help';

export interface StoryScene {
  id: string;
  title: string;
  background: string;
  characterImage: string;
  narration: string;
  emotionQuestion: string;
  reactionQuestion: string;
  correctEmotion: EmotionType;
  difficulty: DifficultyMode;
}

export interface EmotionChoice {
  emotion: EmotionType;
  timestamp: number;
  correct: boolean;
  responseTime: number;
}

export interface ReactionChoice {
  reaction: ReactionType;
  sceneId: string;
  timestamp: number;
}

export interface LevelData {
  sceneId: string;
  emotionChoice: EmotionChoice;
  reactionChoice: ReactionChoice;
  empathyScore: number;
}

export interface GameResults {
  totalScore: number;
  emotionalAccuracy: number;
  empathyScore: number;
  conflictResolutionStyle: string;
  empathyConsistency: number;
  reactionBias: string;
  levels: LevelData[];
  badges: string[];
  completedAt: string;
}

type GameScreen = 
  | 'welcome'
  | 'difficulty'
  | 'story'
  | 'emotion-choice'
  | 'reaction-choice'
  | 'outcome'
  | 'level-summary'
  | 'final-results';

interface EmotionJourneyQuestProps {
  onBack: () => void;
  onComplete: (results: GameResults) => void;
}

export function EmotionJourneyQuest({ onBack, onComplete }: EmotionJourneyQuestProps) {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('welcome');
  const [difficulty, setDifficulty] = useState<DifficultyMode | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(null);
  const [levelData, setLevelData] = useState<LevelData[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const handleStartJourney = () => {
    setCurrentScreen('difficulty');
  };

  const handleDifficultySelect = (mode: DifficultyMode) => {
    setDifficulty(mode);
    setCurrentScreen('story');
    // Load first scene based on difficulty
    loadScene(0, mode);
  };

  const loadScene = (index: number, mode: DifficultyMode) => {
    const scenes = getStoryScenesForDifficulty(mode);
    if (index < scenes.length) {
      setCurrentScene(scenes[index]);
      setCurrentSceneIndex(index);
      setStartTime(Date.now());
    }
  };

  const handleSceneContinue = () => {
    setCurrentScreen('emotion-choice');
  };

  const handleEmotionSelect = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
    const responseTime = Date.now() - startTime;
    const correct = emotion === currentScene?.correctEmotion;
    
    // Store emotion choice data
    const emotionChoice: EmotionChoice = {
      emotion,
      timestamp: Date.now(),
      correct,
      responseTime,
    };

    // Move to reaction choice
    setCurrentScreen('reaction-choice');
  };

  const handleReactionSelect = (reaction: ReactionType) => {
    setSelectedReaction(reaction);
    
    const reactionChoice: ReactionChoice = {
      reaction,
      sceneId: currentScene?.id || '',
      timestamp: Date.now(),
    };

    // Calculate empathy score for this level
    const empathyScore = calculateEmpathyScore(selectedEmotion!, reaction);

    // Store level data
    const level: LevelData = {
      sceneId: currentScene?.id || '',
      emotionChoice: {
        emotion: selectedEmotion!,
        timestamp: Date.now(),
        correct: selectedEmotion === currentScene?.correctEmotion,
        responseTime: Date.now() - startTime,
      },
      reactionChoice,
      empathyScore,
    };

    setLevelData([...levelData, level]);
    setCurrentScreen('outcome');
  };

  const handleOutcomeContinue = () => {
    setCurrentScreen('level-summary');
  };

  const handleNextLevel = () => {
    const nextIndex = currentSceneIndex + 1;
    const scenes = getStoryScenesForDifficulty(difficulty!);
    
    if (nextIndex < scenes.length) {
      loadScene(nextIndex, difficulty!);
      setCurrentScreen('story');
      setSelectedEmotion(null);
      setSelectedReaction(null);
    } else {
      // Game complete
      const results = calculateFinalResults(levelData);
      setCurrentScreen('final-results');
    }
  };

  const handleFinishJourney = () => {
    const results = calculateFinalResults(levelData);
    onComplete(results);
  };

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onStart={handleStartJourney}
          onBack={onBack}
        />
      )}

      {currentScreen === 'difficulty' && (
        <DifficultySelectionScreen
          onSelect={handleDifficultySelect}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'story' && (
        <EpisodeStyleGame
          onBack={() => setCurrentScreen('difficulty')}
          onComplete={(results) => {
            setCurrentScreen('final-results');
          }}
        />
      )}

      {currentScreen === 'final-results' && (
        <FinalResultsScreen
          results={calculateFinalResults(levelData)}
          onPlayAgain={() => {
            setCurrentScreen('welcome');
            setLevelData([]);
            setCurrentSceneIndex(0);
            setDifficulty(null);
          }}
          onReturnToLab={handleFinishJourney}
        />
      )}
    </>
  );
}

// Helper Functions
function getStoryScenesForDifficulty(mode: DifficultyMode): StoryScene[] {
  // This would be expanded with actual story content
  const scenes: Record<DifficultyMode, StoryScene[]> = {
    kids: [
      {
        id: 'kids-1',
        title: 'The Lost Toy',
        background: 'playground',
        characterImage: 'child-sad',
        narration: 'Emma just realized she left her favorite teddy bear at the park. She looks around but can\'t find it anywhere.',
        emotionQuestion: 'How does Emma feel?',
        reactionQuestion: 'How should Emma react?',
        correctEmotion: 'sad',
        difficulty: 'kids',
      },
      {
        id: 'kids-2',
        title: 'Birthday Surprise',
        background: 'home',
        characterImage: 'child-happy',
        narration: 'Tommy walks into his room and sees all his friends waiting with balloons and a big cake!',
        emotionQuestion: 'How does Tommy feel?',
        reactionQuestion: 'How should Tommy react?',
        correctEmotion: 'happy',
        difficulty: 'kids',
      },
    ],
    teen: [
      {
        id: 'teen-1',
        title: 'The Group Chat',
        background: 'bedroom',
        characterImage: 'teen-worried',
        narration: 'Alex sees their friends making plans in the group chat, but no one invited them. They keep scrolling, feeling invisible.',
        emotionQuestion: 'How does Alex feel?',
        reactionQuestion: 'How should Alex react?',
        correctEmotion: 'worried',
        difficulty: 'teen',
      },
      {
        id: 'teen-2',
        title: 'Exam Results',
        background: 'school',
        characterImage: 'teen-angry',
        narration: 'Jordan studied really hard but got a lower grade than expected. Their friend who barely studied got an A.',
        emotionQuestion: 'How does Jordan feel?',
        reactionQuestion: 'How should Jordan react?',
        correctEmotion: 'angry',
        difficulty: 'teen',
      },
    ],
    senior: [
      {
        id: 'senior-1',
        title: 'The Old Photograph',
        background: 'living-room',
        characterImage: 'senior-nostalgic',
        narration: 'Margaret finds a photo from 50 years ago. Her late husband smiles back at her, young and full of life.',
        emotionQuestion: 'How does Margaret feel?',
        reactionQuestion: 'How should Margaret react?',
        correctEmotion: 'sad',
        difficulty: 'senior',
      },
      {
        id: 'senior-2',
        title: 'Grandchildren Visit',
        background: 'garden',
        characterImage: 'senior-happy',
        narration: 'Robert hears the doorbell ring. His grandchildren rush in with flowers and hugs, filling the house with laughter.',
        emotionQuestion: 'How does Robert feel?',
        reactionQuestion: 'How should Robert react?',
        correctEmotion: 'happy',
        difficulty: 'senior',
      },
    ],
  };

  return scenes[mode] || scenes.teen;
}

function calculateEmpathyScore(emotion: EmotionType, reaction: ReactionType): number {
  // Empathetic reactions score higher
  const empathyMap: Record<ReactionType, number> = {
    talk: 100,
    avoid: 50,
    confront: 75,
    'seek-help': 60,
  };

  return empathyMap[reaction] || 50;
}

function calculateFinalResults(levels: LevelData[]): GameResults {
  if (levels.length === 0) {
    return {
      totalScore: 0,
      emotionalAccuracy: 0,
      empathyScore: 0,
      conflictResolutionStyle: 'Balanced',
      empathyConsistency: 0,
      reactionBias: 'None',
      levels: [],
      badges: [],
      completedAt: new Date().toISOString(),
    };
  }

  // Calculate emotional accuracy
  const correctEmotions = levels.filter(l => l.emotionChoice.correct).length;
  const emotionalAccuracy = (correctEmotions / levels.length) * 100;

  // Calculate average empathy score
  const avgEmpathyScore = levels.reduce((sum, l) => sum + l.empathyScore, 0) / levels.length;

  // Determine conflict resolution style
  const reactions = levels.map(l => l.reactionChoice.reaction);
  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantReaction = Object.entries(reactionCounts).sort((a, b) => b[1] - a[1])[0][0];
  const conflictResolutionStyle = getConflictStyle(dominantReaction as ReactionType);

  // Calculate empathy consistency (standard deviation)
  const empathyScores = levels.map(l => l.empathyScore);
  const avgDeviation = calculateStandardDeviation(empathyScores);
  const empathyConsistency = Math.max(0, 100 - avgDeviation);

  // Determine badges
  const badges = [];
  if (emotionalAccuracy >= 80) badges.push('Emotion Decoder');
  if (avgEmpathyScore >= 85) badges.push('Empathy Explorer');
  if (levels.length >= 5) badges.push('Story Navigator');
  if (empathyConsistency >= 80) badges.push('Consistent Responder');

  // Total score (weighted average)
  const totalScore = Math.round(
    emotionalAccuracy * 0.4 + avgEmpathyScore * 0.4 + empathyConsistency * 0.2
  );

  return {
    totalScore,
    emotionalAccuracy: Math.round(emotionalAccuracy),
    empathyScore: Math.round(avgEmpathyScore),
    conflictResolutionStyle,
    empathyConsistency: Math.round(empathyConsistency),
    reactionBias: dominantReaction,
    levels,
    badges,
    completedAt: new Date().toISOString(),
  };
}

function getConflictStyle(reaction: ReactionType): string {
  const styles: Record<ReactionType, string> = {
    talk: 'Collaborative & Understanding',
    avoid: 'Conflict-Avoidant',
    confront: 'Direct & Solution-Focused',
    'seek-help': 'Emotionally Expressive',
  };
  return styles[reaction] || 'Balanced';
}

function calculateStandardDeviation(values: number[]): number {
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
}