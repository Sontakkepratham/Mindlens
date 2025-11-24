import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowLeft, 
  Brain, 
  Sparkles, 
  Beaker,
  Clock,
  Target,
  TrendingUp,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

interface MindLensLabProps {
  onBack: () => void;
  onStartAffectiveGoNoGo: () => void;
  onStartEmotionalStories: () => void;
  completedTests?: {
    affectiveGoNoGo: boolean;
    emotionalStories: boolean;
  };
}

export function MindLensLab({ 
  onBack, 
  onStartAffectiveGoNoGo, 
  onStartEmotionalStories,
  completedTests = { affectiveGoNoGo: false, emotionalStories: false }
}: MindLensLabProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const tests = [
    {
      id: 'affectiveGoNoGo',
      title: 'Affective Go/No-Go Test',
      subtitle: 'Measure emotional attention & impulse control',
      description: 'Test your response inhibition and emotional attentional bias by tapping for target emotions and resisting others.',
      icon: Brain,
      color: '#7B9FDB',
      duration: '3-5 min',
      difficulty: 'Moderate',
      metrics: ['Response Time', 'Impulse Control', 'Emotional Bias'],
      completed: completedTests.affectiveGoNoGo,
      onClick: onStartAffectiveGoNoGo
    },
    {
      id: 'stories',
      title: 'Emotional Micro-Stories',
      subtitle: 'Understand your emotional patterns',
      description: 'Explore how your mind reacts to real-life situations through short, relatable scenarios.',
      icon: Sparkles,
      color: '#D4D0F0',
      duration: '3-5 min',
      difficulty: 'Easy',
      metrics: ['Interpretation Bias', 'Emotional Range', 'Consistency'],
      completed: completedTests.emotionalStories,
      onClick: onStartEmotionalStories
    }
  ];

  const completedCount = Object.values(completedTests).filter(Boolean).length;
  const totalTests = Object.keys(completedTests).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-lg border-b border-border z-10 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          {/* Progress Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">
              {completedCount}/{totalTests} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Lab Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl mb-6"
          >
            <Beaker className="w-10 h-10 text-primary" />
          </motion.div>

          <h1 className="text-primary mb-3">MindLens Lab</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore your cognitive and emotional patterns through evidence-based psychology games
          </p>
        </motion.div>

        {/* Test Cards */}
        <div className="space-y-6 mb-12">
          {tests.map((test, index) => {
            const Icon = test.icon;
            const isHovered = hoveredCard === test.id;
            
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(test.id)}
                onHoverLeave={() => setHoveredCard(null)}
              >
                <Card 
                  className="relative overflow-hidden bg-card border-border hover:border-primary/40 transition-all duration-300 cursor-pointer group"
                  style={{
                    boxShadow: isHovered ? `0 10px 40px ${test.color}30` : 'none'
                  }}
                  onClick={test.onClick}
                >
                  {/* Completed Badge */}
                  {test.completed && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">Completed</span>
                      </div>
                    </div>
                  )}

                  {/* Background Gradient */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${test.color}05 0%, ${test.color}10 100%)`
                    }}
                  />

                  <div className="relative p-6">
                    <div className="flex gap-6">
                      {/* Icon Section */}
                      <div className="flex-shrink-0">
                        <motion.div
                          animate={{
                            scale: isHovered ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                          className="w-16 h-16 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow"
                          style={{
                            backgroundColor: `${test.color}20`
                          }}
                        >
                          <Icon 
                            className="w-8 h-8" 
                            style={{ color: test.color }}
                          />
                        </motion.div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1">
                        <div className="mb-3">
                          <h3 className="text-primary mb-1 group-hover:text-primary/80 transition-colors">
                            {test.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {test.subtitle}
                          </p>
                        </div>

                        <p className="text-sm text-foreground leading-relaxed mb-4">
                          {test.description}
                        </p>

                        {/* Meta Information */}
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{test.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="w-4 h-4" />
                            <span>{test.difficulty}</span>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">MEASURES</p>
                          <div className="flex flex-wrap gap-2">
                            {test.metrics.map((metric) => (
                              <span
                                key={metric}
                                className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            test.onClick();
                          }}
                          className="bg-primary hover:bg-primary/90 text-white group-hover:shadow-lg transition-all"
                        >
                          {test.completed ? 'Retake Test' : 'Start Test'}
                          <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/10 border-primary/20">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-primary mb-2">Why Take These Tests?</h3>
                <p className="text-sm text-foreground leading-relaxed mb-3">
                  These scientifically-designed assessments help you understand your cognitive patterns, 
                  emotional tendencies, and mental processing styles. Your results provide personalized 
                  insights and recommendations for mental wellness.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary flex-shrink-0 mt-0.5">✓</span>
                    <span>Evidence-based psychology assessments</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary flex-shrink-0 mt-0.5">✓</span>
                    <span>Personalized insights and recommendations</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary flex-shrink-0 mt-0.5">✓</span>
                    <span>Track your progress over time</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary flex-shrink-0 mt-0.5">✓</span>
                    <span>Completely private and confidential</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Coming Soon Section (Optional) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">COMING SOON</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-card/50 border-dashed border-border opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-foreground">N-Back Memory Test</p>
                  <p className="text-xs text-muted-foreground">Working memory assessment</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-card/50 border-dashed border-border opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-foreground">Cognitive Flexibility Test</p>
                  <p className="text-xs text-muted-foreground">Task switching ability</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}