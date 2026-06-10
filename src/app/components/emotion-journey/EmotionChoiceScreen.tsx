import { motion } from 'motion/react';
import { EmotionType, StoryScene } from './EmotionJourneyQuest';
import { EpisodeScreen, EpisodeHeader, ChoiceButton } from './EpisodeUI';
import { CharacterIllustration } from './CharacterIllustration';

interface EmotionChoiceScreenProps {
  scene: StoryScene;
  onSelect: (emotion: EmotionType) => void;
  onBack: () => void;
}

const EMOTION_OPTIONS: Array<{
  value: EmotionType;
  label: string;
  icon: string;
  color: 'purple' | 'pink' | 'blue' | 'green' | 'orange';
}> = [
  { value: 'happy', label: 'Happy', icon: '😊', color: 'green' },
  { value: 'sad', label: 'Sad', icon: '😢', color: 'blue' },
  { value: 'angry', label: 'Angry', icon: '😠', color: 'orange' },
  { value: 'worried', label: 'Worried', icon: '😰', color: 'orange' },
  { value: 'confused', label: 'Confused', icon: '😕', color: 'purple' },
  { value: 'neutral', label: 'Calm', icon: '😌', color: 'pink' },
];

export function EmotionChoiceScreen({ scene, onSelect, onBack }: EmotionChoiceScreenProps) {
  const getCharacterType = (characterImage: string): 'child' | 'teen' | 'adult' | 'senior' => {
    if (characterImage.includes('child')) return 'child';
    if (characterImage.includes('teen')) return 'teen';
    if (characterImage.includes('senior')) return 'senior';
    return 'adult';
  };

  return (
    <EpisodeScreen background="https://images.unsplash.com/photo-1759116119693-2ea4e37df07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBncmFkaWVudCUyMGNhbG18ZW58MXx8fHwxNzY0MDAzNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="min-h-screen flex flex-col">
        <EpisodeHeader 
          title="How does this make you feel?" 
          onBack={onBack}
        />

        {/* Character */}
        <div className="flex-1 flex flex-col items-center justify-between px-6 py-8">
          <motion.div
            className="relative w-full max-w-md h-64 flex items-end justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CharacterIllustration
              emotion="neutral"
              characterType={getCharacterType(scene.characterImage)}
            />
          </motion.div>

          {/* Question */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-white text-xl font-medium mb-2 drop-shadow-lg">
              {scene.emotionQuestion}
            </h2>
          </motion.div>

          {/* Emotion Choices */}
          <div className="w-full max-w-md space-y-3">
            {EMOTION_OPTIONS.map((option, index) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <ChoiceButton
                  text={option.label}
                  icon={option.icon}
                  color={option.color}
                  onClick={() => onSelect(option.value)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </EpisodeScreen>
  );
}