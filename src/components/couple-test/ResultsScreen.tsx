import { Heart, TrendingUp, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CoupleTestResults } from './CoupleTest';

interface ResultsScreenProps {
  results: CoupleTestResults;
  onViewDetailed: () => void;
  onRetake: () => void;
}

export function ResultsScreen({ results, onViewDetailed, onRetake }: ResultsScreenProps) {
  const { scores, strengths, growthAreas, partnerInfo } = results;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const getCompatibilityLevel = (score: number) => {
    if (score >= 85) return { label: 'Excellent', emoji: '🌟', color: 'text-green-600' };
    if (score >= 75) return { label: 'Very Good', emoji: '💚', color: 'text-green-600' };
    if (score >= 65) return { label: 'Good', emoji: '💛', color: 'text-amber-600' };
    if (score >= 50) return { label: 'Fair', emoji: '🧡', color: 'text-orange-600' };
    return { label: 'Needs Work', emoji: '❤️‍🩹', color: 'text-red-600' };
  };

  const compatibility = getCompatibilityLevel(scores.overallCompatibility);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h1 className="text-slate-900">Your Compatibility Results</h1>
              <p className="text-sm text-slate-600">
                {partnerInfo.yourName} & {partnerInfo.partnerName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Overall Compatibility Score */}
        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="p-8 text-center space-y-4">
            <div className="text-6xl mb-2">{compatibility.emoji}</div>
            <h2 className="text-slate-900">Overall Compatibility</h2>
            <div className={`text-6xl font-bold ${compatibility.color}`}>
              {scores.overallCompatibility}%
            </div>
            <p className={`text-xl font-medium ${compatibility.color}`}>
              {compatibility.label}
            </p>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Your relationship shows {compatibility.label.toLowerCase()} compatibility across communication, 
              emotional connection, trust, and shared values.
            </p>
          </div>
        </Card>

        {/* Category Scores */}
        <div className="space-y-4">
          <h3 className="text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Detailed Breakdown
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <ScoreCard
              title="Communication"
              score={scores.communication}
              description="How effectively you express and listen"
            />
            <ScoreCard
              title="Conflict Resolution"
              score={scores.conflictResolution}
              description="Handling disagreements constructively"
            />
            <ScoreCard
              title="Emotional Intimacy"
              score={scores.emotionalIntimacy}
              description="Depth of emotional connection"
            />
            <ScoreCard
              title="Trust & Security"
              score={scores.trustAndSecurity}
              description="Reliability and safety in the relationship"
            />
            <ScoreCard
              title="Shared Values"
              score={scores.sharedValues}
              description="Alignment on goals and priorities"
            />
            <ScoreCard
              title="Physical Affection"
              score={scores.physicalAffection}
              description="Intimacy and affection satisfaction"
            />
          </div>
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <Card className="border-2 border-green-200 bg-green-50">
            <div className="p-6 space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Your Relationship Strengths
              </h3>
              <div className="grid gap-3">
                {strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white rounded-lg p-4 border border-green-200"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-slate-700 font-medium">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Growth Areas */}
        {growthAreas.length > 0 && (
          <Card className="border-2 border-amber-200 bg-amber-50">
            <div className="p-6 space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Areas for Growth
              </h3>
              <p className="text-sm text-slate-700">
                These areas scored lower and represent opportunities to strengthen your relationship.
              </p>
              <div className="grid gap-3">
                {growthAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white rounded-lg p-4 border border-amber-200"
                  >
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-slate-700 font-medium">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Recommendations */}
        {results.recommendations.length > 0 && (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <div className="p-6 space-y-4">
              <h3 className="text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Personalized Recommendations
              </h3>
              <p className="text-sm text-slate-700">
                Based on your results, here are specific actions you can take to strengthen your relationship:
              </p>
              <div className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex gap-3 bg-white rounded-lg p-4 border border-primary/20"
                  >
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-slate-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Important Note */}
        <Card className="bg-slate-50 border-slate-200">
          <div className="p-6 space-y-2">
            <p className="text-slate-700">
              <span className="font-medium">💡 Remember:</span> No relationship is perfect. These results 
              are meant to provide insights and encourage growth, not to judge your relationship.
            </p>
            <p className="text-sm text-slate-600">
              Consider sharing and discussing these results with {partnerInfo.partnerName}. 
              Open communication about your relationship is a strength in itself!
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onRetake}
            variant="outline"
            className="flex-1"
          >
            Retake Assessment
          </Button>
          <Button
            onClick={onViewDetailed}
            className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
          >
            Save & Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
}

function ScoreCard({ title, score, description }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-amber-100 border-amber-200';
    return 'bg-red-100 border-red-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-2 border-slate-200 hover:shadow-lg transition-shadow">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-slate-900 font-medium">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${getScoreBg(score)}`}>
            <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getProgressColor(score)} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
