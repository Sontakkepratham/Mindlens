import { Button } from './ui/button';
import { Card } from './ui/card';
import { Brain, FileText, Camera, Sparkles, MoreVertical, User, Info, MessageCircle, FileText as ReportIcon } from 'lucide-react';
import React from 'react';

interface OnboardingScreenProps {
  onStart: () => void;
  onStartPersonalityTest?: () => void;
  onStartStroopTest?: () => void;
  onViewProfile?: () => void;
  onViewAboutUs?: () => void;
  onViewConnectWithUs?: () => void;
  onViewDetailedReport?: () => void;
}

export function OnboardingScreen({ 
  onStart, 
  onStartPersonalityTest, 
  onStartStroopTest,
  onViewProfile,
  onViewAboutUs,
  onViewConnectWithUs,
  onViewDetailedReport
}: OnboardingScreenProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleDropdownItemClick = (action: () => void) => {
    setShowDropdown(false);
    action();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center relative">
      {/* Three-dot Menu */}
      <div className="absolute top-0 right-0" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Menu"
        >
          <MoreVertical className="w-6 h-6 text-slate-600" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
            {onViewProfile && (
              <button
                onClick={() => handleDropdownItemClick(onViewProfile)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
              >
                <User className="w-5 h-5 text-slate-600" />
                <span className="text-slate-900">Profile Dashboard</span>
              </button>
            )}
            {onViewDetailedReport && (
              <button
                onClick={() => handleDropdownItemClick(onViewDetailedReport)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
              >
                <ReportIcon className="w-5 h-5 text-slate-600" />
                <span className="text-slate-900">View Detailed Report</span>
              </button>
            )}
            <div className="border-t border-slate-200 my-2"></div>
            {onViewAboutUs && (
              <button
                onClick={() => handleDropdownItemClick(onViewAboutUs)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
              >
                <Info className="w-5 h-5 text-slate-600" />
                <span className="text-slate-900">About Us</span>
              </button>
            )}
            {onViewConnectWithUs && (
              <button
                onClick={() => handleDropdownItemClick(onViewConnectWithUs)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
              >
                <MessageCircle className="w-5 h-5 text-slate-600" />
                <span className="text-slate-900">Connect With Us</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="mb-3">
          <h1 className="text-cyan-600 mb-2">MindLens</h1>
        </div>
        <p className="text-slate-600 max-w-xs mx-auto">
          AI-powered mental health screening combining questionnaires and facial emotion analysis.
        </p>
      </div>

      <div className="w-full max-w-xs mb-8 space-y-3">
        <Card className="bg-white border-slate-200 p-4">
          <div className="flex items-start gap-3 text-left">
            <FileText className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-slate-900 text-sm mb-1">PHQ-9 Questionnaire</h3>
              <p className="text-xs text-slate-600">Clinical depression screening</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-4">
          <div className="flex items-start gap-3 text-left">
            <Camera className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-slate-900 text-sm mb-1">Facial Emotion Analysis</h3>
              <p className="text-xs text-slate-600">AI-powered expression detection</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-4">
          <div className="flex items-start gap-3 text-left">
            <Brain className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-slate-900 text-sm mb-1">ML-Powered Insights</h3>
              <p className="text-xs text-slate-600">Comprehensive risk assessment</p>
            </div>
          </div>
        </Card>

        {onStartPersonalityTest && (
          <Card className="bg-white border-slate-200 p-4">
            <div className="flex items-start gap-3 text-left">
              <Sparkles className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-slate-900 text-sm mb-1">Personality Test</h3>
                <p className="text-xs text-slate-600">Discover your personality traits</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Button 
        onClick={onStart}
        className="w-full max-w-xs bg-cyan-600 hover:bg-cyan-700 text-white mb-4"
      >
        Start Assessment
      </Button>

      {onStartPersonalityTest && (
        <div className="w-full max-w-xs">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-50 text-slate-500">OR</span>
            </div>
          </div>
          
          <button
            onClick={onStartPersonalityTest}
            className="w-full mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-600 group-hover:animate-pulse" />
              <span className="text-slate-900">Want to know your personality?</span>
            </div>
            <p className="text-sm text-purple-700">Take a free test</p>
          </button>

          {onStartStroopTest && (
            <button
              onClick={onStartStroopTest}
              className="w-full mt-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Brain className="w-5 h-5 text-blue-600 group-hover:animate-pulse" />
                <span className="text-slate-900">Emotional Stroop Test</span>
              </div>
              <p className="text-sm text-blue-700">Measure emotional interference</p>
            </button>
          )}
        </div>
      )}
    </div>
  );
}