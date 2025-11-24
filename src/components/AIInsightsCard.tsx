import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AIInsightsCardProps {
  sessionId: string;
  accessToken: string;
}

export function AIInsightsCard({ sessionId, accessToken }: AIInsightsCardProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/ai-insights/assessment/${sessionId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate insights');
      }

      setInsights(data.insights);
      setExpanded(true);
      
      // Show demo mode message if present
      if (data.message && data.message.includes('Demo Mode')) {
        console.log('ℹ️', data.message);
      }
      
      // Check if insights are from demo mode
      if (data.insights?.demoMode) {
        setIsDemoMode(true);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to generate AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCachedInsights = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/ai-insights/assessment/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setInsights(data.insights);
      }
    } catch (err) {
      // Silently fail - insights haven't been generated yet
      console.log('No cached insights available');
    }
  };

  // Try to load cached insights on mount
  useState(() => {
    loadCachedInsights();
  });

  // Format the insights text with proper sections
  const formatInsights = (insightsData: any) => {
    // If it's a demo mode object, format it specially
    if (typeof insightsData === 'object' && insightsData.demoMode) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-primary mb-2">Overall Summary</h4>
            <p className="text-foreground leading-relaxed">{insightsData.summary}</p>
          </div>
          
          <div>
            <h4 className="text-primary mb-2">Key Findings</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              {insightsData.keyFindings.map((finding: string, idx: number) => (
                <li key={idx} className="ml-2">{finding}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-primary mb-2">Recommendations</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              {insightsData.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="ml-2">{rec}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-primary mb-2">Positive Aspects</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground">
              {insightsData.positiveAspects.map((aspect: string, idx: number) => (
                <li key={idx} className="ml-2">{aspect}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    
    // Otherwise, it's a text string from real Gemini API
    const text = typeof insightsData === 'string' ? insightsData : JSON.stringify(insightsData);
    
    // Split by headers (indicated by ** or numbered sections)
    const sections = text.split(/\n\n+/);
    
    return sections.map((section, idx) => {
      // Check if section is a header (starts with ** or number)
      const isHeader = section.match(/^\*\*(.+?)\*\*/) || section.match(/^(\d+\.\s+\*\*.+?\*\*)/);
      
      if (isHeader) {
        const headerText = section.replace(/\*\*/g, '');
        return (
          <div key={idx} className="mb-3">
            <h4 className="text-primary mb-2">{headerText}</h4>
          </div>
        );
      }
      
      // Regular paragraph or bullet list
      if (section.includes('•') || section.includes('-')) {
        const items = section.split(/\n/).filter(line => line.trim());
        return (
          <ul key={idx} className="list-disc list-inside space-y-1 mb-4 text-foreground">
            {items.map((item, i) => (
              <li key={i} className="ml-2">
                {item.replace(/^[•\-]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }
      
      return (
        <p key={idx} className="mb-4 text-foreground leading-relaxed">
          {section}
        </p>
      );
    });
  };

  if (!insights && !loading && !error) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10">
        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-foreground mb-1">AI-Powered Insights</h3>
              <p className="text-muted-foreground text-sm">
                Get a comprehensive, personalized analysis of your assessment using advanced AI.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-xs">✓</span>
              <span>Detailed analysis of your responses</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-xs">✓</span>
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-xs">✓</span>
              <span>Evidence-based self-care strategies</span>
            </div>
          </div>

          <Button
            onClick={generateInsights}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating insights...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Insights
              </>
            )}
          </Button>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/10">
        <div className="p-5">
          <h3 className="text-destructive mb-2">Unable to Generate Insights</h3>
          <p className="text-destructive/80 text-sm mb-3">{error}</p>
          <Button
            onClick={generateInsights}
            variant="outline"
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
            disabled={loading}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (insights) {
    return (
      <Card className="border-border bg-card">
        <div className="p-5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between mb-3 text-left"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground">AI-Powered Insights</h3>
                  {isDemoMode && (
                    <span className="px-2 py-0.5 text-xs bg-accent/30 text-primary rounded-full border border-primary/20">
                      Demo Mode
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">Comprehensive assessment analysis</p>
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="prose prose-sm max-w-none">
                {formatInsights(insights)}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  <strong>Disclaimer:</strong> These insights are generated by AI and are for informational purposes only. 
                  They do not replace professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return null;
}