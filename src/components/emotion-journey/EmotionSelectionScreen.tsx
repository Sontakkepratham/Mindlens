import { useState } from 'react';
import { motion } from 'motion/react';
import { EmotionType } from './EmotionJourneyQuest';
import { EpisodeScreen, EpisodeHeader, EmotionIcon, ChoiceButton } from './EpisodeUI';
import { CharacterIllustration } from './CharacterIllustration';

interface EmotionSelectionScreenProps {
  onSelectEmotion: (emotion: EmotionType) => void;
  onBack: () => void;
  characterType: 'child' | 'teen' | 'adult' | 'senior';
  question: string;
}

const EMOTIONS: Array<{ value: EmotionType; icon: string; label: string; color: string }> = [
  { value: 'happy', icon: '😊', label: 'Happy', color: '#FFD700' },
  { value: 'sad', icon: '😢', label: 'Sad', color: '#64B5F6' },
  { value: 'angry', icon: '😠', label: 'Angry', color: '#F44336' },
  { value: 'worried', icon: '😰', label: 'Worried', color: '#FF9800' },
  { value: 'confused', icon: '😕', label: 'Confused', color: '#9C27B0' },
  { value: 'neutral', icon: '😌', label: 'Confident', color: '#4CAF50' },
];

export function EmotionSelectionScreen({
  onSelectEmotion,
  onBack,
  characterType,
  question,
}: EmotionSelectionScreenProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);

  const handleEmotionClick = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };

  const handleConfirm = () => {
    if (selectedEmotion) {
      onSelectEmotion(selectedEmotion);
    }
  };

  return (
    <EpisodeScreen background="https://images.unsplash.com/photo-1759116119693-2ea4e37df07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBncmFkaWVudCUyMGNhbG18ZW58MXx8fHwxNzY0MDAzNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <EpisodeHeader title="Emotion Check-In" onBack={onBack} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-between px-6 py-8">
          {/* Character Display */}
          <motion.div
            className="relative w-full max-w-md h-64 flex items-end justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CharacterIllustration
              emotion={selectedEmotion || 'neutral'}
              characterType={characterType}
            />
          </motion.div>

          {/* Question */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-white text-2xl font-semibold mb-2 drop-shadow-lg">
              {question}
            </h2>
            <p className="text-white/80 text-sm drop-shadow">
              Select the emotion that best matches how you're feeling
            </p>
          </motion.div>

          {/* Emotion Grid */}
          <div className="w-full max-w-2xl mb-8">
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {EMOTIONS.map((emotion, index) => (
                <motion.div
                  key={emotion.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <EmotionIcon
                    emotion={emotion.label}
                    icon={emotion.icon}
                    selected={selectedEmotion === emotion.value}
                    onClick={() => handleEmotionClick(emotion.value)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Confirm Button */}
          {selectedEmotion && (
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ChoiceButton
                text={`Continue with ${EMOTIONS.find(e => e.value === selectedEmotion)?.label}`}
                icon="→"
                onClick={handleConfirm}
                color="purple"
              />
            </motion.div>
          )}
        </div>
      </div>
    </EpisodeScreen>
  );
}
