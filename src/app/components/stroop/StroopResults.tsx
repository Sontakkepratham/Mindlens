import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface TrialResult {
  word: string;
  color: string;
  selectedColor: string;
  isCorrect: boolean;
  reactionTime: number;
  isEmotional: boolean;
}

interface StroopResultsProps {
  results: TrialResult[];
  onSaveResult: () => void;
  onViewInsights: () => void;
}

export function StroopResults({ results, onSaveResult, onViewInsights }: StroopResultsProps) {
  // Calculate metrics
  const totalTrials = results.length;
  const correctTrials = results.filter(r => r.isCorrect).length;
  const errorRate = ((totalTrials - correctTrials) / totalTrials * 100).toFixed(1);
  
  const avgReactionTime = (results.reduce((sum, r) => sum + r.reactionTime, 0) / totalTrials).toFixed(0);
  
  const emotionalTrials = results.filter(r => r.isEmotional && r.isCorrect);
  const neutralTrials = results.filter(r => !r.isEmotional && r.isCorrect);
  
  const avgEmotionalRT = emotionalTrials.length > 0
    ? (emotionalTrials.reduce((sum, r) => sum + r.reactionTime, 0) / emotionalTrials.length).toFixed(0)
    : '0';
  
  const avgNeutralRT = neutralTrials.length > 0
    ? (neutralTrials.reduce((sum, r) => sum + r.reactionTime, 0) / neutralTrials.length).toFixed(0)
    : '0';
  
  const negativeBias = (Number(avgEmotionalRT) - Number(avgNeutralRT)).toFixed(0);

  // Prepare chart data
  const chartData = [
    { name: 'Neutral', time: Number(avgNeutralRT) },
    { name: 'Emotional', time: Number(avgEmotionalRT) }
  ];

  // Reaction time trend (grouped by 10 trials)
  const trendData = [];
  const groupSize = 10;
  for (let i = 0; i < results.length; i += groupSize) {
    const group = results.slice(i, i + groupSize).filter(r => r.isCorrect);
    if (group.length > 0) {
      const avgRT = group.reduce((sum, r) => sum + r.reactionTime, 0) / group.length;
      trendData.push({
        trial: `${i + 1}-${Math.min(i + groupSize, results.length)}`,
        reactionTime: Math.round(avgRT)
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-slate-900 mb-2">
            Test Complete
          </h1>
          <p className="text-slate-600">
            Here are your results
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-slate-600 mb-2">
              Avg Reaction Time
            </div>
            <div className="text-3xl text-slate-900">
              {avgReactionTime}<span className="text-lg text-slate-600">ms</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-slate-600 mb-2">
              Error Rate
            </div>
            <div className="text-3xl text-slate-900">
              {errorRate}<span className="text-lg text-slate-600">%</span>
            </div>
          </div>
        </div>

        {/* Negative Bias Score */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-slate-900 mb-1">
                Emotional Interference
              </h3>
              <p className="text-slate-600 text-sm">
                Reaction time difference between emotional and neutral words
              </p>
            </div>
            <div className="text-3xl text-slate-900">
              {Number(negativeBias) > 0 ? '+' : ''}{negativeBias}<span className="text-lg text-slate-600">ms</span>
            </div>
          </div>
          
          {Number(negativeBias) > 50 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-900 text-sm">
                You showed slower responses to emotional words, which may indicate emotional interference.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-900 text-sm">
                You showed minimal interference from emotional content.
              </p>
            </div>
          )}
        </div>

        {/* Reaction Time Comparison Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4">
            Reaction Time by Word Type
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="time" fill="#06B6D4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4">
            Reaction Time Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="trial" stroke="#64748B" />
              <YAxis stroke="#64748B" label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="reactionTime" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4' }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-slate-600 text-sm mt-3">
            Your response speed over the course of the test
          </p>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6">
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
            <button
              onClick={onSaveResult}
              className="bg-white border-2 border-cyan-600 text-cyan-600 py-4 rounded-xl hover:bg-cyan-50 transition-colors"
            >
              Save Result
            </button>
            <button
              onClick={onViewInsights}
              className="bg-cyan-600 text-white py-4 rounded-xl hover:bg-cyan-700 transition-colors"
            >
              View Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
