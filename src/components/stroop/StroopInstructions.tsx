import React from 'react';

interface StroopInstructionsProps {
  onBegin: () => void;
}

export function StroopInstructions({ onBegin }: StroopInstructionsProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        {/* Title */}
        <h2 className="text-center text-slate-900 mb-8">
          How It Works
        </h2>

        {/* Instructions Steps */}
        <div className="space-y-6 mb-8">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700">
              1
            </div>
            <div>
              <h3 className="text-slate-900 mb-1">
                Read the Word
              </h3>
              <p className="text-slate-600">
                A word will appear on the screen in a specific color
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700">
              2
            </div>
            <div>
              <h3 className="text-slate-900 mb-1">
                Identify the Color
              </h3>
              <p className="text-slate-600">
                Ignore what the word says and focus only on its color
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700">
              3
            </div>
            <div>
              <h3 className="text-slate-900 mb-1">
                Tap the Color
              </h3>
              <p className="text-slate-600">
                Select the matching color button as quickly as possible
              </p>
            </div>
          </div>
        </div>

        {/* Preview Example */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <p className="text-slate-600 text-center mb-4">
            Example:
          </p>
          <div className="text-center mb-4">
            <span className="text-5xl" style={{ color: '#3B82F6' }}>
              ANGER
            </span>
          </div>
          <p className="text-slate-600 text-center text-sm">
            The word says "ANGER" but it's shown in <span className="text-blue-600">blue</span>, so you would tap the blue button
          </p>
        </div>

        {/* Tips */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-8">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-cyan-900 mb-1">
                Tips for Best Results
              </p>
              <ul className="text-cyan-800 text-sm space-y-1">
                <li>• Find a quiet environment</li>
                <li>• Respond as quickly as possible</li>
                <li>• Focus on color, not meaning</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Begin Button */}
        <button
          onClick={onBegin}
          className="w-full bg-cyan-600 text-white py-4 rounded-xl hover:bg-cyan-700 transition-colors"
        >
          Begin Test
        </button>
      </div>
    </div>
  );
}
