import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrialResult {
  word: string;
  color: string;
  selectedColor: string;
  isCorrect: boolean;
  reactionTime: number;
  isEmotional: boolean;
}

interface StroopInsightsProps {
  results: TrialResult[];
  onContinue: () => void;
}

export function StroopInsights({ results, onContinue }: StroopInsightsProps) {
  // Calculate metrics for insights
  const correctTrials = results.filter(r => r.isCorrect);
  const avgReactionTime = correctTrials.reduce((sum, r) => sum + r.reactionTime, 0) / correctTrials.length;
  
  const emotionalTrials = results.filter(r => r.isEmotional && r.isCorrect);
  const avgEmotionalRT = emotionalTrials.length > 0
    ? emotionalTrials.reduce((sum, r) => sum + r.reactionTime, 0) / emotionalTrials.length
    : 0;
  
  const neutralTrials = results.filter(r => !r.isEmotional && r.isCorrect);
  const avgNeutralRT = neutralTrials.length > 0
    ? neutralTrials.reduce((sum, r) => sum + r.reactionTime, 0) / neutralTrials.length
    : 0;
  
  const errorRate = ((results.length - correctTrials.length) / results.length * 100);
  const negativeBias = avgEmotionalRT - avgNeutralRT;

  // Generate AI-style insights
  const generateInsights = () => {
    const insights = [];
    
    if (avgReactionTime < 800) {
      insights.push({
        type: 'positive',
        text: 'Your overall reaction time is excellent, indicating strong cognitive processing speed.'
      });
    } else if (avgReactionTime < 1200) {
      insights.push({
        type: 'neutral',
        text: 'Your reaction time is within normal range, showing typical cognitive processing.'
      });
    } else {
      insights.push({
        type: 'attention',
        text: 'Your reaction time suggests potential cognitive load. Consider factors like fatigue or stress.'
      });
    }
    
    if (negativeBias > 100) {
      insights.push({
        type: 'attention',
        text: 'Significant emotional interference detected. Emotional words slowed your response, which may indicate heightened emotional reactivity or attentional bias toward negative content.'
      });
    } else if (negativeBias > 50) {
      insights.push({
        type: 'neutral',
        text: 'Moderate emotional interference observed. This is common and suggests some emotional processing is affecting your cognitive performance.'
      });
    } else {
      insights.push({
        type: 'positive',
        text: 'Minimal emotional interference. You demonstrate good emotional regulation and cognitive control.'
      });
    }
    
    if (errorRate < 5) {
      insights.push({
        type: 'positive',
        text: 'Excellent accuracy! You maintained strong focus throughout the test.'
      });
    } else if (errorRate < 15) {
      insights.push({
        type: 'neutral',
        text: 'Good accuracy overall. A few errors are normal during rapid response tasks.'
      });
    } else {
      insights.push({
        type: 'attention',
        text: 'Higher error rate detected. This may indicate difficulty with sustained attention or impulse control.'
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  // Generate historical trend data (simulated for demo)
  const historicalData = [
    { session: 'Test 1', reactionTime: Math.round(avgReactionTime * 1.15), negativeBias: Math.round(negativeBias * 1.3) },
    { session: 'Test 2', reactionTime: Math.round(avgReactionTime * 1.08), negativeBias: Math.round(negativeBias * 1.1) },
    { session: 'Current', reactionTime: Math.round(avgReactionTime), negativeBias: Math.round(negativeBias) }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-slate-900 mb-2">
            AI-Powered Insights
          </h1>
          <p className="text-slate-600">
            Analysis of your emotional interference patterns
          </p>
        </div>

        {/* AI Summary Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-medium">Performance Summary</h2>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
              <span>Reaction Speed</span>
              <span className="font-medium">{avgReactionTime < 800 ? 'Excellent' : avgReactionTime < 1200 ? 'Good' : 'Moderate'}</span>
            </div>
            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
              <span>Emotional Control</span>
              <span className="font-medium">{negativeBias < 50 ? 'Strong' : negativeBias < 100 ? 'Moderate' : 'Developing'}</span>
            </div>
            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
              <span>Accuracy</span>
              <span className="font-medium">{errorRate < 5 ? 'Excellent' : errorRate < 15 ? 'Good' : 'Fair'}</span>
            </div>
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4">
            Key Findings
          </h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`flex gap-3 p-4 rounded-lg ${
                  insight.type === 'positive'
                    ? 'bg-green-50 border border-green-200'
                    : insight.type === 'attention'
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {insight.type === 'positive' ? (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : insight.type === 'attention' ? (
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p
                  className={
                    insight.type === 'positive'
                      ? 'text-green-900'
                      : insight.type === 'attention'
                      ? 'text-amber-900'
                      : 'text-blue-900'
                  }
                >
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4">
            Performance Trend
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            Your progress over multiple test sessions
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="session" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="reactionTime" 
                stroke="#06B6D4" 
                strokeWidth={2} 
                name="Reaction Time (ms)"
                dot={{ fill: '#06B6D4', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="negativeBias" 
                stroke="#8B5CF6" 
                strokeWidth={2} 
                name="Emotional Bias (ms)"
                dot={{ fill: '#8B5CF6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-slate-600">Reaction Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-slate-600">Emotional Bias</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4">
            Recommendations
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Consider retaking this test weekly to track emotional regulation over time</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Practice mindfulness exercises to improve emotional regulation</span>
            </li>
            <li className="flex gap-3">
              <svg className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Complete additional assessments in MindLens for comprehensive evaluation</span>
            </li>
          </ul>
        </div>

        {/* Continue Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={onContinue}
              className="w-full bg-cyan-600 text-white py-4 rounded-xl hover:bg-cyan-700 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
