import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Send, MessageCircle, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import mindlensLogo from 'figma:asset/cd1d8896983c70c4f2f82063f4b34137a63890b4.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatScreenProps {
  onBack: () => void;
  onSignOut?: () => void;
}

export function AIChatScreen({ onBack, onSignOut }: AIChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [hasCrisisIndicator, setHasCrisisIndicator] = useState(false);
  const [authCheckDone, setAuthCheckDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('mindlens_access_token');
      
      // Check if token looks suspicious
      if (!accessToken) {
        setError('No authentication found. Please sign in to use the AI chat.');
        setAuthCheckDone(true);
        return;
      }
      
      // Check for the old "auto-signin" bug
      if (accessToken === 'auto-signin' || accessToken === 'pending') {
        setError('⚠️ Your session is invalid (detected old token format). Please click the refresh button in the top-right corner to sign out and sign in again.');
        setAuthCheckDone(true);
        return;
      }
      
      // JWT tokens should be fairly long (usually 200+ characters)
      if (accessToken.length < 100) {
        setError('⚠️ Your session token appears invalid. Please click the refresh button in the top-right corner to sign out and sign in again.');
        setAuthCheckDone(true);
        return;
      }
      
      console.log('✅ Auth check passed:', {
        hasToken: true,
        tokenLength: accessToken.length,
      });
      
      setAuthCheckDone(true);
    };
    
    checkAuth();
  }, []);

  // Show welcome message after auth check
  useEffect(() => {
    if (authCheckDone && !error) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: "Hello! I'm MindLens AI, your compassionate companion. I'm here to listen and support you. Feel free to share what's on your mind, and remember - you're not alone. How are you feeling today?",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [authCheckDone, error]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Store the message before clearing input
    const messageToSend = inputMessage.trim();

    const userMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString(),
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(undefined);

    try {
      // Get access token from localStorage
      const accessToken = localStorage.getItem('mindlens_access_token');
      
      console.log('🔍 Debug token info:', {
        hasToken: !!accessToken,
        tokenLength: accessToken?.length,
        tokenStart: accessToken?.substring(0, 30) + '...',
        userId: localStorage.getItem('mindlens_user_id'),
        userEmail: localStorage.getItem('mindlens_user_email'),
      });
      
      if (!accessToken) {
        throw new Error('Not authenticated. Please sign in again.');
      }

      console.log('🤖 Sending chat message to server...', {
        endpoint: `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/chat/send`,
        hasToken: !!accessToken,
        messageLength: messageToSend.length,
      });

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/chat/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: messageToSend,
            conversationId,
          }),
        }
      );

      console.log('📡 Server response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Server error response:', errorData);
        
        // Check for specific error types
        if (response.status === 401) {
          const authError = 'Authentication failed. Your session may have expired or be invalid. Please sign out and sign in again to refresh your session.';
          throw new Error(authError);
        } else if (errorData.error?.includes('exceeded your current quota') || errorData.error?.includes('Gemini API quota')) {
          // API quota exceeded
          const quotaError = '⚠️ API Quota Exceeded\n\nThe AI service has exceeded its usage quota. To resolve:\n\n1. For Gemini: Visit https://console.cloud.google.com/billing\n2. For OpenAI: Visit https://platform.openai.com/account/billing\n3. Add a payment method if not already added\n4. Check your usage limits and increase if needed\n5. Wait a few minutes and try again\n\nFor testing, you can use demo mode until billing is configured.';
          throw new Error(quotaError);
        } else if (errorData.error?.includes('Gemini API') || errorData.error?.includes('OpenAI API')) {
          // Other AI-specific errors
          throw new Error('AI Service Error: ' + errorData.error);
        } else if (errorData.error?.includes('API key')) {
          // API key configuration errors
          throw new Error('⚠️ Configuration Error: ' + errorData.error);
        }
        
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      console.log('✅ Chat response received:', {
        success: data.success,
        hasResponse: !!data.response,
        conversationId: data.conversationId,
        responsePreview: data.response?.substring(0, 100),
        debugInfo: data.debugInfo,
        modelUsed: data.modelUsed,
        fullData: data,
      });

      if (data.success) {
        const aiMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp,
        };

        // DEBUG: Show what Gemini actually returned
        if (data.debugInfo) {
          console.error('🐛 GEMINI DEBUG INFO:', data.debugInfo);
          
          let debugMessage = '🔍 DEBUG: Gemini Issue Detected\n\n';
          
          if (data.debugInfo.reason === 'SAFETY_FILTER') {
            debugMessage += '❌ **Safety Filter Blocked**\n\nGemini\'s safety filter blocked the response. This often happens with mental health topics.\n\n**Solution:** Enable Demo Mode to bypass Gemini:\n1. Set CHAT_DEMO_MODE=true\n2. Refresh the app\n3. Try again\n\nSafety Ratings:\n' + JSON.stringify(data.debugInfo.safetyRatings, null, 2);
          } else if (data.debugInfo.reason === 'NO_CANDIDATES') {
            debugMessage += '❌ **No Response Candidates**\n\nGemini returned no response candidates.\n\n**Possible Causes:**\n1. System prompt was blocked\n2. API regional restrictions\n3. Temporary API issue\n\n**Solution:** Enable Demo Mode:\nSet CHAT_DEMO_MODE=true\n\nFull Response:\n' + JSON.stringify(data.debugInfo.fullResponse, null, 2);
          } else if (data.debugInfo.reason === 'PROMPT_BLOCKED') {
            debugMessage += '❌ **Prompt Blocked**\n\nYour message was blocked: ' + data.debugInfo.promptFeedback?.blockReason + '\n\n**Solution:** Try a simpler message or enable Demo Mode';
          } else {
            debugMessage += '❌ **Unknown Issue**\n\nReason: ' + data.debugInfo.reason + '\nFinish Reason: ' + data.debugInfo.finishReason + '\n\n**Solution:** Enable Demo Mode:\nSet CHAT_DEMO_MODE=true';
          }
          
          const debugMsg: Message = {
            role: 'assistant',
            content: debugMessage,
            timestamp: new Date().toISOString(),
          };
          
          setMessages(prev => [...prev, aiMessage, debugMsg]);
        } else {
          setMessages(prev => [...prev, aiMessage]);
        }

        setConversationId(data.conversationId);
        
        if (data.hasCrisisIndicator) {
          setHasCrisisIndicator(true);
        }
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      
      // Remove the user message if send failed
      setMessages(prev => prev.slice(0, -1));
      setInputMessage(userMessage.content); // Restore the message in input
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
      <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={mindlensLogo} 
                alt="MindLens Logo" 
                className="w-10 h-10"
              />
              <div>
                <CardTitle className="text-foreground">MindLens AI Companion</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your supportive friend, always here to listen
                </CardDescription>
              </div>
            </div>
          </div>
          {onSignOut && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="hover:bg-accent"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Crisis Alert Banner */}
        {hasCrisisIndicator && (
          <Alert className="m-4 border-red-500/20 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Emergency Resources Available 24/7:</strong>
              <div className="mt-2 space-y-1 text-sm">
                <div>• Suicide & Crisis Lifeline: <strong>988</strong></div>
                <div>• Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></div>
                <div>• Emergency Services: <strong>911</strong></div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="m-4 border-destructive/20 bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="h-[500px] overflow-y-auto p-4 space-y-4 bg-background"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-card-foreground border border-border shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card text-card-foreground border border-border shadow-sm rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-muted-foreground">MindLens AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              disabled={isLoading}
              className="flex-1 border-border focus:border-primary focus:ring-primary"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Note:</strong> MindLens AI provides emotional support but is not a substitute for professional therapy. 
            For emergencies, please call 988 or 911.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}