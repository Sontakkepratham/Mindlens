import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface ConsentScreenProps {
  onContinue: () => void;
}

export function ConsentScreen({ onContinue }: ConsentScreenProps) {
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <div className="flex flex-col min-h-[80vh] px-6 py-8">
      <div className="mb-6">
        <h2 className="text-slate-900 mb-2">Informed Consent</h2>
      </div>

      <Card className="border-slate-200 bg-white mb-8 flex-1">
        <div className="p-6">
          <p className="text-slate-700 leading-relaxed mb-6">
            Enable Face Analysis and PHQ-9 screening. Your data is stored securely on Google Cloud.
          </p>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <Label htmlFor="consent-toggle" className="text-slate-900 cursor-pointer">
              I Provide Consent
            </Label>
            <Switch
              id="consent-toggle"
              checked={consentGiven}
              onCheckedChange={setConsentGiven}
            />
          </div>
        </div>
      </Card>

      <Button
        onClick={onContinue}
        disabled={!consentGiven}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
      >
        Continue
      </Button>
    </div>
  );
}
