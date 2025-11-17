import { Button } from './ui/button';

interface OnboardingScreenProps {
  onStart: () => void;
}

export function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="mb-12">
        <div className="mb-3">
          <h1 className="text-cyan-600 mb-2">MindLens</h1>
        </div>
        <p className="text-slate-600 max-w-xs mx-auto">
          AI-assisted mental health check.
        </p>
      </div>

      <Button 
        onClick={onStart}
        className="w-full max-w-xs bg-cyan-600 hover:bg-cyan-700 text-white"
      >
        Start Assessment
      </Button>
    </div>
  );
}
