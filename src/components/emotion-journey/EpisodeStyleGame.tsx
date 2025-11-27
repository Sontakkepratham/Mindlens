import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterIllustration } from './CharacterIllustration';
import { EmotionType, ReactionType } from './EmotionJourneyQuest';

interface DialogueLine {
  id: string;
  type: 'narration' | 'choice';
  character?: string;
  text?: string;
  choices?: Array<{
    text: string;
    value: EmotionType | ReactionType;
    type: 'emotion' | 'reaction';
  }>;
}

interface EpisodeScene {
  id: string;
  background: string;
  characterEmotion: EmotionType;
  characterType: 'child' | 'teen' | 'adult' | 'senior';
  dialogue: DialogueLine[];
  correctEmotion: EmotionType;
}

interface EpisodeStyleGameProps {
  onBack: () => void;
  onComplete: (results: any) => void;
}

// Map backgrounds
const BACKGROUNDS: Record<string, string> = {
  playground: 'https://images.unsplash.com/photo-1761928299635-14d606d1a7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBmbG93ZXJzJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  home: 'https://images.unsplash.com/photo-1641175932432-b2c593ea8f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwY296eSUyMHdhcm18ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  bedroom: 'https://images.unsplash.com/photo-1762199904138-d163fe89540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwYmVkcm9vbSUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NDAwMzU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  school: 'https://images.unsplash.com/photo-1631885661118-5107a6111772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBlbXB0eXxlbnwxfHx8fDE3NjQwMDM1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  garden: 'https://images.unsplash.com/photo-1761928299635-14d606d1a7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBmbG93ZXJzJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
};

const DEMO_SCENES: EpisodeScene[] = [
  {
    id: 'scene-1',
    background: 'playground',
    characterEmotion: 'sad',
    characterType: 'child',
    correctEmotion: 'sad',
    dialogue: [
      {
        id: 'line-1',
        type: 'narration',
        character: 'Narrator',
        text: "It's a sunny afternoon at the park. Emma is playing near the swings.",
      },
      {
        id: 'line-2',
        type: 'narration',
        character: 'Emma',
        text: "Wait... where's Mr. Fluffy? I just had my teddy bear!",
      },
      {
        id: 'line-3',
        type: 'narration',
        character: 'Narrator',
        text: "Emma looks around frantically. Her favorite teddy bear is nowhere to be found.",
      },
      {
        id: 'choice-1',
        type: 'choice',
        text: 'How does Emma feel?',
        choices: [
          { text: '😊 Happy', value: 'happy', type: 'emotion' },
          { text: '😢 Sad', value: 'sad', type: 'emotion' },
          { text: '😠 Angry', value: 'angry', type: 'emotion' },
          { text: '😰 Worried', value: 'worried', type: 'emotion' },
        ],
      },
      {
        id: 'line-4',
        type: 'narration',
        character: 'Emma',
        text: "I really miss Mr. Fluffy... What should I do?",
      },
      {
        id: 'choice-2',
        type: 'choice',
        text: 'What should Emma do?',
        choices: [
          { text: '💬 Ask a grown-up for help', value: 'talk', type: 'reaction' },
          { text: '🚶 Go home and forget about it', value: 'avoid', type: 'reaction' },
          { text: '🔍 Search the whole playground', value: 'confront', type: 'reaction' },
          { text: '😢 Sit down and cry', value: 'seek-help', type: 'reaction' },
        ],
      },
      {
        id: 'line-5',
        type: 'narration',
        character: 'Narrator',
        text: "Emma takes a deep breath and decides to handle the situation with courage.",
      },
    ],
  },
  {
    id: 'scene-2',
    background: 'bedroom',
    characterEmotion: 'worried',
    characterType: 'teen',
    correctEmotion: 'worried',
    dialogue: [
      {
        id: 'line-1',
        type: 'narration',
        character: 'Narrator',
        text: "Alex is lying on their bed, scrolling through their phone.",
      },
      {
        id: 'line-2',
        type: 'narration',
        character: 'Alex',
        text: "*reads group chat* 'Movie night at 7! Can't wait to see everyone!'",
      },
      {
        id: 'line-3',
        type: 'narration',
        character: 'Narrator',
        text: "Alex realizes they weren't invited. The chat keeps buzzing with excited messages.",
      },
      {
        id: 'choice-1',
        type: 'choice',
        text: 'How does Alex feel?',
        choices: [
          { text: '😕 Confused', value: 'confused', type: 'emotion' },
          { text: '😰 Worried', value: 'worried', type: 'emotion' },
          { text: '😠 Angry', value: 'angry', type: 'emotion' },
          { text: '😢 Sad', value: 'sad', type: 'emotion' },
        ],
      },
      {
        id: 'line-4',
        type: 'narration',
        character: 'Alex',
        text: "Why didn't they invite me? Did I do something wrong?",
      },
      {
        id: 'choice-2',
        type: 'choice',
        text: 'What should Alex do?',
        choices: [
          { text: '💬 Message the group and ask about it', value: 'talk', type: 'reaction' },
          { text: '📱 Put the phone away and distract yourself', value: 'avoid', type: 'reaction' },
          { text: '😤 Leave the group chat', value: 'confront', type: 'reaction' },
          { text: '🤝 Talk to a trusted friend privately', value: 'seek-help', type: 'reaction' },
        ],
      },
      {
        id: 'line-5',
        type: 'narration',
        character: 'Narrator',
        text: "Sometimes the hardest conversations lead to the best understanding.",
      },
    ],
  },
];

