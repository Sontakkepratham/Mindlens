import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Brain, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { EmotionType, ReactionType, StoryScene } from './EmotionJourneyQuest';
import { CharacterIllustration } from './CharacterIllustration';

interface AnimatedOutcomeScreenProps {
  scene: StoryScene;
  selectedEmotion: EmotionType;
  selectedReaction: ReactionType;
  onContinue: () => void;
}

export function AnimatedOutcomeScreen({
  scene,
  selectedEmotion,
  selectedReaction,
  onContinue,
}: AnimatedOutcomeScreenProps) {
  const [showCharacter, setShowCharacter] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowCharacter(true), 300);
    const timer2 = setTimeout(() => setShowOutcome(true), 1500);
    const timer3 = setTimeout(() => setShowInsights(true), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const outcome = getOutcome(selectedEmotion, selectedReaction, scene);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full space-y-8">
          {/* Character Reaction Animation */}
          <AnimatePresence>
            {showCharacter && (
              <motion.div
                className="text-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15 
                }}
              >
                <motion.div
                  className="inline-block text-[160px] mb-6"
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {outcome.characterEmoji}
                </motion.div>

                {/* Emotional effect particles */}
                <div className="relative h-0">
                  {outcome.particles.map((particle, i) => (
                    <motion.div
                      key={i}
                      className="absolute left-1/2 top-0"
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        scale: 0,
                        opacity: 0 
                      }}
                      animate={{
                        x: Math.cos(i * (360 / outcome.particles.length) * Math.PI / 180) * 150,
                        y: Math.sin(i * (360 / outcome.particles.length) * Math.PI / 180) * 150,
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <span className="text-4xl">{particle}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Outcome Text */}
          <AnimatePresence>
            {showOutcome && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl">
                  <motion.h2
                    className="text-white text-center mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {outcome.title}
                  </motion.h2>
                  
                  <motion.p
                    className="text-white/90 text-lg leading-relaxed text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {outcome.description}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Insights Cards */}
          <AnimatePresence>
            {showInsights && (
              <motion.div
                className="grid md:grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Emotion Insight */}
                <motion.div
                  className="bg-gradient-to-br from-pink-500/90 to-rose-500/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart className="w-8 h-8 text-white mb-3" />
                  <h4 className="text-white font-semibold mb-2">
                    Emotional Awareness
                  </h4>
                  <p className="text-white/90 text-sm">
                    {outcome.emotionalInsight}
                  </p>
                </motion.div>

                {/* Response Style */}
                <motion.div
                  className="bg-gradient-to-br from-blue-500/90 to-cyan-500/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Brain className="w-8 h-8 text-white mb-3" />
                  <h4 className="text-white font-semibold mb-2">
                    Response Style
                  </h4>
                  <p className="text-white/90 text-sm">
                    {outcome.responseStyle}
                  </p>
                </motion.div>

                {/* Growth Opportunity */}
                <motion.div
                  className="bg-gradient-to-br from-purple-500/90 to-indigo-500/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 shadow-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <TrendingUp className="w-8 h-8 text-white mb-3" />
                  <h4 className="text-white font-semibold mb-2">
                    Growth Insight
                  </h4>
                  <p className="text-white/90 text-sm">
                    {outcome.growthOpportunity}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button */}
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={onContinue}
                  className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg shadow-2xl"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Continue to Summary
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate outcome based on choices
function getOutcome(
  emotion: EmotionType,
  reaction: ReactionType,
  scene: StoryScene
) {
  const outcomes = {
    empathetic: {
      characterEmoji: '🤗',
      particles: ['💚', '✨', '🌟', '💫', '💝', '🌈'],
      title: 'Compassionate Connection',
      description: 'Your empathetic response created understanding and emotional connection. The character feels heard and supported.',
      emotionalInsight: 'You recognized and validated the emotions in this situation.',
      responseStyle: 'Your empathy reflects emotional intelligence and care for others.',
      growthOpportunity: 'Empathy builds trust and strengthens relationships over time.',
    },
    assertive: {
      characterEmoji: '💪',
      particles: ['⚡', '🎯', '✨', '💥', '🔥', '⭐'],
      title: 'Confident Action',
      description: 'Your assertive response set clear boundaries and addressed the situation directly. The character feels empowered.',
      emotionalInsight: 'You balanced emotion recognition with decisive action.',
      responseStyle: 'Assertiveness shows self-respect and clear communication.',
      growthOpportunity: 'Direct communication prevents misunderstandings and builds respect.',
    },
    avoidant: {
      characterEmoji: '😌',
      particles: ['🛡️', '💭', '🌙', '☁️', '🕊️', '💤'],
      title: 'Space and Reflection',
      description: 'Your avoidant response gave space to process emotions. Sometimes distance can provide perspective.',
      emotionalInsight: 'You chose to step back rather than react immediately.',
      responseStyle: 'Avoidance can provide time to think, but may delay resolution.',
      growthOpportunity: 'Consider if addressing emotions directly might help long-term.',
    },
    emotional: {
      characterEmoji: '😭',
      particles: ['💥', '💔', '🌊', '💨', '⚡', '🎭'],
      title: 'Raw Emotional Expression',
      description: 'Your emotional response let feelings flow freely. The character expressed their emotions openly and intensely.',
      emotionalInsight: 'You allowed authentic emotional expression without filtering.',
      responseStyle: 'Emotional honesty can be cathartic but may need balance.',
      growthOpportunity: 'Strong emotions are valid—learning to express them constructively helps.',
    },
  };

  return outcomes[reaction];
}