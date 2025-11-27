import { motion } from 'motion/react';
import { ReactNode } from 'react';

// Episode-style Dialogue Bubble
interface DialogueBubbleProps {
  text: string;
  characterName?: string;
  onContinue?: () => void;
  showContinue?: boolean;
  typing?: boolean;
}

export function DialogueBubble({ 
  text, 
  characterName, 
  onContinue, 
  showContinue = true,
  typing = false 
}: DialogueBubbleProps) {
  return (
    <motion.div
      className="relative"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      {/* Character name tag */}
      {characterName && (
        <div className="flex items-center gap-2 mb-2 ml-2">
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full px-4 py-1.5 shadow-lg">
            <span className="text-white text-sm font-medium">{characterName}</span>
          </div>
        </div>
      )}

      {/* Dialogue bubble */}
      <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl px-8 py-6 shadow-2xl border-2 border-white/10">
        {/* Soft glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl" />
        
        {/* Text content */}
        <div className="relative">
          <p className="text-white text-lg leading-relaxed font-light">
            {text}
            {typing && (
              <motion.span
                className="inline-block w-1 h-5 bg-white ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>

          {/* Continue indicator */}
          {showContinue && !typing && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-white/60 text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>Tap to continue</span>
              <span className="text-lg">→</span>
            </motion.div>
          )}
        </div>

        {/* Click overlay */}
        {onContinue && (
          <button
            onClick={onContinue}
            className="absolute inset-0 w-full h-full rounded-3xl"
            aria-label="Continue"
          />
        )}
      </div>
    </motion.div>
  );
}

// Episode-style Thought Bubble
interface ThoughtBubbleProps {
  text: string;
  position?: 'left' | 'right';
}

export function ThoughtBubble({ text, position = 'right' }: ThoughtBubbleProps) {
  return (
    <motion.div
      className={`absolute top-10 ${position === 'left' ? 'left-4' : 'right-4'} max-w-xs`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15 }}
    >
      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl px-6 py-4 shadow-xl">
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-3xl" />
        
        <p className="relative text-slate-700 text-sm italic font-light">{text}</p>
        
        {/* Thought bubble dots */}
        <div className={`absolute bottom-[-20px] ${position === 'left' ? 'left-8' : 'right-8'} flex gap-1`}>
          <motion.div
            className="w-3 h-3 bg-white rounded-full shadow-md"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 bg-white rounded-full shadow-md"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full shadow-md"
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Episode-style Choice Buttons
interface ChoiceButtonProps {
  text: string;
  icon?: string;
  onClick: () => void;
  color?: 'purple' | 'pink' | 'blue' | 'green' | 'orange';
  selected?: boolean;
}

export function ChoiceButton({ 
  text, 
  icon, 
  onClick, 
  color = 'purple',
  selected = false 
}: ChoiceButtonProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full bg-gradient-to-r ${colorClasses[color]} text-white px-6 py-4 rounded-2xl shadow-lg transition-all ${
        selected ? 'ring-4 ring-white/50' : ''
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Soft glow */}
      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center justify-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="font-medium text-base">{text}</span>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
    </motion.button>
  );
}

// Episode-style Emotion Icons
interface EmotionIconProps {
  emotion: string;
  icon: string;
  selected?: boolean;
  onClick: () => void;
}

export function EmotionIcon({ emotion, icon, selected, onClick }: EmotionIconProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
        selected 
          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110' 
          : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-md'
      }`}
      whileHover={{ scale: selected ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <span className="text-3xl">{icon}</span>
      <span className={`text-xs font-medium ${selected ? 'text-white' : 'text-slate-600'}`}>
        {emotion}
      </span>

      {/* Selection ring */}
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-4 border-white/50"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
      )}
    </motion.button>
  );
}

// Episode-style Screen Container
interface EpisodeScreenProps {
  children: ReactNode;
  background?: string;
  overlay?: boolean;
}

export function EpisodeScreen({ children, background, overlay = true }: EpisodeScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      {background && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        >
          {/* Soft overlay for readability */}
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Episode-style Progress Bar
interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

// Episode-style Header
interface EpisodeHeaderProps {
  title: string;
  onBack?: () => void;
  progress?: { current: number; total: number };
}

export function EpisodeHeader({ title, onBack, progress }: EpisodeHeaderProps) {
  return (
    <div className="relative z-20 bg-gradient-to-b from-black/60 to-transparent">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-10" />
          )}

          <motion.div
            className="text-white font-medium text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {title}
          </motion.div>

          <div className="w-10" />
        </div>

        {progress && <ProgressBar current={progress.current} total={progress.total} />}
      </div>
    </div>
  );
}
