import { ArrowRight, Award, Heart, Brain, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { LevelData } from './EmotionJourneyQuest';

interface LevelSummaryScreenProps {
  levelData: LevelData;
  levelNumber: number;
  onNext: () => void;
  onBack: () => void;
}

export function LevelSummaryScreen({
  levelData,
  levelNumber,
  onNext,
}: LevelSummaryScreenProps) {
  const emotionAccuracy = levelData.emotionChoice.correct ? 100 : 0;
  const empathyScore = levelData.empathyScore;
  const avgScore = (emotionAccuracy + empathyScore) / 2;

  // Determine badges earned this level
  const badges: string[] = [];
  if (emotionAccuracy === 100) badges.push('Emotion Decoder');
  if (empathyScore >= 90) badges.push('Empathy Explorer');
  if (levelData.reactionChoice.reaction === 'empathetic') badges.push('Compassionate Heart');

  const getReactionName = (reaction: string): string => {
    const names: Record<string, string> = {
      empathetic: 'Empathetic',
      assertive: 'Assertive',
      avoidant: 'Avoidant',
      emotional: 'Emotional',
    };
    return names[reaction] || reaction;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h1 className="text-slate-900 text-center">Level {levelNumber} Complete!</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Success Animation */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="inline-block"
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-7xl">🎉</span>
            </div>
          </motion.div>

          <motion.h2
            className="text-slate-900 mt-6 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Well Done!
          </motion.h2>
          
          <motion.p
            className="text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            You've completed this emotional journey
          </motion.p>
        </motion.div>

        {/* Score Overview */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-purple-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-slate-900 text-center mb-8">Your Performance</h3>

          {/* Score Bars */}
          <div className="space-y-6">
            {/* Emotional Accuracy */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Emotional Accuracy
                </span>
                <span className="text-slate-900 font-bold">{emotionAccuracy}%</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${emotionAccuracy}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {emotionAccuracy === 100 
                  ? '✨ Perfect! You correctly identified the emotion.' 
                  : '💡 Keep practicing emotion recognition.'}
              </p>
            </div>

            {/* Empathy Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Empathy Score
                </span>
                <span className="text-slate-900 font-bold">{empathyScore}%</span>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${empathyScore}%` }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Your {getReactionName(levelData.reactionChoice.reaction).toLowerCase()} response 
                earned you {empathyScore} empathy points.
              </p>
            </div>

            {/* Overall */}
            <div className="pt-4 border-t-2 border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-900 font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Level Score
                </span>
                <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                  {Math.round(avgScore)}%
                </span>
              </div>
              <div className="h-5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${avgScore}%` }}
                  transition={{ delay: 1.2, duration: 1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reasoning Pattern */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 mb-8 border-2 border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <h4 className="text-slate-900 font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Your Reasoning Pattern
          </h4>
          <p className="text-slate-700">
            You chose a <span className="font-semibold">{getReactionName(levelData.reactionChoice.reaction)}</span> response. 
            This shows your tendency to {getReasoningDescription(levelData.reactionChoice.reaction)}.
          </p>
        </motion.div>

        {/* Badges */}
        {badges.length > 0 && (
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-yellow-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
          >
            <h4 className="text-slate-900 font-semibold mb-6 text-center flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-yellow-600" />
              Badges Earned This Level
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  className="bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-2xl px-6 py-3 shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 + index * 0.2 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <p className="text-slate-900 font-medium flex items-center gap-2">
                    <span className="text-2xl">
                      {badge === 'Emotion Decoder' && '🎯'}
                      {badge === 'Empathy Explorer' && '💚'}
                      {badge === 'Compassionate Heart' && '❤️'}
                    </span>
                    {badge}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <Button
            onClick={onNext}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg shadow-xl"
          >
            <span>Next Level</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function getReasoningDescription(reaction: string): string {
  const descriptions: Record<string, string> = {
    empathetic: 'prioritize understanding and supporting others emotionally',
    assertive: 'take confident action and set clear boundaries',
    avoidant: 'step back and process situations with distance',
    emotional: 'express your feelings openly and authentically',
  };
  return descriptions[reaction] || 'respond thoughtfully';
}
