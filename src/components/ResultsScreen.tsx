import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertTriangle, Heart } from 'lucide-react';

interface ResultsScreenProps {
  phqScore: number;
  onViewRecommendations: () => void;
  onViewSelfCare?: () => void;
}

export function ResultsScreen({ phqScore, onViewRecommendations, onViewSelfCare }: ResultsScreenProps) {
  // PHQ-9 severity levels
  const getSeverity = (score: number) => {
    if (score <= 4) return { level: 'Minimal', color: 'text-slate-700' };
    if (score <= 9) return { level: 'Mild', color: 'text-cyan-700' };
    if (score <= 14) return { level: 'Moderate', color: 'text-yellow-700' };
    if (score <= 19) return { level: 'Moderately Severe', color: 'text-orange-700' };
    return { level: 'Severe', color: 'text-red-700' };
  };

  const severity = getSeverity(phqScore);
  const hasRiskFlag = phqScore >= 10;

  // Mock emotion analysis data
  const emotionData = {
    primary: 'Neutral',
    secondary: 'Slight sadness detected',
    confidence: '82%',
  };

  return (
    <div className="flex flex-col min-h-[80vh] px-6 py-8">
      <div className="mb-6">
        <h2 className="text-slate-900 mb-2">Assessment Results</h2>
        <p className="text-slate-600">
          Your screening has been completed.
        </p>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        {/* PHQ-9 Score */}
        <Card className="border-slate-200 bg-white">
          <div className="p-6">
            <h3 className="text-slate-900 mb-4">PHQ-9 Score</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl text-slate-900">{phqScore}</span>
              <span className="text-slate-600">/ 27</span>
            </div>
            <p className={`${severity.color} mb-1`}>
              {severity.level}
            </p>
            <p className="text-slate-600">Depression Severity</p>
          </div>
        </Card>

        {/* Emotion Analysis */}
        <Card className="border-slate-200 bg-white">
          <div className="p-6">
            <h3 className="text-slate-900 mb-4">Emotion Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Primary Emotion</span>
                <span className="text-slate-900">{emotionData.primary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Secondary Markers</span>
                <span className="text-slate-900">{emotionData.secondary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Analysis Confidence</span>
                <span className="text-slate-900">{emotionData.confidence}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Risk Flag */}
        {hasRiskFlag && (
          <Card className="border-orange-200 bg-orange-50">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="text-orange-900 mb-1">Risk Flag Indicator</h3>
                  <p className="text-orange-800">
                    Your assessment indicates moderate to severe symptoms. Professional consultation is recommended.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-2">
        <Button
          onClick={onViewRecommendations}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          View Counselor Recommendations
        </Button>
        {onViewSelfCare && (
          <Button
            onClick={onViewSelfCare}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            View Self-Care Tips
          </Button>
        )}
      </div>
    </div>
  );
}