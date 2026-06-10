import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Save, Key, Check, AlertCircle, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SecretSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecretSettingsDialog({ isOpen, onClose }: SecretSettingsDialogProps) {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<any>(null);

  // Load current settings when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadCurrentSettings();
    }
  }, [isOpen]);

  const loadCurrentSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/admin/settings`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentStatus(data);
        setDemoMode(data.demoMode || false);
      } else {
        throw new Error(data.error || 'Failed to load settings');
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/admin/settings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            geminiApiKey: geminiApiKey || undefined,
            demoMode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess(true);
      setGeminiApiKey(''); // Clear input for security
      
      // Reload settings to show updated status
      setTimeout(() => {
        loadCurrentSettings();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const testApiKey = async () => {
    if (!geminiApiKey) {
      setError('Please enter an API key to test');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/admin/test-api-key`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: geminiApiKey,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API key test failed');
      }

      setSuccess(true);
      setError(null);
    } catch (err: any) {
      console.error('API key test failed:', err);
      setError(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg border-primary/20 shadow-2xl">
        <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>🔐 Developer Settings</CardTitle>
                <CardDescription>Configure API keys and demo mode</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading settings...</span>
            </div>
          ) : (
            <>
              {/* Current Status */}
              {currentStatus && (
                <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                  <h4 className="text-sm text-primary mb-2">Current Status</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Demo Mode:</span>
                      <span className={currentStatus.demoMode ? 'text-primary' : 'text-muted-foreground'}>
                        {currentStatus.demoMode ? '✓ Enabled' : '✗ Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Gemini API:</span>
                      <span className={currentStatus.hasGeminiKey ? 'text-primary' : 'text-muted-foreground'}>
                        {currentStatus.hasGeminiKey ? '✓ Configured' : '✗ Not Set'}
                      </span>
                    </div>
                    {currentStatus.mode && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                        <span className="font-medium">Active Mode:</span>
                        <span className="text-primary font-semibold">{currentStatus.mode}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Gemini API Key */}
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-foreground">
                  Google Gemini API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIza..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Get a free API key from{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Google AI Studio
                  </a>
                </p>
                
                {geminiApiKey && (
                  <Button
                    onClick={testApiKey}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing API Key...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Test API Key
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Demo Mode Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="demoMode" className="text-foreground">
                      Demo Mode
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use simulated AI responses instead of real API
                    </p>
                  </div>
                  <button
                    id="demoMode"
                    onClick={() => setDemoMode(!demoMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      demoMode ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        demoMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Settings saved successfully!</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Save Button */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={saveSettings}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  disabled={saving}
                >
                  Close
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-accent/20 border border-primary/20 rounded-lg p-4 text-xs space-y-2">
                <p className="text-primary">💡 <strong>Quick Tips:</strong></p>
                <ul className="space-y-1 text-muted-foreground ml-4">
                  <li>• Access this dialog with <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+Shift+K</kbd></li>
                  <li>• Click the logo 5 times quickly to open</li>
                  <li>• Demo mode bypasses all API calls</li>
                  <li>• API key is stored securely in environment</li>
                  <li>• Refresh the app after saving for changes to take effect</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}