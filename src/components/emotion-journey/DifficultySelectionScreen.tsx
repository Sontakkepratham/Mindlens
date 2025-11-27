import { ArrowLeft, Baby, Users, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { DifficultyMode } from './EmotionJourneyQuest';

interface DifficultySelectionScreenProps {
  onSelect: (mode: DifficultyMode) => void;
  onBack: () => void;
}

export function DifficultySelectionScreen({ onSelect, onBack }: DifficultySelectionScreenProps) {
  const difficulties: Array<{
    mode: DifficultyMode;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    emoji: string;
    gradient: string;
    hoverGradient: string;
    borderColor: string;
  }> = [
    {
      mode: 'kids',
      title: 'Kids Mode',
      subtitle: 'Ages 6-12',
      description: 'Simple, cute stories with friendly characters. Learn about basic emotions like happy, sad, and angry.',
      icon: <Baby className="w-8 h-8" />,
      emoji: '🧸',
      gradient: 'from-yellow-100 to-orange-100',
      hoverGradient: 'from-yellow-200 to-orange-200',
      borderColor: 'border-yellow-300',
    },
    {
      mode: 'teen',
      title: 'Teen/Adult Mode',
      subtitle: 'Ages 13+',
      description: 'Relationship and social conflict scenarios. Navigate complex emotions and social dynamics.',
      icon: <Users className="w-8 h-8" />,
      emoji: '🎭',
      gradient: 'from-blue-100 to-purple-100',
      hoverGradient: 'from-blue-200 to-purple-200',
      borderColor: 'border-blue-300',
    },
    {
      mode: 'senior',
      title: 'Senior Mode',
      subtitle: 'Ages 60+',
      description: 'Nostalgic, life-reflection scenes. Explore wisdom, memory, and meaningful connections.',
      icon: <Heart className="w-8 h-8" />,
      emoji: '🌸',
      gradient: 'from-pink-100 to-rose-100',
      hoverGradient: 'from-pink-200 to-rose-200',
      borderColor: 'border-pink-300',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-slate-900">Choose Your Journey</h1>
            <p className="text-sm text-slate-600">Select the story experience that fits you best</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-slate-900 mb-3">What type of stories would you like to explore?</h2>
          <p className="text-slate-600">
            Each mode offers unique scenarios tailored to different life experiences
          </p>
        </motion.div>

        {/* Difficulty Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {difficulties.map((diff, index) => (
            <motion.button
              key={diff.mode}
              onClick={() => onSelect(diff.mode)}
              className={`relative bg-gradient-to-br ${diff.gradient} hover:${diff.hoverGradient} border-2 ${diff.borderColor} rounded-3xl p-8 text-left transition-all hover:shadow-2xl hover:scale-105 group`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Floating Emoji */}
              <motion.div
                className="absolute -top-6 right-6 text-6xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {diff.emoji}
              </motion.div>

              {/* Icon */}
              <div className="mb-6 text-slate-700">
                {diff.icon}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-slate-900 font-semibold text-xl mb-1">
                    {diff.title}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {diff.subtitle}
                  </p>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {diff.description}
                </p>
              </div>

              {/* Hover indicator */}
              <div className="mt-6 flex items-center gap-2 text-slate-700 group-hover:text-slate-900 transition-colors">
                <span className="text-sm font-medium">Select</span>
                <motion.span
                  className="text-lg"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info Box */}
        <motion.div
          className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-700">
            <span className="font-semibold">💡 Don't worry!</span> You can always come back and try different modes.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
