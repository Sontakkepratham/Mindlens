import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Episode, EmotionType, SceneBranch } from './EpisodeData';
import { CharacterIllustration } from './CharacterIllustration';

interface EpisodePlayerProps {
  episode: Episode;
  characterMood: 'supportive' | 'energetic' | 'calm' | 'serious' | 'gentle';
  onComplete: (emotion: EmotionType, branch: SceneBranch) => void;
  onBack: () => void;
}

type PlayerScreen = 'intro' | 'check-in' | 'emotion-select' | 'story' | 'insight' | 'cliffhanger' | 'reward';

export function EpisodePlayer({ episode, characterMood, onComplete, onBack }: EpisodePlayerProps) {
  const [screen, setScreen] = useState<PlayerScreen>('intro');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [currentBranch, setCurrentBranch] = useState<SceneBranch | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (screen === 'story' && currentBranch && dialogueIndex < currentBranch.dialogue.length) {
      const currentLine = currentBranch.dialogue[dialogueIndex];
      setIsTyping(true);
      setDisplayedText('');

      let index = 0;
      const text = currentLine.text;
      
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [screen, dialogueIndex, currentBranch]);

  const handleEmotionSelect = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
    const branch = episode.branches.find(b => b.emotion === emotion);
    
    if (branch) {
      setCurrentBranch(branch);
      setScreen('story');
      setDialogueIndex(0);
    } else {
      // Fallback if branch not fully implemented
      setScreen('cliffhanger');
    }
  };

  const handleDialogueContinue = () => {
    if (isTyping) {
      // Skip typing
      setDisplayedText(currentBranch?.dialogue[dialogueIndex]?.text || '');
      setIsTyping(false);
    } else if (currentBranch && dialogueIndex < currentBranch.dialogue.length - 1) {
      // Next dialogue
      setDialogueIndex(dialogueIndex + 1);
    } else {
      // Story complete, show insight
      setScreen('insight');
    }
  };

  const getEmotionIcon = (emotion: EmotionType): string => {
    const icons: Record<EmotionType, string> = {
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      numb: '😶',
      overwhelmed: '😵',
      happy: '😊',
      confused: '😕',
    };
    return icons[emotion];
  };

  const getEmotionLabel = (emotion: EmotionType): string => {
    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  };

  const getCharacterType = (): 'child' | 'teen' | 'adult' | 'senior' => {
    // Default to adult for the guide character
    return 'adult';
  };

  const getCharacterEmotion = (): EmotionType => {
    // Character mood based on characterMood prop
    if (characterMood === 'supportive') return 'happy';
    if (characterMood === 'calm') return 'neutral' as EmotionType;
    if (characterMood === 'serious') return 'confused';
    return 'happy';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onBack}
          className="p-3 bg-black/50 backdrop-blur-xl border border-white/20 rounded-full hover:bg-black/70 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* INTRO SCREEN */}
        {screen === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen p-6"
          >
            <div className="text-center max-w-2xl">
              {/* Cinematic Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <div className="inline-block bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 mb-6">
                  <span className="text-white/70 text-sm">Episode {episode.id}</span>
                </div>
                <h1 className="text-white text-5xl font-bold mb-4 drop-shadow-2xl">
                  {episode.title}
                </h1>
                <p className="text-white/80 text-xl">
                  {episode.subtitle}
                </p>
              </motion.div>

              {/* Pulsing Continue Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setScreen('check-in')}
                className="relative group"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-[#7B9FDB]/30 rounded-full blur-xl"
                />
                <div className="relative bg-gradient-to-r from-[#7B9FDB] to-[#D4D0F0] px-12 py-4 rounded-full text-white font-semibold text-lg hover:shadow-2xl transition-shadow">
                  Tap to Continue
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* CHECK-IN SCREEN */}
        {screen === 'check-in' && (
          <motion.div
            key="check-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            {/* Character */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg mb-12"
              style={{ height: '400px' }}
            >
              <CharacterIllustration
                emotion={getCharacterEmotion()}
                characterType={getCharacterType()}
              />
            </motion.div>

            {/* Check-in Dialogue */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-2xl"
            >
              <div className="text-center">
                <div className="inline-block bg-[#7B9FDB]/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
                  <span className="text-[#7B9FDB] text-sm font-medium">Your Guide</span>
                </div>
                <p className="text-white text-xl leading-relaxed mb-8">
                  {episode.checkInPrompt}
                </p>
                <button
                  onClick={() => setScreen('emotion-select')}
                  className="bg-gradient-to-r from-[#7B9FDB] to-[#D4D0F0] px-8 py-3 rounded-full text-white font-medium hover:shadow-xl transition-shadow"
                >
                  I'm ready
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* EMOTION SELECTION */}
        {screen === 'emotion-select' && (
          <motion.div
            key="emotion-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-white text-3xl font-semibold mb-3">
                How are you feeling today?
              </h2>
              <p className="text-white/60 text-lg">
                Choose the emotion that resonates most
              </p>
            </motion.div>

            {/* Emotion Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl">
              {episode.emotionOptions.map((emotion, index) => (
                <motion.button
                  key={emotion}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleEmotionSelect(emotion)}
                  className="group relative"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/30 transition-all">
                    <div className="text-6xl mb-3">{getEmotionIcon(emotion)}</div>
                    <p className="text-white font-medium">{getEmotionLabel(emotion)}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STORY/DIALOGUE SCREEN */}
        {screen === 'story' && currentBranch && (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
            style={{
              backgroundImage: `url(${currentBranch.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

            {/* Character */}
            <div className="absolute inset-0 flex items-end justify-center pb-48 px-6 z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
                style={{ height: '500px' }}
              >
                <CharacterIllustration
                  emotion={currentBranch.dialogue[dialogueIndex]?.characterEmotion || getCharacterEmotion()}
                  characterType={getCharacterType()}
                />
              </motion.div>
            </div>

            {/* Dialogue Box (Episode-style) */}
            <div
              onClick={handleDialogueContinue}
              className="absolute bottom-0 left-0 right-0 z-20 cursor-pointer"
            >
              <div className="bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
                <div className="max-w-4xl mx-auto px-8 py-6">
                  {/* Speaker name */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3"
                  >
                    <span className="text-white text-sm font-medium">
                      {currentBranch.dialogue[dialogueIndex]?.speaker}
                    </span>
                  </motion.div>

                  {/* Dialogue text */}
                  <p className="text-white text-lg leading-relaxed min-h-[80px]">
                    {displayedText}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-0.5 h-5 bg-white ml-1 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                  </p>

                  {/* Continue indicator */}
                  {!isTyping && (
                    <motion.div
                      className="flex items-center justify-end gap-2 mt-4 text-white/50 text-sm"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span>Tap to continue</span>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* INSIGHT SCREEN */}
        {screen === 'insight' && currentBranch && (
          <motion.div
            key="insight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-[#7B9FDB]/20 to-[#D4D0F0]/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-3xl text-center"
            >
              <div className="text-6xl mb-6">💡</div>
              <h3 className="text-white text-2xl font-semibold mb-4">
                Today's Insight
              </h3>
              <p className="text-white/90 text-xl leading-relaxed mb-8">
                {currentBranch.insight}
              </p>
              {currentBranch.rewardBadge && (
                <div className="inline-block bg-[#7B9FDB]/30 backdrop-blur-sm border border-[#7B9FDB]/50 rounded-full px-6 py-2 mb-6">
                  <span className="text-[#7B9FDB] font-medium">
                    🏆 Badge Earned: {currentBranch.rewardBadge}
                  </span>
                </div>
              )}
              <button
                onClick={() => setScreen('cliffhanger')}
                className="bg-gradient-to-r from-[#7B9FDB] to-[#D4D0F0] px-10 py-4 rounded-full text-white font-semibold text-lg hover:shadow-2xl transition-shadow"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* CLIFFHANGER SCREEN */}
        {screen === 'cliffhanger' && (
          <motion.div
            key="cliffhanger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center max-w-2xl"
            >
              <div className="text-7xl mb-8">✨</div>
              <h2 className="text-white text-3xl font-bold mb-6 leading-tight">
                {episode.cliffhanger}
              </h2>
              <p className="text-white/60 text-lg mb-12">
                Come back to continue your journey
              </p>
              <button
                onClick={() => {
                  if (selectedEmotion && currentBranch) {
                    onComplete(selectedEmotion, currentBranch);
                  }
                }}
                className="bg-gradient-to-r from-[#7B9FDB] to-[#D4D0F0] px-12 py-4 rounded-full text-white font-semibold text-lg hover:shadow-2xl transition-shadow"
              >
                Return to Episodes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