export function EpisodeStyleGame({ onBack, onComplete }: EpisodeStyleGameProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selections, setSelections] = useState<any[]>([]);

  const currentScene = DEMO_SCENES[currentSceneIndex];
  const currentLine = currentScene?.dialogue[currentLineIndex];

  // Typewriter effect
  useEffect(() => {
    if (currentLine && currentLine.type === 'narration') {
      setIsTyping(true);
      setDisplayedText('');
      setShowChoices(false);

      let index = 0;
      const text = currentLine.text || '';
      
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
    } else if (currentLine && currentLine.type === 'choice') {
      setShowChoices(true);
      setDisplayedText('');
    }
  }, [currentLine]);

  const handleContinue = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(currentLine.text || '');
      setIsTyping(false);
    } else if (currentLineIndex < currentScene.dialogue.length - 1) {
      // Next line
      setCurrentLineIndex(currentLineIndex + 1);
    } else if (currentSceneIndex < DEMO_SCENES.length - 1) {
      // Next scene
      setCurrentSceneIndex(currentSceneIndex + 1);
      setCurrentLineIndex(0);
    } else {
      // Game complete
      onComplete({
        totalScore: 85,
        selections,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const handleChoice = (value: any, type: string) => {
    setSelections([...selections, { value, type, sceneId: currentScene.id }]);
    setShowChoices(false);
    
    // Move to next line
    if (currentLineIndex < currentScene.dialogue.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    }
  };

  if (!currentScene) {
    return null;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${BACKGROUNDS[currentScene.background]})` }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Top UI Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Progress dots */}
          <div className="flex gap-2">
            {DEMO_SCENES.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSceneIndex
                    ? 'bg-white w-6'
                    : index < currentSceneIndex
                    ? 'bg-white/60'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="w-10" />
        </div>
      </div>

      {/* Character Display */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pb-48">
        <motion.div
          key={currentSceneIndex}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-2xl"
          style={{ height: '500px' }}
        >
          <CharacterIllustration
            emotion={currentScene.characterEmotion}
            characterType={currentScene.characterType}
          />
        </motion.div>
      </div>

      {/* Dialogue Box (Episode-style) */}
      <AnimatePresence mode="wait">
        {currentLine && currentLine.type === 'narration' && (
          <motion.div
            key={currentLine.id}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-20"
            onClick={handleContinue}
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
              <div className="max-w-4xl mx-auto px-8 py-6">
                {/* Character name tag */}
                {currentLine.character && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3"
                  >
                    <span className="text-white text-sm font-medium">{currentLine.character}</span>
                  </motion.div>
                )}

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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choice Buttons (Episode-style) */}
      <AnimatePresence>
        {showChoices && currentLine?.type === 'choice' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-20"
          >
            <div className="bg-gradient-to-t from-black/95 via-black/90 to-transparent pt-32 pb-12">
              <div className="max-w-2xl mx-auto px-6 space-y-3">
                {/* Choice prompt */}
                {currentLine.text && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-6"
                  >
                    <p className="text-white text-lg font-medium">{currentLine.text}</p>
                  </motion.div>
                )}

                {/* Choice buttons */}
                {currentLine.choices?.map((choice, index) => (
                  <motion.button
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleChoice(choice.value, choice.type)}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/40 rounded-2xl px-6 py-4 transition-all text-white text-left text-base group"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{choice.text}</span>
                      <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
