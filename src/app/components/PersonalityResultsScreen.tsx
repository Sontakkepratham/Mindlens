import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Brain, Heart, Users, Target, Shield } from 'lucide-react';
import type { PersonalityResults } from './PersonalityTestScreen';

interface PersonalityResultsScreenProps {
  results: PersonalityResults;
  onReturnHome: () => void;
  onRetakeTest: () => void;
}

export function PersonalityResultsScreen({ 
  results, 
  onReturnHome, 
  onRetakeTest 
}: PersonalityResultsScreenProps) {
  
  const traits = [
    {
      key: 'openness' as keyof PersonalityResults,
      name: 'Openness',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Imagination, creativity, and openness to new experiences',
      high: 'You are imaginative, creative, and enjoy exploring new ideas. You\'re curious about the world and open to unconventional thinking.',
      low: 'You prefer practical, concrete thinking and familiar routines. You value tradition and consistency in your approach to life.'
    },
    {
      key: 'conscientiousness' as keyof PersonalityResults,
      name: 'Conscientiousness',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Organization, responsibility, and goal-oriented behavior',
      high: 'You are organized, reliable, and disciplined. You set goals and work systematically to achieve them, paying attention to details.',
      low: 'You are spontaneous and flexible, preferring to go with the flow. You may find rigid schedules constraining and enjoy improvising.'
    },
    {
      key: 'extraversion' as keyof PersonalityResults,
      name: 'Extraversion',
      icon: Users,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Sociability, assertiveness, and energy from social interaction',
      high: 'You are outgoing, energetic, and thrive in social situations. You enjoy being around people and tend to be talkative and assertive.',
      low: 'You are introspective and prefer quieter, more intimate settings. You recharge through alone time and prefer deep one-on-one conversations.'
    },
    {
      key: 'agreeableness' as keyof PersonalityResults,
      name: 'Agreeableness',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      description: 'Compassion, cooperation, and concern for others',
      high: 'You are compassionate, cooperative, and value harmony in relationships. You\'re naturally empathetic and enjoy helping others.',
      low: 'You are direct and value honesty over politeness. You\'re comfortable with conflict and prioritize logic over emotions in decisions.'
    },
    {
      key: 'neuroticism' as keyof PersonalityResults,
      name: 'Emotional Stability',
      icon: Shield,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      description: 'Emotional resilience and stress management',
      high: 'You may experience emotions intensely and be more sensitive to stress. You\'re in touch with your feelings and process experiences deeply.',
      low: 'You are emotionally stable and resilient. You handle stress well and tend to remain calm and composed in challenging situations.',
      inverted: true // Lower neuroticism = higher emotional stability
    }
  ];

  const getLevel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };

  const getInterpretation = (trait: typeof traits[0], score: number) => {
    const adjustedScore = trait.inverted ? 100 - score : score;
    return adjustedScore >= 50 ? trait.high : trait.low;
  };

  const getDominantTraits = () => {
    const sortedTraits = [...traits].sort((a, b) => {
      const scoreA = a.inverted ? 100 - results[a.key] : results[a.key];
      const scoreB = b.inverted ? 100 - results[b.key] : results[b.key];
      return scoreB - scoreA;
    });
    return sortedTraits.slice(0, 2);
  };

  const dominantTraits = getDominantTraits();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-slate-900">Your Personality Profile</h2>
        </div>
        <p className="text-slate-600 text-sm">
          Based on the Big Five personality model (OCEAN)
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
        
        {/* Dominant Traits Summary */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-5">
          <h3 className="text-purple-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Your Strongest Characteristics
          </h3>
          <div className="space-y-2">
            {dominantTraits.map((trait) => {
              const Icon = trait.icon;
              const score = trait.inverted ? 100 - results[trait.key] : results[trait.key];
              return (
                <div key={trait.key} className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${trait.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">{trait.name}</span>
                      <Badge className="bg-purple-600 text-white text-xs">
                        {Math.round(score)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Detailed Trait Breakdown */}
        <div className="space-y-3">
          <h3 className="text-slate-900 px-1">Detailed Personality Breakdown</h3>
          
          {traits.map((trait) => {
            const Icon = trait.icon;
            const rawScore = results[trait.key];
            const displayScore = trait.inverted ? 100 - rawScore : rawScore;
            const level = getLevel(displayScore);
            const interpretation = getInterpretation(trait, rawScore);

            return (
              <Card key={trait.key} className={`${trait.borderColor} border-2 bg-white`}>
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${trait.bgColor}`}>
                      <Icon className={`w-5 h-5 ${trait.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-slate-900">{trait.name}</h4>
                        <Badge 
                          className={
                            level === 'High' 
                              ? 'bg-purple-600 text-white' 
                              : level === 'Moderate'
                              ? 'bg-slate-500 text-white'
                              : 'bg-slate-400 text-white'
                          }
                        >
                          {level}
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{trait.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${trait.color.replace('text-', 'bg-')}`}
                            style={{ width: `${displayScore}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>0%</span>
                          <span className="font-medium text-slate-700">{Math.round(displayScore)}%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Interpretation */}
                      <div className={`${trait.bgColor} rounded-lg p-3`}>
                        <p className="text-slate-700 text-sm">{interpretation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Insights & Recommendations */}
        <Card className="border-cyan-200 bg-cyan-50 p-5">
          <h3 className="text-cyan-900 mb-3">💡 Insights for Mental Wellness</h3>
          <div className="space-y-2 text-sm text-cyan-800">
            <p>• <strong>Self-awareness:</strong> Understanding your personality helps you recognize your natural tendencies and stress triggers.</p>
            <p>• <strong>Relationship building:</strong> Knowing your characteristics can improve communication with others who may have different personalities.</p>
            <p>• <strong>Career choices:</strong> Your personality profile can guide you toward environments where you'll thrive.</p>
            <p>• <strong>Personal growth:</strong> All personality types have strengths. Focus on leveraging yours while being aware of potential challenges.</p>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="border-slate-200 bg-white p-4">
          <p className="text-slate-600 text-xs">
            <strong>Note:</strong> This personality assessment is for educational and self-reflection purposes only. 
            It is not a diagnostic tool and should not replace professional psychological evaluation. 
            Personality is complex and can evolve over time with experiences and personal growth.
          </p>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-slate-200 p-6 space-y-3">
        <Button
          onClick={onReturnHome}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Return to Home
        </Button>
        <Button
          onClick={onRetakeTest}
          variant="outline"
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          Retake Test
        </Button>
      </div>
    </div>
  );
}