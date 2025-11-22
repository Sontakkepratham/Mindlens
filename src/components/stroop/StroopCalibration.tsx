import React from 'react';

interface StroopCalibrationProps {
  onComplete: () => void;
}

export function StroopCalibration({ onComplete }: StroopCalibrationProps) {
  const [countdown, setCountdown] = React.useState(3);

  React.useEffect(() => {
    if (countdown === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onComplete]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center">
        {/* Countdown Circle */}
        <div className="mb-8 flex justify-center">
          <div className="w-40 h-40 bg-white rounded-full shadow-lg border-4 border-cyan-500 flex items-center justify-center">
            <span className="text-6xl text-slate-900">
              {countdown}
            </span>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-slate-900 mb-3">
          Get Ready
        </h2>
        <p className="text-slate-600 max-w-xs mx-auto">
          The test will begin in a moment. Focus on identifying the color of each word.
        </p>

        {/* Preview Example */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200 max-w-xs mx-auto">
          <p className="text-slate-500 text-sm mb-3">Preview:</p>
          <div className="text-center">
            <span className="text-4xl text-slate-400">
              READY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
