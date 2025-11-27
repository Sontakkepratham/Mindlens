import { Award, RotateCcw, Home, TrendingUp, Heart, Brain, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { GameResults } from './EmotionJourneyQuest';

interface FinalResultsScreenProps {
  results: GameResults;
  onPlayAgain: () => void;
  onReturnToLab: () => void;
}

export function FinalResultsScreen({
  results,
  onPlayAgain,
  onReturnToLab,
}: FinalResultsScreenProps) {
  const getScoreLevel = (score: number): { emoji: string; label: string; color: string } => {
    if (score >= 90) return { emoji: '🌟', label: 'Outstanding', color: 'text-yellow-600' };
    if (score >= 80) return { emoji: '⭐', label: 'Excellent', color: 'text-blue-600' };
    if (score >= 70) return { emoji: '✨', label: 'Great', color: 'text-purple-600' };
    if (score >= 60) return { emoji: '💫', label: 'Good', color: 'text-green-600' };
    return { emoji: '🌱', label: 'Growing', color: 'text-slate-600' };
  };

  const scoreLevel = getScoreLevel(results.totalScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-slate-900 text-center">Journey Complete!</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-8xl">{scoreLevel.emoji}</span>
            </div>
          </motion.div>

          <motion.h2
            className="text-slate-900 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Emotional Intelligence Report
          </motion.h2>
          
          <motion.div
            className={`inline-block px-8 py-3 rounded-full text-2xl font-bold ${scoreLevel.color} bg-white shadow-lg`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {results.totalScore}% - {scoreLevel.label}
          </motion.div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-purple-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-slate-900 mb-8 text-center">Detailed Breakdown</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Emotional Accuracy */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold">Emotional Interpretation</h4>
                  <p className="text-3xl font-bold text-pink-600">{results.emotionalAccuracy}%</p>
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${results.emotionalAccuracy}%` }}
                  transition={{ delay: 0.9, duration: 1 }}
                />
              </div>
              <p className="text-sm text-slate-600">
                How accurately you identified emotions in different scenarios
              </p>
            </div>

            {/* Empathy Score */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold">Empathy Score</h4>
                  <p className="text-3xl font-bold text-blue-600">{results.empathyScore}%</p>
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${results.empathyScore}%` }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </div>
              <p className="text-sm text-slate-600">
                Your capacity for understanding and sharing others' feelings
              </p>
            </div>

            {/* Empathy Consistency */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold">Empathy Consistency</h4>
                  <p className="text-3xl font-bold text-purple-600">{results.empathyConsistency}%</p>
                </div>
              </div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${results.empathyConsistency}%` }}
                  transition={{ delay: 1.1, duration: 1 }}
                />
              </div>
              <p className="text-sm text-slate-600">
                How consistently you demonstrated empathetic responses
              </p>
            </div>

            {/* Conflict Resolution Style */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold">Resolution Style</h4>
                  <p className="text-sm font-medium text-green-600">{results.conflictResolutionStyle}</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <p className="text-sm text-slate-700">
                  Your primary response pattern shows a tendency toward <span className="font-semibold">{results.conflictResolutionStyle.toLowerCase()}</span> approaches.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges Earned */}
        {results.badges.length > 0 && (
          <motion.div
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl p-8 mb-8 border-2 border-yellow-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <h3 className="text-slate-900 mb-6 text-center flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-yellow-600" />
              Badges Earned
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {results.badges.map((badge, index) => (
                <motion.div
                  key={badge}
                  className="bg-white border-2 border-yellow-300 rounded-2xl px-6 py-4 shadow-lg"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 1.5 + index * 0.15,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {badge === 'Emotion Decoder' && '🎯'}
                      {badge === 'Empathy Explorer' && '💚'}
                      {badge === 'Story Navigator' && '🗺️'}
                      {badge === 'Consistent Responder' && '⚖️'}
                    </div>
                    <p className="text-slate-900 font-semibold">{badge}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Insights */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-8 border-2 border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
        >
          <h3 className="text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Key Insights
          </h3>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-blue-100">
              <h4 className="text-slate-900 font-semibold mb-2">🎭 Reaction Pattern</h4>
              <p className="text-slate-700">
                You showed a preference for <span className="font-semibold">{results.reactionBias}</span> responses. 
                This reveals how you naturally tend to approach emotional situations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-blue-100">
              <h4 className="text-slate-900 font-semibold mb-2">💡 Growth Opportunity</h4>
              <p className="text-slate-700">
                {results.emotionalAccuracy >= 80 
                  ? 'You have strong emotional recognition skills! Continue practicing empathy in real-world situations.'
                  : 'Keep working on identifying subtle emotional cues. Pay attention to facial expressions, tone, and context.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-blue-100">
              <h4 className="text-slate-900 font-semibold mb-2">🌟 Strengths</h4>
              <p className="text-slate-700">
                {results.empathyScore >= 85 
                  ? 'Your empathy levels are excellent! You show strong understanding of others\' perspectives.'
                  : 'Your emotional intelligence is developing well. Keep practicing perspective-taking.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
        >
          <Button
            onClick={onPlayAgain}
            variant="outline"
            className="flex-1 h-14 text-lg border-2 border-purple-300 hover:bg-purple-50"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Another Story
          </Button>
          <Button
            onClick={onReturnToLab}
            className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to MindLens Lab
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1 }}
        >
          <p className="text-sm text-slate-600">
            🎓 Your results have been saved securely. Share your progress with a counselor or therapist if you'd like professional insights.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
