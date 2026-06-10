import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ArrowLeft, TrendingUp, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { TestResults } from './AffectiveGoNoGo';

interface ResultsScreenProps {
  results: TestResults;
  onViewInsights: () => void;
  onRetry: () => void;
  onBack: () => void;
}

export function ResultsScreen({ results, onViewInsights, onRetry, onBack }: ResultsScreenProps) {
  const formatTime = (ms: number) => {
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceRating = () => {
    const avgAccuracy = (results.goAccuracy + results.noGoAccuracy) / 2;
    
    if (avgAccuracy >= 90) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (avgAccuracy >= 75) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (avgAccuracy >= 60) return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { label: 'Needs Practice', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  };

  const performance = getPerformanceRating();

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
          <h1 className="text-slate-900">Test Results</h1>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto space-y-6">
        {/* Completion Badge */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
          <div className="p-6 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-green-900">Test Complete!</h2>
              <p className="text-green-700 text-sm">You've completed all {results.totalTrials} trials</p>
            </div>
          </div>
        </Card>

        {/* Overall Performance */}
        <Card className={`border-slate-200 ${performance.bgColor} shadow-sm`}>
          <div className="p-5 text-center space-y-2">
            <p className="text-slate-600 text-sm">Overall Performance</p>
            <h3 className={`text-2xl ${performance.color}`}>{performance.label}</h3>
            <p className="text-slate-600 text-sm">
              {Math.round((results.goAccuracy + results.noGoAccuracy) / 2)}% Average Accuracy
            </p>
          </div>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Reaction Time */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <div className="p-4 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {formatTime(results.avgReactionTime)}
                </p>
                <p className="text-xs text-slate-600">Avg Reaction Time</p>
              </div>
            </div>
          </Card>

          {/* GO Accuracy */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <div className="p-4 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {Math.round(results.goAccuracy)}%
                </p>
                <p className="text-xs text-slate-600">GO Accuracy</p>
              </div>
            </div>
          </Card>

          {/* NO-GO Accuracy */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <div className="p-4 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-purple-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {Math.round(results.noGoAccuracy)}%
                </p>
                <p className="text-xs text-slate-600">NO-GO Accuracy</p>
              </div>
            </div>
          </Card>

          {/* False Alarms */}
          <Card className="border-slate-200 bg-white shadow-sm">
            <div className="p-4 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">
                  {results.falseAlarms}
                </p>
                <p className="text-xs text-slate-600">False Alarms</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <div className="p-5 space-y-4">
            <h3 className="text-slate-900">Detailed Metrics</h3>
            
            <div className="space-y-3">
              {/* Reaction Time Range */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Fastest Reaction</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatTime(results.fastestReaction)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Slowest Reaction</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatTime(results.slowestReaction)}
                </span>
              </div>

              {/* Trial Breakdown */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">GO Trials</span>
                <span className="text-sm font-semibold text-slate-900">
                  {results.goTrials} trials
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">NO-GO Trials</span>
                <span className="text-sm font-semibold text-slate-900">
                  {results.noGoTrials} trials
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Missed GO Trials</span>
                <span className="text-sm font-semibold text-slate-900">
                  {results.missedGo}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Emotional Bias Insight */}
        {results.positiveReactionAvg > 0 && results.negativeReactionAvg > 0 && (
          <Card className="border-blue-200 bg-blue-50 shadow-sm">
            <div className="p-5 space-y-2">
              <h4 className="text-blue-900 font-medium text-sm">💡 Emotional Response Pattern</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {results.emotionalBiasScore > 10 
                  ? 'You responded faster to negative emotions than positive ones. This may indicate heightened attention to negative stimuli.'
                  : results.emotionalBiasScore < -10
                  ? 'You responded faster to positive emotions than negative ones. This may indicate a positive attentional bias.'
                  : 'Your reaction times to positive and negative emotions were similar, indicating balanced emotional attention.'}
              </p>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onViewInsights}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          >
            View Detailed Insights
          </Button>

          <Button
            onClick={onRetry}
            variant="outline"
            className="w-full h-12 border-slate-300 hover:bg-slate-50"
          >
            Take Test Again
          </Button>
        </div>

        {/* Info Note */}
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          These results are saved to your profile and can be viewed in your assessment history.
        </p>
      </div>
    </div>
  );
}
