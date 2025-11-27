import { motion } from 'motion/react';
import { ReactionType, StoryScene, EmotionType } from './EmotionJourneyQuest';
import { EpisodeScreen, EpisodeHeader, ChoiceButton } from './EpisodeUI';

interface ReactionChoiceScreenProps {
  scene: StoryScene;
  selectedEmotion: EmotionType;
  onSelect: (reaction: ReactionType) => void;
  onBack: () => void;
}

const REACTION_OPTIONS: Array<{
  value: ReactionType;
  label: string;
  icon: string;
  color: 'purple' | 'pink' | 'blue' | 'green' | 'orange';
}> = [
  { value: 'talk', label: 'Talk About It', icon: '💬', color: 'blue' },
  { value: 'avoid', label: 'Avoid It', icon: '🚶', color: 'purple' },
  { value: 'confront', label: 'Face It Directly', icon: '💪', color: 'orange' },
  { value: 'seek-help', label: 'Ask for Help', icon: '🤝', color: 'green' },
];

export function ReactionChoiceScreen({ scene, selectedEmotion, onSelect, onBack }: ReactionChoiceScreenProps) {
  return (
    <EpisodeScreen background="https://images.unsplash.com/photo-1723324471072-7df0ffe08fa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwdGhlcmFweSUyMHJvb20lMjBwbGFudHN8ZW58MXx8fHwxNzY0MDAzNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="min-h-screen flex flex-col">
        <EpisodeHeader 
          title="What would you do?" 
          onBack={onBack}
        />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {/* Question */}
          <motion.div
            className="text-center mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white/90 backdrop-blur-md rounded-3xl px-8 py-6 shadow-2xl">
              <h2 className="text-slate-800 text-2xl font-medium mb-3">
                {scene.reactionQuestion}
              </h2>
              <p className="text-slate-600 text-sm">
                Choose the response that feels most natural to you
              </p>
            </div>
          </motion.div>

          {/* Reaction Choices */}
          <div className="w-full max-w-md space-y-4">
            {REACTION_OPTIONS.map((option, index) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
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