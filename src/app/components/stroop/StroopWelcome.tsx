import React from 'react';

interface StroopWelcomeProps {
  onStart: (difficulty: 'easy' | 'standard' | 'advanced') => void;
}

export function StroopWelcome({ onStart }: StroopWelcomeProps) {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<'easy' | 'standard' | 'advanced'>('standard');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        {/* Icon/Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-slate-900 mb-2">
          Emotional Stroop Test
        </h1>
        
        {/* Subtitle */}
        <p className="text-center text-slate-600 mb-8">
          Measure your emotional reaction time and cognitive interference through color-word responses
        </p>

        {/* Difficulty Selector */}
        <div className="mb-8">
          <label className="block text-slate-700 mb-3">
            Select Difficulty
          </label>
          <div className="space-y-3">
            {[
              { value: 'easy', label: 'Easy', desc: '20 trials, neutral words' },
              { value: 'standard', label: 'Standard', desc: '40 trials, mixed words' },
              { value: 'advanced', label: 'Advanced', desc: '60 trials, emotional words' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDifficulty(option.value as any)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedDifficulty === option.value
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={selectedDifficulty === option.value ? 'text-cyan-900' : 'text-slate-900'}>
                  {option.label}
                </div>
                <div className="text-slate-600 text-sm mt-1">
                  {option.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart(selectedDifficulty)}
          className="w-full bg-cyan-600 text-white py-4 rounded-xl hover:bg-cyan-700 transition-colors"
        >
          Start Test
        </button>

        {/* Info Note */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Estimated time: {selectedDifficulty === 'easy' ? '2-3' : selectedDifficulty === 'standard' ? '4-5' : '6-7'} minutes
        </p>
      </div>
    </div>
  );
}
