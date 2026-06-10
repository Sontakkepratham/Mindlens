import { ArrowLeft, Sparkles, Heart, Brain, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { useState } from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export function WelcomeScreen({ onStart, onBack }: WelcomeScreenProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* Floating animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-yellow-200/30 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-24 h-24 bg-pink-200/30 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-slate-900 flex-1">Emotion Journey Quest</h1>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-6 py-12 relative z-10">
        {/* Hero Section with Animated Characters */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Icon Group */}
          <div className="relative h-48 mb-8">
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
                <Heart className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Orbiting emotion icons */}
            <motion.div
              className="absolute left-1/2 top-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="relative w-64 h-64 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">😊</span>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">😢</span>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-300 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">😠</span>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-green-300 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">😌</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.h2
            className="text-slate-900 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Emotion Journey Quest
          </motion.h2>
          
          <motion.p
            className="text-slate-600 text-lg max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Explore emotions through animated stories. Make choices, understand feelings, and develop emotional intelligence.
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-1">Interactive Stories</h3>
                <p className="text-slate-600 text-sm">
                  Experience realistic scenarios with animated characters and branching storylines
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-1">Emotional Intelligence</h3>
                <p className="text-slate-600 text-sm">
                  Learn to recognize, understand, and manage emotions in various life situations
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-slate-900 font-semibold mb-1">Personalized Insights</h3>
                <p className="text-slate-600 text-sm">
                  Receive detailed feedback on your emotional patterns and decision-making style
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        {showHelp && (
          <motion.div
            className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="text-slate-900 font-semibold mb-3">How It Works</h4>
            <ol className="space-y-2 text-slate-700 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">1.</span>
                <span>Choose your difficulty level (Kids, Teen/Adult, or Senior)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">2.</span>
                <span>Read through animated story scenes with characters</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">3.</span>
                <span>Identify how the character is feeling</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">4.</span>
                <span>Choose how the character should respond</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue-600">5.</span>
                <span>See the outcome and learn about emotional intelligence</span>
              </li>
            </ol>
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={onStart}
            className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white text-lg shadow-xl"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>

          <p className="text-center text-sm text-slate-500 mt-4">
            ✨ Estimated time: 10-15 minutes per story
          </p>
        </motion.div>
      </div>
    </div>
  );
}
