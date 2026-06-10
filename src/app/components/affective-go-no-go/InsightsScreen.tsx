import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, TrendingUp, Brain, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { TestResults } from './AffectiveGoNoGo';

interface InsightsScreenProps {
  results: TestResults;
  onBack: () => void;
  onReturnHome: () => void;
}

export function InsightsScreen({ results, onBack, onReturnHome }: InsightsScreenProps) {
  // Generate psychological insights based on results
  const generateInsights = () => {
    const insights: Array<{
      title: string;
      description: string;
      type: 'positive' | 'neutral' | 'attention';
      icon: any;
    }> = [];

    // Impulse Control Analysis
    if (results.noGoAccuracy >= 85) {
      insights.push({
        title: 'Strong Impulse Control',
        description: 'Your high NO-GO accuracy indicates good ability to inhibit responses when needed. This suggests strong executive function and impulse control.',
        type: 'positive',
        icon: CheckCircle
      });
    } else if (results.falseAlarms > 10) {
      insights.push({
        title: 'Impulse Control Opportunity',
        description: `You had ${results.falseAlarms} false alarms. This may indicate a tendency toward impulsive responding. Mindfulness practices can help strengthen response inhibition.`,
        type: 'attention',
        icon: AlertCircle
      });
    }

    // Attention & Focus
    if (results.goAccuracy >= 90) {
      insights.push({
        title: 'Excellent Attention',
        description: 'Your high GO accuracy shows strong sustained attention and ability to detect target stimuli. This indicates good cognitive focus.',
        type: 'positive',
        icon: Brain
      });
    } else if (results.missedGo > 5) {
      insights.push({
        title: 'Attention Variability',
        description: `You missed ${results.missedGo} target trials. This may suggest attention fluctuations or fatigue. Regular breaks and good sleep can help maintain focus.`,
        type: 'attention',
        icon: Activity
      });
    }

    // Reaction Speed
    if (results.avgReactionTime < 500) {
      insights.push({
        title: 'Quick Response Time',
        description: 'Your fast average reaction time indicates efficient cognitive processing and good alertness during the task.',
        type: 'positive',
        icon: TrendingUp
      });
    }

    // Emotional Bias
    if (results.positiveReactionAvg > 0 && results.negativeReactionAvg > 0) {
      if (Math.abs(results.emotionalBiasScore) > 15) {
        insights.push({
          title: 'Emotional Attention Bias',
          description: results.emotionalBiasScore > 0 
            ? 'You showed faster responses to negative emotions. This is common in anxiety and may indicate hypervigilance to threat. Cognitive behavioral techniques can help reframe this pattern.'
            : 'You showed faster responses to positive emotions. This positive attentional bias is associated with resilience and emotional well-being.',
          type: results.emotionalBiasScore > 0 ? 'attention' : 'positive',
          icon: Brain
        });
      } else {
        insights.push({
          title: 'Balanced Emotional Processing',
          description: 'Your similar reaction times to positive and negative emotions suggest balanced emotional attention, which is associated with psychological flexibility.',
          type: 'positive',
          icon: CheckCircle
        });
      }
    }

    // Overall Performance
    const avgAccuracy = (results.goAccuracy + results.noGoAccuracy) / 2;
    if (avgAccuracy >= 85) {
      insights.push({
        title: 'Overall Strong Performance',
        description: 'Your combined accuracy shows good cognitive control, attention, and response inhibition. These skills are important for emotional regulation and decision-making.',
        type: 'positive',
        icon: CheckCircle
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-slate-200">
        <div className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-slate-900">Detailed Insights</h1>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-slate-900">Your Cognitive Profile</h2>
          <p className="text-slate-600 text-sm">
            AI-powered analysis of your test performance
          </p>
        </div>

        {/* Insights Cards */}
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const colorClasses = {
              positive: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                titleColor: 'text-green-900'
              },
              attention: {
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                iconBg: 'bg-orange-100',
                iconColor: 'text-orange-600',
                titleColor: 'text-orange-900'
              },
              neutral: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                titleColor: 'text-blue-900'
              }
            };

            const colors = colorClasses[insight.type];

            return (
              <Card key={index} className={`${colors.border} ${colors.bg} shadow-sm`}>
                <div className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`${colors.titleColor} mb-2 text-sm`}>
                        {insight.title}
                      </h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Clinical Context */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="p-5 space-y-3">
            <h3 className="text-slate-900 text-sm">📊 Clinical Context</h3>
            <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <p>
                The Affective Go/No-Go task is used in psychological research to measure:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Response inhibition:</strong> Your ability to suppress inappropriate actions</li>
                <li>• <strong>Emotional bias:</strong> Attention patterns toward different emotions</li>
                <li>• <strong>Executive function:</strong> Cognitive control and decision-making</li>
              </ul>
              <p className="pt-2">
                Research shows that emotional attention biases can be associated with anxiety and depression. Regular monitoring can help track changes over time.
              </p>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="border-primary/30 bg-primary/5 shadow-sm">
          <div className="p-5 space-y-3">
            <h3 className="text-primary text-sm">💡 Recommended Next Steps</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>Complete the PHQ-9 assessment for comprehensive mental health screening</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>Try the Emotional Micro-Stories test to further explore emotional processing</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>Retake this test weekly to track changes in attention patterns</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">→</span>
                <span>If concerns persist, consider speaking with a mental health professional</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onReturnHome}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          >
            Return to Home
          </Button>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 border-slate-300 hover:bg-slate-50"
          >
            Back to Results
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Important:</strong> This assessment is for self-monitoring and educational purposes only. 
            It does not provide medical diagnosis or replace professional mental health evaluation. 
            If you're experiencing mental health concerns, please consult a licensed healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
