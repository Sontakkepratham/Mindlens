import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowLeft, 
  Play, 
  HelpCircle, 
  Heart, 
  Frown, 
  Meh, 
  Smile,
  AlertCircle,
  TrendingUp,
  Save,
  Sparkles
} from 'lucide-react';

// Types
interface MicroStory {
  id: number;
  text: string;
  category: 'social' | 'work' | 'personal' | 'relationship';
}

interface EmotionOption {
  label: string;
  value: string;
  color: string;
  icon: any;
}

interface StoryResponse {
  storyId: number;
  emotion: string;
  timeSpent: number;
}

interface GameResults {
  dominantEmotion: string;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  emotionalBias: 'positive' | 'negative' | 'balanced';
  consistencyScore: number;
  responses: StoryResponse[];
}

type GameScreen = 'welcome' | 'instructions' | 'story' | 'transition' | 'results' | 'insights';

interface EmotionalMicroStoriesGameProps {
  onBack: () => void;
  userId?: string;
}

// Sample micro-stories
const MICRO_STORIES: MicroStory[] = [
  {
    id: 1,
    text: "Your friend hasn't replied to your text in 3 days. They usually respond quickly.",
    category: 'social'
  },
  {
    id: 2,
    text: "You overhear colleagues laughing in the break room. They stop when you walk in.",
    category: 'work'
  },
  {
    id: 3,
    text: "Your partner says 'We need to talk' but doesn't explain why.",
    category: 'relationship'
  },
  {
    id: 4,
    text: "You receive constructive feedback on a project you worked hard on.",
    category: 'work'
  },
  {
    id: 5,
    text: "Someone you admire doesn't follow you back on social media.",
    category: 'social'
  },
  {
    id: 6,
    text: "You notice a family member has been quieter than usual lately.",
    category: 'personal'
  },
  {
    id: 7,
    text: "Your boss schedules an unexpected one-on-one meeting for tomorrow.",
    category: 'work'
  },
  {
    id: 8,
    text: "You send a thoughtful message to someone. They react with just a thumbs up.",
    category: 'social'
  }
];

// Emotion options
const EMOTION_OPTIONS: EmotionOption[] = [
  { label: 'Happy', value: 'happy', color: '#86EFAC', icon: Smile },
  { label: 'Worried', value: 'worried', color: '#FDE047', icon: AlertCircle },
  { label: 'Annoyed', value: 'annoyed', color: '#FCA5A5', icon: Frown },
  { label: 'Neutral', value: 'neutral', color: '#D4D0F0', icon: Meh },
  { label: 'Hurt', value: 'hurt', color: '#F9A8D4', icon: Heart },
  { label: 'Confused', value: 'confused', color: '#A5B4FC', icon: HelpCircle }
];

