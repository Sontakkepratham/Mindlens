import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, AlertCircle, ExternalLink, X } from 'lucide-react';

interface SimpleSetupScreenProps {
  onContinue: () => void;
}

export function SimpleSetupScreen({ onContinue }: SimpleSetupScreenProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-slate-200 bg-white">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-xl">🧠</span>
              </div>
              <h2 className="text-slate-900">MindLens Setup</h2>
            </div>
            <button onClick={() => setDismissed(true)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status */}
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-green-900 mb-1">App is Ready to Use!</h3>
                <p className="text-green-800 text-sm">
                  All core features are working. You can start using MindLens right now.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-orange-900 mb-1">Optional: BigQuery Setup</h3>
                <p className="text-orange-800 text-sm">
                  For ML training, you need to configure Google Cloud credentials. 
                  This is optional and can be done later.
                </p>
              </div>
            </div>
          </div>

          {/* What Works */}
          <div className="mb-6">
            <h3 className="text-slate-900 mb-3">✅ What's Working Now:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">PHQ-9 mental health assessments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">AI-powered face scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">Results & severity analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">Counselor recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-slate-700">Data encryption & security</span>
              </div>
            </div>
          </div>

          {/* BigQuery Info */}
          <div className="mb-6">
            <h3 className="text-slate-900 mb-3">⚙️ BigQuery Configuration:</h3>
            <p className="text-slate-600 text-sm mb-3">
              Currently, the GOOGLE_CLOUD_CREDENTIALS variable contains a hash instead of JSON. 
              To enable ML training features:
            </p>
            <ol className="space-y-2 text-sm text-slate-700">
              <li>1. Download service account JSON from Google Cloud</li>
              <li>2. Go to Supabase → Settings → Edge Functions → Secrets</li>
              <li>3. Delete existing GOOGLE_CLOUD_CREDENTIALS</li>
              <li>4. Create new secret with raw JSON content</li>
              <li>5. Redeploy the server function</li>
            </ol>
            <Button
              variant="link"
              className="p-0 h-auto text-cyan-600 text-sm mt-2"
              onClick={() => window.open('/CREDENTIALS_FIX_GUIDE.md', '_blank')}
            >
              View detailed guide <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={onContinue}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Start Using MindLens
            </Button>
            <p className="text-xs text-center text-slate-600">
              You can configure BigQuery later from the admin menu
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
