import { Button } from './ui/button';
import { Card } from './ui/card';
import { Brain, FileText, Camera, Sparkles, MoreVertical, User, Info, MessageCircle, FileText as ReportIcon, Bot } from 'lucide-react';
import React from 'react';
import mindlensLogo from 'figma:asset/cd1d8896983c70c4f2f82063f4b34137a63890b4.png';

interface OnboardingScreenProps {
  onStart: () => void;
  onStartPersonalityTest?: () => void;
  onStartStroopTest?: () => void;
  onViewProfile?: () => void;
  onViewAboutUs?: () => void;
  onViewConnectWithUs?: () => void;
  onViewDetailedReport?: () => void;
  onStartAIChat?: () => void;
}

export function OnboardingScreen({ 
  onStart, 
  onStartPersonalityTest, 
  onStartStroopTest,
  onViewProfile,
  onViewAboutUs,
  onViewConnectWithUs,
  onViewDetailedReport,
  onStartAIChat
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center relative bg-background">
      {/* Three-dot Menu */}
      <div className="absolute top-0 right-0" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          aria-label="Menu"
        >
          <MoreVertical className="w-6 h-6 text-muted-foreground" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
            {onViewProfile && (
              <button
                onClick={() => handleDropdownItemClick(onViewProfile)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
              >
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Profile Dashboard</span>
              </button>
            )}
            {onViewDetailedReport && (
              <button
                onClick={() => handleDropdownItemClick(onViewDetailedReport)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
              >
                <ReportIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">View Detailed Report</span>
              </button>
            )}
            <div className="border-t border-border my-2"></div>
            {onViewAboutUs && (
              <button
                onClick={() => handleDropdownItemClick(onViewAboutUs)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
              >
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">About Us</span>
              </button>
            )}
            {onViewConnectWithUs && (
              <button
                onClick={() => handleDropdownItemClick(onViewConnectWithUs)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
              >
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Connect With Us</span>
              </button>
            )}
            {onStartAIChat && (
              <button
                onClick={() => handleDropdownItemClick(onStartAIChat)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
              >
                <Bot className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">Start AI Chat</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Logo & Title */}
      <div className="mb-8">
        <div className="mb-4 flex justify-center">
          <img 
            src={mindlensLogo} 
            alt="MindLens Logo" 
            className="w-40 h-40"
          />
        </div>
        <p className="text-muted-foreground max-w-xs mx-auto">
          AI-powered mental health screening combining questionnaires and facial emotion analysis.
        </p>
      </div>

      <div className="w-full max-w-xs mb-8 space-y-3">
        <Card className="bg-card border-border p-4 shadow-sm">
          <div className="flex items-start gap-3 text-left">
            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-foreground text-sm mb-1">PHQ-9 Questionnaire</h3>
              <p className="text-xs text-muted-foreground">Clinical depression screening</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 shadow-sm">
          <div className="flex items-start gap-3 text-left">
            <Camera className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-foreground text-sm mb-1">Facial Emotion Analysis</h3>
              <p className="text-xs text-muted-foreground">AI-powered expression detection</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 shadow-sm">
          <div className="flex items-start gap-3 text-left">
            <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-foreground text-sm mb-1">ML-Powered Insights</h3>
              <p className="text-xs text-muted-foreground">Comprehensive risk assessment</p>
            </div>
          </div>
        </Card>

        {onStartPersonalityTest && (
          <Card className="bg-card border-border p-4 shadow-sm">
            <div className="flex items-start gap-3 text-left">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-foreground text-sm mb-1">Personality Test</h3>
                <p className="text-xs text-muted-foreground">Discover your personality traits</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Button 
        onClick={onStart}
        className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground mb-4"
      >
        Start Assessment
      </Button>

      {onStartPersonalityTest && (
        <div className="w-full max-w-xs">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted-foreground">OR</span>
            </div>
          </div>
          
          <button
            onClick={onStartPersonalityTest}
            className="w-full mt-4 p-4 bg-secondary/50 border-2 border-secondary rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-secondary-foreground group-hover:animate-pulse" />
              <span className="text-foreground">Want to know your personality?</span>
            </div>
            <p className="text-sm text-secondary-foreground">Take a free test</p>
          </button>

          {onStartStroopTest && (
            <button
              onClick={onStartStroopTest}
              className="w-full mt-3 p-4 bg-accent/50 border-2 border-primary/30 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Brain className="w-5 h-5 text-primary group-hover:animate-pulse" />
                <span className="text-foreground">Emotional Stroop Test</span>
              </div>
              <p className="text-sm text-muted-foreground">Measure emotional interference</p>
            </button>
          )}

          {onStartAIChat && (
            <button
              onClick={onStartAIChat}
              className="w-full mt-3 p-4 bg-primary/10 border-2 border-primary/40 rounded-lg hover:shadow-md transition-all group hover:bg-primary/20"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Bot className="w-5 h-5 text-primary group-hover:animate-pulse" />
                <span className="text-foreground">Talk to MindLens AI</span>
              </div>
              <p className="text-sm text-primary">Your compassionate companion, always here to listen</p>
            </button>
          )}
        </div>
      )}
    </div>
  );
}