export function EmotionalMicroStoriesGame({ onBack, userId }: EmotionalMicroStoriesGameProps) {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('welcome');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [responses, setResponses] = useState<StoryResponse[]>([]);
  const [storyStartTime, setStoryStartTime] = useState<number>(0);
  const [countdown, setCountdown] = useState(3);
  const [results, setResults] = useState<GameResults | null>(null);

  // Start timer when story screen loads
  useEffect(() => {
    if (currentScreen === 'story') {
      setStoryStartTime(Date.now());
    }
  }, [currentScreen, currentStoryIndex]);

  // Countdown timer for transition screen
  useEffect(() => {
    if (currentScreen === 'transition') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Move to next story or results
        if (currentStoryIndex < MICRO_STORIES.length - 1) {
          setCurrentStoryIndex(currentStoryIndex + 1);
          setCurrentScreen('story');
          setCountdown(3);
        } else {
          calculateResults();
          setCurrentScreen('results');
        }
      }
    }
  }, [currentScreen, countdown, currentStoryIndex]);

  const handleEmotionSelect = (emotion: string) => {
    const timeSpent = Date.now() - storyStartTime;
    
    const newResponse: StoryResponse = {
      storyId: MICRO_STORIES[currentStoryIndex].id,
      emotion,
      timeSpent
    };

    setResponses([...responses, newResponse]);
    setCurrentScreen('transition');
  };

  const calculateResults = () => {
    const emotionCounts: Record<string, number> = {};
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    responses.forEach(response => {
      // Count emotions
      emotionCounts[response.emotion] = (emotionCounts[response.emotion] || 0) + 1;

      // Categorize as positive, negative, or neutral
      if (['happy'].includes(response.emotion)) {
        positiveCount++;
      } else if (['worried', 'annoyed', 'hurt'].includes(response.emotion)) {
        negativeCount++;
      } else {
        neutralCount++;
      }
    });

    // Find dominant emotion
    const dominantEmotion = Object.entries(emotionCounts).reduce((a, b) => 
      b[1] > a[1] ? b : a
    )[0];

    // Calculate emotional bias
    let emotionalBias: 'positive' | 'negative' | 'balanced';
    if (negativeCount > positiveCount + 2) {
      emotionalBias = 'negative';
    } else if (positiveCount > negativeCount + 2) {
      emotionalBias = 'positive';
    } else {
      emotionalBias = 'balanced';
    }

    // Calculate consistency (how varied the responses were)
    const uniqueEmotions = Object.keys(emotionCounts).length;
    const consistencyScore = Math.round((1 - (uniqueEmotions / EMOTION_OPTIONS.length)) * 100);

    const gameResults: GameResults = {
      dominantEmotion,
      positiveCount,
      negativeCount,
      neutralCount,
      emotionalBias,
      consistencyScore,
      responses
    };

    setResults(gameResults);
  };

  const resetGame = () => {
    setCurrentScreen('welcome');
    setCurrentStoryIndex(0);
    setResponses([]);
    setResults(null);
    setCountdown(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-lg border-b border-border z-10 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          {currentScreen === 'story' && (
            <div className="text-sm text-muted-foreground">
              {currentStoryIndex + 1} / {MICRO_STORIES.length}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentScreen === 'welcome' && (
            <WelcomeScreen
              onStart={() => setCurrentScreen('instructions')}
              onHowItWorks={() => setCurrentScreen('instructions')}
            />
          )}

          {currentScreen === 'instructions' && (
            <InstructionsScreen
              onBegin={() => setCurrentScreen('story')}
            />
          )}

          {currentScreen === 'story' && (
            <StoryDisplayScreen
              story={MICRO_STORIES[currentStoryIndex]}
              onEmotionSelect={handleEmotionSelect}
              progress={(currentStoryIndex / MICRO_STORIES.length) * 100}
            />
          )}

          {currentScreen === 'transition' && (
            <TransitionScreen countdown={countdown} />
          )}

          {currentScreen === 'results' && results && (
            <ResultsScreen
              results={results}
              onSaveResults={() => console.log('Save results')}
              onViewInsights={() => setCurrentScreen('insights')}
              onPlayAgain={resetGame}
            />
          )}

          {currentScreen === 'insights' && results && (
            <InsightsScreen
              results={results}
              onContinue={onBack}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Welcome Screen Component
function WelcomeScreen({ onStart, onHowItWorks }: { onStart: () => void; onHowItWorks: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Illustration */}
      <div className="flex justify-center py-8">
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-48 h-48 bg-gradient-to-br from-primary/20 via-accent/30 to-primary/20 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-24 h-24 text-primary" />
          </motion.div>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center space-y-4 px-4">
        <h1 className="text-primary">Emotional Micro-Stories</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Understand how your mind reacts to real situations through short, relatable scenarios.
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-4 px-4">
        <Button
          onClick={onStart}
          className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Game
        </Button>
        
        <button
          onClick={onHowItWorks}
          className="w-full text-primary hover:text-primary/80 text-sm py-2"
        >
          How it works
        </button>
      </div>
    </motion.div>
  );
}

// Instructions Screen Component
function InstructionsScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-primary mb-2">How to Play</h2>
        <p className="text-muted-foreground text-sm">Simple rules for meaningful insights</p>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <Card className="p-6 bg-card border-primary/10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              1
            </div>
            <div>
              <p className="text-foreground">
                You will read short <strong>3–5 second micro-stories</strong> based on real-life situations.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-primary/10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              2
            </div>
            <div>
              <p className="text-foreground">
                Choose the <strong>emotion you feel</strong> or the reaction you associate with the situation.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-primary/10">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              3
            </div>
            <div>
              <p className="text-foreground">
                There are <strong>no right or wrong answers</strong>. Be honest with yourself.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sample Story Card */}
      <div className="mt-8">
        <p className="text-xs text-muted-foreground text-center mb-4">SAMPLE STORY</p>
        <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/10 border-primary/20 relative overflow-hidden">
          <p className="text-foreground/60 italic text-center">
            "You receive a message that starts with 'Can we talk?'..."
          </p>
          
          <div className="mt-6 grid grid-cols-3 gap-2 opacity-40 blur-sm">
            <div className="h-10 bg-card rounded-lg"></div>
            <div className="h-10 bg-card rounded-lg"></div>
            <div className="h-10 bg-card rounded-lg"></div>
          </div>
        </Card>
      </div>

      {/* Begin Button */}
      <Button
        onClick={onBegin}
        className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg mt-8"
      >
        Begin
      </Button>
    </motion.div>
  );
}

// Story Display Screen Component (Core Game Screen)
function StoryDisplayScreen({ 
  story, 
  onEmotionSelect, 
  progress 
}: { 
  story: MicroStory; 
  onEmotionSelect: (emotion: string) => void;
  progress: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Progress Bar */}
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent"
        />
      </div>

      {/* Story Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-8 bg-card border-primary/10 shadow-xl min-h-[280px] flex items-center justify-center">
          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-4">
                {story.category.toUpperCase()}
              </span>
            </div>
            
            <p className="text-foreground text-lg leading-relaxed text-center">
              {story.text}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Emotion Options */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <p className="text-center text-sm text-muted-foreground mb-6">
          How does this make you feel?
        </p>

        <div className="grid grid-cols-2 gap-3">
          {EMOTION_OPTIONS.map((emotion, index) => {
            const Icon = emotion.icon;
            return (
              <motion.button
                key={emotion.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.05) }}
                onClick={() => onEmotionSelect(emotion.value)}
                className="group relative p-4 rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 active:scale-95"
                style={{
                  boxShadow: `0 0 0 0px ${emotion.color}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 20px 4px ${emotion.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 0px ${emotion.color}20`;
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${emotion.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: emotion.color }} />
                  </div>
                  <span className="text-sm text-foreground">{emotion.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Transition Screen Component
function TransitionScreen({ countdown }: { countdown: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-6xl text-primary mb-4"
        >
          {countdown}
        </motion.div>
        <p className="text-muted-foreground">Next story...</p>
      </div>
    </motion.div>
  );
}

// Results Screen Component
function ResultsScreen({ 
  results, 
  onSaveResults, 
  onViewInsights,
  onPlayAgain
}: { 
  results: GameResults;
  onSaveResults: () => void;
  onViewInsights: () => void;
  onPlayAgain: () => void;
}) {
  const biasPercentage = Math.round((results.negativeCount / results.responses.length) * 100);

  const getBiasMessage = () => {
    if (results.emotionalBias === 'negative') {
      return "You mostly leaned towards anxious or negative interpretations. This may indicate heightened emotional sensitivity or a tendency toward negative cognitive patterns.";
    } else if (results.emotionalBias === 'positive') {
      return "You demonstrated a positive interpretation bias. This suggests optimistic thinking patterns and resilience in ambiguous situations.";
    } else {
      return "Your responses show balanced emotional interpretation. You tend to consider multiple perspectives before forming emotional reactions.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-primary mb-2">Your Emotional Profile</h2>
        <p className="text-muted-foreground text-sm">Based on {results.responses.length} micro-stories</p>
      </div>

      {/* Metrics Cards */}
      <div className="space-y-4">
        {/* Dominant Emotion */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">DOMINANT EMOTION</p>
            <p className="text-2xl text-primary capitalize">{results.dominantEmotion}</p>
          </div>
        </Card>

        {/* Emotional Bias Chart */}
        <Card className="p-6 bg-card border-primary/10">
          <p className="text-sm text-muted-foreground mb-4">EMOTIONAL BIAS</p>
          
          <div className="space-y-3">
            {/* Positive */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Positive</span>
                <span className="text-muted-foreground">{results.positiveCount}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(results.positiveCount / results.responses.length) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-green-400"
                />
              </div>
            </div>

            {/* Negative */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Negative</span>
                <span className="text-muted-foreground">{results.negativeCount}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${biasPercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-red-400"
                />
              </div>
            </div>

            {/* Neutral */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Neutral</span>
                <span className="text-muted-foreground">{results.neutralCount}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(results.neutralCount / results.responses.length) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-full bg-purple-400"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Consistency Score */}
        <Card className="p-6 bg-card border-primary/10">
          <p className="text-sm text-muted-foreground mb-4">EMOTIONAL CONSISTENCY</p>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${results.consistencyScore}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </div>
            <span className="ml-4 text-2xl text-primary">{results.consistencyScore}%</span>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3">
            {results.consistencyScore > 60 ? 'High consistency in emotional responses' : 'Varied emotional responses across scenarios'}
          </p>
        </Card>
      </div>

      {/* Summary Message */}
      <Card className="p-6 bg-accent/10 border-primary/20">
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <p className="text-sm text-foreground leading-relaxed">
            {getBiasMessage()}
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={onViewInsights}
          className="w-full bg-primary hover:bg-primary/90 text-white h-12"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Insights
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onSaveResults}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Results
          </Button>

          <Button
            onClick={onPlayAgain}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
          >
            Play Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Insights Screen Component
function InsightsScreen({ 
  results, 
  onContinue 
}: { 
  results: GameResults;
  onContinue: () => void;
}) {
  const getInsightTitle = () => {
    if (results.emotionalBias === 'negative') {
      return "Cognitive Bias Detected";
    } else if (results.emotionalBias === 'positive') {
      return "Optimistic Thinking Pattern";
    } else {
      return "Balanced Perspective";
    }
  };

  const getInsightDescription = () => {
    if (results.emotionalBias === 'negative') {
      return "Your responses suggest a tendency toward negative interpretation bias, where ambiguous situations are more likely to be perceived as threatening or problematic. This is common in individuals experiencing anxiety or heightened stress.";
    } else if (results.emotionalBias === 'positive') {
      return "You demonstrate a positive interpretation bias, viewing ambiguous situations through an optimistic lens. This cognitive pattern is associated with resilience and emotional well-being.";
    } else {
      return "Your emotional responses show balanced thinking. You consider multiple interpretations before forming conclusions, which indicates cognitive flexibility and emotional intelligence.";
    }
  };

  const getRecommendations = () => {
    if (results.emotionalBias === 'negative') {
      return [
        "Practice cognitive reframing: When you notice a negative thought, ask 'What else could this mean?'",
        "Keep a thought diary to identify patterns in your interpretations",
        "Consider speaking with a mental health professional about CBT techniques",
        "Try the 3-3-3 rule: Name 3 things you see, 3 sounds you hear, 3 ways you can move"
      ];
    } else if (results.emotionalBias === 'positive') {
      return [
        "Continue practicing gratitude and positive reframing",
        "Share your optimistic perspective with others who may benefit",
        "Stay mindful of toxic positivity—allow yourself to feel all emotions",
        "Use your positive outlook to support friends in difficult times"
      ];
    } else {
      return [
        "Your balanced approach is a strength—continue cultivating it",
        "Practice mindfulness to maintain emotional equilibrium",
        "Help others develop balanced thinking through your example",
        "Explore emotional intelligence training to deepen your skills"
      ];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-primary mb-2">Clinical Insights</h2>
        <p className="text-muted-foreground text-sm">Understanding your emotional patterns</p>
      </div>

      {/* Main Insight Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/20">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-primary mb-2">{getInsightTitle()}</h3>
            <p className="text-sm text-foreground leading-relaxed">
              {getInsightDescription()}
            </p>
          </div>
        </div>
      </Card>

      {/* Trend Visualization */}
      <Card className="p-6 bg-card border-primary/10">
        <p className="text-sm text-muted-foreground mb-4">EMOTIONAL PATTERN</p>
        
        <div className="flex items-end justify-between h-32 gap-2">
          {results.responses.map((response, index) => {
            const isNegative = ['worried', 'annoyed', 'hurt'].includes(response.emotion);
            const isPositive = ['happy'].includes(response.emotion);
            const height = Math.random() * 60 + 40; // Simulated for visualization
            
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex-1 rounded-t-lg ${
                  isNegative ? 'bg-red-400/60' :
                  isPositive ? 'bg-green-400/60' :
                  'bg-purple-400/60'
                }`}
              />
            );
          })}
        </div>
        
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>Story 1</span>
          <span>Story {results.responses.length}</span>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 bg-card border-primary/10">
        <p className="text-sm text-muted-foreground mb-4">RECOMMENDED ACTIONS</p>
        
        <ul className="space-y-3">
          {getRecommendations().map((rec, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              className="flex gap-3 text-sm text-foreground"
            >
              <span className="text-primary flex-shrink-0">•</span>
              <span>{rec}</span>
            </motion.li>
          ))}
        </ul>
      </Card>

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        className="w-full bg-primary hover:bg-primary/90 text-white h-12 mt-6"
      >
        Continue to Mental Check-In
      </Button>
    </motion.div>
  );
}
