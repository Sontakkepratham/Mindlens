import { useState, useEffect } from 'react';
import { StoryScene, EmotionType } from './EmotionJourneyQuest';
import { CharacterIllustration } from './CharacterIllustration';
import { EpisodeScreen, EpisodeHeader, DialogueBubble } from './EpisodeUI';

interface StoryPanelScreenProps {
  scene: StoryScene;
  onContinue: () => void;
  onBack: () => void;
}

// Map scene backgrounds to real Unsplash images
const BACKGROUND_IMAGES: Record<string, string> = {
  'playground': 'https://images.unsplash.com/photo-1761928299635-14d606d1a7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBmbG93ZXJzJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'home': 'https://images.unsplash.com/photo-1641175932432-b2c593ea8f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwY296eSUyMHdhcm18ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'bedroom': 'https://images.unsplash.com/photo-1762199904138-d163fe89540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwYmVkcm9vbSUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NDAwMzU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'school': 'https://images.unsplash.com/photo-1631885661118-5107a6111772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBlbXB0eXxlbnwxfHx8fDE3NjQwMDM1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'living-room': 'https://images.unsplash.com/photo-1641175932432-b2c593ea8f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwY296eSUyMHdhcm18ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'garden': 'https://images.unsplash.com/photo-1761928299635-14d606d1a7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBmbG93ZXJzJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'therapy-room': 'https://images.unsplash.com/photo-1723324471072-7df0ffe08fa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwdGhlcmFweSUyMHJvb20lMjBwbGFudHN8ZW58MXx8fHwxNzY0MDAzNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
};

export function StoryPanelScreen({ scene, onContinue, onBack }: StoryPanelScreenProps) {
  const [showText, setShowText] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  // Typewriter effect for narration
  useEffect(() => {
    setShowText(false);
    setDisplayedText('');
    setTextIndex(0);

    const timer = setTimeout(() => {
      setShowText(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [scene.id]);

  useEffect(() => {
    if (showText && textIndex < scene.narration.length) {
      const timer = setTimeout(() => {
        setDisplayedText(scene.narration.slice(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [showText, textIndex, scene.narration]);

  const isTextComplete = displayedText.length === scene.narration.length;

  const skipTyping = () => {
    setDisplayedText(scene.narration);
    setTextIndex(scene.narration.length);
  };

  // Get character type from scene
  const getCharacterType = (characterImage: string): 'child' | 'teen' | 'adult' | 'senior' => {
    if (characterImage.includes('child')) return 'child';
    if (characterImage.includes('teen')) return 'teen';
    if (characterImage.includes('senior')) return 'senior';
    return 'adult';
  };

  // Get emotion from characterImage
  const getEmotionFromImage = (characterImage: string): EmotionType => {
    if (characterImage.includes('sad')) return 'sad';
    if (characterImage.includes('happy')) return 'happy';
    if (characterImage.includes('angry')) return 'angry';
    if (characterImage.includes('worried')) return 'worried';
    if (characterImage.includes('confused')) return 'confused';
    return 'neutral';
  };

  const backgroundImage = BACKGROUND_IMAGES[scene.background] || BACKGROUND_IMAGES['therapy-room'];
  const characterType = getCharacterType(scene.characterImage);
  const emotion = getEmotionFromImage(scene.characterImage);

  return (
    <EpisodeScreen background={backgroundImage}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <EpisodeHeader title={scene.title} onBack={onBack} />

        {/* Character Display Area */}
        <div className="flex-1 flex items-end justify-center pb-48 px-6">
          <div className="relative w-full max-w-lg" style={{ height: '400px' }}>
            <div className="absolute inset-0 flex items-end justify-center">
              <CharacterIllustration
                emotion={emotion}
                characterType={characterType}
              />
            </div>
          </div>
        </div>

        {/* Dialogue Area */}
        {showText && (
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
            <div className="max-w-3xl mx-auto">
              {!isTextComplete ? (
                <div onClick={skipTyping} className="cursor-pointer">
                  <DialogueBubble
                    text={displayedText}
                    characterName={scene.title.split(' ')[0]}
                    typing={true}
                    showContinue={false}
                  />
                </div>
              ) : (
                <div onClick={onContinue} className="cursor-pointer">
                  <DialogueBubble
                    text={displayedText}
                    characterName={scene.title.split(' ')[0]}
                    onContinue={onContinue}
                    showContinue={true}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </EpisodeScreen>
  );
}
